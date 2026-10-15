/* ============================================================
   قسم «من الصفر» (A0) — الاختبار النهائي + شهادة التأسيس
   ============================================================ */
import { esc, qs, qsa, toast, confetti, prettyDateAr, dateKey, arNum } from '../core/utils.js';
import { progress } from '../core/store.js';
import { renderSidebarStats } from './shell.js';
import { ZERO_STAGES, zeroExamQuestions, ZERO_TOTALS } from '../data/zero.js';
import {
  zeroSnapshot, recordZeroExam, certificateReady, grantCertificate, certificate,
  saveCertificateName, resetZeroProgress,
} from '../core/zeroflow.js';
import { runQuiz } from './quiz-runner.js';

const EXAM_SIZE = 30;
const PASS = 90;

/* ============================================================
   الاختبار النهائي
   ============================================================ */
export function renderZeroExam(host) {
  const snap = zeroSnapshot();
  const cert = certificate();
  const ready = certificateReady();

  host.innerHTML = `
    <div class="zpage">
      <header class="zhead">
        <a class="zback" href="#/zero" data-nav>← المراحل</a>
        <h1>الاختبار النهائي</h1>
        <p>${EXAM_SIZE} سؤالاً من المراحل الثمانية. أسئلة جديدة في كل محاولة، وبلا حدّ للمحاولات.</p>
      </header>

      <div class="zmeta">
        <span>أفضل نتيجة: <b>${arNum(snap.examBest)}٪</b></span>
        <span>المحاولات: <b>${arNum(snap.raw.exam?.attempts || 0)}</b></span>
      </div>

      <ol class="zreq">
        <li class="${snap.doneStages === ZERO_TOTALS.stages ? 'is-ok' : ''}">
          <span>${snap.doneStages === ZERO_TOTALS.stages ? '✓' : '○'}</span>
          إتمام المراحل الثمانية <b>${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}</b>
        </li>
        <li class="${snap.lettersMastered === ZERO_TOTALS.letters ? 'is-ok' : ''}">
          <span>${snap.lettersMastered === ZERO_TOTALS.letters ? '✓' : '○'}</span>
          إتقان الحروف الستة والعشرين <b>${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}</b>
        </li>
        <li class="${snap.examBest >= PASS ? 'is-ok' : ''}">
          <span>${snap.examBest >= PASS ? '✓' : '○'}</span>
          النتيجة في الاختبار <b>${arNum(snap.examBest)}٪</b> من ${arNum(PASS)}٪
        </li>
      </ol>
      <p class="zhint">هذه شروط شهادة التأسيس فقط — لا شروط دخول. كل المستويات مفتوحة دائماً.</p>

      <button class="zbtn zbtn--primary zbtn--big" type="button" id="zeroExamStart">ابدأ الاختبار</button>
      ${ready ? '<a class="zbtn" href="#/zero/certificate" data-nav>🎓 إلى الشهادة</a>' : ''}
      <div id="zeroExamRun" class="zrun"></div>
    </div>`;

  bindStart(host);
}

function statusBlock(snap, cert, ready) {
  return `
    <div class="zmeta">
      <span>أفضل نتيجة: <b>${arNum(snap.examBest)}٪</b></span>
      <span>المحاولات: <b>${arNum(snap.raw.exam?.attempts || 0)}</b></span>
      <span>الشهادة: <b>${cert.earned ? 'مُستلَمة ✓' : ready ? 'جاهزة' : 'لم تُستحق بعد'}</b></span>
    </div>
    <ol class="zreq">
      <li class="${snap.doneStages === ZERO_TOTALS.stages ? 'is-ok' : ''}"><span>${snap.doneStages === ZERO_TOTALS.stages ? '✓' : '○'}</span>إتمام المراحل الثمانية <b>${arNum(snap.doneStages)}/${arNum(ZERO_TOTALS.stages)}</b></li>
      <li class="${snap.lettersMastered === ZERO_TOTALS.letters ? 'is-ok' : ''}"><span>${snap.lettersMastered === ZERO_TOTALS.letters ? '✓' : '○'}</span>إتقان الحروف الستة والعشرين <b>${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}</b></li>
      <li class="${snap.examBest >= PASS ? 'is-ok' : ''}"><span>${snap.examBest >= PASS ? '✓' : '○'}</span>النتيجة في الاختبار <b>${arNum(snap.examBest)}٪</b> من ${arNum(PASS)}٪</li>
    </ol>`;
}

