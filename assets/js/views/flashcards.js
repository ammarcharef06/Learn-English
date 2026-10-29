/* Spaced-repetition flashcard review. */
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
import { gradeItem, stats as srsStats, buildSession, smartReviewPlan, dueEntries } from '../core/srs.js';
import { recordAnswer } from '../core/gamify.js';
import { renderSidebarStats } from './shell.js';
import { speak, stopSpeaking } from '../core/speech.js';
import { ALL_UNITS, LEVELS, activeCurriculum } from '../data/curriculum.js';
import { settings, saveSettings } from '../core/store.js';

const DEFAULT_DECKS = [
  { id: 'all', labelKey: 'fc.deck.all', icon: '🌍' },
  { id: 'due', labelKey: 'fc.deck.due', icon: '⏰' },
  { id: 'notebook', labelKey: 'fc.deck.notebook', icon: '📒' },
  { id: 'a1', labelKey: 'fc.deck.a1', icon: '🌱' },
  { id: 'a2', labelKey: 'fc.deck.a2', icon: '🌿' },
  { id: 'b1', labelKey: 'fc.deck.b1', icon: '🌳' },
  { id: 'b2', labelKey: 'fc.deck.b2', icon: '🌲' },
  { id: 'c1', labelKey: 'fc.deck.c1', icon: '📚' },
  { id: 'c2', labelKey: 'fc.deck.c2', icon: '🏛️' },
  { id: 'pronouns', labelKey: 'fc.deck.pronouns', icon: '🙋' },
  { id: 'connectors', labelKey: 'fc.deck.connectors', icon: '🔗' },
  { id: 'questions', labelKey: 'fc.deck.questions', icon: '❓' },
  { id: 'reading', labelKey: 'fc.deck.reading', icon: '📖' },
];

function decksForCurriculum() {
  return activeCurriculum === 'esh'
    ? [
    { id: 'all', labelKey: 'fc.deck.all', icon: '🌍' },
    { id: 'due', labelKey: 'fc.deck.due', icon: '⏰' },
    { id: 'notebook', labelKey: 'fc.deck.notebook', icon: '📒' },
    ...LEVELS.map((level) => ({ id: level.id, label: level.label, labelKey: '', icon: level.icon })),
    ]
    : DEFAULT_DECKS;
}

