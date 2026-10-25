import { t as uiText } from '../core/i18n.js';
﻿/* ============================================================
   قسم «من الصفر» (A0) — مشغّل المرحلة
   • الحروف والحروف المركّبة: عنصر واحد في البطاقة (تركيز) + شريط اختيار
   • بقية المراحل: مجموعات في .seg وقوائم .item-row
   • القراءات: بطاقة لكل نص
   كل شيء بمكوّنات الموقع نفسها: .page-head · .card · .grid · .btn · .chip · .item-row · .seg
   ============================================================ */
import { esc, qs, qsa, toast, confetti, openModal, speakBtn, arNum } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { speak } from '../core/speech.js';
import { progress } from '../core/store.js';
import { ZERO_STAGES, zeroStage, zeroItems, zeroStageQuestions, READINGS } from '../data/zero.js';
import {
  zeroSnapshot, markStageSeen, markLetter, markDigraph, markWord, markSentence,
  markReadingDone, markPadUsed, applyAnswer, zeroPrefs, setZeroPrefs, recordStageDrill,
} from '../core/zeroflow.js';
import { runQuiz } from './quiz-runner.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';
import { zeroPageHead } from './zero-head.js';
import { bar, stat, itemsLabel } from './zero.js';

/* مراحل تُعرَض عنصراً واحداً في البطاقة */
const FOCUS_KINDS = new Set(['letters', 'digraphs']);

const SENT_GROUP_AR = {
  greetings: uiText('ui.literal.3a471973'), intro: uiText('ui.literal.71cdcc65'), family: uiText('ui.literal.6e9ff497'), school: uiText('ui.literal.0bcbf1a5'),
  daily: uiText('ui.literal.1bf4be11'), questions: uiText('ui.literal.6bdaeee8'), shopping: uiText('ui.literal.74e29af5'), polite: uiText('ui.literal.9d36919b'),
};
const TIME_GROUP_AR = { day: uiText('ui.literal.4ea53050'), month: uiText('ui.literal.4ba59f66'), season: uiText('ui.literal.fab70616'), time: uiText('ui.literal.4cd89c58'), clock: uiText('ui.literal.87634e40') };

function rate() { return zeroPrefs().slowRate <= 0.6 ? 0.55 : undefined; }
function say(text, slow = false) {
  if (!text) return;
  speak(text, slow ? { rate: 0.5 } : { rate: rate() });
}
/** نطق اسم الحرف (النطق المدمج في المتصفح) */
function sayName(it, slow = false) {
  if (!it) return;
  say(it.nameId ? `name:${it.nameId}` : (it.say || it.en), slow);
}
/** نطق كلمة المثال */
function sayWord(it, slow = false) {
  if (!it || !it.word) return;
  say(it.wordId ? `word:${it.wordId}` : it.word, slow);
}
/** نطق صوت الحرف المركّب من تسجيله المستقل عن كلمة المثال */
function sayDigraph(it, slow = false) {
  if (!it) return;
  say(it.sayId ? `sound:${it.sayId}` : (it.say || it.en), slow);
}

/* ============================================================
   تفاصيل العنصر + لوح الكتابة
   ============================================================ */
