/* ============================================================
   نقطة دخول قسم «من الصفر» (A0) — صفحة مستقلة تماماً (zero.html)
   لا تُحمّل هذه الصفحة نقطة دخول الموقع (app.js) ولا هيكله:
   لا شريط موقع، ولا قائمة جانبية، ولا شريط سفلي للمستويات.
   ============================================================ */
import { initRouter, route, setNotFound, resolve } from './core/router.js';
import { setUiLang } from './core/i18n.js';
import { initSpeech, speak, stopSpeaking } from './core/speech.js';
import { isAuthed, extendSession } from './core/auth.js';
import { flush } from './core/store.js';
import { qs, toast } from './core/utils.js';
import { addNotebook } from './core/gamify.js';
import { applyZeroShell, exitZeroMode } from './views/zero-shell.js';
import { renderTopbar, closeDrawer } from './views/topbar.js';
import { setZeroFocus } from './core/zeroflow.js';
import { registerZeroSounds } from './core/zero-audio.js';
import { renderZero, renderZeroPad, renderZeroSettings } from './views/zero.js';
import { renderZeroStage, renderZeroDrill } from './views/zero-stage.js';
import { renderZeroExam, renderZeroCertificate } from './views/zero-exam.js';
import { stopActiveQuizzes } from './views/quiz-runner.js';

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
    view().innerHTML = `<div class="zpage"><div class="znotice">هذا الرابط غير موجود في قسم «من الصفر».</div>
      <a class="zbtn zbtn--primary" href="#/zero">← المراحل</a></div>`;
  });
}

/* ---------------- أحداث عامة (نفس سلوك الموقع) ---------------- */
function bindGlobalEvents() {
  document.addEventListener('click', (e) => {
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
      toast(added ? 'أُضيفت إلى دفترك 📒' : 'موجودة في دفترك مسبقاً', added ? 'ok' : 'info');
      if (added) nb.textContent = '✅';
    }
  });
}

/* ---------------- الإقلاع ---------------- */
async function main() {
  setUiLang('ar');
  initSpeech();
  registerZeroSounds();
  bindGlobalEvents();
  window.__leaBooted = true;

  /* هذه الصفحة محميّة بنفس جلسة الموقع؛ وإن لم تكن الجلسة قائمة نعود لبوابة الدخول */
  if (!isAuthed()) { location.replace('./index.html'); return; }

  /* الوقوف على هذه الصفحة يعني أن وضع «من الصفر» مفعّل دائماً */
  setZeroFocus('a0');

  renderTopbar(qs('#topbar'), 'zero', { onRerender: () => applyZeroShell(location.hash) });
  qs('#scrim')?.addEventListener('click', closeDrawer);
  /* التنقّل داخل الدرج يغلقه دائماً (نفس سلوك درج الموقع) */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-nav]')) closeDrawer();
  });
  window.addEventListener('hashchange', closeDrawer);

  setupRoutes();
  if (!location.hash) location.replace('#/zero');
  await initRouter();
  applyZeroShell(location.hash);

  document.addEventListener('lea:answered', () => applyZeroShell(location.hash));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) extendSession(); });
  window.addEventListener('beforeunload', flush);

  /* زر الرجوع في المتصفح/الهاتف يخرج إلى المستويات عند أول الصفحة */
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
}

main().catch((err) => {
  console.error('zero boot failed', err);
  const v = view();
  if (v) {
    v.innerHTML = `<div class="zpage"><div class="znotice">تعذّر تشغيل قسم «من الصفر». افتح وحدة تحكم المتصفح لمعرفة الخطأ.</div>
      <a class="zbtn zbtn--primary" href="./index.html">← العودة إلى الموقع</a></div>`;
  }
});

/* أدوات متاحة للواجهات (نفس ما يستخدمه الموقع) */
window.__leaRenderAll = () => { applyZeroShell(location.hash); resolve(); };
window.__leaRefreshChrome = () => applyZeroShell(location.hash);
window.__leaExitZero = () => exitZeroMode();
window.__leaToast = toast;
export { stopSpeaking, stopActiveQuizzes };
