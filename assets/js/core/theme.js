/* ============================================================
   المظهر واللغة — منطق مشترك بين صفحة الموقع وصفحة A0
   (كان داخل views/settings.js، ونُقل هنا ليستخدمه الشريط العلوي
   المشترك في الصفحتين بلا تحميل واجهة الإعدادات كاملة)
   ============================================================ */
import { setUiLang, applyI18n } from './i18n.js';
import { settings } from './store.js';
import { qs } from './utils.js';

export function applyTheme() {
  const theme = settings.theme || 'dark';
  const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  syncThemeColor();
}

export function applySkin() {
  document.documentElement.dataset.skin = 'nocturne';
  applyTheme();
  return 'nocturne';
}

export function applyAccessibility() {
  document.documentElement.dataset.contrast = settings.highContrast ? 'high' : 'normal';
  document.documentElement.dataset.reduceMotion = settings.reduceAnimations ? 'true' : 'false';
}

export function applyLang() {
  const lang = settings.uiLang === 'en' ? 'en' : 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  document.documentElement.dataset.uiLang = lang;
  setUiLang(lang);
  applyI18n(document);
  const btn = qs('#langLabel');
  if (btn) btn.textContent = lang === 'en' ? 'ع' : 'EN';
}

/** يُزامن لون شريط حالة النظام مع المظهر الحالي (يعمل عند التثبيت على الجوال) */
export function syncThemeColor() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const color = dark ? '#050607' : '#f4f6f4';
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.setAttribute('content', color);
  });
}
