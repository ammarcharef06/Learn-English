import { t as uiText } from '../core/i18n.js';
/* ============================================================
   قسم «من الصفر» (A0) — هيكل صفحة zero.html
   نفس شريط الموقع ونفس الدرج (views/topbar.js) — تنقّل واحد لكل الأجهزة.
   ============================================================ */
import { esc, qs, arNum } from '../core/utils.js';
import { progress } from '../core/store.js';
import { zeroStats, ZERO_TOTALS, ZERO_STAGES } from '../data/zero.js';
import { zeroFocus, setZeroFocus, certificate } from '../core/zeroflow.js';

export function zeroModeOn() {
  return zeroFocus() === 'a0';
}

/* أقسام قسم A0 في الدرج (بنفس شكل قائمة الموقع) */
const NAV = [
  { hash: '#/zero', icon: '🗺️', label: uiText('ui.literal.6574c53b'), key: 'stages' },
  { hash: '#/zero/exam', icon: '🧪', label: uiText('ui.literal.cea94354'), key: 'exam' },
  { hash: '#/zero/certificate', icon: '🎓', label: uiText('ui.literal.07e8f3c3'), key: 'cert' },
  { hash: '#/zero/pad', icon: '✍️', label: uiText('ui.literal.cc3d1c0c'), key: 'pad' },
  { hash: '#/zero/settings', icon: '⚙️', label: uiText('ui.literal.462965d1'), key: 'settings' },
];
const MOBILE_NAV = NAV.filter(({ key }) => ['stages', 'exam', 'pad', 'settings'].includes(key));

function activeKey(hash) {
  const h = String(hash || '').replace(/^#/, '');
  if (h.startsWith('/zero/exam')) return 'exam';
  if (h.startsWith('/zero/certificate')) return 'cert';
  if (h.startsWith('/zero/pad')) return 'pad';
  if (h.startsWith('/zero/settings')) return 'settings';
  return 'stages';
}

/** يرسم درج قسم A0 (نفس درج الموقع) */
export function renderZeroDrawer(hash = null) {
  const nav = qs('#sidenav');
  if (!nav) return;
  const zs = zeroStats(progress);
  const cert = certificate();
  const key = activeKey(hash || location.hash);

  nav.innerHTML = `
    <div class="sidenav__brand">
      <img src="./assets/img/favicon.svg" alt="" aria-hidden="true" />
      <span><b>${uiText('ui.literal.d64e6ed6')} </b><small>${uiText('ui.literal.f52667af')} </small></span>
    </div>
    <div class="sidenav__group">${uiText('ui.literal.ef3e7371')} A0</div>
    <div class="mini-progress" style="margin:0 0 10px">
      <div class="progress"><i style="width:${zs.percent}%"></i></div>
      <div class="small muted" style="margin-top:6px">${arNum(zs.percent)}٪ · ${arNum(zs.doneStages)}/${arNum(ZERO_TOTALS.stages)} ${uiText('ui.literal.000ac055')} · ${arNum(zs.lettersMastered)}/${arNum(ZERO_TOTALS.letters)} ${uiText('ui.literal.65b30810')} ${cert.earned ? uiText('ui.literal.4984cde1') : ''}</div>
    </div>
    ${NAV.map((n) => `<a href="${n.hash}" data-nav data-route="${n.hash}" class="${n.key === key ? 'is-active' : ''}" ${n.key === key ? 'aria-current="page"' : ''}><span class="ico" aria-hidden="true">${n.icon}</span><span class="lbl">${esc(n.label)}</span></a>`).join('')}
    <div class="sidenav__group">${uiText('ui.literal.bc15421e')} </div>
    <a href="./index.html" title="${uiText('ui.literal.0a8c0821')} "><span class="ico" aria-hidden="true">📚</span><span class="lbl">${uiText('ui.literal.112885cf')} A1–B1</span></a>`;

  /* وسم المراحل المكتملة داخل الدرج */
  const done = progress.zero?.stages || {};
  ZERO_STAGES.forEach((s) => {
    const a = nav.querySelector(`[data-route="#/zero/stage/${s.id}"]`);
    if (a && done[s.id]?.done) a.classList.add('is-done');
  });

  const mobileNav = qs('#bottomnav');
  if (mobileNav) {
    mobileNav.innerHTML = MOBILE_NAV.map((item) => `
      <a href="${item.hash}" data-nav data-route="${item.hash}" class="${item.key === key ? 'is-active' : ''}"
        ${item.key === key ? 'aria-current="page"' : ''} aria-label="${esc(item.label)}">
        <span aria-hidden="true">${item.icon}</span><small>${esc(item.label)}</small>
      </a>`).join('');
  }
}

/** يُستدعى عند كل رسم/تنقّل: يثبّت وضع A0 ويرسم الدرج */
export function applyZeroShell(hash = null) {
  const on = zeroModeOn();
  const root = document.documentElement;
  if (on) root.dataset.zero = 'a0';
  else delete root.dataset.zero;
  if (on) renderZeroDrawer(hash);
}

/** الخروج إلى موقع المستويات (A1–B1) — انتقال حقيقي إلى صفحة أخرى */
export function exitZeroMode() {
  setZeroFocus('levels');
  location.href = './index.html';
}

/** رابط صفحة A0 المستقلة (يستخدمه موقع المستويات) */
export const ZERO_PAGE = './zero.html';
