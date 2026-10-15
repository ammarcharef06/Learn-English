/* ============================================================
   نقطة الدخول: التهيئة، التوجيه، الأحداث العامة
   ============================================================ */
import { initRouter, route, setNotFound, resolve, currentRoute, navigate, onRouteChange } from './core/router.js';
import { settings, saveSettings, subscribe, progress, flush } from './core/store.js';
import { setUiLang, applyI18n, t } from './core/i18n.js';
import { initSpeech, speak, stopSpeaking } from './core/speech.js';
import { isAuthed, extendSession, lockNow, ensureAuth } from './core/auth.js';
import { qs, qsa, toast, esc } from './core/utils.js';
import { renderLock, hideLock, lockSite } from './views/auth.js';
import { renderNav, setActiveNav, renderSidebarStats, openDrawer, closeDrawer } from './views/shell.js';
import { renderDashboard } from './views/dashboard.js';
import { renderLessons, renderLevel, renderUnit, renderLesson } from './views/lessons.js';
import { renderZero, renderZeroPad, renderZeroSettings } from './views/zero.js';
import { renderZeroStage, renderZeroDrill } from './views/zero-stage.js';
import { renderZeroExam, renderZeroCertificate } from './views/zero-exam.js';
import { shouldShowZeroChoice, showZeroChoice } from './views/zero-entry.js';
import { applyZeroShell, exitZeroMode, enterZeroMode, zeroModeOn } from './views/zero-shell.js';
import { renderReference } from './views/reference.js';
import { renderDrills } from './views/drills.js';
import { renderDrillPage } from './views/drill.js';
import { renderFlashcards } from './views/flashcards.js';
import { renderReading } from './views/reading.js';
import { renderExams } from './views/exams.js';
import { renderStats } from './views/stats.js';
import { renderNotebook } from './views/notebook.js';
import { renderSettings, applyTheme, applySkin, applyLang, SKINS } from './views/settings.js';
import { renderAbout } from './views/about.js';
import { stopActiveQuizzes } from './views/quiz-runner.js';
import { addNotebook } from './core/gamify.js';
import { startReminderLoop, initOneSignal, oneSignalConfigured } from './core/notify.js';

const view = () => qs('#view');

/* ---------------- التوجيه ---------------- */
function setupRoutes() {
  route('/', () => renderDashboard(view()));
  route('/lessons', () => renderLessons(view()));
  /* قسم «من الصفر» (A0) */
  route('/zero', () => renderZero(view()));
  route('/zero/pad', () => renderZeroPad(view()));
  route('/zero/settings', () => renderZeroSettings(view()));
  route('/zero/stage/:stageId', (p) => renderZeroStage(view(), p.stageId));
  route('/zero/drill/:stageId', (p) => renderZeroDrill(view(), p.stageId));
  route('/zero/exam', () => renderZeroExam(view()));
  route('/zero/certificate', () => renderZeroCertificate(view()));
  route('/level/:levelId', (p) => renderLevel(view(), p.levelId));
  route('/unit/:unitId', (p) => renderUnit(view(), p.unitId));
  route('/lesson/:unitId/:index', (p) => renderLesson(view(), p.unitId, p.index));
  route('/reference', () => renderReference(view(), null));
  route('/reference/:section', (p) => renderReference(view(), p.section));
  route('/drills', (p, q) => renderDrills(view(), q || {}));
  route('/drill', (p, q) => renderDrillPage(view(), q || {}));
  route('/flashcards', () => renderFlashcards(view()));
  route('/reading', () => renderReading(view(), null));
  route('/reading/:id', (p) => renderReading(view(), p.id));
  route('/exams', () => renderExams(view(), null));
  route('/exams/:id', (p) => renderExams(view(), p.id));
  route('/stats', () => renderStats(view()));
  route('/notebook', () => renderNotebook(view()));
  route('/settings', () => renderSettings(view()));
  route('/about', () => renderAbout(view()));
  setNotFound(() => {
    view().innerHTML = `<div class="empty"><span class="ico">🧭</span><h2>الصفحة غير موجودة</h2>
      <p>الرابط الذي طلبته غير متاح.</p><a class="btn btn--primary" href="#/">إلى الرئيسية</a></div>`;
  });
}

