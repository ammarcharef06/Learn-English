/* ============================================================
   قسم «من الصفر» (A0) — صفحة المرحلة + تدريب المرحلة (٥ أسئلة)
   ============================================================ */
import { esc, qs, qsa, speakBtn, toast, confetti, openModal, closeModal } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { speak } from '../core/speech.js';
import { progress } from '../core/store.js';
import { renderSidebarStats } from './shell.js';
import { pageHead, progressBar } from './shell.js';
import {
  ZERO_STAGES, zeroStage, zeroItems, zeroStageQuestions, zeroStageSize, READINGS,
} from '../data/zero.js';
import {
  zeroSnapshot, markStageSeen, markStageDone, markLetter, markDigraph, markWord, markSentence,
  markReadingDone, applyAnswer, zeroPrefs, setZeroPrefs, markPadUsed, recordStageDrill,
} from '../core/zeroflow.js';
import { runQuiz } from './quiz-runner.js';
import { createNarrator } from './zero.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';

const KIND_LABEL = {
  letters: 'حرفاً', digraphs: 'حرفاً مركّباً', numbers: 'رقماً', time: 'عنصر وقت',
  pronouns: 'ضميراً وجملة', words: 'كلمة', sentences: 'جملة', reading: 'سطر قراءة',
};

/* ---------- نافذة لوح الكتابة لأي عنصر ---------- */
export function openWritePad(text, opts = {}) {
  const prefs = zeroPrefs();
  const root = openModal({
    title: `✍️ تدرّب على كتابة: ${text}`,
    wide: true,
    body: `<div id="padModalHost"></div>`,
    actions: [{ label: 'إغلاق', variant: 'ghost' }],
  });
  const holder = root.querySelector('#padModalHost');
  holder.innerHTML = writingPadHTML({ text, mode: prefs.padMode, ar: opts.ar || '', pron: opts.pron || '' });
  const pad = initWritingPad(holder, {
    text,
    mode: prefs.padMode,
    ar: opts.ar || '',
    pron: opts.pron || '',
    onChange: (mode) => setZeroPrefs({ padMode: mode }),
    onDraw: () => { const r = markPadUsed(); if (r.milestone) toast('أول كتابة على اللوح — أحسنت! ✍️', 'ok'); },
  });
  root.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', () => { pad?.destroy?.(); }));
  return pad;
}

/* ---------- بطاقة عنصر واحد ---------- */
function masteryOf(kind, it, raw) {
  if (kind === 'letters') return !!raw.letters?.[it.en.trim().split(/\s+/)[0].toLowerCase()];
  if (kind === 'digraphs') return !!raw.digraphs?.[it.comboId];
  if (kind === 'words') return !!raw.words?.[it.en];
  if (kind === 'sentences') return !!raw.sentences?.[it.en];
  return false;
}