export function openDetails(it) {
  const rows = [];
  if (it.ar) rows.push(`<div class="zero-info"><span class="zero-info__k">${uiText('ui.literal.928190c1')} </span><span class="zero-info__v">${esc(it.ar)}</span></div>`);
  if (it.pron) rows.push(`<div class="zero-info"><span class="zero-info__k">${uiText('ui.literal.14d92bd5')} </span><span class="zero-info__v">${esc(it.pron)}</span></div>`);
  if (it.soundAr) rows.push(`<div class="zero-info"><span class="zero-info__k">${uiText('ui.literal.7cc2319b')} </span><span class="zero-info__v">${esc(it.soundAr)}</span></div>`);
  if (it.word) rows.push(`<div class="zero-info"><span class="zero-info__k">${uiText('ui.literal.05e40d12')} </span><span class="zero-info__v"><b dir="ltr">${esc(it.word)}</b> · ${esc(it.wordPronAr || '')} · ${esc(it.wordAr || '')}</span></div>`);
  if (it.extra) rows.push(`<div class="zero-info"><span class="zero-info__k">${uiText('ui.literal.0acb25d9')} </span><span class="zero-info__v"><b dir="ltr">${esc(it.extra)}</b> · ${esc(it.extraAr || '')}</span></div>`);

  openModal({
    title: uiText('ui.literal.dce6205a'),
    body: `
      <div class="stack">
        <div class="center" style="text-align:center">
          <div style="font-family:var(--font-en);font-size:2rem;font-weight:800" dir="ltr">${esc(it.en)}</div>
        </div>
        <div class="stack" style="gap:10px">${rows.join('')}</div>
        ${it.tipAr ? `<div class="tip-box tip-box--brand">${esc(it.tipAr)}</div>` : ''}
        <div class="row row--wrap" style="gap:8px">
          <button class="btn btn--primary" type="button" data-play="${esc(it.sayId ? `sound:${it.sayId}` : (it.say || it.en))}">${it.nameAr ? uiText('ui.literal.af42bb39') : (it.sayId ? uiText('ui.literal.794ad226') : uiText('ui.literal.8251a739'))}</button>
          <button class="btn" type="button" data-play-slow="${esc(it.sayId ? `sound:${it.sayId}` : (it.say || it.en))}">🐢 ${uiText('ui.literal.f99608dd')} </button>
          ${it.word ? `<button class="btn" type="button" data-play="${esc(it.word)}">🔊 ${uiText('ui.literal.81e739b4')} </button>` : ''}
        </div>
      </div>`,
    actions: [{ label: uiText('ui.literal.7d6d03fb'), variant: 'ghost' }],
    onMount: (root) => {
      qsa('[data-play]', root).forEach((b) => b.addEventListener('click', () => say(b.dataset.play)));
      qsa('[data-play-slow]', root).forEach((b) => b.addEventListener('click', () => say(b.dataset.playSlow, true)));
    },
  });
}

export function openWritePad(text, ar = '') {
  const prefs = zeroPrefs();
  const root = openModal({
    title: `${uiText('ui.literal.5eebf92d')} ${text}`,
    wide: true,
    body: `<div id="padModalHost"></div>`,
    actions: [{ label: uiText('ui.literal.7d6d03fb'), variant: 'ghost' }],
  });
  const holder = root.querySelector('#padModalHost');
  holder.innerHTML = writingPadHTML({ text, mode: prefs.padMode, ar });
  const pad = initWritingPad(holder, {
    text, mode: prefs.padMode, ar,
    onChange: (mode) => setZeroPrefs({ padMode: mode }),
    onDraw: () => { const r = markPadUsed(); if (r.milestone) toast(uiText('ui.literal.22e850a8'), 'ok'); },
  });
  root.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', () => { pad?.destroy?.(); }));
  return pad;
}

/* ============================================================
   ترويسة المرحلة (بنفس شكل رؤوس صفحات الموقع)
   ============================================================ */
