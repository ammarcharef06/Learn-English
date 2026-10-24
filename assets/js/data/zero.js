/* ============================================================
   قسم «من الصفر» (A0) — تجميع المحتوى + بناء الأسئلة
   ============================================================ */
import { esc } from '../core/utils.js';
import { LETTERS, DIGRAPHS, NUMBERS, ORDINALS } from './zero-letters.js';
import { DAYS, MONTHS, SEASONS, TIME_WORDS, PRONOUNS, TO_BE, NUMBERS_TIME } from './zero-time.js';
import { WORD_GROUPS, SENTENCES, READINGS } from './zero-words.js';

export { LETTERS, DIGRAPHS, NUMBERS, ORDINALS, DAYS, MONTHS, SEASONS, TIME_WORDS, PRONOUNS, TO_BE, NUMBERS_TIME, WORD_GROUPS, SENTENCES, READINGS };

const A0_NUMBERS = NUMBERS.filter((item) => item.n <= 20);
const A0_SENTENCES = SENTENCES.filter((item) => ['greetings', 'polite', 'intro'].includes(item.group));

export const A0_CORE_CURRICULUM = {
  id: 'a0',
  label: 'A0 — الأساسيات المطلقة',
  labelEn: 'Absolute Beginner (A0)',
  units: [
    {
      id: 'a0-alphabet',
      stageIds: ['letters'],
      title: 'الأبجدية وأصوات الحروف',
      grammar: [{ title: 'اسم الحرف وصوته', explain: 'اسم الحرف يختلف أحياناً عن صوته داخل الكلمة.', examples: [{ en: 'A is the letter name; apple begins with /æ/.', ar: 'A اسم الحرف، وتبدأ كلمة apple بصوت /æ/.' }] }],
      vocabulary: [
        { en: 'letter', ar: 'حرف', example: { en: 'A is a letter.', ar: 'A حرف.' } },
        { en: 'sound', ar: 'صوت', example: { en: 'Listen to the first sound.', ar: 'استمع إلى الصوت الأول.' } },
        { en: 'apple', ar: 'تفاحة', example: { en: 'A is for apple.', ar: 'حرف A في كلمة apple.' } },
      ],
      phonetics: [
        { en: 'apple', ipa: '/ˈæpəl/', ar: 'تفاحة', contrastPairs: [{ en: 'A /æ/ — E /e/', ar: 'ميّز صوت بداية apple عن بداية egg.' }] },
        { en: 'pen / ball', ipa: '/p/ — /b/', ar: 'قلم / كرة', contrastPairs: [{ en: 'pen / ball', ar: 'يخرج /p/ بلا اهتزاز للحبال الصوتية، ويُجهَر /b/.' }] },
      ],
      arabic_l1_transfers: [
        { incorrect: 'A in apple is called “ah”.', corrected: 'A is the letter name; /æ/ is its sound in apple.', explanationAr: 'لا تخلط بين اسم الحرف والصوت الذي يمثله في كلمة معينة.' },
      ],
      academic_focus: [
        { term: 'letter', meaningAr: 'حرف', example: { en: 'Write the letter A.', ar: 'اكتب الحرف A.' } },
        { term: 'repeat', meaningAr: 'كرّر', example: { en: 'Repeat the sound.', ar: 'كرّر الصوت.' } },
      ],
    },
    {
      id: 'a0-numbers',
      stageIds: ['numbers'],
      title: 'الأرقام الأساسية',
      grammar: [{ title: 'العدد والاسم', explain: 'تعلّم الأعداد أولاً، ثم استخدمها مع اسم بسيط.', examples: [{ en: 'Three books.', ar: 'ثلاثة كتب.' }] }],
      vocabulary: [
        { en: 'one', ar: 'واحد', example: { en: 'One book.', ar: 'كتاب واحد.' } },
        { en: 'five', ar: 'خمسة', example: { en: 'Five pens.', ar: 'خمسة أقلام.' } },
        { en: 'ten', ar: 'عشرة', example: { en: 'Ten students.', ar: 'عشرة طلاب.' } },
      ],
      phonetics: [
        { en: 'three', ipa: '/θriː/', ar: 'ثلاثة', contrastPairs: [{ en: 'three / tree', ar: 'ابدأ /θ/ بطرف اللسان قرب الأسنان، وابدأ tree بصوت /t/.' }] },
        { en: 'five', ipa: '/faɪv/', ar: 'خمسة', contrastPairs: [{ en: 'five / fine', ar: 'ميّز نهاية /v/ المجهورة عن /n/.' }] },
      ],
      arabic_l1_transfers: [
        { incorrect: 'three book', corrected: 'three books', explanationAr: 'بعد العدد الأكبر من واحد يأتي الاسم المعدود بصيغة الجمع.' },
      ],
      academic_focus: [
        { term: 'number', meaningAr: 'رقم', example: { en: 'Read the number.', ar: 'اقرأ الرقم.' } },
        { term: 'count', meaningAr: 'عُدّ', example: { en: 'Count from one to ten.', ar: 'عُدّ من واحد إلى عشرة.' } },
      ],
    },
    {
      id: 'a0-days',
      stageIds: ['time'],
      title: 'أيام الأسبوع',
      grammar: [{ title: 'أسماء الأيام', explain: 'تبدأ أسماء أيام الأسبوع بحرف كبير، ونستخدم on قبل اليوم عند تحديد موعد.', examples: [{ en: 'I study on Monday.', ar: 'أدرس يوم الاثنين.' }] }],
      vocabulary: [{ en: 'Monday', ar: 'الاثنين', example: { en: 'Today is Monday.', ar: 'اليوم الاثنين.' } }],
      phonetics: [{ en: 'Monday', ipa: '/ˈmʌndeɪ/', ar: 'الاثنين', intonation: [{ en: 'See you on Monday.', ar: 'نبرة هابطة في نهاية الجملة.' }] }],
      arabic_l1_transfers: [{ incorrect: 'in Monday', corrected: 'on Monday', explanationAr: 'يُستخدم on مع أيام الأسبوع.' }],
      academic_focus: [{ term: 'day', meaningAr: 'يوم', example: { en: 'Write the day.', ar: 'اكتب اليوم.' } }],
    },
    {
      id: 'a0-pronouns',
      stageIds: ['pronouns'],
      title: 'الضمائر الأساسية',
      grammar: [{ title: 'ضمير الفاعل', explain: 'يأتي ضمير الفاعل قبل الفعل أو الوصف في الجملة الإنجليزية.', examples: [{ en: 'I am a student.', ar: 'أنا طالب.' }] }],
      vocabulary: [{ en: 'I', ar: 'أنا', example: { en: 'I am here.', ar: 'أنا هنا.' } }],
      phonetics: [{ en: 'I', ipa: '/aɪ/', ar: 'أنا', contrastPairs: [{ en: 'I / eye', ar: 'الكلمتان لهما النطق نفسه في الإنجليزية.' }] }],
      arabic_l1_transfers: [{ incorrect: 'Am a student.', corrected: 'I am a student.', explanationAr: 'يجب ذكر ضمير الفاعل في الجملة الإنجليزية.' }],
      academic_focus: [{ term: 'pronoun', meaningAr: 'ضمير', example: { en: 'I is a pronoun.', ar: 'كلمة I ضمير.' } }],
    },
    {
      id: 'a0-greetings',
      stageIds: ['sentences'],
      title: 'التحيات والتعارف البسيط',
      grammar: [{ title: 'تحية وجواب قصير', explain: 'ابدأ بتحية قصيرة، ثم اسأل عن الحال أو قل اسمك.', examples: [{ en: 'Hello. How are you? I am fine, thank you.', ar: 'مرحباً. كيف حالك؟ أنا بخير، شكراً.' }] }],
      vocabulary: [
        { en: 'hello', ar: 'مرحباً', example: { en: 'Hello, Sara.', ar: 'مرحباً يا سارة.' } },
        { en: 'goodbye', ar: 'إلى اللقاء', example: { en: 'Goodbye, Ali.', ar: 'إلى اللقاء يا علي.' } },
        { en: 'thank you', ar: 'شكراً لك', example: { en: 'Thank you.', ar: 'شكراً لك.' } },
        { en: 'name', ar: 'اسم', example: { en: 'My name is Ali.', ar: 'اسمي علي.' } },
      ],
      phonetics: [
        { en: 'hello', ipa: '/həˈləʊ/', ar: 'مرحباً', intonation: [{ en: 'Hello!', ar: 'نبرة ودية واضحة، من دون مبالغة.' }] },
        { en: 'How are you?', ipa: '/ˌhaʊ ɑː juː/', ar: 'كيف حالك؟', connectedSpeech: [{ en: 'How are you?', ar: 'قد تضعف are في الكلام الطبيعي مع بقاء السؤال واضحاً.' }] },
      ],
      arabic_l1_transfers: [
        { incorrect: 'My name, it is Ali.', corrected: 'My name is Ali.', explanationAr: 'في الإنجليزية المحايدة لا نكرر الاسم بضمير منفصل في الجملة نفسها.' },
      ],
      academic_focus: [
        { term: 'say', meaningAr: 'قُل', example: { en: 'Say your name.', ar: 'قل اسمك.' } },
        { term: 'listen', meaningAr: 'استمع', example: { en: 'Listen and repeat.', ar: 'استمع وكرّر.' } },
      ],
    },
  ],
};

