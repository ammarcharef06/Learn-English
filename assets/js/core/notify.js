/* الإشعارات: تذكيرات محلية + OneSignal Push */
import { settings, saveSettings, progress } from './store.js';
import { todayKey, prettyTimeAr, dateKey } from './utils.js';
import { vocabularyEntries } from './quizgen.js';

/* ---------- الحالة والإذن ---------- */
export function permissionState() {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export async function ensurePermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try { return await Notification.requestPermission(); } catch { return 'denied'; }
}

/* ---------- العرض ---------- */
export async function showNotification(title, body, opts = {}) {
  const options = {
    body,
    icon: './assets/img/icon-192.png',
    badge: './assets/img/icon-192.png',
    dir: 'rtl',
    lang: 'ar',
    tag: opts.tag || 'lea-reminder',
    renotify: true,
    data: { url: opts.url || './index.html#/', ...(opts.data || {}) },
    ...opts,
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg && reg.showNotification) { await reg.showNotification(title, options); return true; }
  } catch (e) { console.warn('SW notification failed', e); }
  try {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: options.icon, dir: 'rtl', lang: 'ar' });
      return true;
    }
  } catch (e) { console.warn('Notification failed', e); }
  return false;
}

/* ---------- التذكير اليومي ---------- */
export function reminderFiredToday() {
  return settings?.reminder?.lastFired === todayKey();
}

export function shouldFireNow(now = new Date()) {
  const r = settings?.reminder;
  if (!r || !r.enabled) return false;
  if (reminderFiredToday()) return false;
  const days = Array.isArray(r.days) && r.days.length ? r.days : [0, 1, 2, 3, 4, 5, 6];
  if (!days.includes(now.getDay())) return false;
  const [h, m] = String(r.time || '19:00').split(':').map(Number);
  const target = h * 60 + m;
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= target;
}

/* كلمة اليوم: ثابتة خلال اليوم وتتغير كل يوم */
export function wordOfTheDay() {
  const all = vocabularyEntries();
  if (!all.length) return null;
  const seed = Number(todayKey().replace(/-/g, '')) || 0;
  return all[seed % all.length];
}

export function reminderBody() {
  const a = progress?.activity?.[todayKey()] || { q: 0 };
  const goal = settings?.dailyGoal || 20;
  const remain = Math.max(0, goal - (a.q || 0));
  const streak = progress?.streak || 0;
  const base = settings?.reminder?.body || 'جلسة قصيرة اليوم تحافظ على سلسلتك!';
  const word = wordOfTheDay();
  const wordLine = word ? `\n📘 كلمة اليوم: ${word.en} = ${word.ar}` : '';
  return `${base}\nباقي ${remain} سؤالاً لهدف اليوم${streak ? ` · سلسلتك ${streak} يوم 🔥` : ''}${wordLine}`;
}

export async function fireReminder({ test = false } = {}) {
  const title = settings?.reminder?.title || 'حان وقت الإنجليزية 🇬🇧';
  const body = test ? 'هذا إشعار تجريبي من أكاديمية الإنجليزية ✅' : reminderBody();
  const perm = permissionState();
  if (perm !== 'granted') {
    if (!test) {
      document.dispatchEvent(new CustomEvent('lea:reminder-inapp', { detail: { title, body } }));
      saveSettings({ reminder: { lastFired: todayKey() } });
      return { ok: true, mode: 'in-app' };
    }
    const asked = await ensurePermission();
    if (asked !== 'granted') return { ok: false, error: 'لم يتم منح إذن الإشعارات.' };
  }
  const ok = await showNotification(title, body, { tag: test ? 'lea-test' : 'lea-daily' });
  if (!test && !reminderFiredToday()) saveSettings({ reminder: { lastFired: todayKey() } });
  return ok ? { ok: true, mode: 'notification' } : { ok: false, error: 'فشل عرض الإشعار.' };
}

