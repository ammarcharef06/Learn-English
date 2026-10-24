#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = join(ROOT, 'assets', 'audio', 'curriculum');
const MAP_FILE = join(ROOT, 'assets', 'js', 'data', 'curriculum-audio.js');
const REQUEST_DELAY_MS = 1500;
const MAX_ITEMS_PER_RUN = 20;
const MAX_TEXT_LENGTH = 200;
const ROUGH_BYTES_PER_CLIP = 32 * 1024;

function parseArgs(args) {
  const options = { execute: false, maxItems: MAX_ITEMS_PER_RUN, all: false };
  for (const arg of args) {
    if (arg === '--execute') options.execute = true;
    else if (arg === '--all') options.all = true;
    else if (arg.startsWith('--max-items=')) {
      options.maxItems = Number(arg.slice('--max-items='.length));
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/generate-audio.mjs [--execute] [--all] [--max-items=${MAX_ITEMS_PER_RUN}]

Preview is the default and performs no network requests or writes.
--execute       Download from Google Translate TTS.
--all           Process all missing phrases in one resumable run (requires --execute).
--max-items=N   Set the request limit for this run (1-100).
`);
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (!Number.isInteger(options.maxItems) || options.maxItems < 1 || options.maxItems > 100) {
    throw new Error('--max-items must be an integer from 1 to 100.');
  }
  if (options.all && !options.execute) throw new Error('--all requires --execute.');
  return options;
}

function normalizeText(text) {
  return String(text || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

async function loadCurriculum() {
  const memory = new Map();
  globalThis.localStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
    clear: () => memory.clear(),
  };
  globalThis.document = {
    documentElement: { dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} } },
    body: { classList: { add() {}, remove() {}, toggle() {} }, dataset: {} },
    addEventListener() {},
    removeEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} } }),
  };
  globalThis.window = {
    localStorage: globalThis.localStorage,
    location: { href: 'https://example.com/Learn-English/index.html#/', pathname: '/Learn-English/index.html' },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.location = globalThis.window.location;
  globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };

  return import(pathToFileURL(join(ROOT, 'assets', 'js', 'data', 'curriculum.js')).href);
}

async function readAudioMap() {
  const { CURRICULUM_AUDIO } = await import(pathToFileURL(MAP_FILE).href);
  if (!CURRICULUM_AUDIO || typeof CURRICULUM_AUDIO !== 'object' || Array.isArray(CURRICULUM_AUDIO)) {
    throw new Error(`Generated audio map must export an object: ${MAP_FILE}`);
  }
  return { ...CURRICULUM_AUDIO };
}

function getPendingItems(units, audioMap) {
  const existing = new Set();
  const pending = new Map();
  for (const unit of units) {
    for (const item of [...unit.vocabulary, ...unit.sentences]) {
      const text = String(item.en || '').trim().replace(/\s+/g, ' ');
      const key = normalizeText(text);
      if (!key || item.audio_url) {
        if (key) existing.add(key);
        continue;
      }
      if (!audioMap[key] && !existing.has(key)) pending.set(key, text);
    }
  }
  for (const key of existing) pending.delete(key);
  return [...pending].map(([key, text]) => ({ key, text }))
    .filter(({ text }) => [...text].length <= MAX_TEXT_LENGTH);
}

function filenameFor(text) {
  return `${createHash('sha256').update(`en-US\0${text}`).digest('hex')}.mp3`;
}

function wait(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function requestAudio(text) {
  const url = new URL('https://translate.google.com/translate_tts');
  url.search = new URLSearchParams({
    ie: 'UTF-8',
    client: 'tw-ob',
    tl: 'en-US',
    q: text,
  }).toString();
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 Learn-English-audio-generator' },
    signal: AbortSignal.timeout(20000),
  });
  if (response.status === 429 || response.status === 403) {
    throw new Error(`TTS provider returned HTTP ${response.status}; stopping to avoid further requests.`);
  }
  if (!response.ok) throw new Error(`TTS provider returned HTTP ${response.status}.`);
  const contentType = response.headers.get('content-type') || '';
  const audio = Buffer.from(await response.arrayBuffer());
  const isMp3 = audio.length >= 100
    && (audio.subarray(0, 3).toString() === 'ID3' || (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0));
  if (!contentType.includes('audio/mpeg') || !isMp3) {
    throw new Error('TTS response was not a valid MP3 audio/mpeg payload.');
  }
  return audio;
}

async function writeAudioFile(filename, bytes) {
  await mkdir(AUDIO_DIR, { recursive: true });
  const target = join(AUDIO_DIR, filename);
  try {
    await stat(target);
    return false;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, bytes, { flag: 'wx' });
  await rename(temporary, target);
  return true;
}

async function audioFileExists(filename) {
  try {
    await stat(join(AUDIO_DIR, filename));
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function writeAudioMap(audioMap) {
  const serialized = `export const CURRICULUM_AUDIO = ${JSON.stringify(audioMap, null, 2)};

export function attachCurriculumAudio(units, audioMap = CURRICULUM_AUDIO) {
  for (const unit of units) {
    for (const item of [...unit.vocabulary, ...unit.sentences]) {
      const key = String(item.en || '').trim().replace(/\\s+/g, ' ').toLowerCase();
      if (!item.audio_url && audioMap[key]) item.audio_url = audioMap[key];
    }
  }
  return units;
}
`;
  const temporary = `${MAP_FILE}.${process.pid}.tmp`;
  await writeFile(temporary, serialized, 'utf8');
  await rename(temporary, MAP_FILE);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { ALL_UNITS } = await loadCurriculum();
  const audioMap = await readAudioMap();
  const allPending = getPendingItems(ALL_UNITS, audioMap);
  const batch = options.all ? allPending : allPending.slice(0, options.maxItems);
  const skippedLong = ALL_UNITS.flatMap((unit) => [...unit.vocabulary, ...unit.sentences])
    .filter((item) => !item.audio_url && [...String(item.en || '')].length > MAX_TEXT_LENGTH).length;

  console.log(`Active curriculum: ${ALL_UNITS.length} units (A1-C2); A0 uses its existing dedicated recordings.`);
  console.log(`Unique phrases needing audio: ${allPending.length}. This batch: ${batch.length}.`);
  console.log(`Approximate batch storage: ${(batch.length * ROUGH_BYTES_PER_CLIP / 1024).toFixed(0)} KiB (rough estimate).`);
  if (skippedLong) console.log(`Skipped ${skippedLong} items exceeding ${MAX_TEXT_LENGTH} characters.`);
  if (!options.execute) {
    console.log('Preview only: no network requests and no files written. Review this plan before using --execute.');
    return;
  }
  if (!batch.length) {
    console.log('No missing phrases within this batch.');
    return;
  }

  let completed = 0;
  let requestsMade = 0;
  for (const { key, text } of batch) {
    const filename = filenameFor(text);
    let created = false;
    if (!(await audioFileExists(filename))) {
      if (requestsMade) await wait(REQUEST_DELAY_MS);
      const bytes = await requestAudio(text);
      created = await writeAudioFile(filename, bytes);
      requestsMade++;
    }
    audioMap[key] = `./assets/audio/curriculum/${filename}`;
    await writeAudioMap(audioMap);
    completed++;
    console.log(`[${completed}/${batch.length}] ${created ? 'saved' : 'reused'} ${text}`);
  }
  console.log(`Saved ${completed} audio URLs in ${MAP_FILE}. Remaining phrases: ${allPending.length - completed}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`Audio generation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
