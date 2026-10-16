/* ============================================================
   حزمة أصوات قسم «من الصفر» (A0) — المرحلتان ١ و ٢
   ١٠٢ ملفاً بصوت إنجليزي عالمي موحّد على كل الأجهزة:
     • g/name-*.mp3  اسم الحرف (Google TTS · نطق عالمي حديث)
     • g/word-*.mp3  كلمة المثال (Google TTS)
     • s/*.wav       الصوت المفرد بدقّة (SSML phoneme) — ما لا يستطيعه
                     محرّك الجهاز (يتهجّأ الحروف المركّبة)
   لماذا ملفات مسجّلة؟ لأن نطق الجهاز يتفاوت ويتغيّر، ويتهجّأ sh/ch/th.
   ============================================================ */
import { registerSoundBank } from './speech.js';

const G = './assets/audio/zero/g/';
const S = './assets/audio/zero/s/';

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
  ck: 'duck', ng: 'sing', 'oo-long': 'spoon', 'oo-short': 'book', ee: 'see', ea: 'tea', ou: 'house',
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
  if (k.startsWith('name:letter:')) return G + 'name-' + k.slice(12) + '.mp3';
  if (k.startsWith('sound:letter:')) return S + 'letter-' + k.slice(13) + '.wav';
  if (k.startsWith('word:letter:')) return G + 'word-' + k.slice(12) + '.mp3';
  if (k.startsWith('sound:')) return S + 'dig-' + k.slice(6) + '.wav';
  if (k.startsWith('word:')) return G + 'word-' + k.slice(5) + '.mp3';
  return null;
}

/** يبني بنك الأصوات ويسجّله في محرّك النطق. يُرجع عدد المفاتيح. */
export function registerZeroSounds() {
  const bank = {};
  /* مفاتيح صريحة (تطابق sayId/nameId/wordId في data/zero.js) */
  for (const k of soundPack().all) bank[k] = resolveSound(k);
  /* مفاتيح النص المباشرة: أي نطق لنفس النص يستخدم التسجيل تلقائياً */
  for (const ch of LETTER_IDS) bank[ch] = G + 'name-' + ch + '.mp3';       // نطق «A» = اسم الحرف
  for (const [text, id] of Object.entries(DIGRAPH_BY_TEXT)) bank[text] = S + 'dig-' + id + '.wav';
  for (const [id, word] of Object.entries(DIGRAPH_WORDS)) bank[word] = G + 'word-' + id + '.mp3';
  registerSoundBank(bank);
  return Object.keys(bank).length;
}
