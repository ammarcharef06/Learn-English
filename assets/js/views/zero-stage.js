/* ============================================================
   قسم «من الصفر» (A0) — مشغّل المرحلة
   - الحروف والحروف المركّبة: شاشة واحدة لكل حرف (تركيز كامل)
   - بقية المراحل: قوائم مختصرة مقسّمة إلى مجموعات (لا أكثر من ١٥ صفاً)
   - القراءات: نصّ واحد لكل قسم
   كل عنصر: سطر قصير ظاهر + زر «تفاصيل» للباقي، وبلا ازدحام أزرار.
   ============================================================ */
import { esc, qs, qsa, toast, confetti, openModal, arNum } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { speak } from '../core/speech.js';
import { progress } from '../core/store.js';
import { renderSidebarStats } from './shell.js';
import { ZERO_STAGES, zeroStage, zeroItems, zeroStageQuestions, READINGS } from '../data/zero.js';
import {
  zeroSnapshot, markStageSeen, markLetter, markDigraph, markWord, markSentence,
  markReadingDone, markPadUsed, applyAnswer, zeroPrefs, setZeroPrefs, recordStageDrill,
} from '../core/zeroflow.js';
import { runQuiz } from './quiz-runner.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';

/* مراحل تُعرَض شاشةً واحدة لكل عنصر */
const FOCUS_KINDS = new Set(['letters', 'digraphs']);

const SENT_GROUP_AR = {
  greetings: 'تحيات', intro: 'تعريف بالنفس', family: 'العائلة', school: 'المدرسة',
  daily: 'يوميات', questions: 'أسئلة', shopping: 'تسوّق', polite: 'مجاملة',
};
const TIME_GROUP_AR = { day: 'أيام الأسبوع', month: 'شهور السنة', season: 'فصول السنة', time: 'عبارات الوقت', clock: 'قول الساعة' };

/* ---------- نطق بطيء/عادي حسب الإعداد ---------- */
function rate() {
  return zeroPrefs().slowRate <= 0.6 ? 0.55 : undefined;
}
function say(text, slow = false) {
  if (!text) return;
  speak(text, slow ? { rate: 0.5 } : { rate: rate() });
}

