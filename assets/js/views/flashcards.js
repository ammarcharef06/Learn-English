/* بطاقات الحفظ مع مراجعة متباعدة (SRS) */
import { t } from '../core/i18n.js';
import { esc, qs, toast, confetti } from '../core/utils.js';
import {
  vocabularyEntries,
  curriculumReviewEntries,
  sentenceEntries,
  readingWordEntries,
  pronounEntries,
  connectorEntries,
  questionEntries,
  notebookEntries,
} from '../core/quizgen.js';
import { getItem, gradeItem, stats as srsStats, buildSession, smartReviewPlan, dueEntries } from '../core/srs.js';
import { recordAnswer } from '../core/gamify.js';
import { pageHead, renderSidebarStats } from './shell.js';
import { speak, stopSpeaking } from '../core/speech.js';
import { ALL_UNITS } from '../data/curriculum.js';

const DECKS = [
  { id: 'all', ar: 'كل الكلمات', icon: '🌍' },
  { id: 'due', ar: 'المستحقة اليوم فقط', icon: '⏰' },
  { id: 'notebook', ar: 'دفتر كلماتي', icon: '📒' },
  { id: 'a1', ar: 'مفردات A1', icon: '🌱' },
  { id: 'a2', ar: 'مفردات A2', icon: '🌿' },
  { id: 'b1', ar: 'مفردات B1', icon: '🌳' },
  { id: 'b2', ar: 'مفردات B2', icon: '🌲' },
  { id: 'c1', ar: 'مفردات C1', icon: '📚' },
  { id: 'c2', ar: 'مفردات C2', icon: '🏛️' },
  { id: 'pronouns', ar: 'الضمائر', icon: '🙋' },
  { id: 'connectors', ar: 'أدوات الربط', icon: '🔗' },
  { id: 'questions', ar: 'أدوات السؤال', icon: '❓' },
  { id: 'reading', ar: 'كلمات المطالعات', icon: '📖' },
];

function deckEntries(deck) {
  switch (deck) {
    case 'notebook': return notebookEntries();
    case 'a1': case 'a2': case 'b1': case 'b2': case 'c1': case 'c2':
      return [...vocabularyEntries({ levels: [deck] }), ...sentenceEntries({ levels: [deck] }), ...curriculumReviewEntries({ levels: [deck] })];
    case 'pronouns': return pronounEntries();
    case 'connectors': return connectorEntries();
    case 'questions': return questionEntries();
    case 'reading': return readingWordEntries();
    case 'due': return dueEntries(allEntries());
    case 'all':
    default: return allEntries();
  }
}
function allEntries() {
  return [
    ...vocabularyEntries(),
    ...sentenceEntries(),
    ...curriculumReviewEntries(),
    ...readingWordEntries(),
    ...pronounEntries(),
    ...connectorEntries(),
    ...questionEntries(),
    ...notebookEntries(),
  ];
}

const REVIEW_AXES = [
  { key: 'grammar', labelKey: 'fc.axis.grammar' },
  { key: 'vocabulary', labelKey: 'fc.axis.vocabulary' },
  { key: 'phonetics', labelKey: 'fc.axis.phonetics' },
  { key: 'arabic_l1_transfers', labelKey: 'fc.axis.arabic_l1_transfers' },
  { key: 'academic_focus', labelKey: 'fc.axis.academic_focus' },
];