function stageHead(stage) {
  const idx = ZERO_STAGES.findIndex((s) => s.id === stage.id);
  const next = ZERO_STAGES[idx + 1];
  const state = zeroSnapshot().raw.stages?.[stage.id] || {};
  return zeroPageHead({
    icon: stage.icon,
    title: stage.titleAr,
    subtitle: stage.subAr,
    metaHtml: `
      <span class="chip chip--brand">${esc(itemsLabel(zeroItems(stage.id).length))}</span>
      <span class="chip chip--line">⏱ ${arNum(stage.minutes)} ${uiText('ui.literal.09e23213')} </span>
      ${state.done ? `<span class="chip chip--ok">✅ ${uiText('ui.literal.760b96cb')} · ${arNum(state.best)}٪</span>` : (state.seen ? uiText('ui.literal.f02ecb89') : '')}`,
    actionsHtml: `
        <a class="btn btn--sm" href="#/zero">← ${uiText('ui.literal.0bb7be6c')} </a>
        <button class="btn btn--sm" type="button" id="zAutoBtn">${zeroPrefs().autoSpeak ? uiText('ui.literal.55f6a94f') : uiText('ui.literal.7b340db0')}</button>
        <a class="btn btn--sm" href="#/zero/drill/${stage.id}">🧪 ${uiText('ui.literal.ab8900f0')} </a>
        ${next
          ? `<a class="btn btn--sm" href="#/zero/stage/${next.id}">${esc(next.titleAr)} ←</a>`
          : uiText('ui.literal.9e34cf8e')}
      `,
  });
}

function bindAutoBtn(host) {
  qs('#zAutoBtn', host)?.addEventListener('click', () => {
    const on = setZeroPrefs({ autoSpeak: !zeroPrefs().autoSpeak }).autoSpeak;
    const b = qs('#zAutoBtn', host);
    if (b) b.textContent = on ? uiText('ui.literal.55f6a94f') : uiText('ui.literal.7b340db0');
    toast(on ? uiText('ui.literal.edd6a05f') : uiText('ui.literal.95296ed2'), 'info');
  });
}

/* ============================================================
   مشغّل المرحلة
   ============================================================ */
export function renderZeroStage(host, stageId) {
  const stage = zeroStage(stageId);
  if (!stage) { navigate('/zero'); return; }
  markStageSeen(stage.id);
  const kind = stage.kind;
  if (kind === 'reading') return renderReadingStage(host, stage);
  if (FOCUS_KINDS.has(kind)) return renderFocusStage(host, stage);
  return renderListStage(host, stage);
}

/* ============================================================
   ١) الحروف والحروف المركّبة: عنصر واحد واضح
   ============================================================ */
