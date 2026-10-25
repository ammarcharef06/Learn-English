import { t as uiText } from './i18n.js';
/* لوح كتابة تفاعلي (مطبوع / متصل) — HTML + تهيئة Canvas باللمس والقلم والفأرة */
import { esc, qs, qsa } from './utils.js';
import { speak } from './speech.js';

/* شكل الحرف المخزّن: جسمه بالنسبة لسطر الأساس (سالِب = أعلى خط الأساس) وحجمه،
   مع راية الصاعد/النازل، وراية النقطة أو الشرطة. للتزيين البصري فقط. */
const SHAPES = {
  a: { body: [[0, -.24], [.10, -.46], [.30, -.52], [.50, -.48], [.60, -.32], [.62, -.02], [.66, .06]], size: .52, dot: 'right' },
  b: { body: [[.05, -.96], [.05, .06], [.12, -.46], [.32, -.55], [.54, -.48], [.66, -.30], [.66, -.08], [.54, .06], [.28, .08], [.08, -.02]], size: .62 },
  c: { body: [[.60, -.44], [.42, -.55], [.22, -.52], [.10, -.38], [.10, -.14], [.24, -.02], [.44, .00], [.60, -.10]], size: .54 },
  d: { body: [[.58, -.70], [.58, .06], [.48, -.46], [.28, -.56], [.08, -.48], [.00, -.30], [.02, -.10], [.18, .02], [.38, .02], [.56, -.08]], size: .60 },
  e: { body: [[.06, -.24], [.60, -.28], [.60, -.44], [.46, -.54], [.24, -.52], [.10, -.38], [.08, -.18], [.18, -.02], [.38, .02], [.56, -.06]], size: .52 },
  f: { body: [[.34, -.86], [.24, -.96], [.14, -.88], [.18, -.64], [.12, .06], [.00, -.30], [.12, -.52], [.42, -.56]], size: .62 },
  g: { body: [[.64, -.48], [.44, -.56], [.20, -.50], [.08, -.34], [.16, -.14], [.36, -.06], [.60, -.16], [.58, .28], [.44, .46], [.22, .46], [.08, .34]], size: .60, tail: .46 },
  h: { body: [[.05, -.86], [.05, .06], [.14, -.44], [.34, -.54], [.54, -.44], [.60, -.24], [.60, .06]], size: .58 },
  i: { body: [[.20, -.56], [.20, .06]], size: .58, dot: 'right' },
  j: { body: [[.32, -.56], [.32, .30], [.24, .46], [.06, .46], [-.02, .34]], size: .60, tail: .46, dot: 'right' },
  k: { body: [[.06, -.84], [.06, .06], [.54, -.46], [.10, -.26], [.54, .06]], size: .58 },
  l: { body: [[.26, -.86], [.26, -.06], [.34, .04]], size: .58 },
  m: { body: [[.04, -.50], [.04, .06], [.04, -.40], [.16, -.50], [.26, -.40], [.26, .06], [.28, -.40], [.40, -.50], [.50, -.40], [.52, .06]], size: .52 },
  n: { body: [[.04, -.50], [.04, .06], [.06, -.40], [.22, -.52], [.40, -.44], [.46, -.24], [.46, .06]], size: .52 },
  o: { body: [[.34, -.52], [.14, -.46], [.06, -.26], [.16, -.04], [.36, .00], [.54, -.12], [.58, -.32], [.48, -.48], [.34, -.52]], size: .54 },
  p: { body: [[.06, -.50], [.06, .46], [.14, -.40], [.34, -.52], [.54, -.44], [.64, -.26], [.60, -.08], [.42, .00], [.20, -.02], [.06, -.12]], size: .58, tail: .46 },
  q: { body: [[.60, -.50], [.60, .46], [.50, -.42], [.30, -.52], [.10, -.44], [.02, -.26], [.08, -.08], [.28, .00], [.50, -.06]], size: .58, tail: .46 },
  r: { body: [[.10, -.52], [.10, .06], [.12, -.38], [.28, -.52], [.48, -.54]], size: .52 },
  s: { body: [[.54, -.46], [.36, -.54], [.16, -.50], [.10, -.38], [.28, -.26], [.46, -.18], [.48, -.04], [.28, .02], [.08, -.06]], size: .52 },
  t: { body: [[.26, -.78], [.24, -.14], [.34, .00], [.48, -.04], [.00, -.58], [.48, -.58]], size: .58 },
  u: { body: [[.06, -.50], [.06, -.16], [.18, .00], [.38, .00], [.50, -.14], [.50, .06]], size: .52 },
  v: { body: [[.04, -.50], [.28, .02], [.52, -.50]], size: .52 },
  w: { body: [[.02, -.50], [.16, .02], [.30, -.44], [.44, .02], [.58, -.50]], size: .52 },
  x: { body: [[.06, -.50], [.52, .02], [.30, -.24], [.06, .02], [.52, -.50]], size: .52 },
  y: { body: [[.06, -.50], [.26, .02], [.50, -.50], [.38, .28], [.18, .46], [.02, .38]], size: .54, tail: .46 },
  z: { body: [[.06, -.50], [.52, -.50], [.08, .00], [.54, .00]], size: .52 },
};
const CASE_OFFSET = { upper: -.14, lower: 0 };

