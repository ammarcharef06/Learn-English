/* ============================================================================
   LEA v2 — Engine UI
   ----------------------------------------------------------------------------
   الواجهة تستورد فعلياً من مشروعك:
   - assets/js/data/curriculum.js   → LEVELS, ALL_UNITS, unitsOfLevel, getLevel
   - assets/js/core/quizgen.js      → vocabularyEntries, sentenceEntries, curriculumReviewEntries
   - assets/js/core/srs.js          → gradeItem, getItem, smartReviewPlan, dueEntries, stats
   - assets/js/core/speech.js       → speak, stopSpeaking
   - assets/js/core/store.js        → settings, progress, saveProgress, saveSettings
   - assets/js/core/i18n.js         → t, setUiLang
   - assets/js/data/badges.js       → BADGES
   - assets/js/data/readings.js     → READINGS
   - assets/js/data/conversations.js → CONVERSATIONS
   ============================================================================ */

/* ============================================================================
   1) Imports
   ============================================================================ */
const Mods = {};

async function loadModules() {
  const paths = {
    curriculum: '../assets/js/data/curriculum.js',
    quizgen:    '../assets/js/core/quizgen.js',
    srs:        '../assets/js/core/srs.js',
    speech:     '../assets/js/core/speech.js',
    store:      '../assets/js/core/store.js',
    i18n:       '../assets/js/core/i18n.js',
    badges:     '../assets/js/data/badges.js',
    readings:   '../assets/js/data/readings.js',
    conversations: '../assets/js/data/conversations.js',
  };
  const failed = [];
  await Promise.all(
    Object.entries(paths).map(async ([key, p]) => {
      try { Mods[key] = await import(p); }
      catch (e) { failed.push(key); console.warn('[LEA] import failed:', key, e.message); }
    })
  );
  console.info('[LEA] modules:', Object.keys(Mods), '| failed:', failed);
  return failed;
}

/* ============================================================================
   2) Helpers
   ============================================================================ */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

function haptic(ms = 10) { try { navigator.vibrate?.(ms); } catch {} }

