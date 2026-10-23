/* إدارة الحالة والتخزين المحلي */
import { todayKey, debounce } from './utils.js';

const K_SETTINGS = 'lea.settings.v1';
const K_PROGRESS = 'lea.progress.v1';
const K_AUTH = 'lea.auth.v1';
const K_SESSION = 'lea.session.v1';
export const KEYS = { K_SETTINGS, K_PROGRESS, K_AUTH, K_SESSION };

export const DEFAULT_SETTINGS = {
  v: 1,
  theme: 'auto',            // auto | light | dark
  skin: 'kali',             // kali | gnome | classic
  uiLang: 'ar',             // ar | en
  fontSize: 100,            // 85..130
  highContrast: false,
  sound: true,              // أصوات النجاح/الخطأ
  autoSpeak: false,         // نطق تلقائي لكلمة السؤال
  tts: { voice: '', rate: 0.92, pitch: 1, lang: 'en-US' },
  dailyGoal: 20,            // عدد الأسئلة اليومية
  reminder: {
    enabled: false,
    time: '19:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    title: 'حان وقت الإنجليزية 🇬🇧',
    body: 'جلسة قصيرة اليوم تحافظ على سلسلتك! افتح الأكاديمية وتدرّب 10 دقائق.',
    lastFired: '',
    launchAtLogin: false,
  },
  security: { lockEnabled: false, idleMinutes: 0 },
  session: { rememberDays: 30 },
  showTranslation: true,
  reduceAnimations: false,
  /* قسم «من الصفر» (A0): الوضع المختار، شاشة الاختيار مرة واحدة، تفضيلات الصوت واللوح */
  zero: {
    focus: 'levels',      // a0 = القسم في المقدمة | levels = المستويات في المقدمة
    onboarded: false,     // هل عُرضت شاشة الاختيار مرة واحدة؟
    autoSpeak: true,      // نطق تلقائي لعناصر التأسيس
    slowRate: 0.55,       // سرعة النطق البطيء
    padMode: 'print',     // print = مطبوع | cursive = متصل
    showA0Card: true,     // إظهار اللافتة البارزة في الرئيسية
    chosenAt: '',
  },
};

export const DEFAULT_PROGRESS = {
  v: 1,
  points: 0,
  streak: 0,
  bestStreak: 0,
  lastStudyDay: '',
  studyDays: [],
  totals: { questions: 0, correct: 0, minutes: 0, sessions: 0, exams: 0 },
  byType: {},        // { mcq: {q, c}, ... }
  byLevel: {},       // { a1: {q, c}, ... }
  byTopic: {},       // { pronouns: {q, c}, ... }
  items: {},         // itemId: { seen, correct, wrong, box, due, last }
  units: {},         // unitId: { read: bool, quiz: {q,c}, done: bool }
  lessons: {},       // "unitId:index": true
  readings: {},      // readingId: { done, score }
  badges: [],
  notebook: [],      // { en, ar, note, at, itemId }
  activity: {},      // "YYYY-MM-DD": { q, c, points, minutes }
  missionActivity: {}, // "YYYY-MM-DD": { reviewedItems, lesson, conversation }
  conversations: { completed: {}, sessions: 0, turns: 0, correct: 0, active: null, paused: {} },
  exams: [],         // { id, at, level, score, total, seconds }
  goals: {},         // "YYYY-MM-DD": { target, done }
  settingsTouched: false,
};

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : fallback;
  } catch { return fallback; }
}

