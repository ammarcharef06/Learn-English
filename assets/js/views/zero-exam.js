/* ============================================================
   قسم «من الصفر» (A0) — الاختبار النهائي + شهادة التأسيس
   ============================================================ */
import { esc, qs, qsa, toast, confetti, prettyDateAr, dateKey } from '../core/utils.js';
import { navigate } from '../core/router.js';
import { progress } from '../core/store.js';
import { renderSidebarStats } from './shell.js';
import { pageHead } from './shell.js';
import { ZERO_STAGES, zeroExamQuestions, ZERO_TOTALS } from '../data/zero.js';
import {
  zeroSnapshot, recordZeroExam, certificateReady, grantCertificate, certificate,
  saveCertificateName, resetZeroProgress, a1Recommendation,
} from '../core/zeroflow.js';
import { runQuiz } from './quiz-runner.js';

const EXAM_SIZE = 30;
const PASS = 90;

/* ============================================================
   الاختبار النهائي
   ============================================================ */
function examStatusHTML(snap, cert, ready) {
  return `
    <div class="grid grid--3 mt-2">
      <div class="card">
        <div class="card__title"><span class="ico" aria-hidden="true">🎯</span><h3>حالة الاستحقاق</h3></div>
        <ul class="zero-req">
          <li class="${snap.doneStages === ZERO_TOTALS.stages ? 'is-ok' : ''}">${snap.doneStages === ZERO_TOTALS.stages ? '✅' : '⭕'} إتمام المراحل الثمانية (${snap.doneStages}/${ZERO_TOTALS.stages})</li>
          <li class="${snap.lettersMastered === ZERO_TOTALS.letters ? 'is-ok' : ''}">${snap.lettersMastered === ZERO_TOTALS.letters ? '✅' : '⭕'} إتقان ٢٦ حرفاً (${snap.lettersMastered}/${ZERO_TOTALS.letters})</li>
          <li class="${snap.examBest >= PASS ? 'is-ok' : ''}">${snap.examBest >= PASS ? '✅' : '⭕'} نتيجة ${PASS}% أو أكثر في الاختبار (${snap.examBest}%)</li>
        </ul>
        <div class="small muted">المستويات الأخرى مفتوحة دائماً — هذه شروط الشهادة فقط، لا شروط دخول.</div>
      </div>
      <div class="card">
        <div class="card__title"><span class="ico" aria-hidden="true">📊</span><h3>سجلّك</h3></div>
        <div class="stack">
          <div class="row row--between"><span>أفضل نتيجة</span><b>${snap.examBest}%</b></div>
          <div class="row row--between"><span>آخر نتيجة</span><b>${snap.raw.exam?.last || 0}%</b></div>
          <div class="row row--between"><span>عدد المحاولات</span><b>${snap.raw.exam?.attempts || 0}</b></div>
          <div class="row row--between"><span>الشهادة</span><b>${cert.earned ? 'مُستلَمة ✅' : 'لم تُستلم بعد'}</b></div>
        </div>
      </div>
      <div class="card ${ready ? 'card--ok' : ''}">
        <div class="card__title"><span class="ico" aria-hidden="true">${ready ? '🎉' : '🧭'}</span><h3>${ready ? 'أنت مستحقّ للشهادة' : 'أكمل ثم عد'}</h3></div>
        <p class="small muted">لا حدّ لعدد المحاولات، والاختبار يُبنى عشوائياً من كل المراحل في كل مرة.</p>
        <div class="row wrap" style="gap:8px">
          <button class="btn btn--primary btn--lg" type="button" id="zeroExamStart">▶ ابدأ الاختبار (${EXAM_SIZE} سؤالاً)</button>
          ${ready ? '<a class="btn" href="#/zero/certificate">🎓 إلى الشهادة</a>' : ''}
        </div>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card__title"><span class="ico" aria-hidden="true">🗺️</span><h3>مصادر الأسئلة</h3></div>
      <div class="row wrap" style="gap:8px">
        ${ZERO_STAGES.map((s) => {
          const st = snap.raw.stages?.[s.id] || {};
          return `<a class="chip ${st.done ? 'chip--ok' : 'chip--brand'}" href="#/zero/stage/${s.id}">${s.icon} ${esc(s.titleAr)}</a>`;
        }).join('')}
      </div>
    </div>`;
}

export function renderZeroExam(host) {
  const snap = zeroSnapshot();
  const cert = certificate();
  const ready = certificateReady();

  host.innerHTML = `
    ${pageHead({
      icon: '🧪',
      title: 'الاختبار النهائي لتأسيس A0',
      subtitle: `${EXAM_SIZE} سؤالاً موزّعة على المراحل الثمانية: الحروف، المركّبة، الأرقام، الوقت، الضمائر، الكلمات، الجمل، والقراءة.`,
      actionsHtml: '<a class="btn" href="#/zero">← من الصفر</a>',
    })}
    <div id="zeroExamStatus">${examStatusHTML(snap, cert, ready)}</div>
    <div id="zeroExamRun" class="mt-4"></div>`;

  bindExamStart(host);
}

