import { t as uiText } from '../core/i18n.js';
﻿/* الهيكل العام: التنقل، الشريط الجانبي، الإحصاءات المصغّرة */
import { t } from '../core/i18n.js';
import { esc, qs, todayKey, pct, arNum } from '../core/utils.js';
import { streakInfo, overallStats, levelStats } from '../core/gamify.js';
import { progress, settings } from '../core/store.js';
import { LEVELS } from '../data/curriculum.js';
import { zeroStats, ZERO_TOTALS } from '../data/zero.js';

export const NAV_ITEMS = [
  { href: '#/', key: 'nav.home', icon: '🏠', group: 'nav.group.learn', bottom: true },
  { href: '#/lessons', key: 'nav.lessons', icon: '📚', group: 'nav.group.learn', bottom: true },
  { href: '#/reference', key: 'nav.reference', icon: '📋', group: 'nav.group.learn' },
  { href: '#/drills', key: 'nav.drills', icon: '🎯', group: 'nav.group.practice', bottom: true },
  { href: '#/flashcards', key: 'nav.flashcards', icon: '🃏', group: 'nav.group.practice' },
  { href: '#/reading', key: 'nav.reading', icon: '📖', group: 'nav.group.practice', bottom: true },
  { href: '#/exams', key: 'nav.exams', icon: '🧪', group: 'nav.group.practice' },
  { href: '#/conversations', key: 'nav.conversations', icon: '💬', group: 'nav.group.practice' },
  { href: '#/stats', key: 'nav.stats', icon: '📊', group: 'nav.group.me' },
  { href: '#/journey', key: 'nav.journey', icon: '🧭', group: 'nav.group.me' },
  { href: '#/notebook', key: 'nav.notebook', icon: '📒', group: 'nav.group.me' },
  { href: '#/settings', key: 'nav.settings', icon: '⚙️', group: 'nav.group.me', bottom: true },
];

const MOBILE_NAV = [
  { href: '#/', key: 'nav.home', icon: '⌂' },
  { href: '#/flashcards', key: 'nav.flow', icon: '↗' },
  { href: '#/lessons', key: 'nav.lessons', icon: '◇' },
  { href: '#/settings', key: 'nav.settings', icon: '⚙' },
];

export function renderNav() {
  const side = qs('#sidenav');
  const bottom = qs('#bottomnav');
  const zs = zeroStats(progress);

  if (side) {
    /* الخيار الوحيد للدخول إلى قسم «من الصفر» (A0) — صفحة zero.html المستقلة */
    let html = `
      <div class="sidenav__brand">
        <img src="./assets/img/favicon.svg" alt="" aria-hidden="true" />
        <span><b>English Academy</b><small>${uiText('ui.literal.70104948')} </small></span>
      </div>
      <a class="zero-nav" href="./zero.html" title="${uiText('ui.literal.ef3e7371')} A0 (${uiText('ui.literal.77a60dd7')} ">
        <span class="zero-nav__badge" aria-hidden="true">A0</span>
        <span class="zero-nav__txt">
          <b>${uiText('ui.literal.ef3e7371')} A0</b>
          <small>${zs.percent ? `${arNum(zs.percent)}٪ · ${arNum(zs.doneStages)}/${arNum(ZERO_TOTALS.stages)} ${uiText('ui.literal.000ac055')} ` : uiText('ui.literal.0c94e627')}</small>
          <span class="progress"><i style="width:${zs.percent}%"></i></span>
        </span>
        <span class="zero-nav__arrow" aria-hidden="true">←</span>
      </a>`;

    let lastGroup = '';
    for (const item of NAV_ITEMS) {
      if (item.group !== lastGroup) {
        html += `<div class="sidenav__group">${t(item.group)}</div>`;
        lastGroup = item.group;
      }
      html += `<a href="${item.href}" data-nav data-route="${item.href}" title="${t(item.key)}"><span class="ico" aria-hidden="true">${item.icon}</span><span class="lbl">${t(item.key)}</span></a>`;
    }
    html += `<div class="sidenav__group">${t('nav.group.learn')}</div>`;
    LEVELS.forEach((lv) => {
      html += `<a href="#/level/${lv.id}" data-nav data-route="#/level/${lv.id}" title="${esc(lv.label)}"><span class="ico" aria-hidden="true">${lv.icon}</span><span class="lbl">${esc(lv.label)}</span></a>`;
    });
    html += `<div class="sidenav__group">${t('nav.group.me')}</div>`;
    html += `<a href="#/about" data-nav data-route="#/about" title="${t('nav.about')}"><span class="ico" aria-hidden="true">ℹ️</span><span class="lbl">${t('nav.about')}</span></a>`;
    html += `<a href="#/support" data-nav data-route="#/support" title="${t('nav.support')}"><span class="ico" aria-hidden="true">💛</span><span class="lbl">${t('nav.support')}</span></a>`;
    side.innerHTML = html;
  }

  if (bottom) {
    bottom.innerHTML = MOBILE_NAV.map((item) =>
      `<a href="${item.href}" data-nav data-route="${item.href}"><span aria-hidden="true">${item.icon}</span><small>${t(item.key)}</small></a>`,
    ).join('');
  }
}