let timer = null;
export function startReminderLoop() {
  if (timer) clearInterval(timer);
  const tick = async () => {
    if (shouldFireNow()) await fireReminder();
  };
  tick();
  timer = setInterval(tick, 45000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  window.addEventListener('focus', tick);
  return () => clearInterval(timer);
}

export function nextReminderText() {
  const r = settings?.reminder || {};
  const today = new Date();
  const [h, m] = String(r.time || '19:00').split(':').map(Number);
  const target = new Date(today); target.setHours(h, m, 0, 0);
  const isToday = target > today && (r.days || []).includes(today.getDay());
  const when = isToday ? 'اليوم' : 'غداً';
  return `${when} ${prettyTimeAr(r.time)}`;
}

/* ---------- OneSignal Push ---------- */
export function appIdSource() {
  const fromSettings = (settings?.push?.appId || '').trim();
  const fromConfig = (window.LEA_ONESIGNAL_APP_ID || '').trim();
  if (fromSettings && fromConfig && fromSettings === fromConfig) return 'config';
  if (fromSettings) return 'settings';
  if (fromConfig) return 'config';
  return 'none';
}

export function oneSignalConfigured() {
  return appIdSource() !== 'none';
}

export function appId() {
  const fromSettings = (settings?.push?.appId || '').trim();
  if (fromSettings) return fromSettings;
  return (window.LEA_ONESIGNAL_APP_ID || '').trim();
}

function basePath() {
  return new URL('./', location.href).pathname;
}

const OS_FLAG = '__leaOneSignalInitialized';

/* ملاحظة مهمة: في SDK v16 لا يوجد خاصية initialized، وكائن OneSignal.User
   موجود قبل التهيئة أيضاً — لذلك نتتبّع التهيئة بأنفسنا. */
function oneSignalReady() {
  try {
    if (window[OS_FLAG] === true) return true;
    return !!window.OneSignal?.User?.PushSubscription?.id;
  } catch { return false; }
}

function markOneSignalReady() { try { window[OS_FLAG] = true; } catch {} }

/* ننتظر تنشيط Service Worker قبل تهيئة OneSignal (شرط لاكتمال الاشتراك) */
async function waitForServiceWorker(timeout = 10000) {
  try {
    if (!('serviceWorker' in navigator)) return null;
    const ready = window.__leaSwReady || navigator.serviceWorker.register(new URL('./service-worker.js', location.href), { scope: new URL('./', location.href).pathname });
    const reg = await Promise.race([Promise.resolve(ready).then(() => navigator.serviceWorker.ready), wait(timeout).then(() => null)]);
    return reg || null;
  } catch { return null; }
}

export async function initOneSignal() {
  const id = appId();
  // تهيئة واحدة فقط: إن كان SDK مهيّأً مسبقاً نعيد حالته بدل إحداث خطأ
  if (oneSignalReady()) {
    try {
      const sub = window.OneSignal.User?.PushSubscription;
      saveSettings({ push: { lastSync: new Date().toISOString(), subscriptionId: sub?.id || '', optedIn: !!(sub && sub.optedIn) } });
      return { ok: true, alreadyInitialized: true, optedIn: !!(sub && sub.optedIn), id: sub?.id || '' };
    } catch (e) {
      return { ok: true, alreadyInitialized: true, optedIn: false, id: '' };
    }
  }
  if (!id) return { ok: false, error: 'no-app-id' };
  if (!('serviceWorker' in navigator)) return { ok: false, error: 'no-sw' };

  // ① نضمن وجود عامل خدمة نشط قبل التهيئة
  await waitForServiceWorker();

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    setTimeout(() => done({ ok: false, error: 'timeout' }), 15000);
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        const options = {
          appId: id,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: basePath() },
          serviceWorkerPath: basePath() + 'service-worker.js',
          notifyButton: { enable: false },          // لا زر جرس
          welcomeNotification: { disable: true },   // لا إشعار ترحيبي تلقائي
          autoResubscribe: true,                    // يعيد الاشتراك تلقائياً إن كان الإذن ممنوحاً
        };
        const safariId = (window.LEA_ONESIGNAL_SAFARI_WEB_ID || '').trim();
        if (safariId) options.safari_web_id = safariId;
        try {
          await OneSignal.init(options);
          markOneSignalReady();
        } catch (initErr) {
          const msg = String(initErr && initErr.message ? initErr.message : initErr);
          // إن كانت التهيئة قد حدثت فعلاً (بدء متزامن) نكمل بدل الفشل
          if (/already init|already been init/i.test(msg)) markOneSignalReady();
          else throw initErr;
        }

        // إغلاق أي نوافذ/تنبيهات إضافية يظهرها OneSignal من لوحة التحكم
        try { OneSignal.Slidedown?.setIsEnabled?.(false); } catch {}
        try { OneSignal.Notifications?.setDefaultTitle?.('أكاديمية الإنجليزية'); } catch {}

        // ② إن كان الإذن ممنوحاً والاشتراك ناقصاً نُكمله تلقائياً
        let sub = OneSignal.User?.PushSubscription;
        if (!sub?.optedIn && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try { await sub?.optIn?.()?.catch?.(() => {}); } catch {}
          for (let i = 0; i < 15; i++) {
            sub = OneSignal.User?.PushSubscription;
            if (sub?.id) break;
            await wait(400);
          }
        }
        const opted = !!(sub && sub.optedIn);
        saveSettings({ push: { lastSync: new Date().toISOString(), subscriptionId: sub?.id || '', optedIn: opted, lastError: '' } });
        done({ ok: true, optedIn: opted, id: sub?.id || '' });
      } catch (e) {
        const msg = String(e && e.message ? e.message : e);
        saveSettings({ push: { lastError: msg, lastSync: new Date().toISOString() } });
        done({ ok: false, error: msg });
      }
    });
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
/* أي وعد طويل (مثل optIn) لا يجب أن يعلّق التطبيق أبداً */
const withTimeout = (p, ms = 8000) => Promise.race([
  Promise.resolve(p).then(() => true).catch(() => false),
  wait(ms).then(() => false),
]);

