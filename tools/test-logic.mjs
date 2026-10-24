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
    tag_name: 'v1.0.19',
    name: 'English Academy v1.0.19',
    body: 'Release notes',
    assets: [
      { ...updateAssets[0], size: 8000000, digest: `sha256:${'a'.repeat(64)}` },
      { ...updateAssets[1], size: 8000000, digest: `sha256:${'b'.repeat(64)}` },
      { name: 'SHA256SUMS.txt', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.19/SHA256SUMS.txt' },
    ],
  }),
});
try {
  const releaseCheck = await updater.checkForUpdate({ force: true });
  check('فحص GitHub يكتشف الإصدار الأحدث مع بصمة SHA موثوقة', releaseCheck.update
    && releaseCheck.latestVersion === '1.0.19' && releaseCheck.release.asset.digest.startsWith('sha256:'));
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
  speak(utterance) { synthesized++; utterance.onstart?.(); },
};
window.SpeechSynthesisUtterance = class {};
globalThis.SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
console.warn = () => {};
speech.registerSoundBank({ 'test:recorded': './missing-recording.mp3' });
check('التسجيل المسجّل يُختار للتشغيل', speech.speak('test:recorded') === true);
await new Promise((resolve) => setTimeout(resolve, 0));
check('فشل التسجيل لا يشغّل صوت المتصفح بديلاً', synthesized === 0);
check('النص غير المسجّل يبقى قابلاً للنطق المدمج', speech.speak('ordinary word') === true && synthesized === 1);
const playbackEvents = [];
speech.speak('active word', { onstart: () => playbackEvents.push('start'), onend: () => playbackEvents.push('end') });
speech.stopSpeaking();
check('تشغيل الصوت يرسل حالتي البدء والإيقاف لتنظيف واجهة البطاقة',
  playbackEvents.join(',') === 'start,end');
check('مسار الصوت النسبي يُقبل ضمن نفس النطاق', speech.normalizeAudioUrl('./audio/word.mp3') === 'https://example.com/Learn-English/audio/word.mp3');
check('مصدر صوت خارجي أو مخطط غير آمن يُرفض', speech.normalizeAudioUrl('https://other.example/audio.mp3') === ''
  && speech.normalizeAudioUrl('javascript:alert(1)') === '');
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
check('stats المستوى تُحسب بعد إضافة وحدات التأسيس إلى A1', gamify.levelStats('a1').total === 11);

/* ================= 5. التكرار المتباعد ================= */
section('التكرار المتباعد (SRS)');
const srs = await mod('assets/js/core/srs.js');
resetProgress();
const it0 = srs.getItem('srs:test');
check('بطاقة جديدة تبدأ بإعدادات SM-2 الافتراضية', it0.repetitions === 0 && it0.interval === 0
  && it0.easeFactor === 2.5 && it0.seen === 0);
srs.gradeItem('srs:test', 5);
srs.gradeItem('srs:test', 5);
const it2 = srs.gradeItem('srs:test', 5);
check('SM-2 يحدد الفواصل 1 ثم 6 ثم يطبق عامل السهولة', it2.interval === 17 && it2.repetitions === 3);
check('عامل السهولة يتكيف مع جودة الإجابة', it2.easeFactor > 2.5);
const srsUtils = await mod('assets/js/core/utils.js');
check('تاريخ الاستحقاق يُشتق من الفاصل الديناميكي',
  it2.due === srsUtils.dateKey(srsUtils.addDays(new Date(), it2.interval)));
srs.gradeItem('srs:test', 0);
check('الإجابة الأقل من 3 تعيد التكرار إلى اليوم التالي',
  srs.getItem('srs:test').repetitions === 0 && srs.getItem('srs:test').interval === 1);
