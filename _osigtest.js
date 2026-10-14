/* اختبار تكامل OneSignal على الموقع المنشور — ملف مؤقت */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
const errors = [];
window.addEventListener('error', (e) => errors.push('error: ' + e.message));
window.addEventListener('unhandledrejection', (e) => errors.push('rejection: ' + ((e.reason && e.reason.message) || e.reason)));
const A = (c, m) => { if (!c) throw new Error(m); };
async function step(n, f) { try { const x = await f(); out.push('PASS ' + n + (x ? ' :: ' + x : '')); } catch (e) { out.push('FAIL ' + n + ' :: ' + e.message); } }

(async () => {
  await sleep(2000);

  await step('معرّف OneSignal منشور في ملف الإعدادات', async () => {
    const res = await fetch('./assets/js/config.js', { cache: 'no-store' });
    const txt = await res.text();
    A(/LEA_ONESIGNAL_APP_ID\s*=\s*'[0-9a-f-]{36}'/.test(txt), 'لم أجد App ID صالحاً');
    A(window.LEA_ONESIGNAL_APP_ID && window.LEA_ONESIGNAL_APP_ID.length === 36, 'المعرّف غير محمّل في الصفحة');
    return window.LEA_ONESIGNAL_APP_ID.slice(0, 8) + '…';
  });

  await step('سكربت OneSignal جاهز في الصفحة', async () => {
    for (let i = 0; i < 40; i++) { if (window.OneSignal && typeof window.OneSignal.init === 'function') break; await sleep(500); }
    A(window.OneSignal, 'لم يُحمَّل كائن OneSignal');
    A(typeof window.OneSignal.init === 'function', 'دالة init غير متاحة');
    A(window.OneSignal.User && window.OneSignal.User.PushSubscription !== undefined, 'واجهة PushSubscription غير متاحة');
    return 'SDK v16';
  });

  await step('كودنا يمرّر المعرّف ويهيّئ OneSignal فعلياً', async () => {
    const notify = await import('./assets/js/core/notify.js');
    A(notify.appIdSource() === 'config', 'مصدر المعرّف: ' + notify.appIdSource());
    A(notify.appId() === window.LEA_ONESIGNAL_APP_ID, 'المعرّف المُمرَّر لا يطابق الملف');
    const res = await notify.initOneSignal();
    A(res.ok, 'فشل التهيئة: ' + (res.error || ''));
    return 'init ناجح · optedIn=' + res.optedIn + (res.id ? ' · id=' + String(res.id).slice(0, 8) + '…' : '');
  });

  await step('حالة الاشتراك والإذن', async () => {
    const notify = await import('./assets/js/core/notify.js');
    const st = await notify.pushStatus();
    A(st.configured, 'غير مهيأ');
    return `الإذن: ${st.permission} · مشترك: ${st.id ? 'نعم' : 'لا (ينتظر موافقتك على الإشعارات)'}`;
  });

  await step('عامل الخدمة الخاص بنا هو المسجَّل (لا عامل آخر)', async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    A(regs.length >= 1, 'لا يوجد Service Worker');
    A(regs[0].scope.includes('Learn-English'), 'النطاق: ' + regs[0].scope);
    const active = regs.find((r) => r.active);
    A(active, 'لا يوجد عامل نشط');
    return active.scope;
  });

  await step('طلب الإذن يعمل دون أخطاء', async () => {
    const notify = await import('./assets/js/core/notify.js');
    const before = notify.permissionState();
    let after = before;
    try {
      if (window.OneSignal?.Notifications?.requestPermission) {
        await window.OneSignal.Notifications.requestPermission();
        after = notify.permissionState();
      } else {
        after = await notify.ensurePermission();
      }
    } catch (e) {
      throw new Error('فشل طلب الإذن: ' + e.message);
    }
    if (after === 'denied' && before !== 'granted') {
      return 'المتصفح بلا واجهة (headless) رفض الإذن تلقائياً — السلوك متوقع';
    }
    return 'الإذن الآن: ' + after;
  });

  await step('لا أخطاء JavaScript (بما فيها أخطاء OneSignal)', async () => {
    A(errors.length === 0, errors.join(' | '));
  });

  const pre = document.createElement('pre');
  pre.textContent = 'OSIG-RESULTS\n' + out.join('\n') + '\nERRORS:' + errors.length + '\nOSIG-END';
  document.body.appendChild(pre);
})();
