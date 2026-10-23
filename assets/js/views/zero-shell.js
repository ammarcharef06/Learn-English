/* غلاف A0: القائمة الجانبية على الشاشات الواسعة ودرج من الرأس على الهاتف. */
import { esc, qs, arNum } from '../core/utils.js';
import { progress } from '../core/store.js';
import { zeroStats, ZERO_TOTALS } from '../data/zero.js';
import { zeroFocus, setZeroFocus, certificate } from '../core/zeroflow.js';

const NAV = [
  { hash: '#/zero', icon: '⌖', label: 'خريطة المراحل', key: 'stages' },
  { hash: '#/zero/pad', icon: '✎', label: 'لوح الكتابة', key: 'pad' },
  { hash: '#/zero/exam', icon: '◷', label: 'الاختبار النهائي', key: 'exam' },
  { hash: '#/zero/certificate', icon: '🎓', label: 'شهادة التأسيس', key: 'cert' },
  { hash: '#/zero/settings', icon: '⚙', label: 'إعدادات التأسيس', key: 'settings' },
];

function activeKey(hash) {
  const route = String(hash || '').replace(/^#/, '').split('?')[0];
  if (route.startsWith('/zero/exam')) return 'exam';
  if (route.startsWith('/zero/certificate')) return 'cert';
  if (route.startsWith('/zero/pad')) return 'pad';
  if (route.startsWith('/zero/settings')) return 'settings';
  return 'stages';
}

function link(item, currentKey) {
  const active = item.key === currentKey;
  return `<a href="${item.hash}" data-nav data-route="${item.hash}" class="${active ? 'is-active' : ''}"${active ? ' aria-current="page"' : ''} aria-label="${esc(item.label)}" title="${esc(item.label)}">
    <span class="ico" aria-hidden="true">${item.icon}</span><span class="lbl">${esc(item.label)}</span>
  </a>`;
}

export function zeroModeOn() {
  return zeroFocus() === 'a0';
}

/** يرسم القائمة الجانبية لقسم A0 ويحدّث وجهاتها وحالتها النشطة. */
export function renderZeroDrawer(hash = null) {
  const side = qs('#sidenav');
  const stats = zeroStats(progress);
  const cert = certificate();
  const currentKey = activeKey(hash || location.hash);

  if (side) {
    side.innerHTML = `
      <div class="sidenav__brand">
        <img src="./assets/img/favicon.svg" alt="" aria-hidden="true" />
        <span><b>أكاديمية الإنجليزية</b><small>تأسيس A0 · خطوتك الأولى</small></span>
      </div>
      <div class="sidenav__group">رحلة التأسيس</div>
      <div class="mini-progress" style="margin:0 0 10px">
        <div class="progress"><i style="width:${stats.percent}%"></i></div>
        <div class="small muted" style="margin-top:6px">${arNum(stats.percent)}٪ · ${arNum(stats.doneStages)}/${arNum(ZERO_TOTALS.stages)} مراحل · ${arNum(stats.lettersMastered)}/${arNum(ZERO_TOTALS.letters)} حرفاً${cert.earned ? ' · الشهادة مكتملة ✓' : ''}</div>
      </div>
      ${NAV.slice(0, 4).map((item) => link(item, currentKey)).join('')}
      <div class="sidenav__group">تفضيلاتك</div>
      ${link(NAV[4], currentKey)}`;
  }
}

/** يثبّت سمة A0 ويزامن عناصر التنقّل بعد كل مسار أو تحديث للتقدّم. */
export function applyZeroShell(hash = null) {
  const root = document.documentElement;
  if (zeroModeOn()) root.dataset.zero = 'a0';
  else delete root.dataset.zero;
  renderZeroDrawer(hash);
}

/** Records a deliberate in-content jump from the foundation into the levels app. */
export function exitZeroMode(target = './index.html#/') {
  setZeroFocus('levels');
  location.href = target;
}
