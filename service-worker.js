/* ============================================================
   Service Worker — عمل بلا إنترنت + دعم OneSignal Push
   ============================================================ */

/* دمج عامل OneSignal (يلزم لإشعارات Push الحقيقية) */
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  console.warn('[SW] OneSignal SDK not loaded (offline install?)', e);
}

const VERSION = 'v1.0.0';
const CACHE = `lea-${VERSION}`;
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/main.css',
  './assets/img/favicon.svg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/icon-maskable-512.png',
  './assets/img/apple-touch-icon.png',
  './assets/js/app.js',
  './assets/js/core/utils.js',
  './assets/js/core/store.js',
  './assets/js/core/i18n.js',
  './assets/js/core/auth.js',
  './assets/js/core/router.js',
  './assets/js/core/speech.js',
  './assets/js/core/srs.js',
  './assets/js/core/gamify.js',
  './assets/js/core/notify.js',
  './assets/js/core/quizgen.js',
  './assets/js/data/reference.js',
  './assets/js/data/curriculum.js',
  './assets/js/data/curriculum-a1.js',
  './assets/js/data/curriculum-a2.js',
  './assets/js/data/curriculum-b1.js',
  './assets/js/data/readings.js',
  './assets/js/data/badges.js',
  './assets/js/views/shell.js',
  './assets/js/views/auth.js',
  './assets/js/views/quiz-runner.js',
  './assets/js/views/dashboard.js',
  './assets/js/views/lessons.js',
  './assets/js/views/reference.js',
  './assets/js/views/drills.js',
  './assets/js/views/flashcards.js',
  './assets/js/views/reading.js',
  './assets/js/views/exams.js',
  './assets/js/views/stats.js',
  './assets/js/views/notebook.js',
  './assets/js/views/settings.js',
  './assets/js/views/about.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(CORE.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('lea-') && k !== CACHE).map((k) => caches.delete(k)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.disable(); } catch {}
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => keys.filter((k) => k.startsWith('lea-')).forEach((k) => caches.delete(k)));
  }
});

const isSameOrigin = (url) => url.origin === self.location.origin;
const isCacheableAsset = (url) => /\.(?:css|js|mjs|json|webmanifest|png|jpg|jpeg|svg|webp|ico|woff2?|ttf)$/i.test(url.pathname);
const isCodeAsset = (url) => /\.(?:js|mjs|css|json|webmanifest)$/i.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch { return; }

  // لا نتدخّل في الطلبات الخارجية (OneSignal، خطوط جوجل…)
  if (!isSameOrigin(url)) return;
  if (url.pathname.endsWith('OneSignalSDKWorker.js')) return;

  // التنقل: الشبكة أولاً ثم النسخة المخزّنة
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        const cache = await caches.open(CACHE);
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // ملفات الكود: الشبكة أولاً حتى تظهر التحديثات فوراً، مع الرجوع للذاكرة عند انقطاع الإنترنت
  if (isCodeAsset(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200 && fresh.type === 'basic') cache.put(req, fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        const cached = await cache.match(req, { ignoreSearch: true });
        return cached || new Response('', { status: 504, statusText: 'Offline' });
      }
    })());
    return;
  }

  // بقية الأصول (صور/خطوط): من الذاكرة فوراً مع تحديث في الخلفية
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone()).catch(() => {});
      return res;
    }).catch(() => null);

    if (cached) return cached;
    const fresh = await network;
    if (fresh) return fresh;
    if (isCacheableAsset(url) || req.destination === 'document') {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
    return new Response('', { status: 504, statusText: 'Offline' });
  })());
});

/* النقر على الإشعار: افتح الموقع على الرابط المطلوب */
self.addEventListener('notificationclick', (event) => {
  const data = event.notification?.data || {};
  const target = new URL(data.url || './index.html#/', self.location.href).href;
  event.notification.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of all) {
      if (client.url.includes(self.location.origin)) {
        await client.focus();
        client.postMessage({ type: 'navigate', url: target });
        return;
      }
    }
    await self.clients.openWindow(target);
  })());
});
