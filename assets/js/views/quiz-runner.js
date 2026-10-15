/* ============================================================
   محرّك تشغيل الأسئلة — يُستخدم في التدريبات والاختبارات والمطالعات
   ============================================================ */
import { esc, shuffle, clamp, pct, toast, confetti, openModal, closeModal } from '../core/utils.js';
import { speak, beep } from '../core/speech.js';
import { recordAnswer } from '../core/gamify.js';
import { gradeItem } from '../core/srs.js';
import { settings } from '../core/store.js';
import { normArPublic, normEnPublic } from '../core/quizgen.js';
import { t } from '../core/i18n.js';

/* ---------- تشابه النصوص لتحقق مرن ---------- */
function similarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > Math.max(3, Math.round(Math.max(m, n) * 0.45))) return 0;
  const dp = Array.from({ length: m + 1 }, (_, i) => { const row = new Array(n + 1).fill(0); row[0] = i; return row; });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return 1 - dp[m][n] / Math.max(m, n);
}

function stripAl(s) { return s.startsWith('ال') && s.length > 3 ? s.slice(2) : s; }

export function checkTextAnswer(raw, q) {
  const isAr = q.inputDir === 'rtl';
  const value = isAr ? normArPublic(raw) : normEnPublic(raw);
  if (!value) return { ok: false, near: false };
  const accepted = q.accept || [];
  for (const a of accepted) {
    if (value === a) return { ok: true, near: false };
    if (isAr && stripAl(value) === stripAl(a)) return { ok: true, near: false };
    const sim = similarity(value, a);
    if (sim >= 0.9) return { ok: true, near: true };
    if (sim >= 0.78 && value.length >= 4) return { ok: true, near: true };
  }
  return { ok: false, near: false };
}

function celebrateBadges(badges) {
  if (!badges || !badges.length) return;
  confetti(70);
  badges.forEach((b) => toast(`${b.icon} ${b.ar}`, 'ok', t('quiz.newBadge')));
}

/* ---------- إدارة المؤقّتات النشطة (تتوقف عند مغادرة الصفحة) ---------- */
const activeTimers = new Set();

export function stopActiveQuizzes() {
  activeTimers.forEach((id) => { try { clearInterval(id); } catch {} });
  activeTimers.clear();
}

