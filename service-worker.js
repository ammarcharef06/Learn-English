/* ============================================================
   Service Worker — offline cache and browser-local notifications
   ============================================================ */

const VERSION = 'v4.17.0';
const CACHE = `lea-${VERSION}`;
const CORE = [
  './',
  './index.html',
  './zero.html',
  './literacy.html',
  './assets/css/literacy.css',
  './assets/js/literacy/engine.js',
  './curriculum/literacy/literacy-l0-l1.json',
  './curriculum/literacy/audio-manifest.json',
  './manifest.webmanifest',
  './manifest-zero.webmanifest',
  './assets/css/main.css',
  './assets/css/zero.css',
  './assets/css/zero-pad.css',
  './assets/img/favicon.svg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/icon-maskable-512.png',
  './assets/img/apple-touch-icon.png',
  './assets/js/app.js',
  './assets/js/literacy/engine.js',
  './curriculum/literacy/literacy-l0-l1.json',
  './assets/js/zero-main.js',
  './assets/js/core/utils.js',
  './assets/js/core/store.js',
  './assets/js/core/i18n.js',
  './assets/js/core/ar.json',
  './assets/js/core/auth.js',
  './assets/js/core/router.js',
  './assets/js/core/speech.js',
  './assets/js/core/srs.js',
  './assets/js/core/sync.js',
  './assets/js/core/gamify.js',
  './assets/js/core/journey.js',
  './assets/js/core/conversation-practice.js',
  './assets/js/core/notify.js',
  './assets/js/core/ads.js',
  './assets/js/core/updater.js',
  './assets/js/core/app-version.js',
  './assets/js/core/quizgen.js',
  './assets/js/core/zeroflow.js',
  './assets/js/core/zero-pad.js',
  './assets/js/core/theme.js',
  './assets/js/data/reference.js',
  './assets/js/data/curriculum.js',
  './assets/js/data/curriculum-audio.js',
  './assets/js/data/curriculum-advanced.js',
  './assets/js/data/curriculum-a1.js',
  './assets/js/data/curriculum-a2.js',
  './assets/js/data/curriculum-b1.js',
  './assets/js/data/readings.js',
  './assets/js/data/badges.js',
  './assets/js/data/conversations.js',
  './assets/js/data/zero.js',
  './assets/js/data/zero-letters.js',
  './assets/js/data/zero-time.js',
  './assets/js/data/zero-words.js',
  './assets/js/views/shell.js',
  './assets/js/views/topbar.js',
  './assets/js/core/zero-audio.js',
  './assets/js/data/zero-audio-map.js',
  './assets/js/views/auth.js',
  './assets/js/views/quiz-runner.js',
  './assets/js/views/dashboard.js',
  './assets/js/views/journey.js',
  './assets/js/views/conversations.js',
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
  './assets/js/views/support.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(CORE.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
    const mapResponse = await cache.match('./assets/js/data/curriculum-audio.js');
    if (!mapResponse?.ok) throw new Error('Could not load curriculum audio map for offline caching.');
    const mapSource = await mapResponse.text();
    const audioUrls = [...new Set(
      [...mapSource.matchAll(/["'](\.\/assets\/audio\/curriculum\/[a-f0-9]+\.mp3)["']/g)]
        .map((match) => match[1]),
    )];
    for (let i = 0; i < audioUrls.length; i += 30) {
      await cache.addAll(audioUrls.slice(i, i + 30));
    }
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

/* التسجيلات الصوتية تبقى متاحة دون اتصال بعد تخزينها مسبقاً أو أول طلب ناجح */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url2;
  try { url2 = new URL(req.url); } catch { return; }

  // Leave cross-origin requests (such as Google Fonts) to the browser.
  if (!isSameOrigin(url2)) return;

  if (url2.pathname.includes('/assets/audio/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const response = await fetch(req);
        if (response.ok) await cache.put(req, response.clone());
        return response;
      } catch {
        return new Response('', { status: 504, statusText: 'Audio unavailable offline' });
      }
    })());
    return;
  }

  // التنقل: الشبكة أولاً ثم النسخة المخزّنة (ولكل صفحة نسختها: الموقع أو قسم A0)
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const isZeroPage = /\/zero(\.html)?$/.test(url2.pathname) || url2.pathname.endsWith('zero.html');
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
