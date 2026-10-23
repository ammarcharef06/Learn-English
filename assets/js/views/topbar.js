/* شريط الأكاديمية المشترك. لكل صفحة خريطة وجهاتها، بينما سلوك الدرج واحد. */
import { qs, esc } from '../core/utils.js';
import { settings, saveSettings } from '../core/store.js';
import { t } from '../core/i18n.js';
import { applyLang } from '../core/theme.js';
import { setZeroFocus } from '../core/zeroflow.js';

/* ---------------- الدرج ---------------- */
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
export function toggleDrawer() {
  if (qs('#sidebar')?.classList.contains('is-open')) closeDrawer();
  else openDrawer();
}
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
  const brandHref = isZero ? '#/zero' : '#/';
  const name = isZero ? 'من الصفر — تأسيس A0' : t('brand.name');
  const tag = isZero ? 'الحروف · الأرقام · أول ١٢٠ كلمة' : t('brand.tag');
  const menuLabel = settings.uiLang === 'en' ? 'Open navigation menu' : 'فتح القائمة الجانبية';
  const destinationMode = isZero ? 'levels' : 'zero';
  const destinationLabel = t(isZero ? 'nav.modeLevels' : 'nav.modeZero');
  const destinationCode = isZero ? 'A1' : 'A0';
  const switchLabel = settings.uiLang === 'en' ? `Open ${destinationLabel}` : `الانتقال إلى ${destinationLabel}`;
  const switchText = settings.uiLang === 'en' ? (isZero ? 'Levels' : 'From zero') : (isZero ? 'المستويات' : 'من الصفر');
  return `
    <button class="icon-btn topbar__menu" id="btnMenu" type="button" aria-label="${esc(menuLabel)}" aria-controls="sidebar" aria-expanded="false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5h16M4 12h16M4 17.5h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <a class="brand" href="${brandHref}" data-nav>
      <img class="brand__mark" src="./assets/img/favicon.svg" alt="" aria-hidden="true" />
      <span class="brand__text"><b>${esc(name)}</b><small>${esc(tag)}</small></span>
    </a>
    <button class="chapter-switch-btn" id="btnChapterSwitch" type="button" data-destination-mode="${destinationMode}" aria-label="${esc(switchLabel)}" title="${esc(switchLabel)}">
      <span class="chapter-switch-btn__icon${isZero ? ' chapter-switch-btn__icon--to-levels' : ''}" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3.75h9.5L19 7.3v12.95H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M15.5 3.9v4h3.2M9 13h6m-6 3h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m15.4 10.5 2.8 2.5-2.8 2.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <span class="chapter-switch-btn__label">${esc(switchText)}</span>
      <b>${destinationCode}</b>
    </button>
    <div class="topbar__actions">
      <button class="icon-btn" id="btnInstall" type="button" hidden title="${t('set.install')}" aria-label="${t('set.install')}">${ICON.install}</button>
      ${isZero ? '' : `<button class="icon-btn" id="btnLang" type="button" title="تبديل لغة الواجهة" aria-label="تبديل لغة الواجهة">
        <span class="icon-btn__text" id="langLabel">${settings.uiLang === 'en' ? 'ع' : 'EN'}</span>
      </button>`}
    </div>`;
}

/** يرسم هوية الصفحة وأزرار اللغة والتثبيت؛ التنقّل له موضع واحد مستقل. */
export function renderTopbar(root, mode = 'site', { onRerender = null } = {}) {
  if (!root) return;
  root.innerHTML = topbarHTML(mode);
  root.querySelector('#btnMenu')?.addEventListener('click', toggleDrawer);
  const rerender = () => (typeof onRerender === 'function' ? onRerender() : window.__leaRenderAll?.());

  root.querySelector('#btnChapterSwitch')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const targetMode = button.dataset.destinationMode;
    const target = targetMode === 'zero' ? './zero.html#/zero' : './index.html#/lessons';
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    setZeroFocus(targetMode === 'zero' ? 'a0' : 'levels');
    if (reducedMotion) {
      window.location.assign(target);
      return;
    }

    button.disabled = true;
    const app = qs('#app');
    app?.classList.add('is-page-folding', `is-page-folding--to-${targetMode}`);
    document.body.classList.add('is-page-turning');
    const transition = document.createElement('div');
    transition.className = `page-fold page-fold--to-${targetMode}`;
    transition.setAttribute('role', 'status');
    transition.setAttribute('aria-live', 'polite');
    const destinationLabel = t(targetMode === 'zero' ? 'nav.modeZero' : 'nav.modeLevels');
    const currentCode = mode === 'zero' ? 'A0' : 'A1';
    const destinationCode = targetMode === 'zero' ? 'A0' : 'A1';
    transition.innerHTML = `<span class="page-fold__crease" aria-hidden="true"></span>
      <span class="page-fold__caption"><small dir="ltr">${currentCode} <i aria-hidden="true">→</i> ${destinationCode}</small><b>${esc(destinationLabel)}</b></span>`;
    document.body.append(transition);
    window.setTimeout(() => window.location.assign(target), 760);
  });

  root.querySelector('#btnLang')?.addEventListener('click', () => {
    saveSettings({ uiLang: settings.uiLang === 'en' ? 'ar' : 'en' });
    applyLang();
    rerender();
  });

  root.querySelector('#btnInstall')?.addEventListener('click', () => window.__leaInstall?.());

  return root;
}