let padSeq = 0;
const uid = () => `zpad-${(++padSeq).toString(36)}-${Date.now().toString(36)}`;

/* خيارات موحّدة بين البناء والتهيئة */
function normalize(opts = {}) {
  return {
    text: String(opts.text == null ? '' : opts.text),
    mode: opts.mode === 'cursive' ? 'cursive' : 'print',
    pron: opts.pron == null ? '' : String(opts.pron),
    ar: opts.ar == null ? '' : String(opts.ar),
    word: opts.word == null ? '' : String(opts.word),
    allowModeToggle: opts.allowModeToggle !== false,
    /* خطّافان اختياريان تستعملهما الواجهات (لا يضرّان إن غابا) */
    onChange: typeof opts.onChange === 'function' ? opts.onChange : null,
    onDraw: typeof opts.onDraw === 'function' ? opts.onDraw : null,
  };
}

function safeCall(fn, arg) {
  if (typeof fn !== 'function') return;
  try { fn(arg); } catch { /* لا نُسقط اللوح بسبب خطّاف خارجي */ }
}

/* ---------- جدول الحروف: مطبوع ← متصل ---------- */
export function letterForm(ch, mode = 'print') {
  const c = String(ch || '');
  const up = /[A-Z]/.test(c);
  const sh = SHAPES[c.toLowerCase()];
  const dx = up ? CASE_OFFSET.upper : CASE_OFFSET.lower;
  const base = { ch: c, dx, size: sh ? sh.size : 0, hasShape: !!sh, dot: null, tail: 0 };
  if (!sh) return base;
  return {
    ...base,
    dot: sh.dot || null,
    tail: sh.tail || 0,
    body: sh.body,
  };
}

/* وصف مختصر لكل حرف: يُستعمل في عنوان الشكل (a11y) وفي الشرح */
export function formLabelAr(mode = 'print') {
  return mode === 'cursive' ? uiText('ui.literal.99b6722f') : uiText('ui.literal.f9e0eb6c');
}

function cssVar(canvas, name, fallback) {
  try {
    if (typeof getComputedStyle !== 'function') return fallback;
    const host = canvas.closest ? (canvas.closest('.zpad') || canvas) : canvas;
    const v = getComputedStyle(host).getPropertyValue(name);
    return (v || '').trim() || fallback;
  } catch { return fallback; }
}

/* ============================ قوالب HTML ============================ */

