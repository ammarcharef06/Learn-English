/* ============================================================
   قسم «من الصفر» (A0) — الهيكل المستقل
   عند تفعيل وضع A0 يتحوّل الموقع إلى واجهة أخرى تماماً:
   شريط خاص أعلى + تنقل خاص أسفل، وتُخفى واجهة المستويات كلها.
   ============================================================ */
import { esc, qs, toast, arNum } from '../core/utils.js';
import { progress, settings } from '../core/store.js';
import { zeroStats, ZERO_TOTALS } from '../data/zero.js';
import { zeroFocus, setZeroFocus, certificate } from '../core/zeroflow.js';

export function zeroModeOn() {
  return zeroFocus() === 'a0';
}

/* تنقل قسم A0 — أربع خانات فقط بترتيب ثابت */
const NAV = [
  { href: '#/zero', icon: '🗺️', label: 'المراحل', key: 'stages' },
  { href: '#/zero/exam', icon: '🧪', label: 'الاختبار', key: 'exam' },
  { href: '#/zero/certificate', icon: '🎓', label: 'الشهادة', key: 'cert' },
  { href: '#/zero/settings', icon: '⚙️', label: 'إعدادات', key: 'settings' },
];

function activeKey(hash) {
  const h = String(hash || '').replace(/^#/, '');
  if (h.startsWith('/zero/exam')) return 'exam';
  if (h.startsWith('/zero/certificate')) return 'cert';
  if (h.startsWith('/zero/settings')) return 'settings';
  return 'stages';
}

/** يطبّق الواجهة المستقلة ويُرسم شريطها وتنقلها. يُستدعى عند كل رسم/تنقّل. */
export function applyZeroShell(hash = null) {
  const on = zeroModeOn();
  const root = document.documentElement;
  if (on) root.dataset.zero = 'a0';
  else delete root.dataset.zero;

  const bar = qs('#zbar');
  const nav = qs('#znav');
  if (bar) bar.hidden = !on;
  if (nav) nav.hidden = !on;
  if (!on) return;

  const zs = zeroStats(progress);
  const cert = certificate();

  if (bar) {
    bar.innerHTML = `
      <a class="zbar__brand" href="#/zero" data-nav>
        <span class="zbar__mark" aria-hidden="true">A0</span>
        <span class="zbar__name">من الصفر</span>
      </a>
      <span class="zbar__meter" role="img" aria-label="نسبة الإتقان ${zs.percent}%">
        <span class="zbar__bar"><i style="width:${zs.percent}%"></i></span>
        <span class="zbar__pct">${arNum(zs.percent)}٪</span>
      </span>
      <button class="zbar__exit" type="button" id="zExit">الخروج إلى المستويات</button>`;
    bar.querySelector('#zExit')?.addEventListener('click', () => exitZeroMode());
  }

  if (nav) {
    const key = activeKey(hash || location.hash);
    nav.innerHTML = NAV.map((n) => `<a href="${n.href}" data-nav data-route="${n.href}"
      class="${n.key === key ? 'is-active' : ''}" ${n.key === key ? 'aria-current="page"' : ''}>
      <span class="znav__ico" aria-hidden="true">${n.icon}</span><span>${n.label}</span></a>`).join('');
    nav.setAttribute('aria-label', `تنقل قسم من الصفر · ${zs.doneStages}/${ZERO_TOTALS.stages} مراحل${cert.earned ? ' · الشهادة مُستلَمة' : ''}`);
  }
}

/** الخروج إلى واجهة المستويات (A1–B1) */
export function exitZeroMode() {
  setZeroFocus('levels');
  location.href = './index.html';
}

/** رابط صفحة A0 المستقلة (يستخدمه موقع المستويات) */
export const ZERO_PAGE = './zero.html';
