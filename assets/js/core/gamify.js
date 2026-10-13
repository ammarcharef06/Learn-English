/* التحفيز: نقاط، سلسلة أيام، شارات، أهداف */
import { progress, saveProgress, settings, touchStudyDay } from './store.js';
import { todayKey } from './utils.js';
import { BADGES } from '../data/badges.js';
import { LEVELS, levelDone, READINGS_TOTAL } from '../data/curriculum.js';

export const POINTS = {
  correct: 10,
  wrong: 2,
  comboBonus: 3,
  badge: 25,
  readingDone: 30,
  unitDone: 60,
  examCorrect: 12,
  goalDone: 20,
};

function ctx() {
  const done = {};
  for (const lv of LEVELS) done[lv.id] = levelDone(lv.id);
  return { levelDone: (id) => !!done[id], readingsTotal: READINGS_TOTAL, done };
}

export function award(n, p = progress) {
  p.points = (p.points || 0) + n;
  const key = todayKey();
  const a = p.activity[key] || { q: 0, c: 0, points: 0, minutes: 0 };
  a.points = (a.points || 0) + n;
  p.activity[key] = a;
}

export function evaluateBadges() {
  const newly = [];
  saveProgress((p) => {
    const c = ctx();
    const have = new Set(p.badges || []);
    for (const b of BADGES) {
      if (have.has(b.id)) continue;
      let ok = false;
      try { ok = !!b.check(p, c); } catch { ok = false; }
      if (ok) { p.badges = [...(p.badges || []), b.id]; newly.push(b); award(POINTS.badge, p); }
    }
  });
  return newly;
}

export function recordAnswer({ correct, itemId = null, type = 'mcq', topic = 'general', level = 'a1', seconds = 0 }) {
  touchStudyDay();
  const key = todayKey();
  const target = progress.goals?.[key]?.target || settings.dailyGoal || 20;
  let gained = 0;
  let goalJustDone = false;

  saveProgress((p) => {
    p.totals = p.totals || { questions: 0, correct: 0, minutes: 0, sessions: 0, exams: 0 };
    p.totals.questions += 1;
    if (correct) p.totals.correct += 1;
    p.totals.seconds = +(((p.totals.seconds || 0) + seconds).toFixed(1));
    p.totals.minutes = Math.round((p.totals.seconds || 0) / 60);

    const bump = (obj, k) => {
      obj[k] = obj[k] || { q: 0, c: 0 };
      obj[k].q += 1;
      if (correct) obj[k].c += 1;
    };
    p.byType = p.byType || {}; bump(p.byType, type);
    if (level) { p.byLevel = p.byLevel || {}; bump(p.byLevel, level); }
    if (topic) { p.byTopic = p.byTopic || {}; bump(p.byTopic, topic); }

    if (correct) {
      p.combo = (p.combo || 0) + 1;
      p.bestCombo = Math.max(p.bestCombo || 0, p.combo);
      gained = POINTS.correct + (p.combo >= 5 ? POINTS.comboBonus : 0);
    } else {
      p.combo = 0;
      gained = POINTS.wrong;
    }

    // نشاط اليوم
    const a = p.activity[key] || { q: 0, c: 0, points: 0, minutes: 0 };
    a.q += 1; if (correct) a.c += 1;
    a.minutes = +(((a.minutes || 0) + seconds / 60).toFixed(2));
    p.activity[key] = a;

    award(gained, p);

    const g = p.goals[key] || { target, done: false };
    g.target = target;
    if (!g.done && a.q >= target) { g.done = true; goalJustDone = true; award(POINTS.goalDone, p); }
    p.goals[key] = g;

    // تنظيف السجل القديم
    const keys = Object.keys(p.activity);
    if (keys.length > 400) keys.sort().slice(0, keys.length - 400).forEach((k) => delete p.activity[k]);
  });

  const badges = evaluateBadges();
  const data = { gained, badges, goalJustDone, points: progress.points };
  document.dispatchEvent(new CustomEvent('lea:answered', { detail: data }));
  return data;
}

