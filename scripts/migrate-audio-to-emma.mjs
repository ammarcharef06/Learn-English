#!/usr/bin/env node
/**
 * Bulk migration of ordinary text audio to the user-selected Microsoft Edge
 * voice. Phoneme-only clips are intentionally excluded: reading "sh" or IPA
 * text aloud does not create a valid isolated phoneme recording.
 *
 * Install: python -m pip install edge-tts
 * Preview: npm run audio:emma:migrate
 * Generate/replace: npm run audio:emma:migrate -- --write --force
 * Limit: npm run audio:emma:migrate -- --write --force --limit=20
 */
import { spawnSync } from "node:child_process";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { AUDIO_MAP } from "../assets/js/data/zero-audio-map.js";
import manifest from "../curriculum/literacy/audio-manifest.json" with { type: "json" };

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO_ROOT = resolve(ROOT, "assets/audio/zero");
const VOICE = "en-US-EmmaNeural";

function fail(message) {
  console.error(message);
  process.exitCode = 1;
  throw new Error(message);
}

function collectJobs() {
  const jobs = new Map();
  for (const [spokenText, relativeUrl] of Object.entries(AUDIO_MAP)) {
    const relativePath = relativeUrl.replace(/^\.\//, "");
    jobs.set(relativePath, spokenText);
  }
  for (const letter of manifest.letters || []) {
    if (letter.nameAudio) jobs.set(letter.nameAudio, letter.upper || letter.lower);
    // Example-word files are already represented in the general audio map
    // when available. Never infer a missing word from the letter itself.
  }
  for (const group of manifest.phonemeGroups || []) {
    if (group.exampleAudio && group.exampleWord) {
      jobs.set(group.exampleAudio, group.exampleWord);
    }
  }
  return [...jobs.entries()].map(([relativePath, spokenText]) => {
    const output = resolve(ROOT, relativePath);
    const rel = relative(AUDIO_ROOT, output);
    if (!relativePath.startsWith("assets/audio/zero/") ||
        !rel || rel === ".." || rel.startsWith(".." + sep) ||
        isAbsolute(rel) || extname(output).toLowerCase() !== ".mp3") {
      fail("Unsafe or unsupported audio output path: " + relativePath);
    }
    if (!spokenText || !spokenText.trim() || spokenText.length > 500) {
      fail("Invalid spoken text for " + relativePath);
    }
    return { relativePath, output, spokenText };
  });
}

async function generate(job, force) {
  await mkdir(dirname(job.output), { recursive: true });
  const temp = job.output + ".emma-tmp.mp3";
  if (!force) {
    try {
      await stat(job.output);
      return { path: job.relativePath, status: "skipped-existing" };
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  await rm(temp, { force: true });
  const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
  const result = spawnSync(python, [
    "-m", "edge_tts", "--voice", VOICE, "--text", job.spokenText,
    "--write-media", temp
  ], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.error || result.status !== 0) {
    await rm(temp, { force: true });
    throw new Error(result.error?.message || result.stderr || result.stdout || "edge-tts failed");
  }
  const generated = await stat(temp);
  if (generated.size < 1024) {
    await rm(temp, { force: true });
    throw new Error("Generated MP3 is unexpectedly small: " + job.relativePath);
  }
  await rename(temp, job.output);
  return { path: job.relativePath, status: "generated", bytes: generated.size };
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const force = args.includes("--force");
  const limitArg = args.find(arg => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice(8)) : Infinity;
  if (args.includes("--help")) {
    console.log("Preview by default. Use --write to generate; --force to replace; --limit=N to cap jobs.");
    return;
  }
  if (!Number.isInteger(limit) && limit !== Infinity || limit < 1) fail("--limit must be a positive integer");
  const jobs = collectJobs().slice(0, limit);
  console.log(JSON.stringify({
    voice: VOICE, mode: write ? "write" : "dry-run",
    totalJobs: jobs.length, phonemeOnlyAssetsExcluded: true,
    firstJobs: jobs.slice(0, 8).map(({ relativePath, spokenText }) => ({ relativePath, spokenText }))
  }, null, 2));
  if (!write) {
    console.log("Preview only. Add --write to generate MP3 files.");
    return;
  }
  let generated = 0, skipped = 0;
  for (const job of jobs) {
    const result = await generate(job, force);
    if (result.status === "generated") generated++;
    else skipped++;
    console.log(JSON.stringify(result));
  }
  console.log(JSON.stringify({ voice: VOICE, generated, skipped, total: jobs.length }));
  console.log("Listen to the generated files before marking the migration complete.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
