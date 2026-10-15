/* الهيكل العام: التنقل، الشريط الجانبي، الإحصاءات المصغّرة */
import { t } from '../core/i18n.js';
import { esc, qs, todayKey, pct } from '../core/utils.js';
import { streakInfo, overallStats, levelStats } from '../core/gamify.js';
import { progress, settings } from '../core/store.js';
import { LEVELS } from '../data/curriculum.js';

export const NAV_ITEMS = [
  { href: '#/', key: 'nav.home', icon: '🏠', group: 'nav.group.learn', bottom: true },
  { href: '#/lessons', key: 'nav.lessons', icon: '📚', group: 'nav.group.learn', bottom: true },
  { href: '#/reference', key: 'nav.reference', icon: '📋', group: 'nav.group.learn' },
  { href: '#/drills', key: 'nav.drills', icon: '🎯', group: 'nav.group.practice', bottom: true },
  { href: '#/flashcards', key: 'nav.flashcards', icon: '🃏', group: 'nav.group.practice' },
  { href: '#/reading', key: 'nav.reading', icon: '📖', group: 'nav.group.practice', bottom: true },
  { href: '#/exams', key: 'nav.exams', icon: '🧪', group: 'nav.group.practice' },
  { href: '#/stats', key: 'nav.stats', icon: '📊', group: 'nav.group.me' },
  { href: '#/notebook', key: 'nav.notebook', icon: '📒', group: 'nav.group.me' },
  { href: '#/settings', key: 'nav.settings', icon: '⚙️', group: 'nav.group.me', bottom: true },
];

export function renderNav() {
  const side = qs('#sidenav');
  const bottom = qs('#bottomnav');

  if (side) {
    let html = '';
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
    side.innerHTML = html;
  }

  if (bottom) {
    bottom.innerHTML = NAV_ITEMS.filter((i) => i.bottom)
      .map((i) => `<a href="${i.href}" data-nav data-route="${i.href}" aria-label="${t(i.key)}"><span class="ico" aria-hidden="true">${i.icon}</span><span>${t(i.key)}</span></a>`).join('');
  }
}

/* خريطة الأقسام: أي رابط يُفعَّل لكل مسار (يدعم الصفحات الفرعية) */
const SECTION_MAP = {
  '': '#/',
  lessons: '#/lessons', level: '#/lessons', unit: '#/lessons', lesson: '#/lessons',
  reference: '#/reference', drills: '#/drills', drill: '#/drills', flashcards: '#/flashcards', reading: '#/reading',
  exams: '#/exams', stats: '#/stats', notebook: '#/notebook', settings: '#/settings', about: '#/about',
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
      host.innerHTML = `<b>${s.streak} 🔥</b><span>${t('common.streak')} · أفضل سلسلة: ${s.best}</span>
        <div class="progress" style="margin-top:8px;background:rgba(255,255,255,.25)"><i style="width:${pct(s.streak % 7 || 7, 7)}%;background:#fff"></i></div>
        <span class="tiny">${s.today ? 'درست اليوم ✅' : 'لم تدرس اليوم بعد'}</span>`;
    } else {
      host.className = 'streak-card streak-card--empty';
      host.innerHTML = `<b>0</b><span>ابدأ سلسلتك اليوم — أول جلسة تفتح السلسلة 🔥</span>`;
    }
  }
  const mini = qs('#miniProgress');
  if (mini) {
    const o = overallStats();
    mini.innerHTML = `
      <b>${t('dash.courseProgress')}</b>
      <div class="progress"><i style="width:${o.percent}%"></i></div>
      <div class="small muted" style="margin-top:6px">${o.unitsDone} / ${o.unitsTotal} ${t('lessons.units')} · ${o.percent}%</div>
      <div class="small muted">⭐ ${progress.points || 0} ${t('common.points')}</div>`;
  }
}

export function openDrawer() {
  const sb = qs('#sidebar');
  const scrim = qs('#scrim');
  if (!sb) return;
  sb.classList.add('is-open');
  if (scrim) scrim.hidden = false;
  qs('#btnMenu')?.setAttribute('aria-expanded', 'true');
}
export function closeDrawer() {
  const sb = qs('#sidebar');
  const scrim = qs('#scrim');
  if (!sb) return;
  sb.classList.remove('is-open');
  if (scrim) scrim.hidden = true;
  qs('#btnMenu')?.setAttribute('aria-expanded', 'false');
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
