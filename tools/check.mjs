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