function itemCard(it, kind, ctx) {
  const busy = masteryOf(kind, it, ctx.raw);
  const big = kind === 'letters' || kind === 'digraphs';
  /* ما يُنطق فعلاً: الحرف مرة واحدة (say) وليس العرض المزدوج "A a" */
  const say = it.say || it.en;
  const lines = [];
  if (it.soundAr) lines.push(`<span class="chip">🔉 الصوت: ${esc(it.soundAr)}</span>`);
  if (it.word) lines.push(`<span class="chip">${it.emoji || '📘'} ${esc(it.word)} = ${esc(it.wordAr || '')} <span class="muted">(${esc(it.wordPronAr || '')})</span></span>`);
  if (it.pron && !big) lines.push(`<span class="chip">🗣️ ${esc(it.pron)}</span>`);

  return `<div class="zero-card ${busy ? 'zero-card--done' : ''}" data-item="${esc(it.key)}" data-say-text="${esc(say)}">
    <div class="zero-card__top">
      <div class="zero-card__en ${big ? 'zero-card__en--big' : ''}" dir="ltr">${esc(it.en)}${it.emoji && !big ? ` <span class="zero-card__emoji">${it.emoji}</span>` : ''}</div>
      ${busy ? '<span class="chip chip--ok">✅ متقن</span>' : ''}
    </div>
    ${it.ar ? `<div class="zero-card__ar">${esc(it.ar)}</div>` : ''}
    ${lines.length ? `<div class="row wrap zero-card__chips" style="gap:6px">${lines.join('')}</div>` : ''}
    ${it.tipAr ? `<div class="tiny muted zero-card__tip">💡 ${esc(it.tipAr)}</div>` : ''}
    ${it.extra ? `<div class="small zero-card__extra" dir="ltr">${esc(it.extra)}</div><div class="tiny muted">${esc(it.extraAr || '')}</div>` : ''}
    <div class="row wrap zero-card__acts" style="gap:6px">
      ${speakBtn(say)}
      ${it.word && it.word !== say ? speakBtn(it.word, 'speak-btn--word') : ''}
      <button class="btn btn--ghost btn--sm" type="button" data-slow="${esc(say)}" title="نطق بطيء">🐢 ببطء</button>
      <button class="btn btn--ghost btn--sm" type="button" data-write="${esc(it.word || it.en)}" data-write-ar="${esc(it.ar || '')}" title="اكتبها على اللوح">✍️ اكتب</button>
      <button class="btn btn--ghost btn--sm" type="button" data-master="${esc(it.key)}" title="${busy ? 'إلغاء الإتقان' : 'وسمها كمتقنة'}">${busy ? '↩︎ إلغاء' : '✅ أتقنت'}</button>
      <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(it.word || it.en)}" data-ar="${esc(it.ar || '')}" title="أضف إلى دفتري">📒</button>
    </div>
  </div>`;
}

function bindCards(host, stage) {
  const raw = (progress.zero || {});
  qsa('[data-slow]', host).forEach((b) => b.addEventListener('click', () => speak(b.dataset.slow, { rate: 0.5 })));
  qsa('[data-write]', host).forEach((b) => b.addEventListener('click', () => openWritePad(b.dataset.write, { ar: b.dataset.writeAr })));
  qsa('[data-master]', host).forEach((b) => b.addEventListener('click', () => {
    const key = b.dataset.master;
    const kind = stage.kind;
    let badges = [];
    if (kind === 'letters') {
      const id = key.replace(/^letter:/, '');
      badges = markLetter(id, !(raw.letters || {})[id]);
    } else if (kind === 'digraphs') {
      const id = key.replace(/^digraph:/, '');
      badges = markDigraph(id, !(raw.digraphs || {})[id]);
    } else if (kind === 'words') {
      const en = key.replace(/^word:/, '');
      badges = markWord(en, !(raw.words || {})[en]);
    } else if (kind === 'sentences') {
      const en = key.replace(/^sent:/, '');
      badges = markSentence(en, !(raw.sentences || {})[en]);
    } else {
      // بقية الأنواع: نحفظها كعناصر متقنة عامة
      badges = markWord(key, !(raw.words || {})[key]);
    }
    if (badges && badges.length) toast(`🏅 ${badges.map((x) => x.ar).join(' · ')}`, 'ok');
    renderZeroStage(host, stage.id);
    renderSidebarStats();
  }));
  // نقرة على البطاقة = نطق (إذا كان النطق التلقائي مفعّلاً)
  qsa('.zero-card', host).forEach((card) => card.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('[data-say]')) return;
    if (!zeroPrefs().autoSpeak) return;
    const t = card.dataset.sayText;
    const el = card.querySelector('.zero-card__en');
    if (!t) return;
    if (el) { el.classList.add('is-speaking'); setTimeout(() => el.classList.remove('is-speaking'), 900); }
    speak(t);
  }));
}

