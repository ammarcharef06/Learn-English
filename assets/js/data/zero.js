/* ============================================================
   قسم «من الصفر» (A0) — تجميع المحتوى + بناء الأسئلة
   ============================================================ */
import { esc } from '../core/utils.js';
import { LETTERS, DIGRAPHS, NUMBERS, ORDINALS } from './zero-letters.js';
import { DAYS, MONTHS, SEASONS, TIME_WORDS, PRONOUNS, TO_BE, NUMBERS_TIME } from './zero-time.js';
import { WORD_GROUPS, SENTENCES, READINGS } from './zero-words.js';

export { LETTERS, DIGRAPHS, NUMBERS, ORDINALS, DAYS, MONTHS, SEASONS, TIME_WORDS, PRONOUNS, TO_BE, NUMBERS_TIME, WORD_GROUPS, SENTENCES, READINGS };

export const ZERO_STAGES = [
  { id: 'letters', n: 1, icon: '🔤', titleAr: 'الحروف وأصواتها', subAr: '٢٦ حرفاً · اسمها · صوتها · كلمة عليها', kind: 'letters', minutes: 20 },
  { id: 'digraphs', n: 2, icon: '🔡', titleAr: 'الحروف المركّبة', subAr: 'sh · ch · th · ph · ee · oo وغيرها', kind: 'digraphs', minutes: 12 },
  { id: 'numbers', n: 3, icon: '🔢', titleAr: 'الأرقام', subAr: 'من ٠ إلى ١٠٠ والأرقام الترتيبية', kind: 'numbers', minutes: 12 },
  { id: 'time', n: 4, icon: '📅', titleAr: 'الأيام والشهور والوقت', subAr: 'الأسبوع · السنة · الفصول · الساعة', kind: 'time', minutes: 15 },
  { id: 'pronouns', n: 5, icon: '🙋', titleAr: 'الضمائر و to be', subAr: 'I am · you are · he is', kind: 'pronouns', minutes: 12 },
  { id: 'words', n: 6, icon: '🧺', titleAr: 'أول ١٢٠ كلمة', subAr: '٨ مجموعات · ١٥ كلمة في كل مجموعة', kind: 'words', minutes: 25 },
  { id: 'sentences', n: 7, icon: '💬', titleAr: 'أول الجمل والأسئلة', subAr: '٤٠ جملة للتحيات والتعريف', kind: 'sentences', minutes: 18 },
  { id: 'reading', n: 8, icon: '📖', titleAr: 'قراءة وكتابة أولى', subAr: '٤ نصوص قصيرة جداً', kind: 'reading', minutes: 20 },
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
        ar: l.nameAr, pron: l.nameAr,
        emoji: l.emoji, word: l.word, wordAr: l.wordAr, wordPronAr: l.wordPronAr, soundAr: l.soundAr, tipAr: l.tipAr,
      }));
    case 'digraphs':
      return DIGRAPHS.map((d) => ({
        key: `digraph:${d.id}`, en: d.combo, say: d.combo, sayId: d.id,
        ar: d.soundAr, pron: d.soundAr,
        emoji: d.emoji, word: d.word, wordAr: d.wordAr, wordPronAr: d.wordPronAr, soundAr: d.soundAr, tipAr: d.tipAr,
      }));
    case 'numbers':
      return [
        ...NUMBERS.map((x) => ({ key: `num:${x.n}`, en: x.en, ar: x.ar, pron: x.pron, emoji: '🔢' })),
        ...ORDINALS.map((x) => ({ key: `ord:${x.n}`, en: x.en, ar: x.ar, pron: x.pron, emoji: '🥇' })),
      ];
    case 'time':
      return [
        ...DAYS.map((x) => ({ key: `day:${x.en}`, en: x.en, ar: x.ar, pron: x.pron, emoji: x.emoji })),
        ...MONTHS.map((x) => ({ key: `month:${x.en}`, en: x.en, ar: x.ar, pron: x.pron, emoji: '📆' })),
        ...SEASONS.map((x) => ({ key: `season:${x.id}`, en: x.en, ar: x.ar, pron: x.pron, emoji: x.emoji })),
        ...TIME_WORDS.map((x) => ({ key: `time:${x.en}`, en: x.en, ar: x.ar, pron: x.pron, emoji: x.emoji })),
        ...NUMBERS_TIME.map((x) => ({ key: `clock:${x.en}`, en: x.en, ar: x.ar, pron: x.pron, emoji: '🕒' })),
      ];
    case 'pronouns':
      return [
        /* ملاحظة: كلمة You تتكرّر (مفرد وجمع)، لذلك يُضاف رقم العنصر إلى المفتاح
           حتى لا يتشارك العنصران معرّفاً واحداً في سجل الإتقان. */
        ...PRONOUNS.map((x, i) => ({ key: `pron:${x.en}:${i}`, en: x.en, ar: x.ar, pron: x.pron, emoji: x.emoji, extra: x.example, extraAr: x.exampleAr })),
        ...TO_BE.flatMap((b) => b.examples.map((e, i) => ({ key: `tobe:${b.verb}:${i}`, en: e.en, ar: e.ar, pron: e.pron, emoji: '🧩' }))),
      ];
    case 'words':
      return WORD_GROUPS.flatMap((g) => g.words.map((w) => ({
        key: `word:${w.en}`, en: w.en, ar: w.ar, pron: w.pron, emoji: w.emoji, group: g.id, groupAr: g.titleAr,
      })));
    case 'sentences':
      return SENTENCES.map((s) => ({ key: `sent:${s.en}`, en: s.en, ar: s.ar, pron: s.pron, emoji: '💬', group: s.group }));
    case 'reading':
      return READINGS.flatMap((r) => r.lines.map((l, i) => ({ key: `read:${r.id}:${i}`, en: l.en, ar: l.ar, pron: l.pron, emoji: r.emoji, group: r.id })));
    default:
      return [];
  }
}

