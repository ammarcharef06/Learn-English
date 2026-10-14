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

  await step('كودنا يهيّئ OneSignal تلقائياً عند الإقلاع', async () => {
    const notify = await import('./assets/js/core/notify.js');
    A(notify.appIdSource() === 'config', 'مصدر المعرّف: ' + notify.appIdSource());
    A(notify.appId() === window.LEA_ONESIGNAL_APP_ID, 'المعرّف المُمرَّر لا يطابق الملف');
    let sync = null;
    for (let i = 0; i < 40; i++) {
      const s = JSON.parse(localStorage.getItem('lea.settings.v1') || '{}');
      sync = s?.push?.lastSync;
      if (sync) break;
      await sleep(500);
    }
    A(sync, 'التطبيق لم يسجّل تهيئة OneSignal تلقائياً');
    let inited = null;
    try { inited = window.OneSignal?.initialized === true; } catch { inited = 'unknown'; }
    return `تهيئة تلقائية ناجحة · initialized=${inited}`;
  });

  await step('حالة الاشتراك والإذن', async () => {
    const notify = await import('./assets/js/core/notify.js');
    const st = await notify.pushStatus();
    A(st.configured, 'غير مهيأ');
    return `الإذن: ${st.permission} · مشترك: ${st.id ? 'نعم' : 'لا (ينتظر موافقتك على الإشعارات)'}`;
  });

  await step('عامل الخدمة الخاص بنا هو المسجَّل (لا عامل آخر)', async () => {
    let regs = [];
    let active = null;
    for (let i = 0; i < 60; i++) {
      regs = await navigator.serviceWorker.getRegistrations();
      active = regs.map((r) => r.active).find(Boolean);
      if (active) break;
      await sleep(500);
    }
    A(regs.length >= 1, 'لا يوجد Service Worker مسجَّل');
    A(active, 'لا يوجد عامل نشط بعد');
    A(active.scope.includes('Learn-English'), 'النطاق: ' + active.scope);
    const controlled = !!navigator.serviceWorker.controller;
    return `${active.scope} · يتحكّم بالصفحة: ${controlled}`;
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