/* ---------- صفحة المرحلة ---------- */
export function renderZeroStage(host, stageId) {
  const stage = zeroStage(stageId);
  if (!stage) { navigate('/zero'); return; }
  markStageSeen(stage.id);

  const snap = zeroSnapshot();
  const raw = snap.raw;
  const items = zeroItems(stage.id);
  const state = raw.stages?.[stage.id] || {};
  const prefs = zeroPrefs();
  const idx = ZERO_STAGES.findIndex((s) => s.id === stage.id);
  const nextStage = ZERO_STAGES[idx + 1];

  host.innerHTML = `
    ${pageHead({
      icon: stage.icon,
      title: `المرحلة ${stage.n}: ${stage.titleAr}`,
      subtitle: stage.subAr,
      actionsHtml: `
        <a class="btn" href="#/zero">← من الصفر</a>
        <button class="btn ${prefs.autoSpeak ? 'btn--primary' : ''}" type="button" id="zeroAutoBtn">🔊 النطق التلقائي: ${prefs.autoSpeak ? 'مفعّل' : 'مطفأ'}</button>`,
    })}

    <div class="card">
      <div class="row row--between wrap" style="gap:10px">
        <div class="row wrap" style="gap:8px">
          <span class="chip chip--brand">${items.length} ${KIND_LABEL[stage.kind] || 'عنصر'}</span>
          <span class="chip">⏱ ${stage.minutes} دقيقة</span>
          ${state.done ? '<span class="chip chip--ok">✅ أتممت هذه المرحلة</span>' : '<span class="chip chip--warn">لم تُكمل تدريبها بعد</span>'}
          ${state.best ? `<span class="chip">🎯 أفضل نتيجة ${state.best}%</span>` : ''}
        </div>
        <div class="row wrap" style="gap:8px">
          <a class="btn btn--primary" href="#/zero/drill/${stage.id}">🧪 تدريب المرحلة (٥ أسئلة)</a>
          <a class="btn" href="#/zero/pad">✍️ لوح الكتابة</a>
        </div>
      </div>
      <div class="mt-3">${progressBar(state.done ? 100 : (state.seen ? 45 : 0), state.done ? 'progress--ok' : '')}</div>
    </div>

    <div id="zeroStageBody" class="mt-4"></div>

    <div class="card mt-4">
      <div class="row row--between wrap" style="gap:10px">
        <div>
          <b>هل أنت جاهز للاختبار النهائي؟</b>
          <div class="small muted">الاختبار النهائي ٣٠ سؤالاً من كل المراحل — يمكنك تجربته في أي وقت.</div>
        </div>
        <div class="row wrap" style="gap:8px">
          <a class="btn" href="#/zero/exam">🧪 الاختبار النهائي</a>
          ${nextStage ? `<a class="btn btn--primary" href="#/zero/stage/${nextStage.id}">المرحلة التالية: ${esc(nextStage.titleAr)} ←</a>` : '<a class="btn btn--primary" href="#/zero/certificate">🎓 شهادة التأسيس</a>'}
        </div>
      </div>
    </div>`;

  const body = qs('#zeroStageBody', host);

  qs('#zeroAutoBtn', host)?.addEventListener('click', () => {
    const next = setZeroPrefs({ autoSpeak: !zeroPrefs().autoSpeak }).autoSpeak;
    qs('#zeroAutoBtn', host).classList.toggle('btn--primary', next);
    qs('#zeroAutoBtn', host).textContent = `🔊 النطق التلقائي: ${next ? 'مفعّل' : 'مطفأ'}`;
    toast(next ? 'النطق التلقائي مفعّل — انقر أي بطاقة لتسمعها 🔊' : 'النطق التلقائي مطفأ 🔇', 'info');
  });

  if (stage.kind === 'reading') {
    renderReadingStage(body, stage);
  } else if (stage.kind === 'words') {
    body.innerHTML = snap.wordGroups.map((g) => `
      <div class="card mt-3">
        <div class="card__title">
          <span class="ico" aria-hidden="true">${g.icon}</span>
          <h3>${esc(g.titleAr)}</h3>
          <span class="spacer chip ${g.learned === g.words.length ? 'chip--ok' : 'chip--brand'}">${g.learned}/${g.words.length}</span>
        </div>
        <div class="grid grid--3 grid--tight zero-grid">
          ${g.words.map((w) => itemCard({ key: `word:${w.en}`, en: w.en, ar: w.ar, pron: w.pron, emoji: w.emoji }, 'words', { raw })).join('')}
        </div>
      </div>`).join('');
    createNarrator(body, snap.wordGroups.flatMap((g) => g.words.map((w) => w.en)));
    bindCards(body, stage);
  } else {
    const kind = stage.kind;
    const cards = items.map((it) => {
      if (kind === 'digraphs') {
        const d = snap.digraphList.find((x) => x.combo === it.en && x.word === it.word) || snap.digraphList.find((x) => x.combo === it.en);
        return itemCard({ ...it, comboId: d ? d.id : it.en }, 'digraphs', { raw });
      }
      if (kind === 'letters') {
        const l = snap.letterList.find((x) => `${x.upper} ${x.lower}` === it.en) || snap.letterList.find((x) => it.en.startsWith(x.upper));
        return itemCard({ ...it, letterId: l ? l.id : it.en.trim().toLowerCase() }, 'letters', { raw });
      }
      return itemCard(it, kind, { raw });
    }).join('');

    body.innerHTML = `<div class="card">
      <div class="grid ${kind === 'letters' || kind === 'digraphs' ? 'grid--3' : 'grid--2'} grid--tight zero-grid">${cards}</div>
    </div>`;

    /* النطق التلقائي: الحرف مرة واحدة (say) لا "A a" مرّتين */
    createNarrator(body, items.map((it) => it.say || it.en));
    bindCards(body, stage);
  }

  renderSidebarStats();
}

