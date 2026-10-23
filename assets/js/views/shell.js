/* الهيكل العام: التنقل، الشريط الجانبي، الإحصاءات المصغّرة */
import { t } from '../core/i18n.js';
import { esc, qs, pct } from '../core/utils.js';
import { streakInfo, overallStats, levelStats } from '../core/gamify.js';
import { progress } from '../core/store.js';
import { LEVELS } from '../data/curriculum.js';
import { zeroStats, ZERO_TOTALS } from '../data/zero.js';
import { currentRoute } from '../core/router.js';
import { dailyMission } from '../core/journey.js';

export const NAV_ITEMS = [
  { href: '#/', key: 'nav.home', icon: '⌂', group: 'nav.group.learn' },
  { href: '#/lessons', key: 'nav.lessons', icon: '▤', group: 'nav.group.learn' },
  { href: '#/reference', key: 'nav.reference', icon: '☷', group: 'nav.group.learn' },
  { href: '#/drills', key: 'nav.drills', icon: '✳', group: 'nav.group.practice' },
  { href: '#/flashcards', key: 'nav.flashcards', icon: '▱', group: 'nav.group.practice' },
  { href: '#/reading', key: 'nav.reading', icon: '▧', group: 'nav.group.practice' },
  { href: '#/exams', key: 'nav.exams', icon: '◷', group: 'nav.group.practice' },
  { href: '#/conversations', key: 'nav.conversations', icon: '☏', group: 'nav.group.practice' },
  { href: '#/stats', key: 'nav.stats', icon: '⌁', group: 'nav.group.me' },
  { href: '#/journey', key: 'nav.journey', icon: '⌖', group: 'nav.group.me' },
  { href: '#/notebook', key: 'nav.notebook', icon: '▣', group: 'nav.group.me' },
  { href: '#/settings', key: 'nav.settings', icon: '⚙', group: 'nav.group.me' },
];

function navLink(item) {
  const label = t(item.key);
  return `<a href="${item.href}" data-nav data-route="${item.href}" title="${esc(label)}" aria-label="${esc(label)}">
    <span class="ico" aria-hidden="true">${item.icon}</span><span class="lbl">${esc(label)}</span>
  </a>`;
}

