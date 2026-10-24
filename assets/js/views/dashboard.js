/* لوحة التقدّم (الرئيسية) — تخطيط منظّم بلا تكرار */
import { t } from '../core/i18n.js';
import { dateKey, esc, speakBtn, todayKey } from '../core/utils.js';
import { progress, settings } from '../core/store.js';
import { LEVELS, nextLessonSuggestion, levelPercent } from '../data/curriculum.js';
import { dailyMission } from '../core/journey.js';
import { getActiveConversation } from '../core/conversation-practice.js';
import { CONVERSATIONS } from '../data/conversations.js';

function greeting(language = 'ar') {
  const h = new Date().getHours();
  if (language === 'en') {
    if (h < 12) return 'Good morning ☀️';
    if (h < 17) return 'A bright day of learning 🌤️';
    if (h < 21) return 'Good evening 🌆';
    return 'A little learning before bed 🌙';
  }
  if (h < 12) return 'صباح الخير ☀️';
  if (h < 17) return 'نهارك سعيد 🌤️';
  if (h < 21) return 'مساء الخير 🌆';
  return 'أهلاً بك في جلسة ليلية 🌙';
}

export function renderDashboard(host) {
  const next = nextLessonSuggestion();
  const mission = dailyMission();
  const nextTaskId = mission.tasks.find((task) => !task.done)?.id;
  const supportingTasks = mission.tasks.filter((task) => task.id !== 'conversation');
  const cafe = CONVERSATIONS.find((scene) => scene.id === 'at-a-cafe');
  const activeConversation = getActiveConversation();
  const activeScene = CONVERSATIONS.find((scene) => scene.id === activeConversation?.id);
  const activeSceneTitle = activeScene
    ? settings.uiLang === 'en' ? activeScene.title : activeScene.titleAr || activeScene.title
    : '';
  const cafePhrase = cafe?.turns[0]?.reply ? { en: cafe.turns[0].reply, ar: cafe.turns[0].replyAr } : { en: 'I’d like a cup of tea, please.', ar: 'أود كوباً من الشاي، من فضلك.' };
  const cafeRecord = progress.conversations?.completed?.['at-a-cafe'];
  const cafeVisited = !!cafeRecord;
  const cafeDoneToday = !!cafeRecord?.lastAt && dateKey(new Date(cafeRecord.lastAt)) === todayKey();
  const phraseSaved = (progress.notebook || []).some((entry) => entry.en?.trim().toLowerCase() === cafePhrase.en.trim().toLowerCase());
  const lessonHref = next ? `#/lesson/${next.unit.id}/${next.lessonIndex}` : '#/drills?mode=smart';
  const routeLevel = next ? LEVELS.find((level) => level.id === next.unit.levelId) : LEVELS[LEVELS.length - 1];
  const lessonTitle = next
    ? settings.uiLang === 'en' ? next.unit.titleEn || next.unit.title : next.unit.title
    : t('journey.courseDone');
  const routeProgress = routeLevel ? levelPercent(routeLevel.id) : 100;
  const cafeHref = '#/conversations?scene=at-a-cafe';
  const conversationHref = activeScene ? '#/conversations' : cafeHref;

  host.innerHTML = `
    <div class="dashboard town-dashboard">
      <header class="town-welcome">
        <div class="town-welcome__copy">
          <span class="town-welcome__greeting">${esc(greeting(settings.uiLang))}</span>
          <h1 id="dashboardTitle">${esc(t('dash.welcome'))}</h1>
          <p>${esc(t('dash.subtitle'))}</p>
        </div>
        <a class="town-route" href="${lessonHref}" aria-label="${esc(`${t('town.route')}: ${routeLevel?.id.toUpperCase() || 'A1'} · ${lessonTitle}`)}">
          <span class="town-route__badge">${esc(routeLevel?.id.toUpperCase() || 'A1')}</span>
          <span class="town-route__copy"><small>${esc(t('town.route'))}</small><b>${esc(lessonTitle)}</b></span>
          <span class="town-route__progress" aria-hidden="true"><i style="width:${routeProgress}%"></i></span>
          <span class="town-route__percent">${routeProgress}%</span>
        </a>
      </header>

      <section class="town-map" aria-labelledby="townMapTitle">
        <div class="town-map__world">
          <h2 id="townMapTitle" class="sr-only">${esc(t('town.mapLabel'))}</h2>
          <div class="town-map__stamp" dir="ltr"><span>ENGLISH TOWN</span><i>/</i><b>${esc(routeLevel?.id.toUpperCase() || 'A1')}</b></div>
          <span class="town-map__moon" aria-hidden="true"></span>
          <span class="town-map__hill town-map__hill--one" aria-hidden="true"></span>
          <span class="town-map__hill town-map__hill--two" aria-hidden="true"></span>
          <svg class="town-map__roads" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <path class="town-road" d="M500 110 C420 152 338 188 225 265 C300 312 388 337 500 365" />
            <path class="town-road__line" d="M500 110 C420 152 338 188 225 265 C300 312 388 337 500 365" />
            <path class="town-road" d="M500 110 C590 158 690 201 805 265 C705 310 605 342 500 365" />
            <path class="town-road__line" d="M500 110 C590 158 690 201 805 265 C705 310 605 342 500 365" />
          </svg>

          <a class="town-stop town-stop--cafe ${cafeDoneToday && !activeScene ? 'is-done' : 'is-featured'} ${nextTaskId === 'conversation' ? 'is-next' : ''}" href="${conversationHref}" ${nextTaskId === 'conversation' ? 'aria-current="step"' : ''}>
            <span class="town-stop__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${activeScene ? 'M4 5h16v12H9l-5 4V5Zm4 5h8m-8 3h5' : 'M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm13 2h2a2 2 0 0 1 0 4h-2M7 4v2m5-2v2'}" /></svg></span>
            <b>${esc(activeScene ? t('town.openConversation') : t('town.cafe'))}</b>
            <small>${esc(activeScene ? activeSceneTitle : cafeDoneToday ? t('town.doneToday') : cafeVisited ? t('town.doneBefore') : t('town.cafeMeta'))}</small>
            ${cafeDoneToday && !activeScene ? '<span class="town-stop__check" aria-label="✓">✓</span>' : ''}
          </a>

          <a class="town-stop town-stop--words" href="#/notebook">
            <span class="town-stop__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2H20v17H8.5A2.5 2.5 0 0 0 6 21.5v-17Zm0 0V22m4-15h6m-6 4h6" /></svg></span>
            <b>${esc(t('town.words'))}</b>
            <small>${esc(`${progress.notebook?.length || 0} ${t('common.words')}`)}</small>
          </a>

          <a class="town-stop town-stop--listen" href="#/drills?type=listen&count=5">
            <span class="town-stop__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13v-1a8 8 0 0 1 16 0v1m-16 0v5a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 1Zm16 0v5a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 1Z" /></svg></span>
            <b>${esc(t('town.listen'))}</b>
            <small>${esc(t('town.listenMeta'))}</small>
          </a>

          <a class="town-stop town-stop--read" href="#/reading">
            <span class="town-stop__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 6.5C9.5 4.7 6 4.5 3 5.5v14c3-1 6.5-.8 9 1 2.5-1.8 6-2 9-1v-14c-3-1-6.5-.8-9 1Zm0 0v14" /></svg></span>
            <b>${esc(t('town.read'))}</b>
            <small>${esc(t('town.readMeta'))}</small>
          </a>

          <article class="town-map__mission" aria-labelledby="townMissionTitle">
            <div class="town-map__mission-copy">
              <div class="town-map__mission-meta"><span>${esc(t('town.todayMission'))}</span><i>·</i><small>${esc(activeScene ? `${activeConversation.turn + 1}/${activeScene.turns.length} · ${t('town.resumeProgress')}` : t('town.cafeDuration'))}</small></div>
              <h2 id="townMissionTitle">${esc(activeScene ? `${t('town.resumePrefix')}: ${activeSceneTitle}` : cafeDoneToday ? t('town.cafeComplete') : t('town.cafeTitle'))}</h2>
              <p>${esc(activeScene ? t('town.resumeDescription') : t('town.cafeDescription'))}</p>
            </div>
            <a class="town-map__enter" href="${conversationHref}"><span aria-hidden="true">${activeScene ? '↻' : cafeDoneToday ? '↻' : '←'}</span>${esc(activeScene ? t('town.resumeButton') : cafeDoneToday ? t('town.cafeAgain') : t('town.enterCafe'))}</a>
            <span class="town-map__mission-count"><b>${mission.done}/${mission.total}</b><small>${esc(t('journey.steps'))}</small></span>
          </article>
        </div>
        <div class="town-map__under">
          <span>✦ ${esc(t('town.mapFootnote'))}</span>
          <div><a class="town-map__session-link" href="#/session">${esc(t('town.openSession'))} <span aria-hidden="true">←</span></a><a href="#/journey">${esc(t('journey.openMap'))} <span aria-hidden="true">←</span></a><a href="#/stats">${esc(t('town.progressLink'))} <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <section class="town-quests" aria-labelledby="townQuestsTitle">
        <div class="town-section-head">
          <div><span class="town-section-kicker">${esc(t('town.dailyLoop'))}</span><h2 id="townQuestsTitle">${esc(t('town.questTitle'))}</h2><p>${esc(t('town.questSubtitle'))}</p></div>
          <a class="town-text-link" href="#/notebook">${esc(t('town.openNotebook'))} <span aria-hidden="true">←</span></a>
        </div>
        <div class="town-quests__list">
          ${supportingTasks.map((task) => {
            const content = {
              review: { icon: '↻', label: t('journey.review'), detail: task.done ? t('journey.completed') : `${task.count}/${task.target} · ${t('town.reviewHint')}`, href: task.href, color: 'mint' },
              lesson: { icon: '▤', label: t('journey.lesson'), detail: task.done ? t('journey.completed') : lessonTitle, href: lessonHref, color: 'lilac' },
            }[task.id];
            return `<a class="town-quest ${task.done ? 'is-done' : ''} ${task.id === nextTaskId ? 'is-next' : ''}" href="${content.href}">
              <span class="town-quest__icon town-quest__icon--${content.color}" aria-hidden="true">${task.done ? '✓' : content.icon}</span>
              <span class="town-quest__copy"><b>${esc(content.label)}</b><small>${esc(content.detail)}</small></span>
              <span class="town-quest__action">${esc(task.done ? t('journey.completed') : task.id === nextTaskId ? t('journey.next') : t('town.goNow'))} <i aria-hidden="true">←</i></span>
            </a>`;
          }).join('')}
        </div>
        ${mission.done === mission.total ? `<div class="town-quests__complete" role="status"><span aria-hidden="true">✦</span>${esc(t('journey.missionDone'))}</div>` : ''}
        <div class="town-quests__foot"><span>🔒 ${esc(t('journey.localOnly'))}</span><a href="#/settings">${esc(t('town.adjustGoal'))} ↗</a></div>
      </section>

      <section class="town-phrase" aria-labelledby="townPhraseTitle">
        <span class="town-phrase__seal" aria-hidden="true">✧</span>
        <div class="town-phrase__content"><span class="town-section-kicker">${esc(t('town.phraseLabel'))}</span><h2 id="townPhraseTitle" class="en" lang="en" dir="ltr">${esc(cafePhrase.en)}</h2><p lang="${settings.uiLang === 'en' ? 'en' : 'ar'}" dir="${settings.uiLang === 'en' ? 'ltr' : 'rtl'}">${esc(t('town.phraseMeaning'))}</p></div>
        <div class="town-phrase__actions">${speakBtn(cafePhrase.en)}${phraseSaved ? `<span class="town-phrase__saved">✓ ${esc(t('common.notebook.added'))}</span>` : `<button class="town-phrase__save" type="button" data-nb data-en="${esc(cafePhrase.en)}" data-ar="${esc(cafePhrase.ar)}">＋ ${esc(t('town.savePhrase'))}</button>`}</div>
      </section>
    </div>
  `;
}
