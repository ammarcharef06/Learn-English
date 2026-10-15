/* ============================================================
   قسم «من الصفر» (A0) — الرئيسية + الإعدادات + لوح الكتابة الحر
   كل الواجهات بمكوّنات الموقع: .page-head · .card · .grid · .btn · .chip
   ============================================================ */
import { esc, qs, qsa, toast, arNum, ringHTML } from '../core/utils.js';
import { ZERO_TOTALS, zeroStageSize } from '../data/zero.js';
import { zeroSnapshot, certificate, setZeroPrefs, zeroPrefs, resetZeroProgress, markPadUsed } from '../core/zeroflow.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';

/* ---------- مساعدات صغيرة بمكوّنات الموقع ---------- */
export function bar(percent, variant = '') {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return `<div class="progress ${variant}"><i style="width:${p}%"></i></div>`;
}
export function stat(label, value, foot = '', variant = '') {
  return `<div class="stat ${variant}">
    <div class="stat__label">${esc(label)}</div>
    <div class="stat__value">${esc(String(value))}</div>
    ${foot ? `<div class="stat__foot">${esc(foot)}</div>` : ''}
  </div>`;
}
export function itemsLabel(n) {
  if (n === 1) return 'عنصر واحد';
  if (n === 2) return 'عنصران';
  if (n >= 3 && n <= 10) return `${arNum(n)} عناصر`;
  return `${arNum(n)} عنصراً`;
}

function nextStage(stageList) {
  return stageList.find((s) => !s.state.done) || stageList[stageList.length - 1];
}

/* ============================================================
   الرئيسية
   ============================================================ */
