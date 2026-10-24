/* ============================================================
   مولّد الأسئلة الذكي: يبني ثمانية أنواع من التمارين
   من نفس بيانات المنهج والمراجع، مع تكييف حسب الأخطاء السابقة.
   ============================================================ */
import { PRONOUN_GROUPS, PRONOUN_TABLE, CONNECTORS, QUESTION_WORDS, KEY_EXAMPLES } from '../data/reference.js';
import { ALL_UNITS, LEVELS, READINGS } from '../data/curriculum.js';
import { shuffle, sample, uid, pick } from './utils.js';
import { weakestFirst } from './srs.js';
import { progress } from './store.js';

/* ---------------- بناء العناصر (Entries) ---------------- */

export function vocabularyEntries({ levels = null } = {}) {
  const out = [];
  for (const u of ALL_UNITS) {
    if (levels && !levels.includes(u.levelId)) continue;
    for (const v of u.vocabulary) {
      out.push({
        itemId: `v:${u.id}:${v.en.toLowerCase()}`,
        en: v.en, ar: v.ar, ex: v.example || null, emoji: v.emoji || '', pos: v.pos || '',
        level: u.levelId, topic: u.id, topicTitle: u.title, kind: 'word', unitId: u.id,
      });
    }
  }
  return out;
}