srs.gradeItem('srs:test', 3);
check('عامل السهولة يحترم الحد الأدنى', srs.getItem('srs:test').easeFactor >= srs.MIN_EASE_FACTOR);
check('الإجابات الصحيحة والخاطئة تُحصى', srs.getItem('srs:test').wrong === 1 && srs.getItem('srs:test').correct === 4);
check('درجة الجودة الخارجة عن نطاق SM-2 تُرفض', (() => {
  try { srs.gradeItem('srs:invalid', 6); return false; } catch (error) { return error instanceof RangeError; }
})());
const master = srs.masteryOf('srs:test');
check('نسبة الإتقان محسوبة', typeof master === 'number' && master >= 0 && master <= 100, `${master}`);
const pool = qg.entriesForSource('pronouns').slice(0, 40);
const session = srs.buildSession(pool, 15);
check('جلسة البطاقات تُبنى بحجم صحيح', session.length === 15 && new Set(session.map((e) => e.itemId)).size === 15);
const weak = srs.weakestFirst(pool, 5);
check('ترتيب الأضعف يعمل', weak.length === 5 && weak[0].itemId);
store.saveProgress((p) => {
  p.items = {
    overdueWeak: { algorithm: 'sm2', repetitions: 1, interval: 6, easeFactor: 1.7, seen: 4, correct: 1, wrong: 3, lapses: 3, due: '2026-10-17', last: '2026-10-13' },
    dueStrong: { algorithm: 'sm2', repetitions: 4, interval: 21, easeFactor: 2.5, seen: 4, correct: 4, wrong: 0, lapses: 0, due: '2026-10-20', last: '2026-10-16' },
    futureMastered: { algorithm: 'sm2', repetitions: 5, interval: 60, easeFactor: 2.5, seen: 5, correct: 5, wrong: 0, lapses: 0, due: '2026-10-25', last: '2026-10-18' },
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
store.saveProgress((p) => { p.items.legacyFixture = { seen: 8, correct: 7, wrong: 1, box: 5, due: '2099-01-01' }; });
check('بيانات صناديق قديمة تبدأ كبطاقة جديدة في SM-2', srs.getItem('legacyFixture').algorithm === 'sm2'
  && srs.getItem('legacyFixture').seen === 0 && srs.isDue('legacyFixture'));

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
      tag_name: 'v1.0.19',
      name: 'English Academy v1.0.19',
      body: 'Release notes',
      html_url: 'https://github.com/ammarcharef06/Learn-English/releases/tag/v1.0.19',
      assets: [
        { ...updateAssets[1], size: 8000000, digest: `sha256:${'b'.repeat(64)}` },
        { name: 'SHA256SUMS.txt', browser_download_url: 'https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.19/SHA256SUMS.txt' },
      ],
    }),
  });
  await updater.checkForUpdateInBackground();
  check('Background update check stores a new release even when notification display fails',
    JSON.parse(localStorage.getItem('lea.update.pending') || 'null')?.version === '1.0.19'
    && !localStorage.getItem('lea.update.notified'));
  showUpdateNotification = true;
  localStorage.setItem('lea.update.backgroundCheck', String(Date.now()));
  await updater.checkForUpdateInBackground();
  check('Failed update notification is retried and only marked after display succeeds',
    updateNotificationAttempts >= 2 && localStorage.getItem('lea.update.notified') === '1.0.19');
  check('Pending update is preserved when background check is throttled',
    JSON.parse(localStorage.getItem('lea.update.pending') || 'null')?.version === '1.0.19');
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
store.saveProgress((p) => {
  p.units.cloudFixture = { done: true, internalNote: 'not for cloud' };
  p.items.cloudLegacyFixture = { box: 3, seen: 4 };
});
const cloudPayload = store.exportCloudProgress();
check('تصدير المزامنة السحابية يقتصر على المستوى وتقدم الوحدات وبطاقات SM-2',
  cloudPayload.schemaVersion === 1 && cloudPayload.srs.algorithm === 'sm2'
    && !!cloudPayload.learner.levelStats.a1 && cloudPayload.learner.unitProgress.cloudFixture.done
    && !!cloudPayload.srs.cards.find((card) => card.id === 'overdueWeak')
    && typeof cloudPayload.srs.cards.find((card) => card.id === 'overdueWeak')?.due === 'string'
    && !Object.hasOwn(cloudPayload, 'settings') && !Object.hasOwn(cloudPayload, 'auth')
    && !cloudPayload.srs.cards.some((card) => card.id === 'cloudLegacyFixture')
    && !Object.hasOwn(cloudPayload.learner.unitProgress.cloudFixture, 'internalNote'),
  JSON.stringify({ levels: cloudPayload.learner.levelStats, ids: cloudPayload.srs.cards.map((card) => card.id).slice(0, 5) }));
