/* ============================================================
   حزمة أصوات المرحلتين ١ و ٢ — صوت نيرالي واحد موحّد (en-US, Aria)
   • n/name-*.mp3  اسم كل حرف (٢٦)
   • n/word-*.mp3  كلمة مثال كل حرف + كل حرف مركّب (٣٨)
   • d/*.mp3       صوت كل حرف مركّب (١٢) — نطق مقطع واحد بلا تهجئة
   المجموع ٧٦ ملفاً ≈٨٤٠ كيلوبايت · MP3 يعمل على كل الأجهزة.
   ولمنع أي صمت: إن تعذّر الملف يرجع النطق إلى محرّك المتصفح المدمج.
   ============================================================ */
import { registerSoundBank } from './speech.js';
import { AUDIO_MAP } from '../data/zero-audio-map.js';

const N = './assets/audio/zero/n/';
const D = './assets/audio/zero/d/';

/** أسماء الحروف الستة والعشرين */
export const LETTER_IDS = 'abcdefghijklmnopqrstuvwxyz'.split('');

/** الحروف المركّبة الاثنا عشر (لها صوت مفرد مسجّل) */
export const DIGRAPH_SOUND_IDS = [
  'sh', 'ch', 'th-voiceless', 'th-voiced', 'ph', 'ck', 'ng',
  'oo-long', 'oo-short', 'ee', 'ea', 'ou',
];

/** كلمات أمثلة الحروف المركّبة (بنفس ترتيب بيانات المرحلة) */
export const DIGRAPH_WORDS = {
  sh: 'ship', ch: 'chair', 'th-voiceless': 'three', 'th-voiced': 'this', ph: 'phone',
  ck: 'duck', ng: 'king', 'oo-long': 'spoon', 'oo-short': 'book', ee: 'bee', ea: 'sea', ou: 'mouse',
};

/** كلمات أمثلة الحروف (مطابقة لبيانات الدروس) */
export const LETTER_WORDS = {
  a: 'apple', b: 'ball', c: 'cat', d: 'dog', e: 'egg', f: 'fish', g: 'goat', h: 'hat', i: 'ice',
  j: 'juice', k: 'key', l: 'lion', m: 'moon', n: 'nose', o: 'orange', p: 'pen', q: 'queen',
  r: 'rabbit', s: 'sun', t: 'tree', u: 'umbrella', v: 'van', w: 'water', x: 'xylophone',
  y: 'yogurt', z: 'zebra',
};

/* المتشابهة كتابةً (th مرتان · oo مرتان) لها مفتاح نصّ صريح */
const DIGRAPH_BY_TEXT = {
  sh: 'sh', ch: 'ch', th: 'th-voiceless', ph: 'ph', ck: 'ck',
  ng: 'ng', oo: 'oo-long', ee: 'ee', ea: 'ea', ou: 'ou',
};

/** كل مفاتيح الحزمة (٧٦ ملفاً) */
export function soundPack() {
  const names = LETTER_IDS.map((c) => `name:letter:${c}`);
  const sounds = DIGRAPH_SOUND_IDS.map((id) => `sound:${id}`);
  const words = [
    ...LETTER_IDS.map((c) => `word:letter:${c}`),
    ...DIGRAPH_SOUND_IDS.map((id) => `word:${id}`),
  ];
  return { names, sounds, words, all: [...names, ...sounds, ...words] };
}

/** المصدر الحقيقي لكل معرّف (تُستخدم في الفحوصات أيضاً) */
export function resolveSound(key) {
  const k = String(key || '').trim();
  if (k.startsWith('name:letter:')) return `${N}name-${k.slice(12)}.mp3`;
  if (k.startsWith('word:letter:')) return `${N}word-${k.slice(12)}.mp3`;
  if (k.startsWith('sound:')) return `${D}${k.slice(6)}.mp3`;
  if (k.startsWith('word:')) return `${N}word-${k.slice(5)}.mp3`;
  return null;
}

/** يسجّل الحزمة في محرّك النطق. يُرجع عدد المفاتيح. */
export function registerZeroSounds() {
  const bank = {};
  for (const k of soundPack().all) bank[k] = resolveSound(k);
  /* مفاتيح نصّ مباشرة: أي نطق لنفس النص يستخدم التسجيل تلقائياً */
  for (const c of LETTER_IDS) bank[c] = `${N}name-${c}.mp3`;
  for (const [c, w] of Object.entries(LETTER_WORDS)) bank[w] = `${N}word-${c}.mp3`;
  for (const [text, id] of Object.entries(DIGRAPH_BY_TEXT)) bank[text] = `${D}${id}.mp3`;
  for (const [id, w] of Object.entries(DIGRAPH_WORDS)) bank[w] = `${N}word-${id}.mp3`;
  /* خريطة نصوص المراحل ٣-٨ (مولّدة آلياً): أي نص إنجليزي له تسجيل */
  for (const [text, src] of Object.entries(AUDIO_MAP)) bank[text] = src;
  registerSoundBank(bank);
  return Object.keys(bank).length;
}

/** اسم الملف لكل نوع (للفحوصات) */
export function packFiles() {
  return soundPack().all.map((k) => resolveSound(k).replace(/^\.\//, ''));
}
