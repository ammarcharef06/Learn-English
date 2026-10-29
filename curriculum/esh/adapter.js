const CURRICULUM_URL = new URL('./data/curriculum.json', import.meta.url);

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cardsFor(lesson) {
  if (Array.isArray(lesson.flashcards) && lesson.flashcards.length) {
    return lesson.flashcards.filter((card) => card && card.question && card.answer);
  }
  if (lesson.title && lesson.scenario) {
    return [{ id: `${lesson.id}-scenario`, question: lesson.title, answer: lesson.scenario }];
  }
  return [];
}

function adaptLesson(lesson) {
  const cards = cardsFor(lesson);
  const scenario = String(lesson.scenario || '');
  const assessment = Array.isArray(lesson.assessment) ? lesson.assessment : [];
  const examples = cards.map((card) => ({
    id: card.id || '',
    en: String(card.question),
    ar: String(card.answer),
    word: String(card.question),
    translation: String(card.answer),
    question: String(card.question),
    answer: String(card.answer),
    sourceQuestion: String(card.question),
    sourceAnswer: String(card.answer),
  }));

  return {
    id: `esh-${slug(lesson.id)}`,
    sourceId: lesson.id,
    title: lesson.title,
    lessonType: lesson.lesson_type,
    scenario,
    sentence: scenario,
    question: examples[0]?.question || '',
    answer: examples[0]?.answer || '',
    explain: scenario ? `<p>${escapeHtml(scenario)}</p>` : '',
    examples,
    tips: assessment.map(String),
    vocabulary: examples.map((example, index) => ({
      id: example.id || `${lesson.id}-card-${index + 1}`,
      en: example.en,
      ar: example.ar,
      word: example.word,
      translation: example.translation,
      sentence: scenario,
      pos: lesson.lesson_type,
      lessonType: lesson.lesson_type,
    })),
    sentences: scenario ? [{ id: lesson.id, en: scenario, ar: '', lessonType: lesson.lesson_type }] : [],
    source: lesson.source || '',
    sourceLine: lesson.source_line ?? null,
    unitSourceId: lesson.unit_id,
    order: lesson.order,
  };
}

export function adaptEshCurriculum(source) {
  if (!source || !Array.isArray(source.levels) || !source.levels.length) {
    throw new TypeError('ESH curriculum must contain a non-empty levels array.');
  }

  const seenLevels = new Set();
  const seenUnits = new Set();
  const levels = source.levels.map((sourceLevel) => {
    const levelId = `esh-${slug(sourceLevel.level)}`;
    if (!sourceLevel.level || seenLevels.has(levelId)) {
      throw new TypeError(`ESH curriculum has a missing or duplicate level: ${sourceLevel.level || '(empty)'}`);
    }
    seenLevels.add(levelId);
    if (!Array.isArray(sourceLevel.units) || !Array.isArray(sourceLevel.lessons)) {
      throw new TypeError(`ESH level ${sourceLevel.level} must include units and lessons arrays.`);
    }

    const lessonsByUnit = new Map(sourceLevel.units.map((unit) => [unit.id, []]));
    for (const lesson of sourceLevel.lessons) {
      const target = lessonsByUnit.get(lesson.unit_id);
      if (!target) throw new TypeError(`ESH lesson ${lesson.id} refers to an unknown unit.`);
      target.push(adaptLesson(lesson));
    }

    const units = sourceLevel.units.map((unit) => {
      const id = `esh-${slug(sourceLevel.level)}-${slug(unit.id.split('.').slice(1).join('-'))}`;
      if (!unit.id || seenUnits.has(id)) throw new TypeError(`ESH curriculum has a missing or duplicate unit: ${unit.id || '(empty)'}`);
      seenUnits.add(id);
      const lessons = (lessonsByUnit.get(unit.id) || []).sort((a, b) => a.order - b.order);
      return {
        id,
        sourceId: unit.id,
        title: unit.title,
        titleEn: unit.title,
        icon: '📘',
        goal: lessons[0]?.scenario || '',
        levelId,
        levelLabel: sourceLevel.title,
        grammar: lessons,
        vocabulary: lessons.flatMap((lesson) => lesson.vocabulary),
        phonetics: [],
        arabic_l1_transfers: [],
        academic_focus: [],
        sentences: lessons.flatMap((lesson) => lesson.sentences),
        dialogue: [],
      };
    });

    return {
      id: levelId,
      sourceId: sourceLevel.level,
      label: sourceLevel.title,
      labelEn: sourceLevel.title,
      icon: '📘',
      summary: sourceLevel.title,
      units,
    };
  });

  const units = levels.flatMap((level) => level.units);
  if (!units.length || units.some((unit) => !unit.grammar.length)) {
    throw new TypeError('ESH curriculum contains an empty unit or lesson set.');
  }
  return { levels, units };
}

export async function loadEshCurriculum(fetcher = globalThis.fetch) {
  if (typeof fetcher !== 'function') throw new TypeError('Fetch is required to load ESH curriculum data.');
  const response = await fetcher(CURRICULUM_URL);
  if (!response.ok) throw new Error(`Could not load ESH curriculum (${response.status}).`);
  return adaptEshCurriculum(await response.json());
}
