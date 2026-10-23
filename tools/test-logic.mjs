/**
 * اختبار منطقي شامل لكل الأنظمة (بدون متصفح)
 * الاستخدام: node tools/test-logic.mjs
 */
import { pathToFileURL } from 'node:url';
import { join, dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mod = (p) => import(pathToFileURL(join(ROOT, p)).href);

/* ---------- بيئة DOM مبسطة ---------- */
const mem = new Map();
const elStub = () => ({
  style: { setProperty() {} }, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {}, setAttribute() {}, removeAttribute() {},
  querySelector: () => null, querySelectorAll: () => [], insertAdjacentHTML() {}, focus() {}, closest: () => null,
  textContent: '', innerHTML: '', value: '', checked: false, hidden: false,
});
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
};
globalThis.document = {
  documentElement: { dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} } },
  body: elStub(), hidden: false,
  addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
  querySelector: () => null, querySelectorAll: () => [], createElement: elStub,
};
globalThis.window = {
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  location: { href: 'https://example.com/Learn-English/index.html#/', hash: '#/' },
  scrollTo() {},
};
globalThis.location = globalThis.window.location;
globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };

/* ---------- إطار اختبار ---------- */
let pass = 0; const failures = [];
function check(name, cond, extra = '') {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { failures.push(`${name}${extra ? ' — ' + extra : ''}`); console.log(`  ❌ ${name}${extra ? ' — ' + extra : ''}`); }
}
const section = (title) => console.log(`\n▶ ${title}`);

/* ================= 0. تحديثات وإصدارات التطبيق ================= */
section('اختيار تحديثات التطبيق');
const updater = await mod('assets/js/core/updater.js');
check('مقارنة إصدارات الإصدار مستقرة', updater.compareVersions('1.0.10', '1.0.9') > 0
  && updater.compareVersions('1.0.4', '1.0.4') === 0);