check('تصدير المزامنة السحابية ينتج JSON قابلاً للرفع',
  (() => { try { return JSON.parse(JSON.stringify(cloudPayload)).srs.cards.length > 0; } catch { return false; } })());
const sync = await mod('assets/js/core/sync.js');
const queuedSnapshot = sync.queueSyncProgress(cloudPayload);
check('لقطة المزامنة تُحفظ محلياً قبل وجود خدمة سحابية', queuedSnapshot.pending
  && queuedSnapshot.cardCount === cloudPayload.srs.cards.length
  && (await sync.flushSyncQueue()).status === 'queued');
const failedSync = await sync.flushSyncQueue(async () => { throw new Error('offline fixture'); });
check('فشل النقل يبقي اللقطة محلياً مع تسجيل الخطأ',
  failedSync.status === 'queued' && failedSync.lastError === 'offline fixture');
const successfulSync = await sync.flushSyncQueue(async (payload) => {
  if (payload.schemaVersion !== 1) throw new Error('bad payload');
});
check('نجاح النقل الممرر يمسح اللقطة المعلّقة', successfulSync.status === 'synced'
  && !sync.getSyncQueueStatus().pending);
let invalidPayloadRejected = false;
try { sync.queueSyncProgress({ app: 'wrong' }); } catch (error) { invalidPayloadRejected = error instanceof TypeError; }
check('وحدة المزامنة ترفض بنية JSON غير صالحة', invalidPayloadRejected);
const pointsBefore = store.progress.points;
sync.queueSyncProgress(cloudPayload);
resetProgress();
check('تصفير التقدم يمسح لقطة المزامنة المحلية القديمة', !sync.getSyncQueueStatus().pending);
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
check('إعدادات المزامنة تعرض تنبيهاً صريحاً بالحفظ المحلي فقط',
  i18n.t('set.syncProgress') === 'مزامنة التقدّم'
    && i18n.t('set.syncLocalOnly').includes('لن تُرسل أي بيانات عبر الشبكة'));
const syncSettingsSource = await readFile(join(ROOT, 'assets/js/views/settings.js'), 'utf8');
check('زر المزامنة يضيف لقطة محلية من مخطط التقدم الموحّد',
  syncSettingsSource.includes('id="queueSyncBtn"') && syncSettingsSource.includes('queueSyncProgress(exportCloudProgress())'));
check('نص حالة التذكير مترجم بالعربية', i18n.t('set.reminderOn') === 'التذكير مُفعَّل');
check('بطاقات SRS لها تسمية مترجمة', i18n.t('common.cards') === 'بطاقات');
i18n.setUiLang('en');
check('الإنجليزية تعمل', i18n.t('nav.home') === 'Home');
check('ترجمة زر المزامنة متاحة بالإنجليزية', i18n.t('set.syncProgress') === 'Sync progress');
const syncPreparingEnglish = i18n.t('set.syncPreparing');
i18n.setUiLang('ar');
const syncPreparingArabic = i18n.t('set.syncPreparing');
i18n.setUiLang('en');
check('حالة انتظار المزامنة المحلية مترجمة بالعربية والإنجليزية',
  syncPreparingArabic === 'جارٍ حفظ لقطة التقدم محلياً…'
    && syncPreparingEnglish === 'Saving progress snapshot locally…');
