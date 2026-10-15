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
    ${row(snap.doneStages === ZERO_TOTALS.stages, `إتمام المراحل الثمانية <b>${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}</b>`)}
    ${row(snap.lettersMastered === ZERO_TOTALS.letters, `إتقان الحروف الستة والعشرين <b>${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}</b>`)}
    ${row(snap.examBest >= PASS, `النتيجة في الاختبار <b>${arNum(snap.examBest)}٪</b> من ${arNum(PASS)}٪`)}
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
        <div class="page-title"><span class="ico" aria-hidden="true">🧪</span><h1>الاختبار النهائي</h1></div>
        <p>${arNum(EXAM_SIZE)} سؤالاً من المراحل الثمانية. أسئلة جديدة في كل محاولة، وبلا حدّ للمحاولات.</p>
      </div>
      <div class="row row--wrap"><a class="btn btn--sm" href="#/zero">← المراحل</a></div>
    </div>

    <div class="grid grid--3 mt-4">
      ${stat('أفضل نتيجة', `${arNum(snap.examBest)}٪`, '', snap.examBest >= PASS ? 'stat--ok' : 'stat--brand')}
      ${stat('المحاولات', arNum(snap.raw.exam?.attempts || 0))}
      ${stat('الشهادة', certificate().earned ? 'مُستلَمة ✓' : ready ? 'جاهزة' : 'لم تُستحق بعد')}
    </div>

    <div class="card mt-4">
      <div class="card__title"><span class="ico" aria-hidden="true">🎯</span><h3>شروط شهادة التأسيس</h3></div>
      <div class="zstatus">${reqList(snap)}</div>
      <p class="small muted mt-3">هذه شروط الشهادة فقط — لا شروط دخول. كل المستويات مفتوحة دائماً.</p>
      <div class="row row--wrap mt-3" style="gap:8px">
        <button class="btn btn--primary" type="button" id="zeroExamStart">ابدأ الاختبار (${arNum(EXAM_SIZE)} سؤالاً)</button>
        ${ready ? '<a class="btn" href="#/zero/certificate">🎓 إلى الشهادة</a>' : ''}
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
      runHost.innerHTML = '<div class="card"><div class="empty"><span class="ico">🤷</span><p>تعذّر توليد الأسئلة.</p></div></div>';
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
          toast(g.granted ? '🎓 استحققت شهادة التأسيس!' : 'ما زلت مستحقاً للشهادة ✓', 'ok');
        }
        toast(`اختبار مكتمل: ${res.correct}/${res.total} (${res.accuracy}%)`, res.accuracy >= 70 ? 'ok' : 'warn');
        window.__leaRefreshChrome?.();
      },
      extraActionsHtml: '<a class="btn" href="#/zero">المراحل</a><a class="btn" href="#/zero/certificate">الشهادة</a>',
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
        <div class="page-title"><span class="ico" aria-hidden="true">🎓</span><h1>شهادة التأسيس</h1></div>
        <p>${cert.earned ? 'مُستلَمة. اكتب اسمك ثم اطبعها أو احفظها PDF.' : 'أكمل الشروط الثلاثة ثم ستُمنح تلقائياً.'}</p>
      </div>
      <div class="row row--wrap">
        <a class="btn btn--sm" href="#/zero">← المراحل</a>
        <button class="btn btn--sm" type="button" id="certCopy">📋 انسخ ملخّص تقدّمي</button>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card__title">
        <span class="ico" aria-hidden="true">🎯</span><h3>شروط الاستحقاق</h3>
        <span class="spacer chip ${ready ? 'chip--ok' : 'chip--brand'}">${ready ? 'مستحق ✓' : 'أكمل ثم عد'}</span>
      </div>
      <div class="zstatus">${reqList(snap)}</div>
    </div>

    <div class="zcert-wrap mt-4 ${cert.earned ? '' : 'is-locked'}">
      <div class="zcert print-area" id="zeroCert">
        <div class="zcert__top">
          <span class="zcert__mark">EN</span>
          <span class="zcert__brand">أكاديمية الإنجليزية<small dir="ltr">English Academy</small></span>
        </div>
        <h2 class="zcert__title">شهادة إتمام التأسيس</h2>
        <p class="zcert__sub" dir="ltr">Foundation Certificate — Level A0</p>

        <div class="zcert__field">
          <span>الاسم على الشهادة</span>
          <input class="input" id="certName" type="text" maxlength="60" placeholder="اكتب اسمك هنا" value="${esc(cert.name || '')}" />
        </div>
        <div class="zcert__name" id="certNameOut">${esc(cert.name || '................................')}</div>

        <p class="zcert__body">
          أتمّ المتعلّم المراحل الثمانية لقسم «من الصفر»: الحروف الستة والعشرين، والحروف المركّبة، والأرقام،
          والأيام والشهور والفصول والوقت، والضمائر وفعل الكينونة، وأول ١٢٠ كلمة، وأول ٤٠ جملة، وأربع قراءات.
        </p>

        <div class="grid grid--4">
          ${stat('الإتقان', `${arNum(snap.percent)}٪`)}
          ${stat('الاختبار', `${arNum(snap.examBest)}٪`)}
          ${stat('الحروف', `${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}`)}
          ${stat('الكلمات', `${arNum(snap.wordsLearned)}/${arNum(ZERO_TOTALS.words)}`)}
        </div>

        <div class="zcert__foot">
          <div>
            <div>رقم الشهادة: <b dir="ltr">${esc(cert.code || '—')}</b></div>
            <div>تاريخ الاستحقاق: ${esc(cert.at ? prettyDateAr(dateKey(new Date(cert.at))) : '—')}</div>
          </div>
          <div class="zcert__seal">🎓<span>شهادة<br>شخصية</span></div>
        </div>
        <p class="zcert__note">شهادة شخصية من موقعك التعليمي، محفوظة على جهازك. المستوى A1 مفتوح بلا أي قفل.</p>
      </div>
    </div>

    <div class="row row--wrap mt-4" style="gap:10px">
      <button class="btn btn--primary" type="button" id="certPrint" ${cert.earned ? '' : 'disabled'}>🖨️ طباعة / حفظ PDF</button>
      <a class="btn" href="./index.html">📚 ابدأ المستوى A1</a>
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
    const text = `شهادة تأسيس A0 — أكاديمية الإنجليزية\nالاسم: ${c.name || '—'}\nرقم الشهادة: ${c.code || '—'}\nالإتقان: ${snap.percent}%\nالاختبار: ${snap.examBest}%\nالمراحل: ${snap.doneStages}/${ZERO_TOTALS.stages}\nالحروف: ${snap.lettersMastered}/${ZERO_TOTALS.letters}\nالكلمات: ${snap.wordsLearned}/${ZERO_TOTALS.words}`;
    try { await navigator.clipboard.writeText(text); toast('نُسخ ملخّص تقدّمك 📋', 'ok'); }
    catch { toast('تعذّر النسخ — انسخه يدوياً', 'warn'); }
  });
}