export function renderZero(host) {
  const snap = zeroSnapshot();
  const cert = certificate();
  const next = nextStage(snap.stageList);
  const nums = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨'];
  const started = snap.percent > 0;

  const chip = (s) => {
    if (s.state.done) return `<span class="chip chip--ok">✅ مكتملة · ${arNum(s.state.best)}٪</span>`;
    if (s.state.seen) return '<span class="chip chip--warn">بدأت</span>';
    return `<span class="chip chip--line">${arNum(s.minutes)} دقيقة</span>`;
  };

  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">🌱</span><h1>من الصفر — تأسيس A0</h1></div>
        <p>ثماني مراحل مرتّبة: الحروف، ثم الحروف المركّبة، ثم الأرقام والوقت، ثم الضمائر، ثم ١٢٠ كلمة و٤٠ جملة وأربع قراءات.</p>
      </div>
      <div class="row row--wrap">
        <a class="btn btn--primary" href="#/zero/stage/${next.id}">${started ? `متابعة: ${esc(next.titleAr)}` : 'ابدأ بالحروف'} ←</a>
        <a class="btn" href="#/zero/pad">✍️ لوح الكتابة</a>
      </div>
    </div>

    <div class="card card--brand mt-4">
      <div class="row row--between row--wrap" style="gap:16px">
        <div class="row" style="gap:14px">
          ${ringHTML(snap.percent, `${arNum(snap.percent)}٪`)}
          <div>
            <b>تقدّمك في التأسيس</b>
            <div class="small muted">${arNum(snap.doneStages)} من ${arNum(ZERO_TOTALS.stages)} مراحل · ${arNum(snap.lettersMastered)} من ${arNum(ZERO_TOTALS.letters)} حرفاً · ${arNum(snap.wordsLearned)} من ${arNum(ZERO_TOTALS.words)} كلمة</div>
          </div>
        </div>
        <span class="chip chip--brand">${snap.examBest ? `الاختبار النهائي ${arNum(snap.examBest)}٪` : 'لم تجرّب الاختبار النهائي بعد'}</span>
      </div>
      <div class="mt-3">${bar(snap.percent)}</div>
    </div>

    <div class="card mt-4">
      <div class="card__title">
        <span class="ico" aria-hidden="true">🗺️</span><h2>المراحل الثمانية</h2>
        <span class="spacer chip chip--brand">${arNum(ZERO_TOTALS.stages)} مراحل</span>
      </div>
      <div class="stack">
        ${snap.stageList.map((s, i) => `
          <div>
            <div class="row row--between row--wrap" style="gap:8px">
              <a class="link-card" href="#/zero/stage/${s.id}">
                <span aria-hidden="true">${s.icon}</span>
                <b>${nums[i] || arNum(s.n)} · ${esc(s.titleAr)}</b>
                <span class="chip">${esc(itemsLabel(zeroStageSize(s.id)))}</span>
              </a>
              ${chip(s)}
            </div>
            <div class="small muted" style="margin-top:6px">${esc(s.subAr)}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="grid grid--3 mt-4">
      <a class="card card--interactive" href="#/zero/exam">
        <div class="card__title"><span class="ico" aria-hidden="true">🧪</span><h3>الاختبار النهائي</h3></div>
        <p class="small muted">٣٠ سؤالاً من المراحل الثمانية. ${snap.examBest ? `أفضل نتيجة: ${arNum(snap.examBest)}٪` : 'بلا حدّ للمحاولات.'}</p>
      </a>
      <a class="card card--interactive" href="#/zero/certificate">
        <div class="card__title"><span class="ico" aria-hidden="true">🎓</span><h3>شهادة التأسيس</h3></div>
        <p class="small muted">${cert.earned ? 'مُستلَمة ✓ — قابلة للطباعة في أي وقت.' : 'تُمنح بعد إتمام المراحل وإتقان الحروف و٩٠٪ في الاختبار.'}</p>
      </a>
      <a class="card card--interactive" href="#/zero/pad">
        <div class="card__title"><span class="ico" aria-hidden="true">✍️</span><h3>لوح الكتابة</h3></div>
        <p class="small muted">مطبوع ومتصل، لأي حرف أو كلمة.</p>
      </a>
    </div>`;
}

/* ============================================================
   إعدادات التأسيس
   ============================================================ */
export function renderZeroSettings(host) {
  const pr = zeroPrefs();
  const snap = zeroSnapshot();

  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">⚙️</span><h1>إعدادات التأسيس</h1></div>
        <p>ثلاثة خيارات فقط — البقية في إعدادات الموقع العامة.</p>
      </div>
      <div class="row row--wrap"><a class="btn btn--sm" href="#/zero">← المراحل</a></div>
    </div>

    <div class="card mt-4">
      <label class="row row--between row--wrap" style="gap:12px;padding:10px 0">
        <span class="zero-info">
          <b>النطق التلقائي</b>
          <span class="tiny muted">يُنطق العنصر تلقائياً عند الانتقال إليه</span>
        </span>
        <span class="switch"><input type="checkbox" id="zAuto" ${pr.autoSpeak ? 'checked' : ''} /><span class="switch__track"></span></span>
      </label>
      <div class="divider"></div>
      <div class="row row--between row--wrap" style="gap:12px">
        <span class="zero-info">
          <b>سرعة النطق</b>
          <span class="tiny muted">البطيء يساعد على تمييز مخارج الحروف</span>
        </span>
        <select class="select" id="zRate" style="inline-size:140px">
          <option value="slow" ${pr.slowRate <= 0.6 ? 'selected' : ''}>بطيء</option>
          <option value="normal" ${pr.slowRate > 0.6 ? 'selected' : ''}>عادي</option>
        </select>
      </div>
      <div class="divider"></div>
      <div class="row row--between row--wrap" style="gap:12px">
        <span class="zero-info">
          <b>شكل الحروف على اللوح</b>
          <span class="tiny muted">الوضع الافتراضي عند فتح لوح الكتابة</span>
        </span>
        <select class="select" id="zPad" style="inline-size:140px">
          <option value="print" ${pr.padMode === 'print' ? 'selected' : ''}>مطبوع</option>
          <option value="cursive" ${pr.padMode === 'cursive' ? 'selected' : ''}>متصل</option>
        </select>
      </div>
    </div>

    <div class="grid grid--4 mt-4">
      ${stat('نسبة الإتقان', `${arNum(snap.percent)}٪`, '', 'stat--brand')}
      ${stat('المراحل', `${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}`)}
      ${stat('الحروف المتقنة', `${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}`)}
      ${stat('الاختبار النهائي', `${arNum(snap.examBest)}٪`, '', snap.examBest >= 90 ? 'stat--ok' : '')}
    </div>

    <div class="card mt-4" style="border-color:color-mix(in srgb, var(--bad) 40%, var(--line))">
      <div class="card__title"><span class="ico" aria-hidden="true">⚠️</span><h3>تصفير تقدّم قسم A0</h3></div>
      <p class="small muted">لا يمسّ تقدّمك في A1 و A2 و B1 ولا نقاطك.</p>
      <button class="btn" type="button" id="zReset">تصفير تقدّم التأسيس</button>
    </div>`;

  qs('#zAuto', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ autoSpeak: e.target.checked });
    toast(e.target.checked ? 'النطق التلقائي مفعّل 🔊' : 'النطق التلقائي مطفأ 🔇', 'info');
  });
  qs('#zRate', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ slowRate: e.target.value === 'slow' ? 0.55 : 1 });
    toast(e.target.value === 'slow' ? 'سرعة النطق: بطيء 🐢' : 'سرعة النطق: عادي', 'info');
  });
  qs('#zPad', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ padMode: e.target.value === 'cursive' ? 'cursive' : 'print' });
    toast(e.target.value === 'cursive' ? 'شكل الحروف: متصل' : 'شكل الحروف: مطبوع', 'info');
  });
  qs('#zReset', host)?.addEventListener('click', () => {
    if (!window.confirm('تصفير تقدّم قسم «من الصفر» (A0) فقط؟ لن يتأثر A1/A2/B1.')) return;
    resetZeroProgress();
    toast('تم تصفير تقدّم التأسيس', 'ok');
    window.__leaRenderAll?.();
  });
}

/* ============================================================
   لوح الكتابة الحر
   ============================================================ */
const PAD_PRESETS = ['A a', 'B b', 'C c', 'cat', 'dog', 'sun', 'book', 'Hello!', 'I am Ali.'];

export function renderZeroPad(host) {
  const pr = zeroPrefs();
  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">✍️</span><h1>لوح الكتابة</h1></div>
        <p>اكتب بإصبعك أو القلم أو الفأرة فوق الشبح الرمادي، وبدّل بين المطبوع والمتصل.</p>
      </div>
      <div class="row row--wrap"><a class="btn btn--sm" href="#/zero">← المراحل</a></div>
    </div>

    <div class="card mt-4">
      <div class="row row--wrap" id="padPresets" style="gap:8px">
        ${PAD_PRESETS.map((t, i) => `<button class="btn btn--sm ${i === 0 ? 'btn--primary' : ''}" type="button" data-pad="${esc(t)}">${esc(t)}</button>`).join('')}
      </div>
      <div class="divider"></div>
      <div class="row row--wrap" style="gap:8px">
        <input class="input" id="padCustom" dir="ltr" placeholder="أو اكتب أي كلمة…" autocomplete="off" spellcheck="false" style="flex:1;min-inline-size:180px" />
        <button class="btn" type="button" id="padCustomGo">اعرض</button>
      </div>
    </div>

    <div id="padHost" class="mt-4"></div>`;

  let pad = null;
  const mount = (text) => {
    const padHost = qs('#padHost', host);
    if (!padHost) return;
    if (pad && pad.destroy) { try { pad.destroy(); } catch {} }
    padHost.innerHTML = writingPadHTML({ text, mode: pr.padMode });
    pad = initWritingPad(padHost, {
      text,
      mode: pr.padMode,
      onChange: (mode) => setZeroPrefs({ padMode: mode }),
      onDraw: () => { const r = markPadUsed(); if (r.milestone) toast('أول كتابة على اللوح — أحسنت ✍️', 'ok'); },
    });
  };
  mount(PAD_PRESETS[0]);

  qsa('[data-pad]', host).forEach((b) => b.addEventListener('click', () => {
    qsa('[data-pad]', host).forEach((x) => x.classList.remove('btn--primary'));
    b.classList.add('btn--primary');
    mount(b.dataset.pad);
  }));
  qs('#padCustomGo', host)?.addEventListener('click', () => {
    const v = qs('#padCustom', host)?.value?.trim();
    if (v) mount(v.slice(0, 40));
  });
  qs('#padCustom', host)?.addEventListener('keydown', (e) => { if (e.key === 'Enter') qs('#padCustomGo', host)?.click(); });
}
