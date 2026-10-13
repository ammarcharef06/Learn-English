/* بطاقات الحفظ مع مراجعة متباعدة (SRS) */
import { t } from '../core/i18n.js';
import { esc, speakBtn, qs, toast, confetti } from '../core/utils.js';
import { progress } from '../core/store.js';
import { vocabularyEntries, readingWordEntries, pronounEntries, connectorEntries, questionEntries, notebookEntries } from '../core/quizgen.js';
import { gradeItem, stats as srsStats, buildSession } from '../core/srs.js';
import { recordAnswer } from '../core/gamify.js';
import { pageHead, progressBar, renderSidebarStats } from './shell.js';
import { speak } from '../core/speech.js';

const DECKS = [
  { id: 'all', ar: 'كل الكلمات', icon: '🌍' },
  { id: 'due', ar: 'المستحقة اليوم فقط', icon: '⏰' },
  { id: 'notebook', ar: 'دفتر كلماتي', icon: '📒' },
  { id: 'a1', ar: 'مفردات A1', icon: '🌱' },
  { id: 'a2', ar: 'مفردات A2', icon: '🌿' },
  { id: 'b1', ar: 'مفردات B1', icon: '🌳' },
  { id: 'pronouns', ar: 'الضمائر', icon: '🙋' },
  { id: 'connectors', ar: 'أدوات الربط', icon: '🔗' },
  { id: 'questions', ar: 'أدوات السؤال', icon: '❓' },
  { id: 'reading', ar: 'كلمات المطالعات', icon: '📖' },
];

function deckEntries(deck) {
  switch (deck) {
    case 'notebook': return notebookEntries();
    case 'a1': case 'a2': case 'b1': return vocabularyEntries({ levels: [deck] });
    case 'pronouns': return pronounEntries();
    case 'connectors': return connectorEntries();
    case 'questions': return questionEntries();
    case 'reading': return readingWordEntries();
    case 'due': return buildSession(allEntries(), 60);
    case 'all':
    default: return allEntries();
  }
}
function allEntries() {
  return [...vocabularyEntries(), ...readingWordEntries(), ...pronounEntries(), ...connectorEntries(), ...questionEntries(), ...notebookEntries()];
}

