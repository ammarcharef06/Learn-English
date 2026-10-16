/* ============================================================
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
import { bar, stat, itemsLabel } from './zero.js';

/* مراحل تُعرَض عنصراً واحداً في البطاقة */
const FOCUS_KINDS = new Set(['letters', 'digraphs']);

const SENT_GROUP_AR = {
  greetings: 'تحيات', intro: 'تعريف بالنفس', family: 'العائلة', school: 'المدرسة',
  daily: 'يوميات', questions: 'أسئلة', shopping: 'تسوّق', polite: 'مجاملة',
};
const TIME_GROUP_AR = { day: 'أيام الأسبوع', month: 'شهور السنة', season: 'فصول السنة', time: 'عبارات الوقت', clock: 'قول الساعة' };

function rate() { return zeroPrefs().slowRate <= 0.6 ? 0.55 : undefined; }
function say(text, slow = false) {
  if (!text) return;
  speak(text, slow ? { rate: 0.5 } : { rate: rate() });
}
/** نطق اسم الحرف (النطق المدمج في المتصفح) */
function sayName(it, slow = false) {
  if (!it) return;
  say(it.say || it.en, slow);
}
/** نطق كلمة المثال */
function sayWord(it, slow = false) {
  if (!it || !it.word) return;
  say(it.word, slow);
}

/* ============================================================
   تفاصيل العنصر + لوح الكتابة
   ============================================================ */
export function openDetails(it) {
  const rows = [];
  if (it.ar) rows.push(`<div class="zero-info"><span class="zero-info__k">المعنى</span><span class="zero-info__v">${esc(it.ar)}</span></div>`);
  if (it.pron) rows.push(`<div class="zero-info"><span class="zero-info__k">النطق</span><span class="zero-info__v">${esc(it.pron)}</span></div>`);
  if (it.soundAr) rows.push(`<div class="zero-info"><span class="zero-info__k">الصوت</span><span class="zero-info__v">${esc(it.soundAr)}</span></div>`);
  if (it.word) rows.push(`<div class="zero-info"><span class="zero-info__k">مثال</span><span class="zero-info__v"><b dir="ltr">${esc(it.word)}</b> · ${esc(it.wordPronAr || '')} · ${esc(it.wordAr || '')}</span></div>`);
  if (it.extra) rows.push(`<div class="zero-info"><span class="zero-info__k">جملة</span><span class="zero-info__v"><b dir="ltr">${esc(it.extra)}</b> · ${esc(it.extraAr || '')}</span></div>`);

  openModal({
    title: 'تفاصيل',
    body: `
      <div class="stack">
        <div class="center" style="text-align:center">
          <div style="font-family:var(--font-en);font-size:2rem;font-weight:800" dir="ltr">${esc(it.en)}</div>
        </div>
        <div class="stack" style="gap:10px">${rows.join('')}</div>
        ${it.tipAr ? `<div class="tip-box tip-box--brand">${esc(it.tipAr)}</div>` : ''}
        <div class="row row--wrap" style="gap:8px">
          <button class="btn btn--primary" type="button" data-play="${esc(it.say || it.en)}">${it.nameAr ? '🔊 اسمه' : '🔊 الصوت'}</button>
          <button class="btn" type="button" data-play-slow="${esc(it.say || it.en)}">🐢 ببطء</button>
          ${it.word ? `<button class="btn" type="button" data-play="${esc(it.word)}">🔊 كلمة المثال</button>` : ''}
        </div>
      </div>`,
    actions: [{ label: 'إغلاق', variant: 'ghost' }],
    onMount: (root) => {
      qsa('[data-play]', root).forEach((b) => b.addEventListener('click', () => say(b.dataset.play)));
      qsa('[data-play-slow]', root).forEach((b) => b.addEventListener('click', () => say(b.dataset.playSlow, true)));
    },
  });
}

