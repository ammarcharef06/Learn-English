import { A0_CORE_CURRICULUM, ZERO_STAGES, WORD_GROUPS, READINGS as A0_READINGS } from '../assets/js/data/zero.js';
import { LEVEL_A1 } from '../assets/js/data/curriculum-a1.js';
import { LEVEL_A2 } from '../assets/js/data/curriculum-a2.js';
import { READINGS } from '../assets/js/data/readings.js';

const COMPONENTS = ['grammar', 'vocabulary', 'phonetics', 'arabic_l1_transfers', 'academic_focus'];
const errors = [];

function validateUnits(label, units) {
  for (const unit of units) {
    for (const component of COMPONENTS) {
      if (!Array.isArray(unit[component]) || unit[component].length === 0) {
        errors.push(`${label}/${unit.id}: missing or empty ${component}`);
      }
    }
  }
}

validateUnits('A0', A0_CORE_CURRICULUM.units);
validateUnits('A1', LEVEL_A1.units);
validateUnits('A2', LEVEL_A2.units);

const activeStages = new Set(ZERO_STAGES.map((stage) => stage.id));
const expectedStages = ['letters', 'numbers', 'time', 'pronouns', 'sentences'];
if (expectedStages.some((stage) => !activeStages.has(stage)) || activeStages.size !== expectedStages.length) {
  errors.push(`A0 stages must be exactly: ${expectedStages.join(', ')}`);
}

const a1Vocabulary = new Set(LEVEL_A1.units.flatMap((unit) => unit.vocabulary.map((word) => word.en.toLowerCase())));
const transferredWords = WORD_GROUPS.flatMap((group) => group.words);
for (const word of transferredWords) {
  if (!a1Vocabulary.has(word.en.toLowerCase())) errors.push(`A1 is missing transferred word: ${word.en}`);
}

const a1ReadingIds = new Set(READINGS.filter((reading) => reading.level === 'a1').map((reading) => reading.id));
for (const reading of A0_READINGS) {
  if (!a1ReadingIds.has(`r-a1-foundation-${reading.id}`)) {
    errors.push(`A1 is missing transferred reading: ${reading.id}`);
  }
}

const a2Vocabulary = new Set(LEVEL_A2.units.flatMap((unit) => unit.vocabulary.map((word) => word.en.toLowerCase())));
for (const phrase of ['wake up', 'meet up', 'grow up', 'clean up', 'eat out', 'try on']) {
  if (!a2Vocabulary.has(phrase)) errors.push(`A2 is missing relocated phrasal verb: ${phrase}`);
}

if (errors.length) {
  console.error('Foundation curriculum validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Foundation curriculum validated: A0 ${A0_CORE_CURRICULUM.units.length} units, A1 ${LEVEL_A1.units.length} units, A2 ${LEVEL_A2.units.length} units, ${transferredWords.length} words and ${A0_READINGS.length} readings migrated.`);
}
