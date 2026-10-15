/* ============================================================
   قسم «من الصفر» (A0) — الصفحة الرئيسية + لوح الكتابة المستقل
   ============================================================ */
import { esc, qs, qsa, speakBtn, confetti, toast } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { progress } from '../core/store.js';
import { badgesWithState } from '../core/gamify.js';
import { speak, stopSpeaking } from '../core/speech.js';
import { ZERO_STAGES, ZERO_TOTALS, zeroStageSize } from '../data/zero.js';
import {
  zeroSnapshot, a1Recommendation, zeroFocus, certificate, setZeroPrefs, zeroPrefs, markPadUsed,
} from '../core/zeroflow.js';
import { pageHead, progressBar, statCard } from './shell.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';
import { reopenZeroChoice } from './zero-entry.js';

/* الشارات التي تخصّ قسم التأسيس (كلها تبدأ بـ a0-) */
function zeroBadges() {
  return badgesWithState().filter((b) => String(b.id).startsWith('a0-'));
}

export function renderZero(host) {
  const s = zeroSnapshot();
  const advice = a1Recommendation();
  const cert = certificate();
  const badges = zeroBadges();
  const earned = badges.filter((b) => b.earned);
  const focus = zeroFocus();
  const isA0 = focus === 'a0';

  host.innerHTML = `
    ${pageHead({
      icon: '🌱',
      title: 'من الصفر — تأسيس A0',
      subtitle: 'ثماني مراحل قصيرة: الحروف، الحروف المركّبة، الأرقام، الوقت، الضمائر، ١٢٠ كلمة، ٤٠ جملة، وقراءات أولى — مع نطق عربي لكل عنصر.',
      actionsHtml: `
        <button class="btn ${isA0 ? 'btn--primary' : ''}" type="button" id="zeroFocusBtn">${isA0 ? '✅ وضع «من الصفر» مفعّل' : '🎚️ فعّل وضع «من الصفر»'}</button>
        <a class="btn" href="#/zero/pad">✍️ لوح الكتابة</a>
        <button class="btn btn--ghost" type="button" id="zeroRechoose">🔁 أعد شاشة الاختيار</button>`,
    })}

    <div class="zero-hero card card--brand">
      <div class="zero-hero__main">
        <div class="row wrap" style="gap:10px;align-items:center">
          <span class="chip chip--brand">المستوى A0 · ما قبل المبتدئ</span>
          <span class="chip">${ZERO_TOTALS.stages} مراحل</span>
          <span class="chip">${ZERO_TOTALS.items} عنصراً</span>
          <span class="chip">${ZERO_TOTALS.words} كلمة</span>
          <span class="chip">${ZERO_TOTALS.sentences} جملة</span>
          <span class="chip">${ZERO_TOTALS.readings} قراءات</span>
        </div>
        <h2 style="margin:12px 0 6px">ابدأ من الحرف الأول — لا تحتاج أي خلفية سابقة</h2>
        <p class="muted" style="margin:0 0 14px">
          كل حرف وكل كلمة معها نطق مكتوب بالعربية، وصوت تلقائي بإعادة وتباطؤ، ولوح كتابة تفاعلي
          (بالحروف المطبوعة والمتصلة). بعد كل مرحلة تدريب من ٥ أسئلة، وفي النهاية اختبار من ٣٠ سؤالاً
          وشهادة تأسيس.
        </p>
        <div class="row wrap" style="gap:10px">
          <a class="btn btn--primary btn--lg" href="#/zero/stage/letters">▶ ${s.doneStages ? 'تابع من حيث توقفت' : 'ابدأ بالمرحلة ١: الحروف'}</a>
          <a class="btn" href="#/zero/exam">🧪 الاختبار النهائي (٣٠ سؤالاً)</a>
          <a class="btn" href="#/zero/certificate">🎓 شهادة التأسيس</a>
        </div>
      </div>
      <div class="zero-hero__meter">
        ${progressBar(s.percent, s.percent >= 100 ? 'progress--ok' : '')}
        <div class="zero-hero__pct">${s.percent}%</div>
        <div class="small muted">${s.doneStages} / ${ZERO_TOTALS.stages} مراحل · ${s.lettersMastered} / ${ZERO_TOTALS.letters} حرفاً · ${s.wordsLearned} / ${ZERO_TOTALS.words} كلمة</div>
        <div class="divider"></div>
        <div class="small">🧪 أفضل نتيجة في الاختبار النهائي: <b>${s.examBest}%</b></div>
        <div class="small">🎓 الشهادة: <b>${cert.earned ? 'مُستلَمة ✅' : (s.readyForA1 ? 'جاهزة للاستلام' : 'غير مكتملة الشروط بعد')}</b></div>
      </div>
    </div>

    <div class="grid grid--4 mt-4">
      ${statCard({ label: 'المراحل المكتملة', value: `${s.doneStages}/${ZERO_TOTALS.stages}`, variant: 'stat--brand', foot: `${s.visits} مرحلة تمت زيارتها` })}
      ${statCard({ label: 'الحروف المتقنة', value: `${s.lettersMastered}/${ZERO_TOTALS.letters}`, foot: `${ZERO_TOTALS.digraphs} حرفاً مركّباً` })}
      ${statCard({ label: 'الكلمات المتقنة', value: `${s.wordsLearned}/${ZERO_TOTALS.words}`, foot: `${ZERO_TOTALS.sentences} جملة` })}
      ${statCard({ label: 'الاختبار النهائي', value: `${s.examBest}%`, variant: s.examBest >= 90 ? 'stat--ok' : '', foot: 'المطلوب للإتقان: ٩٠٪' })}
    </div>

    <div class="card mt-4 ${advice.ready ? 'card--ok' : ''}">
      <div class="card__title">
        <span class="ico" aria-hidden="true">${advice.ready ? '🎉' : '🧭'}</span>
        <h3>${esc(advice.title)}</h3>
        <span class="spacer chip ${advice.ready ? 'chip--ok' : 'chip--brand'}">التوصية بلا قفل 🔓</span>
      </div>
      <p class="muted">${esc(advice.text)}</p>
      <div class="row wrap" style="gap:10px">
        <a class="btn ${advice.ready ? 'btn--primary' : ''}" href="#/lessons">📚 اذهب إلى A1 الآن</a>
        ${advice.ready && !cert.earned ? `<a class="btn btn--primary" href="#/zero/certificate">🎓 استلم شهادة التأسيس</a>` : ''}
      </div>
    </div>

    <h2 class="mt-5" style="margin-bottom:10px">🗺️ المراحل الثمانية</h2>
    <div class="grid grid--2 grid--tight zero-stages">
      ${s.stageList.map((st) => {
        const done = st.state.done;
        return `<a class="card zero-stage ${done ? 'zero-stage--done' : ''}" href="#/zero/stage/${st.id}" data-nav>
          <div class="zero-stage__num">${st.n}</div>
          <div class="zero-stage__body">
            <div class="row row--between">
              <b><span aria-hidden="true">${st.icon}</span> ${esc(st.titleAr)}</b>
              ${done ? '<span class="chip chip--ok">✅ مكتملة</span>' : (st.state.seen ? '<span class="chip chip--warn">بدأت</span>' : `<span class="chip">${st.minutes} دقيقة</span>`)}
            </div>
            <div class="small muted">${esc(st.subAr)}</div>
            <div class="tiny muted">${zeroStageSize(st.id)} عنصراً${st.state.best ? ` · أفضل نتيجة ${st.state.best}%` : ''}${st.state.drills ? ` · ${st.state.drills} تدريب` : ''}</div>
          </div>
        </a>`;
      }).join('')}
    </div>

    <div class="grid grid--2 mt-4">
      <div class="card">
        <div class="card__title"><span class="ico" aria-hidden="true">🎓</span><h3>الشهادة والاختبار</h3></div>
        <p class="small muted">الاختبار النهائي ٣٠ سؤالاً موزّعة على المراحل الثمانية. عند ٩٠٪ أو أكثر مع إتقان الحروف وكل المراحل تستحق شهادة تأسيس قابلة للطباعة.</p>
        <div class="row wrap" style="gap:8px">
          <a class="btn btn--primary btn--sm" href="#/zero/exam">🧪 ابدأ الاختبار</a>
          <a class="btn btn--sm" href="#/zero/certificate">🎓 الشهادة</a>
        </div>
      </div>
      <div class="card">
        <div class="card__title">
          <span class="ico" aria-hidden="true">🏅</span><h3>شارات التأسيس</h3>
          <span class="spacer small muted">${earned.length}/${badges.length}</span>
        </div>
        <div class="row wrap" style="gap:8px">
          ${badges.map((b) => `<span class="chip ${b.earned ? 'chip--ok' : ''}" title="${esc(b.descAr)}" ${b.earned ? '' : 'style="opacity:.55"'}>${b.icon} ${esc(b.ar)}</span>`).join('') || '<span class="muted small">لا شارات تأسيس معرّفة.</span>'}
        </div>
      </div>
    </div>
  `;

  qs('#zeroFocusBtn', host)?.addEventListener('click', () => {
    const next = setZeroPrefs({ focus: isA0 ? 'levels' : 'a0' }).focus;
    toast(next === 'a0' ? 'وضع «من الصفر» مفعّل — القسم في المقدمة 🌱' : 'وضع «من الصفر» مُطفأ — المستويات في المقدمة 📚', 'ok');
    window.__leaRenderAll?.();
    navigate('/zero');
  });

  qs('#zeroRechoose', host)?.addEventListener('click', () => { reopenZeroChoice(); });
}