/* ---------- الواجهة ---------- */
export function runQuiz(host, opts = {}) {
  if (!host) { console.warn('runQuiz: لم يتم العثور على حاوية الأسئلة'); return null; }
  const questions = opts.questions || [];
  if (!questions.length) {
    host.innerHTML = `<div class="empty"><span class="ico">🤷</span><p>${esc(t('drills.noSource'))}</p></div>`;
    return null;
  }

  const weightOf = (q) => (q.ui === 'match' ? (q.pairs ? q.pairs.length : 1) : 1);
  const totalWeight = questions.reduce((n, q) => n + weightOf(q), 0);

  const state = {
    i: 0,
    correct: 0,
    answered: 0,
    answers: [],
    start: Date.now(),
    qStart: Date.now(),
    timed: !!opts.timed,
    secondsLeft: opts.seconds || 0,
    timerId: null,
    finished: false,
    allowReveal: opts.allowReveal !== false,
    record: opts.recordStats !== false,
  };

  host.innerHTML = `
    <div class="quiz-shell">
      ${opts.title ? `<div class="row row--between" style="margin-bottom:12px"><b>${esc(opts.title)}</b>${state.timed ? `<span class="timer" data-timer></span>` : ''}</div>` : ''}
      <div class="quiz-bar">
        <span class="quiz-counter" data-counter></span>
        <div class="progress"><i data-progress style="width:0%"></i></div>
        ${state.timed && !opts.title ? '<span class="timer" data-timer></span>' : ''}
      </div>
      <div data-qhost></div>
    </div>`;

  const qhost = host.querySelector('[data-qhost]');
  const progressEl = host.querySelector('[data-progress]');
  const counterEl = host.querySelector('[data-counter]');
  const timerEl = host.querySelector('[data-timer]');

  function updateBar() {
    const p = pct(state.answered, totalWeight);
    progressEl.style.width = p + '%';
    counterEl.textContent = `${state.answered} / ${totalWeight}`;
  }
  updateBar();

  if (state.timed) {
    const tick = () => {
      state.secondsLeft -= 1;
      if (timerEl) {
        const m = Math.floor(Math.max(0, state.secondsLeft) / 60);
        const s = Math.max(0, state.secondsLeft) % 60;
        timerEl.textContent = `⏱ ${m}:${String(s).padStart(2, '0')}`;
        timerEl.classList.toggle('timer--low', state.secondsLeft <= 30);
      }
      if (state.secondsLeft <= 0) { finish('time'); }
    };
    tick();
    state.timerId = setInterval(tick, 1000);
    activeTimers.add(state.timerId);
  }

  function record(q, correct, seconds) {
    state.answered += weightOf(q);
    if (correct) state.correct += weightOf(q);
    state.answers.push({ q, correct });
    if (state.record) {
      const res = recordAnswer({
        correct, itemId: q.itemId || null, type: q.type, topic: q.topic, level: q.level,
        seconds: seconds || 0,
      });
      if (q.itemId) gradeItem(q.itemId, correct ? 2 : 0);
      if (res && res.badges && res.badges.length) celebrateBadges(res.badges);
    }
    beep(correct ? 'ok' : 'bad');
    updateBar();
  }

  function feedbackHTML(q, ok, extra = '') {
    const explain = q.explain ? `<div>${esc(q.explain).replace(/\n/g, '<br>')}</div>` : '';
    const example = q.showExample && ok === false
      ? `<div class="tiny muted" style="margin-top:6px">${esc(q.showExample.en)} — ${esc(q.showExample.ar)}</div>` : '';
    return `
      <div class="feedback ${ok ? 'feedback--ok' : 'feedback--bad'}">
        <b>${ok ? esc(t('quiz.correct')) : esc(t('quiz.wrong'))}</b>
        ${!ok && q.answerText ? `<div>${esc(t('quiz.theAnswer'))} <span class="answer-en">${esc(q.answerText)}</span></div>` : ''}
        ${explain}
        ${extra}
        ${example}
      </div>`;
  }

  function nextButtonHTML(label = t('common.next')) {
    return `<div class="row row--between" style="margin-top:16px">
      <span class="tiny muted">${state.i + 1} / ${questions.length}</span>
      <button class="btn btn--primary" data-next type="button">${esc(label)} →</button>
    </div>`;
  }

  function bindCommon(q) {
    qhost.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', () => {
      state.i += 1;
      if (state.i >= questions.length) finish('done');
      else renderQuestion();
    }));
    qhost.querySelectorAll('[data-say]').forEach((b) => b.addEventListener('click', () => {
      b.classList.add('is-speaking');
      speak(b.dataset.say, { onend: () => b.classList.remove('is-speaking') });
    }));
    qhost.querySelectorAll('[data-replay]').forEach((b) => b.addEventListener('click', () => speak(q.speakText)));
    const nxt = qhost.querySelector('[data-next]');
    if (nxt) nxt.focus({ preventScroll: true });
  }

  /* ----- نوع الاختيار ----- */
  function renderChoice(q) {
    const keys = ['A', 'B', 'C', 'D', 'E', 'F'];
    const opts = shuffle(q.options.slice());
    qhost.innerHTML = `
      <div class="q-card">
        <div class="q-prompt">${esc(q.instruction)}</div>
        ${q.stemHtml || ''}
        <div class="options ${opts.length <= 4 ? 'options--2' : ''}">
          ${opts.map((o, i) => `<button class="option" type="button" data-opt="${i}">
            <span class="option__key">${keys[i]}</span>
            <span class="option__label ${o.ltr ? 'en' : ''}">${esc(o.label)}</span>
          </button>`).join('')}
        </div>
        <div data-fb></div>
        ${state.allowReveal ? `<div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn btn--ghost btn--sm" type="button" data-reveal>${esc(t('drills.reveal'))}</button></div>` : ''}
      </div>`;

    let answered = false;
    const buttons = Array.from(qhost.querySelectorAll('[data-opt]'));
    const finishChoice = (chosenIdx, ok) => {
      if (answered) return;
      answered = true;
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (opts[i].correct) b.classList.add('is-correct');
        else if (i === chosenIdx) b.classList.add('is-wrong');
      });
      record(q, ok, (Date.now() - state.qStart) / 1000);
      qhost.querySelector('[data-fb]').innerHTML = feedbackHTML(q, ok);
      qhost.querySelector('[data-reveal]')?.remove();
      qhost.insertAdjacentHTML('beforeend', nextButtonHTML(state.i + 1 >= questions.length ? t('common.finish') : t('common.next')));
      bindCommon(q);
    };
    buttons.forEach((b, i) => b.addEventListener('click', () => finishChoice(i, !!opts[i].correct)));
    qhost.querySelector('[data-reveal]')?.addEventListener('click', () => {
      const correctIdx = opts.findIndex((o) => o.correct);
      finishChoice(-1, false);
      if (correctIdx >= 0) buttons[correctIdx].classList.add('is-correct');
    });
    bindCommon(q);
  }

  /* ----- نوع الكتابة ----- */
  function renderInput(q) {
    qhost.innerHTML = `
      <div class="q-card">
        <div class="q-prompt">${esc(q.instruction)}</div>
        ${q.stemHtml || ''}
        <div class="row" style="margin-top:12px;gap:8px">
          <input class="input translate-input ${q.inputDir === 'rtl' ? 'translate-input--ar' : ''}" data-answer
                 dir="${q.inputDir || 'ltr'}" placeholder="${esc(q.placeholder || '')}" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button class="btn btn--primary" type="button" data-check>${esc(t('common.check'))}</button>
        </div>
        <div data-fb></div>
        ${state.allowReveal ? `<div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn btn--ghost btn--sm" type="button" data-reveal>${esc(t('drills.reveal'))}</button></div>` : ''}
      </div>`;

    const input = qhost.querySelector('[data-answer]');
    const checkBtn = qhost.querySelector('[data-check]');
    let answered = false;
    const submit = () => {
      if (answered) return;
      const val = input.value.trim();
      if (!val) { input.focus(); return; }
      answered = true;
      const res = checkTextAnswer(val, q);
      input.disabled = true;
      checkBtn.disabled = true;
      record(q, res.ok, (Date.now() - state.qStart) / 1000);
      const extra = res.near && res.ok ? '<div class="tiny">إملاؤك قريب جداً من الصحيح 👌</div>' : '';
      qhost.querySelector('[data-fb]').innerHTML = feedbackHTML(q, res.ok, extra);
      qhost.querySelector('[data-reveal]')?.remove();
      qhost.insertAdjacentHTML('beforeend', nextButtonHTML(state.i + 1 >= questions.length ? t('common.finish') : t('common.next')));
      bindCommon(q);
      if (res.ok && q.answerText) speak(q.answerText);
    };
    checkBtn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    qhost.querySelector('[data-reveal]')?.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      input.value = q.answerText || '';
      input.disabled = true; checkBtn.disabled = true;
      record(q, false, (Date.now() - state.qStart) / 1000);
      qhost.querySelector('[data-fb]').innerHTML = feedbackHTML(q, false);
      qhost.querySelector('[data-reveal]')?.remove();
      qhost.insertAdjacentHTML('beforeend', nextButtonHTML(state.i + 1 >= questions.length ? t('common.finish') : t('common.next')));
      bindCommon(q);
    });
    setTimeout(() => input.focus({ preventScroll: true }), 60);
    bindCommon(q);
  }

  /* ----- نوع الترتيب ----- */
  function renderOrder(q) {
    const bank = q.tokens.map((w) => ({ t: w, used: false }));
    const chosen = [];
    qhost.innerHTML = `
      <div class="q-card">
        <div class="q-prompt">${esc(q.instruction)}</div>
        ${q.stemHtml || ''}
        <div class="dropzone" data-drop></div>
        <div class="word-bank" data-bank></div>
        <div class="row" style="justify-content:center;gap:8px">
          <button class="btn btn--primary" type="button" data-check>${esc(t('common.check'))}</button>
          <button class="btn btn--ghost btn--sm" type="button" data-undo>↺ تراجع</button>
        </div>
        <div data-fb></div>
        ${state.allowReveal ? `<div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn btn--ghost btn--sm" type="button" data-reveal>${esc(t('drills.reveal'))}</button></div>` : ''}
      </div>`;

    const drop = qhost.querySelector('[data-drop]');
    const bankEl = qhost.querySelector('[data-bank]');
    let answered = false;

    const paint = () => {
      drop.innerHTML = chosen.map((w, i) => `<button class="word-chip" type="button" data-rm="${i}">${esc(w)}</button>`).join('');
      bankEl.innerHTML = bank.map((w, i) => `<button class="word-chip ${w.used ? 'is-used' : ''}" type="button" data-add="${i}">${esc(w.t)}</button>`).join('');
      drop.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => {
        if (answered) return;
        const idx = Number(b.dataset.rm);
        bank[chosen[idx].idx].used = false;
        chosen.splice(idx, 1);
        paint();
      }));
      bankEl.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => {
        if (answered) return;
        const idx = Number(b.dataset.add);
        if (bank[idx].used) return;
        bank[idx].used = true;
        chosen.push({ t: bank[idx].t, idx });
        paint();
      }));
    };
    paint();

    qhost.querySelector('[data-undo]')?.addEventListener('click', () => {
      if (answered) return;
      const last = chosen.pop();
      if (last) bank[last.idx].used = false;
      paint();
    });

    const submit = () => {
      if (answered) return;
      if (!chosen.length) return;
      answered = true;
      const attempt = chosen.map((c) => c.t).join(' ');
      const target = q.correctOrder.join(' ');
      const ok = normEnPublic(attempt) === normEnPublic(target);
      record(q, ok, (Date.now() - state.qStart) / 1000);
      qhost.querySelector('[data-fb]').innerHTML = feedbackHTML(q, ok, `<div class="tiny" style="margin-top:6px">جملتك: <span class="en">${esc(attempt)}</span></div>`);
      qhost.querySelector('[data-reveal]')?.remove();
      qhost.insertAdjacentHTML('beforeend', nextButtonHTML(state.i + 1 >= questions.length ? t('common.finish') : t('common.next')));
      bindCommon(q);
      if (ok) speak(target);
    };
    qhost.querySelector('[data-check]').addEventListener('click', submit);
    qhost.querySelector('[data-reveal]')?.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      qhost.querySelector('[data-fb]').innerHTML = feedbackHTML(q, false, `<div class="tiny en" style="margin-top:6px">${esc(q.correctOrder.join(' '))}</div>`);
      record(q, false, (Date.now() - state.qStart) / 1000);
      qhost.querySelector('[data-reveal]')?.remove();
      qhost.insertAdjacentHTML('beforeend', nextButtonHTML(state.i + 1 >= questions.length ? t('common.finish') : t('common.next')));
      bindCommon(q);
    });
    bindCommon(q);
  }

  /* ----- نوع المطابقة ----- */
  function renderMatch(q) {
    const left = shuffle(q.pairs.map((p, i) => ({ ...p, i })));
    const right = shuffle(q.pairs.map((p, i) => ({ ...p, i })));
    qhost.innerHTML = `
      <div class="q-card">
        <div class="q-prompt">${esc(q.instruction)}</div>
        <div class="q-hint">${esc(t('drills.matchInstr'))}</div>
        <div class="match-grid" style="margin-top:16px">
          <div class="match-col match-col--en" data-left>
            ${left.map((p) => `<button class="match-item" type="button" data-side="en" data-i="${p.i}">${esc(p.en)}</button>`).join('')}
          </div>
          <div class="match-col" data-right>
            ${right.map((p) => `<button class="match-item" type="button" data-side="ar" data-i="${p.i}">${esc(p.ar)}</button>`).join('')}
          </div>
        </div>
        <div data-fb></div>
      </div>`;

    let selected = null;
    let done = 0;
    const total = q.pairs.length;
    const wrongTries = { };

    const onClick = (btn) => {
      const side = btn.dataset.side;
      const idx = Number(btn.dataset.i);
      if (btn.classList.contains('is-done')) return;
      if (!selected) {
        if (side !== 'en') return;
        qhost.querySelectorAll('[data-side="en"]').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selected = { idx, btn };
        return;
      }
      if (side === 'en') {
        qhost.querySelectorAll('[data-side="en"]').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selected = { idx, btn };
        return;
      }
      // side === ar
      const ok = idx === selected.idx;
      if (ok) {
        btn.classList.add('is-done');
        selected.btn.classList.remove('is-selected');
        selected.btn.classList.add('is-done');
        record(q, true, (Date.now() - state.qStart) / 1000);
        const pair = q.pairs[idx];
        speak(pair.en);
        selected = null;
        done += 1;
        if (done >= total) {
          qhost.querySelector('[data-fb]').innerHTML = feedbackHTML(q, true, `<div class="tiny">أتممت مطابقة ${total} عناصر ✅</div>`);
          qhost.insertAdjacentHTML('beforeend', nextButtonHTML(state.i + 1 >= questions.length ? t('common.finish') : t('common.next')));
          bindCommon(q);
        }
      } else {
        wrongTries[idx] = (wrongTries[idx] || 0) + 1;
        btn.classList.add('is-shake');
        setTimeout(() => btn.classList.remove('is-shake'), 340);
        if (wrongTries[idx] === 1) record(q, false, (Date.now() - state.qStart) / 1000);
      }
    };

    qhost.querySelectorAll('.match-item').forEach((b) => b.addEventListener('click', () => onClick(b)));
  }

  /* ----- العرض ----- */
  function keepInView() {
    // لا نقفز لأعلى الصفحة بعد كل إجابة: نُحرّك فقط إذا خرجت بطاقة السؤال عن الشاشة
    const shell = host.querySelector('.quiz-shell') || host;
    if (!shell || !document.body.contains(shell)) return;
    const r = shell.getBoundingClientRect();
    if (r.top < 0) shell.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  function renderQuestion() {
    const q = questions[state.i];
    state.qStart = Date.now();
    if (!q) { finish('done'); return; }
    if (q.ui === 'input') renderInput(q);
    else if (q.ui === 'order') renderOrder(q);
    else if (q.ui === 'match') renderMatch(q);
    else renderChoice(q);
    if (q.speakText && (q.autoSpeak || settings.autoSpeak)) setTimeout(() => speak(q.speakText), 220);
    if (state.i > 0) keepInView();
  }

  /* ----- النهاية ----- */
  function finish(reason = 'done') {
    if (state.finished) return;
    state.finished = true;
    if (state.timerId) { clearInterval(state.timerId); activeTimers.delete(state.timerId); }
    const seconds = Math.round((Date.now() - state.start) / 1000);
    const accuracy = totalWeight ? Math.round((state.correct / totalWeight) * 100) : 0;
    const result = {
      correct: state.correct, total: totalWeight, accuracy, seconds,
      questions, answers: state.answers, reason,
      perfect: state.correct === totalWeight,
    };
    if (opts.onFinish) { opts.onFinish(result); return; }
    renderSummary(result);
  }

  function renderSummary(result) {
    const stars = result.accuracy >= 90 ? 3 : result.accuracy >= 70 ? 2 : result.accuracy >= 50 ? 1 : 0;
    const wrong = result.answers.filter((a) => !a.correct);
    host.innerHTML = `
      <div class="quiz-shell">
        <div class="q-card center">
          <div style="font-size:3rem">${result.perfect ? '🏆' : result.accuracy >= 70 ? '🎉' : '💪'}</div>
          <h2>${esc(t('quiz.finished'))}</h2>
          <div class="q-main">${result.correct} / ${result.total}</div>
          <div class="stars" style="font-size:1.5rem">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
          <p class="muted">${esc(t('stats.accuracy'))}: <b>${result.accuracy}%</b> · ${esc(t('quiz.timeSpent'))}: <b>${result.seconds}</b> ث</p>
          <div class="row" style="justify-content:center;gap:8px;margin-top:16px;flex-wrap:wrap">
            ${opts.retryLabel !== false ? `<button class="btn btn--primary" type="button" data-again>${esc(t('common.retry'))}</button>` : ''}
            ${opts.onHome !== false ? `<a class="btn" href="#/">${esc(t('quiz.goHome'))}</a>` : ''}
            ${opts.extraActionsHtml || ''}
          </div>
        </div>
        ${wrong.length ? `<div class="card" style="margin-top:16px">
          <div class="card__title"><span class="ico">📝</span><h3>${esc(t('exam.review'))}</h3></div>
          ${wrong.map((a) => `<div class="item-row">
            <span class="item-row__en">${esc(a.q.answerText || (a.q.correctOrder ? a.q.correctOrder.join(' ') : ''))}</span>
            <span class="item-row__ar">${esc(a.q.explain || '')}</span>
          </div>`).join('')}
        </div>` : ''}
      </div>`;

    host.querySelector('[data-again]')?.addEventListener('click', () => {
      if (opts.onRetry) opts.onRetry();
      else { host.innerHTML = ''; runQuiz(host, opts); }
    });

    if (result.accuracy >= 70) confetti(result.perfect ? 120 : 60);
    if (opts.onSummary) opts.onSummary(result);
  }

  renderQuestion();
  return {
    finish,
    state,
    destroy() { if (state.timerId) clearInterval(state.timerId); },
    get result() { return { correct: state.correct, total: totalWeight, seconds: Math.round((Date.now() - state.start) / 1000) }; },
  };
}

/* اختصار: بطاقات أسئلة المطالعة */
export function readingQuestions(reading) {
  return (reading.questions || []).map((qq, i) => ({
    id: `read-${reading.id}-${i}`,
    type: 'mcq', ui: 'choice', itemId: `rd:${reading.id}:${i}`,
    level: reading.level, topic: reading.id, topicTitle: reading.titleAr,
    instruction: qq.qAr ? `${qq.qAr}` : qq.q,
    stemHtml: `<div class="q-main" style="font-size:1.15rem">${esc(qq.q)}</div>`,
    speakText: qq.q,
    options: qq.options.map((o, oi) => ({ label: o, correct: oi === qq.answer, ltr: true })),
    explain: qq.explain || '',
    showExample: null,
  }));
}