function deckEntries(deck) {
  if (activeCurriculum === 'esh' && LEVELS.some((level) => level.id === deck)) {
    return [...vocabularyEntries({ levels: [deck] }), ...sentenceEntries({ levels: [deck] }), ...curriculumReviewEntries({ levels: [deck] })];
  }
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
  if (activeCurriculum === 'esh') {
    return [
      ...vocabularyEntries(),
      ...sentenceEntries(),
      ...curriculumReviewEntries(),
      ...notebookEntries(),
    ];
  }
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
  const decks = decksForCurriculum();
  const reviewSize = [10, 15, 20, 30, 50].includes(Number(settings.reviewSize)) ? Number(settings.reviewSize) : 15;
  const state = { deck: 'all', size: reviewSize, session: [], mode: 'smart', index: 0, flipped: false, sheetOpen: false, transitioning: false, advanceTimer: null, result: { again: 0, hard: 0, good: 0, easy: 0 }, startAt: Date.now() };

  function setup() {
    document.body.classList.add('fc-focus-mode');
    document.onkeydown = null;
    clearTimeout(state.advanceTimer);
    state.advanceTimer = null;
    state.transitioning = false;
    stopSpeaking();
    state.session = [];
    const entries = deckEntries(state.deck);
    const st = srsStats(entries);
    const dueSession = buildSession(entries, state.size);
    const smartPlan = smartReviewPlan(entries, state.size);
    const suggestedSession = state.deck === 'all' ? smartPlan.entries : dueSession;
    const startMode = state.deck === 'all' ? 'smart' : 'deck';
    const selectedDeck = decks.find((deck) => deck.id === state.deck);
    const deckLabel = selectedDeck?.label || t(selectedDeck?.labelKey || 'fc.deck.all');
    host.innerHTML = `
      <section class="fc-entry" aria-labelledby="fcEntryTitle">
        <button class="fc-entry__close" type="button" id="fcEntryClose" aria-label="${esc(t('common.close'))}">×</button>
        <div class="fc-entry__intro">
          <span class="fc-entry__eyebrow">${esc(t('fc.title'))}</span>
          <h1 id="fcEntryTitle">${esc(t('fc.ready'))}</h1>
          <p>${esc(t('fc.readyHint'))}</p>
        </div>
        <div class="fc-entry__count" aria-live="polite">
          <strong>${suggestedSession.length}</strong>
          <span>${esc(t('common.cards'))} ${esc(deckLabel)}</span>
        </div>
        <button class="fc-entry__start" type="button" id="fcStart" ${suggestedSession.length ? '' : 'disabled'}>
          <span>${esc(t('fc.startNow'))}</span><span aria-hidden="true">↗</span>
        </button>
        ${suggestedSession.length ? '' : `<p class="fc-entry__empty">${esc(t('fc.noCards'))}</p>`}
        <details class="fc-entry__options">
          <summary>${esc(t('fc.customize'))}</summary>
          <div class="fc-entry__options-content">
            <label for="fcDeck">${esc(t('fc.deck'))}</label>
            <select class="select" id="fcDeck">
              ${decks.map((deck) => `<option value="${deck.id}" ${deck.id === state.deck ? 'selected' : ''}>${esc(deck.label || t(deck.labelKey))}</option>`).join('')}
            </select>
            <label for="fcSize">${esc(t('drills.count'))}</label>
            <select class="select" id="fcSize">
              ${[10, 15, 20, 30, 50].map((n) => `<option value="${n}" ${n === state.size ? 'selected' : ''}>${n}</option>`).join('')}
            </select>
            <p class="fc-entry__stats">${st.due} ${esc(t('fc.due'))} · ${st.new} ${esc(t('fc.newCards'))}</p>
          </div>
        </details>
      </section>`;

    qs('#fcEntryClose', host)?.addEventListener('click', () => { location.hash = '#/'; });
    qs('#fcStart', host)?.addEventListener('click', () => startSession(suggestedSession, startMode));
    qs('#fcDeck', host)?.addEventListener('change', (event) => { state.deck = event.target.value; setup(); });
    qs('#fcSize', host)?.addEventListener('change', (e) => {
      state.size = Number(e.target.value);
      saveSettings({ reviewSize: state.size });
      setup();
    });
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
    state.transitioning = false;
    const e = state.session[state.index];
    const total = state.session.length;
    const speakControl = (text, audioUrl, label = t('common.listen')) => text
      ? `<button class="btn fc__speak" type="button" data-speak-text="${esc(text)}" data-audio-url="${esc(audioUrl || '')}" aria-label="${esc(label)}" aria-pressed="false"><svg class="fc__speak-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 10v4h4l5 4V6l-5 4H4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 9a5 5 0 0 1 0 6m2.5-8.5a8.5 8.5 0 0 1 0 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span class="sr-only">${esc(label)}</span></button>`
      : '';
    const exampleDetails = e.ex ? `<section class="fc-depth__group">
      <h3>${esc(t('fc.example'))}</h3>
      <p class="fc-depth__item"><span class="en" lang="en" dir="ltr">${esc(e.ex.en)}</span></p>
      ${e.ex.ar ? `<p class="fc-depth__item">${esc(e.ex.ar)}</p>` : ''}
      ${speakControl(e.ex.en, e.ex.audio_url || '', t('fc.exampleAudio'))}
    </section>` : '';
    const depthDetails = `${renderDepthDetails(e)}${exampleDetails}`;

    host.innerHTML = `
      <section class="fc-focus" aria-label="${esc(t('fc.title'))}">
        <header class="fc-focus__top">
          <button class="fc-focus__close" type="button" id="fcQuit" aria-label="${esc(t('common.close'))}">×</button>
          <div class="fc-focus__progress" role="progressbar" aria-label="${esc(t('fc.cardOf', { current: state.index + 1, total }))}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${state.index + 1}">
            <div class="progress"><i style="width:${Math.round(((state.index + 1) / total) * 100)}%"></i></div>
          </div>
        </header>

        <div class="fc-stage">
          <div class="fc ${state.flipped ? 'is-flipped' : ''}" id="fcCard">
            <div class="fc__face fc__face--front" id="fcFront" aria-hidden="false">
              <span class="fc__word" lang="en" dir="ltr">${esc(e.en)}</span>
              <div class="fc-front-actions">${speakControl(e.en, e.audioUrl)}</div>
            </div>
            <div class="fc__face fc__face--back" id="fcBack" aria-hidden="true" inert>
              <div class="fc__answer">
                <span class="fc__word fc__word--ar">${esc(e.ar)}</span>
              </div>
            </div>
          </div>
        </div>
        <footer class="fc-focus__actions">
          <button class="fc-flip-prompt" type="button" id="fcFlip" aria-controls="fcCard" aria-expanded="false">${esc(t('fc.flip'))}<span aria-hidden="true">↗</span></button>
          <div class="fc-actions" id="fcGradeActions" ${state.flipped ? '' : 'hidden'}>
            <button class="btn fc-grade fc-grade--hard" type="button" data-grade="1" aria-label="${esc(t('fc.hard'))}">${esc(t('fc.hard'))}<span class="kbd">1</span></button>
            <button class="btn fc-grade fc-grade--good" type="button" data-grade="2" aria-label="${esc(t('fc.good'))}">${esc(t('fc.good'))}<span class="kbd">2</span></button>
            <button class="btn fc-grade fc-grade--easy" type="button" data-grade="3" aria-label="${esc(t('fc.easy'))}">${esc(t('fc.easy'))}<span class="kbd">3</span></button>
          </div>
          ${depthDetails ? `<button class="fc-depth-trigger" type="button" data-depth-open aria-expanded="false" aria-controls="fcDepthSheet"><span class="fc-sheet-grip" aria-hidden="true"></span><span>${esc(t('fc.deepDetails'))}</span><span aria-hidden="true">⌃</span></button>` : ''}
          <p class="fc-focus__status sr-only" id="fcFlipStatus" role="status" aria-live="polite">${t('fc.flipBeforeGrade')}</p>
        </footer>
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
    const flipButton = qs('#fcFlip', host);
    const gradeActions = qs('#fcGradeActions', host);
    const sheetLayer = qs('#fcDepthSheet', host);
    const sheet = qs('.fc-sheet', host);
    const sheetOpener = qs('[data-depth-open]', host);
    let pointerStart = null;
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
      if (state.transitioning) return;
      if (state.sheetOpen) closeSheet(false);
      state.flipped = !state.flipped;
      card.classList.toggle('is-flipped', state.flipped);
      const front = qs('#fcFront', host);
      const back = qs('#fcBack', host);
      front.setAttribute('aria-hidden', String(state.flipped));
      front.toggleAttribute('inert', state.flipped);
      back.setAttribute('aria-hidden', String(!state.flipped));
      back.toggleAttribute('inert', !state.flipped);
      gradeActions.hidden = !state.flipped;
      flipButton.hidden = state.flipped;
      flipButton.setAttribute('aria-expanded', String(state.flipped));
      if (sheetOpener) sheetOpener.hidden = !state.flipped;
      requestAnimationFrame(() => (state.flipped ? qs('[data-grade]', host) : flipButton)?.focus());
      const status = qs('#fcFlipStatus', host);
      if (status) status.textContent = state.flipped ? t('fc.answerRevealed') : t('fc.flipBeforeGrade');
    };
    flipButton.addEventListener('click', flip);
    sheetOpener?.addEventListener('click', openSheet);
    host.querySelectorAll('[data-sheet-close]').forEach((button) => button.addEventListener('click', () => closeSheet()));
    const bindVerticalSwipe = (element, onSwipeUp, onSwipeDown = null) => {
      element?.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') pointerStart = { x: event.clientX, y: event.clientY };
      }, { passive: true });
      element?.addEventListener('pointerup', (event) => {
        if (!pointerStart) return;
        const deltaY = pointerStart.y - event.clientY;
        const deltaX = Math.abs(pointerStart.x - event.clientX);
        if (deltaX < Math.abs(deltaY) && deltaY > 52) onSwipeUp?.();
        else if (deltaX < Math.abs(deltaY) && deltaY < -52) onSwipeDown?.();
        pointerStart = null;
      }, { passive: true });
      element?.addEventListener('pointercancel', () => { pointerStart = null; }, { passive: true });
    };
    bindVerticalSwipe(sheetOpener, openSheet);
    bindVerticalSwipe(qs('#fcBack', host), openSheet);
    bindVerticalSwipe(qs('[data-sheet-handle]', host), () => {}, () => closeSheet());
    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch' || event.target.closest('button')) return;
      pointerStart = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    card.addEventListener('pointerup', (event) => {
      if (!pointerStart || event.target.closest('button')) return;
      const start = pointerStart;
      pointerStart = null;
      if (state.flipped) return;
      const deltaX = start.x - event.clientX;
      const deltaY = Math.abs(start.y - event.clientY);
      if (Math.abs(deltaX) > 64 && Math.abs(deltaX) > deltaY * 1.25) flip();
    }, { passive: true });
    card.addEventListener('pointercancel', () => { pointerStart = null; }, { passive: true });
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
    host.querySelectorAll('[data-grade]').forEach((button) => button.addEventListener('click', () => {
      const quality = Number(button.dataset.grade);
      if (state.transitioning) return;
      state.transitioning = true;
      button.classList.add('is-pressed');
      card.classList.add(quality === 1 ? 'is-swipe-left' : quality === 3 ? 'is-swipe-right' : 'is-swipe-up');
      state.advanceTimer = setTimeout(() => grade(quality), 190);
    }));
    qs('#fcQuit', host)?.addEventListener('click', () => setup());
    document.onkeydown = (ev) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (state.sheetOpen) {
        if (ev.key === 'Escape') closeSheet();
        return;
      }
      if (ev.key === 'Escape') { setup(); return; }
      if (ev.key === 'Enter' && !state.flipped) { flip(); return; }
      if (['1', '2', '3'].includes(ev.key) && state.flipped) {
        const button = qs(`[data-grade="${ev.key}"]`, host);
        button?.click();
      }
    };
  }

  function grade(q) {
    clearTimeout(state.advanceTimer);
    state.advanceTimer = null;
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
    state.transitioning = false;
    const total = state.session.length;
    const remembered = state.result.good + state.result.easy;
    host.innerHTML = `
      <section class="fc-results" aria-labelledby="fcResultTitle">
        <span class="fc-entry__eyebrow">${esc(t('fc.finished'))}</span>
        <h1 id="fcResultTitle">${Math.round((remembered / Math.max(1, total)) * 100)}%</h1>
        <p>${total} ${esc(t('common.cards'))} · ${state.result.hard} ${esc(t('fc.hard'))} · ${state.result.good} ${esc(t('fc.good'))} · ${state.result.easy} ${esc(t('fc.easy'))}</p>
        <button class="fc-entry__start" type="button" id="fcAgain">${esc(t('common.retry'))}<span aria-hidden="true">↗</span></button>
        <button class="fc-results__secondary" type="button" id="fcSetup">${esc(t('fc.customize'))}</button>
      </section>`;
    confetti(total >= 5 ? 80 : 30);
    qs('#fcAgain', host)?.addEventListener('click', () => {
      const entries = deckEntries(state.deck);
      startSession(state.mode === 'smart' ? smartReviewPlan(entries, state.size).entries : buildSession(entries, state.size), state.mode);
    });
    qs('#fcSetup', host)?.addEventListener('click', setup);
  }

  setup();
}