function deepMerge(base, extra) {
  const out = Array.isArray(base) ? base.slice() : { ...base };
  if (!extra || typeof extra !== 'object') return out;
  for (const [k, v] of Object.entries(extra)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    if (v && typeof v === 'object' && !Array.isArray(v) && base && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      out[k] = deepMerge(base[k], v);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}

const persistedSettings = safeParse(localStorage.getItem(K_SETTINGS), {});
const hadLegacyPushSettings = Object.hasOwn(persistedSettings, 'push');
delete persistedSettings.push;
export let settings = deepMerge(DEFAULT_SETTINGS, persistedSettings);
if (hadLegacyPushSettings) {
  try { localStorage.setItem(K_SETTINGS, JSON.stringify(settings)); }
  catch (error) { console.warn('Could not remove legacy push settings', error); }
}
export let progress = deepMerge(DEFAULT_PROGRESS, safeParse(localStorage.getItem(K_PROGRESS), {}));

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(kind) { listeners.forEach((fn) => { try { fn(kind); } catch (e) { console.warn(e); } }); }

const persistSettings = debounce(() => {
  try { localStorage.setItem(K_SETTINGS, JSON.stringify(settings)); } catch (e) { console.warn('save settings failed', e); }
}, 120);
const persistProgress = debounce(() => {
  try { localStorage.setItem(K_PROGRESS, JSON.stringify(progress)); } catch (e) { console.warn('save progress failed', e); }
}, 120);

export function saveSettings(patch = null) {
  if (patch) settings = deepMerge(settings, patch);
  persistSettings();
  emit('settings');
  return settings;
}
export function saveProgress(mutator = null) {
  if (typeof mutator === 'function') mutator(progress);
  else if (mutator) progress = deepMerge(progress, mutator);
  persistProgress();
  emit('progress');
  return progress;
}
export function flush() {
  try { localStorage.setItem(K_SETTINGS, JSON.stringify(settings)); } catch {}
  try { localStorage.setItem(K_PROGRESS, JSON.stringify(progress)); } catch {}
}

/* ---------- الجلسة ---------- */
export function readSession() { return safeParse(localStorage.getItem(K_SESSION), null); }
export function writeSession(obj) {
  if (obj) localStorage.setItem(K_SESSION, JSON.stringify(obj));
  else localStorage.removeItem(K_SESSION);
}
export function readAuth() { return safeParse(localStorage.getItem(K_AUTH), null); }
export function writeAuth(obj) {
  if (obj) localStorage.setItem(K_AUTH, JSON.stringify(obj));
  else localStorage.removeItem(K_AUTH);
}

/* ---------- يوم الدراسة ---------- */
export function touchStudyDay() {
  const t = todayKey();
  saveProgress((p) => {
    if (p.lastStudyDay === t) return;
    const prev = p.lastStudyDay;
    let streak = p.streak || 0;
    if (!prev) streak = 1;
    else {
      const diff = Math.round((new Date(t + 'T00:00:00') - new Date(prev + 'T00:00:00')) / 86400000);
      streak = diff === 1 ? streak + 1 : diff === 0 ? streak : 1;
    }
    p.streak = streak;
    p.bestStreak = Math.max(p.bestStreak || 0, streak);
    p.lastStudyDay = t;
    if (!p.studyDays.includes(t)) p.studyDays.push(t);
    if (p.studyDays.length > 400) p.studyDays = p.studyDays.slice(-400);
  });
  const st = settings;
  if (st.reminder && st.reminder.enabled) saveSettings({ reminder: { lastFired: st.reminder.lastFired } });
}

export function activityFor(key = todayKey()) {
  return progress.activity[key] || { q: 0, c: 0, points: 0, minutes: 0 };
}
export function goalForToday() {
  const key = todayKey();
  const target = progress.goals[key]?.target || settings.dailyGoal || 20;
  const done = activityFor(key).q || 0;
  return { target, done, ratio: target > 0 ? Math.min(1, done / target) : 0, key };
}

/* ---------- تصدير/استيراد/تصفير ---------- */
export function exportAll() {
  return JSON.stringify({
    app: 'learn-english', version: 1, exportedAt: new Date().toISOString(),
    settings, progress,
  }, null, 2);
}
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function inspectImport(json) {
  const data = JSON.parse(json);
  if (!isRecord(data) || (!isRecord(data.settings) && !isRecord(data.progress))) throw new Error('ملف غير صالح');
  return {
    exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : '',
    hasSettings: isRecord(data.settings),
    hasProgress: isRecord(data.progress),
    settingsCount: isRecord(data.settings) ? Object.keys(data.settings).length : 0,
    progressCount: isRecord(data.progress) ? Object.keys(data.progress).length : 0,
    words: Array.isArray(data.progress?.notebook) ? data.progress.notebook.length : 0,
    studyDays: Array.isArray(data.progress?.studyDays) ? data.progress.studyDays.length : 0,
    hasAuth: Object.hasOwn(data, 'auth'),
  };
}

export function importAll(json, { mode = 'replace' } = {}) {
  const data = JSON.parse(json);
  if (!isRecord(data) || (!isRecord(data.settings) && !isRecord(data.progress))) throw new Error('ملف غير صالح');
  if (!['merge', 'replace'].includes(mode)) throw new Error('وضع الاستيراد غير صالح');

  let nextSettings = settings;
  let nextProgress = progress;
  const importsSettings = isRecord(data.settings);
  const importsProgress = isRecord(data.progress);
  if (importsSettings) {
    const importedSettings = { ...data.settings, security: settings.security };
    delete importedSettings.push;
    nextSettings = mode === 'merge'
      ? deepMerge(settings, importedSettings)
      : deepMerge(DEFAULT_SETTINGS, importedSettings);
    // Keep this device's lock configuration even if the backup predates it.
    nextSettings.security = settings.security;
  }
  if (importsProgress) {
    nextProgress = mode === 'merge'
      ? deepMerge(progress, data.progress)
      : deepMerge(DEFAULT_PROGRESS, data.progress);
  }

  // Persist as one logical operation; restore the original values if either write fails.
  const oldSettings = localStorage.getItem(K_SETTINGS);
  const oldProgress = localStorage.getItem(K_PROGRESS);
  try {
    if (importsSettings) localStorage.setItem(K_SETTINGS, JSON.stringify(nextSettings));
    if (importsProgress) localStorage.setItem(K_PROGRESS, JSON.stringify(nextProgress));
  } catch (error) {
    try { oldSettings == null ? localStorage.removeItem(K_SETTINGS) : localStorage.setItem(K_SETTINGS, oldSettings); } catch {}
    try { oldProgress == null ? localStorage.removeItem(K_PROGRESS) : localStorage.setItem(K_PROGRESS, oldProgress); } catch {}
    throw error;
  }
  if (importsSettings) settings = nextSettings;
  if (importsProgress) progress = nextProgress;
  if (importsSettings) emit('settings');
  if (importsProgress) emit('progress');
  return true;
}
export function resetProgress() {
  progress = deepMerge(DEFAULT_PROGRESS, {});
  localStorage.setItem(K_PROGRESS, JSON.stringify(progress));
  emit('progress');
}
export function resetSettings() {
  settings = deepMerge(DEFAULT_SETTINGS, {});
  localStorage.setItem(K_SETTINGS, JSON.stringify(settings));
  emit('settings');
}
export function wipeEverything() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  progress = deepMerge(DEFAULT_PROGRESS, {});
  settings = deepMerge(DEFAULT_SETTINGS, {});
  emit('progress'); emit('settings');
}
