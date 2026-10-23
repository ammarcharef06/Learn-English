/* ============================================================
   اختيار البداية في موقع المستويات — بمكوّنات الأكاديمية
   اختيار «من الصفر» يفتح محتوى A0 عبر نقطة دخوله الخاصة (zero.html)
   ============================================================ */
import { qs, toast } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { zeroPrefs, completeOnboarding, setZeroPrefs } from '../core/zeroflow.js';
import { t } from '../core/i18n.js';
import { progress } from '../core/store.js';

const ID = 'zeroChoice';

/** صفحة محتوى قسم A0 */
export const ZERO_PAGE = './zero.html';

export function shouldShowZeroChoice() {
  const hasLearningHistory = (progress.studyDays?.length || 0) > 0
    || Object.keys(progress.lessons || {}).length > 0
    || Object.keys(progress.items || {}).length > 0
    || (progress.notebook?.length || 0) > 0
    || (progress.totals?.questions || 0) > 0
    || !!progress.zero?.startedAt;
  return !zeroPrefs().onboarded && !hasLearningHistory;
}

export function showZeroChoice({ force = false, onDone = null } = {}) {
  if (!force && !shouldShowZeroChoice()) return false;
  if (qs('#' + ID)) return true;

  const returnFocusTo = document.activeElement;
  const el = document.createElement('div');
  el.id = ID;
  el.className = 'zchoice';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'zchoiceTitle');
  el.setAttribute('aria-describedby', 'zchoiceDescription');
  el.innerHTML = `
    <div class="zchoice__panel">
      <span class="zchoice__eyebrow"><i aria-hidden="true">✦</i>${t('zchoice.eyebrow')}</span>
      <h2 id="zchoiceTitle">${t('zchoice.title')}</h2>
      <p class="zchoice__q" id="zchoiceDescription">${t('zchoice.description')}</p>

      <button class="zchoice__opt" type="button" data-choice="a0">
        <span class="zchoice__ico" aria-hidden="true">🌱</span>
        <span class="zchoice__b"><small class="zchoice__level" dir="ltr">A0 · ${t('zchoice.beginnerTag')}</small><b>${t('zchoice.beginnerTitle')}</b><small>${t('zchoice.beginnerDescription')}</small></span>
        <span class="zchoice__arrow" aria-hidden="true">${directionArrow()}</span>
      </button>

      <button class="zchoice__opt" type="button" data-choice="a1">
        <span class="zchoice__ico" aria-hidden="true">📚</span>
        <span class="zchoice__b"><small class="zchoice__level" dir="ltr">A1 — B1 · ${t('zchoice.levelsTag')}</small><b>${t('zchoice.levelsTitle')}</b><small>${t('zchoice.levelsDescription')}</small></span>
        <span class="zchoice__arrow" aria-hidden="true">${directionArrow()}</span>
      </button>

      <button class="zchoice__later" type="button" data-choice="later">${t('zchoice.explore')}</button>
    </div>`;

  document.body.appendChild(el);
  document.body.classList.add('zero-choice-open');

  const close = () => {
    el.classList.add('is-closing');
    document.body.classList.remove('zero-choice-open');
    setTimeout(() => {
      el.remove();
      const focusTarget = returnFocusTo instanceof HTMLElement && returnFocusTo !== document.body
        ? returnFocusTo
        : qs('#view');
      focusTarget?.focus?.({ preventScroll: true });
    }, 180);
    document.removeEventListener('keydown', onKey);
  };

  const choose = (choice) => {
    completeOnboarding(choice);
    if (choice === 'later') setZeroPrefs({ focus: 'levels' });
    close();
    if (choice === 'a0') { toast('جارٍ فتح قسم «من الصفر» 🌱', 'ok'); location.href = ZERO_PAGE; }
    else if (choice === 'a1') { toast('المستويات جاهزة 📚', 'ok'); navigate('/'); }
    else window.__leaRefreshChrome?.();
    onDone?.(choice);
  };

  el.querySelectorAll('[data-choice]').forEach((b) => b.addEventListener('click', () => choose(b.dataset.choice)));
  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      choose('later');
      return;
    }
    if (e.key !== 'Tab') return;
    const controls = [...el.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  document.addEventListener('keydown', onKey);
  setTimeout(() => el.querySelector('[data-choice="a0"]')?.focus({ preventScroll: true }), 60);

  return true;
}

function directionArrow() {
  return document.documentElement.dir === 'ltr' ? '→' : '←';
}

export function reopenZeroChoice() {
  setZeroPrefs({ onboarded: false });
  return showZeroChoice({ force: true });
}