function detailLines(record, axis) {
  if (typeof record === 'string') return [esc(record)];
  if (!record || typeof record !== 'object') return [];
  const en = record.en || record.term || record.word || record.incorrect || record.pattern || record.original || record.phrase || '';
  const ar = record.ar || record.meaningAr || record.definitionAr || record.corrected || record.explanationAr || record.paraphrase || record.rephrased || record.title || '';
  const parts = [];
  if (en && ar) parts.push(`<span class="en" lang="en" dir="ltr">${esc(en)}</span><span> — ${esc(ar)}</span>`);
  else if (en) parts.push(`<span class="en" lang="en" dir="ltr">${esc(en)}</span>`);
  else if (ar) parts.push(esc(ar));
  if (record.ipa) parts.push(`<span class="en" lang="en" dir="ltr">${esc(record.ipa)}</span>`);
  if (record.explain && axis === 'grammar') parts.push(esc(record.explain));
  if (record.example?.en) parts.push(`<span class="en" lang="en" dir="ltr">${esc(record.example.en)}</span>${record.example.ar ? ` — ${esc(record.example.ar)}` : ''}`);
  if (record.incorrect && record.corrected) parts.push(`<span class="en" lang="en" dir="ltr">${esc(record.incorrect)} → ${esc(record.corrected)}</span>`);
  if (record.note) parts.push(esc(record.note));
  const nestedKeys = axis === 'vocabulary' ? ['collocations', 'phrasalVerbs']
    : axis === 'phonetics' ? ['contrastPairs', 'connectedSpeech', 'intonation']
      : axis === 'arabic_l1_transfers' ? ['practice']
        : axis === 'academic_focus' ? ['paraphrasing', 'idioms', 'readingAnalysis']
          : axis === 'grammar' ? ['examples'] : [];
  for (const key of nestedKeys) {
    for (const nested of (Array.isArray(record[key]) ? record[key] : []).slice(0, 2)) {
      if (typeof nested === 'string') parts.push(esc(nested));
      else {
        const nestedEn = nested.en || nested.term || nested.incorrect || nested.original || nested.pattern || nested.pair || nested.text || nested.fullForm || '';
        const nestedAr = nested.ar || nested.meaningAr || nested.corrected || nested.explanationAr || nested.rephrased || nested.paraphrase || nested.tip || nested.reduced || '';
        if (nestedEn) parts.push(`<span class="en" lang="en" dir="ltr">${esc(nestedEn)}</span>${nestedAr ? ` — ${esc(nestedAr)}` : ''}`);
        if (nested.ipa) parts.push(`<span class="en" lang="en" dir="ltr">${esc(nested.ipa)}</span>`);
        if (nested.explain) parts.push(esc(nested.explain));
        if (!nestedEn && !nestedAr && !nested.ipa && !nested.explain) {
          parts.push(esc(Object.values(nested).filter((value) => typeof value === 'string').join(' — ')));
        }
      }
    }
  }
  return parts;
}

