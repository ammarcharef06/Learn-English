import { t as uiText } from './core/i18n.js';
﻿/* ============================================================
   نقطة دخول محتوى A0 بموجّه مستقل وغلاف الأكاديمية المشترك.
   ============================================================ */
import { initRouter, route, setNotFound, resolve, onRouteChange, onRouteRendered } from './core/router.js';
import { initSpeech, speak, stopSpeaking } from './core/speech.js';
import { isAuthed, extendSession, startIdleSessionGuard } from './core/auth.js';
import { flush } from './core/store.js';
import { qs, toast, focusMainHeading } from './core/utils.js';
import { addNotebook } from './core/gamify.js';
import { applyZeroShell, exitZeroMode } from './views/zero-shell.js';
import { applyAccessibility, applyLang } from './core/theme.js';
import { bindSwipeBack, createRouteHistory } from './core/navigation-gesture.js';
import { renderTopbar, openDrawer, closeDrawer } from './views/topbar.js';
import { setZeroFocus } from './core/zeroflow.js';
import { registerZeroSounds } from './core/zero-audio.js';
import { renderZero, renderZeroPad, renderZeroSettings } from './views/zero.js';
import { renderZeroStage, renderZeroDrill } from './views/zero-stage.js';
import { renderZeroExam, renderZeroCertificate } from './views/zero-exam.js';
import { stopActiveQuizzes } from './views/quiz-runner.js';
import { setupPwaInstall } from './core/pwa-install.js';

const view = () => qs('#view');

/* ---------------- التوجيه داخل صفحة A0 ---------------- */
function setupRoutes() {
  route('/zero', () => renderZero(view()));
  route('/zero/pad', () => renderZeroPad(view()));
  route('/zero/settings', () => renderZeroSettings(view()));
  route('/zero/stage/:stageId', (p) => renderZeroStage(view(), p.stageId));
  route('/zero/drill/:stageId', (p) => renderZeroDrill(view(), p.stageId));
  route('/zero/exam', () => renderZeroExam(view()));
  route('/zero/certificate', () => renderZeroCertificate(view()));
  setNotFound(() => {
    view().innerHTML = uiText('ui.literal.e2c1b974');
  });
}

/* ---------------- أحداث عامة (نفس سلوك الموقع) ---------------- */
function bindGlobalEvents() {
  document.addEventListener('click', (e) => {
    const exitLink = e.target.closest('[data-exit-zero]');
    if (exitLink) {
      e.preventDefault();
      closeDrawer();
      exitZeroMode(exitLink.getAttribute('href') || './index.html#/');
      return;
    }
    if (e.target.closest('[data-nav]')) closeDrawer();

    /* النطق من أي زر [data-say] في الصفحة (نفس .speak-btn المستخدم في الموقع) */
    const sayBtn = e.target.closest('[data-say]');
    if (sayBtn && !e.target.closest('.quiz-shell')) {
      sayBtn.classList.add('is-speaking');
      speak(sayBtn.dataset.say, { onend: () => sayBtn.classList.remove('is-speaking') });
      return;
    }
    /* إضافة كلمة إلى دفتر المتعلّم */
    const nb = e.target.closest('[data-nb]');
    if (nb) {
      const added = addNotebook({ en: nb.dataset.en || '', ar: nb.dataset.ar || '' });
      toast(added ? uiText('ui.literal.72cfce1c') : uiText('ui.literal.ebcf022b'), added ? 'ok' : 'info');
      if (added) nb.textContent = '✅';
    }
  });
}

/* ---------------- الإقلاع ---------------- */
async function main() {
  applyAccessibility();
  applyLang();
  initSpeech();
  registerZeroSounds();
  bindGlobalEvents();
  window.__leaBooted = true;

  /* هذه الصفحة محميّة بنفس جلسة الموقع؛ وإن لم تكن الجلسة قائمة نعود لبوابة الدخول */
  if (!isAuthed()) { location.replace('./index.html'); return; }

  /* الوقوف على هذه الصفحة يعني أن وضع «من الصفر» مفعّل دائماً */
  setZeroFocus('a0');

  renderTopbar(qs('#topbar'), 'zero', { onRerender: () => applyZeroShell(location.hash) });
  setupPwaInstall();
  qs('#scrim')?.addEventListener('click', closeDrawer);
  window.addEventListener('hashchange', closeDrawer);

  setupRoutes();
  const routeHistory = createRouteHistory();
  onRouteChange(({ path }) => routeHistory.remember(path));
  bindSwipeBack({
    canGoBack: () => routeHistory.canGoBack(),
    onBack: () => {
      const path = routeHistory.back();
      if (path) location.hash = `#${path}`;
    },
  });
  onRouteRendered(() => {
    applyZeroShell(location.hash);
    requestAnimationFrame(() => focusMainHeading(view()));
  });
  if (!location.hash) location.replace('#/zero');
  await initRouter();
  applyZeroShell(location.hash);

  document.addEventListener('lea:answered', () => applyZeroShell(location.hash));
  startIdleSessionGuard(() => location.replace('./index.html'));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) extendSession(); });
  window.addEventListener('beforeunload', flush);

  /* زر الرجوع في المتصفح/الهاتف يخرج إلى المستويات عند أول الصفحة */
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
}

main().catch((err) => {
  console.error('zero boot failed', err);
  const v = view();
  if (v) {
    v.innerHTML = uiText('ui.literal.fe15c29f');
  }
});

/* أدوات متاحة للواجهات (نفس ما يستخدمه الموقع) */
window.__leaRenderAll = () => { applyZeroShell(location.hash); resolve(); };
window.__leaRefreshChrome = () => applyZeroShell(location.hash);
window.__leaToast = toast;
export { stopSpeaking, stopActiveQuizzes };