export const ZERO_STAGES = [
  { id: 'letters', n: 1, icon: '🔤', titleAr: 'الأبجدية', subAr: 'الحروف الإنجليزية الستة والعشرون', kind: 'letters', minutes: 20, coreUnitId: 'a0-alphabet' },
  { id: 'numbers', n: 2, icon: '🔢', titleAr: 'الأرقام الأساسية', subAr: 'الأعداد من صفر إلى عشرين', kind: 'numbers', minutes: 12, coreUnitId: 'a0-numbers' },
  { id: 'time', n: 3, icon: '📅', titleAr: 'أيام الأسبوع', subAr: 'أسماء الأيام السبعة', kind: 'time', minutes: 10, coreUnitId: 'a0-days' },
  { id: 'pronouns', n: 4, icon: '🙋', titleAr: 'الضمائر الأساسية', subAr: 'I · you · he · she · it · we · they', kind: 'pronouns', minutes: 12, coreUnitId: 'a0-pronouns' },
  { id: 'sentences', n: 5, icon: '💬', titleAr: 'التحيات البسيطة', subAr: 'تحيات وعبارات تعارف قصيرة', kind: 'sentences', minutes: 12, coreUnitId: 'a0-greetings' },
];

export function zeroStage(id) {
  return ZERO_STAGES.find((s) => s.id === id) || ZERO_STAGES[0];
}

