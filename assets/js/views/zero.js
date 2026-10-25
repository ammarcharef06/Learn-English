import { t as uiText } from '../core/i18n.js';
﻿/* ============================================================
   قسم «من الصفر» (A0) — الرئيسية + الإعدادات + لوح الكتابة الحر
   كل الواجهات بمكوّنات الموقع: .page-head · .card · .grid · .btn · .chip
   ============================================================ */
import { esc, qs, qsa, toast, arNum, ringHTML } from '../core/utils.js';
import { ZERO_TOTALS, zeroStageSize } from '../data/zero.js';
import { zeroSnapshot, certificate, setZeroPrefs, zeroPrefs, resetZeroProgress, markPadUsed } from '../core/zeroflow.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';

/* ---------- مساعدات صغيرة بمكوّنات الموقع ---------- */
export function bar(percent, variant = '') {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return `<div class="progress ${variant}"><i style="width:${p}%"></i></div>`;
}
export function stat(label, value, foot = '', variant = '') {
  return `<div class="stat ${variant}">
    <div class="stat__label">${esc(label)}</div>
    <div class="stat__value">${esc(String(value))}</div>
    ${foot ? `<div class="stat__foot">${esc(foot)}</div>` : ''}
  </div>`;
}
export function itemsLabel(n) {
  if (n === 1) return uiText('ui.literal.5c270135');
  if (n === 2) return uiText('ui.literal.e1188bb1');
  if (n >= 3 && n <= 10) return `${arNum(n)} ${uiText('ui.literal.e7694d49')} `;
  return `${arNum(n)} ${uiText('ui.literal.dc1883d2')} `;
}

function nextStage(stageList) {
  return stageList.find((s) => !s.state.done) || stageList[stageList.length - 1];
}

/* ============================================================
   الرئيسية
   ============================================================ */
