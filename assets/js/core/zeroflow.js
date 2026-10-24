/* ============================================================
   قسم «من الصفر» (A0): حفظ التقدّم، الإتقان، الاختبار، الشهادة
   ============================================================
   كل الكتابة على localStorage تتم من هنا حتى يبقى شكل البيانات
   في مكان واحد: progress.zero
   ------------------------------------------------------------ */
import { progress, saveProgress, settings, saveSettings } from './store.js';
import { zeroStats, ZERO_STAGES, ZERO_TOTALS, LETTERS } from '../data/zero.js';
import { award, evaluateBadges, POINTS } from './gamify.js';

/* نقاط خاصة بقسم التأسيس */
export const ZERO_POINTS = {
  stage: 45,        // إتمام تدريب مرحلة
  letter: 3,        // إتقان حرف
  digraph: 4,       // إتقان حرف مركّب
  word: 3,          // إتقان كلمة
  sentence: 5,      // إتقان جملة
  reading: 30,      // إتمام قراءة
  pad: 6,           // كتابة على اللوح
  cert: 200,        // شهادة التأسيس
};

export function emptyZero() {
  return {
    stages: {},      // id → { seen, done, best, drills, at }
    letters: {},     // letterId → true
    digraphs: {},    // digraphId → true
    words: {},       // en → true
    sentences: {},   // en → true
    readings: {},    // id → { done, score }
    exam: { best: 0, last: 0, attempts: 0, at: '', total: 0 },
    cert: { earned: false, code: '', at: '', name: '' },
    padCount: 0,
    startedAt: '',
  };
}

/* ---------- كتابة آمنة على progress.zero ---------- */
function edit(fn) {
  saveProgress((p) => {
    if (!p.zero || typeof p.zero !== 'object') p.zero = emptyZero();
    const z = p.zero;
    const base = emptyZero();
    for (const k of Object.keys(base)) {
      if (z[k] === undefined || z[k] === null) z[k] = base[k];
      else if (typeof base[k] === 'object' && !Array.isArray(base[k]) && (typeof z[k] !== 'object' || Array.isArray(z[k]))) z[k] = base[k];
    }
    if (!z.cert || typeof z.cert !== 'object') z.cert = base.cert;
    if (!z.exam || typeof z.exam !== 'object') z.exam = base.exam;
    if (!z.startedAt) z.startedAt = new Date().toISOString();
    fn(z, p);
  });
}

/* ---------- إحصاءات جاهزة للواجهة ---------- */
export function zeroSnapshot() {
  const st = zeroStats(progress);
  const z = progress.zero || emptyZero();
  return {
    ...st,
    raw: z,
    letterList: LETTERS.map((l) => ({ ...l, done: !!z.letters?.[l.id] })),
    digraphList: [],
    wordGroups: [],
    stageList: ZERO_STAGES.map((s) => ({ ...s, state: z.stages?.[s.id] || {} })),
    readingList: [],
    totals: ZERO_TOTALS,
  };
}

/* ---------- المراحل ---------- */
export function markStageSeen(stageId) {
  edit((z) => {
    const prev = z.stages[stageId] || {};
    z.stages[stageId] = { ...prev, seen: true, at: prev.at || new Date().toISOString() };
  });
}

export function markStageDone(stageId, accuracy = 0) {
  let first = false;
  edit((z, p) => {
    const prev = z.stages[stageId] || {};
    first = !prev.done;
    z.stages[stageId] = {
      ...prev,
      seen: true,
      done: true,
      drills: (prev.drills || 0) + 1,
      best: Math.max(prev.best || 0, Math.round(accuracy)),
      at: new Date().toISOString(),
    };
    if (first) award(ZERO_POINTS.stage, p);
  });
  return evaluateBadges();
}

/**
 * يسجّل محاولة تدريب المرحلة **دائماً** (حتى لو كانت النتيجة أقل من ٨٠٪)،
 * ولا يعلّمها «مكتملة» إلا عند ٨٠٪ أو أكثر.
 * يُرجع { justCompleted, firstAttempt, badges }.
 */
export function recordStageDrill(stageId, accuracy = 0) {
  const acc = Math.max(0, Math.min(100, Math.round(accuracy)));
  let justCompleted = false;
  let firstAttempt = false;
  edit((z, p) => {
    const prev = z.stages[stageId] || {};
    firstAttempt = !(prev.drills || 0);
    justCompleted = acc >= 80 && !prev.done;
    const at = new Date().toISOString();
    z.stages[stageId] = {
      ...prev,
      seen: true,
      done: acc >= 80 ? true : !!prev.done,
      drills: (prev.drills || 0) + 1,
      best: Math.max(prev.best || 0, acc),
      at: prev.at || at,
      lastAt: at,
    };
    if (justCompleted) {
      z.stages[stageId].doneAt = at;
      award(ZERO_POINTS.stage, p);
    }
  });
  return { justCompleted, firstAttempt, accuracy: acc, badges: evaluateBadges() };
}

