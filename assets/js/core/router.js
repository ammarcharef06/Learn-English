/* موجّه بسيط قائم على الهاش — مناسب للاستضافة الثابتة على GitHub Pages */

const routes = [];
let current = { path: '/', params: {}, query: {} };
let notFoundHandler = null;
const listeners = new Set();

export function route(pattern, handler) {
  // pattern مثل: '/unit/:unitId'
  const keys = [];
  const rx = new RegExp('^' + pattern.replace(/:[A-Za-z0-9_]+/g, (m) => { keys.push(m.slice(1)); return '([^/]+)'; }) + '$');
  routes.push({ pattern, rx, keys, handler });
}

export function onRouteChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

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

export async function resolve() {
  const { path, query } = parseHash();
  const found = match(path);
  current = { path, params: found ? found.params : {}, query, pattern: found ? found.pattern : null };
  const handler = found ? found.handler : notFoundHandler;
  listeners.forEach((fn) => { try { fn(current); } catch (e) { console.warn(e); } });
  if (handler) {
    const run = async () => {
      try { await handler(current.params, current.query); }
      catch (e) { console.error('route handler failed', e); }
    };
    // انتقال سلس بين الصفحات (View Transitions API) مع رجوع آمن عند عدم الدعم
    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
      try { await document.startViewTransition(run).finished; }
      catch { await run(); }
    } else {
      await run();
    }
  }
  return current;
}

export function initRouter() {
  window.addEventListener('hashchange', () => { resolve(); });
  if (!location.hash) location.replace('#/');
  return resolve();
}
