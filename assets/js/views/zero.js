/* ============================================================
   قسم «من الصفر» (A0) — الصفحة الرئيسية + الإعدادات + لوح الكتابة الحر
   تصميم هادئ: بلا إحصاءات ولا شرائح ولا زحام — قائمة مرتّبة فقط.
   ============================================================ */
import { esc, qs, qsa, toast, arNum } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { progress } from '../core/store.js';
import { ZERO_STAGES, ZERO_TOTALS, zeroStageSize } from '../data/zero.js';
import {
  zeroSnapshot, certificate, setZeroPrefs, zeroPrefs, resetZeroProgress,
} from '../core/zeroflow.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';
import { markPadUsed } from '../core/zeroflow.js';

/* ---------- أول مرحلة غير مكتملة ---------- */
function nextStage(stageList) {
  return stageList.find((s) => !s.state.done) || stageList[stageList.length - 1];
}

/* صيغة عربية سليمة لعدد العناصر */
function itemsLabel(n) {
  if (n === 1) return 'عنصر واحد';
  if (n === 2) return 'عنصران';
  if (n >= 3 && n <= 10) return `${arNum(n)} عناصر`;
  return `${arNum(n)} عنصراً`;
}

/* ---------- حالة المرحلة كنصّ قصير ---------- */
function stageState(s) {
  if (s.state.done) return { text: `${arNum(s.state.best)}٪`, cls: 'is-done' };
  if (s.state.seen) return { text: 'بدأت', cls: 'is-started' };
  return { text: `${arNum(s.minutes)} د`, cls: '' };
}

/* ============================================================
   الرئيسية
   ============================================================ */
export function renderZero(host) {
  const snap = zeroSnapshot();
  const cert = certificate();
  const next = nextStage(snap.stageList);
  const arabicNums = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨'];

  host.innerHTML = `
    <div class="zpage">
      <header class="zhead">
        <h1>من الصفر — تأسيس A0</h1>
        <p>ثماني مراحل مرتّبة. ابدأ من الحروف وتابع خطوة بخطوة، بلا استعجال.</p>
      </header>

      ${snap.percent > 0 && snap.percent < 100 ? `
        <a class="zresume" href="#/zero/stage/${next.id}" data-nav>
          <span class="zresume__ico" aria-hidden="true">${next.icon}</span>
          <span class="zresume__b">
            <b>تابع: ${esc(next.titleAr)}</b>
            <small>${esc(next.subAr)}</small>
          </span>
          <span class="zresume__go">متابعة ←</span>
        </a>` : ''}

      <ol class="zsteps">
        ${snap.stageList.map((s, i) => {
          const st = stageState(s);
          return `<li>
            <a class="zstep" href="#/zero/stage/${s.id}" data-nav>
              <span class="zstep__n">${arabicNums[i] || s.n}</span>
              <span class="zstep__b">
                <b>${esc(s.titleAr)}</b>
                <small>${esc(s.subAr)}</small>
              </span>
              <span class="zstep__meta">${esc(itemsLabel(zeroStageSize(s.id)))}</span>
              <span class="zstep__s ${st.cls}">${st.text}</span>
            </a>
          </li>`;
        }).join('')}
      </ol>

      <div class="zlinks">
        <a class="zlink" href="#/zero/exam" data-nav>
          <span class="zlink__ico" aria-hidden="true">🧪</span>
          <span class="zlink__b"><b>الاختبار النهائي</b><small>٣٠ سؤالاً من المراحل الثمانية</small></span>
          <span class="zlink__s">${snap.examBest ? `أفضل نتيجة ${arNum(snap.examBest)}٪` : 'لم تجرّبه بعد'}</span>
        </a>
        <a class="zlink" href="#/zero/certificate" data-nav>
          <span class="zlink__ico" aria-hidden="true">🎓</span>
          <span class="zlink__b"><b>شهادة التأسيس</b><small>تُمنح بعد إتمام المراحل وإتقان الحروف و٩٠٪ في الاختبار</small></span>
          <span class="zlink__s">${cert.earned ? 'مُستلَمة ✓' : 'غير مستحقة بعد'}</span>
        </a>
        <a class="zlink" href="#/zero/pad" data-nav>
          <span class="zlink__ico" aria-hidden="true">✍️</span>
          <span class="zlink__b"><b>لوح الكتابة</b><small>تدرّب على كتابة أي حرف أو كلمة</small></span>
          <span class="zlink__s">مطبوع · متصل</span>
        </a>
      </div>

      <p class="zhint">نصيحتنا: مرحلة واحدة في الجلسة، وكرّر النطق بصوت مسموع.</p>
    </div>`;
}