export function zeroStageSize(stageId) { return zeroItems(stageId).length; }

export const ZERO_TOTALS = {
  stages: ZERO_STAGES.length,
  letters: LETTERS.length,
  digraphs: DIGRAPHS.length,
  numbers: NUMBERS.length,
  ordinals: ORDINALS.length,
  words: WORD_GROUPS.reduce((n, g) => n + g.words.length, 0),
  sentences: SENTENCES.length,
  readings: READINGS.length,
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
        speak: l.sayId ? `sound:${l.sayId}` : (l.say || l.en), explain: `${l.en} = ${l.ar} · صوتها: ${l.soundAr || ''}`,
      }));
      qs.push(choiceQ({
        instruction: 'أي كلمة تبدأ بهذا الحرف؟', main: l.en, answer: l.word,
        wrongs: pickWrongs(items, l.word, 'word'), key: `word:${l.key}`, stageId, stageTitle: stage.titleAr,
        speak: l.sayId ? `sound:${l.sayId}` : l.word, explain: `${l.word} = ${l.wordAr} (${l.wordPronAr || ''})`,
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
    for (const b of TO_BE) {
      for (const ex of b.examples) {
        const blanked = ex.en.replace(/\b(am|is|are)\b/, '____');
        qs.push(choiceQ({
          instruction: 'اختر الفعل الصحيح للفراغ', main: blanked, answer: b.verb,
          wrongs: TO_BE.map((x) => x.verb).filter((v) => v !== b.verb),
          key: `tobe:${ex.en}`, stageId, stageTitle: stage.titleAr,
          explain: `${ex.en} = ${ex.ar} — ${b.ruleAr}`,
        }));
      }
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
  const words = z.words || {};
  const wordsLearned = WORD_GROUPS.reduce((n, g) => n + g.words.filter((w) => words[w.en]).length, 0);
  const examBest = z.exam?.best || 0;
  const visits = ZERO_STAGES.reduce((n, s) => n + (stages[s.id]?.seen ? 1 : 0), 0);

  // نسبة الإتقان: 40% مراحل + 25% حروف + 20% كلمات + 15% اختبار نهائي
  const stagesPart = (doneStages / ZERO_STAGES.length) * 40;
  const lettersPart = (lettersMastered / Math.max(1, LETTERS.length)) * 25;
  const wordsPart = (wordsLearned / Math.max(1, ZERO_TOTALS.words)) * 20;
  const examPart = (Math.min(100, examBest) / 100) * 15;
  const percent = Math.round(stagesPart + lettersPart + wordsPart + examPart);

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
