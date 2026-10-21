/* قفل اختياري محلي؛ كلمة المرور لا تُرسل إلى خادم. */

const ITER = 12000;                 // تكرار التجزئة لتقليل جدوى التخمين

/* ---------- SHA-256 (WebCrypto مع بديل JS خالص) ---------- */
const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function sha256HexSync(message) {
  const utf8 = new TextEncoder().encode(message);
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const len = utf8.length;
  const withOne = len + 1;
  const total = Math.ceil((withOne + 8) / 64) * 64;
  const msg = new Uint8Array(total);
  msg.set(utf8);
  msg[len] = 0x80;
  const bitLen = len * 8;
  const dv = new DataView(msg.buffer);
  dv.setUint32(total - 4, bitLen >>> 0, false);
  dv.setUint32(total - 8, Math.floor(bitLen / 4294967296), false);

  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));

  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  return H.map((x) => x.toString(16).padStart(8, '0')).join('');
}

const enc = new TextEncoder();
export function sha256Hex(text) {
  if (globalThis.crypto && globalThis.crypto.subtle) {
    return crypto.subtle.digest('SHA-256', enc.encode(text))
      .then((buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''))
      .catch(() => sha256HexSync(text));
  }
  return Promise.resolve(sha256HexSync(text));
}

export async function hashPassword(password, salt = '') {
  let out = `${salt}::${password}::learn-english-academy`;
  for (let i = 0; i < ITER; i++) out = await sha256Hex(out);
  return `v2$${salt}$${out}`;
}

/* ---------- حالة المصادقة ---------- */
import { readAuth, writeAuth, readSession, writeSession, settings, saveSettings } from './store.js';

export function hasPassword() {
  const a = readAuth();
  return !!a?.hash && !a.isDefault;
}

export function lockEnabled() {
  return !!settings?.security?.lockEnabled;
}

async function verify(password) {
  const a = readAuth();
  if (!a?.hash || a.isDefault) return false;
  if (a.algo === 'v2') {
    const h = await hashPassword(password, a.salt || '');
    return h === a.hash;
  }
  const h = await sha256Hex(password);
  return h === a.hash;
}

/* حماية من التخمين */
function attempts() {
  try { return JSON.parse(localStorage.getItem('lea.attempts.v1') || '{"n":0,"until":0}'); }
  catch { return { n: 0, until: 0 }; }
}
function setAttempts(v) { try { localStorage.setItem('lea.attempts.v1', JSON.stringify(v)); } catch {} }

export function lockRemainingMs() {
  const a = attempts();
  return Math.max(0, (a.until || 0) - Date.now());
}

export async function login(password, remember = true) {
  if (!hasPassword()) return { ok: false, error: 'أنشئ كلمة مرور من الإعدادات أولاً.' };
  const wait = lockRemainingMs();
  if (wait > 0) return { ok: false, error: `محاولات كثيرة. انتظر ${Math.ceil(wait / 1000)} ثانية.` };
  const ok = await verify(password);
  if (!ok) {
    const a = attempts();
    a.n = (a.n || 0) + 1;
    if (a.n >= 5) { a.until = Date.now() + Math.min(300000, 15000 * (a.n - 4)); a.n = 0; }
    setAttempts(a);
    return { ok: false, error: 'كلمة المرور غير صحيحة.' };
  }
  setAttempts({ n: 0, until: 0 });
  const days = remember ? (settings?.session?.rememberDays || 30) : 1 / 24; // ساعة واحدة
  writeSession({ at: Date.now(), exp: Date.now() + days * 86400000 });
  return { ok: true };
}

export function isAuthed() {
  if (!lockEnabled()) return true;
  const s = readSession();
  if (!s || !s.exp) return false;
  if (Date.now() > s.exp) { writeSession(null); return false; }
  return true;
}

export function lockNow() { writeSession(null); }

export function extendSession() {
  if (!lockEnabled()) return;
  const s = readSession();
  if (!s) return;
  const days = settings?.session?.rememberDays || 30;
  writeSession({ at: Date.now(), exp: Date.now() + days * 86400000 });
}

export async function setPassword(next, current = '') {
  if (String(next || '').length < 4) return { ok: false, error: 'كلمة المرور الجديدة قصيرة جداً (4 أحرف على الأقل).' };
  if (lockEnabled() && hasPassword() && !(await verify(current))) {
    return { ok: false, error: 'كلمة المرور الحالية غير صحيحة.' };
  }
  const salt = Math.random().toString(36).slice(2, 10);
  const hash = await hashPassword(next, salt);
  writeAuth({ hash, algo: 'v2', salt, isDefault: false, createdAt: readAuth()?.createdAt || Date.now(), changedAt: Date.now() });
  return { ok: true };
}

export async function changePassword(current, next) {
  return setPassword(next, current);
}

export function setLockEnabled(enabled) {
  if (enabled && !hasPassword()) return { ok: false, error: 'أنشئ كلمة مرور خاصة بك قبل تفعيل القفل.' };
  saveSettings({ security: { lockEnabled: !!enabled } });
  if (enabled) {
    const days = settings?.session?.rememberDays || 30;
    writeSession({ at: Date.now(), exp: Date.now() + days * 86400000 });
  } else {
    lockNow();
  }
  return { ok: true };
}
