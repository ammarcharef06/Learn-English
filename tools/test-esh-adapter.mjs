import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { adaptEshCurriculum } from '../curriculum/esh/adapter.js';

const source = JSON.parse(await readFile(new URL('../curriculum/esh/data/curriculum.json', import.meta.url), 'utf8'));
const adapted = adaptEshCurriculum(source);
const lessons = adapted.units.flatMap((unit) => unit.grammar.map((lesson) => ({ unit, lesson })));

assert.equal(adapted.levels.length, 9, 'all ESH levels should be available');
assert.equal(adapted.units.length, 52, 'all ESH units should be available');
assert.equal(lessons.length, 171, 'all ESH lessons should be mapped');
assert.equal(new Set(adapted.levels.map((level) => level.id)).size, 9, 'level ids should be unique');
assert.equal(new Set(adapted.units.map((unit) => unit.id)).size, 52, 'unit ids should be unique');
assert.ok(adapted.units.every((unit) => unit.id.startsWith('esh-')), 'all unit ids should be namespaced');

for (const levelId of ['PRE-A0', 'A1', 'B1']) {
  const level = adapted.levels.find((candidate) => candidate.sourceId === levelId);
  assert.ok(level, `${levelId} should be mapped`);
  const lesson = level.units[0].grammar[0];
  assert.equal(lesson.sourceId, source.levels.find((candidate) => candidate.level === levelId).lessons[0].id);
  assert.equal(lesson.lessonType, source.levels.find((candidate) => candidate.level === levelId).lessons[0].lesson_type);
  assert.ok(lesson.sentence, `${levelId} scenario should map to sentence`);
  assert.ok(lesson.examples[0].question, `${levelId} flashcard question should be retained`);
  assert.ok(lesson.examples[0].answer, `${levelId} flashcard answer should be retained`);
  assert.equal(lesson.vocabulary[0].word, lesson.examples[0].en);
  assert.equal(lesson.vocabulary[0].translation, lesson.examples[0].ar);
}

console.log('ESH adapter: 9 levels, 52 units, 171 lessons; PRE-A0, A1, and B1 mappings passed.');