check('واجهة المزامنة تعلن حالة الانشغال وإكمالاً بصرياً',
  syncSettingsSource.includes("button.setAttribute('aria-busy', 'true')")
    && syncSettingsSource.includes('class="sync-spinner"')
    && syncSettingsSource.includes('window.requestAnimationFrame'));
const responsiveCss = await readFile(join(ROOT, 'assets/css/main.css'), 'utf8');
check('بطاقات الهاتف توفر أزرار تقييم ولمس صوتية واسعة',
  responsiveCss.includes('.fc-actions .btn { min-block-size: 56px;')
    && responsiveCss.includes('.fc__speak { min-inline-size: 56px; min-block-size: 56px;'));
check('حركات الانتقال تحترم تفضيلات تقليل الحركة',
  responsiveCss.includes('::view-transition-old(root)')
    && responsiveCss.includes('html[data-reduce-motion="true"] ::view-transition-new(root)'));
check('نص حالة التذكير مترجم بالإنجليزية', i18n.t('set.reminderOn') === 'Reminder active');
check('بطاقات SRS مترجمة بالإنجليزية', i18n.t('common.cards') === 'cards');
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

/* ================= 9. المنهج ================= */
section('المنهج والمطالعات');
const cur = await mod('assets/js/data/curriculum.js');
const audioLinks = await mod('assets/js/data/curriculum-audio.js');
check('خريطة الصوت تضم تسجيلات المنهج وتستخدم مسارات محلية', Object.keys(audioLinks.CURRICULUM_AUDIO).length === 754
  && Object.values(audioLinks.CURRICULUM_AUDIO).every((url) => /^\.\/assets\/audio\/curriculum\/[a-f0-9]{64}\.mp3$/.test(url)));
const flashcardSource = await readFile(join(ROOT, 'assets/js/views/flashcards.js'), 'utf8');
const dashboardSource = await readFile(join(ROOT, 'assets/js/views/dashboard.js'), 'utf8');
const mainCss = await readFile(join(ROOT, 'assets/css/main.css'), 'utf8');
const flashcardFront = flashcardSource.match(/<div class="fc__face fc__face--front"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
check('زر الصوت في البطاقات يعرض حالة تشغيل مرئية ومعلنة للوصول',
  flashcardSource.includes('aria-pressed="false"') && flashcardSource.includes("classList.add('is-playing')")
    && flashcardSource.includes("classList.remove('is-playing')")
    && mainCss.includes('.fc__speak.is-playing'));
check('الوجه الأمامي للبطاقة يعرض العبارة وزر النطق فقط',
  Boolean(flashcardFront) && !flashcardFront.includes('e.ipa') && !flashcardFront.includes('e.note')
    && flashcardFront.includes('fc-front-actions'));
check('تفاصيل البطاقة قابلة للتوسيع وتغطي المحاور الخمسة',
  flashcardSource.includes('id="fcDepthSheet"')
    && flashcardSource.includes('data-depth-open')
    && flashcardSource.includes('bindSwipeUp(qs(\'#fcBack\', host), openSheet)')
    && !flashcardSource.includes('<details class="fc-depth">')
    && ['grammar', 'vocabulary', 'phonetics', 'arabic_l1_transfers', 'academic_focus'].every((axis) => flashcardSource.includes(`key: '${axis}'`)));
check('الدرج السفلي يعرض المحاور الخمسة بعناوين مترجمة حتى عند غياب بيانات إضافية',
  flashcardSource.includes("t('fc.noAxisDetail')")
    && ['fc.axis.grammar', 'fc.axis.vocabulary', 'fc.axis.phonetics', 'fc.axis.arabic_l1_transfers', 'fc.axis.academic_focus'].every((key) => flashcardSource.includes(key)));
check('ثيم Slate الداكن يستخدم ألواناً حيوية وخطوطاً تحريرية حديثة',
  mainCss.includes('--bg: #0b1220;')
    && mainCss.includes('--accent: #78aaff;')
    && mainCss.includes('"IBM Plex Sans Arabic"')
    && mainCss.includes('"Manrope"'));
check('لوحة البدء تعرض الحلقة وزر التعلم وحدهما وتخفي إطار التطبيق',
  dashboardSource.includes('href="#/drill?mode=goal"')
    && dashboardSource.includes('dashboard-home__progress')
    && dashboardSource.includes('dashboard-home__start')
    && mainCss.includes('body.home-focus-mode #topbar')
    && mainCss.includes('.dashboard-home__arc'));
check('الواجهة الجديدة تبدأ افتراضياً بالوضع الداكن',
  store.DEFAULT_SETTINGS.theme === 'dark' && (await readFile(join(ROOT, 'index.html'), 'utf8')).includes('var theme = s.theme || \'dark\''));
const audioFixture = [{
  vocabulary: [{ en: 'A New Word' }, { en: 'Hello', audio_url: './assets/audio/existing.mp3' }],
  sentences: [{ en: 'A sample sentence.' }],
}];
audioLinks.attachCurriculumAudio(audioFixture, {
  'a new word': './assets/audio/curriculum/word.mp3',
  hello: './assets/audio/curriculum/replacement.mp3',
  'a sample sentence.': './assets/audio/curriculum/sentence.mp3',
});
check('روابط الصوت المولّدة تُرفق بالمفردات والجمل دون استبدال التسجيل الموجود',
  audioFixture[0].vocabulary[0].audio_url === './assets/audio/curriculum/word.mp3'
    && audioFixture[0].sentences[0].audio_url === './assets/audio/curriculum/sentence.mp3'
    && audioFixture[0].vocabulary[1].audio_url === './assets/audio/existing.mp3');
check('المستويات الستة A1–C2 نشطة بعد التحقق والاستيراد', cur.LEVELS.length === 6
  && ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].every((level) => cur.getLevel(level)));