export function resetStage(stageId) {
  edit((z) => {
    const prev = z.stages[stageId] || {};
    z.stages[stageId] = { ...prev, done: false, best: 0 };
  });
}

/* ---------- الحروف ---------- */
export function markLetter(letterId, on = true) {
  let awardNow = 0;
  edit((z, p) => {
    const was = !!z.letters[letterId];
    if (on && !was) { z.letters[letterId] = true; awardNow = ZERO_POINTS.letter; award(awardNow, p); }
    else if (!on && was) delete z.letters[letterId];
  });
  return evaluateBadges();
}

export function markDigraph(id, on = true) {
  edit((z, p) => {
    const was = !!z.digraphs[id];
    if (on && !was) { z.digraphs[id] = true; award(ZERO_POINTS.digraph, p); }
    else if (!on && was) delete z.digraphs[id];
  });
  return evaluateBadges();
}

/* ---------- الكلمات والجمل ---------- */
export function markWord(en, on = true) {
  if (!en) return [];
  edit((z, p) => {
    const key = String(en);
    const was = !!z.words[key];
    if (on && !was) { z.words[key] = true; award(ZERO_POINTS.word, p); }
    else if (!on && was) delete z.words[key];
  });
  return evaluateBadges();
}

export function markSentence(en, on = true) {
  if (!en) return [];
  edit((z, p) => {
    const key = String(en);
    const was = !!z.sentences[key];
    if (on && !was) { z.sentences[key] = true; award(ZERO_POINTS.sentence, p); }
    else if (!on && was) delete z.sentences[key];
  });
  return evaluateBadges();
}

export function markPadUsed() {
  let milestone = false;
  edit((z, p) => {
    z.padCount = (z.padCount || 0) + 1;
    if (z.padCount === 1) { award(ZERO_POINTS.pad, p); milestone = true; }
  });
  return { milestone, badges: evaluateBadges() };
}

/* ---------- القراءات ---------- */
export function markReadingDone(id, score = 0, total = 0) {
  let first = false;
  edit((z, p) => {
    const prev = z.readings[id] || {};
    first = !prev.done;
    z.readings[id] = { done: true, score: Math.max(prev.score || 0, score), total, at: new Date().toISOString() };
    if (first) award(ZERO_POINTS.reading, p);
  });
  return evaluateBadges();
}

/* ---------- الإتقان التلقائي من إجابة سؤال ---------- */
/** يتعلّم من معرّف السؤال (itemId) أي عنصر أُتقن عند الإجابة الصحيحة */
export function applyAnswer(itemId, correct) {
  if (!correct || !itemId) return [];
  const id = String(itemId);

  // حروف: zero:name:letter:a · zero:word:letter:a
  let m = /^zero:(?:name|word):letter:([a-z]+)$/.exec(id);
  if (m) return markLetter(m[1], true);

  // حروف مركّبة: zero:name:digraph:sh
  m = /^zero:(?:name|word):digraph:([a-z-]+)$/.exec(id);
  if (m) return markDigraph(m[1], true);

  // كلمات: zero:ar:word:apple · zero:en:word:apple
  m = /^zero:(?:ar|en):word:(.+)$/.exec(id);
  if (m) return markWord(m[1], true);

  // جمل: zero:ar:sent:<sentence>
  m = /^zero:(?:ar|en):sent:(.+)$/.exec(id);
  if (m) return markSentence(m[1], true);

  return [];
}

/* ---------- الاختبار النهائي ---------- */
export function recordZeroExam(score, total) {
  let improved = false;
  let firstAttempt = false;
  edit((z, p) => {
    const exam = z.exam || { best: 0, last: 0, attempts: 0, at: '', total: 0 };
    firstAttempt = !exam.attempts;
    exam.attempts = (exam.attempts || 0) + 1;
    exam.last = Math.round(total ? (score / total) * 100 : 0);
    exam.total = total;
    exam.at = new Date().toISOString();
    if (exam.last > (exam.best || 0)) { exam.best = exam.last; improved = true; }
    z.exam = exam;
    if (firstAttempt) award(POINTS.examCorrect * Math.max(0, score), p);
  });
  return { improved, badges: evaluateBadges() };
}

