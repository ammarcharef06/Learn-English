/**
 * فحص سلامة المشروع — يعمل بدون أي مكتبات خارجية
 * الاستخدام:  node tools/check.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, extname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const notes = [];
const ok = (msg) => notes.push(`  ✅ ${msg}`);
const bad = (msg) => problems.push(`  ❌ ${msg}`);

/* ---------- 1. جرد الملفات ---------- */
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    // نتجاهل المجلدات المخفية (مثل .git و .github) والمجلدات المؤقتة
    if (name.startsWith('.') && name !== '.github') continue;
    if (name === 'node_modules') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}
const files = walk(ROOT);
const rel = (f) => relative(ROOT, f).replace(/\\/g, '/');
const jsFiles = files.filter((f) => extname(f) === '.js' || extname(f) === '.mjs');
console.log(`\n📦 الملفات: ${files.length} (منها ${jsFiles.length} ملف JS)\n`);

/* ---------- 2. فحص الاستيراد/التصدير ---------- */
const exportCache = new Map();
function exportsOf(file) {
  if (exportCache.has(file)) return exportCache.get(file);
  const src = readFileSync(file, 'utf8');
  const names = new Set();
  for (const m of src.matchAll(/export\s+(?:async\s+)?(?:function|class)\s+([A-Za-z0-9_$]+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+(?:const|let|var)\s+([A-Za-z0-9_$]+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s*\{([^}]+)\}/g)) {
    m[1].split(',').forEach((part) => {
      const p = part.trim().split(/\s+as\s+/);
      const name = (p[1] || p[0]).trim();
      if (name) names.add(name);
    });
  }
  exportCache.set(file, names);
  return names;
}

let importCount = 0;
for (const file of jsFiles) {
  if (rel(file) === 'service-worker.js') continue;
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/import\s+(?:([\s\S]*?)\s+from\s+)?['"]([^'"]+)['"]/g)) {
    const clause = (m[1] || '').trim();
    const spec = m[2];
    if (!spec.startsWith('.')) continue;
    importCount++;
    const target = resolve(dirname(file), spec);
    if (!existsSync(target)) { bad(`${rel(file)} → ملف مفقود: ${spec}`); continue; }
    if (!clause || clause.startsWith('*')) continue;
    const braced = clause.match(/\{([^}]*)\}/);
    if (!braced) continue;
    const exported = exportsOf(target);
    for (const rawName of braced[1].split(',')) {
      const name = rawName.trim().split(/\s+as\s+/)[0].trim();
      if (!name) continue;
      if (!exported.has(name)) bad(`${rel(file)} → «${name}» غير مُصدَّر من ${rel(target)}`);
    }
  }
}
if (importCount) ok(`تم التحقق من ${importCount} استيراداً داخلياً`);

/* ---------- 3. تحميل الوحدات فعلياً (مع بيئة DOM مبسطة) ---------- */
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
  addEventListener() {}, removeEventListener() {},
  querySelector: () => null, querySelectorAll: () => [],
  createElement: elStub, getElementById: () => null,
};
globalThis.window = {
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  location: { href: 'https://example.com/Learn-English/index.html#/', hash: '#/', replace() {}, pathname: '/Learn-English/index.html' },
  scrollTo() {}, localStorage: globalThis.localStorage,
};
globalThis.location = globalThis.window.location;
try {
  Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'node-check', language: 'ar' }, configurable: true, writable: true });
} catch {
  notes.push('  ℹ️ تعذّر استبدال navigator (بيئة Node محدودة) — سيُستخدم الأصل');
}
globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
globalThis.self = {
  addEventListener() {}, skipWaiting() {}, clients: { claim() {} },
  registration: { navigationPreload: null }, location: { href: 'https://example.com/Learn-English/service-worker.js', origin: 'https://example.com' },
};
globalThis.importScripts = () => {};
globalThis.caches = { open: async () => ({ add: async () => {}, match: async () => null, put: async () => {} }), keys: async () => [] };

let loaded = 0;
for (const file of jsFiles) {
  // نتجاهل ملفات مجلد الأدوات: فهي تُشغّل نفسها عند الاستيراد
  if (rel(file).startsWith('tools/')) continue;
  try {
    await import(pathToFileURL(file).href);
    loaded++;
  } catch (err) {
    bad(`فشل تحميل ${rel(file)}: ${err.message}`);
  }
}
ok(`تم تحميل ${loaded} وحدة JS بنجاح`);

