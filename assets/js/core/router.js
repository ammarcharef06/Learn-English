/* موجّه بسيط قائم على الهاش — مناسب للاستضافة الثابتة على GitHub Pages */

const routes = [];
let current = { path: '/', params: {}, query: {} };
let notFoundHandler = null;
const listeners = new Set();
const renderedListeners = new Set();

export function route(pattern, handler) {
  // pattern مثل: '/unit/:unitId'
  const keys = [];
  const rx = new RegExp('^' + pattern.replace(/:[A-Za-z0-9_]+/g, (m) => { keys.push(m.slice(1)); return '([^/]+)'; }) + '$');
  routes.push({ pattern, rx, keys, handler });
}

export function onRouteChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function onRouteRendered(fn) { renderedListeners.add(fn); return () => renderedListeners.delete(fn); }

export function parseHash(hash = location.hash) {
  const raw = String(hash || '').replace(/^#/, '');
  const [pathPart, queryPart] = raw.split('?');
  const path = '/' + pathPart.replace(/^\/+/, '').replace(/\/+$/, '');
  const query = {};
  if (queryPart) {
    for (const kv of queryPart.split('&')) {
      if (!kv) continue;
      const [k, v = ''] = kv.split('=');
      query[decodeURIComponent(k)] = decodeURIComponent(v);
    }
  }
  return { path: path === '/' ? '/' : path, query };
}

export function navigate(path, query = null) {
  let target = path.startsWith('/') ? path : '/' + path;
  if (query) {
    const qs = Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    if (qs) target += '?' + qs;
  }
  const next = '#' + target;
  if (location.hash === next) resolve();
  else location.hash = next;
}

export function setNotFound(fn) { notFoundHandler = fn; }
export function currentRoute() { return current; }

function match(path) {
  for (const r of routes) {
    const m = path.match(r.rx);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      return { ...r, params };
    }
  }
  return null;
}

let vtActive = false;
/* رقم تسلسلي لكل عملية توجيه: يمنع نتيجة قديمة من الكتابة فوق أحدث منها
   (كان يحدث فعلاً عند تنقّلين متلاحقين أثناء انتقال العرض). */
let resolveToken = 0;

export async function resolve() {
  const myToken = ++resolveToken;
  const { path, query } = parseHash();
  const found = match(path);
  current = { path, params: found ? found.params : {}, query, pattern: found ? found.pattern : null };
  const handler = found ? found.handler : notFoundHandler;
  if (myToken !== resolveToken) return current;   // تجاوزناها عملية أحدث
  listeners.forEach((fn) => { try { fn(current); } catch (e) { console.warn(e); } });
  if (handler) {
    const run = async () => {
      if (myToken !== resolveToken) return;        // لا ترسم صفحة قديمة فوق الأحدث
      try { await handler(current.params, current.query); }
      catch (e) { console.error('route handler failed', e); }
    };
    // انتقال سلس بين الصفحات (View Transitions) مع تجاهل التنقلات المتلاحقة بأمان
    const canTransition = typeof document !== 'undefined'
      && typeof document.startViewTransition === 'function'
      && !vtActive
      && !document.hidden;
    if (canTransition) {
      vtActive = true;
      try {
        const vt = document.startViewTransition(run);
        vt.ready?.catch?.(() => {});           // يُرفض عند إلغاء الانتقال — نتجاهله بلا ضجيج
        await vt.finished?.catch?.(() => {});  // لا يوقف التنقل أبداً
      } catch {
        await run();
      } finally {
        vtActive = false;
      }
    } else {
      await run();
    }
  }
  if (myToken === resolveToken) {
    renderedListeners.forEach((fn) => { try { fn(current); } catch (e) { console.warn(e); } });
  }
  return current;
}

export function initRouter() {
  window.addEventListener('hashchange', () => { resolve(); });
  if (!location.hash) location.replace('#/');
  return resolve();
}