function axisRecords(unit, axis) {
  const value = unit?.[axis.key];
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

function renderDepthDetails(entry) {
  const unit = ALL_UNITS.find((candidate) => candidate.id === entry.unitId);
  const groups = REVIEW_AXES.map((axis) => {
    const lines = axisRecords(unit, axis).flatMap((record) => detailLines(record, axis.key)).slice(0, 4);
    if (!lines.length && axis.key === 'phonetics' && entry.ipa) {
      lines.push(`<span class="en" lang="en" dir="ltr">${esc(entry.en)} · ${esc(entry.ipa)}</span>`);
    }
    if (!lines.length && axis.key === entry.kind) {
      lines.push(esc(entry.note || entry.ar));
    }
    if (!lines.length) lines.push(esc(t('fc.noAxisDetail')));
    return `<section class="fc-depth__group"><h3>${esc(t(axis.labelKey))}</h3>${lines.map((line) => `<p class="fc-depth__item">${line}</p>`).join('')}</section>`;
  });
  return groups.join('');
}

export function renderFlashcards(host) {
  const state = { deck: 'all', size: 15, session: [], mode: 'deck', index: 0, flipped: false, sheetOpen: false, result: { again: 0, hard: 0, good: 0, easy: 0 }, startAt: Date.now() };

  function setup() {
    document.body.classList.remove('fc-focus-mode');
    document.onkeydown = null;
    stopSpeaking();
    state.session = [];
    const entries = deckEntries(state.deck);
    const st = srsStats(entries);
    const dueSession = buildSession(entries, state.size);
    const smartPlan = smartReviewPlan(entries, state.size);
    host.innerHTML = `
      ${pageHead({ icon: '🃏', title: t('fc.title'), subtitle: t('fc.subtitle') })}
      <section class="card smart-review" aria-labelledby="smartReviewTitle">
        <div class="card__title"><span class="ico" aria-hidden="true">🧠</span><h2 id="smartReviewTitle">${t('fc.smartTitle')}</h2></div>
        <p>${t('fc.smartDesc')}</p>
        <p class="small muted" role="status">${t('fc.smartSummary')} · ${smartPlan.dueCount} ${t('fc.due')}, ${smartPlan.weakCount} ${t('common.weak')}, ${smartPlan.newCount} ${t('fc.smartNew')}</p>
        <button class="btn btn--primary" type="button" id="fcSmart" ${smartPlan.entries.length ? '' : 'disabled'}>${t('fc.smartStart')} · ${smartPlan.entries.length}</button>
      </section>
      <div class="grid grid--4">
        <div class="stat"><div class="stat__label">${t('fc.due')}</div><div class="stat__value">${st.due}</div><div class="stat__foot">${st.total} ${t('common.cards')}</div></div>
        <div class="stat"><div class="stat__label">جديدة</div><div class="stat__value">${st.new}</div><div class="stat__foot">لم تُراجع بعد</div></div>
        <div class="stat"><div class="stat__label">قيد التعلّم</div><div class="stat__value">${st.learning}</div><div class="stat__foot">أقل من ٣ تكرارات و٢١ يوماً</div></div>
        <div class="stat stat--ok"><div class="stat__label">متقنة</div><div class="stat__value">${st.mature}</div><div class="stat__foot">٣ تكرارات وفاصل ٢١ يوماً فأكثر</div></div>
      </div>

      <div class="card" style="margin-top:18px">
        <div class="card__title"><span class="ico">🗂️</span><h3>${t('fc.deck')}</h3></div>
        <div class="row row--wrap" style="gap:8px">
          ${DECKS.map((d) => `<button class="btn btn--sm ${d.id === state.deck ? 'btn--primary' : ''}" type="button" data-deck="${d.id}" aria-pressed="${d.id === state.deck}">${esc(d.ar)}</button>`).join('')}
        </div>
        <div class="grid grid--2" style="margin-top:16px">
          <div class="field">
            <label for="fcSize">${t('drills.count')}</label>
            <select class="select" id="fcSize">
              ${[10, 15, 20, 30, 50].map((n) => `<option value="${n}" ${n === state.size ? 'selected' : ''}>${n}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>${t('fc.remaining')}</label>
            <div class="row" style="gap:8px">
              <button class="btn btn--primary" type="button" id="fcStart" ${dueSession.length ? '' : 'disabled'}>▶ ${t('common.start')}</button>
              <span class="chip chip--brand">${dueSession.length} ${t('common.cards')}</span>
            </div>
          </div>
        </div>
        ${dueSession.length ? '' : '<div class="tip-box">لا توجد بطاقات في هذه المجموعة — جرّب مجموعة أخرى.</div>'}
      </div>`;

    host.querySelectorAll('[data-deck]').forEach((b) => b.addEventListener('click', () => { state.deck = b.dataset.deck; setup(); }));
    qs('#fcSmart', host)?.addEventListener('click', () => startSession(smartPlan.entries, 'smart'));
    qs('#fcSize', host)?.addEventListener('change', (e) => { state.size = Number(e.target.value); setup(); });
    qs('#fcStart', host)?.addEventListener('click', () => startSession(dueSession, 'deck'));
  }

  function startSession(entries, mode = 'deck') {
    stopSpeaking();
    state.session = entries.slice();
    state.mode = mode;
    state.index = 0;
    state.flipped = false;
    state.result = { again: 0, hard: 0, good: 0, easy: 0 };
    state.startAt = Date.now();
    renderCard();
  }

  function renderCard() {
    if (state.index >= state.session.length) return renderEnd();
    document.body.classList.add('fc-focus-mode');
    state.sheetOpen = false;
    const e = state.session[state.index];
    const it = getItem(e.itemId);
    const interval = it ? it.interval : 0;
    const easeFactor = it ? it.easeFactor : 2.5;
    const total = state.session.length;
    const depthDetails = renderDepthDetails(e);
    const speakControl = (text, audioUrl, label = t('common.listen')) => text
      ? `<button class="btn fc__speak" type="button" data-speak-text="${esc(text)}" data-audio-url="${esc(audioUrl || '')}" aria-label="${esc(label)}" aria-pressed="false"><svg class="fc__speak-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 10v4h4l5 4V6l-5 4H4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 9a5 5 0 0 1 0 6m2.5-8.5a8.5 8.5 0 0 1 0 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>${esc(label)}</span></button>`
      : '';

    host.innerHTML = `
      <section class="fc-focus" aria-label="${esc(t('fc.title'))}">
        <header class="fc-focus__top">
          <button class="fc-focus__close" type="button" id="fcQuit" aria-label="${esc(t('common.close'))}">×</button>
          <div class="fc-focus__progress" aria-label="${state.index + 1} / ${total}">
            <span>${state.index + 1}<i>/</i>${total}</span>
            <div class="progress"><i style="width:${Math.round(((state.index + 1) / total) * 100)}%"></i></div>
          </div>
          <span class="fc-focus__interval">${interval}d · EF ${easeFactor.toFixed(2)}</span>
        </header>

        <div class="fc-stage">
          <div class="fc ${state.flipped ? 'is-flipped' : ''}" id="fcCard">
            <div class="fc__face fc__face--front" id="fcFront" aria-hidden="false">
              <span class="fc__word" lang="en" dir="ltr">${esc(e.en)}</span>
              <div class="fc-front-actions">${speakControl(e.en, e.audioUrl)}</div>
              <button class="fc-flip-prompt" type="button" id="fcFlipFront" aria-controls="fcCard" aria-expanded="false">${esc(t('fc.flip'))}<span aria-hidden="true">↗</span></button>
            </div>
            <div class="fc__face fc__face--back" id="fcBack" aria-hidden="true" inert>
              <div class="fc__answer">
                <span class="fc__word fc__word--ar">${esc(e.ar)}</span>
                ${e.ex ? `<div class="fc__example"><span class="fc__ex en" lang="en" dir="ltr">${esc(e.ex.en)}</span>${e.ex.ar ? `<span class="fc__ex">${esc(e.ex.ar)}</span>` : ''}${speakControl(e.ex.en, e.ex.audio_url || '', t('fc.exampleAudio'))}</div>` : ''}
              </div>
              ${depthDetails ? `<button class="fc-depth-trigger" type="button" data-depth-open aria-expanded="false" aria-controls="fcDepthSheet"><span class="fc-sheet-grip" aria-hidden="true"></span><span>${esc(t('fc.deepDetails'))}</span><span aria-hidden="true">⌃</span></button>` : ''}
              <div class="fc-actions" aria-hidden="false">
                <button class="btn fc-grade fc-grade--again" type="button" data-grade="0">${t('fc.again')} <span class="kbd">1</span></button>
                <button class="btn fc-grade fc-grade--hard" type="button" data-grade="1">${t('fc.hard')} <span class="kbd">2</span></button>
                <button class="btn fc-grade fc-grade--good" type="button" data-grade="2">${t('fc.good')} <span class="kbd">3</span></button>
                <button class="btn fc-grade fc-grade--easy" type="button" data-grade="3">${t('fc.easy')} <span class="kbd">4</span></button>
              </div>
              <button class="fc-flip-again" type="button" id="fcFlipBack" aria-controls="fcCard" aria-expanded="true">${esc(t('fc.hideAnswer'))}</button>
            </div>
          </div>
        </div>
        <p class="fc-focus__status" id="fcFlipStatus" role="status" aria-live="polite">${t('fc.flipBeforeGrade')}</p>
      </section>

      ${depthDetails ? `
        <div class="fc-sheet-layer" id="fcDepthSheet" hidden inert>
          <button class="fc-sheet-backdrop" type="button" data-sheet-close aria-label="${esc(t('common.close'))}"></button>
          <section class="fc-sheet" role="dialog" aria-modal="true" aria-labelledby="fcSheetTitle" tabindex="-1">
            <button class="fc-sheet__handle" type="button" data-sheet-handle aria-label="${esc(t('fc.closeDetails'))}">
              <span class="fc-sheet-grip" aria-hidden="true"></span>
            </button>
            <header class="fc-sheet__header">
              <div><span class="dashboard-label">${esc(e.topicTitle || '')}</span><h2 id="fcSheetTitle">${esc(t('fc.deepDetails'))}</h2></div>
              <button class="fc-sheet__close" type="button" data-sheet-close aria-label="${esc(t('common.close'))}">×</button>
            </header>
            <div class="fc-depth__panel">${depthDetails}</div>
          </section>
        </div>` : ''}`;

    const card = qs('#fcCard', host);
    const flipButtons = [...host.querySelectorAll('#fcFlipFront, #fcFlipBack')];
    const sheetLayer = qs('#fcDepthSheet', host);
    const sheet = qs('.fc-sheet', host);
    const sheetOpener = qs('[data-depth-open]', host);
    let touchStartY = null;
    const closeSheet = (restoreFocus = true) => {
      if (!sheetLayer || sheetLayer.hidden) return;
      sheetLayer.hidden = true;
      sheetLayer.inert = true;
      state.sheetOpen = false;
      sheetOpener?.setAttribute('aria-expanded', 'false');
      if (restoreFocus && sheetOpener?.isConnected) sheetOpener.focus();
    };
    const openSheet = () => {
      if (!sheetLayer || !state.flipped) return;
      sheetLayer.hidden = false;
      sheetLayer.inert = false;
      state.sheetOpen = true;
      sheetOpener?.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => qs('.fc-sheet__close', sheetLayer)?.focus());
    };
    const flip = () => {
      if (state.sheetOpen) closeSheet(false);
      state.flipped = !state.flipped;
      card.classList.toggle('is-flipped', state.flipped);
      const front = qs('#fcFront', host);
      const back = qs('#fcBack', host);
      front.setAttribute('aria-hidden', String(state.flipped));
      front.toggleAttribute('inert', state.flipped);
      back.setAttribute('aria-hidden', String(!state.flipped));
      back.toggleAttribute('inert', !state.flipped);
      flipButtons.forEach((button) => button.setAttribute('aria-expanded', String(state.flipped)));
      host.querySelectorAll('[data-grade]').forEach((b) => { b.disabled = !state.flipped; });
      sheetOpener?.setAttribute('aria-expanded', 'false');
      requestAnimationFrame(() => qs(state.flipped ? '#fcFlipBack' : '#fcFlipFront', host)?.focus());
      const status = qs('#fcFlipStatus', host);
      if (status) status.textContent = state.flipped ? t('fc.answerRevealed') : t('fc.flipBeforeGrade');
    };
    flipButtons.forEach((button) => button.addEventListener('click', flip));
    sheetOpener?.addEventListener('click', openSheet);
    host.querySelectorAll('[data-sheet-close]').forEach((button) => button.addEventListener('click', () => closeSheet()));
    const bindSwipeUp = (element, onSwipe) => {
      element?.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') touchStartY = event.clientY;
      }, { passive: true });
      element?.addEventListener('pointerup', (event) => {
        if (touchStartY !== null && touchStartY - event.clientY > 48) onSwipe();
        touchStartY = null;
      }, { passive: true });
      element?.addEventListener('pointercancel', () => { touchStartY = null; }, { passive: true });
    };
    bindSwipeUp(sheetOpener, openSheet);
    bindSwipeUp(qs('#fcBack', host), openSheet);
    bindSwipeUp(qs('[data-sheet-handle]', host), () => closeSheet());
    sheet?.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...sheet.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    host.querySelectorAll('[data-speak-text]').forEach((button) => button.addEventListener('click', (event) => {
      event.stopPropagation();
      speak(button.dataset.speakText, {
        audioUrl: button.dataset.audioUrl || undefined,
        onstart: () => {
          button.classList.add('is-playing');
          button.setAttribute('aria-pressed', 'true');
        },
        onend: () => {
          button.classList.remove('is-playing');
          button.setAttribute('aria-pressed', 'false');
        },
      });
    }));
    if (!state.flipped) { /* لا ننطق تلقائياً لتجنب الإزعاج */ }

    host.querySelectorAll('[data-grade]').forEach((b) => b.addEventListener('click', () => grade(Number(b.dataset.grade))));
    qs('#fcQuit', host)?.addEventListener('click', () => setup());
    document.onkeydown = (ev) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (state.sheetOpen) {
        if (ev.key === 'Escape') closeSheet();
        return;
      }
      if (['1', '2', '3', '4'].includes(ev.key) && state.flipped) grade(Number(ev.key) - 1);
    };
  }

  function grade(q) {
    const e = state.session[state.index];
    if (!e) return;
    stopSpeaking();
    gradeItem(e.itemId, [0, 3, 4, 5][q]);
    const res = recordAnswer({ correct: q > 0, itemId: e.itemId, type: 'flash', topic: e.topic, level: e.level, seconds: (Date.now() - state.startAt) / 1000 });
    if (q === 0) state.result.again++;
    else if (q === 1) state.result.hard++;
    else if (q === 2) state.result.good++;
    else state.result.easy++;
    if (res.badges?.length) confetti(50);
    state.index += 1;
    state.flipped = false;
    renderSidebarStats();
    renderCard();
  }

  function renderEnd() {
    document.body.classList.remove('fc-focus-mode');
    document.onkeydown = null;
    const total = state.session.length;
    const remembered = state.result.good + state.result.easy;
    host.innerHTML = `
      ${pageHead({ icon: '🎉', title: t('fc.finished'), subtitle: `${total} ${t('common.word')} · ${Math.round((remembered / Math.max(1, total)) * 100)}% حفظ جيد` })}
      <div class="grid grid--4">
        <div class="stat stat--bad"><div class="stat__label">لم أتذكر</div><div class="stat__value">${state.result.again}</div></div>
        <div class="stat"><div class="stat__label">صعب</div><div class="stat__value">${state.result.hard}</div></div>
        <div class="stat stat--ok"><div class="stat__label">جيد</div><div class="stat__value">${state.result.good}</div></div>
        <div class="stat stat--brand"><div class="stat__label">سهل</div><div class="stat__value">${state.result.easy}</div></div>
      </div>
      <div class="card" style="margin-top:18px">
        <p class="muted">تُجدول البطاقات تلقائياً للرجوع إليها: التي لم تتذكرها تعود قريباً، والتي أتقنتها تعود بعد أسابيع.</p>
        <div class="row row--wrap" style="gap:8px">
          <button class="btn btn--primary" type="button" id="fcAgain">${t('common.retry')}</button>
          <button class="btn" type="button" id="fcSetup">${t('fc.deck')}</button>
          <a class="btn" href="#/drills">${t('nav.drills')}</a>
        </div>
      </div>`;
    confetti(total >= 5 ? 80 : 30);
    qs('#fcAgain', host)?.addEventListener('click', () => {
      const entries = deckEntries(state.deck);
      startSession(state.mode === 'smart' ? smartReviewPlan(entries, state.size).entries : buildSession(entries, state.size), state.mode);
    });
    qs('#fcSetup', host)?.addEventListener('click', setup);
  }

  setup();
}