/* ---------- نافذة التفاصيل ولوح الكتابة ---------- */
export function openDetails(it) {
  const rows = [];
  if (it.ar) rows.push(`<div class="zrow2"><span class="zrow2__k">المعنى</span><span class="zrow2__v">${esc(it.ar)}</span></div>`);
  if (it.pron) rows.push(`<div class="zrow2"><span class="zrow2__k">النطق</span><span class="zrow2__v">${esc(it.pron)}</span></div>`);
  if (it.soundAr) rows.push(`<div class="zrow2"><span class="zrow2__k">الصوت</span><span class="zrow2__v">${esc(it.soundAr)}</span></div>`);
  if (it.word) rows.push(`<div class="zrow2"><span class="zrow2__k">مثال</span><span class="zrow2__v"><b dir="ltr">${esc(it.word)}</b><span class="zmuted"> · ${esc(it.wordPronAr || '')} · ${esc(it.wordAr || '')}</span></span></div>`);
  if (it.extra) rows.push(`<div class="zrow2"><span class="zrow2__k">جملة</span><span class="zrow2__v"><b dir="ltr">${esc(it.extra)}</b><span class="zmuted"> · ${esc(it.extraAr || '')}</span></span></div>`);

  openModal({
    title: 'تفاصيل',
    body: `
      <div class="zdetail">
        <div class="zdetail__en" dir="ltr">${esc(it.en)}</div>
        <div class="zrows2">${rows.join('')}</div>
        ${it.tipAr ? `<p class="ztip">${esc(it.tipAr)}</p>` : ''}
        <div class="zdetail__acts">
          <button class="zbtn zbtn--primary" type="button" data-zsay="${esc(it.say || it.en)}">🔊 اسمع</button>
          <button class="zbtn" type="button" data-zslow="${esc(it.say || it.en)}">🐢 ببطء</button>
          ${it.word && it.word !== (it.say || it.en) ? `<button class="zbtn" type="button" data-zsay="${esc(it.word)}">🔊 كلمة المثال</button>` : ''}
        </div>
      </div>`,
    actions: [{ label: 'إغلاق', variant: 'ghost' }],
    onMount: (root) => {
      qsa('[data-zsay]', root).forEach((b) => b.addEventListener('click', () => say(b.dataset.zsay)));
      qsa('[data-zslow]', root).forEach((b) => b.addEventListener('click', () => say(b.dataset.zslow, true)));
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
    text,
    mode: prefs.padMode,
    ar,
    onChange: (mode) => setZeroPrefs({ padMode: mode }),
    onDraw: () => { const r = markPadUsed(); if (r.milestone) toast('أول كتابة على اللوح — أحسنت ✍️', 'ok'); },
  });
  root.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', () => { pad?.destroy?.(); }));
  return pad;
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

/* ---------- ترويسة المرحلة ---------- */
function stageHead(stage, extra = '') {
  const idx = ZERO_STAGES.findIndex((s) => s.id === stage.id);
  const next = ZERO_STAGES[idx + 1];
  return `
    <header class="zhead zhead--stage">
      <a class="zback" href="#/zero" data-nav>← المراحل</a>
      <h1>${esc(stage.titleAr)}</h1>
      <p>${esc(stage.subAr)}</p>
      <div class="zstage-acts">
        <button class="zquiet" type="button" id="zAutoBtn">${zeroPrefs().autoSpeak ? '🔊 النطق التلقائي: مفعّل' : '🔇 النطق التلقائي: مطفأ'}</button>
        <a class="zquiet" href="#/zero/drill/${stage.id}" data-nav>🧪 تدريب المرحلة</a>
        ${next ? `<a class="zquiet" href="#/zero/stage/${next.id}" data-nav>${esc(next.titleAr)} ←</a>` : '<a class="zquiet" href="#/zero/exam" data-nav>الاختبار النهائي ←</a>'}
      </div>
      ${extra}
    </header>`;
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
   ١) شاشة لكل حرف (الحروف والحروف المركّبة)
   ============================================================ */
function renderFocusStage(host, stage) {
  const items = zeroItems(stage.id);
  const isLetters = stage.kind === 'letters';
  let i = 0;

  host.innerHTML = `
    <div class="zpage zpage--wide">
      ${stageHead(stage)}
      <div id="zFocus"></div>
    </div>`;
  bindAutoBtn(host);

  const card = (it) => {
    const done = isLetters
      ? !!progress.zero?.letters?.[it.en.trim().split(/\s+/)[0].toLowerCase()]
      : !!progress.zero?.digraphs?.[findDigraphId(it)];
    const lead = isLetters
      ? `<span class="zbig" dir="ltr">${esc(it.en.split(' ')[0])}</span><span class="zsmall" dir="ltr">${esc(it.en.split(' ')[1] || '')}</span>`
      : `<span class="zbig zbig--combo" dir="ltr">${esc(it.en)}</span>`;
    return `
      <div class="zcard" data-i="${i}">
        <div class="zcard__lead">${lead}</div>
        <div class="zrows2">
          <div class="zrow2"><span class="zrow2__k">الاسم</span><span class="zrow2__v">${esc(it.ar)}</span></div>
          ${it.soundAr ? `<div class="zrow2"><span class="zrow2__k">الصوت</span><span class="zrow2__v">${esc(it.soundAr)}</span></div>` : ''}
          ${it.word ? `<div class="zrow2"><span class="zrow2__k">مثال</span><span class="zrow2__v"><b dir="ltr">${esc(it.word)}</b><span class="zmuted"> · ${esc(it.wordPronAr || '')} · ${esc(it.wordAr || '')}</span></span></div>` : ''}
        </div>
      </div>`;
  };

  const actions = (it) => {
    const done = isLetters
      ? !!progress.zero?.letters?.[it.en.trim().split(/\s+/)[0].toLowerCase()]
      : !!progress.zero?.digraphs?.[findDigraphId(it)];
    return `
      <div class="zacts">
        <button class="zbtn zbtn--primary zbtn--big" type="button" data-act="say">🔊 اسمع</button>
        <button class="zbtn" type="button" data-act="write">✍️ اكتب</button>
        <button class="zbtn ${done ? 'is-done' : ''}" type="button" data-act="master">${done ? '✓ متقن' : '✅ أتقنت'}</button>
        <button class="zquiet" type="button" data-act="details">تفاصيل</button>
      </div>`;
  };

  const paint = (speakNow = true) => {
    const it = items[i];
    const box = qs('#zFocus', host);
    if (!box) return;
    box.innerHTML = `
      <div class="zcount">
        <span>الخطوة ${arNum(i + 1)} من ${arNum(items.length)}</span>
        <span class="zbar"><i style="width:${Math.round(((i + 1) / items.length) * 100)}%"></i></span>
      </div>
      ${card(it)}
      ${actions(it)}
      <div class="znav2">
        <button class="zbtn" type="button" data-nav2="prev" ${i === 0 ? 'disabled' : ''}>→ السابق</button>
        ${i === items.length - 1
          ? `<a class="zbtn zbtn--primary" href="#/zero/drill/${stage.id}" data-nav>تدريب المرحلة (٥ أسئلة) ←</a>`
          : '<button class="zbtn zbtn--primary" type="button" data-nav2="next">التالي ←</button>'}
      </div>
      <details class="zjump">
        <summary>${isLetters ? 'قائمة الحروف' : 'قائمة الحروف المركّبة'}</summary>
        <div class="zjump__grid">
          ${items.map((x, k) => `<button class="zchip ${k === i ? 'is-on' : ''}" type="button" data-jump="${k}" dir="ltr">${esc(isLetters ? x.en.split(/\s+/)[0] : x.en)}</button>`).join('')}
        </div>
      </details>`;

    const act = (name, fn) => qs(`[data-act="${name}"]`, box)?.addEventListener('click', fn);
    act('say', () => say(it.say || it.en));
    act('write', () => openWritePad(it.word || it.en, it.ar));
    act('master', () => {
      const badges = isLetters ? markLetter(it.en.trim().split(/\s+/)[0].toLowerCase(), !isDone(it)) : markDigraph(findDigraphId(it), !isDone(it));
      if (badges?.length) toast(`🏅 ${badges.map((b) => b.ar).join(' · ')}`, 'ok');
      paint(false);
      renderSidebarStats();
    });
    act('details', () => openDetails(it));

    box.querySelector('[data-nav2="prev"]')?.addEventListener('click', () => { if (i > 0) { i -= 1; paint(); } });
    box.querySelector('[data-nav2="next"]')?.addEventListener('click', () => { if (i < items.length - 1) { i += 1; paint(); } });
    qsa('[data-jump]', box).forEach((b) => b.addEventListener('click', () => { i = Number(b.dataset.jump); paint(); }));

    if (speakNow && zeroPrefs().autoSpeak) say(it.say || it.en);
    qs('.zcard', box)?.addEventListener('click', (e) => { if (!e.target.closest('button')) say(it.say || it.en); });
  };

  const isDone = (it) => (isLetters
    ? !!progress.zero?.letters?.[it.en.trim().split(/\s+/)[0].toLowerCase()]
    : !!progress.zero?.digraphs?.[findDigraphId(it)]);

  paint(false);
  if (zeroPrefs().autoSpeak) say(items[0].say || items[0].en);

  /* لوحة المفاتيح: ← → للتنقل */
  document.onkeydown = (e) => {
    if (e.key === 'ArrowLeft') { if (i < items.length - 1) { i += 1; paint(); } }
    else if (e.key === 'ArrowRight') { if (i > 0) { i -= 1; paint(); } }
  };
}

function findDigraphId(it) {
  const found = zeroSnapshot().digraphList.find((d) => d.combo === it.en);
  return found ? found.id : it.en;
}

/* ============================================================
   ٢) قوائم مختصرة مقسّمة (الرقام · الوقت · الضمائر · الكلمات · الجمل)
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
    <div class="zpage zpage--wide">
      ${stageHead(stage)}
      <div class="ztabs" id="zTabs" role="tablist"></div>
      <div id="zList"></div>
    </div>`;
  bindAutoBtn(host);

  const paintTabs = () => {
    const tabs = qs('#zTabs', host);
    if (!tabs) return;
    tabs.innerHTML = groups.map((g, k) => `<button class="ztab ${k === gi ? 'is-on' : ''}" type="button" data-g="${k}" role="tab" aria-selected="${k === gi}">
      ${g.icon ? g.icon + ' ' : ''}${esc(g.title)} <span class="ztab__n">${arNum(g.items.length)}</span></button>`).join('');
    qsa('[data-g]', tabs).forEach((b) => b.addEventListener('click', () => { gi = Number(b.dataset.g); paintTabs(); paintList(); }));
  };

  const paintList = () => {
    const box = qs('#zList', host);
    if (!box) return;
    const g = groups[gi];
    box.innerHTML = `
      <ul class="zlist">
        ${g.items.map((it) => {
          const done = stage.id === 'words' ? !!snap.raw.words?.[it.en]
            : stage.id === 'sentences' ? !!snap.raw.sentences?.[it.en]
              : false;
          return `<li class="zrow ${done ? 'is-done' : ''}" data-say="${esc(it.say || it.en)}" data-key="${esc(it.key)}">
            <span class="zrow__en" dir="ltr">${esc(it.en)}</span>
            <span class="zrow__ar">${esc(it.ar || '')}${it.extra ? ` <span class="zmuted">· ${esc(it.extra)}</span>` : ''}</span>
            <span class="zrow__pron">${esc(it.pron || '')}</span>
            <button class="zrow__tick" type="button" data-tick="${esc(it.key)}" aria-label="وسم كمتقن" aria-pressed="${done}">✓</button>
          </li>`;
        }).join('')}
      </ul>
      <p class="zhint">انقر أي سطر لتسمعه، وعلّم ✓ ما أتقنته.</p>`;

    qsa('.zrow', box).forEach((row) => row.addEventListener('click', (e) => {
      if (e.target.closest('[data-tick]')) return;
      say(row.dataset.say);
    }));
    qsa('[data-tick]', box).forEach((b) => b.addEventListener('click', () => {
      const key = b.dataset.tick;
      const it = g.items.find((x) => x.key === key);
      const on = !b.closest('.zrow').classList.contains('is-done');
      let badges = [];
      if (key.startsWith('word:')) badges = markWord(it.en, on);
      else if (key.startsWith('sent:')) badges = markSentence(it.en, on);
      else badges = markWord(key, on);
      if (badges?.length) toast(`🏅 ${badges.map((x) => x.ar).join(' · ')}`, 'ok');
      b.closest('.zrow').classList.toggle('is-done', on);
      b.setAttribute('aria-pressed', String(on));
      renderSidebarStats();
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
    <div class="zpage zpage--wide">
      ${stageHead(stage)}
      <div class="zreads">
        ${READINGS.map((r) => {
          const done = progress.zero?.readings?.[r.id]?.done;
          return `<section class="zread" data-read="${r.id}">
            <header class="zread__head">
              <h2>${esc(r.titleAr)} <span class="zmuted" dir="ltr">${esc(r.titleEn)}</span></h2>
              ${done ? '<span class="ztag ztag--ok">أتممتها</span>' : ''}
            </header>
            <ol class="zread__lines">
              ${r.lines.map((l) => `<li class="zrow zrow--line" data-say="${esc(l.en)}">
                <span class="zrow__en" dir="ltr">${esc(l.en)}</span>
                <span class="zrow__ar">${esc(l.ar)}</span>
                <span class="zrow__pron">${esc(l.pron)}</span>
              </li>`).join('')}
            </ol>
            <div class="zread__acts">
              <button class="zbtn zbtn--primary" type="button" data-read-quiz="${r.id}">اختبر فهمي (${arNum(r.questions.length)})</button>
              <button class="zbtn" type="button" data-read-all="${r.id}">🔊 اقرأ النص كاملاً</button>
            </div>
            <div id="readQuiz-${r.id}"></div>
          </section>`;
        }).join('')}
      </div>
    </div>`;
  bindAutoBtn(host);

  qsa('.zrow', host).forEach((row) => row.addEventListener('click', () => say(row.dataset.say)));

  qsa('[data-read-all]', host).forEach((b) => b.addEventListener('click', () => {
    const r = READINGS.find((x) => x.id === b.dataset.readAll);
    if (!r) return;
    let k = 0;
    const go = () => {
      if (k >= r.lines.length) return;
      speak(r.lines[k].en, { onend: () => { k += 1; setTimeout(go, 300); } });
      k += 1;
      setTimeout(go, 2800);
    };
    k = 0;
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
      onSummary: (res) => { markReadingDone(r.id, res.correct, res.total); renderSidebarStats(); },
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
    host.innerHTML = `<div class="zpage"><div class="znotice">لا أسئلة لهذه المرحلة بعد.</div>
      <a class="zbtn" href="#/zero" data-nav>← المراحل</a></div>`;
    return;
  }
  const idx = ZERO_STAGES.findIndex((s) => s.id === stage.id);
  const next = ZERO_STAGES[idx + 1];

  host.innerHTML = `
    <div class="zpage">
      <header class="zhead zhead--stage">
        <a class="zback" href="#/zero/stage/${stage.id}" data-nav>← ${esc(stage.titleAr)}</a>
        <h1>تدريب: ${esc(stage.titleAr)}</h1>
        <p>خمسة أسئلة قصيرة. النجاح من ٨٠٪ يُكمل المرحلة.</p>
      </header>
      <div id="zRun"></div>
    </div>`;

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
      renderSidebarStats();
    },
    extraActionsHtml: `<a class="zbtn" href="#/zero/stage/${stage.id}" data-nav>مراجعة المرحلة</a>
      ${next ? `<a class="zbtn zbtn--primary" href="#/zero/stage/${next.id}" data-nav>${esc(next.titleAr)} ←</a>` : '<a class="zbtn zbtn--primary" href="#/zero/exam" data-nav>الاختبار النهائي ←</a>'}`,
  });
}
