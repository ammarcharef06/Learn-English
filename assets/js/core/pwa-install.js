/* إدارة تثبيت PWA مرة واحدة لكل صفحة تستخدم غلاف الأكاديمية المشترك. */
import { qs, toast } from './utils.js';

let deferredPrompt = null;
let initialized = false;

export function setupPwaInstall() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    const button = qs('#btnInstall');
    if (button) button.hidden = false;
  });

  window.__leaInstall = async () => {
    const button = qs('#btnInstall');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        toast('تم تثبيت التطبيق 🎉', 'ok');
        if (button) button.hidden = true;
      }
      deferredPrompt = null;
      return true;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) toast('على الآيفون: زر المشاركة ← «إضافة إلى الشاشة الرئيسية»', 'info', 'تثبيت التطبيق');
    else toast('افتح قائمة المتصفح ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»', 'info', 'تثبيت التطبيق');
    return false;
  };

  window.addEventListener('appinstalled', () => toast('التطبيق مثبّت على جهازك ✅', 'ok'));
}