/* يبني HTML للوح الكتابة (لا يلمس DOM) */
export function writingPadHTML(opts = {}) {
  const o = normalize(opts);
  const id = uid();
  const label = `${uiText('ui.literal.a4ce4110')} ${formLabelAr(o.mode)}`;
  const info = [o.pron, o.ar, o.word].filter(Boolean);

  const buttons = [
    uiText('ui.literal.00406604'),
    uiText('ui.literal.59bb681a'),
    uiText('ui.literal.e65249c3'),
    uiText('ui.literal.1658a0bf'),
    uiText('ui.literal.cdf84f1f'),
    uiText('ui.literal.8bb9168e'),
  ].join('');

  const modeToggle = o.allowModeToggle ? `
        <div class="zpad__modes" role="group" aria-label="${uiText('ui.literal.5423f650')}">
          <button class="zpad__mode" type="button" data-zpad-mode="print" aria-label="${uiText('ui.literal.af3ee5cf')}" aria-pressed="${o.mode === 'print'}">${uiText('ui.literal.f9e0eb6c')}</button>
          <button class="zpad__mode" type="button" data-zpad-mode="cursive" aria-label="${uiText('ui.literal.c9e6f8ea')}" aria-pressed="${o.mode === 'cursive'}">${uiText('ui.literal.99b6722f')}</button>
        </div>` : '';

  return `
    <section class="zpad" id="${id}" data-zpad-root dir="ltr" aria-label="${esc(label)}">
      <div class="zpad__head">
        <span class="zpad__legend" aria-hidden="true">
          <i class="zpad__swatch zpad__swatch--ghost"></i>${uiText('ui.literal.76c062b8')}
          <i class="zpad__swatch zpad__swatch--ink"></i>${uiText('ui.literal.b84a38b3')}
        </span>
        <span class="zpad__state" data-zpad-state>${o.mode === 'cursive' ? uiText('ui.literal.99b6722f') : uiText('ui.literal.f9e0eb6c')}</span>
      </div>
      <div class="zpad__bar" role="toolbar" aria-label="${uiText('ui.literal.0ba05b33')}" dir="rtl">
        ${buttons}
        <span class="zpad__spacer"></span>
        ${modeToggle}
      </div>
      <div class="zpad__wrap" dir="ltr">
        <label class="sr-only" for="${id}-canvas">${uiText('ui.literal.aad024dd')}</label>
        <canvas class="zpad__canvas" id="${id}-canvas" data-zpad-canvas role="img"
          aria-label="${esc(label)}" aria-describedby="${id}-hint"></canvas>
      </div>
      <p class="zpad__hint" id="${id}-hint" dir="ltr">${esc(o.text || '')}</p>
      ${info.length ? `<p class="zpad__info">${info.map((s) => `<span class="zpad__chip">${esc(s)}</span>`).join('')}</p>` : ''}
    </section>`;
}

/* ============================ التهيئة ============================ */

