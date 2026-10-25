import { t as uiText } from '../core/i18n.js';
/* ============================================================
   قسم «من الصفر» (A0) — الاختبار النهائي + شهادة التأسيس
   بمكوّنات الموقع: .page-head · .card · .grid · .stat · .btn · .chip
   ============================================================ */
import { esc, qs, toast, confetti, prettyDateAr, dateKey, arNum } from '../core/utils.js';
import { zeroExamQuestions, ZERO_TOTALS } from '../data/zero.js';
import {
  zeroSnapshot, recordZeroExam, certificateReady, grantCertificate, certificate,
  saveCertificateName,
} from '../core/zeroflow.js';
import { runQuiz } from './quiz-runner.js';
import { stat } from './zero.js';

const EXAM_SIZE = 30;
const PASS = 90;

/* ---------- شروط الاستحقاق ---------- */
function reqList(snap) {
  const row = (ok, text) => `<div class="row" style="gap:10px;align-items:center">
    <span class="chip ${ok ? 'chip--ok' : 'chip--line'}" style="min-inline-size:34px;justify-content:center">${ok ? '✓' : '○'}</span>
    <span class="${ok ? '' : 'muted'}">${text}</span>
  </div>`;
  return `<div class="stack" style="gap:10px">
    ${row(snap.doneStages === ZERO_TOTALS.stages, `${uiText('ui.literal.cb5a7e65')} <b>${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}</b>`)}
    ${row(snap.lettersMastered === ZERO_TOTALS.letters, `${uiText('ui.literal.7a053de9')} <b>${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}</b>`)}
    ${row(snap.examBest >= PASS, `${uiText('ui.literal.5c8094be')} <b>${arNum(snap.examBest)}٪</b> من ${arNum(PASS)}٪`)}
  </div>`;
}

/* ============================================================
   الاختبار النهائي
   ============================================================ */
