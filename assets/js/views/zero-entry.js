/* ============================================================
   شاشة الدخول (مرة واحدة) — سؤال واحد بخيارين واضحين، بلا زحام
   ============================================================ */
import { qs, toast } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { zeroPrefs, completeOnboarding, setZeroPrefs } from '../core/zeroflow.js';

const ID = 'zeroChoice';

export function shouldShowZeroChoice() {
  return !zeroPrefs().onboarded;
}

export function showZeroChoice({ force = false, onDone = null } = {}) {
  if (!force && !shouldShowZeroChoice()) return false;
  if (qs('#' + ID)) return true;

  const el = document.createElement('div');
  el.id = ID;
  el.className = 'zchoice';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <div class="zchoice__panel">
      <h2>من أين نبدأ؟</h2>
      <p class="zchoice__q">اختر مرة واحدة، ويمكنك التبديل في أي وقت.</p>

      <button class="zchoice__opt" type="button" data-choice="a0">
        <span class="zchoice__ico" aria-hidden="true">🌱</span>
        <span class="zchoice__b"><b>من الصفر (A0)</b><small>لا أعرف الحروف بعد — ابدأ معي من الحرف الأول.</small></span>
      </button>

      <button class="zchoice__opt" type="button" data-choice="a1">
        <span class="zchoice__ico" aria-hidden="true">📚</span>
        <span class="zchoice__b"><b>المستويات A1–B1</b><small>أعرف الأساسيات — خُذني إلى الدروس.</small></span>
      </button>

      <button class="zchoice__later" type="button" data-choice="later">لاحقاً</button>
    </div>`;

  document.body.appendChild(el);
  document.body.classList.add('zero-choice-open');

  const close = () => {
    el.classList.add('is-closing');
    document.body.classList.remove('zero-choice-open');
    setTimeout(() => el.remove(), 180);
    document.removeEventListener('keydown', onKey);
  };

  const choose = (choice) => {
    completeOnboarding(choice);
    if (choice === 'later') setZeroPrefs({ focus: 'levels' });
    close();
    window.__leaRefreshChrome?.();
    if (choice === 'a0') { toast('واجهة «من الصفر» جاهزة 🌱', 'ok'); navigate('/zero'); }
    else if (choice === 'a1') { toast('المستويات جاهزة 📚', 'ok'); navigate('/'); }
    onDone?.(choice);
  };

  el.querySelectorAll('[data-choice]').forEach((b) => b.addEventListener('click', () => choose(b.dataset.choice)));
  function onKey(e) { if (e.key === 'Escape') choose('later'); }
  document.addEventListener('keydown', onKey);
  setTimeout(() => el.querySelector('[data-choice="a0"]')?.focus({ preventScroll: true }), 60);

  return true;
}

export function reopenZeroChoice() {
  setZeroPrefs({ onboarded: false });
  return showZeroChoice({ force: true });
}