/* ---------- صفحة القراءات ( داخل مرحلة القراءة ) ---------- */
function renderReadingStage(body, stage) {
  body.innerHTML = READINGS.map((r) => {
    const done = (progress.zero?.readings || {})[r.id]?.done;
    return `<div class="card mt-3 zero-reading">
      <div class="card__title">
        <span class="ico" aria-hidden="true">${r.emoji || '📖'}</span>
        <h3 dir="ltr">${esc(r.titleEn)}</h3>
        <span class="chip">${esc(r.titleAr)}</span>
        ${done ? '<span class="chip chip--ok">✅ أتممتها</span>' : ''}
      </div>
      <div class="zero-reading__lines">
        ${r.lines.map((l, i) => `<div class="zero-line">
          <span class="zero-line__n">${i + 1}</span>
          <span class="zero-line__en" dir="ltr">${esc(l.en)}</span>
          <span class="zero-line__ar">${esc(l.ar)}</span>
          <span class="zero-line__pron">🗣️ ${esc(l.pron)}</span>
          ${speakBtn(l.en)}
        </div>`).join('')}
      </div>
      <div class="row wrap" style="gap:8px">
        <button class="btn btn--sm btn--primary" type="button" data-read-quiz="${r.id}">🧪 اختبر فهمي (${r.questions.length} أسئلة)</button>
        <button class="btn btn--sm" type="button" data-read-speak="${r.id}">🔊 اقرأ لي النص كاملاً</button>
        <button class="btn btn--sm" type="button" data-read-slow="${r.id}">🐢 ببطء</button>
      </div>
      <div class="mt-3" id="readQuiz-${r.id}"></div>
    </div>`;
  }).join('');

  // شريط النطق التلقائي لأسطر المرحلة
  createNarrator(body, READINGS.flatMap((r) => r.lines.map((l) => l.en)));

  qsa('[data-read-speak]', body).forEach((b) => b.addEventListener('click', () => {
    const r = READINGS.find((x) => x.id === b.dataset.readSpeak);
    if (!r) return;
    let i = 0;
    const go = () => {
      if (i >= r.lines.length) return;
      speak(r.lines[i].en, { onend: () => { i += 1; setTimeout(go, 260); } });
      setTimeout(() => { if (i < r.lines.length) { i += 1; go(); } }, 2600);
    };
    go();
  }));
  qsa('[data-read-slow]', body).forEach((b) => b.addEventListener('click', () => {
    const r = READINGS.find((x) => x.id === b.dataset.readSlow);
    if (!r) return;
    speak(r.lines.map((l) => l.en).join(' ... '), { rate: 0.5 });
  }));
  qsa('[data-read-quiz]', body).forEach((b) => b.addEventListener('click', () => {
    const r = READINGS.find((x) => x.id === b.dataset.readQuiz);
    if (!r) return;
    const hostEl = qs(`#readQuiz-${r.id}`, body);
    hostEl.scrollIntoView({ block: 'center' });
    runQuiz(hostEl, {
      title: `📖 ${r.titleEn} — فهم المقروء`,
      questions: r.questions.map((qq, qi) => ({
        id: `zrq-${r.id}-${qi}`, type: 'mcq', ui: 'choice', itemId: `zero:read:${r.id}:${qi}`,
        level: 'a0', topic: 'reading', topicTitle: r.titleAr,
        instruction: qq.qAr || 'اختر الإجابة الصحيحة',
        stemHtml: `<div class="q-main" dir="ltr">${esc(qq.q)}</div>`,
        speakText: qq.q,
        options: qq.options.map((o, oi) => ({ label: o, correct: oi === qq.answer, ltr: true })),
        answerText: qq.options[qq.answer],
        explain: qq.explain || '',
      })),
      onSummary: (res) => {
        markReadingDone(r.id, res.correct, res.total);
        renderSidebarStats();
      },
      extraActionsHtml: `<a class="btn" href="#/zero/stage/reading">${esc('بقية القراءات')}</a>`,
    });
  }));

  // أزرار الإتقان/الكتابة داخل أسطر القراءة
  bindCards(body, stage);
}