/* ---------- 4. سلامة بيانات المنهج ---------- */
try {
  const { LEVELS, ALL_UNITS, READINGS, curriculumStats } = await import(pathToFileURL(join(ROOT, 'assets/js/data/curriculum.js')).href);
  const stats = curriculumStats();
  ok(`المنهج: ${LEVELS.length} مستويات · ${stats.units} وحدة · ${stats.vocab} كلمة · ${stats.grammar} درس قواعد · ${stats.sentences} جملة`);
  if (READINGS.length !== 12) bad(`عدد المطالعات ${READINGS.length} بدل 12`);

  const unitIds = new Set();
  for (const u of ALL_UNITS) {
    if (unitIds.has(u.id)) bad(`معرّف وحدة مكرر: ${u.id}`);
    unitIds.add(u.id);
    if (!u.grammar.length) bad(`الوحدة ${u.id} بلا دروس قواعد`);
    if (u.vocab.length < 8) bad(`الوحدة ${u.id} مفرداتها قليلة (${u.vocab.length})`);
    const vocabSet = new Set();
    for (const v of u.vocab) {
      if (vocabSet.has(v.en.toLowerCase())) bad(`كلمة مكررة في ${u.id}: ${v.en}`);
      vocabSet.add(v.en.toLowerCase());
      if (!v.en || !v.ar) bad(`مفردة ناقصة في ${u.id}: ${JSON.stringify(v).slice(0, 60)}`);
      if (v.example && !String(v.example.en).toLowerCase().includes(String(v.en).toLowerCase())) {
        bad(`مثال لا يحتوي الكلمة (${u.id}): ${v.en}`);
      }
    }
    for (const g of u.grammar) {
      if (!g.explain || !(g.examples || []).length) bad(`درس قواعد ناقص في ${u.id}: ${g.title}`);
    }
    for (const s of u.sentences) if (!s.en || !s.ar) bad(`جملة ناقصة في ${u.id}`);
  }
  for (const r of READINGS) {
    if (!r.text || !r.textAr) bad(`مطالعة ناقصة: ${r.id}`);
    if ((r.questions || []).length < 3) bad(`أسئلة قليلة في ${r.id}`);
    for (const q of r.questions || []) {
      if (q.options.length !== 4 || q.answer < 0 || q.answer > 3) bad(`سؤال غير صالح في ${r.id}`);
    }
  }
} catch (e) { bad(`فشل فحص المنهج: ${e.message}`); }

/* ---------- 5. سلامة المراجع ---------- */
try {
  const ref = await import(pathToFileURL(join(ROOT, 'assets/js/data/reference.js')).href);
  ok(`المراجع: ${ref.PRONOUN_GROUPS.length} مجموعة ضمائر · ${ref.CONNECTORS.length} أداة ربط · ${ref.QUESTION_WORDS.length} أداة سؤال · ${ref.KEY_EXAMPLES.length} مثالاً`);
  if (ref.PRONOUN_GROUPS.length !== 11) bad(`عدد مجموعات الضمائر ${ref.PRONOUN_GROUPS.length} بدل 11`);
  if (ref.CONNECTORS.length !== 40) bad(`عدد أدوات الربط ${ref.CONNECTORS.length} بدل 40`);
  if (ref.QUESTION_WORDS.length !== 40) bad(`عدد أدوات السؤال ${ref.QUESTION_WORDS.length} بدل 40`);
  for (const g of ref.PRONOUN_GROUPS) {
    for (const it of g.items) {
      if (!it.en || !it.ar) bad(`ضمير ناقص في ${g.id}`);
      if (!it.ex || !it.ex.en || !it.ex.ar) bad(`مثال ناقص للضمير ${it.en}`);
    }
  }
  for (const c of ref.CONNECTORS) if (!c.ex?.en || !c.ex?.ar) bad(`مثال ناقص لأداة الربط ${c.en}`);
  for (const q of ref.QUESTION_WORDS) if (!q.ex?.en || !q.ex?.ar) bad(`مثال ناقص لأداة السؤال ${q.en}`);
} catch (e) { bad(`فشل فحص المراجع: ${e.message}`); }