function toast(msg, ms = 1800) {
  const root = $('#toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function fmtDate(d = new Date()) { return d.toISOString().slice(0, 10); }
function todayKey() { return fmtDate(new Date()); }
function daysAgoKey(n) { const d = new Date(); d.setDate(d.getDate() - n); return fmtDate(d); }

/* ============================================================================
   3) i18n
   ============================================================================ */
let uiLang = 'ar';

function t(key, vars) {
  if (Mods.i18n?.t) { try { return Mods.i18n.t(key, vars); } catch {} }
  return key;
}

function setUiLang(l) {
  uiLang = l;
  try { Mods.i18n?.setUiLang?.(l); } catch {}
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
}

/* ============================================================================
   4) Store
   ============================================================================ */
const Store = {
  get settings() {
    if (Mods.store?.settings) return Mods.store.settings;
    try { return JSON.parse(localStorage.getItem('lea.settings.v1')) || {}; } catch { return {}; }
  },
  get progress() {
    if (Mods.store?.progress) return Mods.store.progress;
    try { return JSON.parse(localStorage.getItem('lea.progress.v1')) || {}; } catch { return {}; }
  },
  saveSettings(patch) {
    if (Mods.store?.saveSettings) {
      try { return Mods.store.saveSettings(patch); } catch {}
    }
    const cur = this.settings; Object.assign(cur, patch);
    try { localStorage.setItem('lea.settings.v1', JSON.stringify(cur)); } catch {}
  },
  saveProgress(mutator) {
    if (Mods.store?.saveProgress) {
      try { return Mods.store.saveProgress(mutator); } catch {}
    }
    const p = this.progress;
    if (typeof mutator === 'function') mutator(p);
    try { localStorage.setItem('lea.progress.v1', JSON.stringify(p)); } catch {}
    return p;
  },
  resetProgress() {
    if (Mods.store?.resetProgress) { try { return Mods.store.resetProgress(); } catch {} }
    try { localStorage.removeItem('lea.progress.v1'); } catch {}
  },
};

/* ============================================================================
   5) SRS
   ============================================================================ */
const SRS = {
  grade(itemId, quality) {
    if (!Mods.srs?.gradeItem) { toast('SRS module not loaded'); return null; }
    try { return Mods.srs.gradeItem(itemId, quality); }
    catch (e) { console.error('[SRS] grade failed:', e); return null; }
  },
  get(itemId) {
    if (Mods.srs?.getItem) { try { return Mods.srs.getItem(itemId); } catch {} }
    return Store.progress.items?.[itemId] || null;
  },
  plan(entries, size = 15) {
    if (Mods.srs?.smartReviewPlan) {
      try {
        const r = Mods.srs.smartReviewPlan(entries, size);
        return Array.isArray(r) ? r : (r?.entries || []);
      } catch (e) { console.warn('[SRS] plan failed:', e); }
    }
    return entries.slice(0, size);
  },
  due(entries) {
    if (Mods.srs?.dueEntries) { try { return Mods.srs.dueEntries(entries); } catch {} }
    return entries;
  },
  stats(entries) {
    if (Mods.srs?.stats) { try { return Mods.srs.stats(entries); } catch {} }
    return { total: entries.length, due: 0, mastered: 0 };
  },
};

/* ============================================================================
   6) Data
   ============================================================================ */
const Data = {
  levels() { return Mods.curriculum?.LEVELS || []; },
  level(id) {
    if (Mods.curriculum?.getLevel) { try { return Mods.curriculum.getLevel(id); } catch {} }
    return this.levels().find((l) => l.id === id) || null;
  },
  unitsOf(levelId) {
    if (Mods.curriculum?.unitsOfLevel) { try { return Mods.curriculum.unitsOfLevel(levelId) || []; } catch {} }
    return (Mods.curriculum?.ALL_UNITS || []).filter((u) => u.levelId === levelId);
  },
  allUnits() { return Mods.curriculum?.ALL_UNITS || []; },
  allEntries() {
    if (!Mods.quizgen) return [];
    const v = (() => { try { return Mods.quizgen.vocabularyEntries() || []; } catch { return []; } })();
    const s = (() => { try { return Mods.quizgen.sentenceEntries() || []; } catch { return []; } })();
    const c = (() => { try { return Mods.quizgen.curriculumReviewEntries() || []; } catch { return []; } })();
    return [...v, ...s, ...c];
  },
  readings() { return Mods.readings?.READINGS || []; },
  readingsForLevel(levelId) {
    return this.readings().filter((r) => (r.level || '').toLowerCase() === levelId);
  },
  reading(id) { return this.readings().find((r) => r.id === id) || null; },
  conversations() { return Mods.conversations?.CONVERSATIONS || []; },
  conversation(id) { return this.conversations().find((c) => c.id === id) || null; },
  badges() { return Mods.badges?.BADGES || []; },
};

/* ============================================================================
   7) Progress calculations
   ============================================================================ */
function unitProgressPct(unitId, entries) {
  if (!entries || !entries.length) return 0;
  let seen = 0;
  for (const e of entries) {
    const st = SRS.get(e.itemId);
    if (st && st.seen > 0) seen++;
  }
  return Math.round((seen / entries.length) * 100);
}

function levelProgressPct(levelId, allEntries) {
  const units = Data.unitsOf(levelId);
  if (!units.length) return 0;
  let total = 0, done = 0;
  for (const u of units) {
    const entries = allEntries.filter((e) => e.unitId === u.id);
    total += entries.length;
    for (const e of entries) {
      const st = SRS.get(e.itemId);
      if (st && st.seen > 0) done++;
    }
  }
  return total ? Math.round((done / total) * 100) : 0;
}

function streakDays() { return Store.progress.streak || 0; }

function dailyGoalProgress() {
  const goal = Store.settings.dailyGoal || 20;
  const p = Store.progress;
  const activity = p.activity || {};
  const todayCount = activity[todayKey()]?.q || 0;
  return { done: todayCount, target: goal, pct: Math.min(100, Math.round(todayCount / goal * 100)) };
}

/* ============================================================================
   8) Sheet
   ============================================================================ */
const Sheet = {
  open(html) {
    this.close();
    const root = $('#sheet-root');
    if (!root) return;
    root.innerHTML = `
      <div class="sheet-backdrop" id="sheetBackdrop"></div>
      <div class="sheet" id="sheet">
        <div class="sheet__handle"></div>
        ${html}
      </div>
    `;
    requestAnimationFrame(() => {
      $('#sheetBackdrop')?.classList.add('open');
      $('#sheet')?.classList.add('open');
    });
    $('#sheetBackdrop')?.addEventListener('click', () => this.close());
  },
  close() {
    const b = $('#sheetBackdrop'), s = $('#sheet');
    if (!b || !s) return;
    b.classList.remove('open');
    s.classList.remove('open');
    setTimeout(() => { const r = $('#sheet-root'); if (r) r.innerHTML = ''; }, 350);
  },
};

/* ============================================================================
   9) State
   ============================================================================ */
const State = {
  screen: 'feed',
  feed: { cards: [], index: 0 },
  review: { session: [], index: 0, flipped: false, done: false, totalGraded: 0 },
  path: { levelId: null },
  allEntriesCache: [],
};

/* ============================================================================
   10) Feed builder
   ============================================================================ */
function buildFeed() {
  const all = State.allEntriesCache;
  const due = SRS.due(all).slice(0, 20);
  const reviewCards = due.map((e) => ({ type: 'review', entry: e }));

  const fresh = all.filter((e) => !SRS.get(e.itemId)).slice(0, 8);
  const freshCards = fresh.map((e) => ({
    type: e.kind === 'sentence' ? 'sentence' : 'vocab',
    entry: e,
  }));

  const reading = Data.readingsForLevel('a1')[0] || Data.readings()[0];
  const readingCard = reading ? { type: 'reading', entry: reading } : null;

  const conv = Data.conversations()[0];
  const convCard = conv ? { type: 'conversation', entry: conv } : null;

  const grammarUnit = Data.allUnits().find((u) => (u.grammar || []).length);
  const grammarCard = grammarUnit ? { type: 'grammar', entry: grammarUnit.grammar[0], unit: grammarUnit } : null;

  const ordered = [];
  const push = (c) => { if (c) ordered.push(c); };

  let ri = 0, vi = 0;
  const reviews = reviewCards;
  const vocab = freshCards.filter((c) => c.type === 'vocab');
  const sent = freshCards.filter((c) => c.type === 'sentence');

  push(reviews[ri++]);
  push(vocab[vi++]);
  push(sent[0]);
  push(readingCard);
  push(reviews[ri++]);
  push(vocab[vi++]);
  push(convCard);
  push(reviews[ri++]);
  push(grammarCard);
  push(vocab[vi++]);
  push(reviews[ri++]);

  while (ri < reviews.length) push(reviews[ri++]);
  while (vi < vocab.length) push(vocab[vi++]);

  return ordered.filter(Boolean);
}

/* ============================================================================
   11) Feed renderer
   ============================================================================ */
function renderFeed() {
  const cards = State.feed.cards;
  const idx = State.feed.index;
  const goal = dailyGoalProgress();

  if (!cards.length) return renderEmptyFeed();
  if (idx >= cards.length) return renderFeedEnd();

  const card = cards[idx];

  return `
    <main class="screen no-pad" style="display:flex;flex-direction:column;height:100%;padding:0 0 var(--nav-h)">
      <div style="padding: calc(var(--safe-t) + 12px) 16px 0">
        <div class="topbar">
          <div class="brand">
            <div class="brand__mark">L</div>
            <div class="brand__text">
              <div class="brand__name">LEA</div>
              <div class="brand__sub">محرّك التعلّم</div>
            </div>
          </div>
          <div class="topbar__actions">
            <div class="pill pill--fire">🔥 ${streakDays()}</div>
            <button class="icon-btn" data-action="go-profile">👤</button>
          </div>
        </div>
        <div class="feed__progress"><i style="width:${goal.pct}%"></i></div>
      </div>
      <div class="feed">
        <div class="feed__stack" id="feedStack">
          ${renderFeedCard(card, idx)}
        </div>
        ${renderFeedActions(card)}
      </div>
      ${renderBottomNav('feed')}
    </main>
  `;
}

function renderFeedCard(card, idx) {
  const gradable = ['vocab', 'sentence', 'review'].includes(card.type);
  return `
    <div class="feed__card" data-feed-card data-idx="${idx}" data-type="${card.type}">
      ${renderCardBody(card)}
      <div class="card-hint">${gradable ? 'اسحب يمين = جيد · يسار = صعب · أعلى = التالي' : 'اضغط "التالي" للمتابعة'}</div>
    </div>
  `;
}

function renderCardBody(card) {
  switch (card.type) {
    case 'vocab': return renderVocabCard(card.entry);
    case 'sentence': return renderSentenceCard(card.entry);
    case 'review': return renderReviewCard(card.entry);
    case 'grammar': return renderGrammarCard(card.entry, card.unit);
    case 'reading': return renderReadingCard(card.entry);
    case 'conversation': return renderConversationCard(card.entry);
    default: return '<div class="content-card">نوع غير معروف</div>';
  }
}

function renderVocabCard(e) {
  return `
    <div class="content-card content-card--vocab">
      <div class="content-card__badge">${(e.level || '').toUpperCase()} · ${esc(e.topic || '')}</div>
      <div class="content-card__main">
        <div class="content-card__word">${esc(e.en)}</div>
        ${e.ipa ? `<div class="content-card__ipa">${esc(e.ipa)}</div>` : ''}
        <button class="audio-btn" data-action="speak" data-text="${esc(e.en)}" data-audio-url="${esc(e.audioUrl || '')}">🔊</button>
        <div class="content-card__translation">${esc(e.ar)}</div>
        ${e.ex && e.ex.en ? `<div class="content-card__example">${esc(e.ex.en)}</div>` : ''}
        ${e.ex && e.ex.ar ? `<div class="content-card__example-ar">${esc(e.ex.ar)}</div>` : ''}
      </div>
    </div>
  `;
}

function renderSentenceCard(e) {
  return `
    <div class="content-card content-card--sentence">
      <div class="content-card__badge">${(e.level || '').toUpperCase()} · جملة</div>
      <div class="content-card__main">
        <button class="audio-btn" data-action="speak" data-text="${esc(e.en)}" data-audio-url="${esc(e.audioUrl || '')}">🔊</button>
        <div class="content-card__word">${esc(e.en)}</div>
        <div class="content-card__translation">${esc(e.ar)}</div>
      </div>
    </div>
  `;
}

function renderReviewCard(e) {
  const st = SRS.get(e.itemId);
  return `
    <div class="content-card content-card--review">
      <div class="content-card__badge">مراجعة · ${(e.level || '').toUpperCase()}</div>
      <div class="content-card__main">
        <div class="content-card__word">${esc(e.en)}</div>
        ${st ? `<div class="review__meta">مرات الظهور: ${st.seen || 0} · فاصل: ${st.interval || 0}ي</div>` : ''}
        <button class="audio-btn" data-action="speak" data-text="${esc(e.en)}" data-audio-url="${esc(e.audioUrl || '')}">🔊</button>
      </div>
    </div>
  `;
}

function renderGrammarCard(g, unit) {
  const title = g.title || '';
  const explain = g.explain || '';
  const clean = explain.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const ex = (g.examples || [])[0] || {};
  return `
    <div class="content-card content-card--grammar">
      <div class="content-card__badge">قاعدة · ${esc(unit?.title || '')}</div>
      <div class="content-card__main">
        <div class="content-card__word">${esc(title)}</div>
        <div class="content-card__example">${esc(clean.slice(0, 260))}${clean.length > 260 ? '…' : ''}</div>
        ${ex.en ? `<div class="content-card__example" style="border-color:rgba(34,211,238,.3);color:#22d3ee">${esc(ex.en)}</div>` : ''}
        ${ex.ar ? `<div class="content-card__example-ar">${esc(ex.ar)}</div>` : ''}
      </div>
    </div>
  `;
}

function renderReadingCard(r) {
  const snippet = (r.text || '').slice(0, 240);
  return `
    <div class="content-card content-card--reading">
      <div class="content-card__badge">مطالعة · ${esc(r.titleAr || r.title || '')}</div>
      <div class="content-card__main">
        <div style="font-size:48px">${esc(r.emoji || '📖')}</div>
        <div class="content-card__word">${esc(snippet)}${(r.text || '').length > 240 ? '…' : ''}</div>
        <div class="content-card__translation">${esc((r.textAr || '').slice(0, 260))}${(r.textAr || '').length > 260 ? '…' : ''}</div>
      </div>
      <button class="btn btn--primary btn--block" data-action="open-reading" data-id="${esc(r.id)}" style="margin-top:12px">
        اقرأ النص كاملاً
      </button>
    </div>
  `;
}

function renderConversationCard(c) {
  const turn = (c.turns || [])[0];
  if (!turn) return '<div class="content-card">—</div>';
  return `
    <div class="content-card content-card--conversation">
      <div class="content-card__badge">محادثة · ${esc(c.titleAr || c.title)}</div>
      <div class="content-card__main">
        <div class="conv-turn">
          <div class="conv-prompt">
            ${esc(turn.prompt)}
            <div class="conv-prompt-ar">${esc(turn.promptAr || '')}</div>
          </div>
          <div class="conv-options">
            ${(turn.options || []).map((o, i) => `
              <button class="conv-option" data-conv-option data-best="${o.best ? '1' : '0'}" data-i="${i}">
                ${esc(o.en)}
                <span class="ar">${esc(o.ar)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
      <button class="btn btn--ghost btn--block" data-action="open-conv" data-id="${esc(c.id)}" style="margin-top:12px">
        تابع الحوار كاملاً
      </button>
    </div>
  `;
}

function renderFeedActions(card) {
  const gradable = ['vocab', 'sentence', 'review'].includes(card.type);
  if (!gradable) {
    return `<div style="padding:0 16px 10px"><button class="btn-reveal" data-action="next-card">التالي ←</button></div>`;
  }
  return `
    <div class="grade-bar">
      <button class="grade grade--hard" data-action="feed-grade" data-q="3"><span class="ico">😣</span><span>صعب</span></button>
      <button class="grade grade--good" data-action="feed-grade" data-q="4"><span class="ico">🙂</span><span>جيد</span></button>
      <button class="grade grade--easy" data-action="feed-grade" data-q="5"><span class="ico">😎</span><span>سهل</span></button>
    </div>
  `;
}

function renderEmptyFeed() {
  return `
    <main class="screen">
      <div class="card" style="text-align:center;padding:32px 20px;margin-top:40px">
        <div style="font-size:48px;margin-bottom:12px">🌱</div>
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900">لا توجد بطاقات بعد</h2>
        <p style="margin:0;color:var(--text-3);font-size:13px;line-height:1.6">
          لم نتمكن من تحميل المنهج. افتح Console لرؤية سبب فشل الاستيراد.
        </p>
      </div>
      ${renderBottomNav('feed')}
    </main>
  `;
}

function renderFeedEnd() {
  return `
    <main class="screen">
      <div class="review-done" style="margin-top:60px">
        <div class="review-done__emoji">✨</div>
        <h2>أنجزت تدفّق اليوم</h2>
        <p>عد غداً لمزيد من البطاقات</p>
        <button class="btn btn--primary" data-action="open-review">فتح المراجعة</button>
      </div>
      ${renderBottomNav('feed')}
    </main>
  `;
}

/* ============================================================================
   12) Path
   ============================================================================ */
function renderPath() {
  if (State.path.levelId) return renderLevelDetail(State.path.levelId);
  const levels = Data.levels();
  return `
    <main class="screen">
      <header class="topbar">
        <div class="brand">
          <div class="brand__mark">📚</div>
          <div class="brand__text">
            <div class="brand__name">المسار</div>
            <div class="brand__sub">A0 → C2</div>
          </div>
        </div>
      </header>
      <div class="level-list">
        ${levels.length
          ? levels.map((lvl) => renderLevelCard(lvl)).join('')
          : `<div class="card" style="text-align:center;color:var(--text-3)">المنهج غير محمّل</div>`
        }
      </div>
      ${renderBottomNav('path')}
    </main>
  `;
}

function renderLevelCard(lvl) {
  const pct = levelProgressPct(lvl.id, State.allEntriesCache);
  const units = Data.unitsOf(lvl.id);
  return `
    <button class="level-card" data-action="open-level" data-id="${esc(lvl.id)}">
      <div class="level-card__icon">${esc(lvl.icon || '🎯')}</div>
      <div class="level-card__body">
        <div class="level-card__title">${esc(lvl.label || lvl.id.toUpperCase())}</div>
        <div class="level-card__sub">${units.length} وحدة</div>
        <div class="level-card__prog"><i style="width:${pct}%"></i></div>
      </div>
    </button>
  `;
}

function renderLevelDetail(levelId) {
  const lvl = Data.level(levelId);
  if (!lvl) return '<main class="screen"><p>مستوى غير موجود</p></main>';
  const units = Data.unitsOf(levelId);
  return `
    <main class="screen">
      <header class="topbar">
        <button class="icon-btn" data-action="path-back">←</button>
        <div class="brand">
          <div class="brand__mark">${esc(lvl.icon || '🎯')}</div>
          <div class="brand__text">
            <div class="brand__name">${esc(lvl.label || levelId.toUpperCase())}</div>
            <div class="brand__sub">${units.length} وحدة</div>
          </div>
        </div>
      </header>
      <div class="unit-list">
        ${units.map((u) => renderUnitRow(u)).join('')}
      </div>
      ${renderBottomNav('path')}
    </main>
  `;
}

function renderUnitRow(u) {
  const entries = State.allEntriesCache.filter((e) => e.unitId === u.id);
  const pct = unitProgressPct(u.id, entries);
  return `
    <button class="unit-row" data-action="start-unit" data-id="${esc(u.id)}">
      <div class="unit-row__thumb">${esc(u.icon || '📖')}</div>
      <div class="unit-row__body">
        <div class="unit-row__title">${esc(u.title || u.titleEn || '')}</div>
        <div class="unit-row__sub">${esc(u.goal || '')}</div>
        <div class="unit-row__prog"><i style="width:${pct}%"></i></div>
      </div>
    </button>
  `;
}

/* ============================================================================
   13) Progress
   ============================================================================ */
function renderProgress() {
  const p = Store.progress;
  const stats = SRS.stats(State.allEntriesCache);
  const goal = dailyGoalProgress();
  const mastery = stats.total ? Math.round((stats.mastered || 0) / stats.total * 100) : 0;

  const days = [];
  for (let i = 27; i >= 0; i--) days.push(daysAgoKey(i));
  const act = p.activity || {};
  const levelFn = (k) => {
    const c = act[k]?.q || 0;
    if (!c) return 0;
    if (c < 5) return 1;
    if (c < 15) return 2;
    if (c < 30) return 3;
    return 4;
  };

  const badges = Data.badges();
  const earned = p.badges || [];

  return `
    <main class="screen">
      <header class="topbar">
        <div class="brand">
          <div class="brand__mark">📊</div>
          <div class="brand__text">
            <div class="brand__name">تقدّمك</div>
            <div class="brand__sub">Spark يتطور معك</div>
          </div>
        </div>
      </header>

      <section class="spark-hero">
        <div class="spark-visual">
          <div class="spark-visual__ring"></div>
          <div class="spark-visual__ring"></div>
          <div class="spark-visual__ring"></div>
          <div class="spark-visual__core"></div>
        </div>
        <div class="spark-title">إتقان ${mastery}%</div>
        <div class="spark-sub">${stats.mastered || 0} من ${stats.total || 0} عنصر</div>
      </section>

      <div class="stat-grid">
        <div class="stat-card"><div class="stat-card__v">${streakDays()}</div><div class="stat-card__k">سلسلة الأيام</div></div>
        <div class="stat-card"><div class="stat-card__v">${p.points || 0}</div><div class="stat-card__k">نقاط</div></div>
        <div class="stat-card"><div class="stat-card__v">${p.totals?.correct || 0}</div><div class="stat-card__k">إجابات صحيحة</div></div>
        <div class="stat-card"><div class="stat-card__v">${p.totals?.sessions || 0}</div><div class="stat-card__k">جلسات</div></div>
      </div>

      <div class="card" style="margin-top:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="font-weight:900;font-size:14px">هدف اليوم</div>
          <div style="font-size:12px;color:var(--text-3)">${goal.done}/${goal.target}</div>
        </div>
        <div class="level-card__prog" style="height:8px"><i style="width:${goal.pct}%"></i></div>
      </div>

      <div class="section-title"><span>آخر ٢٨ يوماً</span></div>
      <div class="heatmap">
        ${days.map((d) => `<div class="heatmap__cell" data-l="${levelFn(d)}" title="${d}"></div>`).join('')}
      </div>

      <div class="section-title"><span>الشارات</span></div>
      <div class="badge-grid">
        ${badges.slice(0, 16).map((b) => `
          <div class="badge-tile ${earned.includes(b.id) ? 'earned' : ''}" title="${esc(b.descAr || '')}">
            <div class="badge-tile__emoji">${esc(b.icon || '🏆')}</div>
            <div class="badge-tile__label">${esc(b.ar || b.en || '')}</div>
          </div>
        `).join('')}
      </div>
      ${renderBottomNav('progress')}
    </main>
  `;
}

/* ============================================================================
   14) Profile
   ============================================================================ */
function renderProfile() {
  const s = Store.settings;
  const soundOn = s.sound !== false;
  const autoSpeak = !!s.autoSpeak;

  return `
    <main class="screen">
      <header class="topbar">
        <div class="brand">
          <div class="brand__mark">👤</div>
          <div class="brand__text">
            <div class="brand__name">حسابي</div>
            <div class="brand__sub">إعداداتك</div>
          </div>
        </div>
      </header>

      <div class="profile-head">
        <div class="avatar">${uiLang === 'ar' ? 'م' : 'L'}</div>
        <h2>متعلّم طموح</h2>
        <p>${streakDays()} يوم متواصل · ${Store.progress.points || 0} نقطة</p>
      </div>

      <div class="section-title"><span>التفضيلات</span></div>
      <div class="card" style="padding:6px 18px">
        <div class="setting-row">
          <div>
            <div class="setting-label"><span class="ico">🔊</span>الصوت</div>
            <div class="setting-hint">أصوات عند التقييم</div>
          </div>
          <button class="switch ${soundOn ? 'on' : ''}" data-action="toggle-sound"></button>
        </div>
        <div class="setting-row">
          <div>
            <div class="setting-label"><span class="ico">🗣️</span>نطق تلقائي</div>
            <div class="setting-hint">ينطق الكلمة عند ظهور البطاقة</div>
          </div>
          <button class="switch ${autoSpeak ? 'on' : ''}" data-action="toggle-autospeak"></button>
        </div>
        <div class="setting-row">
          <div>
            <div class="setting-label"><span class="ico">🌐</span>لغة الواجهة</div>
            <div class="setting-hint">${uiLang === 'ar' ? 'العربية' : 'English'}</div>
          </div>
          <button class="btn btn--ghost" data-action="toggle-lang">${uiLang === 'ar' ? 'English' : 'العربية'}</button>
        </div>
      </div>

      <div class="section-title"><span>إجراءات</span></div>
      <div class="card" style="padding:14px;display:flex;flex-direction:column;gap:10px">
        <button class="btn btn--ghost btn--block" data-action="install-app">📲 تثبيت التطبيق</button>
        <button class="btn btn--danger btn--block" data-action="reset-progress">🗑️ إعادة تعيين التقدّم</button>
      </div>

      <div class="section-title"><span>عن التطبيق</span></div>
      <div class="card" style="padding:16px">
        <div style="font-weight:900;margin-bottom:6px">LEA · محرّك التعلّم</div>
        <div style="font-size:12px;color:var(--text-3);line-height:1.7">
          تعلّم إنجليزي حتى C2. بدون قلوب. بدون جواهر. بدون دوريات.
        </div>
      </div>
      ${renderBottomNav('profile')}
    </main>
  `;
}

/* ============================================================================
   15) Review
   ============================================================================ */
function renderReview() {
  const rv = State.review;
  if (rv.done) return renderReviewDone();
  const card = rv.session[rv.index];
  if (!card) return renderReviewDone();

  const total = rv.session.length;
  const pct = total ? Math.round((rv.index / total) * 100) : 0;

  return `
    <main class="screen no-pad" style="height:100%;padding:0">
      <div class="review-shell">
        <header class="review-top">
          <button class="icon-btn" data-action="exit-review">✕</button>
          <div class="review-top__bar"><i style="width:${pct}%"></i></div>
          <div class="review-top__count">${rv.index + 1} / ${total}</div>
        </header>

        <div class="review-stage">
          <div class="review-flash ${rv.flipped ? 'flipped' : ''}" data-review-flash>
            <div class="review-face review-face--front">
              <div class="content-card__badge" style="top:14px;inset-inline-start:16px">
                ${(card.level || '').toUpperCase()} · مراجعة
              </div>
              <div class="content-card__word" style="font-size:clamp(30px,9vw,48px);font-weight:900;font-family:var(--font-en)">
                ${esc(card.en)}
              </div>
              ${card.ipa ? `<div class="content-card__ipa">${esc(card.ipa)}</div>` : ''}
              <button class="audio-btn" data-action="speak" data-text="${esc(card.en)}" data-audio-url="${esc(card.audioUrl || '')}">🔊</button>
              <div class="card-hint" style="position:static;margin-top:20px">اضغط للكشف</div>
            </div>
            <div class="review-face review-face--back">
              <div class="content-card__badge" style="top:14px;inset-inline-start:16px">الإجابة</div>
              <div class="content-card__translation" style="font-size:clamp(24px,7vw,36px)">${esc(card.ar)}</div>
              ${card.ex && card.ex.en ? `<div class="content-card__example">${esc(card.ex.en)}</div>` : ''}
              ${card.ex && card.ex.ar ? `<div class="content-card__example-ar">${esc(card.ex.ar)}</div>` : ''}
            </div>
          </div>
        </div>

        <div class="grade-bar" id="reviewActions" style="display:${rv.flipped ? 'grid' : 'none'}">
          <button class="grade grade--hard" data-action="review-grade" data-q="3"><span class="ico">😣</span><span>صعب</span></button>
          <button class="grade grade--good" data-action="review-grade" data-q="4"><span class="ico">🙂</span><span>جيد</span></button>
          <button class="grade grade--easy" data-action="review-grade" data-q="5"><span class="ico">😎</span><span>سهل</span></button>
        </div>
        <div id="reviewReveal" style="display:${rv.flipped ? 'none' : 'block'};padding:0 0 8px">
          <button class="btn-reveal" data-action="review-reveal">اكشف الإجابة</button>
        </div>
      </div>
      ${renderBottomNav('review')}
    </main>
  `;
}

function renderReviewDone() {
  const g = State.review.totalGraded || 0;
  return `
    <main class="screen">
      <div class="review-done" style="margin-top:80px">
        <div class="review-done__emoji">🎉</div>
        <h2>أحسنت!</h2>
        <p>أنهيت جلسة المراجعة</p>
        <div class="review-done__stats">
          <div class="stat-card" style="min-width:100px"><div class="stat-card__v">${g}</div><div class="stat-card__k">بطاقات</div></div>
          <div class="stat-card" style="min-width:100px"><div class="stat-card__v">+${g * 5}</div><div class="stat-card__k">XP</div></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:20px">
          <button class="btn btn--primary" data-action="exit-review">الرئيسية</button>
          <button class="btn btn--ghost" data-action="restart-review">جلسة أخرى</button>
        </div>
      </div>
      ${renderBottomNav('review')}
    </main>
  `;
}

function startReview(entries, size = 15) {
  if (!entries.length) { toast('لا توجد بطاقات للمراجعة'); return; }
  const session = SRS.plan(entries, size);
  State.review = { session, index: 0, flipped: false, done: false, totalGraded: 0 };
  navigate('review');
}

/* ============================================================================
   16) Bottom nav
   ============================================================================ */
function renderBottomNav(active) {
  const tabs = [
    { id: 'feed', ico: '⚡', label: 'تدفّق' },
    { id: 'path', ico: '📚', label: 'مسار' },
    { id: 'progress', ico: '📊', label: 'تقدّم' },
    { id: 'profile', ico: '👤', label: 'حسابي' },
  ];
  return `
    <nav class="bottom-nav">
      ${tabs.map((t) => `
        <button class="nav-btn ${active === t.id ? 'active' : ''}" data-action="nav" data-screen="${t.id}">
          <span class="nav-btn__icon">${t.ico}</span>
          <span>${t.label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

/* ============================================================================
   17) Render
   ============================================================================ */
function navigate(screen) {
  State.screen = screen;
  render();
}

function render() {
  const app = $('#app');
  if (!app) return;
  let html = '';
  switch (State.screen) {
    case 'feed': html = renderFeed(); break;
    case 'path': html = renderPath(); break;
    case 'progress': html = renderProgress(); break;
    case 'profile': html = renderProfile(); break;
    case 'review': html = renderReview(); break;
    default: html = renderFeed();
  }
  app.innerHTML = html;
  bindScreenEvents();
}

/* ============================================================================
   18) Bind
   ============================================================================ */
function bindScreenEvents() {
  const flash = $('[data-review-flash]');
  if (flash) {
    flash.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="speak"]')) return;
      if (!State.review.flipped) revealReview();
    });
  }

  $$('[data-conv-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isBest = btn.dataset.best === '1';
      btn.parentElement.querySelectorAll('.conv-option').forEach((b) => {
        b.disabled = true;
        if (b.dataset.best === '1') b.classList.add('is-best');
        else if (b === btn) b.classList.add('is-wrong');
      });
      if (isBest) { haptic(20); toast('✅ أحسنت!'); }
      else { haptic(10); toast('راجع الخيار الصحيح'); }
      Store.saveProgress((p) => {
        p.conversations = p.conversations || { completed: {}, sessions: 0, turns: 0, correct: 0 };
        p.conversations.turns = (p.conversations.turns || 0) + 1;
        if (isBest) p.conversations.correct = (p.conversations.correct || 0) + 1;
      });
    });
  });

  bindFeedGestures();
}

function bindFeedGestures() {
  const stack = $('#feedStack');
  if (!stack) return;
  const card = stack.querySelector('[data-feed-card]');
  if (!card) return;

  let startX = 0, startY = 0, tracking = false;

  card.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    tracking = true;
    startX = e.clientX; startY = e.clientY;
  });

  card.addEventListener('pointerup', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) < 60 && Math.abs(dy) < 60) return;
    const type = card.dataset.type;
    const gradable = ['vocab', 'sentence', 'review'].includes(type);
    if (Math.abs(dy) > Math.abs(dx) && dy < -60) {
      advanceFeed();
    } else if (gradable && Math.abs(dx) > Math.abs(dy)) {
      gradeFeedCard(dx > 0 ? 4 : 3, dx > 0 ? 'right' : 'left');
    }
  });
}

/* ============================================================================
   19) Actions
   ============================================================================ */
function advanceFeed() {
  const card = $('[data-feed-card]');
  if (card) card.classList.add('is-leaving-up');
  setTimeout(() => { State.feed.index++; render(); }, 380);
}

function gradeFeedCard(quality, dir) {
  const card = $('[data-feed-card]');
  const idx = parseInt(card?.dataset.idx || '0', 10);
  const feedCard = State.feed.cards[idx];
  if (!feedCard || !feedCard.entry) { advanceFeed(); return; }

  SRS.grade(feedCard.entry.itemId, quality);

  Store.saveProgress((p) => {
    p.activity = p.activity || {};
    const k = todayKey();
    p.activity[k] = p.activity[k] || { q: 0, c: 0 };
    p.activity[k].q = (p.activity[k].q || 0) + 1;
    if (quality >= 4) p.activity[k].c = (p.activity[k].c || 0) + 1;
    p.totals = p.totals || {};
    p.totals.questions = (p.totals.questions || 0) + 1;
    if (quality >= 4) p.totals.correct = (p.totals.correct || 0) + 1;
    if (p.lastStudyDay !== k) {
      const y = daysAgoKey(1);
      p.streak = (p.lastStudyDay === y) ? (p.streak || 0) + 1 : 1;
      p.bestStreak = Math.max(p.bestStreak || 0, p.streak);
      p.lastStudyDay = k;
    }
  });

  haptic(quality >= 4 ? 15 : 8);
  if (card) card.classList.add(dir === 'right' ? 'is-leaving-right' : 'is-leaving-left');
  setTimeout(() => { State.feed.index++; render(); }, 380);
}

function revealReview() {
  State.review.flipped = true;
  const flash = $('[data-review-flash]');
  if (flash) flash.classList.add('flipped');
  setTimeout(() => {
    const actions = $('#reviewActions');
    const reveal = $('#reviewReveal');
    if (actions) actions.style.display = 'grid';
    if (reveal) reveal.style.display = 'none';
  }, 300);
}

function reviewGrade(quality) {
  const rv = State.review;
  const card = rv.session[rv.index];
  if (!card) return;

  SRS.grade(card.itemId, quality);
  rv.totalGraded += 1;

  Store.saveProgress((p) => {
    p.activity = p.activity || {};
    const k = todayKey();
    p.activity[k] = p.activity[k] || { q: 0, c: 0 };
    p.activity[k].q = (p.activity[k].q || 0) + 1;
    if (quality >= 4) p.activity[k].c = (p.activity[k].c || 0) + 1;
    p.totals = p.totals || {};
    p.totals.questions = (p.totals.questions || 0) + 1;
    if (quality >= 4) p.totals.correct = (p.totals.correct || 0) + 1;
    if (p.lastStudyDay !== k) {
      const y = daysAgoKey(1);
      p.streak = (p.lastStudyDay === y) ? (p.streak || 0) + 1 : 1;
      p.bestStreak = Math.max(p.bestStreak || 0, p.streak);
      p.lastStudyDay = k;
    }
  });

  haptic(quality >= 4 ? 15 : 8);
  rv.index++;
  rv.flipped = false;
  if (rv.index >= rv.session.length) rv.done = true;
  render();
}

/* ============================================================================
   20) Global click delegation
   ============================================================================ */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  switch (action) {
    case 'nav':
      State.path.levelId = null;
      navigate(el.dataset.screen);
      break;

    case 'go-profile':
      navigate('profile');
      break;

    case 'open-level':
      State.path.levelId = el.dataset.id;
      render();
      break;

    case 'path-back':
      State.path.levelId = null;
      render();
      break;

    case 'start-unit': {
      const unitId = el.dataset.id;
      const entries = State.allEntriesCache.filter((x) => x.unitId === unitId);
      if (!entries.length) { toast('لا توجد بطاقات لهذه الوحدة'); break; }
      startReview(entries, 10);
      break;
    }

    case 'open-review':
    case 'restart-review':
      startReview(State.allEntriesCache, 15);
      break;

    case 'exit-review':
      State.review = { session: [], index: 0, flipped: false, done: false, totalGraded: 0 };
      navigate('feed');
      break;

    case 'review-reveal':
      revealReview();
      break;

    case 'review-grade':
      reviewGrade(parseInt(el.dataset.q, 10) || 4);
      break;

    case 'feed-grade':
      gradeFeedCard(parseInt(el.dataset.q, 10) || 4, parseInt(el.dataset.q, 10) >= 5 ? 'right' : 'left');
      break;

    case 'next-card':
      advanceFeed();
      break;

    case 'speak': {
      const text = el.dataset.text;
      const url = el.dataset.audioUrl;
      if (Store.settings.sound === false) { toast('الصوت مغلق'); break; }
      if (Mods.speech?.speak) {
        try { Mods.speech.speak(text, url ? { audioUrl: url } : {}); }
        catch (err) { console.warn('[speak]', err); }
      } else {
        try {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'en-US';
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        } catch {}
      }
      haptic(5);
      break;
    }

    case 'toggle-sound':
      Store.saveSettings({ sound: Store.settings.sound === false });
      render();
      break;

    case 'toggle-autospeak':
      Store.saveSettings({ autoSpeak: !Store.settings.autoSpeak });
      render();
      break;

    case 'toggle-lang':
      setUiLang(uiLang === 'ar' ? 'en' : 'ar');
      render();
      break;

    case 'install-app':
      if (window.__deferredInstallPrompt) {
        window.__deferredInstallPrompt.prompt();
        window.__deferredInstallPrompt.userChoice.then(() => {
          window.__deferredInstallPrompt = null;
        });
      } else {
        toast('افتح قائمة المتصفح ثم "تثبيت التطبيق"');
      }
      break;

    case 'reset-progress':
      if (!confirm('سيتم حذف كل تقدّمك. متأكد؟')) break;
      Store.resetProgress();
      toast('تم إعادة التعيين');
      render();
      break;

    case 'open-reading': {
      const r = Data.reading(el.dataset.id);
      if (!r) break;
      Sheet.open(`
        <h3>${esc(r.titleAr || r.title)}</h3>
        <div style="font-size:64px;text-align:center;margin:8px 0">${esc(r.emoji || '📖')}</div>
        <div style="background:var(--surface);padding:14px;border-radius:14px;font-family:var(--font-en);font-size:15px;line-height:1.9">
          ${esc(r.text)}
        </div>
        <div style="background:var(--surface);padding:14px;border-radius:14px;margin-top:10px;font-size:13px;line-height:1.9;color:var(--text-3)">
          ${esc(r.textAr || '')}
        </div>
      `);
      break;
    }

    case 'open-conv': {
      const c = Data.conversation(el.dataset.id);
      if (c) toast('محادثة: ' + (c.titleAr || c.title));
      break;
    }
  }
});

/* ============================================================================
   21) PWA install
   ============================================================================ */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__deferredInstallPrompt = e;
});

/* ============================================================================
   22) Bootstrap
   ============================================================================ */
async function init() {
  const failed = await loadModules();

  const boot = $('#boot');
  if (boot) setTimeout(() => boot.classList.add('hide'), 400);

  try {
    const s = Store.settings;
    if (s.uiLang) setUiLang(s.uiLang);
  } catch {}

  document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = uiLang;

  State.allEntriesCache = Data.allEntries();
  console.info('[LEA] entries:', State.allEntriesCache.length, '| levels:', Data.levels().length);

  State.feed.cards = buildFeed();
  State.feed.index = 0;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('[SW]', e));
  }

  render();

  if (failed.length) {
    setTimeout(() => toast('⚠️ وحدات لم تُحمّل: ' + failed.join(', '), 5000), 600);
  }
}

init().catch((e) => {
  console.error('[LEA] init failed:', e);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `<div style="padding:40px;text-align:center;color:#fca5a5;font-family:Cairo,sans-serif">
      تعذّر بدء التطبيق: ${esc(e.message)}
    </div>`;
  }
});