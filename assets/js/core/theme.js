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

/* الستايلات: atelier | kali (داكن دائماً) | gnome | classic */
export const SKINS = [
  { id: 'atelier', ar: 'Atelier', desc: 'هوية تحريرية دافئة مع وضعين فاتح وداكن' },
  { id: 'kali', ar: 'Kali GNOME', desc: 'داكن بلون كالي الأزرق' },
  { id: 'gnome', ar: 'GNOME', desc: 'Adwaita فاتح/داكن' },
  { id: 'classic', ar: 'الكلاسيكي', desc: 'الأزرق الأكاديمي السابق' },
];

export function applySkin() {
  const skin = SKINS.some((s) => s.id === settings.skin) ? settings.skin : 'atelier';
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
  const skin = document.documentElement.dataset.skin || 'atelier';
  const colors = {
    atelier: dark ? '#101222' : '#f3f4fb',
    kali: '#101827',
    gnome: dark ? '#151a23' : '#f5f7fb',
    classic: dark ? '#151a23' : '#f4f6fb',
  };
  const color = colors[skin] || colors.atelier;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.setAttribute('content', color);
  });
}
