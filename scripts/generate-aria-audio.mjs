#!/usr/bin/env node
/**
 * Generate a normal spoken-text MP3 with the project's historically recorded
 * voice ID. This is NOT a phoneme synthesizer and must not be used to fake
 * isolated IPA sounds.
 *
 * Install: python -m pip install edge-tts
 * Run: node scripts/generate-aria-audio.mjs --text="Hello, world." --out=assets/audio/zero/w/hello-world.mp3
 * Add --force only when intentionally replacing an existing file.
 */
import { spawnSync } from "node:child_process";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO_ROOT = resolve(ROOT, "assets/audio/zero");
const args = process.argv.slice(2);
const textArg = args.find(arg => arg.startsWith("--text="));
const outArg = args.find(arg => arg.startsWith("--out="));
const force = args.includes("--force");
const spokenText = textArg?.slice("--text=".length);
const requestedOutput = outArg?.slice("--out=".length);

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!spokenText?.trim()) fail('يلزم تمرير --text="النص الإنجليزي المراد نطقه".');
if (!requestedOutput) fail("يلزم تحديد --out=assets/audio/zero/...mp3");
if (spokenText.length > 500) fail("النص طويل جداً؛ الحد الأقصى 500 حرف لكل مقطع.");
if (isAbsolute(requestedOutput)) fail("يجب أن يكون مسار الإخراج نسبياً داخل المشروع.");

const output = resolve(ROOT, requestedOutput);
const rel = relative(AUDIO_ROOT, output);
if (!rel || rel.startsWith(".." + sep) || rel === ".." || isAbsolute(rel)) {
  fail("يسمح بكتابة التسجيلات داخل assets/audio/zero فقط.");
}
if (extname(output).toLowerCase() !== ".mp3") fail("صيغة الإخراج المطلوبة MP3.");
if (!force) {
  try { await stat(output); fail("الملف موجود مسبقاً؛ استخدم --force للاستبدال المقصود."); }
  catch (error) { if (error?.code !== "ENOENT") throw error; }
}

await mkdir(dirname(output), { recursive: true });
const temp = output + ".aria-tmp.mp3";
await rm(temp, { force: true });
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const result = spawnSync(python, [
  "-m", "edge_tts",
  "--voice", "en-US-AriaNeural",
  "--text", spokenText,
  "--write-media", temp
], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

if (result.error) {
  await rm(temp, { force: true });
  fail(`تعذر تشغيل Python: ${result.error.message}. ثبّت الحزمة بالأمر: python -m pip install edge-tts`);
}
if (result.status !== 0) {
  await rm(temp, { force: true });
  fail(`فشل توليد Aria (en-US-AriaNeural):\n${result.stderr || result.stdout || "unknown error"}`);
}
const generated = await stat(temp);
if (generated.size < 1024) {
  await rm(temp, { force: true });
  fail("الملف الناتج صغير أو غير صالح؛ لم تتم إضافته إلى بنك الصوت.");
}
await rename(temp, output);
console.log(`Generated ${relative(ROOT, output)} (${generated.size} bytes) using en-US-AriaNeural.`);
console.log("تنبيه: هذا توليد كلام نصي عادي؛ لا يعتبر تسجيلاً فونيمياً مستقلاً دون مراجعة صوتية.");
