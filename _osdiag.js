/* تشخيص الاشتراك في OneSignal — ملف مؤقت */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logs = [];
const errors = [];
['log', 'warn', 'error', 'info'].forEach((k) => {
  const orig = console[k].bind(console);
  console[k] = (...args) => {
    try { logs.push(k + ': ' + args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ').slice(0, 300)); } catch {}
    orig(...args);
  };
});
window.addEventListener('error', (e) => errors.push('error: ' + e.message));
window.addEventListener('unhandledrejection', (e) => errors.push('rejection: ' + ((e.reason && e.reason.message) || e.reason)));
const A = (c, m) => { if (!c) throw new Error(m); };
async function step(n, f) { try { const x = await f(); out.push('PASS ' + n + (x ? ' :: ' + x : '')); } catch (e) { out.push('FAIL ' + n + ' :: ' + e.message); } }
const out = [];

(async () => {
  await sleep(2500);
  const notify = await import('./assets/js/core/notify.js');

  await step('إذن المتصفح ممنوح لهذا الموقع', async () => {
    A(typeof Notification !== 'undefined', 'لا يوجد Notification');
    A(Notification.permission === 'granted', 'الإذن: ' + Notification.permission);
    return Notification.permission;
  });

  await step('Service Worker نشط قبل التهيئة', async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    A(regs.length >= 1, 'لا يوجد عامل مسجّل');
    const active = regs.map((r) => r.active).find(Boolean);
    A(active, 'لا يوجد عامل نشط');
    return active.scope;
  });

  await step('OneSignal مهيّأ تلقائياً', async () => {
    let ok = false;
    for (let i = 0; i < 40; i++) {
      if (window.OneSignal && window.OneSignal.initialized === true) { ok = true; break; }
      await sleep(500);
    }
    A(ok, 'لم تكتمل التهيئة');
    return 'initialized=true';
  });

  await step('الاشتراك يكتمل ويُعطي معرّفاً حقيقياً', async () => {
    let id = '';
    for (let i = 0; i < 50; i++) {
      id = window.OneSignal?.User?.PushSubscription?.id || '';
      if (id) break;
      await sleep(500);
    }
    if (!id) {
      const r = await notify.enablePush();
      for (let i = 0; i < 40; i++) {
        id = window.OneSignal?.User?.PushSubscription?.id || '';
        if (id) break;
        await sleep(500);
      }
      if (!id) throw new Error('لا معرّف اشتراك — نتيجة enablePush: ' + JSON.stringify(r));
    }
    A(/^[0-9a-f-]{20,}$/i.test(id), 'المعرّف غير صالح: ' + id);
    return 'ID=' + id;
  });

  await step('حالة التشخيص الكاملة', async () => {
    const d = await notify.diagnostics();
    A(d.oneSignal.id, 'لا معرّف في التشخيص');
    A(d.oneSignal.optedIn === true, 'optedIn=false');
    A(d.controller === true, 'الصفحة غير محكومة بعامل الخدمة');
    return JSON.stringify({ perm: d.browserPermission, sw: d.serviceWorkers, os: d.oneSignal });
  });

  await step('لا أخطاء JavaScript', async () => {
    A(errors.length === 0, errors.join(' | '));
  });

  const pre = document.createElement('pre');
  pre.textContent = 'OSDIAG-RESULTS\n' + out.join('\n') + '\n--- LOGS ---\n' + logs.slice(-25).join('\n') + '\nERRORS:' + errors.length + '\nOSDIAG-END';
  document.body.appendChild(pre);
})();