/* درج التنقّل: تنفيذ واحد مشترك بين الصفحتين (views/topbar.js) */
export { openDrawer, closeDrawer, toggleDrawer, isDrawerOpen } from './topbar.js';

/* خريطة الأقسام: أي رابط يُفعَّل لكل مسار (يدعم الصفحات الفرعية) */
const SECTION_MAP = {
  '': '#/',
  lessons: '#/lessons', level: '#/lessons', unit: '#/lessons', lesson: '#/lessons',
  reference: '#/reference', drills: '#/drills', drill: '#/drills', flashcards: '#/flashcards', reading: '#/reading',
  exams: '#/exams', stats: '#/stats', journey: '#/journey', conversations: '#/conversations',
  notebook: '#/notebook', settings: '#/settings', support: '#/support', about: '#/about',
};

export function activeHrefFor(path) {
  const seg = String(path || '/').split('/').filter(Boolean)[0] || '';
  return SECTION_MAP[seg] || null;
}

export function setActiveNav(path) {
  const active = activeHrefFor(path);
  document.querySelectorAll('[data-route]').forEach((a) => {
    const on = !!active && a.dataset.route === active;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

export function renderSidebarStats() {
  const host = qs('#streakCard');
  if (host) {
    const s = streakInfo();
    if (s.streak > 0) {
      host.className = 'streak-card';
      host.innerHTML = `<b>${s.streak} 🔥</b><span>${t('common.streak')} · ${uiText('ui.literal.26434056')} ${s.best}</span>
        <div class="progress" style="margin-top:8px;background:rgba(255,255,255,.25)"><i style="width:${pct(s.streak % 7 || 7, 7)}%;background:#fff"></i></div>
        <span class="tiny">${s.today ? uiText('ui.literal.bf79bb2b') : uiText('ui.literal.fa0c57b1')}</span>`;
    } else {
      host.className = 'streak-card streak-card--empty';
      host.innerHTML = uiText('ui.literal.540f5a83');
    }
  }
  const mini = qs('#miniProgress');
  if (mini) {
    const o = overallStats();
    const zs = zeroStats(progress);
    mini.innerHTML = `
      <b>${t('dash.courseProgress')}</b>
      <div class="progress"><i style="width:${o.percent}%"></i></div>
      <div class="small muted" style="margin-top:6px">${o.unitsDone} / ${o.unitsTotal} ${t('lessons.units')} · ${o.percent}%</div>
      <div class="small muted">🌱 ${uiText('ui.literal.e4013531')} A0: ${zs.percent}% · ${zs.doneStages}/${ZERO_TOTALS.stages} ${uiText('ui.literal.000ac055')} </div>
      <div class="small muted">⭐ ${progress.points || 0} ${t('common.points')}</div>`;
  }
}



export function pageHead({ icon = '', title = '', subtitle = '', actionsHtml = '' }) {
  return `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico">${icon}</span><h1>${esc(title)}</h1></div>
        ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
      </div>
      ${actionsHtml ? `<div class="row row--wrap">${actionsHtml}</div>` : ''}
    </div>`;
}

export function progressBar(percent, variant = '') {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return `<div class="progress ${variant}"><i style="width:${p}%"></i></div>`;
}

export function statCard({ label, value, foot = '', variant = '' }) {
  return `<div class="stat ${variant}">
    <div class="stat__label">${esc(label)}</div>
    <div class="stat__value">${esc(String(value))}</div>
    ${foot ? `<div class="stat__foot">${esc(foot)}</div>` : ''}
  </div>`;
}

export { levelStats };
