/* Local reminders shared by the web, Android, and desktop app. */
import { settings, saveSettings, progress } from './store.js';
import { todayKey, prettyTimeAr, dateKey } from './utils.js';
import { vocabularyEntries } from './quizgen.js';

const REMINDER_IDS = [301, 302, 303, 304, 305, 306, 307];
const CHANNEL_ID = 'lea-daily-reminders';
const reminderDays = () => Array.isArray(settings?.reminder?.days) && settings.reminder.days.length
  ? settings.reminder.days
  : [0, 1, 2, 3, 4, 5, 6];

function nativeNotifications() {
  if (!window.Capacitor?.isNativePlatform?.()) return null;
  return window.Capacitor?.Plugins?.LocalNotifications
    || window.CapacitorLocalNotificationsBundle?.LocalNotifications
    || null;
}

function desktopNotifications() {
  return window.leaNotifications || null;
}

export function notificationPlatform() {
  if (nativeNotifications()) return 'android';
  if (desktopNotifications()) return 'desktop';
  return typeof Notification === 'undefined' ? 'unsupported' : 'browser';
}

export function permissionState() {
  const platform = notificationPlatform();
  if (platform === 'android') return 'native';
  if (platform === 'desktop') return 'available';
  if (platform === 'unsupported') return 'unsupported';
  return Notification.permission;
}

export async function ensurePermission() {
  const native = nativeNotifications();
  if (native) {
    let status = await native.checkPermissions();
    if (status.display !== 'granted') status = await native.requestPermissions();
    return status.display;
  }
  const desktop = desktopNotifications();
  if (desktop) return (await desktop.requestPermission()).permission;
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try { return await Notification.requestPermission(); }
  catch (error) { console.warn('Notification permission request failed', error); return 'denied'; }
}

async function showWebNotification(title, body, opts = {}) {
  const options = {
    body,
    icon: './assets/img/icon-192.png',
    badge: './assets/img/icon-192.png',
    dir: settings.uiLang === 'en' ? 'ltr' : 'rtl',
    lang: settings.uiLang === 'en' ? 'en' : 'ar',
    tag: opts.tag || 'lea-reminder',
    renotify: true,
    data: { url: opts.url || './index.html#/', ...(opts.data || {}) },
    ...opts,
  };
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration?.showNotification) {
      await registration.showNotification(title, options);
      return true;
    }
  } catch (error) {
    console.warn('Service worker notification failed', error);
  }
  try {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, options);
      return true;
    }
  } catch (error) {
    console.warn('Browser notification failed', error);
  }
  return false;
}

export async function showNotification(title, body, opts = {}) {
  const native = nativeNotifications();
  if (native) {
    await native.createChannel({
      id: CHANNEL_ID,
      name: settings.uiLang === 'en' ? 'Study reminders' : 'تذكيرات الدراسة',
      description: settings.uiLang === 'en' ? 'Daily English study reminders' : 'تذكيرات يومية لتعلّم الإنجليزية',
      importance: 4,
      vibration: true,
      sound: 'notification',
    });
    await native.schedule({
      notifications: [{
        id: 399,
        title,
        body,
        channelId: CHANNEL_ID,
        schedule: { at: new Date(Date.now() + 1000) },
        extra: { url: opts.url || './index.html#/' },
      }],
    });
    return true;
  }
  const desktop = desktopNotifications();
  if (desktop) return desktop.show({ title, body });
  return showWebNotification(title, body, opts);
}

export function reminderFiredToday() {
  return settings?.reminder?.lastFired === todayKey();
}

export function shouldFireNow(now = new Date()) {
  const reminder = settings?.reminder;
  if (!reminder?.enabled || reminderFiredToday()) return false;
  const days = reminderDays();
  if (!days.includes(now.getDay())) return false;
  const [hour, minute] = String(reminder.time || '19:00').split(':').map(Number);
  return now.getHours() * 60 + now.getMinutes() >= hour * 60 + minute;
}

export function wordOfTheDay() {
  const all = vocabularyEntries();
  if (!all.length) return null;
  const seed = Number(todayKey().replace(/-/g, '')) || 0;
  return all[seed % all.length];
}

export function reminderBody() {
  const activity = progress?.activity?.[todayKey()] || { q: 0 };
  const goal = settings?.dailyGoal || 20;
  const remaining = Math.max(0, goal - (activity.q || 0));
  const streak = progress?.streak || 0;
  const base = settings?.reminder?.body || 'جلسة قصيرة اليوم تحافظ على سلسلتك!';
  const word = wordOfTheDay();
  const wordLine = word ? `\n📘 كلمة اليوم: ${word.en} = ${word.ar}` : '';
  return `${base}\nباقي ${remaining} سؤالاً لهدف اليوم${streak ? ` · سلسلتك ${streak} يوم 🔥` : ''}${wordLine}`;
}