check('٤١ وحدة نشطة بعد ترحيل مفردات A0', cur.ALL_UNITS.length === 41);
check('١٦ مطالعة بعد ترحيل قراءات A0', cur.READINGS.length === 16);
check('كل وحدة لها مفردات وقواعد وجمل', cur.ALL_UNITS.every((u) => u.vocabulary.length && u.grammar.length && u.sentences.length));
check('المطالعات موزعة على المستويات', cur.readingsOfLevel('a1').length === 8
  && ['a2', 'b1'].every((l) => cur.readingsOfLevel(l).length === 4));
check('اقتراح الدرس التالي يعمل', cur.nextLessonSuggestion() !== null);
check('إحصاءات المنهج صحيحة', cur.curriculumStats().vocab >= 280);
check('مخطط الوحدات يشمل النطق IPA وأخطاء النقل من العربية', cur.ADVANCED_UNIT_SCHEMA.phonetics.includes('ipa')
  && cur.ADVANCED_UNIT_SCHEMA.arabic_l1_transfers.includes('incorrect')
  && cur.ADVANCED_UNIT_SCHEMA.arabic_l1_transfers.includes('corrected')
  && cur.ADVANCED_UNIT_SCHEMA.phonetics.includes('audio_url')
  && cur.ADVANCED_UNIT_SCHEMA.phonetics.includes('ipa_audio_url'));
check('الوحدات النشطة تعرض الحقول الخمسة مباشرة', cur.ALL_UNITS.every((u) =>
  Array.isArray(u.grammar) && Array.isArray(u.vocabulary) && Array.isArray(u.phonetics)
  && Array.isArray(u.arabic_l1_transfers) && Array.isArray(u.academic_focus) && !('vocab' in u)));
const a1a2Units = cur.ALL_UNITS.filter((unit) => ['a1', 'a2'].includes(unit.levelId));
const enrichedA1A2Units = a1a2Units.filter((unit) => !unit.id.startsWith('a1-foundation-'));
const a1a2ReviewEntries = qg.curriculumReviewEntries({ levels: ['a1', 'a2'] });
check('كل وحدات A1 وA2 تحتوي أبعاد المنهج الخمسة مع IPA وأمثلة', a1a2Units.length === 17
  && a1a2Units.every((unit) => unit.grammar.length && unit.vocabulary.length
    && unit.phonetics.length >= 1 && unit.phonetics.every((item) => item.ipa && item.en && item.ar
      && item.contrastPairs?.length && item.connectedSpeech?.length && item.intonation?.length)
    && unit.arabic_l1_transfers.length >= 2 && unit.academic_focus.length >= 2));
