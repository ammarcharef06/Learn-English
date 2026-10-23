/* ============================================================
   المظهر واللغة — منطق مشترك بين صفحة الموقع وصفحة A0
   (كان داخل views/settings.js، ونُقل هنا ليستخدمه الشريط العلوي
   المشترك في الصفحتين بلا تحميل واجهة الإعدادات كاملة)
   ============================================================ */
import { setUiLang, applyI18n } from './i18n.js';
import { settings } from './store.js';
import { qs } from './utils.js';

export function applyTheme() {
  const theme = settings.theme || 'auto';
  const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  syncThemeColor();
}

/* الستايلات: kali (داكن دائماً) | gnome | classic */
export const SKINS = [
  { id: 'kali', ar: 'Kali GNOME', desc: 'داكن بلمسات خضراء ونحاسية' },
  { id: 'gnome', ar: 'GNOME', desc: 'ألوان مدينة التعلّم بوضع فاتح أو داكن' },
  { id: 'classic', ar: 'الكلاسيكي', desc: 'ألوان هادئة بلمسات المدينة' },
];

export function applySkin() {
  const skin = SKINS.some((s) => s.id === settings.skin) ? settings.skin : 'kali';
  document.documentElement.dataset.skin = skin;
  if (skin === 'kali') { document.documentElement.dataset.theme = 'dark'; syncThemeColor(); }
  else applyTheme();
  return skin;
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
  const color = dark ? '#171d1a' : '#34775b';
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.setAttribute('content', color);
  });
}