const updateAssets = [
  { name: 'Learn-English-Android.apk', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.6/Learn-English-Android.apk' },
  { name: 'English.Academy.Setup.1.0.6.exe', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.6/English.Academy.Setup.1.0.6.exe' },
  { name: 'english-academy_1.0.6_amd64.deb', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.6/english-academy_1.0.6_amd64.deb' },
  { name: 'English.Academy-1.0.6.AppImage', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.6/English.Academy-1.0.6.AppImage' },
];
check('اختيار APK Android من أصول الإصدار الموثوقة', updater.selectReleaseAsset(updateAssets, 'android') === updateAssets[0]);
check('اختيار مثبت Windows من أصول الإصدار الموثوقة', updater.selectReleaseAsset(updateAssets, 'win32') === updateAssets[1]);
check('اختيار حزمة Linux من أصول الإصدار الموثوقة', updater.selectReleaseAsset(updateAssets, 'linux') === updateAssets[2]);
check('اختيار AppImage عند تشغيل نسخة AppImage', updater.selectReleaseAsset(updateAssets, 'linux', true) === updateAssets[3]);
check('رفض أصل تنزيل خارج المستودع المحدد', (() => {
  try {
    updater.selectReleaseAsset([{ name: 'malware.exe', browser_download_url: 'https://evil.example/malware.exe' }], 'win32');
    return false;
  } catch { return true; }
})());
const oldFetch = globalThis.fetch;
const oldCapacitor = window.Capacitor;
window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android' };
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({
    tag_name: 'v1.0.15',
    name: 'English Academy v1.0.15',
    body: 'Release notes',
    assets: [
      { ...updateAssets[0], size: 8000000, digest: `sha256:${'a'.repeat(64)}` },
      { ...updateAssets[1], size: 8000000, digest: `sha256:${'b'.repeat(64)}` },
      { name: 'SHA256SUMS.txt', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.15/SHA256SUMS.txt' },
    ],
  }),
});
try {
  const releaseCheck = await updater.checkForUpdate({ force: true });
  check('فحص GitHub يكتشف الإصدار الأحدث مع بصمة SHA موثوقة', releaseCheck.update
    && releaseCheck.latestVersion === '1.0.15' && releaseCheck.release.asset.digest.startsWith('sha256:'));
} finally {
  globalThis.fetch = oldFetch;
  if (oldCapacitor === undefined) delete window.Capacitor;
  else window.Capacitor = oldCapacitor;
}

/* ================= 1. المصادقة ================= */
section('المصادقة وكلمة المرور');
const auth = await mod('assets/js/core/auth.js');
const authStore = await mod('assets/js/core/store.js');
authStore.writeAuth({ hash: await auth.sha256Hex('SAYPER'), algo: 'v1', isDefault: true });
check('التطبيق مفتوح افتراضياً دون شاشة دخول', auth.isAuthed());
check('كلمة المرور الافتراضية القديمة غير مفعلة', !auth.hasPassword());
check('كلمة المرور الافتراضية القديمة لا تفتح القفل', !(await auth.login('SAYPER')).ok);
const configured = await auth.setPassword('NewSecret99');
check('إنشاء كلمة مرور يختارها المستخدم ينجح', configured.ok, configured.error || '');
check('حفظ كلمة المرور لا يفعّل القفل تلقائياً', !auth.lockEnabled());
const lockResult = auth.setLockEnabled(true);
check('تفعيل القفل الاختياري ينجح', lockResult.ok && auth.lockEnabled());
check('تفعيل القفل يفتح الجلسة الحالية', auth.isAuthed());
auth.lockNow();
check('القفل يُنهي الجلسة عند تفعيله', !auth.isAuthed());
check('دخول بكلمة مرور خاطئة يفشل', !(await auth.login('WRONG')).ok);
check('كلمة المرور الجديدة تفتح القفل', (await auth.login('NewSecret99')).ok);
const chg = await auth.changePassword('NewSecret99', 'AnotherSecret44');
check('تغيير كلمة المرور ينجح', chg.ok, chg.error || '');
check('كلمة المرور الجديدة تعمل', (await auth.login('AnotherSecret44')).ok);
check('كلمة المرور السابقة لم تعد تعمل', !(await auth.login('NewSecret99')).ok);
auth.lockNow();
check('القفل يُنهي الجلسة', !auth.isAuthed());
check('إيقاف القفل يعيد فتح التطبيق دون كلمة مرور', auth.setLockEnabled(false).ok && auth.isAuthed());

/* ================= 1b. النطق المسجّل ================= */
section('النطق المسجّل والنطق المدمج');
const speech = await mod('assets/js/core/speech.js');
const savedAudio = globalThis.Audio;
const savedSynthesis = window.speechSynthesis;
const savedUtterance = window.SpeechSynthesisUtterance;
const savedGlobalUtterance = globalThis.SpeechSynthesisUtterance;
const savedWarn = console.warn;
let synthesized = 0;
globalThis.Audio = class {
  pause() {}
  play() { return Promise.reject(new Error('recording unavailable')); }
};
window.speechSynthesis = {
  cancel() {},
  getVoices: () => [],
  addEventListener() {},
  speak() { synthesized++; },
};
window.SpeechSynthesisUtterance = class {};
globalThis.SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
console.warn = () => {};
speech.registerSoundBank({ 'test:recorded': './missing-recording.mp3' });
check('التسجيل المسجّل يُختار للتشغيل', speech.speak('test:recorded') === true);
await new Promise((resolve) => setTimeout(resolve, 0));
check('فشل التسجيل لا يشغّل صوت المتصفح بديلاً', synthesized === 0);
check('النص غير المسجّل يبقى قابلاً للنطق المدمج', speech.speak('ordinary word') === true && synthesized === 1);
console.warn = savedWarn;
if (savedAudio === undefined) delete globalThis.Audio;
else globalThis.Audio = savedAudio;
if (savedSynthesis === undefined) delete window.speechSynthesis;
else window.speechSynthesis = savedSynthesis;
if (savedUtterance === undefined) delete window.SpeechSynthesisUtterance;
else window.SpeechSynthesisUtterance = savedUtterance;
if (savedGlobalUtterance === undefined) delete globalThis.SpeechSynthesisUtterance;
else globalThis.SpeechSynthesisUtterance = savedGlobalUtterance;

/* ================= 2. توليد الأسئلة ================= */
section('مولّد الأسئلة');
const qg = await mod('assets/js/core/quizgen.js');
const TYPES = ['mcq', 'fill', 'order', 'match', 'translate', 'listen'];
for (const type of TYPES) {
  const list = qg.buildQuestions({ source: 'all', types: [type], count: 12, adaptive: false });
  check(`النوع «${type}» يولّد ١٢ سؤالاً`, list.length === 12, `أنتج ${list.length}`);
  let bad = 0;
  for (const q of list) {
    if (q.ui === 'choice') {
      const correct = q.options.filter((o) => o.correct).length;
      if (correct !== 1 || q.options.length < 3) bad++;
      if (!q.speakText && q.type === 'listen') bad++;
    } else if (q.ui === 'order') {
      if (q.tokens.length !== q.correctOrder.length) bad++;
      if ([...q.tokens].sort().join(' ') !== [...q.correctOrder].sort().join(' ')) bad++;
    } else if (q.ui === 'match') {
      if (!q.pairs || q.pairs.length < 3) bad++;
      if (q.pairs.some((p) => !p.en || !p.ar)) bad++;
    } else if (q.ui === 'input') {
      if (!q.accept || !q.accept.length || !q.answerText) bad++;
    }
    if (!q.instruction || !q.explain) bad++;
  }
  check(`بنية أسئلة «${type}» سليمة`, bad === 0, `${bad} سؤالاً معطوباً`);
}

const fillQ = qg.buildQuestions({ source: 'vocab', types: ['fill'], count: 5 })[0];
check('ملء الفراغ يحتوي فراغاً فعلياً', fillQ && fillQ.stemHtml.includes('_____'));
const relQ = qg.buildRelationQuestions(6);
check('أسئلة جدول الضمائر (٦ على الأقل)', relQ.length >= 4, `أنتج ${relQ.length}`);
const smart = qg.buildQuestions({ source: 'smart', types: ['mcq', 'fill', 'translate', 'listen'], count: 10, adaptive: true });
check('التدريب الذكي يعمل', smart.length === 10);
check('كل مصدر يعطي عناصر', ['all', 'pronouns', 'connectors', 'questions', 'vocab', 'sentences', 'reading', 'key'].every((s) => qg.entriesForSource(s).length > 0));

/* ================= 3. التحقق من الإجابات ================= */
section('التحقق المرن من الإجابات');
const qr = await mod('assets/js/views/quiz-runner.js');
const enQ = { inputDir: 'ltr', accept: [qg.normEnPublic('I am a student')] };
check('إجابة إنجليزية صحيحة تُقبل', qr.checkTextAnswer('I am a student.', enQ).ok);
check('إجابة إنجليزية بحالة أحرف مختلفة تُقبل', qr.checkTextAnswer('  i AM a Student  ', enQ).ok);
check('إجابة إنجليزية خاطئة تُرفض', !qr.checkTextAnswer('You are a teacher', enQ).ok);
check('خطأ إملائي بسيط يُقبل كإجابة قريبة', qr.checkTextAnswer('I am a studnet', enQ).ok);
const arQ = { inputDir: 'rtl', accept: [qg.normArPublic('كتاب')] };
check('إجابة عربية صحيحة تُقبل', qr.checkTextAnswer('كتاب', arQ).ok);
check('إجابة عربية مع «ال» تُقبل', qr.checkTextAnswer('الكتاب', arQ).ok);
check('إجابة عربية خاطئة تُرفض', !qr.checkTextAnswer('قلم', arQ).ok);
check('الإجابة الفارغة تُرفض', !qr.checkTextAnswer('', arQ).ok);

/* ================= 4. التحفيز والنقاط ================= */
section('النقاط والسلاسل والشارات');
const store = await mod('assets/js/core/store.js');
const { goalForToday, exportAll, importAll, resetProgress } = store;
const gamify = await mod('assets/js/core/gamify.js');
resetProgress();
const before = store.progress.points;
let last = null;
for (let i = 0; i < 6; i++) last = gamify.recordAnswer({ correct: true, itemId: `test:${i}`, type: 'mcq', topic: 't', level: 'a1', seconds: 5 });
check('النقاط تزداد مع كل إجابة', store.progress.points > before, `${before} → ${store.progress.points}`);
check('عدّاد الأسئلة يتحدث', store.progress.totals.questions === 6, String(store.progress.totals.questions));
check('الدقة ١٠٠٪ بعد إجابات صحيحة', gamify.accuracy() === 100);
check('سلسلة الإجابات المتتالية تعمل', store.progress.combo === 6 && store.progress.bestCombo === 6);
check('شارة «أول خطوة» تُمنح', store.progress.badges.includes('first-step'));
const wrongRes = gamify.recordAnswer({ correct: false, itemId: 'test:9', type: 'fill', topic: 't', level: 'a1', seconds: 3 });
check('الإجابة الخاطئة تصفّر السلسلة', store.progress.combo === 0);
check('نشاط اليوم مسجّل', (store.progress.activity[Object.keys(store.progress.activity)[0]].q || 0) === 7);
check('سلسلة الأيام تبدأ', store.progress.streak >= 1 && store.progress.lastStudyDay.length === 10);
const goal = goalForToday();
check('هدف اليوم يُحسب', goal.target >= 5 && goal.done === 7, JSON.stringify(goal));
const acc2 = gamify.accuracy();
check('الدقة تنخفض بعد الخطأ', acc2 === 86, `${acc2}%`);
const badgeStates = gamify.badgesWithState();
check('قائمة الشارات كاملة', badgeStates.length >= 20 && badgeStates.every((b) => 'earned' in b));
check('stats المستوى تُحسب', gamify.levelStats('a1').total === 6);

/* ================= 5. التكرار المتباعد ================= */
section('التكرار المتباعد (SRS)');
const srs = await mod('assets/js/core/srs.js');
resetProgress();
const it0 = srs.getItem('srs:test');
check('عنصر جديد صندوقه صفر', it0.box === 0 && it0.seen === 0);
srs.gradeItem('srs:test', 2);
srs.gradeItem('srs:test', 2);
const it2 = srs.gradeItem('srs:test', 2);
check('الصندوق يتقدم مع الإجابات الصحيحة', it2.box === 3, `box=${it2.box}`);
check('تاريخ الاستحقاق في المستقبل', it2.due > srs.getItem('srs:test').last);
srs.gradeItem('srs:test', 0);
check('الخطأ يعيد الصندوق للصفر', srs.getItem('srs:test').box === 0);
check('الأخطاء تُحتسب', srs.getItem('srs:test').wrong === 1);
const master = srs.masteryOf('srs:test');
check('نسبة الإتقان محسوبة', typeof master === 'number' && master >= 0 && master <= 100, `${master}`);
const pool = qg.entriesForSource('pronouns').slice(0, 40);
const session = srs.buildSession(pool, 15);
check('جلسة البطاقات تُبنى بحجم صحيح', session.length === 15 && new Set(session.map((e) => e.itemId)).size === 15);
const weak = srs.weakestFirst(pool, 5);
check('ترتيب الأضعف يعمل', weak.length === 5 && weak[0].itemId);
store.saveProgress((p) => {
  p.items = {
    overdueWeak: { seen: 4, correct: 1, wrong: 3, box: 1, due: '2026-10-17', last: '2026-10-13' },
    dueStrong: { seen: 4, correct: 4, wrong: 0, box: 5, due: '2026-10-20', last: '2026-10-16' },
    futureMastered: { seen: 5, correct: 5, wrong: 0, box: 7, due: '2026-10-25', last: '2026-10-18' },
  };
});
const smartEntries = [
  { itemId: 'dueStrong' }, { itemId: 'overdueWeak' }, { itemId: 'futureMastered' },
  { itemId: 'newOne' }, { itemId: 'newTwo' }, { itemId: 'newOne' },
];
const smartPlan = srs.smartReviewPlan(smartEntries, 3, '2026-10-20');
check('المراجعة الذكية تبدأ بالأقدم والأضعف', smartPlan.entries[0].itemId === 'overdueWeak');
check('المراجعة الذكية تستبعد المؤجل وتزيل التكرار',
  smartPlan.entries.map((entry) => entry.itemId).join(',') === 'overdueWeak,dueStrong,newOne');
check('ملخص المراجعة الذكية يحصي المستحق والضعيف والجديد',
  smartPlan.dueCount === 2 && smartPlan.weakCount === 1 && smartPlan.newCount === 1);
const smallSmartPlan = srs.smartReviewPlan(smartEntries, 1, '2026-10-20');
check('ملخص الجلسة يطابق حجمها عند كثرة الكلمات المستحقة',
  smallSmartPlan.dueCount === 1 && smallSmartPlan.weakCount === 1 && smallSmartPlan.entries.length === 1);
check('المراجعة الذكية تحد الكلمات الجديدة بخمس',
  srs.smartReviewPlan(['1', '2', '3', '4', '5', '6'].map((id) => ({ itemId: `fresh${id}` })), 20).newCount === 5);
check('مجموعة المستحق فقط لا تضم الجديد أو المؤجل',
  srs.dueEntries(smartEntries, '2026-10-20').map((entry) => entry.itemId).join(',') === 'dueStrong,overdueWeak');

/* ================= 6. الإشعارات ================= */
section('منطق الإشعارات والتذكير');
const notify = await mod('assets/js/core/notify.js');
const { saveSettings } = store;
saveSettings({ reminder: { enabled: false } });
check('التذكير مُعطَّل لا يُطلق', !notify.shouldFireNow(new Date()));
saveSettings({ reminder: { enabled: true, time: '00:00', days: [0, 1, 2, 3, 4, 5, 6], lastFired: '' } });
check('التذكير المُفعَّل يُطلق بعد الوقت', notify.shouldFireNow(new Date()));
/* التاريخ المحلي (لا UTC) — التطبيق يقارن بالتاريخ المحلي، فنتجنّب فرق المنطقة الزمنية */
const localTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
saveSettings({ reminder: { lastFired: localTodayKey() } });
check('لا يُطلق مرتين في اليوم', !notify.shouldFireNow(new Date()));
saveSettings({ reminder: { lastFired: '' } });
const fireRes = await notify.fireReminder({ test: false });
check('إطلاق التذكير يعمل (وضع داخل الموقع بدون إذن)', fireRes.ok === true, JSON.stringify(fireRes));
check('نص التذكير يحتوي المتبقي من الهدف', /باقي/.test(notify.reminderBody()));
const wod = notify.wordOfTheDay();
check('كلمة اليوم تُختار من المنهج', !!wod && !!wod.en && !!wod.ar, JSON.stringify(wod));
check('نص التذكير يحتوي كلمة اليوم', notify.reminderBody().includes(wod.en));
check('وقت التذكير القادم نص عربي', typeof notify.nextReminderText() === 'string' && notify.nextReminderText().length > 3);

/* جدولة Android محلياً واستخدام إذن الإشعارات الأصلي */
const nativeCalls = [];
const updateWorkerCalls = [];
const localNotifications = {
  async checkPermissions() { return { display: 'prompt' }; },
  async requestPermissions() { nativeCalls.push('permission'); return { display: 'granted' }; },
  async createChannel(channel) { nativeCalls.push(['channel', channel]); },
  async cancel(options) { nativeCalls.push(['cancel', options]); },
  async schedule(options) { nativeCalls.push(['schedule', options]); },
};
globalThis.window.Capacitor = {
  isNativePlatform: () => true,
  getPlatform: () => 'android',
  Plugins: {
    LocalNotifications: localNotifications,
    UpdateChecker: { async setEnabled(options) { updateWorkerCalls.push(options.enabled); } },
  },
};
delete globalThis.Notification;
saveSettings({ reminder: { enabled: true, time: '09:30', days: [1, 4] } });
const androidSchedule = await notify.syncReminderSchedule({ requestPermission: true });
const androidRequest = nativeCalls.find(([kind]) => kind === 'schedule')?.[1];
const reminderChannel = nativeCalls.find(([kind]) => kind === 'channel')?.[1];
check('Android notifications request permission and schedule locally', androidSchedule.ok && nativeCalls.includes('permission'));
check('Android background update checks follow the notification master switch', updateWorkerCalls.at(-1) === true);
check('Android reminders repeat on selected weekdays', androidRequest?.notifications?.length === 2
  && androidRequest.notifications[0].schedule.on.weekday === 2
  && androidRequest.notifications[1].schedule.on.weekday === 5);
check('Android reminder channel enables sound and vibration', reminderChannel?.sound === 'notification'
  && reminderChannel.vibration === true && reminderChannel.importance === 4);
const androidTest = await notify.fireReminder({ test: true });
check('Android test uses a native notification', androidTest.ok
  && nativeCalls.some(([kind, payload]) => kind === 'schedule' && payload.notifications?.[0]?.id === 399));
saveSettings({ reminder: { enabled: false } });
await notify.syncReminderSchedule();
check('Disabling reminders cancels Android schedules', nativeCalls.some(([kind, payload]) => kind === 'cancel' && payload.notifications?.length === 7));
check('Disabling notifications cancels Android background update checks', updateWorkerCalls.at(-1) === false);

/* جدولة سطح المكتب عبر الجسر المحدود في preload */
let desktopSchedule;
globalThis.window.Capacitor = undefined;
globalThis.window.leaNotifications = {
  async requestPermission() { return { permission: 'granted' }; },
  async show() { return true; },
  async schedule(options) { desktopSchedule = options; return { ok: true, mode: 'desktop' }; },
  async cancel() { return true; },
};
saveSettings({ reminder: { enabled: true, launchAtLogin: true, time: '20:00', days: [0, 6] } });
const desktopResult = await notify.syncReminderSchedule();
check('Desktop schedule reaches the native adapter', desktopResult.ok
  && desktopSchedule?.time === '20:00' && desktopSchedule?.launchAtLogin === true);
check('Notification adapter detects desktop', notify.notificationPlatform() === 'desktop');
const updateStore = await mod('assets/js/core/store.js');
const priorNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: true } });
try {
  let showUpdateNotification = false;
  let updateNotificationAttempts = 0;
  window.leaNotifications.show = async () => {
    updateNotificationAttempts++;
    return showUpdateNotification;
  };
  window.leaUpdates = { async getRuntime() { return { platform: 'win32' }; } };
  updateStore.saveSettings({ reminder: { enabled: true } });
  localStorage.removeItem('lea.update.lastCheck');
  localStorage.removeItem('lea.update.backgroundCheck');
  localStorage.removeItem('lea.update.notified');
  localStorage.removeItem('lea.update.pending');
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      tag_name: 'v1.0.15',
      name: 'English Academy v1.0.15',
      body: 'Release notes',
      html_url: 'https://github.com/ammarcharef06/Learn-English/releases/tag/v1.0.15',
      assets: [
        { ...updateAssets[1], size: 8000000, digest: `sha256:${'b'.repeat(64)}` },
        { name: 'SHA256SUMS.txt', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.15/SHA256SUMS.txt' },
      ],
    }),
  });
  await updater.checkForUpdateInBackground();
  check('Background update check stores a new release even when notification display fails',
    JSON.parse(localStorage.getItem('lea.update.pending') || 'null')?.version === '1.0.15'
    && !localStorage.getItem('lea.update.notified'));
  showUpdateNotification = true;
  localStorage.setItem('lea.update.backgroundCheck', String(Date.now()));
  await updater.checkForUpdateInBackground();
  check('Failed update notification is retried and only marked after display succeeds',
    updateNotificationAttempts >= 2 && localStorage.getItem('lea.update.notified') === '1.0.15');
  check('Pending update is preserved when background check is throttled',
    JSON.parse(localStorage.getItem('lea.update.pending') || 'null')?.version === '1.0.15');
} finally {
  globalThis.fetch = oldFetch;
  if (priorNavigator) Object.defineProperty(globalThis, 'navigator', priorNavigator);
  else delete globalThis.navigator;
  window.leaUpdates = undefined;
}
globalThis.window.leaNotifications = undefined;
saveSettings({ reminder: { enabled: false } });
const settingsSource = await readFile(join(ROOT, 'assets/js/views/settings.js'), 'utf8');
check('Settings UI has no legacy Push or install controls', !/OneSignal|pushOn|installBtn|appIdInput/.test(settingsSource));
check('Settings UI keeps one notification switch and a test action', /id="remEnabled"/.test(settingsSource)
  && /id="testReminder"/.test(settingsSource));

