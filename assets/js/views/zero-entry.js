/* ============================================================
   شاشة الاختيار عند الدخول (مرة واحدة) — A0 أم A1؟
   ============================================================ */
import { qs, toast, confetti } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { zeroPrefs, completeOnboarding, setZeroPrefs } from '../core/zeroflow.js';
import { ZERO_TOTALS } from '../data/zero.js';

const ID = 'zeroChoice';

export function shouldShowZeroChoice() {
  return !zeroPrefs().onboarded;
}

/** يُعيد بناء الشاشة. force = true لعرضها مرة أخرى يدوياً */
export function showZeroChoice({ force = false, onDone = null } = {}) {
  if (!force && !shouldShowZeroChoice()) return false;
  if (qs('#' + ID)) return true;

  const el = document.createElement('div');
  el.id = ID;
  el.className = 'zero-choice';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'zeroChoiceTitle');
  el.innerHTML = `
    <div class="zero-choice__panel">
      <div class="zero-choice__head">
        <div class="zero-choice__logo">EN</div>
        <div>
          <h2 id="zeroChoiceTitle">من أين نبدأ؟</h2>
          <p class="muted small">اختر مرة واحدة، ويمكنك التبديل في أي وقت من الزر الدائم أعلى الصفحة أو من صفحة «من الصفر».</p>
        </div>
      </div>

      <div class="zero-choice__grid">
        <button class="zero-choice__card zero-choice__card--a0" type="button" data-choice="a0">
          <span class="zero-choice__icon">🌱</span>
          <b>أبدأ من الصفر (A0)</b>
          <span class="small">لا أعرف الحروف أو النطق بعد. ${ZERO_TOTALS.stages} مراحل قصيرة، ونطق عربي لكل حرف وكلمة، ولوح كتابة، واختبار نهائي وشهادة تأسيس.</span>
          <span class="chip chip--brand">${ZERO_TOTALS.items} عنصراً · ${ZERO_TOTALS.words} كلمة · ${ZERO_TOTALS.sentences} جملة</span>
        </button>

        <button class="zero-choice__card" type="button" data-choice="a1">
          <span class="zero-choice__icon">📚</span>
          <b>عندي أساس — ابدأ من A1</b>
          <span class="small">أعرف الحروف وبعض الكلمات. خُذني مباشرة إلى الدروس والوحدات والتدريبات من مستوى المبتدئ.</span>
          <span class="chip">A1 · A2 · B1 مفتوحة كلها</span>
        </button>
      </div>

      <div class="zero-choice__foot">
        <button class="btn btn--ghost btn--sm" type="button" data-choice="both">🤝 أرني الاثنين معاً — سأقرّر لاحقاً</button>
        <span class="tiny muted">كل شيء مفتوح دائماً — لا يوجد قفل على أي مستوى.</span>
      </div>
    </div>`;

  document.body.appendChild(el);
  document.body.classList.add('zero-choice-open');

  el.querySelectorAll('[data-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      const focus = choice === 'a0' ? 'a0' : 'levels';
      completeOnboarding(choice);
      if (choice === 'both') setZeroPrefs({ focus: 'levels', showA0Card: true });
      close();
      if (choice === 'a0') {
        confetti(40);
        toast('وضع «من الصفر» مفعّل — لنبدأ بالحروف 🌱', 'ok');
        navigate('/zero');
      } else {
        toast('المستويات جاهزة أمامك 📚', 'ok');
        navigate('/');
      }
      window.__leaRenderAll?.();
      onDone?.(focus);
    });
  });

  function close() {
    el.classList.add('is-closing');
    document.body.classList.remove('zero-choice-open');
    setTimeout(() => el.remove(), 240);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (e.key === 'Escape') {
      // الهروب = لم أقرر بعد: نُخفيه بلا حرمان المتعلّم من الاختيار لاحقاً
      completeOnboarding('both');
      close();
      window.__leaRenderAll?.();
    }
  }
  document.addEventListener('keydown', onKey);

  // زر «تخطّي الآن» داخل الرأس
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'zero-choice__skip';
  skip.setAttribute('aria-label', 'تخطّي الاختيار الآن');
  skip.title = 'تخطّي الآن — سأختار لاحقاً';
  skip.textContent = '✕';
  skip.addEventListener('click', () => {
    completeOnboarding('both');
    close();
    toast('لا مشكلة — القسمان في المقدمة، اختر وقتما تشاء 🙂', 'info');
    window.__leaRenderAll?.();
  });
  el.querySelector('.zero-choice__panel')?.prepend(skip);

  return true;
}

export function reopenZeroChoice() {
  setZeroPrefs({ onboarded: false });
  return showZeroChoice({ force: true });
}
