/* ============================================================
   Service Worker — عمل بلا إنترنت + دعم OneSignal Push
   ============================================================ */

/* دمج عامل OneSignal (يلزم لإشعارات Push الحقيقية) */
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  console.warn('[SW] OneSignal SDK not loaded (offline install?)', e);
}

const VERSION = 'v2.0.0';
const CACHE = `lea-${VERSION}`;
const CORE = [
  './',
  './index.html',
  './zero.html',
  './manifest.webmanifest',
  './manifest-zero.webmanifest',
  './assets/css/main.css',
  './assets/css/zero.css',
  './assets/css/zero-pad.css',
  './assets/css/skins/gnome.css',
  './assets/css/skins/kali.css',
  './assets/img/favicon.svg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/icon-maskable-512.png',
  './assets/img/apple-touch-icon.png',
  './assets/js/app.js',
  './assets/js/zero-main.js',
  './assets/audio/zero/g/name-a.mp3',
  './assets/audio/zero/g/word-a.mp3',
  './assets/audio/zero/s/letter-a.wav',
  './assets/audio/zero/g/name-b.mp3',
  './assets/audio/zero/g/word-b.mp3',
  './assets/audio/zero/s/letter-b.wav',
  './assets/audio/zero/g/name-c.mp3',
  './assets/audio/zero/g/word-c.mp3',
  './assets/audio/zero/s/letter-c.wav',
  './assets/audio/zero/g/name-d.mp3',
  './assets/audio/zero/g/word-d.mp3',
  './assets/audio/zero/s/letter-d.wav',
  './assets/audio/zero/g/name-e.mp3',
  './assets/audio/zero/g/word-e.mp3',
  './assets/audio/zero/s/letter-e.wav',
  './assets/audio/zero/g/name-f.mp3',
  './assets/audio/zero/g/word-f.mp3',
  './assets/audio/zero/s/letter-f.wav',
  './assets/audio/zero/g/name-g.mp3',
  './assets/audio/zero/g/word-g.mp3',
  './assets/audio/zero/s/letter-g.wav',
  './assets/audio/zero/g/name-h.mp3',
  './assets/audio/zero/g/word-h.mp3',
  './assets/audio/zero/s/letter-h.wav',
  './assets/audio/zero/g/name-i.mp3',
  './assets/audio/zero/g/word-i.mp3',
  './assets/audio/zero/s/letter-i.wav',
  './assets/audio/zero/g/name-j.mp3',
  './assets/audio/zero/g/word-j.mp3',
  './assets/audio/zero/s/letter-j.wav',
  './assets/audio/zero/g/name-k.mp3',
  './assets/audio/zero/g/word-k.mp3',
  './assets/audio/zero/s/letter-k.wav',
  './assets/audio/zero/g/name-l.mp3',
  './assets/audio/zero/g/word-l.mp3',
  './assets/audio/zero/s/letter-l.wav',
  './assets/audio/zero/g/name-m.mp3',
  './assets/audio/zero/g/word-m.mp3',
  './assets/audio/zero/s/letter-m.wav',
  './assets/audio/zero/g/name-n.mp3',
  './assets/audio/zero/g/word-n.mp3',
  './assets/audio/zero/s/letter-n.wav',
  './assets/audio/zero/g/name-o.mp3',
  './assets/audio/zero/g/word-o.mp3',
  './assets/audio/zero/s/letter-o.wav',
  './assets/audio/zero/g/name-p.mp3',
  './assets/audio/zero/g/word-p.mp3',
  './assets/audio/zero/s/letter-p.wav',
  './assets/audio/zero/g/name-q.mp3',
  './assets/audio/zero/g/word-q.mp3',
  './assets/audio/zero/s/letter-q.wav',
  './assets/audio/zero/g/name-r.mp3',
  './assets/audio/zero/g/word-r.mp3',
  './assets/audio/zero/s/letter-r.wav',
  './assets/audio/zero/g/name-s.mp3',
  './assets/audio/zero/g/word-s.mp3',
  './assets/audio/zero/s/letter-s.wav',
  './assets/audio/zero/g/name-t.mp3',
  './assets/audio/zero/g/word-t.mp3',
  './assets/audio/zero/s/letter-t.wav',
  './assets/audio/zero/g/name-u.mp3',
  './assets/audio/zero/g/word-u.mp3',
  './assets/audio/zero/s/letter-u.wav',
  './assets/audio/zero/g/name-v.mp3',
  './assets/audio/zero/g/word-v.mp3',
  './assets/audio/zero/s/letter-v.wav',
  './assets/audio/zero/g/name-w.mp3',
  './assets/audio/zero/g/word-w.mp3',
  './assets/audio/zero/s/letter-w.wav',
  './assets/audio/zero/g/name-x.mp3',
  './assets/audio/zero/g/word-x.mp3',
  './assets/audio/zero/s/letter-x.wav',
  './assets/audio/zero/g/name-y.mp3',
  './assets/audio/zero/g/word-y.mp3',
  './assets/audio/zero/s/letter-y.wav',
  './assets/audio/zero/g/name-z.mp3',
  './assets/audio/zero/g/word-z.mp3',
  './assets/audio/zero/s/letter-z.wav',
  './assets/audio/zero/g/word-sh.mp3',
  './assets/audio/zero/s/dig-sh.wav',
  './assets/audio/zero/g/word-ch.mp3',
  './assets/audio/zero/s/dig-ch.wav',
  './assets/audio/zero/g/word-th-voiceless.mp3',
  './assets/audio/zero/s/dig-th-voiceless.wav',
  './assets/audio/zero/g/word-th-voiced.mp3',
  './assets/audio/zero/s/dig-th-voiced.wav',
  './assets/audio/zero/g/word-ph.mp3',
  './assets/audio/zero/s/dig-ph.wav',
  './assets/audio/zero/g/word-ck.mp3',
  './assets/audio/zero/s/dig-ck.wav',
  './assets/audio/zero/g/word-ng.mp3',
  './assets/audio/zero/s/dig-ng.wav',
  './assets/audio/zero/g/word-oo-long.mp3',
  './assets/audio/zero/s/dig-oo-long.wav',
  './assets/audio/zero/g/word-oo-short.mp3',
  './assets/audio/zero/s/dig-oo-short.wav',
  './assets/audio/zero/g/word-ee.mp3',
  './assets/audio/zero/s/dig-ee.wav',
  './assets/audio/zero/g/word-ea.mp3',
  './assets/audio/zero/s/dig-ea.wav',
  './assets/audio/zero/g/word-ou.mp3',
  './assets/audio/zero/s/dig-ou.wav',
  './assets/js/config.js',
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
  './assets/js/core/zeroflow.js',
  './assets/js/core/zero-pad.js',
  './assets/js/core/zero-audio.js',
  './assets/js/core/theme.js',
  './assets/js/data/reference.js',
  './assets/js/data/curriculum.js',
  './assets/js/data/curriculum-a1.js',
  './assets/js/data/curriculum-a2.js',
  './assets/js/data/curriculum-b1.js',
  './assets/js/data/readings.js',
  './assets/js/data/badges.js',
  './assets/js/data/zero.js',
  './assets/js/data/zero-letters.js',
  './assets/js/data/zero-time.js',
  './assets/js/data/zero-words.js',
  './assets/js/views/shell.js',
  './assets/js/views/topbar.js',
  './assets/js/views/auth.js',
  './assets/js/views/quiz-runner.js',
  './assets/js/views/dashboard.js',
  './assets/js/views/lessons.js',
  './assets/js/views/zero.js',
  './assets/js/views/zero-shell.js',
  './assets/js/views/zero-stage.js',
  './assets/js/views/zero-exam.js',
  './assets/js/views/zero-entry.js',
  './assets/js/views/reference.js',
  './assets/js/views/drills.js',
  './assets/js/views/drill.js',
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

  // التنقل: الشبكة أولاً ثم النسخة المخزّنة (ولكل صفحة نسختها: الموقع أو قسم A0)
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const isZeroPage = /\/zero(\.html)?$/.test(url.pathname) || url.pathname.endsWith('zero.html');
      const fallback = isZeroPage ? './zero.html' : './index.html';
      try {
        const fresh = await fetch(req);
        cache.put(fallback, fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        return (await cache.match(fallback)) || (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
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