delete globalThis.Notification;

/* ================= 7. التخزين والنسخ الاحتياطي ================= */
section('التخزين والنسخ الاحتياطي');
const exported = exportAll();
check('التصدير ينتج JSON صالحاً', (() => { try { JSON.parse(exported); return true; } catch { return false; } })());
const parsed = JSON.parse(exported);
check('النسخة تحتوي الإعدادات والتقدم', !!parsed.settings && !!parsed.progress);
const pointsBefore = store.progress.points;
resetProgress();
check('التصفير يمسح النقاط', store.progress.points === 0);
store.saveSettings({ security: { lockEnabled: true } });
parsed.settings.push = { enabled: true, appId: 'legacy-app-id' };
importAll(JSON.stringify(parsed));
check('الاستيراد يستعيد التقدم', store.progress.points === pointsBefore, `${store.progress.points} مقابل ${pointsBefore}`);
check('الاستيراد يحافظ على إعداد القفل المحلي', store.settings.security.lockEnabled);
check('استيراد النسخة الاحتياطية لا يعيد إعدادات Push القديمة', !Object.hasOwn(store.settings, 'push'));
store.saveSettings({ security: { lockEnabled: false } });

/* ================= 8. الترجمة ================= */
section('الترجمة (عربي/إنجليزي)');
const i18n = await mod('assets/js/core/i18n.js');
i18n.setUiLang('ar');
check('العربية هي الافتراضية', i18n.t('nav.home') === 'الرئيسية');
check('نص حالة التذكير مترجم بالعربية', i18n.t('set.reminderOn') === 'التذكير مُفعَّل');
i18n.setUiLang('en');
check('الإنجليزية تعمل', i18n.t('nav.home') === 'Home');
check('نص حالة التذكير مترجم بالإنجليزية', i18n.t('set.reminderOn') === 'Reminder active');
check('وضع الاتجاه LTR في الإنجليزية', i18n.isRTL() === false);
i18n.setUiLang('ar');
check('مفتاح غير موجود يعود كما هو', i18n.t('nope.missing') === 'nope.missing');