/* يربط لوحاً مرسوماً داخل root ويعيد متحكّماً */
export function initWritingPad(root, opts = {}) {
  if (!root || typeof root.querySelector !== 'function') return null;
  const canvas = qs('[data-zpad-canvas]', root);
  if (!canvas || typeof canvas.getContext !== 'function') return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const st = normalize(opts);
  const sizes = { thin: 2.6, thick: 5.4 };
  const state = { tool: 'pen', size: 'thin', strokes: [], current: null, drawing: false, dpr: 0, w: 0, h: 0, raf: 0 };

  const stateEl = qs('[data-zpad-state]', root);
  const hintEl = qs('[data-zpad-hint]', root) || qs('.zpad__hint', root);

  /* ---------- القياس والتحجيم ---------- */
  function measure() {
    const dpr = Math.max(1, Math.min(4, (window.devicePixelRatio || 1)));
    const rect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { width: 0, height: 0 };
    const w = Math.max(40, Math.round(rect.width || canvas.clientWidth || 320));
    let h = Math.round(rect.height || canvas.clientHeight || 0);
    if (h < 60) {
      const cssH = parseFloat(cssVar(canvas, '--zpad-h', '240')) || 240;
      h = Math.round(cssH);
    }
    h = Math.max(120, h);
    if (state.w === w && state.h === h && state.dpr === dpr) return false;
    state.w = w; state.h = h; state.dpr = dpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = `${h}px`;
    return true;
  }

  /* ---------- الرسم ---------- */
  function style(scale) {
    const cfg = { scale, ink: cssVar(canvas, '--zpad-ink', '#34775b'), ghost: cssVar(canvas, '--zpad-ghost', 'rgba(15,23,42,.30)'), line: cssVar(canvas, '--zpad-guide', '#cbd5e1'), mid: cssVar(canvas, '--zpad-mid', '#34775b'), baseline: cssVar(canvas, '--zpad-base', '#64748b') };
    cfg.top = h01(0.16);
    cfg.mid = h01(0.46);
    cfg.base = h01(0.72);
    cfg.bottom = h01(0.94);
    cfg.pad = Math.max(8, Math.round(14 * Math.min(scale, 3)));
    return cfg;
  }
  function h01(ratio) { return Math.round(state.h * ratio); }

  function drawGuides(cfg) {
    const { pad } = cfg;
    const x0 = pad, x1 = state.w - pad;
    ctx.save();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = cfg.line;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x0, cfg.top); ctx.lineTo(x1, cfg.top); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, cfg.bottom); ctx.lineTo(x1, cfg.bottom); ctx.stroke();
    /* السطر الأوسط متقطّع */
    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = cfg.mid;
    ctx.globalAlpha = .55;
    ctx.beginPath(); ctx.moveTo(x0, cfg.mid); ctx.lineTo(x1, cfg.mid); ctx.stroke();
    ctx.globalAlpha = 1;
    /* سطر الأساس أوضح */
    ctx.setLineDash([]);
    ctx.strokeStyle = cfg.baseline;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, cfg.base); ctx.lineTo(x1, cfg.base); ctx.stroke();
    ctx.restore();
  }

  /* يقيس نصاً بوحدة 100px ويعيد حجم الخط المناسب لعرض اللوح */
  function ghostFont(cfg, text) {
    const avail = state.w - cfg.pad * 2;
    const family = st.mode === 'cursive'
      ? '"Segoe Script", "Bradley Hand", "Snell Roundhand", "Comic Sans MS", cursive'
      : '"Segoe UI", Arial, "Helvetica Neue", system-ui, sans-serif';
    const weight = st.mode === 'cursive' ? '400' : '600';
    const track = st.mode === 'cursive' ? -3 : 26; /* تلامس في المتصل، تباعد في المطبوع */
    ctx.save();
    ctx.font = `${weight} 100px ${family}`;
    const unitW = ctx.measureText(text).width + track * Math.max(0, text.length - 1);
    ctx.restore();
    const hRatio = (cfg.base - cfg.top) * 0.78;
    const maxByH = (hRatio / 0.72) * 100;
    const fit = Math.min((avail / Math.max(unitW, 1)) * 100, maxByH);
    return { family, weight, track, scale100: Math.max(14, fit) / 100, size: Math.max(14, fit) };
  }

  function drawGhost(cfg) {
    const raw = st.text.trim();
    if (!raw) return;
    const f = ghostFont(cfg, raw);
    const pad = cfg.pad;
    let x = pad;
    let width = 0;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `${f.weight} ${f.size}px ${f.family}`;
    ctx.setLineDash([]);
    width = ctx.measureText(raw).width + f.track * f.scale100 * Math.max(0, raw.length - 1);
    x = Math.max(pad, pad + ((state.w - pad * 2) - width) / 2);
    /* أثر القلم: خط متصل متموّج في الوضع المتصل، وشرطة تحت النص في المطبوع */
    if (st.mode === 'cursive') {
      drawFlow(cfg, x, width, raw);
      ctx.globalAlpha = .9;
      ctx.fillStyle = cfg.ghost;
      ctx.font = `italic ${f.weight} ${f.size}px ${f.family}`;
      ctx.fillText(raw, x, cfg.base);
    } else {
      drawPerLetter(cfg, x, f, raw);
      ctx.globalAlpha = .85;
      ctx.fillStyle = cfg.ghost;
      ctx.strokeStyle = cfg.ghost;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 7]);
      ctx.font = `${f.weight} ${f.size}px ${f.family}`;
      ctx.fillText(raw, x, cfg.base);
      ctx.beginPath();
      ctx.moveTo(x - 4, cfg.base + Math.max(3, f.size * .16));
      ctx.lineTo(x + width + 4, cfg.base + Math.max(3, f.size * .16));
      ctx.stroke();
    }
    ctx.restore();
  }

  /* مسار متصل تحت الكلمة في الوضع المتصل (يظهر الفرق بوضوح) */
  function drawFlow(cfg, x, width, raw) {
    const amp = Math.max(2, (cfg.base - cfg.top) * 0.055);
    const seg = Math.max(10, width / Math.max(1, raw.length));
    ctx.save();
    ctx.strokeStyle = cfg.ghost;
    ctx.globalAlpha = .35;
    ctx.lineWidth = Math.max(1.2, cfg.base * 0.012);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x - seg * .22, cfg.mid + amp);
    for (let i = 0; i <= raw.length; i++) {
      const cx = x + i * seg;
      ctx.bezierCurveTo(cx + seg * .22, cfg.mid + amp, cx + seg * .34, cfg.base - amp, cx + seg * .5, cfg.base);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* علامات مساعدة باهتة أعلى/تحت كل حرف في الوضع المطبوع */
  function drawPerLetter(cfg, x, f, raw) {
    ctx.save();
    ctx.globalAlpha = .22;
    ctx.strokeStyle = cfg.ghost;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 5]);
    ctx.font = `${f.weight} ${f.size}px ${f.family}`;
    let cx = x;
    for (const ch of raw) {
      const w = ctx.measureText(ch).width || f.size * .5;
      ctx.beginPath();
      ctx.moveTo(cx + w / 2, cfg.top + 2);
      ctx.lineTo(cx + w / 2, cfg.mid - 2);
      ctx.stroke();
      cx += w + f.track * f.scale100;
    }
    ctx.restore();
  }

  /* طبقة الرسم الحرّ */
  function drawStroke(pts, scale) {
    if (!pts || pts.length === 0) return;
    const ink = cssVar(canvas, '--zpad-ink', '#34775b');
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const erase = pts.erase === true;
    ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
    ctx.strokeStyle = erase ? 'rgba(0,0,0,1)' : ink;
    ctx.lineWidth = Math.max(1.2, (sizes[pts.size] || sizes.thin) * scale);
    const first = pts[0];
    ctx.beginPath();
    ctx.moveTo(first[0] * state.w, first[1] * state.h);
    if (pts.length === 1) {
      ctx.lineTo(first[0] * state.w + .01, first[1] * state.h);
    } else {
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i], q = pts[i - 1];
        const mx = ((q[0] + p[0]) / 2) * state.w, my = ((q[1] + p[1]) / 2) * state.h;
        ctx.quadraticCurveTo(q[0] * state.w, q[1] * state.h, mx, my);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last[0] * state.w, last[1] * state.h);
    }
    ctx.stroke();
    if (!erase && pts.length === 1) {
      ctx.beginPath();
      ctx.arc(first[0] * state.w, first[1] * state.h, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = ink;
      ctx.fill();
    }
    ctx.restore();
  }

  function renderAll() {
    measure();
    const scale = state.dpr || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const cfg = style(scale);
    drawGuides(cfg);
    drawGhost(cfg);
    for (const s of state.strokes) drawStroke(s, scale);
    if (state.current) drawStroke(state.current, scale);
  }

  function scheduleRender() {
    if (state.raf) return;
    if (typeof requestAnimationFrame !== 'function') { renderAll(); return; }
    state.raf = requestAnimationFrame(() => { state.raf = 0; renderAll(); });
  }

  /* ---------- الرسم باللمس/القلم/الفأرة ---------- */
  function toLocal(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(1, rect.width);
    const y = (e.clientY - rect.top) / Math.max(1, rect.height);
    return [Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))];
  }

  function onDown(e) {
    if (e.button != null && e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    state.drawing = true;
    const pts = [];
    pts.erase = state.tool === 'eraser';
    pts.size = state.size;
    pts.push(toLocal(e));
    state.current = pts;
    try { canvas.setPointerCapture?.(e.pointerId); } catch { /* تجاهل */ }
    scheduleRender();
  }

  function onMove(e) {
    if (!state.drawing || !state.current) return;
    e.preventDefault();
    const evs = typeof e.getCoalescedEvents === 'function' ? (e.getCoalescedEvents() || []) : [];
    if (evs.length) { for (const ev of evs) state.current.push(toLocal(ev)); }
    else state.current.push(toLocal(e));
    scheduleRender();
  }

  function finish(e) {
    if (!state.drawing) return;
    if (e && e.preventDefault) e.preventDefault();
    state.drawing = false;
    if (state.current && state.current.length) {
      state.strokes.push(state.current);
      if (!state.current.erase) safeCall(st.onDraw, st.mode);
    }
    state.current = null;
    try { canvas.releasePointerCapture?.(e?.pointerId); } catch { /* تجاهل */ }
    scheduleRender();
  }

  /* ---------- الأدوات ---------- */
  function syncButtons() {
    const shellEl = qs('.zpad', root) || root;
    try { shellEl.setAttribute('data-mode', st.mode); } catch { /* تجاهل */ }
    qsa('[data-zpad-mode]', root).forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.zpadMode === st.mode));
    });
    qsa('[data-zpad="pen"]', root).forEach((b) => {
      b.setAttribute('aria-pressed', String(state.tool === 'pen' && b.dataset.size === state.size));
    });
    const er = qs('[data-zpad="tool"][data-tool="eraser"]', root);
    if (er) er.setAttribute('aria-pressed', String(state.tool === 'eraser'));
    if (stateEl) stateEl.textContent = formLabelAr(st.mode);
  }

  function setMode(mode) {
    const next = mode === 'cursive' ? 'cursive' : 'print';
    const changed = next !== st.mode;
    st.mode = next;
    syncButtons();
    renderAll();
    if (changed) safeCall(st.onChange, st.mode);
  }

  function clear() {
    state.strokes = [];
    state.current = null;
    state.tool = 'pen';
    state.size = 'thin';
    syncButtons();
    renderAll();
  }

  function undo() {
    if (state.current) { state.current = null; state.drawing = false; }
    else state.strokes.pop();
    renderAll();
  }

  function setText(text) {
    st.text = String(text == null ? '' : text);
    if (hintEl) hintEl.textContent = st.text;
    renderAll();
  }

  /* ---------- الأحداث ---------- */
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', finish);
  canvas.addEventListener('lostpointercapture', finish);

  function onClick(e) {
    const modeBtn = e.target && e.target.closest ? e.target.closest('[data-zpad-mode]') : null;
    if (modeBtn && root.contains(modeBtn)) { setMode(modeBtn.dataset.zpadMode); return; }
    const btn = e.target && e.target.closest ? e.target.closest('button[data-zpad]') : null;
    if (!btn || !root.contains(btn)) return;
    const act = btn.dataset.zpad;
    if (act === 'clear') clear();
    else if (act === 'undo') undo();
    else if (act === 'hear') speak(st.text.trim());
    else if (act === 'pen') { state.tool = 'pen'; state.size = btn.dataset.size === 'thick' ? 'thick' : 'thin'; syncButtons(); }
    else if (act === 'tool') { state.tool = btn.dataset.tool === 'eraser' ? 'eraser' : 'pen'; syncButtons(); }
  }
  root.addEventListener('click', onClick);

  let ro = null;
  const onResize = () => renderAll();
  if (typeof window.addEventListener === 'function') window.addEventListener('resize', onResize);
  if (typeof ResizeObserver === 'function') {
    try { ro = new ResizeObserver(() => renderAll()); ro.observe(canvas); } catch { ro = null; }
  }

  /* ---------- التشغيل ---------- */
  syncButtons();
  renderAll();
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
    document.fonts.ready.then(() => renderAll()).catch(() => {});
  }

  return {
    destroy() {
      if (state.raf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(state.raf);
      state.raf = 0;
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', finish);
      canvas.removeEventListener('pointercancel', finish);
      canvas.removeEventListener('lostpointercapture', finish);
      root.removeEventListener('click', onClick);
      if (typeof window.removeEventListener === 'function') window.removeEventListener('resize', onResize);
      if (ro) { try { ro.disconnect(); } catch { /* تجاهل */ } ro = null; }
      state.strokes = [];
      state.current = null;
      try { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); } catch { /* تجاهل */ }
    },
    clear,
    setText,
    setMode,
    getMode() { return st.mode; },
  };
}

export default { writingPadHTML, initWritingPad, letterForm };