function bindStart(host) {
  qs('#zeroExamStart', host)?.addEventListener('click', () => {
    const runHost = qs('#zeroExamRun', host);
    runHost.innerHTML = '';
    runHost.scrollIntoView({ block: 'start', behavior: 'smooth' });
    const questions = zeroExamQuestions(EXAM_SIZE);
    if (!questions.length) { runHost.innerHTML = '<div class="znotice">تعذّر توليد الأسئلة.</div>'; return; }
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
        renderSidebarStats();
        const status = qs('.zstatus', host);
        if (status) status.innerHTML = statusBlock(zeroSnapshot(), certificate(), certificateReady());
      },
      extraActionsHtml: '<a class="zbtn" href="#/zero" data-nav>المراحل</a><a class="zbtn" href="#/zero/certificate" data-nav>الشهادة</a>',
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

  host.innerHTML = `
    <div class="zpage zpage--wide">
      <header class="zhead">
        <a class="zback" href="#/zero" data-nav>← المراحل</a>
        <h1>شهادة التأسيس</h1>
        <p>${cert.earned ? 'مُستلَمة. اكتب اسمك ثم اطبعها أو احفظها PDF.' : 'أكمل الشروط الثلاثة ثم ستُمنح تلقائياً.'}</p>
      </header>

      <div class="zstatus">${statusBlock(snap, cert, certificateReady())}</div>

      ${cert.earned ? '' : '<p class="zhint">يمكنك متابعة المستويات A1–B1 في أي وقت — لا يوجد أي قفل.</p>'}

      <div class="zcert-wrap ${cert.earned ? '' : 'is-locked'}">
        <div class="zcert print-area" id="zeroCert">
          <div class="zcert__top">
            <span class="zcert__mark">EN</span>
            <span class="zcert__brand">أكاديمية الإنجليزية<small dir="ltr">English Academy</small></span>
          </div>
          <h2 class="zcert__title">شهادة إتمام التأسيس</h2>
          <p class="zcert__sub" dir="ltr">Foundation Certificate — Level A0</p>

          <label class="zcert__field">
            <span>الاسم على الشهادة</span>
            <input class="input" id="certName" type="text" maxlength="60" placeholder="اكتب اسمك هنا" value="${esc(cert.name || '')}" />
          </label>
          <div class="zcert__name" id="certNameOut">${esc(cert.name || '................................')}</div>

          <p class="zcert__body">
            أتمّ المتعلّم المراحل الثمانية لقسم «من الصفر»: الحروف الستة والعشرين، والحروف المركّبة، والأرقام،
            والأيام والشهور والفصول والوقت، والضمائر وفعل الكينونة، وأول ١٢٠ كلمة، وأول ٤٠ جملة، وأربع قراءات.
          </p>

          <div class="zcert__stats">
            <div><b>${arNum(snap.percent)}٪</b><span>الإتقان</span></div>
            <div><b>${arNum(snap.examBest)}٪</b><span>الاختبار</span></div>
            <div><b>${arNum(snap.lettersMastered)}/${arNum(ZERO_TOTALS.letters)}</b><span>الحروف</span></div>
            <div><b>${arNum(snap.wordsLearned)}/${arNum(ZERO_TOTALS.words)}</b><span>الكلمات</span></div>
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

      <div class="zcert__acts">
        <button class="zbtn zbtn--primary" type="button" id="certPrint" ${cert.earned ? '' : 'disabled'}>🖨️ طباعة / حفظ PDF</button>
        <a class="zbtn" href="#/lessons" data-nav>📚 ابدأ المستوى A1</a>
        <button class="zbtn" type="button" id="certCopy">📋 انسخ ملخّص تقدّمي</button>
      </div>
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

export { resetZeroProgress };