export function renderZeroExam(host) {
  const snap = zeroSnapshot();
  const ready = certificateReady();

  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">🧪</span><h1>${uiText('ui.literal.cea94354')} </h1></div>
        <p>${arNum(EXAM_SIZE)} ${uiText('ui.literal.eefc663c')} </p>
      </div>
      <div class="row row--wrap"><a class="btn btn--sm" href="#/zero">← ${uiText('ui.literal.0bb7be6c')} </a></div>
    </div>

    <div class="grid grid--3 mt-4">
      ${stat(uiText('ui.literal.68208d86'), `${arNum(snap.examBest)}٪`, '', snap.examBest >= PASS ? 'stat--ok' : 'stat--brand')}
      ${stat(uiText('ui.literal.b152632c'), arNum(snap.raw.exam?.attempts || 0))}
      ${stat(uiText('ui.literal.56de3ef0'), certificate().earned ? uiText('ui.literal.5c9ec1b9') : ready ? uiText('ui.literal.6959b0a8') : uiText('ui.literal.0f7b650b'))}
    </div>

    <div class="card mt-4">
      <div class="card__title"><span class="ico" aria-hidden="true">🎯</span><h3>${uiText('ui.literal.86240f73')} </h3></div>
      <div class="zstatus">${reqList(snap)}</div>
      <p class="small muted mt-3">${uiText('ui.literal.1726f276')} </p>
      <div class="row row--wrap mt-3" style="gap:8px">
        <button class="btn btn--primary" type="button" id="zeroExamStart">${uiText('ui.literal.b2580414')} ${arNum(EXAM_SIZE)} ${uiText('ui.literal.647fd4c6')} </button>
        ${ready ? uiText('ui.literal.27e9b4b5') : ''}
      </div>
    </div>

    <div id="zeroExamRun" class="mt-4"></div>`;

  bindStart(host);
}

function bindStart(host) {
  qs('#zeroExamStart', host)?.addEventListener('click', () => {
    const runHost = qs('#zeroExamRun', host);
    runHost.innerHTML = '';
    runHost.scrollIntoView({ block: 'start', behavior: 'smooth' });
    const questions = zeroExamQuestions(EXAM_SIZE);
    if (!questions.length) {
      runHost.innerHTML = uiText('ui.literal.dde5e05f');
      return;
    }
    runQuiz(runHost, {
      questions,
      allowReveal: true,
      onSummary: (res) => {
        const r = recordZeroExam(res.correct, res.total);
        if (r.badges?.length) toast(`🏅 ${r.badges.map((b) => b.ar).join(' · ')}`, 'ok');
        if (certificateReady()) {
          const g = grantCertificate();
          confetti(120);
          toast(g.granted ? uiText('ui.literal.dddf30f8') : uiText('ui.literal.42655d79'), 'ok');
        }
        toast(`${uiText('ui.literal.8e8e13e5')} ${res.correct}/${res.total} (${res.accuracy}%)`, res.accuracy >= 70 ? 'ok' : 'warn');
        window.__leaRefreshChrome?.();
      },
      extraActionsHtml: uiText('ui.literal.f89a49c5'),
    });
  });
}

/* ============================================================
   شهادة التأسيس
   ============================================================ */
export function renderZeroCertificate(host) {
  const snap = zeroSnapshot();
  if (certificateReady() && !certificate().earned) grantCertificate();
  const cert = certificate();
  const ready = certificateReady();

  host.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title"><span class="ico" aria-hidden="true">🎓</span><h1>${uiText('ui.literal.07e8f3c3')} </h1></div>
        <p>${cert.earned ? uiText('ui.literal.557a98db') : uiText('ui.literal.addf82e5')}</p>
      </div>
      <div class="row row--wrap">
        <a class="btn btn--sm" href="#/zero">← ${uiText('ui.literal.0bb7be6c')} </a>
        <button class="btn btn--sm" type="button" id="certCopy">📋 ${uiText('ui.literal.3462012d')} </button>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card__title">
        <span class="ico" aria-hidden="true">🎯</span><h3>${uiText('ui.literal.7234f990')} </h3>
        <span class="spacer chip ${ready ? 'chip--ok' : 'chip--brand'}">${ready ? uiText('ui.literal.d8e02287') : uiText('ui.literal.342503ca')}</span>
      </div>
      <div class="zstatus">${reqList(snap)}</div>
    </div>

    <div class="zcert-wrap mt-4 ${cert.earned ? '' : 'is-locked'}">
      <div class="zcert print-area" id="zeroCert">
        <div class="zcert__top">
          <img class="zcert__mark" src="./assets/img/favicon.svg" alt="" />
          <span class="zcert__brand">${uiText('ui.literal.0704ffae')} <small dir="ltr">English Academy</small></span>
        </div>
        <h2 class="zcert__title">${uiText('ui.literal.c0d5c8a1')} </h2>
        <p class="zcert__sub" dir="ltr">Foundation Certificate — Level A0</p>

        <div class="zcert__field">
          <label for="certName">${uiText('ui.literal.cae8b39c')} </label>
          <input class="input" id="certName" type="text" maxlength="60" autocomplete="name" placeholder="${uiText('ui.literal.12ff3b2f')} " value="${esc(cert.name || '')}" />
        </div>
        <div class="zcert__name" id="certNameOut" aria-live="polite">${esc(cert.name || '................................')}</div>

        <p class="zcert__body">
          ${uiText('ui.literal.515dd45b')}
          ${uiText('ui.literal.1b465547')}
        </p>

        <div class="grid grid--4">
          ${stat(uiText('ui.literal.5ef0eeec'), `${arNum(snap.percent)}٪`)}
          ${stat(uiText('ui.literal.a466c65d'), `${arNum(snap.examBest)}٪`)}
          ${stat(uiText('ui.literal.81f2297b'), `${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}`)}
          ${stat(uiText('ui.literal.4ea53050'), arNum(ZERO_TOTALS.days))}
        </div>

        <div class="zcert__foot">
          <div>
            <div>${uiText('ui.literal.c66dbbac')} <b dir="ltr">${esc(cert.code || '—')}</b></div>
            <div>${uiText('ui.literal.bacb4bac')} ${esc(cert.at ? prettyDateAr(dateKey(new Date(cert.at))) : '—')}</div>
          </div>
          <div class="zcert__seal">🎓<span>${uiText('ui.literal.1d56bd89')} <br>${uiText('ui.literal.bcd19ad7')} </span></div>
        </div>
        <p class="zcert__note">${uiText('ui.literal.b5e4d8c5')} A1 ${uiText('ui.literal.e75aaf7d')} </p>
      </div>
    </div>

    <div class="row row--wrap mt-4" style="gap:10px">
      <button class="btn btn--primary" type="button" id="certPrint" aria-describedby="certPrintHint" ${cert.earned ? '' : 'disabled'}>🖨️ ${uiText('ui.literal.51c39f29')} / ${uiText('ui.literal.768db979')} PDF</button>
      <span class="sr-only" id="certPrintHint">${uiText('ui.literal.7bbbc2e4')} PDF ${uiText('ui.literal.782000df')} </span>
      <a class="btn" href="./index.html">📚 ${uiText('ui.literal.6e06552c')} A1</a>
    </div>`;

  const nameInput = qs('#certName', host);
  nameInput?.addEventListener('input', () => {
    const out = qs('#certNameOut', host);
    if (out) out.textContent = nameInput.value.trim() || '................................';
  });
  nameInput?.addEventListener('change', () => saveCertificateName(nameInput.value));

  qs('#certPrint', host)?.addEventListener('click', () => {
    saveCertificateName(nameInput?.value || '');
    document.body.classList.add('printing-cert');
    setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove('printing-cert'), 400); }, 60);
  });

  qs('#certCopy', host)?.addEventListener('click', async () => {
    const c = certificate();
    const text = `${uiText('ui.literal.b81a1a0e')} A0 — ${uiText('ui.literal.0704ffae')} \n${uiText('ui.literal.e05b10df')} ${c.name || '—'}\n${uiText('ui.literal.c66dbbac')} ${c.code || '—'}\n${uiText('ui.literal.4b47fae2')} ${snap.percent}%\n${uiText('ui.literal.34ca5425')} ${snap.examBest}%\n${uiText('ui.literal.c840a162')} ${snap.doneStages}/${ZERO_TOTALS.stages}\n${uiText('ui.literal.d136f153')} ${snap.lettersMastered}/${ZERO_TOTALS.letters}\n${uiText('ui.literal.ee5e3087')} ${ZERO_TOTALS.days}\n${uiText('ui.literal.5d230e51')} ${ZERO_TOTALS.pronouns}`;
    try { await navigator.clipboard.writeText(text); toast(uiText('ui.literal.56d90cf5'), 'ok'); }
    catch { toast(uiText('ui.literal.0c9d7274'), 'warn'); }
  });
}
