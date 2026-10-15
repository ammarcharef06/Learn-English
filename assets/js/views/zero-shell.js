/* ============================================================
   قسم «من الصفر» (A0) — هيكل صفحة zero.html
   يستخدم نفس مكوّنات الموقع: .topbar · .brand · .seg · .btn
   ============================================================ */
import { esc, qs, toast, arNum } from '../core/utils.js';
import { progress, settings } from '../core/store.js';
import { zeroStats, ZERO_TOTALS } from '../data/zero.js';
import { zeroFocus, setZeroFocus, certificate } from '../core/zeroflow.js';

export function zeroModeOn() {
  return zeroFocus() === 'a0';
}

/* تنقّل قسم A0 — أربع خانات فقط بترتيب ثابت */
const NAV = [
  { hash: '#/zero', icon: '🗺️', label: 'المراحل', key: 'stages' },
  { hash: '#/zero/exam', icon: '🧪', label: 'الاختبار', key: 'exam' },
  { hash: '#/zero/certificate', icon: '🎓', label: 'الشهادة', key: 'cert' },
  { hash: '#/zero/settings', icon: '⚙️', label: 'إعدادات', key: 'settings' },
];

function activeKey(hash) {
  const h = String(hash || '').replace(/^#/, '');
  if (h.startsWith('/zero/exam')) return 'exam';
  if (h.startsWith('/zero/certificate')) return 'cert';
  if (h.startsWith('/zero/settings')) return 'settings';
  return 'stages';
}

/** يرسم شريط A0 العلوي بنفس شكل شريط الموقع. يُستدعى عند كل رسم/تنقّل. */
export function applyZeroShell(hash = null) {
  const on = zeroModeOn();
  const root = document.documentElement;
  if (on) root.dataset.zero = 'a0';
  else delete root.dataset.zero;

  const bar = qs('#zbar');
  if (!bar || !on) return;

  const zs = zeroStats(progress);
  const cert = certificate();
  const key = activeKey(hash || location.hash);
  const pct = zs.percent;

  bar.innerHTML = `
    <a class="brand" href="#/zero" title="من الصفر — تأسيس A0">
      <span class="brand__mark">A0</span>
      <span class="brand__text">
        <b>من الصفر</b>
        <small>تأسيس A0 · ${arNum(zs.doneStages)}/${arNum(ZERO_TOTALS.stages)} مراحل${cert.earned ? ' · الشهادة مُستلَمة ✓' : ''}</small>
      </span>
    </a>

    <nav class="seg zseg" aria-label="تنقل قسم من الصفر">
      ${NAV.map((n) => `<button type="button" data-go="${n.hash}" class="${n.key === key ? 'is-active' : ''}"
        ${n.key === key ? 'aria-current="page"' : ''} aria-label="${n.label}">
        <span class="zico" aria-hidden="true">${n.icon}</span> <span class="zlabel">${n.label}</span></button>`).join('')}
    </nav>

    <div class="topbar__actions">
      <span class="chip chip--brand zbar-pct" title="نسبة الإتقان في التأسيس">${arNum(pct)}٪</span>
      <button class="btn btn--sm" type="button" id="zExit" title="العودة إلى موقع المستويات" aria-label="العودة إلى موقع المستويات">↩ <span class="zexit-label">المستويات</span></button>
    </div>`;

  bar.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    const target = b.dataset.go;
    if (location.hash === target) { window.__leaRenderAll?.(); return; }
    location.hash = target;
  }));
  bar.querySelector('#zExit')?.addEventListener('click', () => exitZeroMode());
}

/** الخروج إلى موقع المستويات (A1–B1) — انتقال حقيقي إلى صفحة أخرى */
export function exitZeroMode() {
  setZeroFocus('levels');
  location.href = './index.html';
}

/** رابط صفحة A0 المستقلة (يستخدمه موقع المستويات) */
export const ZERO_PAGE = './zero.html';
