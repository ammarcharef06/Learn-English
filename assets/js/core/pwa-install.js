import { t as uiText } from './i18n.js';
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
        toast(uiText('ui.literal.f7f826da'), 'ok');
        if (button) button.hidden = true;
      }
      deferredPrompt = null;
      return true;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) toast(uiText('ui.literal.b11a774b'), 'info', uiText('ui.literal.c81ff41e'));
    else toast(uiText('ui.literal.094a4dcf'), 'info', uiText('ui.literal.c81ff41e'));
    return false;
  };

  window.addEventListener('appinstalled', () => toast(uiText('ui.literal.872ef2a6'), 'ok'));
}