/* ---------------- الأحداث العامة ---------------- */
function bindGlobalEvents() {
  document.addEventListener('click', (e) => {
    const sayBtn = e.target.closest('[data-say]');
    if (sayBtn && !e.target.closest('.quiz-shell')) {
      sayBtn.classList.add('is-speaking');
      speak(sayBtn.dataset.say, { onend: () => sayBtn.classList.remove('is-speaking') });
      return;
    }
    const nb = e.target.closest('[data-nb]');
    if (nb) {
      const added = addNotebook({ en: nb.dataset.en || '', ar: nb.dataset.ar || '' });
      toast(added ? 'أُضيفت إلى دفترك 📒' : 'موجودة في دفترك مسبقاً', added ? 'ok' : 'info');
      if (added) nb.textContent = '✅';
      return;
    }
    if (e.target.closest('[data-nav]')) closeDrawer();
  });

  qs('#btnMenu')?.addEventListener('click', () => {
    const sb = qs('#sidebar');
    if (sb?.classList.contains('is-open')) closeDrawer(); else openDrawer();
  });
  qs('#scrim')?.addEventListener('click', closeDrawer);

  qs('#btnTheme')?.addEventListener('click', () => {
    if ((settings.skin || 'kali') === 'kali') {
      // كالي داكن دائماً: الزر يبدّل إلى GNOME الفاتح كبديل سريع
      saveSettings({ skin: 'gnome', theme: 'light' });
      applySkin();
      toast('الستايل: GNOME فاتح ☀️', 'info');
      renderAll();
      return;
    }
    const isDark = document.documentElement.dataset.theme === 'dark';
    saveSettings({ theme: isDark ? 'light' : 'dark' });
    applySkin();
  });

  /* زر تبديل الستايل السريع: كالي → GNOME → الكلاسيكي */
  qs('#btnStyle')?.addEventListener('click', () => {
    const order = SKINS.map((s) => s.id);
    const current = SKINS.some((s) => s.id === settings.skin) ? settings.skin : 'kali';
    const next = order[(order.indexOf(current) + 1) % order.length];
    saveSettings({ skin: next });
    const applied = applySkin();
    const label = SKINS.find((s) => s.id === applied);
    toast(`الستايل: ${label ? label.ar : applied}`, 'ok');
    renderAll();
  });
  qs('#btnLang')?.addEventListener('click', () => {
    const next = settings.uiLang === 'en' ? 'ar' : 'en';
    saveSettings({ uiLang: next });
    applyLang();
    renderAll();
  });

  /* الزر الدائم في الشريط العلوي: يدخل إلى واجهة «من الصفر» المستقلة */
  qs('#btnZero')?.addEventListener('click', () => {
    if (zeroModeOn()) exitZeroMode();
    else enterZeroMode('/zero');
  });
  qs('#btnLock')?.addEventListener('click', () => { lockNow(); lockSite(); });
  qs('#btnBell')?.addEventListener('click', () => navigate('/settings'));
  qs('#btnInstall')?.addEventListener('click', () => window.__leaInstall?.());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  window.addEventListener('online', () => { const b = qs('#offlineBar'); if (b) b.hidden = true; });
  window.addEventListener('offline', () => { const b = qs('#offlineBar'); if (b) b.hidden = false; });

  document.addEventListener('lea:reminder-inapp', (e) => {
    const d = e.detail || {};
    toast(d.body || '', 'warn', d.title || 'تذكير');
  });

  document.addEventListener('lea:answered', () => { renderSidebarStats(); });

  // فتح الرابط المرسل في الإشعار
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (ev) => {
      const data = ev.data || {};
      if (data.type === 'navigate' && data.url) location.hash = String(data.url).replace(/^.*#/, '#');
    });
  }
}

/* ---------------- التثبيت (PWA) ---------------- */
let deferredPrompt = null;
function setupInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = qs('#btnInstall');
    if (btn) btn.hidden = false;
  });
  window.__leaInstall = async () => {
    const btn = qs('#btnInstall');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') { toast('تم تثبيت التطبيق 🎉', 'ok'); if (btn) btn.hidden = true; }
      deferredPrompt = null;
      return true;
    }
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      toast('على الآيفون: زر المشاركة ← «إضافة إلى الشاشة الرئيسية»', 'info', 'تثبيت التطبيق');
    } else {
      toast('افتح قائمة المتصفح ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»', 'info', 'تثبيت التطبيق');
    }
    return false;
  };
  window.addEventListener('appinstalled', () => toast('التطبيق مثبّت على جهازك ✅', 'ok'));
}

/* ---------------- Service Worker ---------------- */
/* وعد بجاهزية Service Worker — تستخدمه تهيئة الإشعارات */
let swReadyPromise = null;

function registerSW() {
  if (!('serviceWorker' in navigator)) { swReadyPromise = Promise.resolve(null); return swReadyPromise; }
  const register = async () => {
    try {
      const swUrl = new URL('./service-worker.js', location.href);
      const scope = new URL('./', location.href).pathname;
      const reg = await navigator.serviceWorker.register(swUrl, { scope });
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            toast('يتوفر تحديث جديد — أعد تحميل الصفحة للاستفادة منه', 'info', 'تحديث');
          }
        });
      });
      // ننتظر وصول العامل إلى حالة التنشيط (مهم قبل تهيئة OneSignal)
      const active = reg.active || (await waitForActive(reg));
      return active ? reg : null;
    } catch (err) {
      console.warn('SW registration failed', err);
      return null;
    }
  };
  const p = (document.readyState === 'complete' ? register() : new Promise((res) => {
    window.addEventListener('load', () => { register().then(res); }, { once: true });
  }));
  swReadyPromise = p;
  window.__leaSwReady = p;
  return p;
}

