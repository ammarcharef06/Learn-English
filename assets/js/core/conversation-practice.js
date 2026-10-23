import { progress, saveProgress } from './store.js';
import { todayKey } from './utils.js';
import { CONVERSATIONS } from '../data/conversations.js';

export function getActiveConversation() {
  const active = progress.conversations?.active;
  return active && CONVERSATIONS.some((scene) => scene.id === active.id) ? active : null;
}

export function startConversation(sceneId) {
  const scene = CONVERSATIONS.find((item) => item.id === sceneId);
  if (!scene) throw new Error(`Unknown conversation: ${sceneId}`);
  saveProgress((p) => {
    p.conversations = p.conversations || { completed: {}, sessions: 0, turns: 0, correct: 0, active: null };
    p.conversations.completed = p.conversations.completed || {};
    p.conversations.active = { id: scene.id, turn: 0, correct: 0, answers: [] };
  });
  return getActiveConversation();
}

export function answerConversation(optionIndex) {
  const active = getActiveConversation();
  if (!active) throw new Error('No active conversation.');
  const scene = CONVERSATIONS.find((item) => item.id === active.id);
  const turn = scene.turns[active.turn];
  if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= turn.options.length) {
    throw new RangeError('Conversation answer is out of range.');
  }
  if (active.answers[active.turn] != null) return active.answers[active.turn];
  const option = turn.options[optionIndex];
  const result = { optionIndex, correct: !!option.best };
  saveProgress((p) => {
    const current = p.conversations.active;
    current.answers[active.turn] = result;
    if (result.correct) current.correct += 1;
  });
  return result;
}

export function advanceConversation() {
  const active = getActiveConversation();
  if (!active) throw new Error('No active conversation.');
  if (active.answers[active.turn] == null) throw new Error('Answer the current conversation turn first.');
  const scene = CONVERSATIONS.find((item) => item.id === active.id);
  if (active.turn < scene.turns.length - 1) {
    saveProgress((p) => { p.conversations.active.turn += 1; });
    return { complete: false, active: getActiveConversation() };
  }

  const day = todayKey();
  let result;
  saveProgress((p) => {
    const conversations = p.conversations;
    const previous = conversations.completed[scene.id] || { sessions: 0, best: 0 };
    const score = active.correct;
    conversations.completed[scene.id] = {
      sessions: previous.sessions + 1,
      best: Math.max(previous.best, score),
      lastAt: new Date().toISOString(),
    };
    conversations.sessions = (conversations.sessions || 0) + 1;
    conversations.turns = (conversations.turns || 0) + scene.turns.length;
    conversations.correct = (conversations.correct || 0) + score;
    conversations.active = null;

    p.missionActivity = p.missionActivity || {};
    const mission = p.missionActivity[day] || { reviewedItems: [] };
    mission.conversation = true;
    p.missionActivity[day] = mission;
    p.activity = p.activity || {};
    const activity = p.activity[day] || { q: 0, c: 0, points: 0, minutes: 0 };
    activity.conversations = (activity.conversations || 0) + 1;
    p.activity[day] = activity;
    result = { complete: true, sceneId: scene.id, score, total: scene.turns.length };
  });
  return result;
}
