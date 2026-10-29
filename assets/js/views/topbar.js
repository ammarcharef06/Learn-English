import { t as uiText } from '../core/i18n.js';
/* ============================================================
   شريط مشترك للموقع وصفحة A0؛ الموقع يستخدم قائمة هاتف وشريطاً جانبياً
   قابلاً للطي على سطح المكتب، بينما تحتفظ صفحة A0 بتنقلها المستقل.
   ============================================================ */
import { qs, esc } from '../core/utils.js';
import { settings, saveSettings } from '../core/store.js';
import { t } from '../core/i18n.js';
import { applyLang } from '../core/theme.js';

/* ---------------- الدرج ---------------- */
export function isDrawerOpen() {
  return !!qs('#sidebar')?.classList.contains('is-open');
}
export function openDrawer() {
  const sb = qs('#sidebar');
  if (!sb) return;
  sb.classList.add('is-open');
  const scrim = qs('#scrim');
  if (scrim) scrim.hidden = false;
  qs('#btnMenu')?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
  const first = sb.querySelector('a, button');
  if (first) setTimeout(() => { try { first.focus({ preventScroll: true }); } catch { /* تجاهل */ } }, 60);
}
export function closeDrawer() {
  const sb = qs('#sidebar');
  if (!sb) return;
  sb.classList.remove('is-open');
  const scrim = qs('#scrim');
  if (scrim) scrim.hidden = true;
  qs('#btnMenu')?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('drawer-open');
}
export function toggleDrawer() { if (isDrawerOpen()) closeDrawer(); else openDrawer(); }

/* ---------------- الشريط العلوي ---------------- */
const ICON = {
  install: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/**
 * markup الشريط العلوي
 * @param {'site'|'zero'} mode
 */
export function topbarHTML(mode = 'site') {
  const isZero = mode === 'zero';
  const isEsh = document.documentElement.dataset.curriculum === 'esh';
  const brandHref = isZero ? '#/zero' : '#/';
  const name = isZero ? uiText('ui.literal.454f7262') : t('brand.name');
  const tag = isZero ? uiText('ui.literal.fd190e5d') : t('brand.tag');
  return `
    <button class="icon-btn topbar__menu" id="btnMenu" type="button" title="${t('nav.toggle')}" aria-label="${t('nav.toggle')}" aria-expanded="false" aria-controls="sidebar">
      <span class="burger" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>

    <a class="brand" href="${brandHref}" ${isZero ? '' : 'data-nav'}>
      <img class="brand__mark" src="./assets/img/favicon.svg" alt="" aria-hidden="true" />
      <span class="brand__text"><b>${esc(name)}</b><small>${esc(tag)}</small></span>
    </a>

    <nav class="topnav" id="topnav" hidden></nav>

    <div class="topbar__actions">
      <button class="icon-btn" id="btnInstall" type="button" hidden title="${t('set.install')}" aria-label="${t('set.install')}">${ICON.install}</button>
      ${isEsh ? '' : `<button class="icon-btn" id="btnLang" type="button" title="${uiText('ui.literal.57707b8d')} " aria-label="${uiText('ui.literal.57707b8d')} ">
        <span class="icon-btn__text" id="langLabel">${settings.uiLang === 'en' ? 'ع' : 'EN'}</span>
      </button>`}
    </div>`;
}

/** يرسم الشريط ويربط أزراره المشتركة (القائمة · اللغة · التثبيت) */
export function renderTopbar(root, mode = 'site', { onRerender = null } = {}) {
  if (!root) return;
  root.innerHTML = topbarHTML(mode);
  const rerender = () => (typeof onRerender === 'function' ? onRerender() : window.__leaRenderAll?.());

  const menuButton = root.querySelector('#btnMenu');
  try {
    const collapsed = localStorage.getItem('lea.shell.sidebar-collapsed') === 'true';
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    menuButton?.setAttribute('aria-expanded', String(!collapsed));
  } catch { /* Shell preferences remain usable when storage is unavailable. */ }
  menuButton?.addEventListener('click', () => {
    if (window.matchMedia('(min-width: 900px)').matches) {
      const collapsed = !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      menuButton.setAttribute('aria-expanded', String(!collapsed));
      try { localStorage.setItem('lea.shell.sidebar-collapsed', String(collapsed)); } catch { /* Optional preference. */ }
      return;
    }
    toggleDrawer();
  });

  root.querySelector('#btnLang')?.addEventListener('click', () => {
    saveSettings({ uiLang: settings.uiLang === 'en' ? 'ar' : 'en' });
    applyLang();
    rerender();
  });

  root.querySelector('#btnInstall')?.addEventListener('click', () => window.__leaInstall?.());

  return root;
}