export function reviewEntriesForUnit(unit) {
  const out = [];
  const fields = [
    { field: 'phonetics', prefix: 'ph', kind: 'phonetics' },
    { field: 'arabic_l1_transfers', prefix: 'l1', kind: 'l1-transfer' },
    { field: 'academic_focus', prefix: 'af', kind: 'academic' },
  ];

  (unit.grammar || []).forEach((lesson, index) => {
    const examples = (lesson.examples || []).map((example) => `${example.en} — ${example.ar}`).join('\n');
    const explanation = String(lesson.explain || lesson.title || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    out.push({
      itemId: `gr:${unit.id}:${lesson.id || index}`,
      en: lesson.examples?.[0]?.en || lesson.title,
      ar: explanation,
      ex: null,
      note: [lesson.title, examples].filter(Boolean).join('\n'),
      level: unit.levelId,
      topic: unit.id,
      topicTitle: unit.title,
      kind: 'grammar',
      unitId: unit.id,
    });
  });

  for (const { field, prefix, kind } of fields) {
    (unit[field] || []).forEach((item, index) => {
      const id = String(item.id || index);
      const addReviewEntry = (record, entryId, entryKind, note = '') => {
        const en = record.en || record.term || record.word || record.incorrect
          || record.pattern || record.original || record.source || record.phrase;
        const ar = record.ar || record.meaningAr || record.definitionAr || record.corrected
          || record.ipa || record.explanationAr || record.paraphrase || record.rephrased;
        if (!en || !ar) return;
        out.push({
          itemId: `${prefix}:${unit.id}:${entryId}`,
          en,
          ar,
          ex: record.example || null,
          note: record.ipa || record.pattern || record.explanationAr || record.note || note,
          level: unit.levelId,
          topic: unit.id,
          topicTitle: unit.title,
          kind: entryKind,
          unitId: unit.id,
        });
      };
      addReviewEntry(item, id, kind);
      const nestedFields = field === 'phonetics'
        ? ['contrastPairs', 'connectedSpeech', 'intonation']
        : field === 'academic_focus' ? ['paraphrasing', 'idioms', 'readingAnalysis']
          : field === 'arabic_l1_transfers' ? ['practice'] : [];
      for (const nestedField of nestedFields) {
        (item[nestedField] || []).forEach((record, nestedIndex) => {
          if (typeof record === 'string') return;
          addReviewEntry(record, `${id}:${nestedField}:${record.id || nestedIndex}`, `${kind}:${nestedField}`);
        });
      }
    });
  }
  (unit.vocabulary || []).forEach((item, index) => {
    for (const [field, kind, prefix] of [
      ['collocations', 'collocation', 'col'],
      ['phrasalVerbs', 'phrasal-verb', 'pv'],
    ]) {
      (item[field] || []).forEach((phrase, phraseIndex) => {
        const en = phrase.en || phrase.term || phrase.phrase;
        const ar = phrase.ar || phrase.meaningAr;
        if (!en || !ar) return;
        out.push({
          itemId: `${prefix}:${unit.id}:${item.id || index}:${phrase.id || phraseIndex}`,
          en,
          ar,
          ex: phrase.example || null,
          note: phrase.note || '',
          level: unit.levelId,
          topic: unit.id,
          topicTitle: unit.title,
          kind,
          unitId: unit.id,
        });
      });
    }
  });
  return out;
}

export function curriculumReviewEntries({ levels = null } = {}) {
  return ALL_UNITS
    .filter((unit) => !levels || levels.includes(unit.levelId))
    .flatMap(reviewEntriesForUnit);
}

export function sentenceEntries({ levels = null } = {}) {
  const out = [];
  for (const u of ALL_UNITS) {
    if (levels && !levels.includes(u.levelId)) continue;
    (u.sentences || []).forEach((s, i) => out.push({
      itemId: `s:${u.id}:${i}`,
      en: s.en, ar: s.ar, ex: s,
      level: u.levelId, topic: u.id, topicTitle: u.title, kind: 'sentence', unitId: u.id,
    }));
    (u.grammar || []).forEach((gr, gi) => (gr.examples || []).forEach((e, ei) => out.push({
      itemId: `g:${u.id}:${gi}:${ei}`,
      en: e.en, ar: e.ar, ex: e,
      level: u.levelId, topic: u.id, topicTitle: u.title, kind: 'sentence', unitId: u.id,
    })));
  }
  return out;
}

export function pronounEntries(groupIds = null) {
  const out = [];
  for (const g of PRONOUN_GROUPS) {
    if (groupIds && !groupIds.includes(g.id)) continue;
    g.items.forEach((it, i) => out.push({
      itemId: `p:${g.id}:${String(it.en).toLowerCase().replace(/\s+/g, '_')}:${i}`,
      en: it.en, ar: it.ar, ex: it.ex, note: it.note,
      level: 'ref', topic: g.id, topicTitle: g.title, kind: 'pronoun', emoji: g.icon,
    }));
  }
  return out;
}

export function connectorEntries() {
  return CONNECTORS.map((it, i) => ({
    itemId: `c:${i}:${String(it.en).toLowerCase().replace(/\s+/g, '_')}`,
    en: it.en, ar: it.ar, ex: it.ex, kind: 'connector',
    level: 'ref', topic: 'connectors', topicTitle: 'أدوات الربط', emoji: '🔗',
  }));
}

export function questionEntries() {
  return QUESTION_WORDS.map((it, i) => ({
    itemId: `q:${i}:${String(it.en).toLowerCase().replace(/\s+/g, '_')}`,
    en: it.en, ar: it.ar, ex: it.ex, kind: 'qword',
    level: 'ref', topic: 'questions', topicTitle: 'أدوات السؤال', emoji: '❓',
  }));
}

export function readingWordEntries({ levels = null } = {}) {
  const out = [];
  for (const r of READINGS) {
    if (levels && !levels.includes(r.level)) continue;
    (r.words || []).forEach((w, i) => out.push({
      itemId: `rw:${r.id}:${i}`,
      en: w.en, ar: w.ar, ex: null, kind: 'word',
      level: r.level, topic: r.id, topicTitle: r.titleAr, emoji: r.emoji || '📖',
    }));
  }
  return out;
}

export function notebookEntries() {
  return (progress.notebook || []).map((n, i) => ({
    itemId: `nb:${String(n.en).toLowerCase().replace(/\s+/g, '_')}`,
    en: n.en, ar: n.ar, ex: null, kind: 'word',
    level: 'ref', topic: 'notebook', topicTitle: 'دفتر كلماتي', emoji: '📒',
  }));
}

export function keyExampleEntries() {
  return KEY_EXAMPLES.map((k, i) => ({
    itemId: `k:${i}`, en: k.en, ar: k.ar, ex: null, kind: 'sentence',
    level: 'ref', topic: 'key-examples', topicTitle: 'أمثلة للحفظ', emoji: '⭐', note: k.note || '',
  }));
}

/* ---------------- اختيار المصدر ---------------- */

const levelIds = LEVELS.map((l) => l.id);

export function entriesForSource(source = 'all') {
  if (source && source.startsWith('level:')) {
    const lv = source.slice(6);
    return [...vocabularyEntries({ levels: [lv] }), ...sentenceEntries({ levels: [lv] })];
  }
  if (source && source.startsWith('unit:')) {
    const unitId = source.slice(5);
    const u = ALL_UNITS.find((x) => x.id === unitId);
    const vocab = vocabularyEntries().filter((e) => e.unitId === unitId);
    const sentences = sentenceEntries().filter((e) => e.unitId === unitId);
    const reading = READINGS.filter((r) => r.level === (u ? u.levelId : 'a1')).flatMap((r) => (r.words || []).map((w, i) => ({
      itemId: `rw:${r.id}:${i}`, en: w.en, ar: w.ar, ex: null, kind: 'word', level: r.level, topic: r.id, topicTitle: r.titleAr, emoji: r.emoji,
    })));
    return [...vocab, ...sentences, ...reading];
  }
  switch (source) {
    case 'pronouns': return pronounEntries();
    case 'connectors': return connectorEntries();
    case 'questions': return questionEntries();
    case 'vocab': return vocabularyEntries();
    case 'sentences': return sentenceEntries();
    case 'reading': return readingWordEntries();
    case 'notebook': return notebookEntries();
    case 'key': return keyExampleEntries();
    case 'unit': return vocabularyEntries();
    case 'all':
    default:
      return [...vocabularyEntries(), ...sentenceEntries(), ...pronounEntries(), ...connectorEntries(), ...questionEntries(), ...readingWordEntries()];
  }
}

export const SOURCES = [
  { id: 'all', ar: 'الكل (منهج + مراجع)', en: 'Everything' },
  { id: 'pronouns', ar: 'الضمائر', en: 'Pronouns' },
  { id: 'connectors', ar: 'أدوات الربط', en: 'Connectors' },
  { id: 'questions', ar: 'أدوات السؤال', en: 'Question words' },
  { id: 'vocab', ar: 'مفردات المنهج', en: 'Curriculum vocabulary' },
  { id: 'sentences', ar: 'جمل المنهج', en: 'Curriculum sentences' },
  { id: 'reading', ar: 'كلمات المطالعات', en: 'Reading words' },
  { id: 'key', ar: 'أمثلة للحفظ', en: 'Key examples' },
  { id: 'level:a1', ar: 'مستوى A1', en: 'Level A1' },
  { id: 'level:a2', ar: 'مستوى A2', en: 'Level A2' },
  { id: 'level:b1', ar: 'مستوى B1', en: 'Level B1' },
];

/* ---------------- أدوات مساعدة ---------------- */

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function normAr(s) {
  return String(s)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
function normEn(s) {
  return String(s)
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
export function normArPublic(s) { return normAr(s); }
export function normEnPublic(s) { return normEn(s); }

function arVariants(ar) {
  const parts = String(ar).split(/\s*(?:\/|،|,|\bor\b)\s*/i).map((x) => x.trim()).filter(Boolean);
  const set = new Set([String(ar).trim(), ...parts]);
  for (const p of [...set]) {
    const clean = p.replace(/\(.*?\)/g, '').trim();
    if (clean) set.add(clean);
  }
  return [...set];
}

function distractors(entry, pool, n, field) {
  const target = normAr(entry[field]);
  const seen = new Set([target]);
  const spread = shuffle(pool.filter((p) => p !== entry && p.kind === entry.kind));
  const others = shuffle(pool.filter((p) => p !== entry && p.kind !== entry.kind));
  const out = [];
  for (const cand of [...spread, ...others]) {
    const label = String(cand[field] || '').trim();
    if (!label) continue;
    const key = normAr(label);
    if (seen.has(key)) continue;
    if (String(cand.en).toLowerCase() === String(entry.en).toLowerCase()) continue;
    if (label.length > String(entry[field]).length * 3 + 8) continue;
    seen.add(key);
    out.push(label);
    if (out.length >= n) break;
  }
  return out;
}

function optionSet(correct, wrongs) {
  const items = shuffle([{ label: correct, correct: true }, ...wrongs.map((w) => ({ label: w, correct: false }))]);
  return items;
}

function baseExplain(entry) {
  const ex = entry.ex ? ` — مثال: ${entry.ex.en}` : '';
  return `${entry.en} = ${entry.ar}${ex}`;
}

/* ---------------- المولّدات ---------------- */

export function qMeaningOut(entry, pool) {
  const wrongs = distractors(entry, pool, 3, 'ar');
  if (wrongs.length < 3) return null;
  return {
    id: uid('q'), type: 'mcq', ui: 'choice', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'ما معنى هذه الكلمة أو العبارة؟',
    stemHtml: `<div class="q-main">${escapeHtml(entry.en)}</div>`,
    speakText: entry.en,
    options: optionSet(entry.ar, wrongs),
    explain: baseExplain(entry),
    showExample: entry.ex ? entry.ex : null,
  };
}

export function qMeaningIn(entry, pool) {
  const wrongs = distractors(entry, pool, 3, 'en');
  if (wrongs.length < 3) return null;
  return {
    id: uid('q'), type: 'mcq', ui: 'choice', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'اختر المقابل الإنجليزي الصحيح',
    stemHtml: `<div class="q-main q-main--ar">${escapeHtml(entry.ar)}</div>`,
    speakText: null,
    options: optionSet(entry.en, wrongs).map((o) => ({ ...o, ltr: true })),
    explain: baseExplain(entry),
    showExample: entry.ex ? entry.ex : null,
  };
}

export function qFill(entry, pool) {
  const sentence = entry.ex && entry.ex.en ? entry.ex.en : null;
  if (!sentence) return null;
  const words = String(entry.en).split(/\s+/).filter(Boolean);
  const target = words.join(' ');
  const re = new RegExp(`\\b${escapeRe(target)}\\b`, 'i');
  if (!re.test(sentence)) return null;
  const blanked = sentence.replace(re, '_____');
  const wrongs = distractors(entry, pool, 3, 'en');
  if (wrongs.length < 3) return null;
  return {
    id: uid('q'), type: 'fill', ui: 'choice', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'أكمل الفراغ بالكلمة الصحيحة',
    stemHtml: `<div class="q-main">${escapeHtml(blanked)}</div>`,
    speakText: null,
    options: optionSet(target, wrongs).map((o) => ({ ...o, ltr: true })),
    explain: `الإجابة: ${target} = ${entry.ar}\n${entry.ex.en} — ${entry.ex.ar}`,
    showExample: entry.ex,
  };
}

export function qOrder(entry) {
  const sentence = entry.ex && entry.ex.en ? entry.ex.en : null;
  if (!sentence) return null;
  const tokens = String(sentence).replace(/[.!?]+$/, '').split(/\s+/).filter(Boolean);
  if (tokens.length < 4 || tokens.length > 14) return null;
  const shuffled = shuffle(tokens);
  if (shuffled.join(' ') === tokens.join(' ')) shuffled.reverse();
  return {
    id: uid('q'), type: 'order', ui: 'order', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'رتّب الكلمات لتكوين جملة صحيحة',
    stemHtml: `<div class="q-hint">${escapeHtml(entry.ar)}</div>`,
    speakText: sentence,
    tokens: shuffled,
    correctOrder: tokens,
    explain: `${tokens.join(' ')}. = ${entry.ar}`,
    showExample: entry.ex,
  };
}

export function qTranslateOut(entry) {
  if (!entry.ar || /\.\.\./.test(entry.en)) return null;
  return {
    id: uid('q'), type: 'translate', ui: 'input', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'اكتب معنى هذه الكلمة بالعربية',
    stemHtml: `<div class="q-main">${escapeHtml(entry.en)}</div>`,
    speakText: entry.en,
    inputDir: 'rtl',
    placeholder: 'اكتب الإجابة بالعربية…',
    accept: arVariants(entry.ar).map(normAr),
    answerText: entry.ar,
    explain: baseExplain(entry),
    showExample: entry.ex,
  };
}

export function qTranslateIn(entry) {
  if (!entry.en || /\.\.\./.test(entry.en)) return null;
  return {
    id: uid('q'), type: 'translate', ui: 'input', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'اكتب هذه الكلمة بالإنجليزية',
    stemHtml: `<div class="q-main q-main--ar">${escapeHtml(entry.ar)}</div>`,
    speakText: null,
    inputDir: 'ltr',
    placeholder: 'Type your answer in English…',
    accept: [normEn(entry.en)],
    answerText: entry.en,
    explain: baseExplain(entry),
    showExample: entry.ex,
  };
}

export function qListen(entry, pool) {
  const answer = entry.ex && entry.ex.en && entry.ex.en.split(/\s+/).length <= 9 ? entry.ex.en : entry.en;
  const wrongs = distractors(entry, pool, 3, 'en');
  if (wrongs.length < 3) return null;
  return {
    id: uid('q'), type: 'listen', ui: 'choice', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'اسمع ثم اختر ما سمعته',
    stemHtml: `<div class="q-main"><button class="btn btn--primary btn--lg" type="button" data-replay>🔊 اسمع مرة أخرى</button></div>`,
    speakText: answer,
    autoSpeak: true,
    options: optionSet(answer, wrongs).map((o) => ({ ...o, ltr: true })),
    explain: `ما سمعته: ${answer}\n${entry.ex ? entry.ex.ar : ''}`,
    showExample: entry.ex,
  };
}

export function qListenType(entry) {
  const answer = entry.ex && entry.ex.en && entry.ex.en.split(/\s+/).length <= 8 ? entry.ex.en : entry.en;
  return {
    id: uid('q'), type: 'listen', ui: 'input', itemId: entry.itemId,
    level: entry.level, topic: entry.topic, topicTitle: entry.topicTitle,
    instruction: 'اسمع واكتب ما سمعته',
    stemHtml: `<div class="q-main"><button class="btn btn--primary btn--lg" type="button" data-replay>🔊 اسمع مرة أخرى</button></div>`,
    speakText: answer,
    autoSpeak: true,
    inputDir: 'ltr',
    placeholder: 'Type what you hear…',
    accept: [normEn(answer)],
    answerText: answer,
    explain: `الصيغة الصحيحة: ${answer}`,
    showExample: entry.ex,
  };
}

export function qRelation(row, from, to, pool) {
  const correct = row[to];
  if (!correct || correct === '—') return null;
  const wrongs = pool.filter((r) => r !== row && r[to] && r[to] !== '—' && r[to] !== correct).map((r) => r[to]);
  const uniqueWrongs = [...new Set(wrongs)];
  if (uniqueWrongs.length < 3) return null;
  const fieldNames = {
    subject: 'ضمير الفاعل', object: 'ضمير المفعول', det: 'صفة الملكية',
    poss: 'ضمير الملكية', refl: 'الضمير الانعكاسي',
  };
  return {
    id: uid('q'), type: 'mcq', ui: 'choice', itemId: `rel:${row.subject}:${to}`,
    level: 'ref', topic: 'pronouns-table', topicTitle: 'جدول الضمائر',
    instruction: `ما ${fieldNames[to]} المقابل لـ «${row.person}»؟`,
    stemHtml: `<div class="q-main">${escapeHtml(row[from])}</div>`,
    speakText: row[from],
    options: optionSet(correct, sample(uniqueWrongs, 3)).map((o) => ({ ...o, ltr: true })),
    explain: `${row.person}: ${fieldNames[to]} = ${correct}`,
    showExample: null,
  };
}

export function qMatch(entries, size = 4) {
  const picked = shuffle(entries).slice(0, size);
  if (picked.length < 3) return null;
  return {
    id: uid('q'), type: 'match', ui: 'match', itemId: picked[0].itemId,
    level: picked[0].level, topic: picked[0].topic, topicTitle: picked[0].topicTitle,
    instruction: 'طابق كل كلمة إنجليزية مع معناها العربي',
    stemHtml: '',
    speakText: null,
    pairs: picked.map((e) => ({ en: e.en, ar: e.ar, itemId: e.itemId })),
    explain: picked.map((e) => `${e.en} = ${e.ar}`).join(' · '),
    showExample: null,
  };
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---------------- الموزّع الرئيسي ---------------- */

export const TYPE_LABELS = {
  mcq: 'اختيار من متعدد', fill: 'ملء الفراغ', order: 'ترتيب الكلمات',
  match: 'توصيل ومطابقة', translate: 'ترجمة', listen: 'استماع',
};

const ORDER_TYPES = ['mcq', 'fill', 'order', 'match', 'translate', 'listen'];

export function buildQuestions({ source = 'all', types = ['mcq'], count = 10, adaptive = false, mode = 'mixed', matchSize = 4 } = {}) {
  let entries = entriesForSource(source);
  if (!entries.length) return [];
  let pool = entries;
  if (adaptive) pool = weakestFirst(entries);

  let wanted = Array.isArray(types) && types.length ? types.filter((t) => ORDER_TYPES.includes(t)) : ['mcq'];
  if (mode === 'smart' || source === 'smart') {
    wanted = ['mcq', 'fill', 'translate', 'listen'];
  }
  if (mode === 'exam') {
    wanted = wanted.length ? wanted : ['mcq', 'fill', 'translate', 'order'];
  }
  if (!wanted.length) wanted = ['mcq'];

  const questions = [];
  const used = new Set();
  const maxRounds = Math.max(60, count * 6);
  let round = 0;
  let cursor = 0;

  const generatorFor = (type) => {
    switch (type) {
      case 'mcq': return (e) => (Math.random() < 0.5 ? (qMeaningOut(e, pool) || qMeaningIn(e, pool)) : (qMeaningIn(e, pool) || qMeaningOut(e, pool)));
      case 'fill': return (e) => qFill(e, pool);
      case 'order': return (e) => qOrder(e);
      case 'match': return null;
      case 'translate': return (e) => (Math.random() < 0.5 ? (qTranslateOut(e) || qTranslateIn(e)) : (qTranslateIn(e) || qTranslateOut(e)));
      case 'listen': return (e) => (Math.random() < 0.25 ? (qListenType(e) || qListen(e, pool)) : (qListen(e, pool) || qListenType(e)));
      default: return (e) => qMeaningOut(e, pool);
    }
  };

  while (questions.length < count && round < maxRounds) {
    round++;
    const type = wanted[questions.length % wanted.length];

    if (type === 'match') {
      const cands = pool.filter((e) => !used.has(e.itemId) && e.kind !== 'sentence');
      if (cands.length >= 3) {
        const q = qMatch(cands, Math.min(matchSize, cands.length));
        if (q) {
          q.pairs.forEach((p) => used.add(p.itemId));
          questions.push(q);
          continue;
        }
      }
      continue;
    }

    let entry = null;
    for (let i = 0; i < pool.length; i++) {
      const cand = pool[(cursor + i) % pool.length];
      if (!used.has(cand.itemId)) { entry = cand; cursor = (cursor + i + 1) % pool.length; break; }
    }
    if (!entry) { used.clear(); continue; }

    const gen = generatorFor(type);
    let q = null;
    try { q = gen(entry); } catch { q = null; }
    if (!q) {
      const fallback = qMeaningOut(entry, pool) || qMeaningIn(entry, pool) || qFill(entry, pool) || qOrder(entry) || qListen(entry, pool);
      q = fallback;
      if (!q) { used.add(entry.itemId); continue; }
    }
    used.add(entry.itemId);
    // تنويع خيارات الأسئلة نفسها
    if (q.options && q.options.length > 1) q.options = shuffle(q.options).slice(0, 4);
    questions.push(q);
  }

  return questions.slice(0, count);
}

/* أسئلة جدول الضمائر */
export function buildRelationQuestions(count = 8) {
  const targets = ['object', 'det', 'poss', 'refl'];
  const out = [];
  const rows = shuffle(PRONOUN_TABLE.rows);
  let i = 0;
  while (out.length < count && i < rows.length * 4) {
    const row = rows[i % rows.length];
    const to = targets[(i + out.length) % targets.length];
    const q = qRelation(row, 'subject', to, PRONOUN_TABLE.rows);
    if (q && !out.some((x) => x.itemId === q.itemId)) out.push(q);
    i++;
  }
  return out;
}

export function buildUnitQuiz(unitId, count = 10) {
  const unitQuestions = buildQuestions({ source: `unit:${unitId}`, types: ['mcq', 'fill'], count, adaptive: false });
  const rel = ALL_UNITS.length ? [] : [];
  return [...unitQuestions, ...rel].slice(0, count);
}

export function smartDrillEntries() {
  const all = [...vocabularyEntries(), ...pronounEntries(), ...connectorEntries(), ...questionEntries(), ...readingWordEntries(), ...sentenceEntries()];
  const weak = weakestFirst(all, 60).filter((e) => {
    const it = progress.items?.[e.itemId];
    return it && (it.wrong > 0 || it.seen > 0);
  });
  return weak.length ? weak : shuffle(all).slice(0, 40);
}