export function recordStudyTime(seconds) {
  if (!seconds) return;
  const key = todayKey();
  saveProgress((p) => {
    p.totals = p.totals || { questions: 0, correct: 0, minutes: 0, seconds: 0, sessions: 0, exams: 0 };
    p.totals.seconds = +(((p.totals.seconds || 0) + seconds).toFixed(1));
    p.totals.minutes = Math.round((p.totals.seconds || 0) / 60);
    const a = p.activity[key] || { q: 0, c: 0, points: 0, minutes: 0 };
    a.minutes = +(((a.minutes || 0) + seconds / 60).toFixed(2));
    p.activity[key] = a;
  });
}

export function recordExam({ level = 'mixed', score, total, seconds }) {
  let badges = [];
  saveProgress((p) => {
    p.totals = p.totals || { questions: 0, correct: 0, minutes: 0, sessions: 0, exams: 0 };
    p.totals.exams = (p.totals.exams || 0) + 1;
    p.exams = p.exams || [];
    p.exams.unshift({ at: new Date().toISOString(), level, score, total, seconds });
    if (p.exams.length > 60) p.exams.length = 60;
    award(score * POINTS.examCorrect, p);
  });
  badges = evaluateBadges();
  return { badges };
}

export function recordReading(id, score, total) {
  let badges = [];
  saveProgress((p) => {
    p.readings = p.readings || {};
    const prev = p.readings[id] || {};
    p.readings[id] = { done: true, score, total, at: new Date().toISOString(), best: Math.max(prev.best || 0, score) };
    if (!prev.done) award(POINTS.readingDone, p);
  });
  badges = evaluateBadges();
  return { badges };
}

export function completeUnit(unitId) {
  let result = { first: false, badges: [] };
  saveProgress((p) => {
    p.units = p.units || {};
    const u = p.units[unitId] || {};
    if (!u.done) { u.done = true; result.first = true; award(POINTS.unitDone, p); }
    p.units[unitId] = u;
  });
  result.badges = evaluateBadges();
  return result;
}

export function markLessonRead(key) {
  saveProgress((p) => { p.lessons = p.lessons || {}; p.lessons[key] = true; });
}

export function addNotebook(entry) {
  let added = false;
  saveProgress((p) => {
    p.notebook = p.notebook || [];
    if (!p.notebook.some((n) => n.en.toLowerCase() === String(entry.en).toLowerCase())) {
      p.notebook.unshift({ ...entry, at: new Date().toISOString() });
      added = true;
    }
  });
  if (added) evaluateBadges();
  return added;
}

export function removeNotebook(en) {
  saveProgress((p) => {
    p.notebook = (p.notebook || []).filter((n) => n.en.toLowerCase() !== String(en).toLowerCase());
  });
}

export function levelStats(levelId) {
  const lv = LEVELS.find((l) => l.id === levelId);
  if (!lv) return { total: 0, done: 0, percent: 0 };
  const total = lv.units.length;
  const done = lv.units.filter((u) => progress.units?.[u.id]?.done).length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function overallStats() {
  const all = LEVELS.flatMap((l) => l.units.map((u) => ({ u, l })));
  const done = all.filter(({ u }) => progress.units?.[u.id]?.done).length;
  const grammarDone = Object.keys(progress.lessons || {}).length;
  const grammarTotal = LEVELS.reduce((n, l) => n + l.units.reduce((m, u) => m + u.grammar.length, 0), 0);
  return {
    unitsTotal: all.length, unitsDone: done,
    grammarTotal, grammarDone,
    percent: all.length ? Math.round((done / all.length) * 100) : 0,
  };
}

export function streakInfo() {
  return {
    streak: progress.streak || 0,
    best: progress.bestStreak || 0,
    today: progress.lastStudyDay === todayKey(),
    days: (progress.studyDays || []).slice(-30),
  };
}

export function accuracy() {
  const t = progress.totals || { questions: 0, correct: 0 };
  return t.questions ? Math.round((t.correct / t.questions) * 100) : 0;
}

export function badgesWithState() {
  const have = new Set(progress.badges || []);
  return BADGES.map((b) => ({ ...b, earned: have.has(b.id) }));
}