/* ============================================================
   إعدادات التأسيس
   ============================================================ */
export function renderZeroSettings(host) {
  const pr = zeroPrefs();
  const snap = zeroSnapshot();

  host.innerHTML = `
    <div class="zpage">
      <header class="zhead">
        <h1>إعدادات التأسيس</h1>
        <p>ثلاثة خيارات فقط — البقية في إعدادات الموقع العامة.</p>
      </header>

      <div class="zrows">
        <label class="zsetting">
          <span class="zsetting__b">
            <b>النطق التلقائي</b>
            <small>يُنطق العنصر تلقائياً عند الانتقال إليه</small>
          </span>
          <span class="switch"><input type="checkbox" id="zAuto" ${pr.autoSpeak ? 'checked' : ''} /><span class="switch__track"></span></span>
        </label>

        <div class="zsetting">
          <span class="zsetting__b">
            <b>سرعة النطق</b>
            <small>البطيء يساعد على تمييز مخارج الحروف</small>
          </span>
          <select class="select zsetting__sel" id="zRate">
            <option value="slow" ${pr.slowRate <= 0.6 ? 'selected' : ''}>بطيء</option>
            <option value="normal" ${pr.slowRate > 0.6 ? 'selected' : ''}>عادي</option>
          </select>
        </div>

        <div class="zsetting">
          <span class="zsetting__b">
            <b>شكل الحروف على اللوح</b>
            <small>الوضع الافتراضي عند فتح لوح الكتابة</small>
          </span>
          <select class="select zsetting__sel" id="zPad">
            <option value="print" ${pr.padMode === 'print' ? 'selected' : ''}>مطبوع</option>
            <option value="cursive" ${pr.padMode === 'cursive' ? 'selected' : ''}>متصل</option>
          </select>
        </div>
      </div>

      <h2 class="zsub-title">تقدّمي في التأسيس</h2>
      <div class="zstats">
        <div><b>${arNum(snap.percent)}٪</b><span>نسبة الإتقان</span></div>
        <div><b>${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}</b><span>المراحل</span></div>
        <div><b>${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}</b><span>الحروف</span></div>
        <div><b>${arNum(snap.examBest)}٪</b><span>الاختبار</span></div>
      </div>

      <div class="zdanger">
        <b>تصفير تقدّم قسم A0</b>
        <small>لا يمسّ تقدّمك في A1 و A2 و B1 ولا نقاطك.</small>
        <button class="zbtn zbtn--danger" type="button" id="zReset">تصفير تقدّم التأسيس</button>
      </div>
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
    renderZeroSettings(host);
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
    <div class="zpage zpage--wide">
      <header class="zhead">
        <h1>لوح الكتابة</h1>
        <p>اكتب بإصبعك أو القلم أو الفأرة فوق الشبح الرمادي، وبدّل بين المطبوع والمتصل.</p>
      </header>

      <div class="zpadbar" id="padPresets">
        ${PAD_PRESETS.map((t, i) => `<button class="zchip ${i === 0 ? 'is-on' : ''}" type="button" data-pad="${esc(t)}">${esc(t)}</button>`).join('')}
      </div>
      <div class="zpadcustom">
        <input class="input" id="padCustom" dir="ltr" placeholder="اكتب أي كلمة…" autocomplete="off" spellcheck="false" />
        <button class="zbtn" type="button" id="padCustomGo">اعرض</button>
      </div>

      <div id="padHost"></div>
    </div>`;

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
    qsa('[data-pad]', host).forEach((x) => x.classList.remove('is-on'));
    b.classList.add('is-on');
    mount(b.dataset.pad);
  }));
  qs('#padCustomGo', host)?.addEventListener('click', () => {
    const v = qs('#padCustom', host)?.value?.trim();
    if (v) mount(v.slice(0, 40));
  });
  qs('#padCustom', host)?.addEventListener('keydown', (e) => { if (e.key === 'Enter') qs('#padCustomGo', host)?.click(); });
}
