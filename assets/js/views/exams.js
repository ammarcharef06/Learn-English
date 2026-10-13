/* الاختبارات: تحديد المستوى، اختبارات المراجع، اختبارات الوحدات، شهادة نتيجة */
import { t } from '../core/i18n.js';
import { esc, qs, toast, confetti, fmtDuration, pct } from '../core/utils.js';
import { progress, settings, saveProgress } from '../core/store.js';
import { ALL_UNITS, LEVELS, getUnit } from '../data/curriculum.js';
import { buildQuestions, buildRelationQuestions } from '../core/quizgen.js';
import { recordExam, levelStats } from '../core/gamify.js';
import { pageHead, progressBar, renderSidebarStats, statCard } from './shell.js';
import { runQuiz } from './quiz-runner.js';

const EXAMS = [
  { id: 'placement', icon: '🧭', title: 'اختبار تحديد المستوى', desc: '٣٠ سؤالاً متدرّجاً من A1 حتى B1 لمعرفة مستواك الحقيقي الآن.', count: 30, minutes: 20, source: 'all', types: ['mcq', 'fill', 'translate'] },
  { id: 'pronouns', icon: '🙋', title: 'اختبار الضمائر الشامل', desc: 'كل أنواع الضمائر: الفاعل، المفعول، الملكية، الانعكاسية، الإشارة، الوصل وغير المحددة.', count: 20, minutes: 12, source: 'pronouns', types: ['mcq', 'fill', 'order', 'match', 'translate'] },
  { id: 'connectors', icon: '🔗', title: 'اختبار أدوات الربط', desc: '٤٠ أداة ربط: المعنى والاستخدام في الجملة.', count: 20, minutes: 12, source: 'connectors', types: ['mcq', 'fill', 'order', 'translate'] },
  { id: 'questions', icon: '❓', title: 'اختبار أدوات السؤال', desc: 'أدوات السؤال وتراكيبها: HOW MUCH / HOW MANY / HOW OFTEN…', count: 20, minutes: 12, source: 'questions', types: ['mcq', 'fill', 'order', 'translate'] },
  { id: 'listening', icon: '🎧', title: 'اختبار الاستماع', desc: '٢٠ سؤالاً سمعياً للتدريب على الأذن.', count: 20, minutes: 12, source: 'all', types: ['listen'] },
  { id: 'mixed', icon: '🏆', title: 'الاختبار الشامل', desc: '٢٥ سؤالاً من كل الأنواع والمصادر — التحدي الأكبر.', count: 25, minutes: 15, source: 'all', types: ['mcq', 'fill', 'order', 'translate', 'listen'] },
];

function grade(percent) {
  if (percent >= 90) return { label: 'ممتاز', icon: '🏆', variant: 'ok' };
  if (percent >= 80) return { label: 'جيد جداً', icon: '🎉', variant: 'ok' };
  if (percent >= 70) return { label: 'جيد', icon: '👍', variant: 'brand' };
  if (percent >= 60) return { label: 'مقبول', icon: '🙂', variant: 'warn' };
  if (percent >= 50) return { label: 'ضعيف', icon: '💪', variant: 'bad' };
  return { label: 'يحتاج مراجعة', icon: '📚', variant: 'bad' };
}

function placementRecommendation(percent) {
  if (percent >= 85) return { level: 'b1', text: 'مستواك قريب من B1 — انتقل إلى وحدات B1 وركّز على القواعد المتقدمة.' };
  if (percent >= 65) return { level: 'a2', text: 'مستواك A2 — أكمل وحدات A2 ثم انتقل إلى B1.' };
  if (percent >= 40) return { level: 'a1', text: 'مستواك A1 — ابدأ من وحدات A1 مع التدريب اليومي على الضمائر.' };
  return { level: 'a1', text: 'ابدأ من الصفر: وحدات A1 ثم الضمائر ثم أدوات الربط، ١٥ دقيقة يومياً.' };
}