export function openWritePad(text, ar = '') {
  const prefs = zeroPrefs();
  const root = openModal({
    title: `اكتب: ${text}`,
    wide: true,
    body: `<div id="padModalHost"></div>`,
    actions: [{ label: 'إغلاق', variant: 'ghost' }],
  });
  const holder = root.querySelector('#padModalHost');
  holder.innerHTML = writingPadHTML({ text, mode: prefs.padMode, ar });
  const pad = initWritingPad(holder, {
    text, mode: prefs.padMode, ar,
    onChange: (mode) => setZeroPrefs({ padMode: mode }),
    onDraw: () => { const r = markPadUsed(); if (r.milestone) toast('أول كتابة على اللوح — أحسنت ✍️', 'ok'); },
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
  return `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">${stage.icon}</span><h1>${esc(stage.titleAr)}</h1></div>
        <p>${esc(stage.subAr)}</p>
        <div class="row row--wrap mt-3" style="gap:8px">
          <span class="chip chip--brand">${esc(itemsLabel(zeroItems(stage.id).length))}</span>
          <span class="chip chip--line">⏱ ${arNum(stage.minutes)} دقيقة</span>
          ${state.done ? `<span class="chip chip--ok">✅ مكتملة · ${arNum(state.best)}٪</span>` : (state.seen ? '<span class="chip chip--warn">بدأت ولم تُكمل</span>' : '')}
        </div>
      </div>
      <div class="row row--wrap">
        <a class="btn btn--sm" href="#/zero">← المراحل</a>
        <button class="btn btn--sm" type="button" id="zAutoBtn">${zeroPrefs().autoSpeak ? '🔊 النطق التلقائي: مفعّل' : '🔇 النطق التلقائي: مطفأ'}</button>
        <a class="btn btn--sm" href="#/zero/drill/${stage.id}">🧪 تدريب المرحلة</a>
        ${next
          ? `<a class="btn btn--sm" href="#/zero/stage/${next.id}">${esc(next.titleAr)} ←</a>`
          : '<a class="btn btn--sm" href="#/zero/exam">الاختبار النهائي ←</a>'}
      </div>
    </div>`;
}

function bindAutoBtn(host) {
  qs('#zAutoBtn', host)?.addEventListener('click', () => {
    const on = setZeroPrefs({ autoSpeak: !zeroPrefs().autoSpeak }).autoSpeak;
    const b = qs('#zAutoBtn', host);
    if (b) b.textContent = on ? '🔊 النطق التلقائي: مفعّل' : '🔇 النطق التلقائي: مطفأ';
    toast(on ? 'النطق التلقائي مفعّل 🔊' : 'النطق التلقائي مطفأ 🔇', 'info');
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
        <h3>${isLetters ? 'كل الحروف' : 'كل الحروف المركّبة'}</h3>
        <span class="spacer small muted">انقر أيّها تشاء للانتقال إليه</span>
      </div>
      <div class="zero-strip" id="zStrip">
        ${items.map((x, k) => `<button type="button" data-jump="${k}" dir="ltr" aria-label="انتقل إلى ${esc(x.en)}">${esc(isLetters ? x.en.split(/\s+/)[0] : x.en)}</button>`).join('')}
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
          <span class="chip chip--brand">الخطوة ${arNum(i + 1)} من ${arNum(items.length)}</span>
          ${done ? '<span class="chip chip--ok">✅ متقن</span>' : ''}
        </div>
        <div class="mt-3">${bar(((i + 1) / items.length) * 100)}</div>

        <div class="zero-letter" data-hear>
          ${lead}
        </div>

        <div class="grid grid--3" style="gap:12px">
          ${isLetters ? `<div class="zero-info"><span class="zero-info__k">الاسم</span><span class="zero-info__v">${esc(it.ar)}</span></div>` : ''}
          ${it.soundAr ? `<div class="zero-info"><span class="zero-info__k">${isLetters ? 'الصوت' : 'الصوت الذي يصنعه'}</span><span class="zero-info__v">${esc(it.soundAr)}</span></div>` : ''}
          ${it.word ? `<div class="zero-info"><span class="zero-info__k">كلمة عليها</span><span class="zero-info__v"><b dir="ltr">${esc(it.word)}</b> · ${esc(it.wordPronAr || '')} · ${esc(it.wordAr || '')}</span></div>` : ''}
        </div>

        <div class="row row--wrap mt-4" style="gap:8px">
          <button class="btn btn--primary" type="button" data-act="say">🔊 ${isLetters ? 'اسمه' : 'اسمع الصوت'}</button>
          ${it.word ? `<button class="btn" type="button" data-act="word">🔊 كلمة المثال</button>` : ''}
          <button class="btn" type="button" data-act="write">✍️ اكتبه</button>
          <button class="btn ${done ? 'btn--primary' : ''}" type="button" data-act="master">${done ? '✓ متقن' : '✅ أتقنت'}</button>
          <button class="btn btn--ghost" type="button" data-act="details">ℹ️ تفاصيل</button>
        </div>
      </div>

      <div class="row row--between mt-4" style="gap:10px">
        <button class="btn" type="button" data-nav2="prev" ${i === 0 ? 'disabled' : ''}>→ السابق</button>
        ${i === items.length - 1
          ? `<a class="btn btn--primary" href="#/zero/drill/${stage.id}">🧪 تدريب المرحلة (٥ أسئلة) ←</a>`
          : '<button class="btn btn--primary" type="button" data-nav2="next">التالي ←</button>'}
      </div>`;

    const act = (name, fn) => qs(`[data-act="${name}"]`, box)?.addEventListener('click', fn);
    act('say', () => sayName(it));                      // المرحلة ١: اسم الحرف فقط
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

    qs('[data-hear]', box)?.addEventListener('click', () => sayName(it));
    box.querySelector('[data-nav2="prev"]')?.addEventListener('click', () => { if (i > 0) { i -= 1; paint(); paintStrip(); } });
    box.querySelector('[data-nav2="next"]')?.addEventListener('click', () => { if (i < items.length - 1) { i += 1; paint(); paintStrip(); } });

    if (speakNow && zeroPrefs().autoSpeak) sayName(it);
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
  if (zeroPrefs().autoSpeak) sayName(items[0]);

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
        { id: 'n0', title: 'الأرقام ٠ – ٢٠', items: nums.filter((x) => Number(x.key.slice(4)) <= 20) },
        { id: 'n100', title: 'العشرات والمئة', items: nums.filter((x) => Number(x.key.slice(4)) > 20) },
        { id: 'ord', title: 'الأرقام الترتيبية', items: pick('ord:') },
      ];
    }
    case 'time':
      return ['day:', 'month:', 'season:', 'time:', 'clock:'].map((p) => ({
        id: p, title: TIME_GROUP_AR[p.replace(':', '')] || p, items: pick(p),
      }));
    case 'pronouns':
      return [
        { id: 'pron', title: 'ضمائر الفاعل', items: pick('pron:') },
        { id: 'tobe', title: 'فعل الكينونة: am · is · are', items: pick('tobe:') },
      ];
    case 'words':
      return snap.wordGroups.map((g) => ({ id: g.id, title: g.titleAr, icon: g.icon, items: items.filter((x) => x.group === g.id) }));
    case 'sentences': {
      const ids = [...new Set(items.map((x) => x.group))];
      return ids.map((id) => ({ id, title: SENT_GROUP_AR[id] || id, items: items.filter((x) => x.group === id) }));
    }
    default:
      return [{ id: 'all', title: 'الكل', items }];
  }
}

function renderListStage(host, stage) {
  const snap = zeroSnapshot();
  const groups = groupsFor(stage, snap);
  let gi = 0;

  host.innerHTML = `
    ${stageHead(stage)}
    <div class="card mt-4">
      <div class="seg" id="zTabs" role="tablist" aria-label="مجموعات المرحلة"></div>
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
            <button class="btn btn--ghost btn--sm" type="button" data-tick="${esc(it.key)}" aria-pressed="${done}" title="${done ? 'متقن — انقر للإلغاء' : 'وسم كمتقن'}" aria-label="${done ? 'متقن — انقر للإلغاء' : 'وسم كمتقن'}">✓</button>
          </div>`;
        }).join('')}
      </div>
      <p class="small muted mt-3">انقر 🔊 لتسمع النطق، و✓ لتعلّم ما أتقنته.</p>`;

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
            ${done ? '<span class="spacer chip chip--ok">أتممتها ✓</span>' : ''}
          </div>
          <div class="card card--flat" style="padding:0">
            ${r.lines.map((l) => `<div class="item-row">
              <span class="item-row__en">${esc(l.en)}</span>
              <span class="item-row__ar">${esc(l.ar)} <span class="muted">· ${esc(l.pron)}</span></span>
              ${speakBtn(l.en)}
            </div>`).join('')}
          </div>
          <div class="row row--wrap mt-3" style="gap:8px">
            <button class="btn btn--primary btn--sm" type="button" data-read-quiz="${r.id}">اختبر فهمي (${arNum(r.questions.length)})</button>
            <button class="btn btn--sm" type="button" data-read-all="${r.id}">🔊 اقرأ النص كاملاً</button>
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
      title: `فهم المقروء — ${r.titleAr}`,
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
    host.innerHTML = `<div class="card"><div class="empty"><span class="ico">🤷</span><p>لا أسئلة لهذه المرحلة بعد.</p>
      <a class="btn btn--primary mt-3" href="#/zero">← المراحل</a></div></div>`;
    return;
  }
  const idx = ZERO_STAGES.findIndex((s) => s.id === stage.id);
  const next = ZERO_STAGES[idx + 1];

  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">🧪</span><h1>تدريب: ${esc(stage.titleAr)}</h1></div>
        <p>خمسة أسئلة قصيرة. النجاح من ٨٠٪ يُكمل المرحلة.</p>
      </div>
      <div class="row row--wrap"><a class="btn btn--sm" href="#/zero/stage/${stage.id}">← ${esc(stage.titleAr)}</a></div>
    </div>
    <div id="zRun" class="mt-4"></div>`;

  runQuiz(qs('#zRun', host), {
    questions,
    allowReveal: true,
    onSummary: (res) => {
      let badges = [];
      for (const a of res.answers) if (a.correct) badges = badges.concat(applyAnswer(a.q.itemId, true));
      const r = recordStageDrill(stage.id, res.accuracy);
      badges = badges.concat(r.badges || []);
      if (r.justCompleted) { confetti(60); toast(`✅ أتممت ${stage.titleAr}`, 'ok'); }
      else if (res.accuracy >= 80) toast('✅ مراجعة ناجحة — المرحلة مكتملة', 'ok');
      else toast(`نتيجتك ${res.accuracy}% — تحتاج ٨٠٪ لإتمام المرحلة`, 'warn');
      if (badges.length) toast(`🏅 ${[...new Set(badges.map((b) => b.ar))].join(' · ')}`, 'ok');
      window.__leaRefreshChrome?.();
    },
    extraActionsHtml: `<a class="btn" href="#/zero/stage/${stage.id}">مراجعة المرحلة</a>
      ${next ? `<a class="btn btn--primary" href="#/zero/stage/${next.id}">${esc(next.titleAr)} ←</a>` : '<a class="btn btn--primary" href="#/zero/exam">الاختبار النهائي ←</a>'}`,
  });
}