/* ---------- عناصر كل مرحلة (للبطاقات وللتدريبات) ---------- */
export function zeroItems(stageId) {
  switch (stageId) {
    case 'letters':
      return LETTERS.map((l) => ({
        key: `letter:${l.id}`, en: `${l.upper} ${l.lower}`, say: l.upper,
        nameId: `letter:${l.id}`, wordId: `letter:${l.id}`, ar: l.nameAr, pron: l.nameAr,
        emoji: l.emoji, word: l.word, wordAr: l.wordAr, wordPronAr: l.wordPronAr, soundAr: l.soundAr, tipAr: l.tipAr,
      }));
    case 'digraphs':
      return DIGRAPHS.map((d) => ({
        key: `digraph:${d.id}`, en: d.combo, say: d.combo, sayId: d.id, wordId: d.id,
        ar: d.soundAr, pron: d.soundAr,
        emoji: d.emoji, word: d.word, wordAr: d.wordAr, wordPronAr: d.wordPronAr, soundAr: d.soundAr, tipAr: d.tipAr,
      }));
    case 'numbers':
      return [
        ...A0_NUMBERS.map((x) => ({ key: `num:${x.n}`, en: x.en, ar: x.ar, pron: x.pron, emoji: '🔢' })),
      ];
    case 'time':
      return [
        ...DAYS.map((x) => ({ key: `day:${x.en}`, en: x.en, ar: x.ar, pron: x.pron, emoji: x.emoji })),
      ];
    case 'pronouns':
      return [
        /* ملاحظة: كلمة You تتكرّر (مفرد وجمع)، لذلك يُضاف رقم العنصر إلى المفتاح
           حتى لا يتشارك العنصران معرّفاً واحداً في سجل الإتقان. */
        ...PRONOUNS.map((x, i) => ({ key: `pron:${x.en}:${i}`, en: x.en, ar: x.ar, pron: x.pron, emoji: x.emoji, extra: x.example, extraAr: x.exampleAr })),
      ];
    case 'words':
      return [];
    case 'sentences':
      return A0_SENTENCES.map((s) => ({ key: `sent:${s.en}`, en: s.en, ar: s.ar, pron: s.pron, emoji: '💬', group: s.group }));
    case 'reading':
      return [];
    default:
      return [];
  }
}