section('إمكانية الوصول');
const theme = await mod('assets/js/core/theme.js');
store.saveSettings({ highContrast: true, reduceAnimations: true });
theme.applyAccessibility();
check('التباين المرتفع يُطبّق على الواجهة', document.documentElement.dataset.contrast === 'high');
check('تقليل الحركة يُطبّق على الواجهة', document.documentElement.dataset.reduceMotion === 'true');
store.saveSettings({ highContrast: false, reduceAnimations: false });
theme.applyAccessibility();

section('المجتمع التعليمي');
const community = await mod('assets/js/core/community.js');
const communitySafety = await mod('assets/js/core/community-safety.js');
const communitySource = await readFile(join(ROOT, 'assets/js/core/community.js'), 'utf8');
const communityConfig = await mod('assets/js/core/community-config.js');
const progressBeforeCommunityInit = localStorage.getItem('lea.progress.v1');
check('إعدادات مشروع Supabase العام مفعّلة', community.communityConfigured() === true
  && communityConfig.COMMUNITY_CONFIG.supabaseUrl.startsWith('https://')
  && communityConfig.COMMUNITY_CONFIG.publishableKey.startsWith('sb_publishable_'));
check('مفاتيح التخزين المحلي للدروس تبقى مستقلة عن Auth المجتمع',
  /storageKey:\s*'lea\.community\.auth\.v1'/.test(communitySource)
    && localStorage.getItem('lea.progress.v1') === progressBeforeCommunityInit);
