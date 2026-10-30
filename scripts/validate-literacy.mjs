import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const file = resolve(root, "curriculum/literacy/literacy-l0-l1.json");
const manifestFile = resolve(root, "curriculum/literacy/audio-manifest.json");
const audioMapFile = resolve(root, "assets/js/data/zero-audio-map.js");
const literacyEngineFile = resolve(root, "assets/js/literacy/engine.js");
const speechEngineFile = resolve(root, "assets/js/core/speech.js");
const data = JSON.parse(readFileSync(file, "utf8"));
const audioManifest = JSON.parse(readFileSync(manifestFile, "utf8"));
const literacyEngineSource = readFileSync(literacyEngineFile, "utf8");
const speechEngineSource = readFileSync(speechEngineFile, "utf8");
const { AUDIO_MAP } = await import(new URL("../assets/js/data/zero-audio-map.js", import.meta.url));
const coreExampleInitials = { moon: "m", sun: "s", tree: "t", cat: "c", dog: "d" };
const errors = [];
const warnings = [];
const lessons = data.stages.flatMap(stage => stage.units.flatMap(unit => unit.lessons || []));
const lessonIds = lessons.map(lesson => lesson.id);

for (const id of new Set(lessonIds)) {
  if (lessonIds.filter(value => value === id).length > 1) errors.push(`Duplicate lesson id: ${id}`);
}

for (const lesson of lessons) {
  for (const [index, item] of (lesson.items || []).entries()) {
    if (item.audioText) {
      const key = String(item.audioText).trim().toLowerCase();
      let asset = AUDIO_MAP[key];
      if (!asset) {
        const initial = coreExampleInitials[key];
        asset = initial ? "./assets/audio/zero/n/word-" + initial + ".mp3" : /^[a-z]$/.test(key) ? "./assets/audio/zero/n/name-" + key + ".mp3" : null;
      }
      if (!asset || !existsSync(resolve(root, asset))) errors.push(`${lesson.id} item ${index + 1}: audioText has no verified embedded recording: ${key}`);
    }
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
if (data.pronunciationPolicy?.status !== "selected-existing-project-source") {
  errors.push("Pronunciation policy must identify the selected embedded project audio source");
}
if (!existsSync(audioMapFile)) errors.push("Embedded zero-audio map is missing");
if (!literacyEngineSource.includes("recordedOnly: true")) errors.push("Literacy activities must request approved recorded audio only");
if (!speechEngineSource.includes("if (opts.recordedOnly) return false;")) errors.push("Speech engine must not fall back to browser voice in recorded-only mode");
for (const [text, asset] of Object.entries(AUDIO_MAP || {})) {
  if (typeof asset !== "string" || !asset.startsWith("./assets/audio/zero/") || !existsSync(resolve(root, asset))) {
    errors.push(`Invalid or missing embedded audio map asset for "${text}": ${asset}`);
  }
}
const lettersInBank = "abcdefghijklmnopqrstuvwxyz".split("");
for (const letter of lettersInBank) {
  for (const kind of ["name", "word"]) {
    const asset = `assets/audio/zero/n/${kind}-${letter}.mp3`;
    if (!existsSync(resolve(root, asset))) errors.push(`Missing core alphabet audio: ${asset}`);
  }
}
const digraphIds = ["sh", "ch", "th-voiceless", "th-voiced", "ph", "ck", "ng", "oo-long", "oo-short", "ee", "ea", "ou"];
for (const id of digraphIds) {
  for (const [folder, prefix] of [["d", ""], ["n", "word-"]]) {
    const asset = `assets/audio/zero/${folder}/${prefix}${id}.mp3`;
    if (!existsSync(resolve(root, asset))) errors.push(`Missing core digraph audio: ${asset}`);
  }
}
if (audioManifest.pronunciationVariety?.source?.module !== "assets/js/core/zero-audio.js") {
  errors.push("Audio manifest must use the embedded zero-audio source");
}
for (const letter of audioManifest.letters || []) {
  for (const field of ["nameAudio", "exampleAudio", "phonemeAudio"]) {
    const asset = letter[field];
    if (asset && (!asset.startsWith("assets/audio/zero/") || !existsSync(resolve(root, asset)))) {
      errors.push(`Missing or out-of-bank audio asset: ${letter.id} ${field} -> ${asset}`);
    }
  }
  if (letter.nameAudio && !letter.exampleAudio) warnings.push(`Letter lacks example recording: ${letter.id}`);
  if (!letter.phonemeAudio) warnings.push(`Standalone letter phoneme is not recorded: ${letter.id}`);
}
for (const group of audioManifest.phonemeGroups || []) {
  for (const field of ["phonemeAudio", "exampleAudio"]) {
    const asset = group[field];
    if (!asset || !asset.startsWith("assets/audio/zero/") || !existsSync(resolve(root, asset))) {
      errors.push(`Missing digraph audio asset: ${group.id} ${field} -> ${asset}`);
    }
  }
}
if (audioManifest.audioGeneration?.status !== "blocked-original-generator-and-provenance-unavailable") {
  errors.push("Missing-audio generation must remain blocked until the original voice generator and provenance are available");
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
  recordedAudioActivities: lessons.reduce((count, lesson) => count + (lesson.items || []).filter(item => item.audioText).length, 0),
  alphabetLetters: alphabet.length,
  transferChecks: (data.transferChecks || []).length,
  embeddedAudioMapEntries: Object.keys(AUDIO_MAP || {}).length,
  errors,
  warnings
};
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