function renderFocusStage(host, stage) {
  const items = zeroItems(stage.id);
  const isLetters = stage.kind === 'letters';
  let i = 0;

  const isDone = (it) => (isLetters
    ? !!progress.zero?.letters?.[it.en.trim().split(/\s+/)[0].toLowerCase()]
    : !!progress.zero?.digraphs?.[findDigraphId(it)]);

  host.innerHTML = `
    ${stageHead(stage)}
    <div id="zFocus" class="mt-4"></div>
    <div class="card mt-4">
      <div class="card__title">
        <span class="ico" aria-hidden="true">${isLetters ? '🔤' : '🔡'}</span>
        <h3>${isLetters ? uiText('ui.literal.d38f9978') : uiText('ui.literal.8ff35efa')}</h3>
        <span class="spacer small muted">${uiText('ui.literal.d3825caf')} </span>
      </div>
      <div class="zero-strip" id="zStrip">
        ${items.map((x, k) => `<button type="button" data-jump="${k}" dir="ltr" aria-label="${uiText('ui.literal.df170388')} ${esc(x.en)}">${esc(isLetters ? x.en.split(/\s+/)[0] : x.en)}</button>`).join('')}
      </div>
    </div>`;
  bindAutoBtn(host);

  const paint = (speakNow = true) => {
    const it = items[i];
    const done = isDone(it);
    const box = qs('#zFocus', host);
    if (!box) return;

    const lead = isLetters
      ? `<span class="zero-letter__big" dir="ltr">${esc(it.en.split(' ')[0])}</span><span class="zero-letter__small" dir="ltr">${esc(it.en.split(' ')[1] || '')}</span>`
      : `<span class="zero-letter__combo" dir="ltr">${esc(it.en)}</span>`;

    box.innerHTML = `
      <div class="card">
        <div class="row row--between row--wrap" style="gap:8px">
          <span class="chip chip--brand">${uiText('ui.literal.df0ae0b2')} ${arNum(i + 1)} من ${arNum(items.length)}</span>
          ${done ? uiText('ui.literal.1e8ddec3') : ''}
        </div>
        <div class="mt-3">${bar(((i + 1) / items.length) * 100)}</div>

        <div class="zero-letter" data-hear>
          ${lead}
        </div>

        <div class="grid grid--3" style="gap:12px">
          ${isLetters ? `<div class="zero-info"><span class="zero-info__k">${uiText('ui.literal.7a82733f')} </span><span class="zero-info__v">${esc(it.ar)}</span></div>` : ''}
          ${it.soundAr ? `<div class="zero-info"><span class="zero-info__k">${isLetters ? uiText('ui.literal.7cc2319b') : uiText('ui.literal.4a98f895')}</span><span class="zero-info__v">${esc(it.soundAr)}</span></div>` : ''}
          ${it.word ? `<div class="zero-info"><span class="zero-info__k">${uiText('ui.literal.652a444f')} </span><span class="zero-info__v"><b dir="ltr">${esc(it.word)}</b> · ${esc(it.wordPronAr || '')} · ${esc(it.wordAr || '')}</span></div>` : ''}
        </div>

        <div class="row row--wrap mt-4" style="gap:8px">
          <button class="btn btn--primary" type="button" data-act="say">🔊 ${isLetters ? uiText('ui.literal.35c5c65b') : uiText('ui.literal.bb93b381')}</button>
          ${it.word ? uiText('ui.literal.b6ae02eb') : ''}
          <button class="btn" type="button" data-act="write">✍️ ${uiText('ui.literal.61ef23e6')} </button>
          <button class="btn ${done ? 'btn--primary' : ''}" type="button" data-act="master">${done ? uiText('ui.literal.21c6eb35') : uiText('ui.literal.25e2c86d')}</button>
          <button class="btn btn--ghost" type="button" data-act="details">ℹ️ ${uiText('ui.literal.dce6205a')} </button>
        </div>
      </div>

      <div class="row row--between mt-4" style="gap:10px">
        <button class="btn" type="button" data-nav2="prev" ${i === 0 ? 'disabled' : ''}>→ ${uiText('ui.literal.f8994b36')} </button>
        ${i === items.length - 1
          ? `<a class="btn btn--primary" href="#/zero/drill/${stage.id}">🧪 ${uiText('ui.literal.a555612b')} </a>`
          : uiText('ui.literal.a8aab954')}
      </div>`;

    const act = (name, fn) => qs(`[data-act="${name}"]`, box)?.addEventListener('click', fn);
    act('say', () => (isLetters ? sayName(it) : sayDigraph(it)));  // ١: اسم الحرف · ٢: المقطع المسجّل
    act('word', () => sayWord(it));
    act('write', () => openWritePad(it.word || it.en, it.ar));
    act('master', () => {
      const badges = isLetters
        ? markLetter(it.en.trim().split(/\s+/)[0].toLowerCase(), !isDone(it))
        : markDigraph(findDigraphId(it), !isDone(it));
      if (badges?.length) toast(`🏅 ${badges.map((b) => b.ar).join(' · ')}`, 'ok');
      paint(false);
      paintStrip();
      window.__leaRefreshChrome?.();
    });
    act('details', () => openDetails(it));

    qs('[data-hear]', box)?.addEventListener('click', () => (isLetters ? sayName(it) : sayDigraph(it)));
    box.querySelector('[data-nav2="prev"]')?.addEventListener('click', () => { if (i > 0) { i -= 1; paint(); paintStrip(); } });
    box.querySelector('[data-nav2="next"]')?.addEventListener('click', () => { if (i < items.length - 1) { i += 1; paint(); paintStrip(); } });

    if (speakNow && zeroPrefs().autoSpeak) (isLetters ? sayName(it) : sayDigraph(it));
  };

  /* شريط اختيار الحروف */
  const paintStrip = () => {
    const strip = qs('#zStrip', host);
    if (!strip) return;
    qsa('[data-jump]', strip).forEach((b) => {
      const k = Number(b.dataset.jump);
      b.classList.toggle('is-active', k === i);
      b.classList.toggle('is-done', isDone(items[k]));
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
    });
  };
  qsa('[data-jump]', host).forEach((b) => b.addEventListener('click', () => { i = Number(b.dataset.jump); paint(); paintStrip(); }));

  paint(false);
  paintStrip();
  if (zeroPrefs().autoSpeak) (isLetters ? sayName(items[0]) : sayDigraph(items[0]));

  document.onkeydown = (e) => {
    if (e.key === 'ArrowLeft') { if (i < items.length - 1) { i += 1; paint(); paintStrip(); } }
    else if (e.key === 'ArrowRight') { if (i > 0) { i -= 1; paint(); paintStrip(); } }
  };
}