export function zeroStageSize(stageId) { return zeroItems(stageId).length; }

export const ZERO_TOTALS = {
  stages: ZERO_STAGES.length,
  letters: LETTERS.length,
  digraphs: 0,
  numbers: A0_NUMBERS.length,
  ordinals: 0,
  words: 0,
  days: DAYS.length,
  pronouns: PRONOUNS.length,
  sentences: A0_SENTENCES.length,
  readings: 0,
  items: ZERO_STAGES.reduce((n, s) => n + zeroStageSize(s.id), 0),
};

/* ---------- توليد الأسئلة ---------- */
function pickWrongs(pool, excludeEn, field, n = 3) {
  const out = [];
  const used = new Set([String(excludeEn).toLowerCase()]);
  const src = pool.slice();
  for (let i = src.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [src[i], src[j]] = [src[j], src[i]]; }
  for (const it of src) {
    const v = String(it[field] ?? '').trim();
    if (!v || used.has(v.toLowerCase())) continue;
    used.add(v.toLowerCase());
    out.push(v);
    if (out.length >= n) break;
  }
  return out;
}

function choiceQ({ instruction, main, answer, wrongs, speak, explain, key, stageId, stageTitle }) {
  const options = [{ label: answer, correct: true, ltr: /[A-Za-z]/.test(answer) }, ...wrongs.map((w) => ({ label: w, correct: false, ltr: /[A-Za-z]/.test(w) }))];
  return {
    id: `zq-${key}`, type: 'mcq', ui: 'choice', itemId: `zero:${key}`,
    level: 'a0', topic: stageId, topicTitle: stageTitle,
    instruction,
    stemHtml: `<div class="q-main ${/[A-Za-z]/.test(main) ? '' : 'q-main--ar'}">${esc(main)}</div>`,
    speakText: /[A-Za-z]/.test(speak || main) ? (speak || main) : '',
    options,
    answerText: answer,
    explain,
  };
}

/** أسئلة مرحلة واحدة — تُستخدم في تدريب المرحلة (٥ أسئلة) */
export function zeroStageQuestions(stageId, count = 5) {
  const stage = zeroStage(stageId);
  const items = zeroItems(stageId);
  if (!items.length) return [];
  const qs = [];

  if (stageId === 'letters' || stageId === 'digraphs') {
    for (const l of items) {
      qs.push(choiceQ({
        instruction: 'ما اسم هذا الحرف كما يُنطق؟', main: l.en, answer: l.ar,
        wrongs: pickWrongs(items, l.ar, 'ar'), key: `name:${l.key}`, stageId, stageTitle: stage.titleAr,
        speak: l.nameId ? `name:${l.nameId}` : (l.say || l.en), explain: `${l.en} = ${l.ar} · صوتها: ${l.soundAr || ''}`,
      }));
      qs.push(choiceQ({
        instruction: 'أي كلمة تبدأ بهذا الحرف؟', main: l.en, answer: l.word,
        wrongs: pickWrongs(items, l.word, 'word'), key: `word:${l.key}`, stageId, stageTitle: stage.titleAr,
        speak: l.wordId ? `word:${l.wordId}` : l.word, explain: `${l.word} = ${l.wordAr} (${l.wordPronAr || ''})`,
      }));
    }
  } else if (stageId === 'pronouns') {
    for (const [pi, p] of PRONOUNS.entries()) {
      qs.push(choiceQ({
        instruction: 'ما معنى هذا الضمير؟', main: p.en, answer: p.ar,
        wrongs: pickWrongs(PRONOUNS, p.ar, 'ar'), key: `pron:${p.en}:${pi}`, stageId, stageTitle: stage.titleAr,
        speak: p.en, explain: `${p.en} = ${p.ar} · مثال: ${p.example} (${p.exampleAr})`,
      }));
    }
  } else if (stageId === 'reading') {
    for (const r of READINGS) {
      for (const q of r.questions) {
        const correct = q.options[q.answer];
        qs.push(choiceQ({
          instruction: `فهم المقروء — ${r.titleAr}`, main: q.q, answer: correct,
          wrongs: q.options.filter((o) => o !== correct), key: `read:${r.id}:${q.q}`.slice(0, 60),
          stageId, stageTitle: stage.titleAr, explain: `النص: ${r.titleEn}`,
        }));
      }
    }
  } else {
    for (const it of items) {
      qs.push(choiceQ({
        instruction: 'ما معنى هذه الكلمة؟', main: it.en, answer: it.ar,
        wrongs: pickWrongs(items, it.ar, 'ar'), key: `ar:${it.key}`, stageId, stageTitle: stage.titleAr,
        speak: it.en, explain: `${it.en} = ${it.ar} (${it.pron})`,
      }));
      qs.push(choiceQ({
        instruction: 'ما الكلمة الإنجليزية لهذا المعنى؟', main: it.ar, answer: it.en,
        wrongs: pickWrongs(items, it.en, 'en'), key: `en:${it.key}`, stageId, stageTitle: stage.titleAr,
        explain: `${it.en} = ${it.ar} (${it.pron})`,
      }));
    }
  }

  // خلط ثم اختيار العدد المطلوب
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  const out = [];
  const seen = new Set();
  for (const q of qs) { if (seen.has(q.id)) continue; seen.add(q.id); out.push(q); if (out.length >= count) break; }
  return out;
}

