import { t } from '../core/i18n.js';
import { esc, dateKey, addDays } from '../core/utils.js';
import { progress, settings } from '../core/store.js';
import { LEVELS, ALL_UNITS, nextLessonSuggestion, unitPercent, levelPercent } from '../data/curriculum.js';
import { dailyMission, weeklySummary } from '../core/journey.js';
import { pageHead, progressBar, statCard } from './shell.js';

export function renderJourney(host) {
  const mission = dailyMission();
  const week = weeklySummary().current;
  const next = nextLessonSuggestion();
  const convo = progress.conversations || { sessions: 0, turns: 0, correct: 0 };
  const lessonHref = next ? `#/lesson/${next.unit.id}/${next.lessonIndex}` : '#/drills?mode=smart';
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(new Date(), index - 6);
    const key = dateKey(date);
    const activity = progress.activity?.[key] || {};
    return { key, date, questions: activity.q || 0, conversations: activity.conversations || 0 };
  });
  const max = Math.max(1, ...days.map((day) => day.questions));

  host.innerHTML = `
    ${pageHead({ icon: '🧭', title: t('journey.title'), subtitle: t('journey.subtitle') })}
    <section class="card journey-focus" aria-labelledby="journeyFocusTitle">
      <div class="journey-focus__copy">
        <span class="dashboard-label">${esc(t('journey.next'))}</span>
        <h2 id="journeyFocusTitle">${esc(next ? next.unit.title : t('journey.courseDone'))}</h2>
        <p>${esc(next ? `${next.unit.levelLabel} · ${next.unit.goal || ''}` : t('journey.courseDoneDesc'))}</p>
        <a class="btn btn--primary" href="${lessonHref}">${esc(next ? t('journey.continueLesson') : t('dash.smartDrill'))} <span aria-hidden="true">←</span></a>
      </div>
      <div class="journey-focus__badge" aria-hidden="true">${next ? next.unit.icon : '🎓'}</div>
    </section>

    <section class="journey-mission card" aria-labelledby="journeyMissionTitle">
      <div class="dashboard-section-head">
        <div class="card__title"><span class="dashboard-icon" aria-hidden="true">🎯</span><div><span class="dashboard-label">${esc(t('journey.today'))}</span><h2 id="journeyMissionTitle">${esc(t('journey.mission'))}</h2></div></div>
        <span class="chip chip--brand">${mission.done}/${mission.total}</span>
      </div>
      <div class="journey-mission__list">
        ${mission.tasks.map((task) => {
          const content = {
            review: { icon: '🃏', title: t('journey.review'), detail: `${task.count}/${task.target}`, href: task.href },
            lesson: { icon: '📘', title: t('journey.lesson'), detail: task.done ? t('journey.completed') : t('journey.lessonHint'), href: lessonHref },
            conversation: { icon: '💬', title: t('journey.conversation'), detail: task.done ? t('journey.completed') : t('journey.conversationHint'), href: '#/conversations' },
          }[task.id];
          return `<a class="journey-task ${task.done ? 'is-done' : ''}" href="${content.href}">
            <span class="journey-task__icon" aria-hidden="true">${task.done ? '✓' : content.icon}</span>
            <span class="journey-task__body"><b>${esc(content.title)}</b><small>${esc(content.detail)}</small></span>
            <span class="journey-task__state">${task.done ? esc(t('journey.completed')) : esc(t('journey.startTask'))}</span>
          </a>`;
        }).join('')}
      </div>
      <p class="journey-privacy">🔒 ${esc(t('journey.localOnly'))}</p>
    </section>

    <section class="card journey-map" aria-labelledby="journeyMapTitle">
      <div class="dashboard-section-head">
        <div class="card__title"><span class="dashboard-icon" aria-hidden="true">🗺️</span><div><span class="dashboard-label">${esc(t('lessons.title'))}</span><h2 id="journeyMapTitle">${esc(t('journey.map'))}</h2></div></div>
        <a class="btn btn--sm" href="#/lessons">${esc(t('nav.lessons'))}</a>
      </div>
      <div class="journey-levels">
        ${LEVELS.map((level) => {
          const percent = levelPercent(level.id);
          const units = ALL_UNITS.filter((unit) => unit.levelId === level.id);
          return `<section class="journey-level" aria-label="${esc(level.label)}">
            <div class="journey-level__head">
              <span class="journey-level__icon" aria-hidden="true">${level.icon}</span>
              <div><h3>${esc(level.label)}</h3><small>${units.filter((unit) => progress.units?.[unit.id]?.done).length}/${units.length} ${esc(t('lessons.units'))}</small></div>
              <b>${percent}%</b>
            </div>
            ${progressBar(percent, percent >= 100 ? 'progress--ok' : '')}
            <div class="journey-units">
              ${units.map((unit) => {
                const done = !!progress.units?.[unit.id]?.done;
                const unitProgress = unitPercent(unit.id);
                const index = unit.grammar.findIndex((_, i) => !progress.lessons?.[`${unit.id}:${i}`]);
                const lessonIndex = index < 0 ? 0 : index;
                return `<a class="journey-unit ${done ? 'is-done' : ''}" href="#/lesson/${unit.id}/${lessonIndex}" aria-label="${esc(unit.title)} · ${unitProgress}%">
                  <span aria-hidden="true">${done ? '✓' : unit.icon}</span><span>${esc(unit.title)}</span><b>${unitProgress}%</b>
                </a>`;
              }).join('')}
            </div>
          </section>`;
        }).join('')}
      </div>
    </section>

    <section class="grid grid--2 journey-summary">
      <div class="card">
        <div class="card__title"><span class="ico">📈</span><h2>${esc(t('journey.weekly'))}</h2></div>
        <div class="grid grid--3 journey-summary__stats">
          ${statCard({ label: t('journey.studyDays'), value: `${week.activeDays}/7` })}
          ${statCard({ label: t('journey.questions'), value: week.questions })}
          ${statCard({ label: t('journey.talks'), value: week.conversations })}
        </div>
        <div class="journey-week-bars" role="img" aria-label="${esc(t('journey.weekChart'))}">
          ${days.map((day) => `<div class="journey-week-day" title="${esc(day.key)} · ${day.questions} ${esc(t('journey.questions'))}">
            <span>${day.questions || ''}</span><i style="--bar:${Math.max(5, day.questions / max * 100)}%"></i>
            <small>${esc(new Intl.DateTimeFormat(settingsLanguage(), { weekday: 'short' }).format(day.date))}</small>
          </div>`).join('')}
        </div>
        <a class="btn btn--sm" href="#/stats">${esc(t('journey.fullReport'))} ←</a>
      </div>
      <div class="card journey-conversation-card">
        <div class="card__title"><span class="ico">💬</span><h2>${esc(t('journey.conversationPractice'))}</h2></div>
        <p class="muted">${esc(t('journey.conversationDesc'))}</p>
        <div class="journey-conversation-card__score"><b>${convo.sessions}</b><span>${esc(t('journey.completedTalks'))}</span><b>${convo.turns ? Math.round((convo.correct / convo.turns) * 100) : 0}%</b><span>${esc(t('stats.accuracy'))}</span></div>
        <a class="btn btn--primary" href="#/conversations">${esc(t('journey.startConversation'))} →</a>
      </div>
    </section>`;
}

function settingsLanguage() {
  return document.documentElement.dataset.uiLang === 'en' ? 'en' : 'ar';
}