function findDigraphId(it) {
  const found = zeroSnapshot().digraphList.find((d) => d.combo === it.en);
  return found ? found.id : it.en;
}

/* ============================================================
   ٢) قوائم مختصرة مجمّعة (بمكوّنات الموقع)
   ============================================================ */
function groupsFor(stage, snap) {
  const items = zeroItems(stage.id);
  const pick = (prefix) => items.filter((x) => x.key.startsWith(prefix));
  switch (stage.id) {
    case 'numbers': {
      const nums = pick('num:');
      return [
        { id: 'n0', title: uiText('ui.literal.0cc4f139'), items: nums.filter((x) => Number(x.key.slice(4)) <= 20) },
        { id: 'n100', title: uiText('ui.literal.cb490b4e'), items: nums.filter((x) => Number(x.key.slice(4)) > 20) },
        { id: 'ord', title: uiText('ui.literal.816d3067'), items: pick('ord:') },
      ];
    }
    case 'time':
      return ['day:', 'month:', 'season:', 'time:', 'clock:'].map((p) => ({
        id: p, title: TIME_GROUP_AR[p.replace(':', '')] || p, items: pick(p),
      }));
    case 'pronouns':
      return [
        { id: 'pron', title: uiText('ui.literal.8c8c5a5a'), items: pick('pron:') },
        { id: 'tobe', title: uiText('ui.literal.710572e2'), items: pick('tobe:') },
      ];
    case 'words':
      return snap.wordGroups.map((g) => ({ id: g.id, title: g.titleAr, icon: g.icon, items: items.filter((x) => x.group === g.id) }));
    case 'sentences': {
      const ids = [...new Set(items.map((x) => x.group))];
      return ids.map((id) => ({ id, title: SENT_GROUP_AR[id] || id, items: items.filter((x) => x.group === id) }));
    }
    default:
      return [{ id: 'all', title: uiText('ui.literal.a0fa22e1'), items }];
  }
}