/** أسئلة الاختبار النهائي — موزّعة على كل المراحل */
export function zeroExamQuestions(count = 30) {
  const per = Math.max(1, Math.ceil(count / ZERO_STAGES.length));
  let all = [];
  for (const s of ZERO_STAGES) all = all.concat(zeroStageQuestions(s.id, per * 3).slice(0, per + 2));
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  const out = [];
  const seen = new Set();
  for (const q of all) { if (seen.has(q.id)) continue; seen.add(q.id); out.push(q); if (out.length >= count) break; }
  return out;
}

/* ---------- التقدّم والإتقان ---------- */
export function zeroStats(progress) {
  const z = progress?.zero || {};
  const stages = z.stages || {};
  const doneStages = ZERO_STAGES.filter((s) => stages[s.id]?.done).length;
  const letters = z.letters || {};
  const lettersMastered = LETTERS.filter((l) => letters[l.id]).length;
  const wordsLearned = 0;
  const examBest = z.exam?.best || 0;
  const visits = ZERO_STAGES.reduce((n, s) => n + (stages[s.id]?.seen ? 1 : 0), 0);

  // نسبة الإتقان: 45% مراحل + 25% حروف + 30% اختبار نهائي.
  const stagesPart = (doneStages / ZERO_STAGES.length) * 45;
  const lettersPart = (lettersMastered / Math.max(1, LETTERS.length)) * 25;
  const examPart = (Math.min(100, examBest) / 100) * 30;
  const percent = Math.round(stagesPart + lettersPart + examPart);

  return {
    doneStages, visits, lettersMastered, wordsLearned, examBest,
    percent: Math.max(0, Math.min(100, percent)),
    readyForA1: doneStages === ZERO_STAGES.length && lettersMastered === LETTERS.length && examBest >= 90,
    remaining: {
      stages: ZERO_STAGES.length - doneStages,
      letters: LETTERS.length - lettersMastered,
      exam: Math.max(0, 90 - examBest),
    },
  };
}

export function zeroAdvice(st) {
  if (st.readyForA1) return { tone: 'ok', text: 'أتقنتَ التأسيس بالكامل — انتقل إلى المستوى A1 بثقة 🎉' };
  if (st.percent === 0) return { tone: 'brand', text: 'ابدأ بالمرحلة الأولى: الحروف وأصواتها — 20 دقيقة فقط.' };
  const parts = [];
  if (st.remaining.stages) parts.push(`${st.remaining.stages} مرحلة`);
  if (st.remaining.letters) parts.push(`${st.remaining.letters} حرفاً لم تُتقنه بعد`);
  if (st.remaining.exam) parts.push(`الاختبار النهائي (تحتاج ${st.remaining.exam}% إضافية على الأقل)`);
  return { tone: 'brand', text: `ننصح بإكمال: ${parts.join(' · ')} قبل الانتقال إلى A1.` };
}