/* ---------- 6. مولّد الأسئلة ---------- */
try {
  const qg = await import(pathToFileURL(join(ROOT, 'assets/js/core/quizgen.js')).href);
  const sources = ['all', 'pronouns', 'connectors', 'questions', 'vocab', 'sentences', 'reading', 'key', 'level:a1', 'level:a2', 'level:b1', 'unit:a1u1'];
  for (const src of sources) {
    const entries = qg.entriesForSource(src);
    if (!entries.length) bad(`المصدر «${src}» لا يعطي عناصر`);
  }
  let total = 0; const types = new Set();
  for (const t of ['mcq', 'fill', 'order', 'match', 'translate', 'listen']) {
    const qs = qg.buildQuestions({ source: 'pronouns', types: [t], count: 6 });
    if (!qs.length) bad(`نوع التمرين «${t}» لم يولّد أسئلة`);
    qs.forEach((q) => { types.add(q.type); total++; });
  }
  const rel = qg.buildRelationQuestions(6);
  if (!rel.length) bad('أسئلة جدول الضمائر لم تُولَّد');
  const mixed = qg.buildQuestions({ source: 'all', types: ['mcq', 'fill', 'order', 'translate', 'listen'], count: 20, adaptive: true });
  ok(`مولّد الأسئلة: ${total + rel.length + mixed.length} سؤالاً في ${types.size + 1} أنواع، والتدريب المختلط أنتج ${mixed.length}/20`);
  for (const q of mixed) {
    if (!q.options && q.ui !== 'input' && q.ui !== 'order' && q.ui !== 'match') bad(`سؤال بلا خيارات: ${q.type}`);
    if (q.options && q.options.filter((o) => o.correct).length !== 1) bad(`سؤال بخيارات غير سليمة: ${q.type}`);
  }
} catch (e) { bad(`فشل فحص مولّد الأسئلة: ${e.message}`); }

/* ---------- 7. قائمة الذاكرة المؤقتة في Service Worker ---------- */
try {
  const sw = readFileSync(join(ROOT, 'service-worker.js'), 'utf8');
  const list = [...sw.matchAll(/'(\.\/[^']+)'/g)].map((m) => m[1]).filter((p) => p !== './');
  let missing = 0;
  for (const p of list) {
    const target = join(ROOT, p.replace('./', ''));
    if (!existsSync(target) && !p.endsWith('/')) { bad(`Service Worker يشير إلى ملف غير موجود: ${p}`); missing++; }
  }
  ok(`Service Worker: ${list.length} ملفاً للتخزين المؤقت${missing ? '' : ' — كلها موجودة'}`);
} catch (e) { bad(`فشل فحص Service Worker: ${e.message}`); }

/* ---------- 8. مراجع index.html ---------- */
try {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)].map((m) => m[1]);
  for (const r of refs) {
    const target = join(ROOT, r.replace('./', '').split('#')[0]);
    if (!existsSync(target)) bad(`index.html يشير إلى ملف غير موجود: ${r}`);
  }
  ok(`index.html: ${refs.length} مرجعاً محلياً — كلها موجودة`);
  for (const need of ['id="view"', 'id="lockScreen"', 'id="toasts"', 'id="modalRoot"', 'id="bottomnav"', 'assets/js/app.js']) {
    if (!html.includes(need)) bad(`index.html ينقصه: ${need}`);
  }
} catch (e) { bad(`فشل فحص index.html: ${e.message}`); }