export function renderFlashcards(host) {
  const state = { deck: 'all', size: 15, session: [], index: 0, flipped: false, result: { again: 0, hard: 0, good: 0, easy: 0 }, startAt: Date.now() };

  function setup() {
    state.session = [];
    const entries = deckEntries(state.deck);
    const st = srsStats(entries);
    const dueSession = buildSession(entries, state.size);
    host.innerHTML = `
      ${pageHead({ icon: '🃏', title: t('fc.title'), subtitle: t('fc.subtitle') })}
      <div class="grid grid--4">
        <div class="stat"><div class="stat__label">${t('fc.due')}</div><div class="stat__value">${st.due}</div><div class="stat__foot">${st.total} ${t('common.words')}</div></div>
        <div class="stat"><div class="stat__label">جديدة</div><div class="stat__value">${st.new}</div><div class="stat__foot">لم تُراجع بعد</div></div>
        <div class="stat"><div class="stat__label">قيد التعلّم</div><div class="stat__value">${st.learning}</div><div class="stat__foot">صندوق أقل من ٥</div></div>
        <div class="stat stat--ok"><div class="stat__label">متقنة</div><div class="stat__value">${st.mature}</div><div class="stat__foot">صندوق ٥+</div></div>
      </div>

      <div class="card" style="margin-top:18px">
        <div class="card__title"><span class="ico">🗂️</span><h3>${t('fc.deck')}</h3></div>
        <div class="row row--wrap" style="gap:8px">
          ${DECKS.map((d) => `<button class="btn btn--sm ${d.id === state.deck ? 'btn--primary' : ''}" type="button" data-deck="${d.id}">${d.icon} ${esc(d.ar)}</button>`).join('')}
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
              <span class="chip chip--brand">${dueSession.length} ${t('common.word')}</span>
            </div>
          </div>
        </div>
        ${dueSession.length ? '' : '<div class="tip-box">لا توجد بطاقات في هذه المجموعة — جرّب مجموعة أخرى.</div>'}
      </div>`;

    host.querySelectorAll('[data-deck]').forEach((b) => b.addEventListener('click', () => { state.deck = b.dataset.deck; setup(); }));
    qs('#fcSize', host)?.addEventListener('change', (e) => { state.size = Number(e.target.value); setup(); });
    qs('#fcStart', host)?.addEventListener('click', () => startSession(dueSession));
  }

  function startSession(entries) {
    state.session = entries.slice();
    state.index = 0;
    state.flipped = false;
    state.result = { again: 0, hard: 0, good: 0, easy: 0 };
    state.startAt = Date.now();
    renderCard();
  }

  function renderCard() {
    if (state.index >= state.session.length) return renderEnd();
    const e = state.session[state.index];
    const it = progress.items[e.itemId];
    const box = it ? it.box : 0;
    const total = state.session.length;

    host.innerHTML = `
      ${pageHead({
        icon: '🃏', title: t('fc.title'),
        subtitle: `${DECKS.find((d) => d.id === state.deck)?.ar || ''} · ${e.topicTitle || ''}`,
        actionsHtml: `<button class="btn btn--sm" type="button" id="fcQuit">${esc(t('common.close'))}</button>`,
      })}
      <div class="fc-meta">
        <span>${state.index + 1} / ${total}</span>
        <span>📦 ${esc(t('fc.deck'))}: ${box}/9</span>
      </div>
      <div style="max-width:620px;margin:0 auto 10px">${progressBar(((state.index) / total) * 100)}</div>

      <div class="fc-stage">
        <div class="fc ${state.flipped ? 'is-flipped' : ''}" id="fcCard" role="button" tabindex="0" aria-label="${esc(t('fc.flip'))}">
          <div class="fc__face">
            <span class="fc__label">${esc(e.emoji || '🔤')} ${t('common.listen')}</span>
            <span class="fc__word">${esc(e.en)}</span>
            ${speakBtn(e.en)}
            <span class="hint">اضغط البطاقة أو <span class="kbd">Space</span> لقلبها</span>
          </div>
          <div class="fc__face fc__face--back">
            <span class="fc__label">${esc(t('common.word'))} ← ${esc(t('common.listen'))}</span>
            <span class="fc__word fc__word--ar">${esc(e.ar)}</span>
            ${e.ex ? `<span class="fc__ex en">${esc(e.ex.en)}</span><span class="fc__ex">${esc(e.ex.ar)}</span>` : ''}
            ${speakBtn(e.en)}
          </div>
        </div>
      </div>

      <div class="fc-actions">
        <button class="btn btn--bad" type="button" data-grade="0" ${state.flipped ? '' : 'disabled'}>😵 ${t('fc.again')} <span class="kbd">1</span></button>
        <button class="btn" type="button" data-grade="1" ${state.flipped ? '' : 'disabled'}>😕 ${t('fc.hard')} <span class="kbd">2</span></button>
        <button class="btn btn--ok" type="button" data-grade="2" ${state.flipped ? '' : 'disabled'}>🙂 ${t('fc.good')} <span class="kbd">3</span></button>
        <button class="btn btn--primary" type="button" data-grade="3" ${state.flipped ? '' : 'disabled'}>😎 ${t('fc.easy')} <span class="kbd">4</span></button>
      </div>
      <p class="center small muted" style="margin-top:10px">لم تُقلب البطاقة بعد — اقلبها أولاً ثم قيّم حفظك.</p>
    `;

    const card = qs('#fcCard', host);
    const flip = () => {
      state.flipped = !state.flipped;
      card.classList.toggle('is-flipped', state.flipped);
      host.querySelectorAll('[data-grade]').forEach((b) => { b.disabled = !state.flipped; });
      if (state.flipped && e.ar) {
        host.querySelectorAll('[data-grade]').forEach((b) => b.removeAttribute('disabled'));
      }
    };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); flip(); } });
    if (!state.flipped) { /* لا ننطق تلقائياً لتجنب الإزعاج */ }

    host.querySelectorAll('[data-grade]').forEach((b) => b.addEventListener('click', () => grade(Number(b.dataset.grade))));
    qs('#fcQuit', host)?.addEventListener('click', () => setup());
    document.onkeydown = (ev) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (ev.key === ' ') { ev.preventDefault(); flip(); }
      if (['1', '2', '3', '4'].includes(ev.key) && state.flipped) grade(Number(ev.key) - 1);
    };
  }

  function grade(q) {
    const e = state.session[state.index];
    if (!e) return;
    gradeItem(e.itemId, q);
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
    qs('#fcAgain', host)?.addEventListener('click', () => startSession(buildSession(deckEntries(state.deck), state.size)));
    qs('#fcSetup', host)?.addEventListener('click', setup);
  }

  setup();
}
