/* ============================================================
   الشريط العلوي المشترك + الدرج
   صفحة الموقع (index.html) وصفحة A0 (zero.html) تستخدمان هذا الملف
   نفسه: نفس الشعار ونفس الأزرار ونفس الدرج — تنقّل واحد لكل الأجهزة.
   التنقّل الوحيد الآن: زر ☰ يفتح درجاً جانبياً (لا شريط سفلي ولا
   قائمة جانبية ثابتة).
   ============================================================ */
import { qs, toast, esc } from '../core/utils.js';
import { settings, saveSettings } from '../core/store.js';
import { t } from '../core/i18n.js';
import { SKINS, applySkin, applyLang } from '../core/theme.js';

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
  style: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-.5-.2-.9-.5-1.3-.3-.4-.4-.7-.4-1.1 0-.8.7-1.5 1.6-1.5H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><circle cx="7.6" cy="11.4" r="1.2" fill="currentColor"/><circle cx="10.6" cy="7.6" r="1.2" fill="currentColor"/><circle cx="15" cy="8.4" r="1.2" fill="currentColor"/></svg>',
  sun: '<svg class="ico-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  moon: '<svg class="ico-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4.5 18h15L18 15.5Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M10 21h4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
};

/**
 * markup الشريط العلوي
 * @param {'site'|'zero'} mode
 */
export function topbarHTML(mode = 'site') {
  const isZero = mode === 'zero';
  const brandHref = isZero ? '#/zero' : '#/';
  const name = isZero ? 'من الصفر — تأسيس A0' : t('brand.name');
  const tag = isZero ? 'الحروف · الأرقام · أول ١٢٠ كلمة' : t('brand.tag');
  return `
    <button class="icon-btn topbar__menu" id="btnMenu" type="button" title="القائمة" aria-label="القائمة" aria-expanded="false" aria-controls="sidebar">
      <span class="burger" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>

    <a class="brand" href="${brandHref}" ${isZero ? '' : 'data-nav'}>
      <img class="brand__mark" src="./assets/img/favicon.svg" alt="" aria-hidden="true" />
      <span class="brand__text"><b>${esc(name)}</b><small>${esc(tag)}</small></span>
    </a>

    <nav class="topnav" id="topnav" hidden></nav>

    <div class="topbar__actions">
      <button class="icon-btn" id="btnInstall" type="button" hidden title="${t('set.install')}" aria-label="${t('set.install')}">${ICON.install}</button>
      <button class="icon-btn topbar-opt" id="btnStyle" type="button" title="تبديل ستايل الواجهة" aria-label="تبديل ستايل الواجهة">${ICON.style}</button>
      <button class="icon-btn" id="btnLang" type="button" title="تبديل لغة الواجهة" aria-label="تبديل لغة الواجهة">
        <span class="icon-btn__text" id="langLabel">${settings.uiLang === 'en' ? 'ع' : 'EN'}</span>
      </button>
      <button class="icon-btn" id="btnTheme" type="button" title="تبديل المظهر" aria-label="تبديل المظهر">${ICON.sun}${ICON.moon}</button>
      ${isZero ? '' : `<button class="icon-btn topbar-opt" id="btnBell" type="button" title="التذكيرات والإشعارات" aria-label="التذكيرات والإشعارات">${ICON.bell}</button>`}
    </div>`;
}

/** يرسم الشريط ويربط أزراره المشتركة (القائمة · الستايل · اللغة · المظهر · التثبيت) */
export function renderTopbar(root, mode = 'site', { onRerender = null } = {}) {
  if (!root) return;
  root.innerHTML = topbarHTML(mode);
  const rerender = () => (typeof onRerender === 'function' ? onRerender() : window.__leaRenderAll?.());

  root.querySelector('#btnMenu')?.addEventListener('click', toggleDrawer);

  root.querySelector('#btnTheme')?.addEventListener('click', () => {
    if ((settings.skin || 'kali') === 'kali') {
      // كالي داكن دائماً: الزر يبدّل إلى GNOME الفاتح كبديل سريع
      saveSettings({ skin: 'gnome', theme: 'light' });
      applySkin();
      toast('الستايل: GNOME فاتح ☀️', 'info');
    } else {
      const dark = document.documentElement.dataset.theme === 'dark';
      saveSettings({ theme: dark ? 'light' : 'dark' });
      applySkin();
      toast(dark ? 'المظهر: فاتح ☀️' : 'المظهر: داكن 🌙', 'info');
    }
    rerender();
  });

  root.querySelector('#btnStyle')?.addEventListener('click', () => {
    const order = SKINS.map((s) => s.id);
    const current = SKINS.some((s) => s.id === settings.skin) ? settings.skin : 'kali';
    const next = order[(order.indexOf(current) + 1) % order.length];
    saveSettings({ skin: next });
    const applied = applySkin();
    const label = SKINS.find((s) => s.id === applied);
    toast(`الستايل: ${label ? label.ar : applied}`, 'info');
    rerender();
  });

  root.querySelector('#btnLang')?.addEventListener('click', () => {
    saveSettings({ uiLang: settings.uiLang === 'en' ? 'ar' : 'en' });
    applyLang();
    rerender();
  });

  root.querySelector('#btnInstall')?.addEventListener('click', () => window.__leaInstall?.());

  return root;
}