/* ============================================================
   لوح الكتابة المستقل (#/zero/pad)
   ============================================================ */
const PAD_PRESETS = [
  { t: 'A a', label: 'A a', note: 'الحرف الكبير والصغير' },
  { t: 'B b', label: 'B b', note: 'B و b' },
  { t: 'C c', label: 'C c', note: 'C و c' },
  { t: 'cat', label: 'cat', note: 'قطة' },
  { t: 'dog', label: 'dog', note: 'كلب' },
  { t: 'sun', label: 'sun', note: 'شمس' },
  { t: 'book', label: 'book', note: 'كتاب' },
  { t: 'Hello!', label: 'Hello!', note: 'مرحباً' },
  { t: 'I am Ali.', label: 'I am Ali.', note: 'أنا علي.' },
];

export function renderZeroPad(host) {
  const prefs = zeroPrefs();
  host.innerHTML = `
    ${pageHead({
      icon: '✍️',
      title: 'لوح الكتابة التفاعلي',
      subtitle: 'اكتب بإصبعك أو القلم أو الفأرة فوق الخطوط. بدّل بين الحروف المطبوعة (منفصلة) والمتصلة.',
      actionsHtml: '<a class="btn" href="#/zero">← رجوع إلى من الصفر</a>',
    })}
    <div class="card">
      <div class="row wrap" style="gap:8px" id="padPresets">
        ${PAD_PRESETS.map((p, i) => `<button class="btn btn--sm ${i === 0 ? 'btn--primary' : ''}" type="button" data-pad="${esc(p.t)}" title="${esc(p.note)}">${esc(p.label)}</button>`).join('')}
      </div>
      <div class="field mt-3" style="max-width:420px">
        <label for="padCustom">أو اكتب أي كلمة لتتدرّب عليها</label>
        <div class="row" style="gap:8px">
          <input class="input" id="padCustom" dir="ltr" placeholder="apple" autocomplete="off" spellcheck="false" />
          <button class="btn btn--primary" type="button" id="padCustomGo">اعرض</button>
        </div>
      </div>
    </div>
    <div id="padHost" class="mt-4"></div>
    <div class="card mt-4">
      <div class="card__title"><span class="ico" aria-hidden="true">💡</span><h3>كيف تستفيد من اللوح؟</h3></div>
      <ul class="muted small" style="line-height:2;padding-inline-start:18px;margin:0">
        <li>ابدأ بالحرف المطبوع حتى يتضح الشكل، ثم جرّب الوضع المتصل لتتعوّد على الكتابة اليدوية السريعة.</li>
        <li>اكتب فوق الشبح الرمادي ثم امسح واكتب من ذاكرتك بلا شبح.</li>
        <li>اضغط 🔊 لتسمع النطق قبل الكتابة — الربط بين الصوت والرسم يثبّت الحرف.</li>
      </ul>
    </div>`;

  let pad = null;
  const mount = (text) => {
    const padHost = qs('#padHost', host);
    if (!padHost) return;
    if (pad && pad.destroy) { try { pad.destroy(); } catch {} }
    const preset = PAD_PRESETS.find((p) => p.t === text);
    padHost.innerHTML = writingPadHTML({
      text,
      mode: prefs.padMode,
      ar: preset ? preset.note : '',
    });
    pad = initWritingPad(padHost, {
      text,
      mode: prefs.padMode,
      ar: preset ? preset.note : '',
      onChange: (mode) => setZeroPrefs({ padMode: mode }),
      onDraw: () => { const r = markPadUsed(); if (r.milestone) toast('أول كتابة على اللوح — أحسنت! ✍️', 'ok'); },
    });
  };
  mount(PAD_PRESETS[0].t);

  qsa('[data-pad]', host).forEach((b) => b.addEventListener('click', () => {
    qsa('[data-pad]', host).forEach((x) => x.classList.remove('btn--primary'));
    b.classList.add('btn--primary');
    mount(b.dataset.pad);
  }));
  qs('#padCustomGo', host)?.addEventListener('click', () => {
    const v = qs('#padCustom', host)?.value?.trim();
    if (!v) return;
    mount(v.slice(0, 40));
  });
  qs('#padCustom', host)?.addEventListener('keydown', (e) => { if (e.key === 'Enter') qs('#padCustomGo', host)?.click(); });
}