check('فلتر الرسائل يلتقط ألفاظ الإساءة الواضحة', communitySafety.containsBlockedLanguage('This is FUCK.'));
check('فلتر الرسائل يلتقط تمويه علامات الترقيم', communitySafety.containsBlockedLanguage('f.u.c.k'));
check('فلتر الرسائل لا يمنع جملة تعليمية سليمة', !communitySafety.containsBlockedLanguage('I enjoy learning English.'));

/* ================= 9. المنهج ================= */
section('المنهج والمطالعات');
const cur = await mod('assets/js/data/curriculum.js');
check('ثلاثة مستويات', cur.LEVELS.length === 3);
check('١٨ وحدة إجمالاً', cur.ALL_UNITS.length === 18);
check('١٢ مطالعة', cur.READINGS.length === 12);
check('كل وحدة لها مفردات وقواعد وجمل', cur.ALL_UNITS.every((u) => u.vocab.length && u.grammar.length && u.sentences.length));
check('المطالعات موزعة على المستويات', ['a1', 'a2', 'b1'].every((l) => cur.readingsOfLevel(l).length === 4));
check('اقتراح الدرس التالي يعمل', cur.nextLessonSuggestion() !== null);
check('إحصاءات المنهج صحيحة', cur.curriculumStats().vocab >= 280);