export function renderZero(host) {
  const snap = zeroSnapshot();
  const cert = certificate();
  const next = nextStage(snap.stageList);
  const nums = ['١', '٢', '٣', '٤', '٥'];
  const started = snap.percent > 0;

  const chip = (s) => {
    if (s.state.done) return `<span class="chip chip--ok">✅ ${uiText('ui.literal.760b96cb')} · ${arNum(s.state.best)}٪</span>`;
    if (s.state.seen) return uiText('ui.literal.0c6336cf');
    return `<span class="chip chip--line">${arNum(s.minutes)} ${uiText('ui.literal.09e23213')} </span>`;
  };

  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">🌱</span><h1>${uiText('ui.literal.ef3e7371')} A0</h1></div>
        <p>${uiText('ui.literal.218630ca')} </p>
      </div>
      <div class="row row--wrap">
        <a class="btn btn--primary" href="#/zero/stage/${next.id}">${started ? `${uiText('ui.literal.42c23df3')} ${esc(next.titleAr)}` : uiText('ui.literal.4e4a5842')} ←</a>
        <a class="btn" href="#/zero/pad">✍️ ${uiText('ui.literal.cc3d1c0c')} </a>
      </div>
    </div>

    <div class="card card--brand mt-4">
      <div class="row row--between row--wrap" style="gap:16px">
        <div class="row" style="gap:14px">
          ${ringHTML(snap.percent, `${arNum(snap.percent)}٪`)}
          <div>
            <b>${uiText('ui.literal.543f8102')} </b>
            <div class="small muted">${arNum(snap.doneStages)} من ${arNum(ZERO_TOTALS.stages)} ${uiText('ui.literal.000ac055')} · ${arNum(snap.lettersMastered)} من ${arNum(ZERO_TOTALS.letters)} ${uiText('ui.literal.65b30810')} · ${arNum(ZERO_TOTALS.days)} ${uiText('ui.literal.dd8fb228')} · ${arNum(ZERO_TOTALS.pronouns)} ${uiText('ui.literal.d631d334')} </div>
          </div>
        </div>
        <span class="chip chip--brand">${snap.examBest ? `${uiText('ui.literal.cea94354')} ${arNum(snap.examBest)}٪` : uiText('ui.literal.815968cb')}</span>
      </div>
      <div class="mt-3">${bar(snap.percent)}</div>
    </div>

    <div class="card mt-4">
      <div class="card__title">
        <span class="ico" aria-hidden="true">🗺️</span><h2>${uiText('ui.literal.6574c53b')} </h2>
        <span class="spacer chip chip--brand">${arNum(ZERO_TOTALS.stages)} ${uiText('ui.literal.000ac055')} </span>
      </div>
      <div class="stack">
        ${snap.stageList.map((s, i) => `
          <div>
            <div class="row row--between row--wrap" style="gap:8px">
              <a class="link-card" href="#/zero/stage/${s.id}">
                <span aria-hidden="true">${s.icon}</span>
                <b>${nums[i] || arNum(s.n)} · ${esc(s.titleAr)}</b>
                <span class="chip">${esc(itemsLabel(zeroStageSize(s.id)))}</span>
              </a>
              ${chip(s)}
            </div>
            <div class="small muted" style="margin-top:6px">${esc(s.subAr)}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="grid grid--3 mt-4">
      <a class="card card--interactive" href="#/zero/exam">
        <div class="card__title"><span class="ico" aria-hidden="true">🧪</span><h3>${uiText('ui.literal.cea94354')} </h3></div>
        <p class="small muted">${uiText('ui.literal.aa1de96b')} ${snap.examBest ? `${uiText('ui.literal.a73f1ef4')} ${arNum(snap.examBest)}٪` : uiText('ui.literal.ea2e7a0b')}</p>
      </a>
      <a class="card card--interactive" href="#/zero/certificate">
        <div class="card__title"><span class="ico" aria-hidden="true">🎓</span><h3>${uiText('ui.literal.07e8f3c3')} </h3></div>
        <p class="small muted">${cert.earned ? uiText('ui.literal.da5006f9') : uiText('ui.literal.9bde300f')}</p>
      </a>
      <a class="card card--interactive" href="#/zero/pad">
        <div class="card__title"><span class="ico" aria-hidden="true">✍️</span><h3>${uiText('ui.literal.cc3d1c0c')} </h3></div>
        <p class="small muted">${uiText('ui.literal.fbf61878')} </p>
      </a>
    </div>`;
}

/* ============================================================
   إعدادات التأسيس
   ============================================================ */
export function renderZeroSettings(host) {
  const pr = zeroPrefs();
  const snap = zeroSnapshot();

  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">⚙️</span><h1>${uiText('ui.literal.462965d1')} </h1></div>
        <p>${uiText('ui.literal.d845fbc3')} </p>
      </div>
      <div class="row row--wrap"><a class="btn btn--sm" href="#/zero">← ${uiText('ui.literal.0bb7be6c')} </a></div>
    </div>

    <div class="card mt-4">
      <label class="row row--between row--wrap" style="gap:12px;padding:10px 0">
        <span class="zero-info">
          <b>${uiText('ui.literal.74141bf1')} </b>
          <span class="tiny muted">${uiText('ui.literal.3a2bc2ad')} </span>
        </span>
        <span class="switch"><input type="checkbox" id="zAuto" ${pr.autoSpeak ? 'checked' : ''} /><span class="switch__track"></span></span>
      </label>
      <div class="divider"></div>
      <div class="row row--between row--wrap" style="gap:12px">
        <span class="zero-info">
          <b>${uiText('ui.literal.98f4f639')} </b>
          <span class="tiny muted">${uiText('ui.literal.3157e1bc')} </span>
        </span>
        <select class="select" id="zRate" style="inline-size:140px">
          <option value="slow" ${pr.slowRate <= 0.6 ? 'selected' : ''}>${uiText('ui.literal.694ffb2d')} </option>
          <option value="normal" ${pr.slowRate > 0.6 ? 'selected' : ''}>${uiText('ui.literal.660746e8')} </option>
        </select>
      </div>
      <div class="divider"></div>
      <div class="row row--between row--wrap" style="gap:12px">
        <span class="zero-info">
          <b>${uiText('ui.literal.8cc26f20')} </b>
          <span class="tiny muted">${uiText('ui.literal.9f91a249')} </span>
        </span>
        <select class="select" id="zPad" style="inline-size:140px">
          <option value="print" ${pr.padMode === 'print' ? 'selected' : ''}>${uiText('ui.literal.f9e0eb6c')} </option>
          <option value="cursive" ${pr.padMode === 'cursive' ? 'selected' : ''}>${uiText('ui.literal.99b6722f')} </option>
        </select>
      </div>
    </div>

    <div class="grid grid--4 mt-4">
      ${stat(uiText('ui.literal.e9e12cda'), `${arNum(snap.percent)}٪`, '', 'stat--brand')}
      ${stat(uiText('ui.literal.0bb7be6c'), `${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}`)}
      ${stat(uiText('ui.literal.22926ee8'), `${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}`)}
      ${stat(uiText('ui.literal.cea94354'), `${arNum(snap.examBest)}٪`, '', snap.examBest >= 90 ? 'stat--ok' : '')}
    </div>


    <div class="card mt-4" style="border-color:color-mix(in srgb, var(--bad) 40%, var(--line))">
      <div class="card__title"><span class="ico" aria-hidden="true">⚠️</span><h3>${uiText('ui.literal.3c852227')} A0</h3></div>
      <p class="small muted">${uiText('ui.literal.8730452a')} A1 و A2 و B1 ${uiText('ui.literal.d32d4f91')} </p>
      <button class="btn" type="button" id="zReset">${uiText('ui.literal.19b0e013')} </button>
    </div>`;

  qs('#zAuto', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ autoSpeak: e.target.checked });
    toast(e.target.checked ? uiText('ui.literal.edd6a05f') : uiText('ui.literal.95296ed2'), 'info');
  });
  qs('#zRate', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ slowRate: e.target.value === 'slow' ? 0.55 : 1 });
    toast(e.target.value === 'slow' ? uiText('ui.literal.2fea98e1') : uiText('ui.literal.8c5ab4fa'), 'info');
  });
  qs('#zPad', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ padMode: e.target.value === 'cursive' ? 'cursive' : 'print' });
    toast(e.target.value === 'cursive' ? uiText('ui.literal.229178ae') : uiText('ui.literal.0759a2d3'), 'info');
  });
  qs('#zReset', host)?.addEventListener('click', () => {
    if (!window.confirm(uiText('ui.literal.798988c0'))) return;
    resetZeroProgress();
    toast(uiText('ui.literal.dff38978'), 'ok');
    window.__leaRenderAll?.();
  });
}

/* ============================================================
   لوح الكتابة الحر
   ============================================================ */
const PAD_PRESETS = ['A a', 'B b', 'C c', 'cat', 'dog', 'sun', 'book', 'Hello!', 'I am Ali.'];

export function renderZeroPad(host) {
  const pr = zeroPrefs();
  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">✍️</span><h1>${uiText('ui.literal.cc3d1c0c')} </h1></div>
        <p>${uiText('ui.literal.1061ef63')} </p>
      </div>
      <div class="row row--wrap"><a class="btn btn--sm" href="#/zero">← ${uiText('ui.literal.0bb7be6c')} </a></div>
    </div>

    <div class="card mt-4">
      <div class="row row--wrap" id="padPresets" style="gap:8px">
        ${PAD_PRESETS.map((t, i) => `<button class="btn btn--sm ${i === 0 ? 'btn--primary' : ''}" type="button" data-pad="${esc(t)}">${esc(t)}</button>`).join('')}
      </div>
      <div class="divider"></div>
      <div class="row row--wrap" style="gap:8px">
        <input class="input" id="padCustom" dir="ltr" placeholder="${uiText('ui.literal.04b973fa')} " autocomplete="off" spellcheck="false" style="flex:1;min-inline-size:180px" />
        <button class="btn" type="button" id="padCustomGo">${uiText('ui.literal.b50cf2c6')} </button>
      </div>
    </div>

    <div id="padHost" class="mt-4"></div>`;

  let pad = null;
  const mount = (text) => {
    const padHost = qs('#padHost', host);
    if (!padHost) return;
    if (pad && pad.destroy) { try { pad.destroy(); } catch {} }
    padHost.innerHTML = writingPadHTML({ text, mode: pr.padMode });
    pad = initWritingPad(padHost, {
      text,
      mode: pr.padMode,
      onChange: (mode) => setZeroPrefs({ padMode: mode }),
      onDraw: () => { const r = markPadUsed(); if (r.milestone) toast(uiText('ui.literal.22e850a8'), 'ok'); },
    });
  };
  mount(PAD_PRESETS[0]);

  qsa('[data-pad]', host).forEach((b) => b.addEventListener('click', () => {
    qsa('[data-pad]', host).forEach((x) => x.classList.remove('btn--primary'));
    b.classList.add('btn--primary');
    mount(b.dataset.pad);
  }));
  qs('#padCustomGo', host)?.addEventListener('click', () => {
    const v = qs('#padCustom', host)?.value?.trim();
    if (v) mount(v.slice(0, 40));
  });
  qs('#padCustom', host)?.addEventListener('keydown', (e) => { if (e.key === 'Enter') qs('#padCustomGo', host)?.click(); });
}
