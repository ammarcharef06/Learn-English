import { t as uiText } from '../core/i18n.js';
/* تعريف الشارات وإنجازات التحفيز */
import { ZERO_STAGES, ZERO_TOTALS } from './zero.js';

/* ---------- مساعدات شارات قسم «من الصفر» (A0) ---------- */
const z0 = (p) => (p && p.zero) || {};
const zStages = (p) => z0(p).stages || {};
const zStageDone = (p, id) => !!zStages(p)[id]?.done;
const zStagesDone = (p) => ZERO_STAGES.filter((s) => zStageDone(p, s.id)).length;
const zLetters = (p) => Object.keys(z0(p).letters || {}).length;
const zSentences = (p) => Object.keys(z0(p).sentences || {}).length;
const zExam = (p) => Number(z0(p).exam?.best || 0);
const zCert = (p) => !!z0(p).cert?.earned;

export const BADGES = [
  { id: 'first-step', icon: '🚀', ar: uiText('badge.first-step.title'), en: 'First step', descAr: uiText('badge.first-step.description'), descEn: 'Answered your first question', check: (p) => (p.totals?.questions || 0) >= 1 },
  { id: 'ten-correct', icon: '✅', ar: uiText('badge.ten-correct.title'), en: 'Good start', descAr: uiText('badge.ten-correct.description'), descEn: '10 correct answers', check: (p) => (p.totals?.correct || 0) >= 10 },
  { id: 'fifty-correct', icon: '💪', ar: uiText('badge.fifty-correct.title'), en: 'Fifty right', descAr: uiText('badge.fifty-correct.description'), descEn: '50 correct answers', check: (p) => (p.totals?.correct || 0) >= 50 },
  { id: 'hundred-correct', icon: '🎯', ar: uiText('badge.hundred-correct.title'), en: 'Century', descAr: uiText('badge.hundred-correct.description'), descEn: '100 correct answers', check: (p) => (p.totals?.correct || 0) >= 100 },
  { id: 'thousand', icon: '🏆', ar: uiText('badge.thousand.title'), en: 'A thousand', descAr: uiText('badge.thousand.description'), descEn: '1000 answers', check: (p) => (p.totals?.questions || 0) >= 1000 },
  { id: 'combo-10', icon: '💎', ar: uiText('badge.combo-10.title'), en: 'Golden combo', descAr: uiText('badge.combo-10.description'), descEn: '10 correct answers in a row', check: (p) => (p.bestCombo || 0) >= 10 },
  { id: 'combo-25', icon: '🌟', ar: uiText('badge.combo-25.title'), en: 'Full focus', descAr: uiText('badge.combo-25.description'), descEn: '25 correct answers in a row', check: (p) => (p.bestCombo || 0) >= 25 },
  { id: 'streak-3', icon: '🔥', ar: uiText('badge.streak-3.title'), en: 'Three days', descAr: uiText('badge.streak-3.description'), descEn: '3 study days in a row', check: (p) => (p.bestStreak || 0) >= 3 },
  { id: 'streak-7', icon: '⚡', ar: uiText('badge.streak-7.title'), en: 'Full week', descAr: uiText('badge.streak-7.description'), descEn: '7 days in a row', check: (p) => (p.bestStreak || 0) >= 7 },
  { id: 'streak-30', icon: '👑', ar: uiText('badge.streak-30.title'), en: 'Month of grit', descAr: uiText('badge.streak-30.description'), descEn: '30 days in a row', check: (p) => (p.bestStreak || 0) >= 30 },
  { id: 'unit-first', icon: '📘', ar: uiText('badge.unit-first.title'), en: 'First unit', descAr: uiText('badge.unit-first.description'), descEn: 'Completed a full unit', check: (p) => Object.values(p.units || {}).some((u) => u && u.done) },
  { id: 'units-6', icon: '📗', ar: uiText('badge.units-6.title'), en: 'Six units', descAr: uiText('badge.units-6.description'), descEn: 'Completed 6 units', check: (p) => Object.values(p.units || {}).filter((u) => u && u.done).length >= 6 },
  { id: 'units-12', icon: '📙', ar: uiText('badge.units-12.title'), en: 'Twelve units', descAr: uiText('badge.units-12.description'), descEn: 'Completed 12 units', check: (p) => Object.values(p.units || {}).filter((u) => u && u.done).length >= 12 },
  { id: 'level-a1', icon: '🌱', ar: uiText('badge.level-a1.title'), en: 'A1 complete', descAr: uiText('badge.level-a1.description'), descEn: 'Finished all A1 units', check: (p, ctx) => ctx?.levelDone?.('a1') },
  { id: 'level-a2', icon: '🌿', ar: uiText('badge.level-a2.title'), en: 'A2 complete', descAr: uiText('badge.level-a2.description'), descEn: 'Finished all A2 units', check: (p, ctx) => ctx?.levelDone?.('a2') },
  { id: 'level-b1', icon: '🌳', ar: uiText('badge.level-b1.title'), en: 'B1 complete', descAr: uiText('badge.level-b1.description'), descEn: 'Finished all B1 units', check: (p, ctx) => ctx?.levelDone?.('b1') },
  { id: 'reader-3', icon: '📖', ar: uiText('badge.reader-3.title'), en: 'Active reader', descAr: uiText('badge.reader-3.description'), descEn: 'Completed 3 passages', check: (p) => Object.values(p.readings || {}).filter((r) => r && r.done).length >= 3 },
  { id: 'reader-all', icon: '📚', ar: uiText('badge.reader-all.title'), en: 'Full library', descAr: uiText('badge.reader-all.description'), descEn: 'Completed every passage', check: (p, ctx) => ctx?.readingsTotal ? Object.values(p.readings || {}).filter((r) => r && r.done).length >= ctx.readingsTotal : false },
  { id: 'examiner', icon: '🎓', ar: uiText('badge.examiner.title'), en: 'Examinee', descAr: uiText('badge.examiner.description'), descEn: 'Finished your first exam', check: (p) => (p.exams || []).length >= 1 },
  { id: 'ace', icon: '💯', ar: uiText('badge.ace.title'), en: 'Ace', descAr: uiText('badge.ace.description'), descEn: '90%+ in an exam', check: (p) => (p.exams || []).some((e) => e.total >= 10 && e.score / e.total >= 0.9) },
  { id: 'exams-5', icon: '📝', ar: uiText('badge.exams-5.title'), en: 'Exam regular', descAr: uiText('badge.exams-5.description'), descEn: 'Five exams', check: (p) => (p.exams || []).length >= 5 },
  { id: 'notebook-20', icon: '✍️', ar: uiText('badge.notebook-20.title'), en: 'Word collector', descAr: uiText('badge.notebook-20.description'), descEn: '20 words in your notebook', check: (p) => (p.notebook || []).length >= 20 },
  { id: 'goal-7', icon: '🎯', ar: uiText('badge.goal-7.title'), en: 'Seven goals', descAr: uiText('badge.goal-7.description'), descEn: 'Met your daily goal 7 times', check: (p) => Object.values(p.goals || {}).filter((g) => g && g.done).length >= 7 },
  { id: 'time-60', icon: '⏱️', ar: uiText('badge.time-60.title'), en: 'One hour', descAr: uiText('badge.time-60.description'), descEn: '60 minutes of study', check: (p) => (p.totals?.minutes || 0) >= 60 },
  { id: 'points-500', icon: '⭐', ar: uiText('badge.points-500.title'), en: '500 points', descAr: uiText('badge.points-500.description'), descEn: 'Earned 500 points', check: (p) => (p.points || 0) >= 500 },
  { id: 'points-2000', icon: '🏅', ar: uiText('badge.points-2000.title'), en: '2000 points', descAr: uiText('badge.points-2000.description'), descEn: 'Earned 2000 points', check: (p) => (p.points || 0) >= 2000 },

  /* ---------- شارات قسم «من الصفر» (A0) ---------- */
  { id: 'a0-first-step', icon: '🌱', ar: uiText('badge.a0-first-step.title'), en: 'First foundation stage', descAr: uiText('badge.a0-first-step.description'), descEn: 'Completed your first A0 stage', check: (p) => zStagesDone(p) >= 1 },
  { id: 'a0-letters', icon: '🔤', ar: uiText('badge.a0-letters.title'), en: 'All 26 letters', descAr: uiText('badge.a0-letters.description', { count: ZERO_TOTALS.letters }), descEn: 'Mastered all 26 letters', check: (p) => zLetters(p) >= ZERO_TOTALS.letters },
  { id: 'a0-numbers', icon: '🔢', ar: uiText('badge.a0-numbers.title'), en: 'Basic numbers', descAr: uiText('badge.a0-numbers.description'), descEn: 'Finished the numbers from 0 to 20', check: (p) => zStageDone(p, 'numbers') },
  { id: 'a0-time', icon: '📅', ar: uiText('badge.a0-time.title'), en: 'Days of the week', descAr: uiText('badge.a0-time.description'), descEn: 'Finished the days of the week', check: (p) => zStageDone(p, 'time') },
  { id: 'a0-pronouns', icon: '🙋', ar: uiText('badge.a0-pronouns.title'), en: 'Basic pronouns', descAr: uiText('badge.a0-pronouns.description'), descEn: 'Finished the basic pronouns', check: (p) => zStageDone(p, 'pronouns') },
  { id: 'a0-sentences40', icon: '💬', ar: uiText('badge.a0-sentences40.title'), en: 'Greeting phrases', descAr: uiText('badge.a0-sentences40.description'), descEn: 'Finished the basic greetings stage', check: (p) => zStageDone(p, 'sentences') },
  { id: 'a0-greetings', icon: '🗣️', ar: uiText('badge.a0-greetings.title'), en: 'Polite speaker', descAr: uiText('badge.a0-greetings.description'), descEn: 'Mastered three greeting or polite phrases', check: (p) => zSentences(p) >= 3 },
  { id: 'a0-stages5', icon: '🗺️', ar: uiText('badge.a0-stages5.title'), en: 'All foundation stages', descAr: uiText('badge.a0-stages5.description', { count: ZERO_STAGES.length }), descEn: 'Completed all 5 A0 stages', check: (p) => zStagesDone(p) >= ZERO_STAGES.length },
  { id: 'a0-exam90', icon: '🎯', ar: uiText('badge.a0-exam90.title'), en: 'A0 exam passed', descAr: uiText('badge.a0-exam90.description'), descEn: 'Scored 90%+ on the A0 final exam', check: (p) => zExam(p) >= 90 },
  { id: 'a0-exam-perfect', icon: '💯', ar: uiText('badge.a0-exam-perfect.title'), en: 'Perfect A0 exam', descAr: uiText('badge.a0-exam-perfect.description'), descEn: 'Scored 100% on the A0 final exam', check: (p) => zExam(p) >= 100 },
  { id: 'a0-certificate', icon: '🎓', ar: uiText('badge.a0-certificate.title'), en: 'Foundation certificate', descAr: uiText('badge.a0-certificate.description'), descEn: 'Earned the A0 foundation certificate', check: (p) => zCert(p) },
];

/* نصائح توعوية تدور على لوحة التحكم */
export const STUDY_TIPS = [
  uiText('tip.86.e8dc2ec4'),
  uiText('tip.72.69283cf9'),
  uiText('tip.61.2498cd1e'),
  uiText('tip.63.0d6e32ba'),
  uiText('tip.65.f3ccd9e9'),
  uiText('tip.65.7befbf1f'),
  uiText('tip.59.93537980'),
  uiText('tip.55.1dc3279b'),
  uiText('tip.77.1326b054'),
  uiText('tip.73.14a93baa'),
];
