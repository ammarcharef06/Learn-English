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
// Keep the app behind its optional lock while importing modules in this DOM-free harness.
localStorage.setItem('lea.settings.v1', JSON.stringify({ security: { lockEnabled: true } }));
localStorage.setItem('lea.auth.v1', JSON.stringify({ hash: 'test-hash', algo: 'v2', salt: 'test', isDefault: false }));
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
  if (LEVELS.length !== 2 || LEVELS.some((level) => !['a1', 'a2'].includes(level.id))) bad('المستويات النشطة يجب أن تكون A1 وA2 فقط');
  if (ALL_UNITS.some((unit) => !['a1', 'a2'].includes(unit.levelId))) bad('يوجد مستوى مستقبلي ضمن الوحدات النشطة');
  if (READINGS.length !== 9 || READINGS.some((reading) => !['a1', 'a2'].includes(reading.level))) bad('المطالعات النشطة يجب أن تخص A1 وA2 فقط');

  const unitIds = new Set();
  for (const u of ALL_UNITS) {
    if (unitIds.has(u.id)) bad(`معرّف وحدة مكرر: ${u.id}`);
    unitIds.add(u.id);
    for (const component of ['grammar', 'vocabulary', 'phonetics', 'arabic_l1_transfers', 'academic_focus']) {
      if (!Array.isArray(u[component])) bad(`الوحدة ${u.id} تفتقد الحقل ${component}`);
    }
    if ('vocab' in u) bad(`الوحدة ${u.id} تستخدم الحقل القديم vocab`);
    if (!u.grammar.length) bad(`الوحدة ${u.id} بلا دروس قواعد`);
    if (u.vocabulary.length < 8) bad(`الوحدة ${u.id} مفرداتها قليلة (${u.vocabulary.length})`);
    const vocabSet = new Set();
    for (const v of u.vocabulary) {
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
  if (!list.includes('./assets/js/data/curriculum-advanced.js')) {
    bad('Service Worker لا يخزّن مخطط المنهج المتقدم للاستخدام دون اتصال');
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
  for (const need of ['id="view"', 'id="lockScreen"', 'id="toasts"', 'id="modalRoot"', 'id="topbar"', 'id="sidebar"', 'id="scrim"', 'assets/js/app.js']) {
    if (!html.includes(need)) bad(`index.html ينقصه: ${need}`);
  }
} catch (e) { bad(`فشل فحص index.html: ${e.message}`); }

/* ---------- 9. قسم «من الصفر» (A0): سلامة المحتوى ---------- */
const ARABIC_PRON = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\u060C\u061B\u061F\u0640\u064B-\u0652\u0670\u06D6-\u06ED.,!؟:؛'"()\-·…0-9%\/|]+$/;
try {
  const z = await import(pathToFileURL(join(ROOT, 'assets/js/data/zero.js')).href);
  const T = z.ZERO_TOTALS;
  ok(`قسم A0: ${z.ZERO_STAGES.length} مراحل · ${T.items} عنصراً · ${T.letters} حرفاً · ${T.digraphs} مركّباً · ${T.words} كلمة · ${T.sentences} جملة · ${T.readings} قراءات`);

  if (z.ZERO_STAGES.length !== 5) bad(`عدد مراحل A0 ${z.ZERO_STAGES.length} بدل 5`);
  if (z.ZERO_STAGES.some((stage) => ['digraphs', 'words', 'reading'].includes(stage.id))) bad('A0 ما زال يتضمن محتوى نُقل إلى A1');
  if (z.LETTERS.length !== 26) bad(`عدد حروف A0 ${z.LETTERS.length} بدل 26`);
  if (z.DIGRAPHS.length !== 12 || T.digraphs !== 0) bad('الحروف المركبة لم تُنقل بالكامل من المسار النشط A0');
  if (z.WORD_GROUPS.length !== 8) bad(`عدد مجموعات الكلمات ${z.WORD_GROUPS.length} بدل 8`);
  if (z.SENTENCES.length !== 40 || T.sentences !== 15) bad('بيانات الجمل المنقولة أو عدد عبارات A0 غير صحيح');
  if (z.READINGS.length !== 4 || T.readings !== 0) bad('بيانات القراءات المنقولة أو عدد قراءات A0 غير صحيح');
  if (z.DAYS.length !== 7 || z.MONTHS.length !== 12 || z.SEASONS.length !== 4) bad('الأيام/الشهور/الفصول في A0 غير مكتملة');
  if (z.PRONOUNS.length !== 8 || z.TO_BE.length !== 3) bad('الضمائر أو أفعال to be في A0 غير مكتملة');
  if (z.ORDINALS.length !== 10) bad(`عدد الأرقام الترتيبية ${z.ORDINALS.length} بدل 10`);

  const nums = z.NUMBERS.map((x) => x.n);
  for (let i = 0; i <= 20; i++) if (!nums.includes(i)) bad(`رقم مفقود في بيانات التأسيس: ${i}`);
  for (const n of [30, 40, 50, 60, 70, 80, 90, 100]) if (!nums.includes(n)) bad(`رقم مفقود في بيانات التأسيس: ${n}`);

  const words = z.WORD_GROUPS.flatMap((g) => g.words.map((w) => w.en.toLowerCase()));
  if (words.length !== 120 || T.words !== 0) bad(`إجمالي الكلمات المنقولة ${words.length} أو بقيت في A0`);
  if (new Set(words).size !== words.length) bad('كلمات التأسيس المنقولة فيها تكرار');
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
  if (new Set(exam.map((q) => q.topic)).size < 5) bad('الاختبار النهائي لا يغطّي المراحل الخمس');
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
  if (a0.length !== 11) bad(`عدد شارات A0 ${a0.length} بدل 11`);
  for (const x of a0) {
    if (!x.icon || !x.ar || !x.en || !x.descAr || typeof x.check !== 'function') bad(`شارة A0 ناقصة: ${x.id}`);
  }
  if (!a0.some((x) => x.id === 'a0-certificate')) bad('شارة شهادة التأسيس مفقودة');
  if (!a0.some((x) => x.id === 'a0-exam90')) bad('شارة الاختبار النهائي مفقودة');
  ok(`شارات A0: ${a0.length} شارة (تشمل الاختبار النهائي وشهادة التأسيس)`);
} catch (e) { bad(`فشل فحص شارات A0: ${e.message}`); }

/* ---------- 11. صفحة محو الأمية الحالية: عقد التشغيل والأصول ---------- */
try {
  const zeroHtml = readFileSync(join(ROOT, 'zero.html'), 'utf8');
  const literacyHtml = readFileSync(join(ROOT, 'literacy.html'), 'utf8');
  const enginePath = 'assets/js/literacy/engine.js';
  const stylePath = 'assets/css/literacy.css';
  const dataPath = 'curriculum/literacy/literacy-l0-l1.json';
  const manifestPath = 'curriculum/literacy/audio-manifest.json';
  for (const p of [enginePath, stylePath, dataPath, manifestPath]) {
    if (!existsSync(join(ROOT, p))) bad(`مسار محو الأمية يفتقد الملف: ${p}`);
  }
  if (!zeroHtml.includes('./assets/js/literacy/engine.js')) bad('zero.html لا يشغّل محرّك محو الأمية الحالي');
  if (!zeroHtml.includes('./assets/css/literacy.css')) bad('zero.html لا يحمّل تنسيقات محو الأمية');
  if (!zeroHtml.includes('id="literacy-app"')) bad('zero.html يفتقد حاوية التطبيق literacy-app');
  if (!literacyHtml.includes('./zero.html')) bad('literacy.html لا يوجّه إلى صفحة البداية الحالية');
  if (zeroHtml.includes('./assets/js/zero-main.js')) bad('zero.html يشغّل نقطتي دخول متعارضتين');
  if (zeroHtml.includes('./assets/js/app.js')) bad('صفحة محو الأمية تشغّل التطبيق العام داخل نقطة دخول مستقلة');
  const engineSrc = readFileSync(join(ROOT, enginePath), 'utf8');
  if (!engineSrc.includes('registerZeroSounds') || !engineSrc.includes('bootLiteracy')) bad('محرّك محو الأمية لا يسجل بنك الصوت أو لا يوفّر إقلاعًا قابلًا للاختبار');
  if (!engineSrc.includes('data-speak')) bad('واجهة الحروف لا تعرض أدوات الاستماع للتسجيلات الموجودة');
  const literacyData = JSON.parse(readFileSync(join(ROOT, dataPath), 'utf8'));
  const manifest = JSON.parse(readFileSync(join(ROOT, manifestPath), 'utf8'));
  if (!Array.isArray(literacyData.stages) || literacyData.stages.length < 4) bad('مراحل محو الأمية غير مكتملة');
  if (!Array.isArray(literacyData.letters) || literacyData.letters.length !== 26) bad('قائمة الأبجدية يجب أن تحتوي 26 حرفًا');
  if (manifest.pronunciationVariety?.source?.module !== 'assets/js/core/zero-audio.js') bad('مصدر الصوت في البيان لا يطابق بنك التسجيلات المضمن');
  const swSrc = readFileSync(join(ROOT, 'service-worker.js'), 'utf8');
  for (const p of ['./zero.html', './assets/js/literacy/engine.js', './assets/css/literacy.css', './curriculum/literacy/literacy-l0-l1.json', './curriculum/literacy/audio-manifest.json', './assets/js/core/zero-audio.js', './assets/js/data/zero-audio-map.js']) {
    if (!swSrc.includes(p)) bad(`Service Worker لا يخزّن أصل محو الأمية: ${p}`);
  }
  ok('صفحة محو الأمية: نقطة دخول واحدة، بيانات 26 حرفًا، بنك صوت مسجّل، وأصول التخزين المؤقت');
} catch (e) { bad(`فشل فحص صفحة محو الأمية: ${e.message}`); }

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