export function renderNav() {
  const side = qs('#sidenav');
  const mission = dailyMission();
  const missionPercent = mission.total ? Math.round((mission.done / mission.total) * 100) : 0;

  if (side) {
    let html = `
      <div class="sidenav__brand">
        <img src="./assets/img/favicon.svg" alt="" aria-hidden="true" />
        <span><b>${esc(t('town.name'))}</b><small>${esc(t('brand.tag'))}</small></span>
      </div>
      <a class="session-nav${mission.done === mission.total ? ' is-complete' : ''}" href="#/session" data-nav data-route="#/session" aria-label="${esc(t('session.title'))} · ${mission.done} ${esc(t('common.of'))} ${mission.total}">
        <span class="session-nav__icon" aria-hidden="true">✦</span>
        <span class="session-nav__copy"><b>${esc(t('session.title'))}</b><small>${esc(t('session.navDetail'))}</small><span class="session-nav__track" aria-hidden="true"><i data-session-fill style="width:${missionPercent}%"></i></span></span>
        <span class="session-nav__count" data-session-count>${mission.done}/${mission.total}</span>
      </a>`;

    let lastGroup = '';
    for (const item of NAV_ITEMS) {
      if (item.group !== lastGroup) {
        html += `<div class="sidenav__group">${t(item.group)}</div>`;
        lastGroup = item.group;
      }
      html += navLink(item);
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

}

/* درج التنقّل: تنفيذ واحد مشترك بين الصفحتين (views/topbar.js) */
export { openDrawer, closeDrawer } from './topbar.js';

/* خريطة الأقسام: أي رابط يُفعَّل لكل مسار (يدعم الصفحات الفرعية) */
const SECTION_MAP = {
  '': '#/',
  lessons: '#/lessons', level: '#/lessons', unit: '#/lessons', lesson: '#/lessons',
  reference: '#/reference', drills: '#/drills', drill: '#/drills', flashcards: '#/flashcards', reading: '#/reading',
  exams: '#/exams', stats: '#/stats', journey: '#/journey', conversations: '#/conversations',
  notebook: '#/notebook', settings: '#/settings', support: '#/support', about: '#/about',
  session: '#/session',
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
  updateSessionPulse();
  const host = qs('#streakCard');
  if (host) {
    const s = streakInfo();
    if (s.streak > 0) {
      host.className = 'streak-card';
      host.innerHTML = `<b>${s.streak} 🔥</b><span>${t('common.streak')} · ${t('town.bestStreak', { count: s.best })}</span>
        <div class="progress" style="margin-top:8px;background:rgba(255,255,255,.25)"><i style="width:${pct(s.streak % 7 || 7, 7)}%;background:#fff"></i></div>
        <span class="tiny">${s.today ? t('town.studiedToday') + ' ✅' : t('town.notStudiedToday')}</span>`;
    } else {
      host.className = 'streak-card streak-card--empty';
      host.innerHTML = `<b>0</b><span>${t('town.startStreak')} 🔥</span>`;
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
      <div class="small muted">🌱 ${t('town.foundationProgress')}: ${zs.percent}% · ${zs.doneStages}/${ZERO_TOTALS.stages} ${t('town.stageCount')}</div>
      <div class="small muted">⭐ ${progress.points || 0} ${t('common.points')}</div>`;
  }
}

export function updateSessionPulse() {
  const host = qs('.session-nav');
  if (!host) return;
  const mission = dailyMission();
  const done = mission.done;
  const total = mission.total;
  const label = host.querySelector('[data-session-count]');
  const fill = host.querySelector('[data-session-fill]');
  if (label) label.textContent = `${done}/${total}`;
  if (fill) fill.style.width = `${total ? Math.round((done / total) * 100) : 0}%`;
  host.setAttribute('aria-label', `${t('session.title')} · ${done} ${t('common.of')} ${total}`);
  host.classList.toggle('is-complete', done === total);
}



const PAGE_DISTRICTS = [
  { id: 'session', key: 'town.district.academy', prefixes: ['/session'] },
  { id: 'library', key: 'town.district.library', prefixes: ['/lessons', '/lesson', '/unit', '/level'] },
  { id: 'archive', key: 'town.district.archive', prefixes: ['/reference'] },
  { id: 'practice', key: 'town.district.practice', prefixes: ['/drill', '/drills'] },
  { id: 'memory', key: 'town.district.memory', prefixes: ['/flashcards'] },
  { id: 'garden', key: 'town.district.garden', prefixes: ['/reading'] },
  { id: 'cafe', key: 'town.district.cafe', prefixes: ['/conversations'] },
  { id: 'hall', key: 'town.district.hall', prefixes: ['/exams'] },
  { id: 'observatory', key: 'town.district.observatory', prefixes: ['/stats'] },
  { id: 'map', key: 'town.district.map', prefixes: ['/journey'] },
  { id: 'notebook', key: 'town.district.notebook', prefixes: ['/notebook'] },
  { id: 'house', key: 'town.district.house', prefixes: ['/settings'] },
  { id: 'commons', key: 'town.district.commons', prefixes: ['/support', '/about'] },
];

export function pageHead({ icon = '', title = '', subtitle = '', actionsHtml = '' }) {
  const path = currentRoute().path;
  const district = PAGE_DISTRICTS.find(({ prefixes }) => prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)))
    || { id: 'academy', key: 'town.district.academy' };
  return `
    <header class="page-head" data-district="${district.id}">
      <div class="page-head__main">
        <nav class="page-head__wayfinding" aria-label="${esc(t('town.wayfinding'))}">
          <a href="#/" data-nav><span aria-hidden="true">⌂</span>${esc(t('town.name'))}</a>
          <span class="page-head__separator" aria-hidden="true">/</span>
          <span class="page-head__district">${esc(t(district.key))}</span>
        </nav>
        <div class="page-title"><span class="ico" aria-hidden="true">${icon}</span><h1>${esc(title)}</h1></div>
        ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
      </div>
      ${actionsHtml ? `<div class="row row--wrap">${actionsHtml}</div>` : ''}
    </header>`;
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
