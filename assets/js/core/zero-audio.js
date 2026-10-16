/* ============================================================
   حزمة أصوات قسم «من الصفر» (A0)
   المرحلتان ١ و ٢: الحروف الستة والعشرون (أسماؤها) + الحروف المركّبة.
   السبب: محرّك النطق في الجهاز يتهجّأ الحروف المركّبة حرفاً حرفاً
   (sh → ess-aitch) ويتفاوت صوته بين الأجهزة، لذلك نُشغّل مقاطع
   صوتية مسجّلة بنطق إنجليزي موحّد على كل الأجهزة.
   الملفات: assets/audio/zero/<id>.wav  (16kHz · مقطع واحد)
   ============================================================ */
import { registerSoundBank } from './speech.js';

const DIR = './assets/audio/zero/';

/** أسماء الحروف الستة والعشرين */
export const LETTER_IDS = 'abcdefghijklmnopqrstuvwxyz'.split('');

/** أصوات الحروف المركّبة (تطابق ids في data/zero-letters.js) */
export const DIGRAPH_IDS = [
  'sh', 'ch', 'th-voiceless', 'th-voiced', 'ph', 'ck', 'ng',
  'oo-long', 'oo-short', 'ee', 'ea', 'ou',
];

/** كل معرّفات الحزمة */
export const SOUND_IDS = [...LETTER_IDS, ...DIGRAPH_IDS];

/* الحروف المركّبة المتشابهة في الكتابة (th مرتان · oo مرتان) لها مفتاح صريح */
const DIGRAPH_BY_TEXT = {
  sh: 'sh', ch: 'ch', th: 'th-voiceless', ph: 'ph',
  ck: 'ck', ng: 'ng', oo: 'oo-long', ee: 'ee', ea: 'ea', ou: 'ou',
};

/** يبني بنك الأصوات ويسجّله في محرّك النطق. يُرجع عدد المفاتيح. */
export function registerZeroSounds() {
  const bank = {};
  /* مفتاح صريح لكل مقطع — يطابق sayId في data/zero.js:
     الحروف: sound:letter:a   ·   المركّبة: sound:sh
     (ويميّز th المهموسة من المجهورة و oo الطويلة من القصيرة) */
  for (const ch of LETTER_IDS) bank[`sound:letter:${ch}`] = `${DIR}${ch}.wav`;
  for (const id of DIGRAPH_IDS) bank[`sound:${id}`] = `${DIR}${id}.wav`;
  /* مفاتيح النص المباشرة: تُستخدم تلقائياً عند نطق الحرف نفسه في أي مكان */
  for (const ch of LETTER_IDS) bank[ch] = `${DIR}${ch}.wav`;
  for (const [text, id] of Object.entries(DIGRAPH_BY_TEXT)) bank[text] = `${DIR}${id}.wav`;
  registerSoundBank(bank);
  return Object.keys(bank).length;
}

/** رابط ملف صوت (أو null) */
export function soundSrc(id) {
  return SOUND_IDS.includes(id) ? `${DIR}${id}.wav` : null;
}