/* ============================================================
   نطق تلقائي متسلسل (تشغيل/إيقاف + بطء) — يُستخدم في صفحات المراحل
   ============================================================ */
export function createNarrator(host, items, opts = {}) {
  const state = { i: 0, timer: null, running: false, slow: !!opts.slow };
  const bar = document.createElement('div');
  bar.className = 'zero-narrator';
  bar.innerHTML = `
    <button class="btn btn--primary btn--sm" type="button" data-narr="play">▶ تشغيل النطق التلقائي</button>
    <button class="btn btn--sm" type="button" data-narr="slow">🐢 تباطؤ: ${state.slow ? 'مفعّل' : 'مطفأ'}</button>
    <button class="btn btn--sm" type="button" data-narr="stop" hidden>⏸ إيقاف</button>
    <span class="small muted" data-narr-label>سيُنطق كل عنصر بالترتيب مع إظهاره.</span>`;
  host.prepend(bar);

  const label = bar.querySelector('[data-narr-label]');
  const playBtn = bar.querySelector('[data-narr="play"]');
  const stopBtn = bar.querySelector('[data-narr="stop"]');
  const slowBtn = bar.querySelector('[data-narr="slow"]');

  const stop = () => {
    state.running = false;
    clearTimeout(state.timer);
    stopSpeaking();
    playBtn.hidden = false; stopBtn.hidden = true;
    if (label) label.textContent = 'تم إيقاف النطق التلقائي.';
    opts.onItem?.(-1);
  };

  const step = () => {
    if (!state.running) return;
    if (state.i >= items.length) { stop(); if (label) label.textContent = 'انتهى النطق التلقائي ✅'; return; }
    const it = items[state.i];
    const text = typeof it === 'string' ? it : (it.speak || it.en || '');
    if (label) label.textContent = `${state.i + 1} / ${items.length}: ${text}`;
    opts.onItem?.(state.i);
    let advanced = false;
    const advance = () => {
      if (advanced || !state.running) return;
      advanced = true;
      clearTimeout(state.timer);
      state.i += 1;
      state.timer = setTimeout(step, state.slow ? 1400 : 750);
    };
    speak(text, { rate: state.slow ? 0.55 : undefined, onend: advance });
    // شبكة أمان: بعض المتصفحات لا تُطلق onend إطلاقاً
    state.timer = setTimeout(advance, Math.max(2200, String(text).length * 430));
  };

  const play = () => {
    if (state.running) return;
    state.running = true; state.i = 0;
    playBtn.hidden = true; stopBtn.hidden = false;
    step();
  };

  playBtn.addEventListener('click', play);
  stopBtn.addEventListener('click', stop);
  slowBtn.addEventListener('click', () => {
    state.slow = !state.slow;
    slowBtn.textContent = `🐢 تباطؤ: ${state.slow ? 'مفعّل' : 'مطفأ'}`;
    if (state.running && state.i > 0) state.i -= 1;
  });

  return { stop, get running() { return state.running; } };
}
