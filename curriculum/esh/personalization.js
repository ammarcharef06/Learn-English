export const ESH_PROFILE_KEY = 'lea.esh.profile';

const LEVEL_ORDER = [
  'esh-pre-a0', 'esh-a0', 'esh-a1', 'esh-a2', 'esh-b1',
  'esh-b2', 'esh-c1', 'esh-c2', 'esh-post-c2',
];

const EXPERIENCE_CAP = {
  new: 1,
  basic: 3,
  intermediate: 4,
  advanced: 6,
};

const MOTIVATION_TERMS = {
  travel: /\b(travel|journey|trip|timetable|transport|airport|hotel|ticket|tour|holiday|flight|direction|booking)\b/i,
  work: /\b(work|job|career|business|meeting|professional|workplace|colleague|office|interview)\b/i,
  study: /\b(study|school|course|class|university|education|academic|research|exam|student)\b/i,
  daily: /\b(daily|routine|home|family|food|shopping|friend|people|personal|everyday)\b/i,
  confidence: /\b(speak|speaking|conversation|role.play|interaction|pronunciation|listen|listening)\b/i,
};

const CHALLENGE_TYPES = {
  speaking: new Set(['role_play']),
  listening: new Set(['phonics', 'role_play']),
  vocabulary: new Set(['sentence_builder', 'role_play']),
  grammar: new Set(['sentence_builder', 'essay_analysis']),
};

const EXPERIENCE_TEST_CAP = { new: 1, basic: 3, intermediate: 4, advanced: 6 };
const TEST_LEVEL = [0, 1, 2, 4];

export function getEshProfile() {
  try {
    const raw = localStorage.getItem(ESH_PROFILE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw);
    if (!profile || profile.version !== 1 || !profile.motivation || !profile.levelId) return null;
    return profile;
  } catch (error) {
    console.warn('Could not read the ESH learner profile.', error);
    return null;
  }
}

export function saveEshProfile(answers) {
  if (!answers || !Array.isArray(answers.quickTest) || answers.quickTest.length !== 3) {
    throw new TypeError('The ESH profile needs answers to all three placement questions.');
  }
  const score = answers.quickTest.reduce((total, answer, index) => total + (answer === ['is', 'visited', 'had'][index] ? 1 : 0), 0);
  const scoreLevel = TEST_LEVEL[score];
  const experienceCap = EXPERIENCE_TEST_CAP[answers.experience] ?? EXPERIENCE_TEST_CAP.new;
  const levelIndex = Math.min(scoreLevel, experienceCap);
  const profile = {
    version: 1,
    motivation: answers.motivation,
    experience: answers.experience,
    challenge: answers.challenge,
    bridgeLanguage: answers.bridgeLanguage,
    minutesPerSession: Number(answers.minutesPerSession),
    quickTest: answers.quickTest,
    quickTestScore: score,
    levelId: LEVEL_ORDER[levelIndex],
    completedAt: new Date().toISOString(),
  };
  if (!Number.isFinite(profile.minutesPerSession) || profile.minutesPerSession <= 0) {
    throw new TypeError('The ESH profile needs a valid daily study time.');
  }
  localStorage.setItem(ESH_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

function lessonText(lesson, unit) {
  return [
    lesson.title,
    lesson.scenario,
    ...(lesson.examples || []).flatMap((example) => [example.en, example.ar]),
    unit.title,
  ].join(' ');
}

export function getEshRecommendations(units, profile, progress = {}) {
  if (!Array.isArray(units) || !profile) return [];
  const topicPattern = MOTIVATION_TERMS[profile.motivation];
  const challengeTypes = CHALLENGE_TYPES[profile.challenge];
  const sessionLimit = profile.minutesPerSession <= 5 ? 2 : profile.minutesPerSession <= 10 ? 4 : 6;
  const targetLevelIndex = Math.max(0, LEVEL_ORDER.indexOf(profile.levelId));

  const allLessons = units.flatMap((unit) => (unit.grammar || []).map((lesson, index) => ({
    unit,
    lesson,
    index,
    text: lessonText(lesson, unit),
    key: `${unit.id}:${index}`,
  })));
  const topicMatches = topicPattern ? allLessons.filter((item) => topicPattern.test(item.text)) : allLessons;
  const eligible = topicMatches.length ? topicMatches : allLessons;

  const ranked = eligible
    .map((item) => {
      const currentLevelIndex = LEVEL_ORDER.indexOf(item.unit.levelId);
      const levelDistance = currentLevelIndex < 0 ? LEVEL_ORDER.length : Math.abs(currentLevelIndex - targetLevelIndex);
      const topicMatch = Boolean(topicPattern && topicPattern.test(item.text));
      const challengeMatch = Boolean(challengeTypes?.has(item.lesson.lessonType));
      return {
        ...item,
        score: (topicMatch ? 8 : 0) + (challengeMatch ? 3 : 0) - levelDistance,
        isCompleted: Boolean(progress.lessons?.[item.key]),
        estimatedMinutes: item.lesson.lessonType === 'essay_analysis' ? 3 : item.lesson.lessonType === 'role_play' ? 2 : 1,
      };
    })
    .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted) || b.score - a.score || a.lesson.order - b.lesson.order);
  const selected = [];
  let plannedMinutes = 0;
  for (const lesson of ranked) {
    if (selected.length >= sessionLimit) break;
    if (plannedMinutes + lesson.estimatedMinutes > profile.minutesPerSession) continue;
    selected.push(lesson);
    plannedMinutes += lesson.estimatedMinutes;
  }
  return selected;
}