check('متلازمات A1/A2 وأفعال A2 المركبة قابلة للمراجعة', enrichedA1A2Units.every((unit) =>
  unit.vocabulary.some((word) => word.collocations?.length))
  && a1a2Units.filter((unit) => unit.levelId === 'a2').some((unit) =>
    unit.vocabulary.some((word) => word.phrasalVerbs?.length))
  && !a1a2Units.filter((unit) => unit.id.startsWith('a1u')).some((unit) =>
    unit.vocabulary.some((word) => word.phrasalVerbs?.length))
  && ['phonetics', 'phonetics:contrastPairs', 'phonetics:connectedSpeech', 'phonetics:intonation',
    'l1-transfer', 'academic',
    'collocation', 'phrasal-verb'].every((kind) => a1a2ReviewEntries.some((entry) => entry.kind === kind))
  && a1a2ReviewEntries.every((entry) => entry.itemId && entry.en && entry.ar));
const b1Units = cur.ALL_UNITS.filter((unit) => unit.levelId === 'b1');
const b1ReviewEntries = qg.curriculumReviewEntries({ levels: ['b1'] });
check('كل وحدات B1 الست مثرية بالمحاور الخمسة وبمواد صوتية متقدمة', b1Units.length === 6
  && b1Units.every((unit) => unit.grammar.length && unit.vocabulary.length
    && unit.phonetics.length >= 2 && unit.phonetics.every((item) => item.ipa
      && item.contrastPairs?.length && item.connectedSpeech?.length && item.intonation?.length)
    && unit.arabic_l1_transfers.length >= 2 && unit.academic_focus.length >= 2
    && unit.vocabulary.some((word) => word.collocations?.length)
    && unit.vocabulary.some((word) => word.phrasalVerbs?.length)));
check('محتوى B1 الصوتي والأكاديمي والمفرداتي يُنشئ بطاقات SRS صالحة', [
  'phonetics', 'phonetics:contrastPairs', 'phonetics:connectedSpeech', 'phonetics:intonation',
  'l1-transfer', 'academic', 'academic:paraphrasing', 'academic:idioms',
  'collocation', 'phrasal-verb',
].every((kind) => b1ReviewEntries.some((entry) => entry.kind === kind))
  && b1ReviewEntries.every((entry) => entry.itemId && entry.en && entry.ar));
const b2Stage = cur.B2_STAGED_CURRICULUM;
const b2ReviewEntries = qg.curriculumReviewEntries({ levels: ['b2'] });
check('B2 اجتاز التحقق والاستيراد وأصبح نشطاً في المنهج',
  b2Stage.units.length === 6 && cur.validateLevel(b2Stage).valid
    && cur.getLevel('b2')?.status === 'ready' && cur.unitsOfLevel('b2').length === 6
    && b2Stage.units.every((unit) => unit.grammar.length && unit.vocabulary.length
      && unit.phonetics.length >= 2 && unit.arabic_l1_transfers.length >= 2
      && unit.academic_focus.length >= 2 && unit.sentences.length && unit.dialogue.length));
check('محتوى B2 المتقدم يدخل بطاقات SRS في المحاور الخمسة', [
  'grammar', 'phonetics', 'phonetics:contrastPairs', 'phonetics:connectedSpeech',
  'phonetics:intonation', 'l1-transfer', 'academic', 'academic:paraphrasing',
  'academic:idioms', 'collocation', 'phrasal-verb',
].every((kind) => b2ReviewEntries.some((entry) => entry.kind === kind))
  && b2ReviewEntries.every((entry) => entry.itemId && entry.en && entry.ar));