function bindExamStart(host) {
  qs('#zeroExamStart', host)?.addEventListener('click', () => {
    const runHost = qs('#zeroExamRun', host);
    runHost.innerHTML = '';
    runHost.scrollIntoView({ block: 'start' });
    const questions = zeroExamQuestions(EXAM_SIZE);
    if (!questions.length) {
      runHost.innerHTML = '<div class="empty"><span class="ico">🤷</span><p>تعذّر توليد أسئلة الاختبار.</p></div>';
      return;
    }
    runQuiz(runHost, {
      title: `🧪 الاختبار النهائي — ${questions.length} سؤالاً`,
      questions,
      allowReveal: true,
      onSummary: (res) => {
        const r = recordZeroExam(res.correct, res.total);
        if (r.badges?.length) toast(`🏅 ${r.badges.map((b) => b.ar).join(' · ')}`, 'ok');
        if (certificateReady()) {
          const g = grantCertificate();
          confetti(140);
          toast(g.granted ? `🎓 مبروك! استحققت شهادة التأسيس (${g.code})` : '✅ ما زلت مستحقاً للشهادة', 'ok', 'شهادة التأسيس');
        }
        renderSidebarStats();
        const st = qs('#zeroExamStatus', host);
        if (st) st.innerHTML = examStatusHTML(zeroSnapshot(), certificate(), certificateReady());
        bindExamStart(host);
        toast(`اختبار مكتمل: ${res.correct}/${res.total} (${res.accuracy}%)`, res.accuracy >= 70 ? 'ok' : 'warn');
        qs('#zeroExamStatus', host)?.scrollIntoView({ block: 'start' });
      },
      extraActionsHtml: '<a class="btn" href="#/zero">من الصفر</a><a class="btn" href="#/zero/certificate">شهادة التأسيس</a>',
    });
  });
}

/* ============================================================
   شهادة التأسيس (قابلة للطباعة)
   ============================================================ */
