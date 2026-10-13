/* النطق الصوتي عبر Speech Synthesis */
import { settings } from './store.js';

let voices = [];
let ready = false;

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
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
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

export function speak(text, opts = {}) {
  if (!isSpeechSupported() || !text) return false;
  try { window.speechSynthesis.cancel(); } catch {}
  const u = new SpeechSynthesisUtterance(String(text));
  const v = bestVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = settings?.tts?.lang || 'en-US'; }
  u.rate = opts.rate != null ? opts.rate : (settings?.tts?.rate || 0.92);
  u.pitch = opts.pitch != null ? opts.pitch : (settings?.tts?.pitch || 1);
  u.volume = 1;
  if (opts.onend) u.onend = opts.onend;
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking() {
  if (!isSpeechSupported()) return;
  try { window.speechSynthesis.cancel(); } catch {}
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
