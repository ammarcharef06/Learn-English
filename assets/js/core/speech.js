/* النطق الصوتي عبر Speech Synthesis */
import { settings } from './store.js';

let voices = [];
let ready = false;
let voicesChangedBound = false;

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function loadVoices() {
  if (!isSpeechSupported()) return [];
  voices = window.speechSynthesis.getVoices() || [];
  if (voices.length) ready = true;
  return voices;
}

export function initSpeech() {
  if (!isSpeechSupported()) return;
  loadVoices();
  if (!voicesChangedBound) {
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    voicesChangedBound = true;
  }
}

export function getVoices() { return ready ? voices : loadVoices(); }

export function englishVoices() {
  const all = getVoices();
  const en = all.filter((v) => /^en(-|_|$)/i.test(v.lang) || /english/i.test(v.name));
  return en.length ? en : all;
}

function bestVoice() {
  const all = englishVoices();
  if (!all.length) return null;
  const wanted = settings?.tts?.voice;
  if (wanted) {
    const found = all.find((v) => v.name === wanted || v.voiceURI === wanted);
    if (found) return found;
  }
  const prefer = ['Google US English', 'Microsoft Aria', 'Microsoft Zira', 'Samantha', 'Google UK English Female'];
  for (const p of prefer) {
    const f = all.find((v) => v.name.includes(p));
    if (f) return f;
  }
  const us = all.find((v) => /en-US/i.test(v.lang));
  return us || all[0];
}

/* النطق الآلي عبر Speech Synthesis */
/* ---------- أصوات مسجّلة اختيارية ----------
   تُستخدم للتسجيلات التعليمية المحددة؛ وما عداها يُنطق بالمحرّك المدمج. */
const soundBank = new Map();
let audioEl = null;
let playbackSequence = 0;
let activePlayback = null;

function finishPlayback(id) {
  if (!activePlayback || activePlayback.id !== id) return;
  const { onend } = activePlayback;
  activePlayback = null;
  try { onend?.(); } catch { /* تجاهل */ }
}

function startPlayback(opts = {}) {
  const id = ++playbackSequence;
  activePlayback = { id, onend: opts.onend };
  return id;
}

function playRecorded(src, opts, label) {
  try {
    audioEl = audioEl || new Audio();
    audioEl.preload = 'auto';
    audioEl.setAttribute?.('playsinline', '');
    const id = startPlayback(opts);
    audioEl.onplay = () => {
      if (activePlayback?.id !== id) return;
      try { opts?.onstart?.(); } catch { /* Ignore presentation callback failures. */ }
    };
    audioEl.onended = () => finishPlayback(id);
    audioEl.onerror = () => {
      if (activePlayback?.id !== id) return;
      console.warn(`${label} failed to load`, src, audioEl.error || '');
      finishPlayback(id);
    };
    audioEl.src = src;
    audioEl.currentTime = 0;
    const promise = audioEl.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch((error) => {
        if (activePlayback?.id !== id) return;
        console.warn(`${label} could not be played`, src, error);
        finishPlayback(id);
      });
    }
    return true;
  } catch (error) {
    console.warn(`${label} could not be started`, src, error);
    return false;
  }
}

export function registerSoundBank(map = {}) {
  for (const [k, v] of Object.entries(map)) {
    const key = String(k || '').trim().toLowerCase();
    if (key && v) soundBank.set(key, v);
  }
  return soundBank.size;
}
export function hasRecordedSound(text) {
  return soundBank.has(String(text || '').trim().toLowerCase());
}

export function normalizeAudioUrl(source) {
  if (!source || typeof source !== 'string' || typeof location === 'undefined') return '';
  try {
    const currentUrl = new URL(location.href);
    const url = new URL(source, document?.baseURI || currentUrl.href);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== currentUrl.origin) return '';
    return url.href;
  } catch {
    return '';
  }
}

export function speak(text, opts = {}) {
  stopSpeaking();
  if (opts.audioUrl) {
    const src = normalizeAudioUrl(opts.audioUrl);
    if (!src) {
      console.warn('Pronunciation audio URL must be a valid same-origin HTTP(S) URL', opts.audioUrl);
      return false;
    }
    return playRecorded(src, opts, 'Pronunciation audio');
  }
  const src = soundBank.get(String(text || '').trim().toLowerCase());
  if (src) return playRecorded(src, opts, 'Recorded pronunciation');
  // Strict recorded mode prevents a device/browser voice from silently replacing the approved voice bank.
  if (opts.recordedOnly) return false;
  return speakBuiltIn(text, opts);
}

/* النطق المدمج في المتصفح */
export function speakBuiltIn(text, opts = {}) {
  if (!isSpeechSupported() || !text) return false;
  stopSpeaking();
  const id = startPlayback(opts);
  const u = new SpeechSynthesisUtterance(String(text));
  const v = bestVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = settings?.tts?.lang || 'en-US'; }
  u.rate = opts.rate != null ? opts.rate : (settings?.tts?.rate || 0.92);
  u.pitch = opts.pitch != null ? opts.pitch : (settings?.tts?.pitch || 1);
  u.volume = 1;
  u.onstart = () => {
    if (activePlayback?.id !== id) return;
    try { opts?.onstart?.(); } catch { /* تجاهل */ }
  };
  u.onend = () => finishPlayback(id);
  u.onerror = () => finishPlayback(id);
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking() {
  if (audioEl) {
    try { audioEl.pause(); audioEl.currentTime = 0; } catch { /* Ignore media reset failures. */ }
  }
  if (isSpeechSupported()) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
  if (activePlayback) finishPlayback(activePlayback.id);
}

/* نغمات قصيرة للتصحيح */
let audioCtx = null;
export function beep(kind = 'ok') {
  if (!settings?.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const notes = kind === 'ok' ? [660, 880] : kind === 'bad' ? [300, 200] : [520];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.09, now + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.16);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(now + i * 0.12); o.stop(now + i * 0.12 + 0.18);
    });
  } catch {}
}

export function cheer() { beep('ok'); }
