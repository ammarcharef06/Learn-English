/* ============================================================
   أصوات الحروف المركّبة الـ١٢ فقط (المرحلة ٢)
   السبب: محرّك النطق المدمج في بعض الأجهزة يتهجّأ «sh · ch · th»
   حرفاً حرفاً بدل نطقها مقطعاً واحداً.
   الحل: ١٢ تسجيلاً بشرياً صغيراً (٣٣٢ كيلوبايت) لهذه الأصوات فقط،
   وكل ما عداها (الحروف وأسماؤها وكلمات الأمثلة) يبقى على النطق المدمج.
   المصدر: تسجيلات نطق بشرية من ويكيميديا كومنز (ملكية عامة/CC).
   ============================================================ */
import { registerSoundBank } from './speech.js';

const DIR = './assets/audio/zero/d/';

/** معرّفات الحروف المركّبة التي لها تسجيل */
export const DIGRAPH_SOUND_IDS = [
  'sh', 'ch', 'th-voiceless', 'th-voiced', 'ph', 'ck', 'ng',
  'oo-long', 'oo-short', 'ee', 'ea', 'ou',
];

/* المتشابهة كتابةً (th مرتان · oo مرتان) لها مفتاح نصّ صريح */
const BY_TEXT = {
  sh: 'sh', ch: 'ch', th: 'th-voiceless', ph: 'ph', ck: 'ck',
  ng: 'ng', oo: 'oo-long', ee: 'ee', ea: 'ea', ou: 'ou',
};

/** رابط ملف صوت الحرف المركّب (أو null) */
export function digraphSound(id) {
  return DIGRAPH_SOUND_IDS.includes(id) ? `${DIR}${id}.wav` : null;
}

/** يسجّل الأصوات الاثني عشر في محرّك النطق. يُرجع عدد المفاتيح. */
export function registerDigraphSounds() {
  const bank = {};
  for (const id of DIGRAPH_SOUND_IDS) bank[`sound:${id}`] = `${DIR}${id}.wav`;
  for (const [text, id] of Object.entries(BY_TEXT)) bank[text] = `${DIR}${id}.wav`;
  registerSoundBank(bank);
  return Object.keys(bank).length;
}