function waitForActive(reg, timeout = 8000) {
  return new Promise((resolve) => {
    if (reg.active) return resolve(reg.active);
    const t = setTimeout(() => resolve(null), timeout);
    const check = () => {
      if (reg.active) { clearTimeout(t); resolve(reg.active); return; }
      const w = reg.installing || reg.waiting;
      if (w) w.addEventListener('statechange', () => check(), { once: true });
      else setTimeout(check, 200);
    };
    check();
  });
}

/* ---------------- زر A0 الدائم ---------------- */
function applyZeroButton() {
  const btn = qs('#btnZero');
  if (!btn) return;
  const on = zeroModeOn();
  btn.classList.toggle('is-on', on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.title = on ? 'أنت في واجهة «من الصفر»' : 'الدخول إلى واجهة «من الصفر» (A0)';
  btn.setAttribute('aria-label', btn.title);
}

/* ---------------- إعادة الرسم ---------------- */
function renderAll() {
  applyZeroButton();
  renderNav();
  applyZeroShell();
  applyI18n(document);
  renderSidebarStats();
  resolve();
}

/* ---------------- تحديث الواجهة بلا إعادة توجيه ----------------
   يُستخدم قبل تغيير الرابط مباشرةً: نُحدّث الشريط والتنقّل، ثم نترك
   الموجّه يرسم الصفحة الجديدة وحدها (بلا تسابق بين رسمتين). */
function refreshChrome() {
  applyZeroButton();
  renderNav();
  applyZeroShell(currentRoute().path);
  renderSidebarStats();
}

/* ---------------- الإقلاع ---------------- */
function boot() {
  const boot = qs('#boot');
  const app = qs('#app');
  window.__leaBooted = true;
  if (boot) boot.classList.add('is-hidden');
  if (app) app.classList.remove('is-hidden');
  applyI18n(document);
  renderAll();
}

async function main() {
  ensureAuth();
  applySkin();
  applyLang();
  initSpeech();
  bindGlobalEvents();
  setupInstall();
  registerSW();
  setupRoutes();
  window.__leaRenderAll = renderAll;
  window.__leaRefreshChrome = refreshChrome;
  window.__leaLockNow = () => lockSite();

  // عند كل تنقل: تمييز الرابط النشط + إغلاق الدرج + إيقاف ما يجب إيقافه + العودة لأعلى الصفحة
  onRouteChange((route) => {
    setActiveNav(route.path);
    closeDrawer();
    renderSidebarStats();
    applyZeroShell(route.path);
    /* في واجهة A0: لا شريط جانبي ولا قائمة مستويات */
    if (zeroModeOn()) closeDrawer();
    /* شبكة أمان: لا تبقَ شاشة الاختيار مقفلة للتمرير إن أُزيلت بلا إغلاق */
    if (!qs('#zeroChoice')) document.body.classList.remove('zero-choice-open');
    document.onkeydown = null;      // لا تبقَ اختصارات صفحة سابقة فعّالة
    stopActiveQuizzes();            // لا مؤقّتات أسئلة تعمل في الخلفية
    stopSpeaking();                 // لا نطق يستمر بعد مغادرة الصفحة
    try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch {}
  });

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener?.('change', () => { if ((settings.theme || 'auto') === 'auto') applySkin(); });

  /* تشغيل التطبيق: يُستخدم بعد الدخول أو مباشرةً إن كانت الجلسة قائمة.
     مهم: initRouter() يجب أن يُستدعى في الحالتين، وإلا لا يعمل التنقل
     بعد أول تسجيل دخول (كان عطلاً حقيقياً: يظهر الموقع ولا يستجيب). */
  let started = false;
  const startApp = async () => {
    if (started) return;
    started = true;
    boot();
    window.__leaBooted = true;
    await initRouter();
    /* شاشة الاختيار عند الدخول — مرة واحدة فقط (A0 أم A1) */
    if (shouldShowZeroChoice()) setTimeout(() => showZeroChoice(), 420);
    startReminderLoop();
    if (oneSignalConfigured()) {
      Promise.resolve(swReadyPromise).then(() => initOneSignal()).then((res) => {
        if (res.ok) console.info('OneSignal ready', res.id || '');
      });
    }
  };

  if (!isAuthed()) {
    qs('#boot')?.classList.add('is-hidden');
    window.__leaBooted = true;
    renderLock(async () => {
      toast('أهلاً بك في أكاديميتك 👋', 'ok');
      await startApp();
    });
    return;
  }

  await startApp();

  // تجديد مدة الجلسة عند التنقل (بحد أقصى مرة كل ١٠ دقائق)
  let lastExtend = Date.now();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() - lastExtend > 600000) { extendSession(); lastExtend = Date.now(); }
  });

  window.addEventListener('beforeunload', flush);
}

main().catch((err) => {
  console.error('boot failed', err);
  const boot = qs('#boot');
  if (boot) boot.innerHTML = `<div class="boot__logo">!</div><div class="boot__text">تعذّر تشغيل الموقع. افتح وحدة تحكم المتصفح لمعرفة الخطأ.</div>`;
});