export async function fireReminder({ test = false } = {}) {
  const title = settings?.reminder?.title || 'حان وقت الإنجليزية 🇬🇧';
  const body = test ? 'هذا إشعار تجريبي من أكاديمية الإنجليزية ✅' : reminderBody();
  const platform = notificationPlatform();
  if (platform === 'unsupported') {
    if (!test) {
      document.dispatchEvent(new CustomEvent('lea:reminder-inapp', { detail: { title, body } }));
      saveSettings({ reminder: { lastFired: todayKey() } });
      return { ok: true, mode: 'in-app' };
    }
    return { ok: false, error: 'هذا الجهاز لا يدعم إشعارات النظام.' };
  }
  try {
    if (platform === 'browser' && Notification.permission !== 'granted') {
      if (!test) {
        document.dispatchEvent(new CustomEvent('lea:reminder-inapp', { detail: { title, body } }));
        saveSettings({ reminder: { lastFired: todayKey() } });
        return { ok: true, mode: 'in-app' };
      }
      const permission = await ensurePermission();
      if (permission !== 'granted') return { ok: false, error: 'لم يتم منح إذن الإشعارات.' };
    }
    const sent = await showNotification(title, body, { tag: test ? 'lea-test' : 'lea-daily' });
    if (!sent) return { ok: false, error: 'تعذّر عرض الإشعار.' };
    if (!test && !reminderFiredToday()) saveSettings({ reminder: { lastFired: todayKey() } });
    return { ok: true, mode: platform };
  } catch (error) {
    console.warn('Could not show reminder', error);
    return { ok: false, error: error.message || 'تعذّر عرض الإشعار.' };
  }
}

export async function syncReminderSchedule({ requestPermission = false } = {}) {
  const reminder = settings?.reminder || {};
  const native = nativeNotifications();
  const desktop = desktopNotifications();
  if (!reminder.enabled) {
    if (native) await native.cancel({ notifications: REMINDER_IDS.map((id) => ({ id })) });
    if (desktop) await desktop.cancel();
    return { ok: true, mode: notificationPlatform(), disabled: true };
  }

  if (native) {
    let permission = await native.checkPermissions();
    if (permission.display !== 'granted' && requestPermission) {
      permission = await native.requestPermissions();
    }
    if (permission.display !== 'granted') {
      return { ok: false, mode: 'android', error: 'notification-permission-required' };
    }
    await native.createChannel({
      id: CHANNEL_ID,
      name: settings.uiLang === 'en' ? 'Study reminders' : 'تذكيرات الدراسة',
      description: settings.uiLang === 'en' ? 'Daily English study reminders' : 'تذكيرات يومية لتعلّم الإنجليزية',
      importance: 4,
      vibration: true,
      sound: 'notification',
    });
    await native.cancel({ notifications: REMINDER_IDS.map((id) => ({ id })) });
    const [hour, minute] = String(reminder.time || '19:00').split(':').map(Number);
    const days = reminderDays();
    if (days.length) {
      await native.schedule({
        notifications: days.map((day) => ({
          id: REMINDER_IDS[day],
          title: reminder.title || 'حان وقت الإنجليزية 🇬🇧',
          body: reminder.body || 'جلسة قصيرة اليوم تحافظ على سلسلتك!',
          channelId: CHANNEL_ID,
          schedule: { on: { weekday: day + 1, hour, minute }, allowWhileIdle: true },
          extra: { url: './index.html#/' },
        })),
      });
    }
    return { ok: true, mode: 'android' };
  }

  if (desktop) return desktop.schedule({
    enabled: true,
    time: reminder.time || '19:00',
    days: reminderDays(),
    title: reminder.title || 'حان وقت الإنجليزية 🇬🇧',
    body: reminderBody(),
    launchAtLogin: reminder.launchAtLogin === true,
  });

  return { ok: true, mode: notificationPlatform() };
}

let timer = null;
export function startReminderLoop() {
  if (timer) clearInterval(timer);
  const tick = async () => {
    if (['browser', 'unsupported'].includes(notificationPlatform()) && shouldFireNow()) {
      await fireReminder();
    }
  };
  tick();
  timer = setInterval(tick, 45000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  window.addEventListener('focus', tick);
  return () => { clearInterval(timer); timer = null; };
}

export function nextReminderText() {
  const reminder = settings?.reminder || {};
  const today = new Date();
  const [hour, minute] = String(reminder.time || '19:00').split(':').map(Number);
  const days = reminderDays();
  for (let offset = 0; offset <= 7; offset++) {
    const target = new Date(today);
    target.setDate(today.getDate() + offset);
    target.setHours(hour, minute, 0, 0);
    if (target <= today || !days.includes(target.getDay())) continue;
    if (settings.uiLang === 'en') {
      const label = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow'
        : target.toLocaleDateString('en', { weekday: 'long' });
      return `${label} ${reminder.time}`;
    }
    const label = offset === 0 ? 'اليوم' : offset === 1 ? 'غداً'
      : target.toLocaleDateString('ar', { weekday: 'long' });
    return `${label} ${prettyTimeAr(reminder.time)}`;
  }
  return settings.uiLang === 'en' ? 'No day selected' : 'لا يوجد يوم محدد';
}

export function todayKeyString() { return dateKey(new Date()); }
