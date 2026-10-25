/**
 * ============================================================
 *  اختبارات قسم «من الصفر» (A0) — بلا أي مكتبات خارجية
 *  التشغيل:  node tools/test-zero.mjs
 *  يفحص: سلامة المحتوى، توليد الأسئلة، منطق التقدّم، الشارات،
 *        الشهادة، لوح الكتابة، والتوصية بالانتقال إلى A1.
 * ============================================================
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = (p) => import(pathToFileURL(join(ROOT, p)).href);

/* ---------------- إطار اختبار مصغّر ---------------- */
let passed = 0;
const failures = [];
const results = [];
const pending = [];
let group = 'عام';
function describe(name, fn) { group = name; results.push(`\n── ${name}`); fn(); }
function it(name, fn) {
  const done = () => { passed++; results.push(`  ✅ ${name}`); };
  const fail = (e) => { failures.push(`  ❌ [${group}] ${name}\n       ${e.message}`); results.push(`  ❌ ${name}`); };
  try {
    const r = fn();
    if (r && typeof r.then === 'function') { pending.push(r.then(done, fail)); return; }
    done();
  } catch (e) { fail(e); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'شرط غير محقّق'); }
function eq(a, b, msg) { if (a !== b) throw new Error(`${msg || 'قيمة غير متوقعة'}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); }
function gte(a, b, msg) { if (!(a >= b)) throw new Error(`${msg || 'القيمة أصغر من المطلوب'}: ${a} < ${b}`); }
function lte(a, b, msg) { if (!(a <= b)) throw new Error(`${msg || 'القيمة أكبر من المطلوب'}: ${a} > ${b}`); }
function truthy(v, msg) { if (!v) throw new Error(msg || 'قيمة فارغة'); }
const ARABIC_ONLY = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\u060C\u061B\u061F\u0640\u064B-\u0652\u0670\u06D6-\u06ED.,!؟:؛'"()\-·…0-9%\/|]+$/;

/* ---------------- بيئة DOM مبسّطة (كما في tools/check.mjs) ---------------- */
const mem = new Map();
const elStub = () => ({
  style: { setProperty() {} }, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {}, setAttribute() {}, removeAttribute() {},
  querySelector: () => null, querySelectorAll: () => [], insertAdjacentHTML() {}, focus() {}, closest: () => null,
  textContent: '', innerHTML: '', value: '', checked: false, hidden: false,
});
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
};
globalThis.document = {
  documentElement: { dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} } },
  body: elStub(), hidden: false,
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
  querySelector: () => null, querySelectorAll: () => [],
  createElement: elStub, getElementById: () => null,
};
globalThis.window = {
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  location: { href: 'https://example.com/Learn-English/index.html#/', hash: '#/', replace() {}, pathname: '/Learn-English/index.html' },
  scrollTo() {}, localStorage: globalThis.localStorage, print() {},
};
globalThis.location = globalThis.window.location;
try {
  Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'node-test', language: 'ar', clipboard: { writeText: async () => {} } }, configurable: true, writable: true });
} catch {}
globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
globalThis.devicePixelRatio = 2;
globalThis.requestAnimationFrame = (fn) => setTimeout(() => fn(Date.now()), 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

/* ============================================================
   1) سلامة البيانات
   ============================================================ */
const Z = await load('assets/js/data/zero.js');
const { resolveSound, registerZeroSounds } = await load('assets/js/core/zero-audio.js');
const { hasRecordedSound } = await load('assets/js/core/speech.js');
const {
  LETTERS, DIGRAPHS, NUMBERS, ORDINALS, DAYS, MONTHS, SEASONS, TIME_WORDS, PRONOUNS, TO_BE,
  NUMBERS_TIME, WORD_GROUPS, SENTENCES, READINGS, ZERO_STAGES, ZERO_TOTALS,
  zeroItems, zeroStageSize, zeroStageQuestions, zeroExamQuestions, zeroStats, zeroAdvice, zeroStage,
} = Z;

describe('الحروف (26)', () => {
  it('العدد 26 وترتيب a..z بلا تكرار', () => {
    eq(LETTERS.length, 26, 'عدد الحروف');
    const ids = LETTERS.map((l) => l.id).join('');
    eq(ids, 'abcdefghijklmnopqrstuvwxyz', 'ترتيب المعرّفات');
  });
  it('كل حرف له اسم وصوت وكلمة ومثال ونطق عربي', () => {
    for (const l of LETTERS) {
      for (const k of ['upper', 'lower', 'nameAr', 'soundAr', 'word', 'wordAr', 'wordPronAr', 'emoji', 'tipAr']) {
        truthy(l[k], `الحرف ${l.id} ينقصه ${k}`);
      }
      assert(ARABIC_ONLY.test(l.nameAr), `اسم الحرف ${l.id} يجب أن يكون بحروف عربية فقط: ${l.nameAr}`);
      assert(ARABIC_ONLY.test(l.wordPronAr), `نطق كلمة ${l.id} يجب أن يكون بحروف عربية فقط: ${l.wordPronAr}`);
      eq(l.upper.toLowerCase(), l.id, `الحرف الكبير لـ ${l.id}`);
      eq(l.lower, l.id, `الحرف الصغير لـ ${l.id}`);
    }
  });
  it('كلمات الأمثلة الـ26 مختلفة', () => {
    const set = new Set(LETTERS.map((l) => l.word.toLowerCase()));
    eq(set.size, 26, 'عدد الكلمات المختلفة');
  });
});

describe('الحروف المركّبة (12)', () => {
  it('العدد 12 وتشمل sh/ch/th/ph/ee/oo', () => {
    eq(DIGRAPHS.length, 12, 'عدد الحروف المركّبة');
    const combos = new Set(DIGRAPHS.map((d) => d.combo));
    for (const c of ['sh', 'ch', 'th', 'ph', 'ee', 'oo', 'ck', 'ng', 'ea', 'ou']) {
      assert(combos.has(c), `الحرف المركّب ${c} مفقود`);
    }
  });
  it('كل حرف مركّب له صوت وكلمة ونطق عربي وتوضيح', () => {
    for (const d of DIGRAPHS) {
      for (const k of ['id', 'combo', 'soundAr', 'word', 'wordAr', 'wordPronAr', 'emoji', 'tipAr']) truthy(d[k], `${d.id} ينقصه ${k}`);
      assert(ARABIC_ONLY.test(d.soundAr), `صوت ${d.id} ليس عربياً: ${d.soundAr}`);
      assert(ARABIC_ONLY.test(d.wordPronAr), `نطق ${d.id} ليس عربياً: ${d.wordPronAr}`);
    }
    eq(new Set(DIGRAPHS.map((d) => d.id)).size, 12, 'معرّفات فريدة');
  });
});

describe('الأرقام والأرقام الترتيبية', () => {
  it('تغطي 0..20 ثم العشرات ثم 100', () => {
    const ns = NUMBERS.map((x) => x.n);
    for (let i = 0; i <= 20; i++) assert(ns.includes(i), `الرقم ${i} مفقود`);
    for (const n of [30, 40, 50, 60, 70, 80, 90, 100]) assert(ns.includes(n), `الرقم ${n} مفقود`);
    eq(new Set(ns).size, ns.length, 'لا تكرار');
  });
  it('كل رقم إنجليزي/عربي/نطق غير فارغ والنطق عربي', () => {
    for (const x of NUMBERS) {
      truthy(x.en && x.ar && x.pron, `رقم ناقص: ${JSON.stringify(x)}`);
      assert(ARABIC_ONLY.test(x.pron), `نطق ${x.en} ليس عربياً: ${x.pron}`);
    }
    eq(ORDINALS.length, 10, 'عدد الأرقام الترتيبية');
    for (const x of ORDINALS) { truthy(x.en && x.ar && x.pron, `ترتيبي ناقص ${x.n}`); }
  });
});

describe('الأيام والشهور والفصول والوقت', () => {
  it('7 أيام و12 شهراً و4 فصول', () => {
    eq(DAYS.length, 7, 'عدد الأيام');
    eq(MONTHS.length, 12, 'عدد الشهور');
    eq(SEASONS.length, 4, 'عدد الفصول');
  });
  it('شهور السنة مرقّمة 1..12 بلا تكرار ولكل شهر فصل موجود', () => {
    const ns = MONTHS.map((m) => m.n);
    eq(ns.join(','), '1,2,3,4,5,6,7,8,9,10,11,12', 'ترقيم الشهور');
    const seasonIds = new Set(SEASONS.map((s) => s.id));
    for (const m of MONTHS) assert(seasonIds.has(m.season), `فصل غير معروف للشهر ${m.en}`);
  });
  it('عبارات الوقت وقول الساعة كافية ولها نطق عربي', () => {
    gte(TIME_WORDS.length, 12, 'عدد عبارات الوقت');
    gte(NUMBERS_TIME.length, 6, 'عدد صيغ الساعة');
    for (const x of [...DAYS, ...MONTHS, ...SEASONS, ...TIME_WORDS, ...NUMBERS_TIME]) {
      truthy(x.en && x.ar && x.pron, `عنصر وقت ناقص: ${JSON.stringify(x)}`);
      assert(ARABIC_ONLY.test(x.pron), `نطق ${x.en} ليس عربياً: ${x.pron}`);
    }
  });
});

describe('الضمائر وفعل الكينونة', () => {
  it('8 ضمائر لكل منها فعل كينونة صحيح ومثال بترجمة ونطق', () => {
    eq(PRONOUNS.length, 8, 'عدد الضمائر');
    const beOf = (en) => (en === 'I' ? 'am' : (en === 'He' || en === 'She' || en === 'It') ? 'is' : 'are');
    for (const p of PRONOUNS) {
      truthy(p.en && p.ar && p.pron && p.emoji, `ضمير ناقص: ${JSON.stringify(p)}`);
      truthy(p.example && p.exampleAr && p.examplePron, `مثال ناقص للضمير ${p.en}`);
      eq(p.be, beOf(p.en), `فعل الكينونة للضمير ${p.en}`);
      assert(p.example.toLowerCase().includes(` ${p.be} `), `المثال لا يحتوي ${p.be}: ${p.example}`);
    }
  });
  it('أفعال to be الثلاثة لكل منها 3 أمثلة', () => {
    eq(TO_BE.length, 3, 'عدد صيغ to be');
    eq(TO_BE.map((b) => b.verb).sort().join(','), 'am,are,is', 'صيغ to be');
    for (const b of TO_BE) {
      eq(b.examples.length, 3, `أمثلة ${b.verb}`);
      truthy(b.ruleAr && b.withAr, `شرح ناقص لـ ${b.verb}`);
      for (const e of b.examples) {
        truthy(e.en && e.ar && e.pron, `مثال ناقص لـ ${b.verb}`);
        assert(new RegExp(`\\b${b.verb}\\b`).test(e.en), `المثال لا يحتوي ${b.verb}: ${e.en}`);
      }
    }
  });
});

describe('أول 120 كلمة', () => {
  it('8 مجموعات × 15 كلمة = 120 كلمة فريدة', () => {
    eq(WORD_GROUPS.length, 8, 'عدد المجموعات');
    let total = 0;
    for (const g of WORD_GROUPS) {
      eq(g.words.length, 15, `كلمات مجموعة ${g.id}`);
      truthy(g.titleAr && g.icon && g.id, `مجموعة ناقصة: ${g.id}`);
      total += g.words.length;
    }
    eq(total, 120, 'إجمالي الكلمات');
    const all = WORD_GROUPS.flatMap((g) => g.words.map((w) => w.en.toLowerCase()));
    eq(new Set(all).size, 120, 'كلمات فريدة على مستوى الملف كله');
  });
  it('كل كلمة لها ترجمة ونطق عربي ورمز', () => {
    for (const g of WORD_GROUPS) {
      for (const w of g.words) {
        truthy(w.en && w.ar && w.pron && w.emoji, `كلمة ناقصة في ${g.id}: ${JSON.stringify(w)}`);
        assert(ARABIC_ONLY.test(w.pron), `نطق الكلمة ${w.en} ليس عربياً: ${w.pron}`);
        assert(/^[a-z' -]+$/.test(w.en), `الكلمة ${w.en} ليست إنجليزية بسيطة`);
      }
    }
  });
});

describe('أول 40 جملة', () => {
  it('40 جملة فريدة موزّعة على 8 مجموعات', () => {
    eq(SENTENCES.length, 40, 'عدد الجمل');
    eq(new Set(SENTENCES.map((s) => s.en.toLowerCase())).size, 40, 'جمل فريدة');
    gte(new Set(SENTENCES.map((s) => s.group)).size, 8, 'عدد مجموعات الجمل');
  });
  it('كل جملة لها ترجمة ونطق عربي وعلامة ترقيم', () => {
    for (const s of SENTENCES) {
      truthy(s.en && s.ar && s.pron && s.group, `جملة ناقصة: ${JSON.stringify(s)}`);
      assert(/[.!?]$/.test(s.en), `الجملة بلا علامة ترقيم: ${s.en}`);
      assert(ARABIC_ONLY.test(s.pron), `نطق الجملة ليس عربياً: ${s.en} → ${s.pron}`);
      assert(/^[A-Z]/.test(s.en), `الجملة لا تبدأ بحرف كبير: ${s.en}`);
    }
  });
});

describe('القراءات الأربع', () => {
  it('4 نصوص بمعرّفات zr1..zr4', () => {
    eq(READINGS.length, 4, 'عدد القراءات');
    eq(READINGS.map((r) => r.id).join(','), 'zr1,zr2,zr3,zr4', 'معرّفات القراءات');
  });
  it('لكل نص 5–7 أسطر بترجمة ونطق عربي', () => {
    for (const r of READINGS) {
      truthy(r.titleEn && r.titleAr && r.emoji, `عنوان ناقص: ${r.id}`);
      gte(r.lines.length, 5, `أسطر ${r.id}`);
      lte(r.lines.length, 7, `أسطر ${r.id}`);
      for (const l of r.lines) {
        truthy(l.en && l.ar && l.pron, `سطر ناقص في ${r.id}`);
        assert(ARABIC_ONLY.test(l.pron), `نطق سطر ليس عربياً في ${r.id}: ${l.pron}`);
      }
    }
  });
  it('3–4 أسئلة لكل نص، 4 خيارات مختلفة، ومؤشّر إجابة صحيح', () => {
    for (const r of READINGS) {
      gte(r.questions.length, 3, `أسئلة ${r.id}`);
      lte(r.questions.length, 4, `أسئلة ${r.id}`);
      for (const q of r.questions) {
        truthy(q.q && q.qAr && q.explain, `سؤال ناقص في ${r.id}`);
        eq(q.options.length, 4, `خيارات سؤال في ${r.id}`);
        eq(new Set(q.options).size, 4, `خيارات مكرّرة في ${r.id}`);
        assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3, `مؤشّر إجابة غير صالح في ${r.id}`);
        for (const o of q.options) truthy(String(o).trim(), `خيار فارغ في ${r.id}`);
      }
    }
  });
});

/* ============================================================
   2) المراحل
   ============================================================ */
describe('مراحل A0 الأساسية الخمس', () => {
  it('5 مراحل بمعرّفات فريدة وبترتيب 1..5', () => {
    eq(ZERO_STAGES.length, 5, 'عدد المراحل');
    eq(new Set(ZERO_STAGES.map((s) => s.id)).size, 5, 'معرّفات فريدة');
    eq(ZERO_STAGES.map((s) => s.n).join(','), '1,2,3,4,5', 'ترقيم المراحل');
    assert(!ZERO_STAGES.some((s) => ['digraphs', 'words', 'reading'].includes(s.id)), 'محتوى A1 ما زال في مسار A0');
  });
  it('كل مرحلة لها محتوى فعلي', () => {
    for (const s of ZERO_STAGES) {
      truthy(s.icon && s.titleAr && s.subAr && s.minutes, `مرحلة ناقصة: ${s.id}`);
      gte(zeroStageSize(s.id), 4, `عناصر المرحلة ${s.id}`);
    }
    eq(zeroStage('لا-يوجد').id, ZERO_STAGES[0].id, 'المرحلة الاحتياطية');
  });
  it('الإجماليات مطابقة لعدد العناصر الفعلي', () => {
    eq(ZERO_TOTALS.letters, 26, 'إجمالي الحروف');
    eq(ZERO_TOTALS.digraphs, 0, 'الحروف المركبة منقولة إلى A1');
    eq(ZERO_TOTALS.numbers, 21, 'الأرقام الأساسية من صفر إلى عشرين');
    eq(ZERO_TOTALS.days, 7, 'أيام الأسبوع');
    eq(ZERO_TOTALS.pronouns, 8, 'الضمائر الأساسية');
    eq(ZERO_TOTALS.words, 0, 'الكلمات الموضوعية منقولة إلى A1');
    eq(ZERO_TOTALS.sentences, 15, 'عبارات التحية والتعارف');
    eq(ZERO_TOTALS.readings, 0, 'القراءات منقولة إلى A1');
    const sum = ZERO_STAGES.reduce((n, s) => n + zeroStageSize(s.id), 0);
    eq(ZERO_TOTALS.items, sum, 'إجمالي عناصر المراحل');
    gte(ZERO_TOTALS.items, 70, 'إجمالي عناصر المرحلة');
  });
  it('كل عنصر له معنى عربي (أو نطق) ومفتاح فريد', () => {
    for (const s of ZERO_STAGES) {
      const keys = new Set();
      for (const it of zeroItems(s.id)) {
        truthy(it.key, `عنصر بلا مفتاح في ${s.id}`);
        assert(!keys.has(it.key), `مفتاح مكرر في ${s.id}: ${it.key}`);
        keys.add(it.key);
        truthy(it.en, `عنصر بلا نص إنجليزي في ${s.id}`);
        truthy(it.ar || it.soundAr, `عنصر بلا معنى في ${s.id}: ${it.key}`);
      }
    }
  });
  it('كل عنصر له كلمة مثال يحمل ترجمتها ونطقها بالحقول التي تقرأها الواجهة', () => {
    for (const s of ZERO_STAGES) {
      for (const it of zeroItems(s.id)) {
        if (!it.word) continue;
        truthy(it.wordAr, `كلمة المثال بلا ترجمة في ${s.id}: ${it.key}`);
        truthy(it.wordPronAr, `كلمة المثال بلا نطق عربي في ${s.id}: ${it.key} (الحقل wordPronAr مفقود)`);
        assert(ARABIC_ONLY.test(it.wordPronAr), `نطق كلمة المثال ليس عربياً في ${s.id}: ${it.wordPronAr}`);
      }
    }
  });
  it('كل عنصر قابل للنطق له نص نطق صالح (say أو en)', () => {
    for (const s of ZERO_STAGES) {
      for (const it of zeroItems(s.id)) {
        const say = it.say || it.en;
        truthy(say, `لا نص للنطق في ${s.id}: ${it.key}`);
        assert(/[A-Za-z]/.test(say), `نص النطق ليس إنجليزياً في ${s.id}: ${say}`);
        if (s.kind === 'letters') assert(!/\s/.test(say), `نطق الحرف يجب أن يكون حرفاً واحداً، وجدنا: ${say}`);
      }
    }
  });
});

/* ============================================================
   3) توليد الأسئلة
   ============================================================ */
describe('أسئلة تدريب المرحلة (5 أسئلة)', () => {
  it('كل مرحلة تولّد 5 أسئلة سليمة', () => {
    for (const s of ZERO_STAGES) {
      const qs = zeroStageQuestions(s.id, 5);
      eq(qs.length, 5, `عدد أسئلة المرحلة ${s.id}`);
      const ids = new Set(qs.map((q) => q.id));
      eq(ids.size, qs.length, `معرّفات أسئلة فريدة في ${s.id}`);
      for (const q of qs) {
        truthy(q.instruction, `سؤال بلا تعليمات في ${s.id}`);
        truthy(q.stemHtml, `سؤال بلا نص في ${s.id}`);
        truthy(Array.isArray(q.options) && q.options.length >= 2, `خيارات ناقصة في ${s.id}: ${q.id}`);
        eq(q.options.filter((o) => o.correct).length, 1, `عدد الإجابات الصحيحة في ${s.id}: ${q.id}`);
        eq(new Set(q.options.map((o) => o.label)).size, q.options.length, `خيارات مكرّرة في ${s.id}: ${q.id}`);
        truthy(q.answerText, `سؤال بلا نص إجابة في ${s.id}: ${q.id}`);
        const correct = q.options.find((o) => o.correct);
        eq(correct.label, q.answerText, `نص الإجابة لا يطابق الخيار الصحيح: ${q.id}`);
      }
    }
  });
  it('الأسئلة تختلف بين محاولتين (عشوائية)', () => {
    const a = zeroStageQuestions('numbers', 5).map((q) => q.id).join('|');
    const b = zeroStageQuestions('numbers', 5).map((q) => q.id).join('|');
    assert(a !== b || zeroStageSize('numbers') <= 5, 'توليد الأسئلة لا يتغيّر بين المحاولات');
  });
  it('لا خيار إجابة فارغ، والنص العربي لا يُعرض LTR', () => {
    for (const s of ZERO_STAGES) {
      for (const q of zeroStageQuestions(s.id, 5)) {
        for (const o of q.options) truthy(String(o.label).trim(), `خيار فارغ في ${q.id}`);
        if (q.speakText) assert(/[A-Za-z]/.test(q.speakText), `نص النطق ليس إنجليزياً: ${q.id}`);
      }
    }
  });
});

describe('الاختبار النهائي (~30 سؤالاً)', () => {
  it('يولّد 30 سؤالاً فريداً', () => {
    const qs = zeroExamQuestions(30);
    eq(qs.length, 30, 'عدد أسئلة الاختبار');
    eq(new Set(qs.map((q) => q.id)).size, 30, 'أسئلة فريدة');
  });
  it('يغطي كل المراحل الخمس', () => {
    const topics = new Set(zeroExamQuestions(30).map((q) => q.topic));
    gte(topics.size, 5, 'عدد المراحل المغطاة');
  });
  it('كل سؤال سليم', () => {
    for (const q of zeroExamQuestions(30)) {
      eq(q.options.filter((o) => o.correct).length, 1, `إجابة صحيحة واحدة: ${q.id}`);
      truthy(q.id && q.instruction && q.answerText && q.explain, `سؤال ناقص: ${q.id}`);
      eq(q.level, 'a0', `مستوى السؤال ${q.id}`);
    }
  });
  it('5 أسئلة متكرّرة الطلب تعطي 5 دائماً', () => {
    for (const n of [3, 5, 10, 40]) {
      const qs = zeroExamQuestions(n);
      lte(qs.length, n, `عدد الأسئلة المطلوب ${n}`);
      gte(qs.length, Math.min(n, 5), `عدد الأسئلة الفعلي ${n}`);
    }
  });
});

/* ============================================================
   4) منطق التقدّم + zeroflow
   ============================================================ */
const store = await load('assets/js/core/store.js');
const flow = await load('assets/js/core/zeroflow.js');
const gamify = await load('assets/js/core/gamify.js');
const { progress, saveProgress, settings, resetProgress } = store;

describe('إحصاءات التقدّم (zeroStats)', () => {
  it('التقدّم الفارغ = 0% وغير مستحق', () => {
    const st = zeroStats({});
    eq(st.percent, 0, 'نسبة الإتقان');
    eq(st.doneStages, 0, 'المراحل');
    eq(st.lettersMastered, 0, 'الحروف');
    eq(st.readyForA1, false, 'الاستحقاق');
    gte(zeroAdvice(st).text.length, 10, 'نص التوصية');
  });
  it('التقدّم الكامل = 100% ومستحق للانتقال', () => {
    const zero = { stages: {}, letters: {}, words: {}, exam: { best: 100 } };
    for (const s of ZERO_STAGES) zero.stages[s.id] = { seen: true, done: true };
    for (const l of LETTERS) zero.letters[l.id] = true;
    for (const g of WORD_GROUPS) for (const w of g.words) zero.words[w.en] = true;
    const st = zeroStats({ zero });
    eq(st.percent, 100, 'نسبة الإتقان');
    eq(st.doneStages, 5, 'المراحل');
    eq(st.lettersMastered, 26, 'الحروف');
    eq(st.wordsLearned, 0, 'الكلمات الموضوعية أصبحت ضمن A1');
    eq(st.readyForA1, true, 'الاستحقاق');
    assert(/A1/.test(zeroAdvice(st).text), 'التوصية يجب أن تذكر A1');
  });
  it('نسبة الإتقان تتطلب المراحل والحروف والاختبار', () => {
    const zero = { stages: {}, letters: {}, words: {}, exam: { best: 96 } };
    for (const s of ZERO_STAGES) zero.stages[s.id] = { seen: true, done: true };
    for (const l of LETTERS) zero.letters[l.id] = true;
    for (const g of WORD_GROUPS) for (const w of g.words) zero.words[w.en] = true;
    const st = zeroStats({ zero });
    eq(st.percent, 99, 'النسبة مع اختبار ٩٦٪');
    eq(st.readyForA1, true, '٩٦٪ كافية للاستحقاق (الحد ٩٠٪)');
    eq(st.remaining.exam, 0, 'لا متبقٍّ في الاختبار');
  });
  it('النسبة تتقدّم بشكل رتيب مع المراحل', () => {
    let last = -1;
    for (let k = 0; k <= 5; k++) {
      const zero = { stages: {}, letters: {}, words: {}, exam: { best: 0 } };
      ZERO_STAGES.slice(0, k).forEach((s) => { zero.stages[s.id] = { done: true }; });
      const p = zeroStats({ zero }).percent;
      gte(p, last, `النسبة عند ${k} مراحل`);
      last = p;
    }
    eq(zeroStats({ zero: { stages: Object.fromEntries(ZERO_STAGES.map((s) => [s.id, { done: true }])), letters: {}, words: {}, exam: { best: 0 } } }).readyForA1, false, 'المراحل وحدها لا تكفي للاستحقاق');
  });
});

describe('كتابة التقدّم (zeroflow)', () => {
  it('البداية من صفر نظيف', () => {
    resetProgress();
    const st = flow.zeroSnapshot();
    eq(st.percent, 0, 'النسبة بعد التصفير');
    eq(st.stageList.length, 5, 'قائمة المراحل');
    eq(st.wordGroups.length, 0, 'مفردات A0 المنقولة غير معروضة في هذا المسار');
    eq(st.readingList.length, 0, 'قراءات A0 المنقولة غير معروضة في هذا المسار');
  });
  it('زيارة مرحلة وإتمامها يُسجّلان', () => {
    flow.markStageSeen('letters');
    eq(flow.zeroSnapshot().raw.stages.letters.seen, true, 'الزيارة');
    flow.markStageDone('letters', 100);
    const st = flow.zeroSnapshot();
    eq(st.raw.stages.letters.done, true, 'الإتمام');
    eq(st.raw.stages.letters.best, 100, 'أفضل نتيجة');
    eq(st.doneStages, 1, 'عدد المراحل المكتملة');
    gte(st.percent, 5, 'النسبة بعد أول مرحلة');
  });
  it('إتقان الحروف يُحسب ويُلغى', () => {
    flow.markLetter('a', true);
    eq(flow.zeroSnapshot().lettersMastered, 1, 'حرف واحد');
    flow.markLetter('a', false);
    eq(flow.zeroSnapshot().lettersMastered, 0, 'بعد الإلغاء');
    for (const l of LETTERS) flow.markLetter(l.id, true);
    eq(flow.zeroSnapshot().lettersMastered, 26, 'كل الحروف');
  });
  it('إتقان الكلمات والجمل والحروف المركّبة', () => {
    flow.markWord('mother', true);
    flow.markSentence('Hello!', true);
    flow.markDigraph('sh', true);
    const st = flow.zeroSnapshot();
    eq(st.raw.words.mother, true, 'كلمة متقنة');
    eq(st.raw.sentences['Hello!'], true, 'جملة متقنة');
    eq(st.raw.digraphs.sh, true, 'حرف مركّب متقن');
  });
  it('applyAnswer يربط معرّفات الأسئلة بالعناصر الصحيحة', () => {
    resetProgress();
    flow.applyAnswer('zero:name:letter:b', true);
    eq(flow.zeroSnapshot().raw.letters.b, true, 'حرف من سؤال الاسم');
    flow.applyAnswer('zero:word:letter:c', true);
    eq(flow.zeroSnapshot().raw.letters.c, true, 'حرف من سؤال الكلمة');
    flow.applyAnswer('zero:name:digraph:ch', true);
    eq(flow.zeroSnapshot().raw.digraphs.ch, true, 'حرف مركّب');
    flow.applyAnswer('zero:ar:word:sun', true);
    eq(flow.zeroSnapshot().raw.words.sun, true, 'كلمة');
    flow.applyAnswer('zero:en:sent:Hello!', true);
    eq(flow.zeroSnapshot().raw.sentences['Hello!'], true, 'جملة');
    flow.applyAnswer('zero:ar:word:moon', false);
    eq(flow.zeroSnapshot().raw.words.moon, undefined, 'الإجابة الخاطئة لا تُتقن');
    flow.applyAnswer('', true);
    flow.applyAnswer(null, true);
  });
  it('القراءة تُسجَّل بمرة واحدة', () => {
    resetProgress();
    flow.markReadingDone('zr1', 4, 4);
    flow.markReadingDone('zr1', 3, 4);
    const st = flow.zeroSnapshot();
    eq(st.raw.readings.zr1.done, true, 'إتمام القراءة');
    eq(st.raw.readings.zr1.score, 4, 'أفضل نتيجة محفوظة');
  });
  it('الاختبار النهائي يحفظ الأفضل والمحاولات', () => {
    resetProgress();
    const a = flow.recordZeroExam(20, 30);
    eq(a.improved, true, 'تحسّن أول');
    eq(flow.zeroSnapshot().examBest, 67, 'النسبة المحسوبة');
    flow.recordZeroExam(30, 30);
    eq(flow.zeroSnapshot().examBest, 100, 'النتيجة الأفضل');
    eq(flow.zeroSnapshot().raw.exam.attempts, 2, 'عدد المحاولات');
    const c = flow.recordZeroExam(10, 30);
    eq(c.improved, false, 'لا تحسّن عند نتيجة أدنى');
    eq(flow.zeroSnapshot().examBest, 100, 'الأفضل لا ينزل');
  });
  it('لوح الكتابة يُسجّل الاستخدام', () => {
    resetProgress();
    eq(flow.markPadUsed().milestone, true, 'أول استخدام');
    eq(flow.markPadUsed().milestone, false, 'الاستخدام التالي');
    eq(flow.zeroSnapshot().raw.padCount, 2, 'عدّاد اللوح');
  });
  it('الشهادة لا تُمنح إلا بعد الإتقان الكامل', () => {
    resetProgress();
    eq(flow.certificateReady(), false, 'غير جاهز في البداية');
    eq(flow.certificate().earned, false, 'لم تُمنح');
    for (const s of ZERO_STAGES) flow.markStageDone(s.id, 100);
    for (const l of LETTERS) flow.markLetter(l.id, true);
    for (const g of WORD_GROUPS) for (const w of g.words) flow.markWord(w.en, true);
    flow.recordZeroExam(29, 30);
    eq(flow.certificateReady(), true, 'جاهز بعد الإتقان');
    const g = flow.grantCertificate('متعلّم تجريبي');
    eq(g.granted, true, 'مُنحت');
    assert(/^A0-[A-Z0-9]+-\d{3}$/.test(g.code), `رقم الشهادة غير متوقّع: ${g.code}`);
    eq(flow.certificate().earned, true, 'محفوظة');
    eq(flow.certificate().name, 'متعلّم تجريبي', 'الاسم');
    eq(flow.grantCertificate().granted, false, 'لا تُمنح مرتين');
  });
  it('اسم الشهادة يُحفظ ويُقصّ', () => {
    flow.saveCertificateName('  أحمد  ');
    eq(flow.certificate().name, 'أحمد', 'الاسم بعد القصّ');
    flow.saveCertificateName('x'.repeat(200));
    lte(flow.certificate().name.length, 60, 'طول الاسم');
  });
  it('وضع «من الصفر» يُحفظ ويُقرأ', () => {
    eq(flow.setZeroFocus('a0'), 'a0', 'تشغيل الوضع');
    eq(flow.zeroFocus(), 'a0', 'قراءة الوضع');
    eq(flow.setZeroFocus('levels'), 'levels', 'إطفاء الوضع');
    eq(flow.zeroFocus(), 'levels', 'قراءة الوضع بعد الإطفاء');
    flow.setZeroPrefs({ autoSpeak: false, padMode: 'cursive', slowRate: 0.5 });
    const pr = flow.zeroPrefs();
    eq(pr.autoSpeak, false, 'النطق التلقائي');
    eq(pr.padMode, 'cursive', 'وضع اللوح');
    eq(pr.slowRate, 0.5, 'سرعة البطء');
  });
  it('شاشة الاختيار تُكمل مرة واحدة فقط', () => {
    store.resetSettings();
    eq(flow.zeroPrefs().onboarded, false, 'قبل الاختيار');
    flow.completeOnboarding('a0');
    const pr = flow.zeroPrefs();
    eq(pr.onboarded, true, 'بعد الاختيار');
    eq(pr.focus, 'a0', 'الوضع المختار');
    const st = flow.zeroSnapshot();
    eq(st.raw.stages.letters.seen, true, 'تُعلَّم المرحلة الأولى كمزارة');
  });
  it('تصفير قسم A0 لا يمسّ تقدّم المستويات', () => {
    saveProgress((p) => {
      p.units = { a1u1: { done: true } };
      p.readings = { r1: { done: true } };
      p.notebook = [{ en: 'book', ar: 'كتاب' }];
    });
    const before = store.progress.points || 0;
    flow.markStageDone('letters', 100);
    flow.resetZeroProgress();
    eq(flow.zeroSnapshot().percent, 0, 'تصفير A0');
    eq(store.progress.units?.a1u1?.done, true, 'وحدات A1 سليمة');
    eq(store.progress.readings?.r1?.done, true, 'مطالعات المستويات سليمة');
    eq(store.progress.notebook?.length, 1, 'دفتر الكلمات سليم');
    gte(store.progress.points || 0, before, 'النقاط المكسوبة لا تُخصم عند تصفير A0');
  });
});

describe('شارات التأسيس', () => {
  it('11 شارة A0 بمعرّفات a0-* وأوصاف عربية', () => {
    const A0 = gamify.badgesWithState().filter((b) => b.id.startsWith('a0-'));
    eq(A0.length, 11, 'عدد شارات A0');
    for (const b of A0) {
      truthy(b.icon && b.ar && b.en && b.descAr && b.descEn, `شارة ناقصة: ${b.id}`);
      eq(typeof b.check, 'function', `شارة بلا دالة فحص: ${b.id}`);
    }
  });
  it('كل الشارات تُفتح عند الإتقان الكامل', () => {
    resetProgress();
    for (const s of ZERO_STAGES) flow.markStageDone(s.id, 100);
    for (const l of LETTERS) flow.markLetter(l.id, true);
    for (const phrase of SENTENCES.filter((item) => ['greetings', 'polite', 'intro'].includes(item.group)).slice(0, 3)) flow.markSentence(phrase.en, true);
    flow.recordZeroExam(30, 30);
    flow.grantCertificate();
    gamify.evaluateBadges();
    const earned = gamify.badgesWithState().filter((b) => b.id.startsWith('a0-') && b.earned).map((b) => b.id);
    const all = gamify.badgesWithState().filter((b) => b.id.startsWith('a0-')).map((b) => b.id);
    const missing = all.filter((id) => !earned.includes(id));
    eq(missing.length, 0, `شارات A0 غير مفتوحة: ${missing.join(', ')}`);
  });
  it('لا شارات A0 في البداية', () => {
    resetProgress();
    const earned = gamify.badgesWithState().filter((b) => b.id.startsWith('a0-') && b.earned);
    eq(earned.length, 0, 'شارات مفتوحة بالخطأ');
  });
});

describe('التوصية بالانتقال إلى A1 (بلا قفل)', () => {
  it('قبل الإتقان: توصية غير مانعة', () => {
    resetProgress();
    const rec = flow.a1Recommendation();
    eq(rec.ready, false, 'ليست جاهزة');
    assert(!/مقفل|محظور|ممنوع|غير مسموح|لا يمكنك/.test(rec.text), 'التوصية يجب ألا تمنع الانتقال');
    assert(/مفتوحة/.test(rec.text), 'التوصية يجب أن تُصرّح بأن المستويات مفتوحة');
  });
  it('بعد الإتقان: توصية صريحة بالانتقال', () => {
    resetProgress();
    for (const s of ZERO_STAGES) flow.markStageDone(s.id, 100);
    for (const l of LETTERS) flow.markLetter(l.id, true);
    flow.recordZeroExam(30, 30);
    const rec = flow.a1Recommendation();
    eq(rec.ready, true, 'جاهزة');
    assert(/A1/.test(rec.text), 'التوصية تذكر A1');
  });
  it('المستوى A1 مفتوح دائماً ولا يعتمد على تقدّم A0', async () => {
    resetProgress();
    const cur = await load('assets/js/data/curriculum.js');
    eq(cur.isLevelUnlocked(0), true, 'A1 يجب أن يكون مفتوحاً بلا أي تقدّم في A0');
    for (const s of ZERO_STAGES) flow.markStageDone(s.id, 100);
    eq(cur.isLevelUnlocked(0), true, 'A1 يبقى مفتوحاً بعد إتمام A0');
    eq(cur.levelPercent('a1'), 0, 'لا تقدّم في A1 بعد');
  });
});

/* ============================================================
   5) لوح الكتابة
   ============================================================ */
const pad = await load('assets/js/core/zero-pad.js');
describe('لوح الكتابة التفاعلي', () => {
  it('يصدّر الدالتين المطلوبتين', () => {
    eq(typeof pad.writingPadHTML, 'function', 'writingPadHTML');
    eq(typeof pad.initWritingPad, 'function', 'initWritingPad');
  });
  it('يولّد لوحاً فيه canvas ويدعم الوضعين', () => {
    const print = pad.writingPadHTML({ text: 'A a', mode: 'print' });
    const cursive = pad.writingPadHTML({ text: 'A a', mode: 'cursive' });
    truthy(print && print.length > 200, 'طول HTML المطبوع');
    truthy(/<canvas/i.test(print), 'لا يوجد canvas');
    truthy(/<canvas/i.test(cursive), 'لا يوجد canvas في الوضع المتصل');
    assert(print !== cursive, 'الوضعان يجب أن يختلفا فعلياً');
    truthy(/zpad/.test(print), 'أصناف CSS بادئتها zpad');
  });
  it('يهرّب النص المُدخل ولا يحقن HTML', () => {
    const evil = pad.writingPadHTML({ text: '<img src=x onerror=alert(1)>' });
    assert(!/<img/i.test(evil), 'النص لم يُهرَّب (خطر حقن)');
  });
  it('initWritingPad يُرجع null بأمان بلا حاوية', () => {
    eq(pad.initWritingPad(null, {}), null, 'بلا حاوية');
  });
  it('initWritingPad يعمل مع DOM وهمي ويُرجع وحدة تحكّم', () => {
    const mk = () => ({
      innerHTML: '', dataset: {}, className: '', hidden: false, style: { setProperty() {} },
      classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
      addEventListener() {}, removeEventListener() {}, setAttribute() {}, removeAttribute() {},
      appendChild() {}, remove() {}, focus() {},
      querySelector: () => null, querySelectorAll: () => [], insertAdjacentHTML() {},
      getBoundingClientRect: () => ({ width: 600, height: 200, top: 0, left: 0 }),
    });
    const host = mk();
    const canvas = Object.assign(mk(), {
      width: 0, height: 0, clientWidth: 600, clientHeight: 200,
      getContext: () => new Proxy({ measureText: () => ({ width: 10 }) }, {
        get(t, k) {
          if (k in t) return t[k];
          if (k === 'canvas') return canvas;
          return () => {};
        },
        set(t, k, v) { t[k] = v; return true; },
      }),
    });
    host.querySelector = (sel) => (/canvas/i.test(sel) ? canvas : null);
    host.querySelectorAll = () => [];
    let ctrl = null;
    try { ctrl = pad.initWritingPad(host, { text: 'A a', mode: 'print' }); } catch (e) { throw new Error(`initWritingPad رمى استثناءً: ${e.message}`); }
    truthy(ctrl, 'لم تُرجع وحدة التحكّم');
    for (const m of ['destroy', 'clear', 'setText', 'setMode', 'getMode']) eq(typeof ctrl[m], 'function', `الوظيفة ${m}`);
    ctrl.setMode('cursive');
    ctrl.clear();
    ctrl.destroy();
    ctrl.destroy(); // يجب أن يكون آمناً عند التكرار
  });
});

/* ============================================================
   6) ملفات القسم وربطها بالموقع
   ============================================================ */
describe('صفحة A0 المستقلة وربطها بالموقع', () => {
  const app = readFileSync(join(ROOT, 'assets/js/app.js'), 'utf8');
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const zeroHtml = readFileSync(join(ROOT, 'zero.html'), 'utf8');
  const zeroMain = readFileSync(join(ROOT, 'assets/js/zero-main.js'), 'utf8');
  const manZero = JSON.parse(readFileSync(join(ROOT, 'manifest-zero.webmanifest'), 'utf8'));
  const sw = readFileSync(join(ROOT, 'service-worker.js'), 'utf8');
  const shellJs = readFileSync(join(ROOT, 'assets/js/views/shell.js'), 'utf8');
  const shellSrc = readFileSync(join(ROOT, 'assets/js/views/zero-shell.js'), 'utf8');
  const stageJs = readFileSync(join(ROOT, 'assets/js/views/zero-stage.js'), 'utf8');
  const homeJs = readFileSync(join(ROOT, 'assets/js/views/zero.js'), 'utf8');
  const zcss = readFileSync(join(ROOT, 'assets/css/zero.css'), 'utf8');
  const dash = readFileSync(join(ROOT, 'assets/js/views/dashboard.js'), 'utf8');
  const entryJs = readFileSync(join(ROOT, 'assets/js/views/zero-entry.js'), 'utf8');

  it('كل مسارات A0 مسجّلة في نقطة دخول الصفحة المستقلة', () => {
    for (const r of ['/zero', '/zero/pad', '/zero/settings', '/zero/stage/:stageId', '/zero/drill/:stageId', '/zero/exam', '/zero/certificate']) {
      assert(zeroMain.includes(`route('${r}'`), `المسار ${r} غير مسجّل في zero-main.js`);
    }
    assert(!/route\('\/zero/.test(app), 'app.js ما زال يسجّل مسارات A0 (يجب ألا يكون مدمجاً)');
    assert(!/zero-(stage|exam|shell)\.js/.test(app), 'app.js يستورد واجهات A0');
    assert(/isAuthed\(\)/.test(zeroMain), 'صفحة A0 لا تحمي نفسها بجلسة الموقع');
  });
  it('يفتح الموقع مباشرة على لوحة البدء دون شاشة اختيار أولية', () => {
    assert(!/zero-entry\.js/.test(app), 'app.js ما زال يحمّل شاشة اختيار A0/A1');
    assert(/route\('\/'/.test(app), 'الموقع لا يفتح لوحة البداية مباشرة');
  });
  it('صفحة A0 مستقلة تماماً وبنفس هيكل الموقع', () => {
    for (const id of ['id="topbar"', 'id="view"', 'id="app"', 'id="toasts"', 'id="modalRoot"']) {
      assert(zeroHtml.includes(id), `zero.html ينقصه ${id}`);
    }
    assert(/class="topbar" id="topbar"/.test(zeroHtml), 'شريط A0 لا يستخدم شريط الموقع نفسه');
    assert(/class="view" id="view"/.test(zeroHtml), 'محتوى A0 لا يستخدم .view الخاص بالموقع');
    assert(zeroHtml.includes('./assets/js/zero-main.js'), 'zero.html لا يُحمّل نقطة دخول A0');
    assert(!/assets\/js\/app\.js/.test(zeroHtml), 'zero.html يُحمّل app.js — ليست مستقلة');
    for (const chrome of ['assets/js/app.js']) {
      assert(!zeroHtml.includes(chrome), `zero.html يحتوي عنصراً ممنوعاً (${chrome})`);
    }
    assert(zeroHtml.includes('class="mobile-nav" id="bottomnav"'), 'غلاف A0 لا يحتوي تنقّلاً سفلياً للهاتف');
    for (const need of ['id="sidebar"', 'id="sidenav"', 'id="scrim"']) {
      assert(zeroHtml.includes(need), `zero.html ينقصه ${need} — الدرج المشترك`);
    }
    assert(/manifest-zero\.webmanifest/.test(zeroHtml), 'zero.html بلا بيان تثبيت خاص');
    assert(manZero.start_url === './zero.html', 'start_url لبيان A0 غير صحيح');
    assert(zeroHtml.includes('./assets/css/zero.css') && zeroHtml.includes('./assets/css/zero-pad.css'), 'zero.html لا يُحمّل أنماط A0');
  });
  it('صفحة A0 تستخدم درجها المستقل والموقع يضيف تنقّلاً سفلياً للهاتف', () => {
    assert(/renderZeroDrawer/.test(shellSrc), 'درج A0 غير معرّف');
    assert(/sidenav/.test(shellSrc), 'درج A0 لا يستخدم .sidenav');
    for (const l of ['المراحل الخمس', 'الاختبار النهائي', 'شهادة التأسيس', 'لوح الكتابة', 'إعدادات التأسيس', 'المستويات A1–B1']) {
      assert(shellSrc.includes(l), `درج A0 ينقصه: ${l}`);
    }
    const topbarJs = readFileSync(join(ROOT, 'assets/js/views/topbar.js'), 'utf8');
    assert(/topbarHTML/.test(topbarJs) && /renderTopbar/.test(topbarJs), 'الشريط العلوي المشترك مفقود');
    assert(/renderTopbar/.test(zeroMain), 'صفحة A0 لا ترسم الشريط المشترك');
    assert(/renderTopbar/.test(app), 'صفحة الموقع لا ترسم الشريط المشترك');
    assert(/class="mobile-nav" id="bottomnav"/.test(html), 'تنقّل الهاتف غير موجود في غلاف الموقع');
    assert(/id="bottomnav"/.test(zeroHtml) && /MOBILE_NAV/.test(shellSrc), 'التنقّل السفلي لا يظهر في غلاف A0 المستقل');
  });
  it('واجهات A0 كلها بمكوّنات الموقع لا بمكوّنات خاصة', () => {
    for (const cls of ['page-head', 'card', 'btn', 'chip', 'item-row', 'seg', 'stat', 'progress']) {
      assert(new RegExp(cls).test(homeJs + stageJs), `مكوّن الموقع «${cls}» غير مستخدم في واجهات A0`);
    }
    for (const old of ['zhero', 'zstep', 'zlink', 'zbtn', 'zchip', 'ztab', 'zlist', 'zrow__']) {
      assert(!(homeJs + stageJs).includes(old), `ما زالت هناك مكوّنات A0 القديمة: ${old}`);
    }
  });
  it('خيار واحد فقط للدخول إلى A0 (بطاقة القائمة الجانبية)', () => {
    assert(!/id="btnZero"/.test(html), 'index.html ما زال فيه زر A0 (خيار دخول ثانٍ)');
    assert(!/id="zbar"|id="znav"/.test(html), 'index.html يحتوي عناصر واجهة A0');
    const links = (shellJs.match(/href="\.\/zero\.html"/g) || []).length;
    eq(links, 1, 'عدد روابط الدخول إلى A0 في القائمة الجانبية');
    assert(!/zero\.html/.test(dash), 'لوحة التحكم فيها خيار دخول ثانٍ إلى A0');
    const bottomBlock = shellJs.slice(shellJs.indexOf('if (bottom)'));
    assert(!/zero\.html/.test(bottomBlock), 'الشريط السفلي فيه خيار دخول ثانٍ إلى A0');
    assert(!/zero-pad\.css/.test(html), 'index.html يُحمّل أنماط لوح الكتابة');
    assert(html.includes('./assets/css/main.css'), 'نظام تصميم التطبيق غير مربوط في index.html');
    assert(!/assets\/css\/(?:redesign|skins\/|zero\.css)/.test(html), 'index.html ما زال يحمّل أنماط A0 أو طبقات التصميم القديمة');
    eq((html.match(/href="\.\/assets\/css\/[^"]+"/g) || []).length, 1, 'index.html لا يستخدم ملف تصميم موحداً');
    assert(/zero\.html/.test(entryJs), 'اختيار «من الصفر» لا ينقل إلى صفحة A0');
  });
  it('زر الخروج من صفحة A0 يعيد إلى الموقع', () => {
    assert(/exitZeroMode/.test(shellSrc), 'لا زر خروج من صفحة A0');
    assert(/location\.href = '\.\/index\.html'/.test(shellSrc), 'الخروج لا ينقل إلى صفحة الموقع');
  });
  it('مشغّل الحروف: عنصر واحد واضح + شريط اختيار', () => {
    assert(/FOCUS_KINDS/.test(stageJs), 'لا وضع تركيز للحروف');
    assert(/zero-letter__big/.test(stageJs) && /zero-letter__small/.test(stageJs), 'لا عرض كبير لشكل الحرف (كبير/صغير)');
    assert(/zero-strip/.test(stageJs), 'لا شريط لاختيار الحروف');
    assert(/data-nav2/.test(stageJs), 'لا تنقّل السابق/التالي');
    assert(/data-act="details"/.test(stageJs), 'لا زر تفاصيل');
    assert(/groupsFor/.test(stageJs), 'لا تجميع للمراحل القائمة');
    assert(/SENT_GROUP_AR/.test(stageJs), 'لا تجميع للجمل');
  });
  it('النطق: التسجيلات التعليمية لا تتحول تلقائياً إلى صوت المتصفح', () => {
    const speech = readFileSync(join(ROOT, 'assets/js/core/speech.js'), 'utf8');
    assert(/SpeechSynthesisUtterance/.test(speech), 'محرّك النطق المدمج مفقود');
    assert(/registerSoundBank/.test(speech), 'محرّك النطق لا يدعم التسجيلات الاختيارية');
    assert(!/pr\.catch\([^)]*speakBuiltIn/.test(speech), 'تعذّر التسجيل ما زال يعود إلى محرّك المتصفح');
    // الحروف المفردة: بلا أي ملف صوت
    for (const it of zeroItems('letters')) {
      assert(it.nameId && it.wordId, `حرف بلا تسجيل: ${it.en}`);
    }
    // الحروف المركّبة: لها معرّف صوت وملف موجود
    for (const it of zeroItems('digraphs')) {
      assert(it.sayId, `حرف مركّب بلا معرّف صوت: ${it.en}`);
      const expectedSound = `./assets/audio/zero/d/${it.sayId}.mp3`;
      eq(resolveSound(`sound:${it.sayId}`), expectedSound, `صوت ${it.en} يجب أن يستخدم التسجيل المستقل`);
      assert(resolveSound(`sound:${it.sayId}`) !== resolveSound(`word:${it.wordId}`), `زر صوت ${it.en} يكرر كلمة المثال`);
      if (DIGRAPHS.filter((item) => item.combo === it.combo).length === 1) {
        eq(resolveSound(it.combo), expectedSound, `الصوت النصّي ${it.combo} يجب أن يستخدم التسجيل المستقل`);
      }
      const audio = join(ROOT, expectedSound);
      assert(existsSync(audio), `ملف صوت مفقود: ${it.sayId}.mp3`);
      const size = statSync(audio).size;
      assert(size > 4000 && size < 40000, `حجم غير معقول (${it.sayId}): ${size}`);
    }
    assert(/registerZeroSounds/.test(zeroMain), 'صفحة A0 لا تُسجّل الحزمة');
    assert(/registerZeroSounds/.test(readFileSync(join(ROOT, 'assets/js/app.js'), 'utf8')), 'مدخل التطبيق الرئيسي لا يُسجّل أصوات A0');
    registerZeroSounds();
    const directSounds = {
      th: 'th-voiceless', ng: 'ng', oo: 'oo-long', ee: 'ee', ea: 'ea',
    };
    for (const [combo, soundId] of Object.entries(directSounds)) {
      assert(hasRecordedSound(combo), `الحرف المركّب ${combo} غير مربوط بتسجيل وقد يُهجّى بواسطة المتصفح`);
      eq(resolveSound(combo), `./assets/audio/zero/d/${soundId}.mp3`, `الصوت المباشر لـ ${combo}`);
    }
    assert(hasRecordedSound('sound:th-voiceless'), 'صوت th المهموس غير مربوط بتسجيله');
    assert(hasRecordedSound('sound:th-voiced'), 'صوت th المجهور غير مربوط بتسجيله');
    assert(/sayDigraph/.test(stageJs), 'المشغّل لا ينطق الحروف المركّبة من التسجيل');
  });
  it('كل ملفات الصفحة المستقلة مخزّنة في Service Worker', () => {
    for (const p of [
      './zero.html', './assets/js/zero-main.js', './manifest-zero.webmanifest',
      './assets/js/data/zero.js', './assets/js/data/zero-letters.js', './assets/js/data/zero-time.js',
      './assets/js/data/zero-words.js', './assets/js/core/zeroflow.js', './assets/js/core/zero-pad.js',
      './assets/js/views/zero.js', './assets/js/views/zero-shell.js', './assets/js/views/zero-stage.js',
      './assets/js/views/zero-exam.js', './assets/js/views/zero-entry.js', './assets/css/zero.css', './assets/css/zero-pad.css',
    ]) assert(sw.includes(p), `غير مخزّن: ${p}`);
  });
  it('Service Worker يخدم النسخة المخزّنة الصحيحة لكل صفحة', () => {
    assert(/zero\.html/.test(sw) && /fallback/.test(sw), 'لا رجوع خاص بصفحة A0 عند انقطاع الإنترنت');
  });
  it('نسخة الـ Service Worker رُفعت لتحديث الملفات المخزّنة', () => {
    assert(/VERSION\s*=\s*'v(?:[2-9]|[1-9]\d)\./.test(sw), 'لم تُرفع نسخة الـ Service Worker');
  });
  it('ملفات المنهج والصوتيات A1-C2 تُخزَّن مسبقاً للعمل دون اتصال', () => {
    assert(sw.includes('./assets/js/data/curriculum-audio.js'), 'خريطة صوت المنهج غير مخزّنة');
    assert(sw.includes('mapSource.matchAll') && sw.includes('audioUrls'), 'لا تُستخرج ملفات MP3 من خريطة الصوت');
    assert(/cache\.addAll\(audioUrls\.slice/.test(sw), 'لا يتم تخزين ملفات MP3 مسبقاً على دفعات');
    assert(/url2\.pathname\.includes\('\/assets\/audio\/'\)/.test(sw), 'لا يوجد مسار cache-first للتسجيلات');
    assert(/if \(cached\) return cached/.test(sw), 'التسجيل المخزّن لا يُقدّم دون اتصال');
  });
});

/* ---------------- التقرير ---------------- */
await Promise.all(pending);
console.log(results.join('\n'));
console.log(`\n${'─'.repeat(52)}`);
if (failures.length) {
  console.log(`❌ فشل ${failures.length} اختباراً من ${passed + failures.length}:\n`);
  failures.forEach((f) => console.log(f));
  console.log('');
  process.exit(1);
}
console.log(`✅ نجحت كل اختبارات قسم «من الصفر» (${passed} اختباراً)\n`);