export function renderZeroCertificate(host) {
  const snap = zeroSnapshot();
  const cert = certificate();
  const ready = certificateReady();
  const rec = a1Recommendation();

  if (ready && !cert.earned) grantCertificate();
  const current = certificate();

  host.innerHTML = `
    ${pageHead({
      icon: '🎓',
      title: 'شهادة تأسيس A0',
      subtitle: 'شهادة شخصية تُطبع أو تُحفظ بصيغة PDF من نافذة الطبع في المتصفح.',
      actionsHtml: `
        <a class="btn" href="#/zero">← من الصفر</a>
        <button class="btn btn--primary" type="button" id="certPrint" ${current.earned ? '' : 'disabled'}>🖨️ طباعة / حفظ PDF</button>`,
    })}

    ${!current.earned ? `
      <div class="card card--warn">
        <div class="card__title"><span class="ico" aria-hidden="true">🔒</span><h3>الشهادة لم تُستحق بعد</h3></div>
        <ul class="zero-req">
          <li class="${snap.doneStages === ZERO_TOTALS.stages ? 'is-ok' : ''}">${snap.doneStages === ZERO_TOTALS.stages ? '✅' : '⭕'} المراحل الثمانية (${snap.doneStages}/${ZERO_TOTALS.stages})</li>
          <li class="${snap.lettersMastered === ZERO_TOTALS.letters ? 'is-ok' : ''}">${snap.lettersMastered === ZERO_TOTALS.letters ? '✅' : '⭕'} إتقان الحروف (${snap.lettersMastered}/${ZERO_TOTALS.letters})</li>
          <li class="${snap.examBest >= PASS ? 'is-ok' : ''}">${snap.examBest >= PASS ? '✅' : '⭕'} الاختبار النهائي ${PASS}% (${snap.examBest}%)</li>
        </ul>
        <p class="small muted">${esc(rec.text)}</p>
        <div class="row wrap" style="gap:8px">
          <a class="btn btn--primary" href="#/zero">🌱 أكمل المراحل</a>
          <a class="btn" href="#/zero/exam">🧪 الاختبار النهائي</a>
        </div>
      </div>` : ''}

    <div class="zero-cert-wrap ${current.earned ? '' : 'is-locked'}">
      <div class="zero-cert print-area" id="zeroCert">
        <div class="zero-cert__border">
          <div class="zero-cert__head">
            <div class="zero-cert__logo">EN</div>
            <div>
              <div class="zero-cert__brand">أكاديمية الإنجليزية</div>
              <div class="zero-cert__brand-en" dir="ltr">English Academy · Learn English</div>
            </div>
          </div>
          <div class="zero-cert__title">شهادة إتمام التأسيس</div>
          <div class="zero-cert__sub" dir="ltr">Foundation Certificate — Level A0</div>

          <div class="zero-cert__nameRow">
            <label for="certName">الاسم على الشهادة</label>
            <input class="input" id="certName" type="text" maxlength="60" placeholder="اكتب اسمك هنا" value="${esc(current.name || '')}" />
          </div>
          <div class="zero-cert__name" id="certNameOut">${esc(current.name || '................................')}</div>

          <p class="zero-cert__body">
            أتمّ المتعلّم المراحل الثمانية لقسم «من الصفر»: الحروف الستة والعشرين، والحروف المركّبة،
            والأرقام، والأيام والشهور والفصول والوقت، والضمائر وفعل الكينونة، وأول ١٢٠ كلمة،
            وأول ٤٠ جملة، وأربع قراءات — وأتقن ذلك بتدريباته واختباره النهائي.
          </p>

          <div class="zero-cert__grid">
            <div><b>${snap.percent}%</b><span>نسبة الإتقان</span></div>
            <div><b>${snap.examBest}%</b><span>الاختبار النهائي</span></div>
            <div><b>${snap.lettersMastered}/${ZERO_TOTALS.letters}</b><span>الحروف المتقنة</span></div>
            <div><b>${snap.wordsLearned}/${ZERO_TOTALS.words}</b><span>الكلمات المتقنة</span></div>
          </div>

          <div class="zero-cert__foot">
            <div>
              <div class="zero-cert__meta">رقم الشهادة: <b dir="ltr">${esc(current.code || '—')}</b></div>
              <div class="zero-cert__meta">تاريخ الاستحقاق: ${esc(current.at ? prettyDateAr(dateKey(new Date(current.at))) : '—')}</div>
            </div>
            <div class="zero-cert__seal">🎓<span>معتمدة<br>محلياً</span></div>
          </div>

          <div class="zero-cert__note tiny">
            هذه شهادة شخصية من موقعك التعليمي الخاص، تُخزَّن على جهازك فقط. المستوى A1 مفتوح بلا أي قفل — هذه الشهادة تشجيعية لا شرطية.
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid--2 mt-4 no-print">
      <div class="card">
        <div class="card__title"><span class="ico" aria-hidden="true">🚀</span><h3>الخطوة التالية</h3></div>
        <p class="small muted">${esc(rec.text)}</p>
        <div class="row wrap" style="gap:8px">
          <a class="btn btn--primary" href="#/lessons">📚 ابدأ المستوى A1</a>
          <a class="btn" href="#/drills">🔁 راجع بتدريب مختلط</a>
        </div>
      </div>
      <div class="card">
        <div class="card__title"><span class="ico" aria-hidden="true">🧰</span><h3>أدوات</h3></div>
        <div class="row wrap" style="gap:8px">
          <button class="btn btn--sm" type="button" id="certShare">📋 انسخ ملخّص تقدّمي</button>
          <button class="btn btn--sm" type="button" id="certCelebrate">🎉 احتفل</button>
          <button class="btn btn--sm btn--ghost" type="button" id="certReset">↺ تصفير تقدّم قسم A0</button>
        </div>
        <p class="tiny muted mt-3">تصفير قسم A0 لا يمسّ تقدّمك في A1 و A2 و B1 إطلاقاً.</p>
      </div>
    </div>`;

  const nameInput = qs('#certName', host);
  nameInput?.addEventListener('input', () => {
    const v = nameInput.value.trim();
    const out = qs('#certNameOut', host);
    if (out) out.textContent = v || '................................';
  });
  nameInput?.addEventListener('change', () => saveCertificateName(nameInput.value));

  qs('#certPrint', host)?.addEventListener('click', () => {
    saveCertificateName(nameInput?.value || '');
    document.body.classList.add('printing-cert');
    setTimeout(() => {
      window.print();
      setTimeout(() => document.body.classList.remove('printing-cert'), 400);
    }, 60);
  });

  qs('#certShare', host)?.addEventListener('click', async () => {
    const text = `شهادة تأسيس A0 — أكاديمية الإنجليزية\nالاسم: ${certificate().name || '—'}\nرقم الشهادة: ${certificate().code || '—'}\nنسبة الإتقان: ${snap.percent}%\nالاختبار النهائي: ${snap.examBest}%\nالمراحل: ${snap.doneStages}/${ZERO_TOTALS.stages}\nالحروف المتقنة: ${snap.lettersMastered}/${ZERO_TOTALS.letters}\nالكلمات المتقنة: ${snap.wordsLearned}/${ZERO_TOTALS.words}`;
    try {
      await navigator.clipboard.writeText(text);
      toast('نُسخ ملخّص تقدّمك 📋', 'ok');
    } catch {
      toast('تعذّر النسخ — انسخه يدوياً من نافذة الطباعة', 'warn');
    }
  });
  qs('#certCelebrate', host)?.addEventListener('click', () => confetti(160));

  qs('#certReset', host)?.addEventListener('click', () => {
    if (!window.confirm('تصفير تقدّم قسم «من الصفر» (A0) فقط؟ لن يتأثر A1/A2/B1.')) return;
    resetZeroProgress();
    toast('تم تصفير تقدّم قسم A0', 'ok');
    renderZeroCertificate(host);
    renderSidebarStats();
  });
}
