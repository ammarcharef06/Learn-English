/* جلسة اليوم: مسار موجّه فوق أنشطة الأكاديمية الفعلية، مع حفظ تقدّم كل نشاط في مكانه الأصلي. */
import { t } from '../core/i18n.js';
import { arNum, esc } from '../core/utils.js';
import { progress, settings } from '../core/store.js';
import { dailyMission } from '../core/journey.js';
import { nextLessonSuggestion } from '../data/curriculum.js';
import { CONVERSATIONS } from '../data/conversations.js';
import { getActiveConversation } from '../core/conversation-practice.js';
import { pageHead } from './shell.js';

const durationText = (minutes) => settings.uiLang === 'en'
  ? `${minutes} min`
  : `${arNum(minutes)} ${minutes === 2 ? 'دقيقتان' : 'دقائق'}`;

export function renderSession(host) {
  const mission = dailyMission();
  const nextLesson = nextLessonSuggestion();
  const activeConversation = getActiveConversation();
  const cafe = CONVERSATIONS.find((scene) => scene.id === 'at-a-cafe') || CONVERSATIONS[0];
  const pausedConversationId = Object.keys(progress.conversations?.paused || {})[0];
  const conversationId = activeConversation?.id || pausedConversationId || cafe?.id;
  const conversation = CONVERSATIONS.find((scene) => scene.id === conversationId) || cafe;
  const lessonLabel = !nextLesson ? t('journey.courseDone') : settings.uiLang === 'en'
    ? `${nextLesson.unit.levelId.toUpperCase()} · ${nextLesson.unit.titleEn || nextLesson.unit.title}`
    : `${nextLesson.unit.levelLabel} · ${nextLesson.unit.title}`;
  const lessonHref = nextLesson ? `#/lesson/${nextLesson.unit.id}/${nextLesson.lessonIndex}` : '#/drills?mode=smart&count=5';
  const steps = [
    { id: 'review', icon: '↻', title: t('session.review'), detail: t('session.reviewDetail'), duration: 2, href: '#/flashcards?mode=smart&size=5' },
    { id: 'lesson', icon: '▤', title: t('session.lesson'), detail: lessonLabel, duration: 4, href: lessonHref },
    { id: 'conversation', icon: '☕', title: t('session.talk'), detail: activeConversation || pausedConversationId ? t('session.resumeTalk') : (settings.uiLang === 'en' ? conversation.title : conversation.titleAr || conversation.title), duration: 4, href: conversationId ? `#/conversations?scene=${encodeURIComponent(conversationId)}` : '#/conversations' },
  ].map((step) => ({ ...step, done: !!mission.tasks.find((task) => task.id === step.id)?.done }));
  const current = steps.find((step) => !step.done);
  const completed = steps.filter((step) => step.done).length;
  const percent = Math.round((completed / steps.length) * 100);
  const primaryHref = current?.href || '#/drills?mode=smart&count=5';
  const primaryLabel = current ? (completed ? t('session.continue') : t('session.begin')) : t('session.finishPractice');

  host.innerHTML = `
    ${pageHead({ icon: '✦', title: t('session.title'), subtitle: t('session.subtitle') })}
    <div class="daily-session" aria-labelledby="sessionTitle">
      <section class="session-opening" aria-label="${esc(t('session.today'))}">
        <div class="session-opening__art" aria-hidden="true"><span class="session-opening__orbit"></span><span class="session-opening__spark">✦</span><b>${completed}<i>/</i>${steps.length}</b></div>
        <div class="session-opening__copy">
          <span class="session-kicker">${esc(t('session.today'))} <i>·</i> ${esc(t('session.aboutTen'))}</span>
          <h2 id="sessionTitle">${esc(current ? t('session.opening') : t('session.completeTitle'))}</h2>
          <p>${esc(current ? t('session.openingDetail') : t('session.completeDetail'))}</p>
          <div class="session-opening__progress" role="progressbar" aria-label="${esc(t('session.progress'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><i style="width:${percent}%"></i></div>
          <a class="session-primary" href="${primaryHref}"><span>${esc(primaryLabel)}</span><i aria-hidden="true">←</i></a>
        </div>
      </section>

      <section class="session-route" aria-labelledby="sessionRouteTitle">
        <header class="session-route__head"><div><span class="session-kicker">${esc(t('session.yourRoute'))}</span><h2 id="sessionRouteTitle">${esc(t('session.routeTitle'))}</h2></div><span class="session-route__counter">${completed} / ${steps.length}</span></header>
        <ol class="session-steps">
          ${steps.map((step, index) => `<li class="session-step ${step.done ? 'is-done' : ''} ${step === current ? 'is-current' : ''}">
            <span class="session-step__number" aria-hidden="true">${step.done ? '✓' : String(index + 1).padStart(2, '0')}</span>
            <span class="session-step__icon" aria-hidden="true">${step.icon}</span>
            <span class="session-step__copy"><b>${esc(step.title)}</b><small>${esc(step.detail)}</small></span>
            <span class="session-step__time">${esc(durationText(step.duration))}</span>
            <a href="${step.href}" class="session-step__link" aria-label="${esc(`${step.done ? t('journey.completed') : step.title} · ${durationText(step.duration)}`)}">${esc(step.done ? t('journey.completed') : step === current ? t('session.now') : t('session.later'))}<span aria-hidden="true">←</span></a>
          </li>`).join('')}
        </ol>
        <p class="session-route__note"><span aria-hidden="true">⌁</span>${esc(t('session.adaptiveNote'))}</p>
      </section>

      <footer class="session-footer"><span>🔒 ${esc(t('journey.localOnly'))}</span><a href="#/">${esc(t('session.backToTown'))} <span aria-hidden="true">↗</span></a></footer>
    </div>`;
}