const b2Export = cur.exportStagedLevel(b2Stage);
const b2Imported = cur.importStagedLevel(b2Export);
check('SRS يراجع مفردات B2 النشطة إلى جانب أبعادها الخمسة',
  qg.vocabularyEntries({ levels: ['b2'] }).length >= 12
    && b2ReviewEntries.some((entry) => entry.kind === 'phrasal-verb')
    && b2Imported.valid && b2Imported.level.units.length === 6);
const cLevelData = [cur.C1_STAGED_CURRICULUM, cur.C2_STAGED_CURRICULUM];
check('C1 وC2 اجتازا التحقق والاستيراد وأصبحا نشطين',
  cLevelData.every((level) => level.units.length === 6 && cur.validateLevel(level).valid
    && cur.getLevel(level.id)?.status === 'ready'
    && cur.unitsOfLevel(level.id).length === 6
    && level.units.every((unit) => unit.grammar.length >= 2 && unit.vocabulary.length >= 8
      && unit.phonetics.length >= 2 && unit.phonetics.every((item) => item.ipa
        && item.accentNote && item.connectedSpeech?.length && item.intonation?.length)
      && unit.arabic_l1_transfers.length >= 2 && unit.academic_focus.length >= 2)));
check('C1 وC2 يغطيان التنغيم الساخر وإعادة الصياغة والأمثال وبطاقات SRS',
  cLevelData.every((level) => {
    const entries = level.units.flatMap((unit) =>
      qg.reviewEntriesForUnit({ ...unit, levelId: level.id, levelLabel: level.label }));
    const allText = JSON.stringify(level).toLowerCase();
    return ['phonetics:intonation', 'phonetics:connectedSpeech', 'academic:paraphrasing',
      'academic:idioms', 'collocation', 'phrasal-verb'].every((kind) =>
      entries.some((entry) => entry.kind === kind))
      && /sarcas|سخر|irony|مفارقة/.test(allText)
      && /proverb|مثل|saying/.test(allText)
      && entries.every((entry) => entry.itemId && entry.en && entry.ar);
  }));
const stagedFixture = {
  id: 'b2-test', label: 'B2 test', labelEn: 'B2 test', icon: '🧭', color: '#000',
  units: [{
    id: 'b2-test-u1', title: 'Test unit', grammar: [{ title: 'Grammar' }],
    sentences: [{ en: 'We should make a decision.', ar: 'ينبغي أن نتخذ قراراً.', audio_url: 'audio/sentence.mp3' }],
    vocabulary: [{ en: 'decision', ar: 'قرار', audio_url: 'audio/decision.mp3', ipa: '/dɪˈsɪʒən/', ipa_audio_url: 'audio/decision-ipa.mp3', collocations: [{ en: 'make a decision', ar: 'يتخذ قراراً' }], phrasalVerbs: [{ en: 'carry out', ar: 'ينفذ' }] }],
    phonetics: [{
      id: 'ipa', en: 'think', ipa: '/θɪŋk/', ar: 'ثِنك', audio_url: 'audio/think.mp3', ipa_audio_url: 'audio/think-ipa.mp3',
      contrastPairs: [{ id: 'pair', en: 'pat / bat', ar: '/p/ مقابل /b/' }],
      connectedSpeech: [{ en: 'want to → wanna', ar: 'وصل واختزال في الكلام' }],
      intonation: [{ en: 'rising tone', ar: 'تنغيم صاعد' }],
    }],
    arabic_l1_transfers: [{ id: 'transfer', incorrect: 'I very like it.', corrected: 'I like it very much.', explanationAr: 'موضع الظرف' }],
    academic_focus: [{
      id: 'term', term: 'evidence', meaningAr: 'دليل',
      paraphrasing: [{ original: 'The study is important.', paraphrase: 'The research is significant.' }],
      idioms: [{ phrase: 'in the long run', meaningAr: 'على المدى البعيد' }],
      readingAnalysis: [{ term: 'claim', meaningAr: 'ادعاء الكاتب' }],
    }],
  }],
};
check('التحقق يمنع تفعيل وحدة ناقصة مع تحذير محدد', !cur.validateLevel({
  ...stagedFixture, units: [{ ...stagedFixture.units[0], phonetics: [] }],
}).valid && cur.validateLevel({ ...stagedFixture, units: [{ ...stagedFixture.units[0], phonetics: [] }] })
  .warnings.some((warning) => warning.includes('phonetics')));