/* ================= 10. الأدوات المساعدة ================= */
section('الأدوات المساعدة');
const utils = await mod('assets/js/core/utils.js');
check('تنقية HTML تمنع الحقن', utils.esc('<script>x</script>') === '&lt;script&gt;x&lt;/script&gt;');
check('الخلط يحافظ على العناصر', utils.shuffle([1, 2, 3, 4, 5]).sort().join() === '1,2,3,4,5');
check('مفتاح التاريخ بصيغة صحيحة', /^\d{4}-\d{2}-\d{2}$/.test(utils.todayKey()));
check('حساب النسبة', utils.pct(3, 4) === 75);
check('مدة مقروءة', utils.fmtDuration(125).includes('2'));
check('وقت التذكير بصيغة عربية', utils.prettyTimeAr('19:00').includes('7'));
let headingFocus = false, headingTabIndex = null;
utils.focusMainHeading({
  querySelector: () => ({
    setAttribute: (name, value) => { if (name === 'tabindex') headingTabIndex = value; },
    focus: (options) => { headingFocus = options.preventScroll === true; },
  }),
});
check('الانتقال بين الصفحات ينقل التركيز إلى عنوان المحتوى', headingFocus && headingTabIndex === '-1');
const router = await mod('assets/js/core/router.js');
const previousHash = window.location.hash;
const routeOrder = [];
router.route('/render-focus-test', () => routeOrder.push('render'));
router.onRouteRendered(() => routeOrder.push('focused'));
window.location.hash = '#/render-focus-test';
await router.resolve();
check('يُنفّذ نقل التركيز بعد اكتمال رسم الصفحة', routeOrder.join(',') === 'render,focused');
window.location.hash = previousHash;

/* ================= التقرير ================= */
console.log(`\n${'='.repeat(46)}`);
if (failures.length) {
  console.log(`❌ فشل ${failures.length} اختباراً من ${pass + failures.length}:`);
  failures.forEach((f) => console.log(`   • ${f}`));
  process.exit(1);
}
console.log(`✅ نجحت كل الاختبارات: ${pass}`);
process.exit(0);
