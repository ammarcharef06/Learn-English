/* ============================================================
   قسم «من الصفر» (A0) — الرئيسية + الإعدادات + لوح الكتابة الحر
   كل الواجهات بمكوّنات الموقع: .page-head · .card · .grid · .btn · .chip
   ============================================================ */
import { esc, qs, qsa, toast, arNum, ringHTML } from '../core/utils.js';
import { ZERO_TOTALS, zeroStageSize } from '../data/zero.js';
import { zeroSnapshot, certificate, setZeroPrefs, zeroPrefs, resetZeroProgress, markPadUsed } from '../core/zeroflow.js';
import { writingPadHTML, initWritingPad } from '../core/zero-pad.js';
import { zeroPageHead } from './zero-head.js';
import { t } from '../core/i18n.js';

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
    ${zeroPageHead({
      icon: '🌱',
      title: 'من الصفر — تأسيس A0',
      subtitle: 'ثماني مراحل مرتّبة: الحروف، ثم الحروف المركّبة، ثم الأرقام والوقت، ثم الضمائر، ثم ١٢٠ كلمة و٤٠ جملة وأربع قراءات.',
      actionsHtml: `
        <a class="btn btn--primary" href="#/zero/stage/${next.id}">${started ? `متابعة: ${esc(next.titleAr)}` : 'ابدأ بالحروف'} ←</a>
        <a class="btn" href="#/zero/pad">✍️ لوح الكتابة</a>
      `,
    })}

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
    ${zeroPageHead({
      icon: '⚙️', title: t('zeroSettings.title'),
      subtitle: t('zeroSettings.subtitle'),
      actionsHtml: `<a class="btn btn--sm" href="#/zero">← ${t('zeroSettings.stages')}</a><a class="btn btn--sm" href="./index.html#/settings" data-exit-zero>${t('zeroSettings.general')}</a>`,
    })}

    <div class="card mt-4">
      <label class="row row--between row--wrap" style="gap:12px;padding:10px 0">
        <span class="zero-info">
          <b>${t('zeroSettings.autoSpeak')}</b>
          <span class="tiny muted">${t('zeroSettings.autoSpeakDesc')}</span>
        </span>
        <span class="switch"><input type="checkbox" id="zAuto" ${pr.autoSpeak ? 'checked' : ''} /><span class="switch__track"></span></span>
      </label>
      <div class="divider"></div>
      <div class="row row--between row--wrap" style="gap:12px">
        <span class="zero-info">
          <b>${t('zeroSettings.rate')}</b>
          <span class="tiny muted">${t('zeroSettings.rateDesc')}</span>
        </span>
        <select class="select" id="zRate" style="inline-size:140px">
          <option value="slow" ${pr.slowRate <= 0.6 ? 'selected' : ''}>${t('zeroSettings.slow')}</option>
          <option value="normal" ${pr.slowRate > 0.6 ? 'selected' : ''}>${t('zeroSettings.normal')}</option>
        </select>
      </div>
      <div class="divider"></div>
      <div class="row row--between row--wrap" style="gap:12px">
        <span class="zero-info">
          <b>${t('zeroSettings.letterStyle')}</b>
          <span class="tiny muted">${t('zeroSettings.letterStyleDesc')}</span>
        </span>
        <select class="select" id="zPad" style="inline-size:140px">
          <option value="print" ${pr.padMode === 'print' ? 'selected' : ''}>${t('zeroSettings.print')}</option>
          <option value="cursive" ${pr.padMode === 'cursive' ? 'selected' : ''}>${t('zeroSettings.cursive')}</option>
        </select>
      </div>
    </div>

    <div class="grid grid--4 mt-4">
      ${stat(t('zeroSettings.mastery'), `${arNum(snap.percent)}٪`, '', 'stat--brand')}
      ${stat(t('zeroSettings.stages'), `${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}`)}
      ${stat(t('zeroSettings.masteredLetters'), `${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}`)}
      ${stat(t('zeroSettings.finalExam'), `${arNum(snap.examBest)}٪`, '', snap.examBest >= 90 ? 'stat--ok' : '')}
    </div>


    <div class="card mt-4" style="border-color:color-mix(in srgb, var(--bad) 40%, var(--line))">
      <div class="card__title"><span class="ico" aria-hidden="true">⚠️</span><h3>${t('zeroSettings.resetTitle')}</h3></div>
      <p class="small muted">${t('zeroSettings.resetScope')}</p>
      <button class="btn" type="button" id="zReset">${t('zeroSettings.resetButton')}</button>
    </div>`;

  qs('#zAuto', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ autoSpeak: e.target.checked });
    toast(e.target.checked ? t('zeroSettings.autoSpeakOn') : t('zeroSettings.autoSpeakOff'), 'info');
  });
  qs('#zRate', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ slowRate: e.target.value === 'slow' ? 0.55 : 1 });
    toast(e.target.value === 'slow' ? t('zeroSettings.rateSlowToast') : t('zeroSettings.rateNormalToast'), 'info');
  });
  qs('#zPad', host)?.addEventListener('change', (e) => {
    setZeroPrefs({ padMode: e.target.value === 'cursive' ? 'cursive' : 'print' });
    toast(e.target.value === 'cursive' ? t('zeroSettings.cursiveToast') : t('zeroSettings.printToast'), 'info');
  });
  qs('#zReset', host)?.addEventListener('click', () => {
    if (!window.confirm(t('zeroSettings.resetConfirm'))) return;
    resetZeroProgress();
    toast(t('zeroSettings.resetDone'), 'ok');
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
    ${zeroPageHead({
      icon: '✍️', title: 'لوح الكتابة',
      subtitle: 'اكتب بإصبعك أو القلم أو الفأرة فوق الشبح الرمادي، وبدّل بين المطبوع والمتصل.',
      actionsHtml: '<a class="btn btn--sm" href="#/zero">← المراحل</a>',
    })}

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