export function renderExams(host, id) {
  if (id) {
    const unit = getUnit(id);
    if (unit) return renderUnitExamIntro(host, unit);
  }
  const history = progress.exams || [];
  host.innerHTML = `
    ${pageHead({
      icon: '🧪', title: t('exam.title'), subtitle: t('exam.subtitle'),
      actionsHtml: `<span class="chip chip--brand">${history.length} ${t('stats.sessions')}</span>`,
    })}
    <div class="grid grid--3">
      ${EXAMS.map((e) => `<div class="card">
        <div class="card__title"><span class="ico">${e.icon}</span><h3>${esc(e.title)}</h3></div>
        <p class="small muted">${esc(e.desc)}</p>
        <div class="row row--wrap" style="gap:6px;margin-bottom:12px">
          <span class="chip">${e.count} ${esc(t('common.questionsShort'))}</span>
          <span class="chip">⏱ ${e.minutes} ${esc(t('common.minutes'))}</span>
        </div>
        <button class="btn btn--primary btn--block" type="button" data-exam="${e.id}">▶ ${esc(t('exam.start'))}</button>
      </div>`).join('')}
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">📘</span><h3>اختبار وحدة معيّنة</h3></div>
      <div class="row row--wrap" style="gap:10px">
        <select class="select" id="unitSelect" style="max-width:420px">
          ${LEVELS.map((lv) => `<optgroup label="${esc(lv.label)}">
            ${lv.units.map((u) => `<option value="${u.id}">${esc(u.title)}</option>`).join('')}
          </optgroup>`).join('')}
        </select>
        <button class="btn btn--primary" type="button" id="unitExamBtn">▶ ابدأ اختبار الوحدة</button>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">⚡</span><h3>اختبار سريع (٥ أسئلة)</h3></div>
      <p class="small muted">خمسة أسئلة عشوائية من كل الموقع — مثالي في وقت الفراغ.</p>
      <button class="btn" type="button" id="quickExam">▶ ابدأ</button>
    </div>

    ${history.length ? `<div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🗂️</span><h3>سجل الاختبارات</h3></div>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>التاريخ</th><th>النوع</th><th>النتيجة</th><th>النسبة</th><th>الزمن</th></tr></thead>
        <tbody>
          ${history.slice(0, 12).map((h) => `<tr>
            <td class="small">${esc(new Date(h.at).toLocaleDateString('ar-DZ'))}</td>
            <td>${esc(labelForExam(h.level))}</td>
            <td class="en-cell">${h.score} / ${h.total}</td>
            <td>${pct(h.score, h.total)}%</td>
            <td class="en-cell">${fmtDuration(h.seconds)}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>` : ''}

    <div id="examHost" style="margin-top:18px"></div>`;

  host.querySelectorAll('[data-exam]').forEach((b) => b.addEventListener('click', () => startExam(host, b.dataset.exam)));
  qs('#unitExamBtn', host)?.addEventListener('click', () => startUnitExam(host, qs('#unitSelect', host).value));
  qs('#quickExam', host)?.addEventListener('click', () => startExam(host, 'quick'));
}

function labelForExam(id) {
  const found = EXAMS.find((e) => e.id === id);
  if (found) return found.title;
  const u = getUnit(id);
  if (u) return `وحدة: ${u.title}`;
  if (id === 'quick') return 'اختبار سريع';
  return id === 'mixed' ? 'شامل' : String(id);
}

function startExam(host, examId) {
  const def = examId === 'quick'
    ? { id: 'quick', icon: '⚡', title: 'اختبار سريع', count: 5, minutes: 5, source: 'all', types: ['mcq', 'fill', 'translate'] }
    : EXAMS.find((e) => e.id === examId);
  if (!def) return;
  const examHost = qs('#examHost', host);
  let questions = buildQuestions({ source: def.source, types: def.types, count: def.count, adaptive: false, mode: 'exam' });
  if (def.id === 'pronouns') questions = [...questions, ...buildRelationQuestions(4)].slice(0, def.count);
  runTimedExam(examHost, { questions, def, examId: def.id });
}

function startUnitExam(host, unitId) {
  const u = getUnit(unitId);
  if (!u) return;
  const examHost = qs('#examHost', host);
  const questions = buildQuestions({ source: `unit:${u.id}`, types: ['mcq', 'fill', 'order', 'translate'], count: 12, adaptive: false, mode: 'exam' });
  runTimedExam(examHost, {
    questions, examId: u.id,
    def: { icon: u.icon, title: `اختبار: ${u.title}`, count: 12, minutes: 10 },
  });
}

function runTimedExam(examHost, { questions, def, examId }) {
  if (!questions.length) { toast('لا توجد بيانات كافية لهذا الاختبار', 'warn'); return; }
  examHost.innerHTML = `
    <div class="card card--brand">
      <div class="card__title"><span class="ico">${def.icon}</span><h2>${esc(def.title)}</h2></div>
      <div class="row row--wrap" style="gap:8px">
        <span class="chip">${questions.length} ${esc(t('common.questionsShort'))}</span>
        <span class="chip">⏱ ${t('exam.timeLimit')}: ${def.minutes} ${esc(t('common.minutes'))}</span>
        <span class="chip chip--warn">لا يمكن إيقاف المؤقت بعد البدء</span>
      </div>
      <p class="small muted" style="margin-top:10px">سيبدأ الاختبار فوراً. سجّل نتيجتك في السجل عند الانتهاء.</p>
      <button class="btn btn--primary btn--lg" type="button" id="examGo">▶ ${esc(t('exam.start'))}</button>
    </div>
    <div id="examRunner" style="margin-top:16px"></div>`;

  qs('#examGo', examHost)?.addEventListener('click', () => {
    const runner = qs('#examRunner', examHost);
    runQuiz(runner, {
      questions,
      timed: true,
      seconds: def.minutes * 60,
      title: `${def.icon} ${def.title}`,
      allowReveal: false,
      onFinish: (res) => {
        recordExam({ level: examId, score: res.correct, total: res.total, seconds: res.seconds });
        renderSidebarStats();
        renderExamResult(runner, res, def, examId);
      },
    });
  });
}

function renderExamResult(container, res, def, examId) {
  const percent = res.accuracy;
  const g = grade(percent);
  const name = settings.learnerName || 'طالب الأكاديمية';
  const recommendation = examId === 'placement' ? placementRecommendation(percent) : null;
  const wrong = res.answers.filter((a) => !a.correct);

  container.innerHTML = `
    <div class="print-area">
      <div class="card center">
        <div style="font-size:3.2rem">${g.icon}</div>
        <h2>${esc(t('exam.result'))}</h2>
        <div class="q-main">${res.correct} / ${res.total}</div>
        <div class="chip chip--${g.variant === 'ok' ? 'ok' : g.variant === 'bad' ? 'bad' : 'brand'}" style="font-size:1rem">${esc(g.label)} · ${percent}%</div>
        <p class="muted small" style="margin-top:10px">${esc(def.title)} · ${esc(t('common.time'))}: ${fmtDuration(res.seconds)}</p>

        <div class="cert" style="margin-top:18px">
          <h2>شهادة نتيجة</h2>
          <p class="muted">تشهد أكاديمية الإنجليزية أن</p>
          <div class="cert__name">${esc(name)}</div>
          <p>قد أتمّ <b>${esc(def.title)}</b> بتقدير <b>${esc(g.label)}</b></p>
          <div class="row row--wrap" style="justify-content:center;gap:10px;margin-top:10px">
            <span class="chip">النتيجة: ${res.correct} / ${res.total}</span>
            <span class="chip">النسبة: ${percent}%</span>
            <span class="chip">الزمن: ${fmtDuration(res.seconds)}</span>
          </div>
          <div class="cert__seal">${percent}%</div>
          <p class="tiny muted" style="margin-top:10px">${esc(new Date().toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))}</p>
        </div>

        <div class="row row--wrap" style="justify-content:center;gap:8px;margin-top:16px">
          <button class="btn btn--primary" type="button" id="printCert">🖨 ${esc(t('exam.print'))}</button>
          <button class="btn" type="button" id="retakeExam">${esc(t('common.retry'))}</button>
          <a class="btn" href="#/exams">${esc(t('nav.exams'))}</a>
          <a class="btn" href="#/stats">${esc(t('nav.stats'))}</a>
        </div>
      </div>

      ${recommendation ? `<div class="card card--brand" style="margin-top:16px">
        <div class="card__title"><span class="ico">🧭</span><h3>توصية المستوى</h3></div>
        <p>${esc(recommendation.text)}</p>
        <a class="btn btn--primary btn--sm" href="#/level/${recommendation.level}">ابدأ من هذا المستوى ←</a>
      </div>` : ''}

      ${wrong.length ? `<div class="card" style="margin-top:16px">
        <div class="card__title"><span class="ico">📝</span><h3>${esc(t('exam.review'))}</h3></div>
        ${wrong.map((a) => `<div class="item-row">
          <span class="item-row__en">${esc(a.q.answerText || (a.q.correctOrder ? a.q.correctOrder.join(' ') : ''))}</span>
          <span class="item-row__ar">${esc(a.q.explain || '')}</span>
        </div>`).join('')}
        <a class="btn btn--sm" style="margin-top:12px" href="#/drills?source=smart">🧠 تدرّب على أخطائك</a>
      </div>` : `<div class="tip-box tip-box--ok" style="margin-top:16px"><b>${esc(t('exam.noMistakes'))}</b>أداء مثالي — جرّب مستوى أصعب.</div>`}
    </div>`;

  container.querySelector('#printCert')?.addEventListener('click', () => window.print());
  container.querySelector('#retakeExam')?.addEventListener('click', () => {
    if (examId.startsWith('a1') || examId.startsWith('a2') || examId.startsWith('b1')) {
      const u = getUnit(examId);
      const questions = buildQuestions({ source: `unit:${u.id}`, types: ['mcq', 'fill', 'order', 'translate'], count: 12, adaptive: false, mode: 'exam' });
      const runner = container;
      runQuiz(runner, {
        questions, timed: true, seconds: 600, allowReveal: false,
        onFinish: (r2) => { recordExam({ level: examId, score: r2.correct, total: r2.total, seconds: r2.seconds }); renderExamResult(runner, r2, def, examId); },
      });
      return;
    }
    const def2 = EXAMS.find((e) => e.id === examId) || def;
    const questions = buildQuestions({ source: def2.source, types: def2.types, count: def2.count, adaptive: false, mode: 'exam' });
    runQuiz(container, {
      questions, timed: true, seconds: def2.minutes * 60, allowReveal: false,
      onFinish: (r2) => { recordExam({ level: examId, score: r2.correct, total: r2.total, seconds: r2.seconds }); renderExamResult(container, r2, def2, examId); },
    });
  });

  if (percent >= 70) confetti(percent >= 90 ? 140 : 80);
}

function renderUnitExamIntro(host, unit) {
  host.innerHTML = pageHead({ icon: unit.icon, title: `اختبار: ${unit.title}`, subtitle: 'اختبار مؤقت على مفردات وجمل هذه الوحدة.' });
  const examHost = document.createElement('div');
  host.appendChild(examHost);
  const btn = document.createElement('button');
  btn.className = 'btn btn--primary btn--lg';
  btn.textContent = '▶ ' + t('exam.start');
  host.appendChild(btn);
  btn.addEventListener('click', () => startUnitExam(host, unit.id));
}
