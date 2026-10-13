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
import { renderReference } from './views/reference.js';
import { renderDrills } from './views/drills.js';
import { renderFlashcards } from './views/flashcards.js';
import { renderReading } from './views/reading.js';
import { renderExams } from './views/exams.js';
import { renderStats } from './views/stats.js';
import { renderNotebook } from './views/notebook.js';
import { renderSettings, applyTheme, applyLang } from './views/settings.js';
import { renderAbout } from './views/about.js';
import { addNotebook } from './core/gamify.js';
import { startReminderLoop, initOneSignal, oneSignalConfigured } from './core/notify.js';

const view = () => qs('#view');

/* ---------------- التوجيه ---------------- */
function setupRoutes() {
  route('/', () => renderDashboard(view()));
  route('/lessons', () => renderLessons(view()));
  route('/level/:levelId', (p) => renderLevel(view(), p.levelId));
  route('/unit/:unitId', (p) => renderUnit(view(), p.unitId));
  route('/lesson/:unitId/:index', (p) => renderLesson(view(), p.unitId, p.index));
  route('/reference', () => renderReference(view(), null));
  route('/reference/:section', (p) => renderReference(view(), p.section));
  route('/drills', (p, q) => renderDrills(view(), q || {}));
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
    const isDark = document.documentElement.dataset.theme === 'dark';
    saveSettings({ theme: isDark ? 'light' : 'dark' });
    applyTheme();
  });
  qs('#btnLang')?.addEventListener('click', () => {
    const next = settings.uiLang === 'en' ? 'ar' : 'en';
    saveSettings({ uiLang: next });
    applyLang();
    renderAll();
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
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
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
    } catch (err) {
      console.warn('SW registration failed', err);
    }
  });
}

/* ---------------- إعادة الرسم ---------------- */
function renderAll() {
  renderNav();
  applyI18n(document);
  renderSidebarStats();
  resolve();
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
  applyTheme();
  applyLang();
  initSpeech();
  bindGlobalEvents();
  setupInstall();
  registerSW();
  setupRoutes();
  window.__leaRenderAll = renderAll;
  window.__leaLockNow = () => lockSite();

  // عند كل تنقل: تمييز الرابط النشط + إغلاق الدرج + العودة لأعلى الصفحة
  onRouteChange((route) => {
    setActiveNav(route.path);
    closeDrawer();
    renderSidebarStats();
    try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch {}
  });

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener?.('change', () => { if ((settings.theme || 'auto') === 'auto') applyTheme(); });

  if (!isAuthed()) {
    qs('#boot')?.classList.add('is-hidden');
    window.__leaBooted = true;
    renderLock(() => {
      boot();
      toast('أهلاً بك في أكاديميتك 👋', 'ok');
    });
    return;
  }

  boot();
  await initRouter();
  window.__leaBooted = true;
  startReminderLoop();

  if (oneSignalConfigured()) {
    initOneSignal().then((res) => {
      if (res.ok) console.info('OneSignal ready', res.id || '');
    });
  }

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