export async function enablePush() {
  const id = appId();
  if (!id) return { ok: false, error: 'أضف OneSignal App ID أولاً.' };
  if (typeof Notification === 'undefined') return { ok: false, error: 'متصفحك لا يدعم الإشعارات.' };

  // 1) إذن المتصفح أولاً وبشكل مباشر داخل نقرة المستخدم (أضمن طريقة)
  const perm = await ensurePermission();
  if (perm !== 'granted') {
    return {
      ok: false,
      error: perm === 'denied'
        ? 'الإشعارات محظورة لهذا الموقع. افتح رمز القفل 🔒 في شريط العنوان ← الإشعارات ← «سماح»، ثم أعد المحاولة.'
        : 'لم يتم منح الإذن. اضغط الزر ثم اختر «السماح» في نافذة المتصفح.',
    };
  }

  // 2) تهيئة OneSignal إن لم تكن جاهزة
  if (!oneSignalReady()) {
    const initRes = await initOneSignal();
    if (!initRes.ok) return { ok: false, error: `تعذّر تهيئة OneSignal (${initRes.error}).` };
  }

  // 3) الاشتراك ثم انتظار معرّف الاشتراك
  try {
    const OneSignal = window.OneSignal;
    if (!OneSignal?.User?.PushSubscription) return { ok: false, error: 'لم يجهز OneSignal بعد — أعد المحاولة بعد لحظات.' };
    if (!OneSignal.User.PushSubscription.optedIn) {
      await withTimeout(OneSignal.User.PushSubscription.optIn(), 10000);
    }
    let subId = '';
    for (let i = 0; i < 20; i++) {
      subId = OneSignal.User?.PushSubscription?.id || '';
      if (subId) break;
      await wait(500);
    }
    saveSettings({
      push: {
        enabled: !!subId, lastSync: new Date().toISOString(),
        subscriptionId: subId, optedIn: !!OneSignal.User?.PushSubscription?.optedIn,
        lastError: subId ? '' : 'لم يصل معرّف الاشتراك من OneSignal',
      },
    });
    if (!subId) {
      return { ok: false, error: 'تم منح الإذن لكن OneSignal لم يُعطِ معرّف اشتراك. تأكد من الإنترنت ثم أعد المحاولة، أو أرسل لي نتيجة «🔍 تشخيص الإشعارات».' };
    }
    return { ok: true, id: subId };
  } catch (e) {
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

/* إعادة الاشتراك تلقائياً إذا كان الإذن ممنوحاً لكن الاشتراك مفقود */
export async function autoResubscribe() {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return { ok: false, error: 'no-permission' };
    if (!oneSignalReady()) {
      const r = await initOneSignal();
      if (!r.ok) return r;
    }
    const OneSignal = window.OneSignal;
    const sub = OneSignal?.User?.PushSubscription;
    if (!sub) return { ok: false, error: 'no-sdk' };
    if (sub.optedIn && sub.id) return { ok: true, id: sub.id, already: true };
    await withTimeout(sub.optIn?.(), 10000);
    let subId = '';
    for (let i = 0; i < 20; i++) {
      subId = OneSignal.User?.PushSubscription?.id || '';
      if (subId) break;
      await wait(400);
    }
    saveSettings({ push: { enabled: !!subId, subscribedAt: new Date().toISOString(), subscriptionId: subId, optedIn: !!subId } });
    return { ok: !!subId, id: subId };
  } catch (e) {
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

export async function disablePush() {
  try {
    if (window.OneSignal?.User?.PushSubscription) await window.OneSignal.User.PushSubscription.optOut();
  } catch {}
  saveSettings({ push: { enabled: false, lastSync: new Date().toISOString() } });
  return { ok: true };
}

export function subscriptionId() {
  try { return window.OneSignal?.User?.PushSubscription?.id || settings?.push?.subscriptionId || ''; }
  catch { return settings?.push?.subscriptionId || ''; }
}

/* تشخيص شامل لحالة الإشعارات — يُستخدم في زر «تشخيص» داخل الإعدادات */
export async function diagnostics() {
  let sws = [];
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    sws = regs.map((r) => ({
      scope: r.scope,
      active: !!r.active,
      state: (r.active || r.installing || r.waiting)?.state || 'none',
    }));
  } catch (e) { sws = [{ error: String(e) }]; }
  let os = {};
  try {
    os = {
      loaded: !!window.OneSignal,
      initialized: window.OneSignal?.initialized === true,
      sdkPermission: window.OneSignal?.Notifications?.permission ?? null,
      optedIn: !!window.OneSignal?.User?.PushSubscription?.optedIn,
      id: window.OneSignal?.User?.PushSubscription?.id || '',
      hasToken: !!window.OneSignal?.User?.PushSubscription?.token,
    };
  } catch (e) { os = { error: String(e) }; }
  return {
    origin: location.origin,
    path: basePath(),
    protocol: location.protocol,
    appId: appId(),
    source: appIdSource(),
    browserPermission: permissionState(),
    controller: !!navigator.serviceWorker?.controller,
    serviceWorkers: sws,
    oneSignal: os,
    lastError: settings?.push?.lastError || '',
    lastSync: settings?.push?.lastSync || '',
    savedSubscriptionId: settings?.push?.subscriptionId || '',
    userAgent: navigator.userAgent,
  };
}

export async function pushStatus() {
  const state = {
    configured: oneSignalConfigured(),
    source: appIdSource(),
    appId: appId(),
    enabled: !!settings?.push?.enabled,
    id: subscriptionId(),
    permission: permissionState(),
    optedIn: (() => { try { return !!window.OneSignal?.User?.PushSubscription?.optedIn; } catch { return false; } })(),
  };
  return state;
}

/* وقت التذكير القادم بصيغة مختصرة */
export function todayKeyString() { return dateKey(new Date()); }