function renderListStage(host, stage) {
  const snap = zeroSnapshot();
  const groups = groupsFor(stage, snap);
  let gi = 0;

  host.innerHTML = `
    ${stageHead(stage)}
    <div class="card mt-4">
      <div class="seg" id="zTabs" role="tablist" aria-label="${uiText('ui.literal.46198642')} "></div>
      <div class="mt-4" id="zList"></div>
    </div>`;
  bindAutoBtn(host);

  const paintTabs = () => {
    const tabs = qs('#zTabs', host);
    if (!tabs) return;
    tabs.innerHTML = groups.map((g, k) => `<button type="button" data-g="${k}" role="tab" aria-selected="${k === gi}" class="${k === gi ? 'is-active' : ''}">
      ${g.icon ? g.icon + ' ' : ''}${esc(g.title)} <span class="muted">(${arNum(g.items.length)})</span></button>`).join('');
    qsa('[data-g]', tabs).forEach((b) => b.addEventListener('click', () => { gi = Number(b.dataset.g); paintTabs(); paintList(); }));
  };

  const paintList = () => {
    const box = qs('#zList', host);
    if (!box) return;
    const g = groups[gi];
    box.innerHTML = `
      <div class="card card--flat" style="padding:0">
        ${g.items.map((it) => {
          const done = stage.id === 'words' ? !!snap.raw.words?.[it.en]
            : stage.id === 'sentences' ? !!snap.raw.sentences?.[it.en]
              : false;
          return `<div class="item-row ${done ? 'is-done' : ''}" data-key="${esc(it.key)}">
            <span class="item-row__en">${esc(it.en)}</span>
            <span class="item-row__ar">${esc(it.ar || '')}${it.pron ? ` <span class="muted">· ${esc(it.pron)}</span>` : ''}${it.extra ? ` <span class="muted">· ${esc(it.extra)}</span>` : ''}</span>
            ${speakBtn(it.say || it.en)}
            <button class="btn btn--ghost btn--sm" type="button" data-tick="${esc(it.key)}" aria-pressed="${done}" title="${done ? uiText('ui.literal.4e284bc3') : uiText('ui.literal.e2ce61a5')}" aria-label="${done ? uiText('ui.literal.4e284bc3') : uiText('ui.literal.e2ce61a5')}">✓</button>
          </div>`;
        }).join('')}
      </div>
      <p class="small muted mt-3">${uiText('ui.literal.492e0782')} </p>`;

    qsa('[data-tick]', box).forEach((b) => b.addEventListener('click', () => {
      const key = b.dataset.tick;
      const it = g.items.find((x) => x.key === key);
      const on = b.getAttribute('aria-pressed') !== 'true';
      let badges = [];
      if (key.startsWith('word:')) badges = markWord(it.en, on);
      else if (key.startsWith('sent:')) badges = markSentence(it.en, on);
      else badges = markWord(key, on);
      if (badges?.length) toast(`🏅 ${badges.map((x) => x.ar).join(' · ')}`, 'ok');
      b.setAttribute('aria-pressed', String(on));
      b.closest('.item-row').classList.toggle('is-done', on);
      window.__leaRefreshChrome?.();
    }));
  };

  paintTabs();
  paintList();
}

/* ============================================================
   ٣) القراءات
   ============================================================ */
