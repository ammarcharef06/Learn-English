import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const file = resolve(root, "curriculum/literacy/literacy-l0-l1.json");
const data = JSON.parse(readFileSync(file, "utf8"));
const errors = [];
const warnings = [];
const lessons = data.stages.flatMap(stage => stage.units.flatMap(unit => unit.lessons || []));
const lessonIds = lessons.map(lesson => lesson.id);

for (const id of new Set(lessonIds)) {
  if (lessonIds.filter(value => value === id).length > 1) errors.push(`Duplicate lesson id: ${id}`);
}

for (const lesson of lessons) {
  for (const [index, item] of (lesson.items || []).entries()) {
    if (item.choices && !item.choices.includes(item.answer)) {
      errors.push(`${lesson.id} item ${index + 1}: answer is not one of the choices`);
    }
    if (item.input && typeof item.answer !== "string") {
      errors.push(`${lesson.id} item ${index + 1}: text input requires a string answer`);
    }
  }
  if (!lesson.items?.length) warnings.push(`No activities yet: ${lesson.id} — ${lesson.title}`);
}

const l2 = data.stages.find(stage => stage.id === "L2");
for (const lesson of l2?.units.flatMap(unit => unit.lessons || []) || []) {
  if (lesson.audioRequiredForMastery !== true) {
    errors.push(`L2 phoneme lesson must remain audio-gated: ${lesson.id}`);
  }
}
if (data.pronunciationPolicy?.status !== "pending-accent-selection") {
  errors.push("Pronunciation policy must remain pending until an accent is selected and reviewed");
}

const alphabet = data.letters || [];
const letterIds = alphabet.map(letter => letter.id);
if (new Set(letterIds).size !== letterIds.length) errors.push("Duplicate alphabet letter id");
const l1 = data.stages.find(stage => stage.id === "L1");
const assigned = (l1?.units || []).flatMap(unit => unit.letterIds || []);
if (new Set(assigned).size !== assigned.length) errors.push("A letter is assigned to more than one L1 group");
for (const id of letterIds) if (!assigned.includes(id)) errors.push(`Letter not assigned to an L1 group: ${id}`);
for (const id of assigned) if (!letterIds.includes(id)) errors.push(`Unknown letter assigned to L1: ${id}`);

for (const check of data.transferChecks || []) {
  const ids = (check.items || []).map(item => item.id);
  if (new Set(ids).size !== ids.length) errors.push(`Duplicate transfer item id in ${check.id}`);
  if (!Number.isFinite(check.passMark) || check.passMark <= 0 || check.passMark > 1) {
    errors.push(`Invalid transfer pass mark: ${check.id}`);
  }
  for (const [index, item] of (check.items || []).entries()) {
    if (!Array.isArray(item.choices) || !item.choices.includes(item.answer)) {
      errors.push(`${check.id} transfer item ${index + 1}: answer is not one of the choices`);
    }
  }
}

const summary = {
  stages: data.stages.length,
  lessons: lessons.length,
  lessonsWithActivities: lessons.filter(lesson => lesson.items?.length).length,
  alphabetLetters: alphabet.length,
  transferChecks: (data.transferChecks || []).length,
  errors,
  warnings
};
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
