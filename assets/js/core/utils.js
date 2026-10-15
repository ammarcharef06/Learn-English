/* أدوات مساعدة عامة */

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
export function uid(prefix = 'id') { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n, exclude = []) {
  const ex = new Set(exclude.map((x) => String(x).toLowerCase()));
  const pool = arr.filter((x) => !ex.has(String(x).toLowerCase()));
  return shuffle(pool).slice(0, n);
}

export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function pct(part, whole) { return whole > 0 ? Math.round((part / whole) * 100) : 0; }

/* أرقام عربية-هندية للعرض في الواجهة العربية */
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
export function arNum(value) {
  return String(value ?? '').replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}
export function debounce(fn, ms = 250) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
export function sortBy(arr, key, dir = 1) {
  return arr.slice().sort((a, b) => (a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0));
}

/* ---------- التواريخ ---------- */
export function dateKey(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export const todayKey = () => dateKey(new Date());
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
export function daysBetween(aKey, bKey) {
  const a = new Date(aKey + 'T00:00:00'), b = new Date(bKey + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}
const AR_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const AR_MONTHS = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
export const dayNameAr = (d) => AR_DAYS[new Date(d).getDay()];
export const monthNameAr = (d) => AR_MONTHS[new Date(d).getMonth()];
export function prettyDateAr(key) {
  const d = new Date(key + 'T00:00:00');
  return `${dayNameAr(d)} ${d.getDate()} ${monthNameAr(d)}`;
}
export function prettyTimeAr(hhmm) {
  const [h, m] = String(hhmm || '19:00').split(':').map(Number);
  const period = h < 12 ? 'صباحاً' : h < 17 ? 'بعد الزوال' : h < 20 ? 'مساءً' : 'ليلاً';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}
export function fmtDuration(seconds) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} د ${s % 60} ث` : `${s} ث`;
}

/* ---------- التنزيل والملفات ---------- */
export function download(filename, text, mime = 'application/json') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
export function readFileText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsText(file, 'utf-8');
  });
}
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

/* ---------- واجهة: تنبيهات، نوافذ، احتفال ---------- */
export function toast(message, type = 'info', title = '') {
  const host = qs('#toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `${title ? `<b>${esc(title)}</b>` : ''}<span>${esc(message)}</span>`;
  host.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 260ms, transform 260ms';
    el.style.opacity = '0'; el.style.transform = 'translateY(-8px)';
    setTimeout(() => el.remove(), 300);
  }, type === 'bad' ? 5200 : 3400);
}

export function openModal({ title = '', body = '', actions = [], onMount = null, wide = false }) {
  const root = qs('#modalRoot');
  root.hidden = false;
  root.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" style="${wide ? 'width:min(920px,100%)' : ''}">
      <div class="modal__head">
        <h3>${esc(title)}</h3>
        <button class="icon-btn" data-modal-close type="button" aria-label="إغلاق">✕</button>
      </div>
      <div class="modal__body">${body}</div>
      <div class="modal__actions row row--wrap" style="margin-top:16px;justify-content:flex-end">
        ${actions.map((a, i) => `<button class="btn ${a.variant ? 'btn--' + a.variant : ''}" data-modal-action="${i}" type="button">${esc(a.label)}</button>`).join('')}
      </div>
    </div>`;
  const close = () => closeModal();
  root.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', close));
  root.addEventListener('click', (e) => { if (e.target === root) close(); }, { once: true });
  root.querySelectorAll('[data-modal-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const spec = actions[Number(btn.dataset.modalAction)];
      if (spec && typeof spec.onClick === 'function') {
        const res = await spec.onClick(root);
        if (res === false) return;
      }
      if (!spec || spec.close !== false) closeModal();
    });
  });
  if (onMount) onMount(root);
  document.addEventListener('keydown', escHandler);
  return root;
}
function escHandler(e) { if (e.key === 'Escape') closeModal(); }
export function closeModal() {
  const root = qs('#modalRoot');
  if (!root) return;
  root.hidden = true; root.innerHTML = '';
  document.removeEventListener('keydown', escHandler);
}

export function confetti(count = 60) {
  const host = qs('#confetti');
  if (!host) return;
  const colors = ['#2563eb', '#7c3aed', '#06b6d4', '#f59e0b', '#16a34a', '#ef4444', '#ec4899'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '-20px';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
    host.appendChild(p);
    setTimeout(() => p.remove(), 3600);
  }
}

/* ---------- الصوت (زر النطق) ---------- */
export const SPEAK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
export function speakBtn(text, extraClass = '') {
  return `<button class="speak-btn ${extraClass}" type="button" data-say="${esc(text)}" title="اسمع النطق" aria-label="اسمع النطق: ${esc(text)}">${SPEAK_ICON}</button>`;
}

export function ringHTML(percent, label) {
  const p = clamp(Math.round(percent), 0, 100);
  return `<div class="ring" style="--p:${p}"><span>${label != null ? esc(label) : p + '%'}</span></div>`;
}

export function starsHTML(n, max = 3) {
  return `<span class="stars">${'★'.repeat(n)}${'☆'.repeat(Math.max(0, max - n))}</span>`;
}
