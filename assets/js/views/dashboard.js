/* لوحة بداية هادئة: التقدم والسلسلة وخطوة واضحة لبدء المراجعة. */
import { t, isRTL } from '../core/i18n.js';
import { goalForToday, progress, isEshSandbox } from '../core/store.js';
import { esc, pct } from '../core/utils.js';
import { overallStats, streakInfo } from '../core/gamify.js';
import { ALL_UNITS } from '../data/curriculum.js';
import { getEshProfile, getEshRecommendations } from '../../../curriculum/esh/personalization.js';

function activityHeatmap() {
  const now = new Date();
  const locale = isRTL() ? 'ar' : 'en';
  const days = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (27 - index));
    const key = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
    const count = Number(progress.activity?.[key]?.q || 0);
    const intensity = count === 0 ? 0 : count < 5 ? 1 : count < 15 ? 2 : count < 30 ? 3 : 4;
    const label = t('dash.activityDay', {
      date: new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date),
      count,
    });
    return { count, html: `<span class="activity-heatmap__cell" data-level="${intensity}" role="img" aria-label="${esc(label)}" title="${esc(label)}"></span>` };
  });
  return { html: days.map((day) => day.html).join(''), activeDays: days.filter((day) => day.count > 0).length };
}

export function renderDashboard(host) {
  const goal = goalForToday();
  const todayPercent = pct(goal.done, goal.target);
  const course = overallStats();
  const streak = streakInfo();
  const heatmap = activityHeatmap();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - todayPercent / 100);
  const todayLabel = new Intl.DateTimeFormat(isRTL() ? 'ar' : 'en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const profile = isEshSandbox ? getEshProfile() : null;
  const recommendations = profile ? getEshRecommendations(ALL_UNITS, profile, progress) : [];
  const personalizedPlan = profile ? `
    <section class="esh-personal-plan" aria-labelledby="eshPlanTitle">
      <header class="esh-personal-plan__head">
        <div><p class="esh-personal-plan__eyebrow">خُطّتك المصمّمة لك</p><h2 id="eshPlanTitle">دروس تناسب هدفك ووقتك</h2></div>
        <a class="btn btn--sm" href="#/onboarding">تعديل التفضيلات</a>
      </header>
      <p class="esh-personal-plan__summary">${esc(motivationLabel(profile.motivation))} · ${profile.minutesPerSession} دقائق للجلسة · ${esc(profileLevelLabel(profile.levelId))} · ${esc(bridgeLanguageLabel(profile.bridgeLanguage))}</p>
      ${recommendations.length ? `<div class="esh-personal-plan__lessons">
        ${recommendations.map(({ unit, lesson, index, estimatedMinutes }) => `
          <a class="esh-personal-lesson" href="#/lesson/${encodeURIComponent(unit.id)}/${index}">
            <span class="esh-personal-lesson__icon" aria-hidden="true">${unit.icon || '✦'}</span>
            <span class="esh-personal-lesson__body"><b>${esc(lesson.title)}</b><small>${esc(unit.levelLabel)} · ${estimatedMinutes} د</small></span>
            <span class="esh-personal-lesson__arrow" aria-hidden="true">↗</span>
          </a>`).join('')}
      </div>` : '<p class="muted">لا توجد دروس مطابقة حالياً. افتح خريطة المنهج لاستكشاف جميع الدروس.</p>'}
    </section>` : '';

  host.innerHTML = `
    <section class="dashboard-v2" aria-labelledby="dashboardTitle">
      ${personalizedPlan}
      <header class="dashboard-v2__head">
        <div>
          <p class="dashboard-v2__date">${esc(todayLabel)}</p>
          <h1 id="dashboardTitle">${t('dash.welcome')}</h1>
        </div>
        <div class="streak-pill" aria-label="${esc(t('dash.currentRun'))}">
          <span class="streak-pill__flame" aria-hidden="true">✦</span>
          <span><strong>${streak.streak}</strong><small>${esc(t('common.streak'))}</small></span>
        </div>
      </header>

      <section class="flow-launch" aria-labelledby="flowLaunchTitle">
        <div class="flow-launch__copy">
          <span class="flow-launch__eyebrow">${esc(t('dash.todayProgress'))}</span>
          <h2 id="flowLaunchTitle">${esc(t('dash.flowHint'))}</h2>
          <div class="flow-launch__streak">
            <span aria-hidden="true">${streak.streak ? '✦' : '·'}</span>
            ${streak.streak ? esc(t('dash.streakCount', { count: streak.streak })) : esc(t('dash.streakStart'))}
          </div>
          <a class="flow-launch__button" href="#/flashcards">
            <span>${esc(t('dash.flow'))}</span><span aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="flow-launch__progress" role="progressbar" aria-label="${esc(t('dash.todayProgress'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${todayPercent}">
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle class="flow-launch__track" cx="70" cy="70" r="54"></circle>
            <circle class="flow-launch__arc" cx="70" cy="70" r="54" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
          </svg>
          <span class="flow-launch__value">${todayPercent}%</span>
          <span class="flow-launch__caption">${goal.done} / ${goal.target} · ${esc(t('dash.todayProgress'))}</span>
        </div>
      </section>

      <section class="dashboard-v2__lower">
        <article class="dashboard-panel dashboard-activity" aria-labelledby="activityTitle">
          <header class="dashboard-panel__head"><div><span class="dashboard-label">${esc(t('dash.heatmap'))}</span><h2 id="activityTitle">${esc(t('dash.activeDays', { count: heatmap.activeDays }))}</h2></div><span class="dashboard-panel__mark" aria-hidden="true">▦</span></header>
          <div class="activity-heatmap" role="group" aria-label="${esc(t('dash.heatmap'))}">${heatmap.html}</div>
          <div class="activity-heatmap__legend" aria-hidden="true"><span>${esc(t('dash.heatmapLess'))}</span><i data-level="1"></i><i data-level="2"></i><i data-level="3"></i><i data-level="4"></i><span>${esc(t('dash.heatmapMore'))}</span></div>
        </article>

        <a class="dashboard-panel curriculum-teaser" href="#/lessons">
          <span class="dashboard-panel__mark" aria-hidden="true">⌘</span>
          <span class="dashboard-label">${esc(t('dash.skillTree'))}</span>
          <strong>${course.unitsDone} / ${course.unitsTotal}</strong>
          <span class="curriculum-teaser__foot">${course.percent}% · ${esc(t('common.progress'))}<span aria-hidden="true">↗</span></span>
          <span class="progress"><i style="width:${course.percent}%"></i></span>
        </a>
      </section>
    </section>
  `;
}

const MOTIVATION_LABELS = {
  travel: 'السفر والتنقّل',
  work: 'العمل والتطوّر المهني',
  study: 'الدراسة والاختبارات',
  daily: 'الحياة اليومية',
  confidence: 'التحدّث بثقة',
};

function motivationLabel(value) { return MOTIVATION_LABELS[value] || 'هدفك الشخصي'; }
function bridgeLanguageLabel(value) {
  return ({ ar: 'بدعم العربية', fr: 'بجسر من الفرنسية', en: 'بشرح إنجليزي', none: 'بالتعلّم من السياق' })[value] || 'بمسار متوازن';
}
function profileLevelLabel(levelId) {
  return ALL_UNITS.find((unit) => unit.levelId === levelId)?.levelLabel || levelId.toUpperCase();
}