/* ---------- تدريب المرحلة (٥ أسئلة) ---------- */
export function renderZeroDrill(host, stageId) {
  const stage = zeroStage(stageId);
  const questions = zeroStageQuestions(stage.id, 5);
  if (!questions.length) {
    host.innerHTML = `<div class="empty"><span class="ico" aria-hidden="true">🤷</span><p>لا أسئلة لهذه المرحلة بعد.</p>
      <a class="btn btn--primary mt-3" href="#/zero">إلى من الصفر</a></div>`;
    return;
  }
  const idx = ZERO_STAGES.findIndex((s) => s.id === stage.id);
  const nextStage = ZERO_STAGES[idx + 1];

  host.innerHTML = `
    <div class="row row--between wrap mb-3" style="gap:10px">
      <div class="row wrap" style="gap:10px">
        <a class="btn btn--sm" href="#/zero/stage/${stage.id}">← ${esc(stage.titleAr)}</a>
        <b>${stage.icon} تدريب المرحلة ${stage.n}</b>
      </div>
      <span class="chip chip--brand">٥ أسئلة · ${esc(KIND_LABEL[stage.kind] || 'منهج التأسيس')}</span>
    </div>
    <div id="zeroDrillRun"></div>`;

  runQuiz(qs('#zeroDrillRun', host), {
    questions,
    allowReveal: true,
    onSummary: (res) => {
      // 1) إتقان العناصر التي أُجيب عنها بشكل صحيح
      let badges = [];
      for (const a of res.answers) if (a.correct) badges = badges.concat(applyAnswer(a.q.itemId, true));
      // 2) تسجيل محاولة التدريب دائماً، وإتمام المرحلة عند ٨٠٪ أو أكثر
      const r = recordStageDrill(stage.id, res.accuracy);
      badges = badges.concat(r.badges);
      if (r.justCompleted) {
        confetti(70);
        toast(`✅ أتممت المرحلة ${stage.n}: ${stage.titleAr}`, 'ok');
      } else if (res.accuracy >= 80) {
        toast('✅ مراجعة ناجحة — المرحلة مكتملة مسبقاً', 'ok');
      } else {
        toast(`نتيجتك ${res.accuracy}% — تحتاج ٨٠٪ لإتمام المرحلة 💪`, 'warn');
      }
      if (badges.length) toast(`🏅 ${[...new Set(badges.map((b) => b.ar))].join(' · ')}`, 'ok');
      renderSidebarStats();
    },
    extraActionsHtml: `
      <a class="btn" href="#/zero/stage/${stage.id}">مراجعة المرحلة</a>
      ${nextStage ? `<a class="btn btn--primary" href="#/zero/stage/${nextStage.id}">المرحلة ${nextStage.n}: ${esc(nextStage.titleAr)} ←</a>` : '<a class="btn btn--primary" href="#/zero/exam">🧪 الاختبار النهائي ←</a>'}`,
  });
}

export { ZERO_STAGES };