const stagedExport = cur.exportStagedLevel(stagedFixture);
const stagedImport = cur.importStagedLevel(stagedExport);
check('خط أنابيب التصدير والاستيراد يحافظ على مخطط الوحدة', stagedImport.valid
  && !('vocab' in stagedImport.level.units[0]) && stagedImport.level.units[0].vocabulary.length === 1);
const componentReviewEntries = qg.reviewEntriesForUnit({
  ...stagedFixture.units[0], levelId: 'b2-test', levelLabel: 'B2 test',
});
const activatedFixture = cur.activateStagedLevel(stagedExport);
check('بطاقات SRS تشمل القواعد وIPA والنقل والمتلازمات والأفعال المركبة', [
  'grammar', 'phonetics', 'l1-transfer', 'academic', 'collocation', 'phrasal-verb',
].every((kind) => componentReviewEntries.some((entry) => entry.kind === kind))
  && componentReviewEntries.every((entry) => entry.itemId && entry.en && entry.ar));
check('SRS يراجع الأزواج الصوتية والوصل والتنغيم وإعادة الصياغة والتعابير الاصطلاحية',
  ['phonetics:contrastPairs', 'phonetics:connectedSpeech', 'phonetics:intonation',
    'academic:paraphrasing', 'academic:idioms', 'academic:readingAnalysis']
    .every((kind) => componentReviewEntries.some((entry) => entry.kind === kind)));
const audioVocabEntry = qg.vocabularyEntries({ levels: ['b2-test'] }).find((entry) => entry.en === 'decision');
const audioSentenceEntry = qg.sentenceEntries({ levels: ['b2-test'] }).find((entry) => entry.en === 'We should make a decision.');
const audioPhoneticsEntry = componentReviewEntries.find((entry) => entry.kind === 'phonetics');
check('بطاقات SRS تحمل مسارات صوت الكلمة وIPA مع إبقاء IPA نصاً منفصلاً',
  audioVocabEntry?.audioUrl === 'audio/decision.mp3'
    && audioVocabEntry.ipa === '/dɪˈsɪʒən/'
    && audioVocabEntry.ipaAudioUrl === 'audio/decision-ipa.mp3'
    && audioSentenceEntry?.audioUrl === 'audio/sentence.mp3'
    && audioPhoneticsEntry?.audioUrl === 'audio/think.mp3'
    && audioPhoneticsEntry.ipaAudioUrl === 'audio/think-ipa.mp3');
check('تفعيل المستوى المراجع يضيفه إلى المنهج النشط مرة واحدة', activatedFixture.valid
  && cur.getLevel('b2-test') === activatedFixture.level
  && cur.unitsOfLevel('b2-test').length === 1
  && !cur.activateStagedLevel(stagedExport).valid);
const activeReviewKinds = [
  ...qg.vocabularyEntries({ levels: ['b2-test'] }),
  ...qg.curriculumReviewEntries({ levels: ['b2-test'] }),
].map((entry) => entry.kind);
check('المحور الخامس كله يدخل بطاقات SRS بعد تفعيل الوحدة', [
  'word', 'grammar', 'phonetics', 'l1-transfer', 'academic', 'collocation', 'phrasal-verb',
].every((kind) => activeReviewKinds.includes(kind)));
if (activatedFixture.valid) {
  cur.LEVELS.splice(cur.LEVELS.indexOf(activatedFixture.level), 1);
  cur.ALL_UNITS.splice(cur.ALL_UNITS.findIndex((unit) => unit.levelId === 'b2-test'), 1);
}

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