/* ---------- الشهادة ---------- */
function certCode(seed) {
  const s = String(seed || Date.now()).replace(/[^0-9]/g, '') || String(Date.now());
  const b36 = Number(s.slice(-10) || Date.now()).toString(36).toUpperCase();
  let sum = 0;
  for (const ch of b36) sum += ch.charCodeAt(0);
  return `A0-${b36}-${(sum % 997).toString().padStart(3, '0')}`;
}

export function certificateReady() {
  return zeroStats(progress).readyForA1;
}

/** يمنح الشهادة مرة واحدة بعد استحقاقها؛ يُرجع { granted, code } */
export function grantCertificate(name = '') {
  let granted = false;
  let code = '';
  edit((z, p) => {
    const cert = z.cert || {};
    if (!cert.earned) { granted = true; award(ZERO_POINTS.cert, p); }
    code = cert.code || certCode(z.startedAt || Date.now());
    z.cert = {
      earned: true,
      code,
      at: cert.at || new Date().toISOString(),
      name: name || cert.name || '',
    };
  });
  return { granted, code, badges: evaluateBadges() };
}

export function saveCertificateName(name) {
  edit((z) => {
    z.cert = { ...(z.cert || {}), name: String(name || '').trim().slice(0, 60) };
    if (z.cert.earned && !z.cert.code) z.cert.code = certCode(z.startedAt || Date.now());
  });
}

export function certificate() {
  const z = progress.zero || emptyZero();
  return z.cert || { earned: false, code: '', at: '', name: '' };
}

/* ---------- الوضع والتفضيلات ---------- */
export const ZERO_FOCUS = ['a0', 'levels'];

export function zeroFocus() {
  const f = settings?.zero?.focus;
  return f === 'a0' ? 'a0' : 'levels';
}

export function setZeroFocus(focus) {
  const f = focus === 'a0' ? 'a0' : 'levels';
  saveSettings({ zero: { focus: f } });
  return f;
}

export function zeroPrefs() {
  const z = settings?.zero || {};
  return {
    focus: z.focus === 'a0' ? 'a0' : 'levels',
    onboarded: !!z.onboarded,
    autoSpeak: z.autoSpeak !== false,
    slowRate: Number(z.slowRate) > 0 ? Number(z.slowRate) : 0.55,
    padMode: z.padMode === 'cursive' ? 'cursive' : 'print',
  };
}

export function setZeroPrefs(patch = {}) {
  saveSettings({ zero: patch });
  return zeroPrefs();
}

export function completeOnboarding(choice) {
  const focus = choice === 'a0' ? 'a0' : 'levels';
  saveSettings({ zero: { onboarded: true, focus, chosenAt: new Date().toISOString() } });
  if (choice === 'a0') markStageSeen(ZERO_STAGES[0].id);
  return focus;
}

/* ---------- تصفير قسم التأسيس ---------- */
export function resetZeroProgress() {
  saveProgress((p) => { p.zero = emptyZero(); });
}

/* ---------- توصية الانتقال إلى A1 (بلا أي قفل) ---------- */
export function a1Recommendation() {
  const st = zeroStats(progress);
  if (st.readyForA1) {
    return {
      tone: 'ok',
      ready: true,
      title: 'أتقنتَ التأسيس — انتقل إلى A1 بثقة',
      text: `أنهيت ${ZERO_STAGES.length} مراحل، وأتقنت ${LETTERS.length} حرفاً، ونتيجتك في الاختبار النهائي ${st.examBest}%. المستوى A1 مفتوح لك الآن — ونصيحتنا أن تبدأه.`,
    };
  }
  const st2 = zeroStats(progress);
  return {
    tone: 'brand',
    ready: false,
    title: 'توصية (وليس شرطاً)',
    text: zeroAdviceText(st2),
  };
}

function zeroAdviceText(st) {
  const parts = [];
  if (st.remaining.stages) parts.push(`${st.remaining.stages} مرحلة لم تُكملها بعد`);
  if (st.remaining.letters) parts.push(`${st.remaining.letters} حرفاً لم تُتقنه`);
  if (st.remaining.exam) parts.push(`نتيجة الاختبار النهائي أقل من 90% (تحتاج ${st.remaining.exam}% إضافية)`);
  if (!parts.length) return 'أكمل ما تبقّى ثم عد لتستلم شهادة التأسيس.';
  // المستويات الأخرى مفتوحة دائماً: التوصية إرشادية فقط
  return `لإتمام شهادة التأسيس: ${parts.join(' · ')}. ومع ذلك فكل المستويات الأخرى مفتوحة لك الآن بلا أي قفل.`;
}
