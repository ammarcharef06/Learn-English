/* ============================================================
   أصوات قسم «من الصفر» (A0)
   الحروف المركّبة (sh · ch · th · ph · ck · ng · oo · ee · ea · ou)
   لا ينطقها محرّك النطق في الجهاز كنطق واحد — بل يتهجّأها حرفاً حرفاً،
   لذلك نُولّدها كأصوات مسجّلة (مقطع واحد) ونشغّلها بدل النطق الآلي.
   ملفات الأصوات: assets/audio/zero/*.wav
   ============================================================ */
import { registerSoundBank } from './speech.js';

const DIR = './assets/audio/zero/';

/** معرّف كل مقطع صوتي (يطابق ids في data/zero-letters.js) */
export const SOUND_IDS = [
  'sh', 'ch', 'th-voiceless', 'th-voiced', 'ph', 'ck', 'ng',
  'oo-long', 'oo-short', 'ee', 'ea', 'ou',
];

/* مفاتيح النصّ المباشرة: تُستخدم تلقائياً عند نطق هذا النص في أي مكان */
const BY_TEXT = {
  sh: 'sh', ch: 'ch', th: 'th-voiceless', ph: 'ph',
  ck: 'ck', ng: 'ng', oo: 'oo-long', ee: 'ee', ea: 'ea', ou: 'ou',
};

/** يبني بنك الأصوات ويسجّله في محرّك النطق */
export function registerZeroSounds() {
  const bank = {};
  for (const id of SOUND_IDS) {
    bank[`sound:${id}`] = `${DIR}${id}.wav`;
  }
  for (const [text, id] of Object.entries(BY_TEXT)) {
    bank[text] = `${DIR}${id}.wav`;
  }
  registerSoundBank(bank);
  return Object.keys(bank).length;
}

/** رابط ملف صوت مقطع مركّب (أو null) */
export function soundSrc(id) {
  return SOUND_IDS.includes(id) ? `${DIR}${id}.wav` : null;
}