/* ---------- 9. قسم «من الصفر» (A0): سلامة المحتوى ---------- */
const ARABIC_PRON = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\u060C\u061B\u061F\u0640\u064B-\u0652\u0670\u06D6-\u06ED.,!؟:؛'"()\-·…0-9%\/|]+$/;
try {
  const z = await import(pathToFileURL(join(ROOT, 'assets/js/data/zero.js')).href);
  const T = z.ZERO_TOTALS;
  ok(`قسم A0: ${z.ZERO_STAGES.length} مراحل · ${T.items} عنصراً · ${T.letters} حرفاً · ${T.digraphs} مركّباً · ${T.words} كلمة · ${T.sentences} جملة · ${T.readings} قراءات`);

  if (z.ZERO_STAGES.length !== 8) bad(`عدد مراحل A0 ${z.ZERO_STAGES.length} بدل 8`);
  if (z.LETTERS.length !== 26) bad(`عدد حروف A0 ${z.LETTERS.length} بدل 26`);
  if (z.DIGRAPHS.length !== 12) bad(`عدد الحروف المركّبة ${z.DIGRAPHS.length} بدل 12`);
  if (z.WORD_GROUPS.length !== 8) bad(`عدد مجموعات الكلمات ${z.WORD_GROUPS.length} بدل 8`);
  if (z.SENTENCES.length !== 40) bad(`عدد جمل A0 ${z.SENTENCES.length} بدل 40`);
  if (z.READINGS.length !== 4) bad(`عدد قراءات A0 ${z.READINGS.length} بدل 4`);
  if (z.DAYS.length !== 7 || z.MONTHS.length !== 12 || z.SEASONS.length !== 4) bad('الأيام/الشهور/الفصول في A0 غير مكتملة');
  if (z.PRONOUNS.length !== 8 || z.TO_BE.length !== 3) bad('الضمائر أو أفعال to be في A0 غير مكتملة');
  if (z.ORDINALS.length !== 10) bad(`عدد الأرقام الترتيبية ${z.ORDINALS.length} بدل 10`);

  const nums = z.NUMBERS.map((x) => x.n);
  for (let i = 0; i <= 20; i++) if (!nums.includes(i)) bad(`رقم مفقود في A0: ${i}`);
  for (const n of [30, 40, 50, 60, 70, 80, 90, 100]) if (!nums.includes(n)) bad(`رقم مفقود في A0: ${n}`);

  const words = z.WORD_GROUPS.flatMap((g) => g.words.map((w) => w.en.toLowerCase()));
  if (words.length !== 120) bad(`إجمالي كلمات A0 ${words.length} بدل 120`);
  if (new Set(words).size !== words.length) bad('كلمات A0 فيها تكرار');
  for (const g of z.WORD_GROUPS) {
    if (g.words.length !== 15) bad(`مجموعة ${g.id} فيها ${g.words.length} كلمة بدل 15`);
    for (const w of g.words) if (!w.en || !w.ar || !w.pron || !w.emoji) bad(`كلمة ناقصة في A0 (${g.id}): ${w.en}`);
  }

  // نطق عربي لكل حرف وكل كلمة وكل جملة (شرط أساسي في هذا القسم)
  for (const l of z.LETTERS) {
    if (!l.nameAr || !l.soundAr || !l.word || !l.wordAr || !l.wordPronAr || !l.tipAr) bad(`حرف ناقص البيانات: ${l.id}`);
    if (!ARABIC_PRON.test(l.nameAr)) bad(`اسم الحرف ${l.id} ليس بحروف عربية: ${l.nameAr}`);
    if (!ARABIC_PRON.test(l.wordPronAr)) bad(`نطق كلمة الحرف ${l.id} ليس بحروف عربية: ${l.wordPronAr}`);
  }
  for (const d of z.DIGRAPHS) {
    if (!d.combo || !d.soundAr || !d.word || !d.wordPronAr) bad(`حرف مركّب ناقص: ${d.id}`);
    if (!ARABIC_PRON.test(d.wordPronAr)) bad(`نطق ${d.id} ليس بحروف عربية: ${d.wordPronAr}`);
  }
  for (const g of z.WORD_GROUPS) for (const w of g.words) if (!ARABIC_PRON.test(w.pron)) bad(`نطق الكلمة ${w.en} ليس بحروف عربية: ${w.pron}`);
  for (const s of z.SENTENCES) { if (!s.en || !s.ar || !s.pron) bad(`جملة A0 ناقصة: ${s.en}`); if (!ARABIC_PRON.test(s.pron)) bad(`نطق الجملة ليس بحروف عربية: ${s.en}`); }
  for (const l of z.LETTERS) if (!ARABIC_PRON.test(l.soundAr)) bad(`صوت الحرف ${l.id} ليس بحروف عربية: ${l.soundAr}`);

  for (const r of z.READINGS) {
    if (!r.titleEn || !r.titleAr) bad(`قراءة ناقصة العنوان: ${r.id}`);
    if (r.lines.length < 5 || r.lines.length > 7) bad(`قراءة ${r.id}: ${r.lines.length} أسطر (المطلوب 5–7)`);
    if (r.questions.length < 3 || r.questions.length > 4) bad(`قراءة ${r.id}: ${r.questions.length} أسئلة (المطلوب 3–4)`);
    for (const q of r.questions) {
      if (q.options.length !== 4 || new Set(q.options).size !== 4) bad(`خيارات غير سليمة في القراءة ${r.id}`);
      if (!(q.answer >= 0 && q.answer <= 3)) bad(`مؤشّر إجابة غير صالح في القراءة ${r.id}`);
    }
  }

  // معرّفات العناصر: فريدة داخل كل مرحلة (تكرارها يخلط سجل الإتقان)
  for (const st of z.ZERO_STAGES) {
    const items = z.zeroItems(st.id);
    if (!items.length) bad(`المرحلة ${st.id} بلا عناصر`);
    const keys = items.map((x) => x.key);
    if (new Set(keys).size !== keys.length) {
      const dup = keys.find((k, i) => keys.indexOf(k) !== i);
      bad(`معرّفات مكرّرة في المرحلة ${st.id}: ${dup}`);
    }
    if (z.zeroStageSize(st.id) !== items.length) bad(`حجم المرحلة ${st.id} غير متطابق`);
    /* كل عنصر له كلمة مثال يجب أن يحمل ترجمتها ونطقها بالحقول التي تقرأها الواجهة */
    for (const it of items) {
      if (!it.word) continue;
      if (!it.wordAr) bad(`كلمة المثال بلا ترجمة (${st.id}): ${it.key}`);
      if (!it.wordPronAr) bad(`كلمة المثال بلا نطق عربي (${st.id}): ${it.key}`);
    }
  }

  // تدريب 5 أسئلة بعد كل مرحلة + اختبار نهائي ~30 سؤالاً
  let stageQs = 0;
  for (const st of z.ZERO_STAGES) {
    const qs = z.zeroStageQuestions(st.id, 5);
    if (qs.length !== 5) bad(`المرحلة ${st.id} تولّد ${qs.length} أسئلة بدل 5`);
    for (const q of qs) {
      if (q.options.filter((o) => o.correct).length !== 1) bad(`سؤال بخيارات غير سليمة في ${st.id}: ${q.id}`);
      if (new Set(q.options.map((o) => o.label)).size !== q.options.length) bad(`خيارات مكرّرة في ${st.id}: ${q.id}`);
      if (!q.answerText || !q.explain) bad(`سؤال بلا إجابة/توضيح في ${st.id}: ${q.id}`);
    }
    stageQs += qs.length;
  }
  const exam = z.zeroExamQuestions(30);
  if (exam.length !== 30) bad(`الاختبار النهائي يولّد ${exam.length} سؤالاً بدل 30`);
  if (new Set(exam.map((q) => q.id)).size !== exam.length) bad('أسئلة الاختبار النهائي فيها تكرار');
  if (new Set(exam.map((q) => q.topic)).size < 6) bad('الاختبار النهائي لا يغطّي 6 مراحل على الأقل');
  ok(`أسئلة A0: ${stageQs} سؤال تدريب (5 لكل مرحلة) + ${exam.length} في الاختبار النهائي على ${new Set(exam.map((q) => q.topic)).size} مراحل`);

  // منطق الإتقان: 0% ثم 100% ثم التوصية بالانتقال إلى A1
  const st0 = z.zeroStats({});
  if (st0.percent !== 0 || st0.readyForA1) bad('إحصاءات A0 لا تبدأ من الصفر');
  const full = { zero: { stages: {}, letters: {}, words: {}, exam: { best: 100 } } };
  z.ZERO_STAGES.forEach((s) => { full.zero.stages[s.id] = { done: true }; });
  z.LETTERS.forEach((l) => { full.zero.letters[l.id] = true; });
  z.WORD_GROUPS.forEach((g) => g.words.forEach((w) => { full.zero.words[w.en] = true; }));
  const stFull = z.zeroStats(full);
  if (stFull.percent !== 100) bad(`نسبة الإتقان الكاملة ${stFull.percent} بدل 100`);
  if (!stFull.readyForA1) bad('التوصية بالانتقال إلى A1 لا تُفعَّل عند الإتقان');
  ok('منطق A0: 0% → 100% والشهادة والتوصية بالانتقال إلى A1 تعمل');
} catch (e) { bad(`فشل فحص قسم A0: ${e.message}`); }

