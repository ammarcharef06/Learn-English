import assert from 'node:assert/strict';

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
  clear: () => memory.clear(),
};

const store = await import('../assets/js/core/store.js');
const { dailyMission, weeklySummary } = await import('../assets/js/core/journey.js');
const { gradeItem } = await import('../assets/js/core/srs.js');
const { markLessonRead } = await import('../assets/js/core/gamify.js');
const { CONVERSATIONS } = await import('../assets/js/data/conversations.js');
const practice = await import('../assets/js/core/conversation-practice.js');
const { addDays, dateKey, todayKey } = await import('../assets/js/core/utils.js');

let checks = 0;
function check(name, condition) {
  assert.ok(condition, name);
  checks++;
  console.log(`  ✅ ${name}`);
}

store.resetProgress();
check('conversation scenarios are unique and contain complete bilingual turns',
  CONVERSATIONS.length >= 5
  && new Set(CONVERSATIONS.map((scene) => scene.id)).size === CONVERSATIONS.length
  && CONVERSATIONS.every((scene) => scene.title && scene.titleAr && scene.turns.length >= 3
    && scene.turns.every((turn) => turn.prompt && turn.promptAr && turn.reply && turn.replyAr
      && turn.options.length >= 3 && turn.options.filter((option) => option.best).length === 1
      && turn.options.every((option) => option.en && option.ar))));

check('daily mission starts with three incomplete, actionable steps',
  dailyMission().done === 0 && dailyMission().tasks.length === 3
  && dailyMission().tasks.every((task) => task.href.startsWith('#/')));

for (let index = 0; index < 5; index++) gradeItem(`mission-word-${index}`, 2);
gradeItem('mission-word-0', 2);
markLessonRead('a1u1:0');
let mission = dailyMission();
check('review and lesson progress update without counting repeated words twice',
  mission.tasks.find((task) => task.id === 'review').count === 5
  && mission.tasks.find((task) => task.id === 'lesson').done
  && mission.done === 2);

assert.throws(() => practice.startConversation('missing-scene'), /Unknown conversation/);
let active = practice.startConversation(CONVERSATIONS[0].id);
check('conversation state is saved and can be resumed locally', active?.id === CONVERSATIONS[0].id
  && practice.getActiveConversation()?.turn === 0);
const firstAnswer = practice.answerConversation(0);
const duplicateAnswer = practice.answerConversation(1);
check('answers are recorded once and repeated clicks cannot change the result',
  firstAnswer.correct && duplicateAnswer.correct && practice.getActiveConversation().correct === 1);

let finish;
for (let turn = 0; turn < CONVERSATIONS[0].turns.length; turn++) {
  active = practice.getActiveConversation();
  if (active.answers[active.turn] == null) practice.answerConversation(0);
  finish = practice.advanceConversation();
  if (turn < CONVERSATIONS[0].turns.length - 1) check(`conversation advances to turn ${turn + 2}`, !finish.complete);
}
check('completed conversations save score, history, and today mission state',
  finish.complete && finish.score === CONVERSATIONS[0].turns.length
  && !practice.getActiveConversation()
  && store.progress.conversations.sessions === 1
  && store.progress.conversations.completed[CONVERSATIONS[0].id].best === CONVERSATIONS[0].turns.length
  && dailyMission().done === 3);

active = practice.startConversation(CONVERSATIONS[1].id);
const incorrect = practice.answerConversation(2);
check('incorrect conversation choices give feedback without losing the saved session',
  !incorrect.correct && practice.getActiveConversation().answers[0].optionIndex === 2);
for (let turn = 0; turn < CONVERSATIONS[1].turns.length; turn++) {
  active = practice.getActiveConversation();
  if (active.answers[active.turn] == null) practice.answerConversation(0);
  finish = practice.advanceConversation();
}
check('conversation results accumulate across multiple completed scenarios',
  finish.complete && finish.score === CONVERSATIONS[1].turns.length - 1
  && store.progress.conversations.sessions === 2
  && store.progress.conversations.correct === (CONVERSATIONS[0].turns.length + CONVERSATIONS[1].turns.length - 1));

const reference = new Date(2026, 5, 15);
const currentDay = dateKey(addDays(reference, -1));
const previousDay = dateKey(addDays(reference, -8));
store.saveProgress((progress) => {
  progress.activity[currentDay] = { q: 4, c: 3, minutes: 12, points: 20, conversations: 2 };
  progress.activity[previousDay] = { q: 8, c: 4, minutes: 20, points: 10, conversations: 1 };
});
const report = weeklySummary(reference);
check('weekly summary aggregates current and previous seven-day periods accurately',
  report.current.questions === 4 && report.current.correct === 3 && report.current.minutes === 12
  && report.current.conversations === 2 && report.current.accuracy === 75
  && report.previous.questions === 8 && report.previous.conversations === 1);

store.flush();
const persisted = JSON.parse(localStorage.getItem(store.KEYS.K_PROGRESS));
check('new learning features persist under the existing progress storage key',
  persisted.conversations.sessions === 2 && persisted.missionActivity[todayKey()].lesson
  && persisted.missionActivity[todayKey()].conversation);

console.log(`\n✅ All ${checks} journey and conversation checks passed.`);
