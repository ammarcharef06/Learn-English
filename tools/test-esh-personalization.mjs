import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { adaptEshCurriculum } from '../curriculum/esh/adapter.js';
import {
  ESH_PROFILE_KEY,
  getEshProfile,
  getEshRecommendations,
  saveEshProfile,
} from '../curriculum/esh/personalization.js';

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
};

const source = JSON.parse(await readFile(new URL('../curriculum/esh/data/curriculum.json', import.meta.url), 'utf8'));
const { units } = adaptEshCurriculum(source);
const profile = saveEshProfile({
  motivation: 'travel',
  experience: 'advanced',
  challenge: 'speaking',
  bridgeLanguage: 'ar',
  minutesPerSession: '5',
  quickTest: ['is', 'visited', 'had'],
});

assert.equal(ESH_PROFILE_KEY, 'lea.esh.profile');
assert.equal(getEshProfile().motivation, 'travel', 'the learner profile should persist locally');
assert.equal(profile.quickTestScore, 3);
assert.equal(profile.levelId, 'esh-b1', 'placement results should set the starting level');

const recommendations = getEshRecommendations(units, profile);
assert.ok(recommendations.length > 0, 'travel learners should receive recommendations');
assert.ok(recommendations.length <= 2, 'five-minute sessions should have a short lesson list');
assert.ok(recommendations.every((item) => /\b(travel|journey|trip|timetable|transport|airport|hotel|ticket|tour|holiday|flight|direction|booking)\b/i.test([
  item.lesson.title,
  item.lesson.scenario,
  item.unit.title,
  ...(item.lesson.examples || []).flatMap((example) => [example.en, example.ar]),
].join(' '))), 'travel recommendations should match the learner goal');
assert.ok(recommendations.reduce((minutes, item) => minutes + item.estimatedMinutes, 0) <= 5, 'recommendations should fit the session time');

console.log('ESH personalization: local profile, placement level, goal filtering, and session-time limit passed.');