/* ---------- 10. شارات A0 وشهادته ---------- */
try {
  const b = await import(pathToFileURL(join(ROOT, 'assets/js/data/badges.js')).href);
  const a0 = b.BADGES.filter((x) => String(x.id).startsWith('a0-'));
  if (a0.length !== 13) bad(`عدد شارات A0 ${a0.length} بدل 13`);
  for (const x of a0) {
    if (!x.icon || !x.ar || !x.en || !x.descAr || typeof x.check !== 'function') bad(`شارة A0 ناقصة: ${x.id}`);
  }
  if (!a0.some((x) => x.id === 'a0-certificate')) bad('شارة شهادة التأسيس مفقودة');
  if (!a0.some((x) => x.id === 'a0-exam90')) bad('شارة الاختبار النهائي مفقودة');
  ok(`شارات A0: ${a0.length} شارة (تشمل الاختبار النهائي وشهادة التأسيس)`);
} catch (e) { bad(`فشل فحص شارات A0: ${e.message}`); }

/* ---------- 11. صفحة «من الصفر» (A0) المستقلة ---------- */
try {
  const need = [
    'zero.html', 'manifest-zero.webmanifest',
    'assets/js/data/zero.js', 'assets/js/data/zero-letters.js', 'assets/js/data/zero-time.js', 'assets/js/data/zero-words.js',
    'assets/js/core/zeroflow.js', 'assets/js/core/zero-pad.js', 'assets/js/zero-main.js',
    'assets/js/views/zero.js', 'assets/js/views/zero-shell.js', 'assets/js/views/zero-stage.js',
    'assets/js/views/zero-exam.js', 'assets/js/views/zero-entry.js',
    'assets/css/zero.css', 'assets/css/zero-pad.css',
    'tools/test-zero.mjs',
  ];
  for (const p of need) if (!existsSync(join(ROOT, p))) bad(`ملف قسم A0 مفقود: ${p}`);

  /* ---------- صفحة A0 المستقلة: هيكلها الخاص بنفس ستايل الموقع ---------- */
  const zeroHtml = readFileSync(join(ROOT, 'zero.html'), 'utf8');
  for (const id of ['id="zbar"', 'id="view"', 'id="app"', 'id="toasts"', 'id="modalRoot"']) {
    if (!zeroHtml.includes(id)) bad(`zero.html ينقصه: ${id}`);
  }
  if (!zeroHtml.includes('./assets/js/zero-main.js')) bad('zero.html لا يُحمّل نقطة دخول A0 (zero-main.js)');
  if (/assets\/js\/app\.js/.test(zeroHtml)) bad('zero.html يُحمّل app.js — يجب أن تكون صفحة مستقلة تماماً');
  /* نفس هيكل الموقع (topbar/view) لكن بلا أي عنصر من تنقّل المستويات */
  for (const chrome of ['id="sidenav"', 'id="bottomnav"', 'class="sidebar"', 'zero-nav']) {
    if (zeroHtml.includes(chrome)) bad(`zero.html يحتوي عنصراً من مستويات الموقع (${chrome})`);
  }
  if (!/class="topbar" id="zbar"/.test(zeroHtml)) bad('zero.html لا يستخدم شريط الموقع نفسه (topbar)');
  if (!/rel="manifest" href="\.\/manifest-zero\.webmanifest"/.test(zeroHtml)) bad('zero.html بلا بيان تثبيت خاص');
  if (!zeroHtml.includes('./assets/css/zero.css') || !zeroHtml.includes('./assets/css/zero-pad.css')) bad('zero.html لا يُحمّل أنماط A0');
  if (!/data-zero="a0"/.test(zeroHtml)) bad('zero.html لا يضبط سمة القسم المستقل');

  /* ---------- نقطة دخول A0: مساراتها وتنقّلها ---------- */
  const zeroMain = readFileSync(join(ROOT, 'assets/js/zero-main.js'), 'utf8');
  for (const r of ['/zero', '/zero/pad', '/zero/settings', '/zero/stage/:stageId', '/zero/drill/:stageId', '/zero/exam', '/zero/certificate']) {
    if (!zeroMain.includes(`route('${r}'`)) bad(`مسار A0 غير مسجّل في zero-main.js: ${r}`);
  }
  if (!/isAuthed\(\)/.test(zeroMain)) bad('صفحة A0 لا تحمي نفسها بجلسة الموقع');
  const zeroShell = readFileSync(join(ROOT, 'assets/js/views/zero-shell.js'), 'utf8');
  if (!/class="seg zseg"/.test(zeroShell)) bad('تنقّل A0 لا يستخدم مكوّن الموقع (.seg)');
  for (const l of ['المراحل', 'الاختبار', 'الشهادة', 'إعدادات']) {
    if (!zeroShell.includes(l)) bad(`تنقّل A0 ينقصه: ${l}`);
  }

  /* ---------- الموقع الرئيسي: بلا دمج، وخيار واحد فقط للدخول ---------- */
  const app = readFileSync(join(ROOT, 'assets/js/app.js'), 'utf8');
  if (/route\('\/zero/.test(app)) bad('app.js ما زال يسجّل مسارات A0 — يجب أن تكون صفحة منفصلة');
  if (/zero-(stage|exam|shell)\.js/.test(app)) bad('app.js يستورد واجهات A0 — يجب فصلها تماماً');

  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  if (/id="zbar"|id="znav"|id="btnZero"/.test(html)) bad('index.html ما زال يحتوي عناصر واجهة A0');
  if (/zero-pad\.css/.test(html)) bad('index.html يُحمّل أنماط لوح الكتابة (خاص بصفحة A0)');
  if (!html.includes('./assets/css/zero.css')) bad('أنماط شاشة الدخول غير مربوطة في index.html');

  const shellSrc = readFileSync(join(ROOT, 'assets/js/views/shell.js'), 'utf8');
  const zeroLinks = (shellSrc.match(/href="\.\/zero\.html"/g) || []).length;
  if (zeroLinks !== 1) bad(`عدد روابط الدخول إلى A0 في القائمة الجانبية ${zeroLinks} بدل 1 (المطلوب خيار واحد فقط)`);
  const dash = readFileSync(join(ROOT, 'assets/js/views/dashboard.js'), 'utf8');
  if (/zero\.html/.test(dash)) bad('لوحة التحكم فيها خيار دخول ثانٍ إلى A0 — المطلوب خيار واحد');
  const bottomBlock = shellSrc.slice(shellSrc.indexOf('if (bottom)'));
  if (/zero\.html/.test(bottomBlock)) bad('الشريط السفلي فيه خيار دخول ثانٍ إلى A0 — المطلوب خيار واحد');

  const man = JSON.parse(readFileSync(join(ROOT, 'manifest-zero.webmanifest'), 'utf8'));
  if (man.start_url !== './zero.html') bad(`start_url لبيان A0 غير صحيح: ${man.start_url}`);
  if (!man.name || !man.icons?.length) bad('بيان A0 ناقص الاسم أو الأيقونات');

  const swSrc = readFileSync(join(ROOT, 'service-worker.js'), 'utf8');
  for (const p of ['./zero.html', './assets/js/zero-main.js', './manifest-zero.webmanifest']) {
    if (!swSrc.includes(p)) bad(`Service Worker لا يخزّن: ${p}`);
  }
  ok('صفحة A0 مستقلة تماماً بنفس ستايل الموقع، وخيار دخول واحد فقط من القائمة الجانبية');
} catch (e) { bad(`فشل فحص صفحة A0 المستقلة: ${e.message}`); }

/* ---------- التقرير ---------- */
console.log('نتائج الفحص:');
notes.forEach((n) => console.log(n));
if (problems.length) {
  console.log('\nمشاكل:');
  problems.forEach((p) => console.log(p));
  console.log(`\n❌ فشل الفحص: ${problems.length} مشكلة\n`);
  process.exit(1);
}
console.log('\n✅ كل الفحوصات ناجحة\n');
