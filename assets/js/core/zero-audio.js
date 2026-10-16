/* ============================================================
   حزمة أصوات قسم «من الصفر» (A0) — المرحلتان ١ و ٢
   ١٠٢ ملفاً بصوت **بشري** حقيقي (تسجيلات بشرية من ويكيميديا كومنز):
     • h/name-*.wav   اسم الحرف   (تسجيل بشري)
     • h/word-*.wav   كلمة المثال (تسجيل بشري)
     • h/sound-*.wav  الصوت المفرد (تسجيلات نطق صوتي بشرية)
   لماذا ملفات؟ لأن نطق الجهاز يتفاوت بين الأجهزة ويتهجّأ الحروف المركّبة.
   المصدر: Wikimedia Commons (ملكية عامة/CC) — انظر README للتفاصيل.
   ============================================================ */
import { registerSoundBank } from './speech.js';

const H = './assets/audio/zero/h/';

/** أسماء الحروف الستة والعشرين */
export const LETTER_IDS = 'abcdefghijklmnopqrstuvwxyz'.split('');

/** أصوات الحروف المركّبة (تطابق ids في data/zero-letters.js) */
export const DIGRAPH_IDS = [
  'sh', 'ch', 'th-voiceless', 'th-voiced', 'ph', 'ck', 'ng',
  'oo-long', 'oo-short', 'ee', 'ea', 'ou',
];

/** كلمات أمثلة الحروف المركّبة (بنفس ترتيب بيانات المرحلة) */
const DIGRAPH_WORDS = {
  sh: 'ship', ch: 'chair', 'th-voiceless': 'three', 'th-voiced': 'this', ph: 'phone',
  ck: 'duck', ng: 'sing', 'oo-long': 'spoon', 'oo-short': 'book', ee: 'see', ea: 'tea', ou: 'mouse',
};

/* الحروف المركّبة المتشابهة كتابةً (th مرتان · oo مرتان) لها مفتاح صريح */
const DIGRAPH_BY_TEXT = {
  sh: 'sh', ch: 'ch', th: 'th-voiceless', ph: 'ph', ck: 'ck', ng: 'ng',
  oo: 'oo-long', ee: 'ee', ea: 'ea', ou: 'ou',
};

/** كل معرّفات الحزمة (٦٤ ملف Google + ٣٨ صوتاً) */
export function soundPack() {
  const names = LETTER_IDS.map((ch) => `name:letter:${ch}`);
  const sounds = [...LETTER_IDS.map((ch) => `sound:letter:${ch}`), ...DIGRAPH_IDS.map((id) => `sound:${id}`)];
  const words = [...LETTER_IDS.map((ch) => `word:letter:${ch}`), ...DIGRAPH_IDS.map((id) => `word:${id}`)];
  return { names, sounds, words, all: [...names, ...sounds, ...words] };
}

/** المصدر الحقيقي لكل معرّف (يُستخدم أيضاً في الفحوصات) */
export function resolveSound(key) {
  const k = String(key || '').trim();
  if (k.startsWith('name:letter:')) return H + 'name-' + k.slice(12) + '.wav';
  if (k.startsWith('sound:letter:')) return H + 'sound-' + k.slice(13) + '.wav';
  if (k.startsWith('word:letter:')) return H + 'word-' + k.slice(12) + '.wav';
  if (k.startsWith('sound:')) return H + 'sound-' + k.slice(6) + '.wav';
  if (k.startsWith('word:')) return H + 'word-' + k.slice(5) + '.wav';
  return null;
}

/** يبني بنك الأصوات ويسجّله في محرّك النطق. يُرجع عدد المفاتيح. */
export function registerZeroSounds() {
  const bank = {};
  /* مفاتيح صريحة (تطابق sayId/nameId/wordId في data/zero.js) */
  for (const k of soundPack().all) bank[k] = resolveSound(k);
  /* مفاتيح النص المباشرة: أي نطق لنفس النص يستخدم التسجيل تلقائياً */
  for (const ch of LETTER_IDS) bank[ch] = H + 'name-' + ch + '.wav';       // نطق «A» = اسم الحرف
  for (const [text, id] of Object.entries(DIGRAPH_BY_TEXT)) bank[text] = H + 'sound-' + id + '.wav';
  for (const [id, word] of Object.entries(DIGRAPH_WORDS)) bank[word] = H + 'word-' + id + '.wav';
  registerSoundBank(bank);
  return Object.keys(bank).length;
}
