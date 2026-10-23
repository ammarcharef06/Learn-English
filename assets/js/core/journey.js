import { progress } from './store.js';
import { addDays, dateKey, todayKey } from './utils.js';
import { nextLessonSuggestion } from '../data/curriculum.js';

export const DAILY_REVIEW_TARGET = 5;

export function dailyMission(day = todayKey()) {
  const activity = progress.missionActivity?.[day] || {};
  const reviewed = Math.min(DAILY_REVIEW_TARGET, (activity.reviewedItems || []).length);
  const lessonDone = !!activity.lesson || !nextLessonSuggestion();
  const tasks = [
    { id: 'review', done: reviewed >= DAILY_REVIEW_TARGET, count: reviewed, target: DAILY_REVIEW_TARGET, href: '#/flashcards' },
    { id: 'lesson', done: lessonDone, count: lessonDone ? 1 : 0, target: 1, href: '#/journey' },
    { id: 'conversation', done: !!activity.conversation, count: activity.conversation ? 1 : 0, target: 1, href: '#/conversations' },
  ];
  return { day, tasks, done: tasks.filter((task) => task.done).length, total: tasks.length };
}

function sumDays(referenceDate, from, to) {
  const result = { questions: 0, correct: 0, minutes: 0, points: 0, conversations: 0, activeDays: 0 };
  for (let offset = from; offset <= to; offset++) {
    const key = dateKey(addDays(referenceDate, -offset));
    const activity = progress.activity?.[key] || {};
    const mission = progress.missionActivity?.[key] || {};
    result.questions += activity.q || 0;
    result.correct += activity.c || 0;
    result.minutes += activity.minutes || 0;
    result.points += activity.points || 0;
    result.conversations += activity.conversations || (mission.conversation ? 1 : 0);
    if ((activity.q || 0) > 0 || (activity.minutes || 0) > 0 || mission.conversation || mission.lesson) result.activeDays++;
  }
  result.minutes = Math.round(result.minutes);
  result.accuracy = result.questions ? Math.round((result.correct / result.questions) * 100) : 0;
  return result;
}

export function weeklySummary(referenceDate = new Date()) {
  return { current: sumDays(referenceDate, 0, 6), previous: sumDays(referenceDate, 7, 13) };
}
