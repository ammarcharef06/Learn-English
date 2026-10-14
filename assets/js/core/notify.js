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
  if (fromSettings) return 'settings';
  if ((window.LEA_ONESIGNAL_APP_ID || '').trim()) return 'config';
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

function oneSignalReady() {
  try { return !!(window.OneSignal && (window.OneSignal.initialized === true || window.OneSignal.User)); }
  catch { return false; }
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
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    setTimeout(() => done({ ok: false, error: 'timeout' }), 12000);
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        const options = {
          appId: id,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: basePath() },
          serviceWorkerPath: basePath() + 'service-worker.js',
          notifyButton: { enable: false },
          welcomeNotification: { disable: true },
        };
        const safariId = (window.LEA_ONESIGNAL_SAFARI_WEB_ID || '').trim();
        if (safariId) options.safari_web_id = safariId;
        await OneSignal.init(options);
        const sub = OneSignal.User?.PushSubscription;
        const opted = !!(sub && sub.optedIn);
        saveSettings({ push: { lastSync: new Date().toISOString(), subscriptionId: sub?.id || '', optedIn: opted } });
        done({ ok: true, optedIn: opted, id: sub?.id || '' });
      } catch (e) {
        done({ ok: false, error: String(e && e.message ? e.message : e) });
      }
    });
  });
}

export async function enablePush() {
  const id = appId();
  if (!id) return { ok: false, error: 'أضف OneSignal App ID أولاً.' };
  if (!oneSignalReady()) {
    const initRes = await initOneSignal();
    if (!initRes.ok) return { ok: false, error: `تعذّر تهيئة OneSignal (${initRes.error}).` };
  }
  try {
    const OneSignal = window.OneSignal;
    await OneSignal.Notifications.requestPermission();
    if (!OneSignal.Notifications.permission) return { ok: false, error: 'لم يُمنح إذن الإشعارات.' };
    await OneSignal.User.PushSubscription.optIn();
    const sub = OneSignal.User?.PushSubscription;
    saveSettings({ push: { enabled: true, lastSync: new Date().toISOString(), subscriptionId: sub?.id || '', optedIn: !!(sub && sub.optedIn) } });
    return { ok: true, id: sub?.id || '' };
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
