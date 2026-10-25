/* تجميع المنهج والمطالعات في واجهة واحدة */
import { LEVEL_A1 } from './curriculum-a1.js';
import { LEVEL_A2 } from './curriculum-a2.js';
import { LEVEL_B1 } from './curriculum-b1.js';
import {
  normalizeCurriculumUnit,
  validateLevel,
  importStagedLevel,
  exportStagedLevel,
  B2_STAGED_CURRICULUM,
  C1_STAGED_CURRICULUM,
  C2_STAGED_CURRICULUM,
} from './curriculum-advanced.js';
import { READINGS } from './readings.js';
import { progress } from '../core/store.js';
import { attachCurriculumAudio } from './curriculum-audio.js';

export { READINGS };
export {
  ADVANCED_UNIT_SCHEMA,
  B2_STAGED_CURRICULUM,
  C1_STAGED_CURRICULUM,
  C2_STAGED_CURRICULUM,
  CURRICULUM_SCHEMA_VERSION,
  PLANNED_LEVELS,
  UNIT_COMPONENTS,
  exportStagedLevel,
  importStagedLevel,
  isPlannedLevel,
  normalizeCurriculumUnit,
  validateLevel,
} from './curriculum-advanced.js';

export const LEVELS = [LEVEL_A1, LEVEL_A2, LEVEL_B1].map((level) => ({
  ...level,
  units: level.units.map(normalizeCurriculumUnit),
}));

export const ALL_UNITS = LEVELS.flatMap((l) => l.units.map((u) => ({
  id: u.id,
  title: u.title,
  titleEn: u.titleEn,
  icon: u.icon,
  goal: u.goal,
  levelId: l.id,
  levelLabel: l.label,
  levelColor: l.color,
  levelIcon: l.icon,
  ...u,
})));

attachCurriculumAudio(ALL_UNITS);

export function activateStagedLevel(payload) {
  const imported = importStagedLevel(payload);
  if (!imported.valid) return imported;
  if (LEVELS.some((active) => active.id === imported.level.id)) {
    return { level: null, valid: false, warnings: [`المستوى ${imported.level.id} مفعّل مسبقاً.`] };
  }

  const level = imported.level;
  attachCurriculumAudio(level.units);
  LEVELS.push(level);
  ALL_UNITS.push(...level.units.map((unit) => ({
    ...unit,
    levelId: level.id,
    levelLabel: level.label,
    levelColor: level.color,
    levelIcon: level.icon,
  })));
  return { level, valid: true, warnings: [] };
}

const b2Activation = activateStagedLevel(exportStagedLevel(B2_STAGED_CURRICULUM));
if (!b2Activation.valid) {
  throw new Error(`تعذر تفعيل منهج B2 المحقق: ${b2Activation.warnings.join(' ')}`);
}

for (const stagedLevel of [C1_STAGED_CURRICULUM, C2_STAGED_CURRICULUM]) {
  const activation = activateStagedLevel(exportStagedLevel(stagedLevel));
  if (!activation.valid) {
    throw new Error(`تعذر تفعيل منهج ${stagedLevel.id.toUpperCase()} المحقق: ${activation.warnings.join(' ')}`);
  }
}

export function getLevel(id) { return LEVELS.find((l) => l.id === id) || null; }
export function getUnit(unitId) { return ALL_UNITS.find((u) => u.id === unitId) || null; }
export function unitsOfLevel(levelId) { return ALL_UNITS.filter((u) => u.levelId === levelId); }

export function levelDone(levelId) {
  const lv = getLevel(levelId);
  if (!lv) return false;
  return lv.units.every((u) => progress.units?.[u.id]?.done);
}
export function levelPercent(levelId) {
  const units = unitsOfLevel(levelId);
  if (!units.length) return 0;
  const done = units.filter((u) => progress.units?.[u.id]?.done).length;
  return Math.round((done / units.length) * 100);
}
export function unitPercent(unitId) {
  const u = getUnit(unitId);
  if (!u) return 0;
  const lessons = u.grammar.length;
  const read = u.grammar.filter((_, i) => progress.lessons?.[`${unitId}:${i}`]).length;
  const quiz = progress.units?.[unitId]?.quiz;
  const quizPart = quiz && quiz.q ? Math.min(1, quiz.q / Math.max(6, u.vocabulary.length)) : 0;
  const lessonPart = lessons ? read / lessons : 0;
  return Math.round(((lessonPart * 0.6) + (quizPart * 0.4)) * 100);
}
export function isLevelUnlocked(index) {
  if (index <= 0) return true;
  const prev = LEVELS[index - 1];
  return levelPercent(prev.id) >= 40;
}

export const READINGS_TOTAL = READINGS.length;
export function getReading(id) { return READINGS.find((r) => r.id === id) || null; }
export function readingsOfLevel(level) { return READINGS.filter((r) => r.level === level); }

export function curriculumStats() {
  const units = ALL_UNITS.length;
  const done = ALL_UNITS.filter((u) => progress.units?.[u.id]?.done).length;
  const vocab = ALL_UNITS.reduce((n, u) => n + u.vocabulary.length, 0);
  const grammar = ALL_UNITS.reduce((n, u) => n + u.grammar.length, 0);
  const sentences = ALL_UNITS.reduce((n, u) => n + u.sentences.length, 0);
  return { units, done, vocab, grammar, sentences, readings: READINGS.length, percent: units ? Math.round((done / units) * 100) : 0 };
}

export function nextLessonSuggestion() {
  for (const lv of LEVELS) {
    for (const u of lv.units) {
      const st = progress.units?.[u.id];
      if (!st || !st.done) {
        const lessonIndex = u.grammar.findIndex((_, i) => !progress.lessons?.[`${u.id}:${i}`]);
        return { unit: getUnit(u.id), lessonIndex: lessonIndex < 0 ? 0 : lessonIndex };
      }
    }
  }
  return null;
}