function renderReadingStage(host, stage) {
  host.innerHTML = `
    ${stageHead(stage)}
    <div class="stack mt-4">
      ${READINGS.map((r) => {
        const done = progress.zero?.readings?.[r.id]?.done;
        return `<div class="card" data-read="${r.id}">
          <div class="card__title">
            <span class="ico" aria-hidden="true">${r.emoji || '📖'}</span>
            <h3>${esc(r.titleAr)} <span class="muted tiny" dir="ltr">${esc(r.titleEn)}</span></h3>
            ${done ? uiText('ui.literal.ddf28ec5') : ''}
          </div>
          <div class="card card--flat" style="padding:0">
            ${r.lines.map((l) => `<div class="item-row">
              <span class="item-row__en">${esc(l.en)}</span>
              <span class="item-row__ar">${esc(l.ar)} <span class="muted">· ${esc(l.pron)}</span></span>
              ${speakBtn(l.en)}
            </div>`).join('')}
          </div>
          <div class="row row--wrap mt-3" style="gap:8px">
            <button class="btn btn--primary btn--sm" type="button" data-read-quiz="${r.id}">${uiText('ui.literal.8e8c2ec0')} ${arNum(r.questions.length)})</button>
            <button class="btn btn--sm" type="button" data-read-all="${r.id}">🔊 ${uiText('ui.literal.fe964a43')} </button>
          </div>
          <div id="readQuiz-${r.id}"></div>
        </div>`;
      }).join('')}
    </div>`;
  bindAutoBtn(host);

  qsa('[data-read-all]', host).forEach((b) => b.addEventListener('click', () => {
    const r = READINGS.find((x) => x.id === b.dataset.readAll);
    if (!r) return;
    let k = 0;
    const go = () => {
      if (k >= r.lines.length) return;
      const line = r.lines[k];
      k += 1;
      speak(line.en, { onend: () => setTimeout(go, 320) });
      setTimeout(() => { if (k < r.lines.length + 1) go(); }, 2800);
    };
    go();
  }));

  qsa('[data-read-quiz]', host).forEach((b) => b.addEventListener('click', () => {
    const r = READINGS.find((x) => x.id === b.dataset.readQuiz);
    if (!r) return;
    const box = qs(`#readQuiz-${r.id}`, host);
    box.scrollIntoView({ block: 'center' });
    runQuiz(box, {
      title: `${uiText('ui.literal.07a60a68')} ${r.titleAr}`,
      questions: r.questions.map((qq, qi) => ({
        id: `zrq-${r.id}-${qi}`, type: 'mcq', ui: 'choice', itemId: `zero:read:${r.id}:${qi}`,
        level: 'a0', topic: 'reading', topicTitle: r.titleAr,
        instruction: qq.qAr || uiText('ui.literal.f46b950e'),
        stemHtml: `<div class="q-main" dir="ltr">${esc(qq.q)}</div>`,
        speakText: qq.q,
        options: qq.options.map((o, oi) => ({ label: o, correct: oi === qq.answer, ltr: true })),
        answerText: qq.options[qq.answer],
        explain: qq.explain || '',
      })),
      onSummary: (res) => { markReadingDone(r.id, res.correct, res.total); window.__leaRefreshChrome?.(); },
    });
  }));
}

/* ============================================================
   ٤) تدريب المرحلة — ٥ أسئلة
   ============================================================ */
export function renderZeroDrill(host, stageId) {
  const stage = zeroStage(stageId);
  const questions = zeroStageQuestions(stage.id, 5);
  if (!questions.length) {
    host.innerHTML = uiText('ui.literal.e127bb6e');
    return;
  }
  const idx = ZERO_STAGES.findIndex((s) => s.id === stage.id);
  const next = ZERO_STAGES[idx + 1];

  host.innerHTML = `
    ${zeroPageHead({
      icon: '🧪', title: `${uiText('ui.literal.ae9a01ef')} ${stage.titleAr}`,
      subtitle: uiText('ui.literal.816f5754'),
      actionsHtml: `<a class="btn btn--sm" href="#/zero/stage/${stage.id}">← ${esc(stage.titleAr)}</a>`,
    })}
    <div id="zRun" class="mt-4"></div>`;

  runQuiz(qs('#zRun', host), {
    questions,
    allowReveal: true,
    onSummary: (res) => {
      let badges = [];
      for (const a of res.answers) if (a.correct) badges = badges.concat(applyAnswer(a.q.itemId, true));
      const r = recordStageDrill(stage.id, res.accuracy);
      badges = badges.concat(r.badges || []);
      if (r.justCompleted) { confetti(60); toast(`✅ ${uiText('ui.literal.83d2bbf4')} ${stage.titleAr}`, 'ok'); }
      else if (res.accuracy >= 80) toast(uiText('ui.literal.0404a803'), 'ok');
      else toast(`${uiText('ui.literal.385dfad4')} ${res.accuracy}% — ${uiText('ui.literal.33164758')} `, 'warn');
      if (badges.length) toast(`🏅 ${[...new Set(badges.map((b) => b.ar))].join(' · ')}`, 'ok');
      window.__leaRefreshChrome?.();
    },
    extraActionsHtml: `<a class="btn" href="#/zero/stage/${stage.id}">${uiText('ui.literal.c4890b45')} </a>
      ${next ? `<a class="btn btn--primary" href="#/zero/stage/${next.id}">${esc(next.titleAr)} ←</a>` : uiText('ui.literal.c7f1130a')}`,
  });
}
