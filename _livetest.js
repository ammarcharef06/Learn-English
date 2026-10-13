/* اختبار الإنتاج على GitHub Pages — ملف مؤقت يُحذف بعد التحقق */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
const errors = [];
window.addEventListener('error', (e) => errors.push('error: ' + e.message));
window.addEventListener('unhandledrejection', (e) => errors.push('rejection: ' + ((e.reason && e.reason.message) || e.reason)));
const A = (c, m) => { if (!c) throw new Error(m); };
async function step(n, f) { try { await f(); out.push('PASS ' + n); } catch (e) { out.push('FAIL ' + n + ' :: ' + e.message); } }
const V = () => document.getElementById('view').innerHTML;
const q = (s) => document.querySelector(s);
const qa = (s) => Array.from(document.querySelectorAll(s));
const base = location.pathname.replace(/[^/]*$/, '');
async function nav(h, w = 420) { location.hash = h; await sleep(w); }

async function answerCurrent(host) {
  const opt = host.querySelector('.option');
  if (opt) { opt.click(); await sleep(230); }
  else {
    const input = host.querySelector('[data-answer]');
    if (input) { input.value = 'answer'; host.querySelector('[data-check]')?.click(); await sleep(230); }
    else {
      const bank = host.querySelectorAll('[data-bank] .word-chip');
      if (bank.length) { bank.forEach((c) => c.click()); await sleep(140); host.querySelector('[data-check]')?.click(); await sleep(230); }
      else {
        const left = Array.from(host.querySelectorAll('[data-left] .match-item')).map((el) => el.dataset.i);
        for (const i of left) {
          const l = host.querySelector('[data-left] [data-i="' + i + '"]');
          const r = host.querySelector('[data-right] [data-i="' + i + '"]');
          if (l && r && !l.classList.contains('is-done')) { l.click(); await sleep(80); r.click(); await sleep(140); }
        }
        await sleep(200);
      }
    }
  }
  host.querySelector('[data-next]')?.click();
  await sleep(320);
}
async function finish(sel, max = 22) {
  const host = q(sel);
  for (let i = 0; i < max; i++) {
    const html = host.innerHTML;
    if (html.includes('انتهى التمرين') || html.includes('cert')) return true;
    await answerCurrent(host);
  }
  return false;
}

(async () => {
  await sleep(1800);

  await step('البيئة: HTTPS + نطاق GitHub Pages + المسار الفرعي', async () => {
    A(location.protocol === 'https:', 'البروتوكول ' + location.protocol);
    A(location.hostname.endsWith('github.io'), 'النطاق ' + location.hostname);
    A(base === '/Learn-English/', 'المسار ' + base);
    return location.origin + base;
  });

  await step('الإقلاع الكامل + شاشة القفل مخفية (جلسة مزروعة)', async () => {
    A(document.getElementById('lockScreen').hidden, 'شاشة القفل ظاهرة');
    A(!document.getElementById('app').classList.contains('is-hidden'), 'التطبيق مخفي');
    A(!document.body.textContent.includes('تعذّر تشغيل الموقع'), 'ظهرت رسالة فشل الإقلاع');
  });

  await step('الأصول تُحمَّل من GitHub Pages فعلياً', async () => {
    const res = await fetch('./assets/js/data/curriculum.js', { cache: 'no-store' });
    A(res.ok, 'حالة البيانات: ' + res.status);
    const css = await fetch('./assets/css/main.css', { cache: 'no-store' });
    A(css.ok, 'حالة CSS: ' + css.status);
    const sw = await fetch('./service-worker.js', { cache: 'no-store' });
    A(sw.ok, 'حالة Service Worker: ' + sw.status);
    return 'JS + CSS + SW كلها 200';
  });

  await step('التنقل: تمييز القسم الحالي', async () => {
    await nav('#/lessons', 600);
    const active = q('#bottomnav a.is-active') || q('#sidenav a.is-active');
    A(active, 'لا يوجد رابط مُفعَّل');
    return active.textContent.trim();
  });

  const routes = ['#/', '#/lessons', '#/level/a1', '#/level/a2', '#/level/b1', '#/unit/a1u1', '#/lesson/b1u6/1',
    '#/reference', '#/reference/pronouns', '#/reference/connectors', '#/reference/questions', '#/reference/table',
    '#/reference/examples', '#/drills', '#/flashcards', '#/reading', '#/reading/r-b1-4', '#/exams', '#/exams/a1u2',
    '#/stats', '#/notebook', '#/settings', '#/about'];
  for (const r of routes) {
    await step('الصفحة ' + r, async () => {
      await nav(r);
      A(V().trim().length > 400, 'الصفحة فارغة');
    });
  }

  await step('المراجع: الأعداد الكاملة كما أرسلها صاحب الموقع', async () => {
    await nav('#/reference/connectors', 600);
    A(qa('[data-row]').length === 40, 'أدوات الربط: ' + qa('[data-row]').length);
    await nav('#/reference/questions', 600);
    A(qa('[data-row]').length === 40, 'أدوات السؤال: ' + qa('[data-row]').length);
    await nav('#/reference/pronouns', 600);
    A(qa('[data-row]').length >= 60, 'عناصر الضمائر: ' + qa('[data-row]').length);
    return 'الضمائر + 40 + 40';
  });

  await step('تدريب: عرض السؤال والتصحيح والملخص', async () => {
    await nav('#/drills', 600);
    qa('[data-type]').forEach((b) => { if (b.dataset.type === 'mcq') b.click(); });
    const sel = q('#drillCount'); sel.value = '5'; sel.dispatchEvent(new Event('change'));
    await sleep(150);
    q('#startDrill').click();
    await sleep(700);
    A(q('#drillHost .option'), 'لا توجد خيارات');
    await finish('#drillHost');
    A(q('#drillHost').innerHTML.includes('انتهى التمرين'), 'لم تصل الجلسة للملخص');
    return 'ملخص كامل';
  });

  await step('البطاقات: قلب وتقييم حتى النهاية', async () => {
    await nav('#/flashcards', 600);
    const size = q('#fcSize'); size.value = '10'; size.dispatchEvent(new Event('change'));
    await sleep(400);
    q('#fcStart').click();
    await sleep(450);
    for (let i = 0; i < 12; i++) {
      const card = q('#fcCard');
      if (!card) break;
      card.click(); await sleep(130);
      const good = qa('[data-grade]').find((b) => b.dataset.grade === '2');
      if (good) good.click();
      await sleep(230);
    }
    A(V().includes('أتممت الجلسة'), 'شاشة نهاية الجلسة لا تظهر');
  });

  await step('المطالعة: نص + ترجمة + أسئلة فهم', async () => {
    await nav('#/reading/r-a2-2', 700);
    A(V().includes('reading-text'), 'نص المطالعة لا يظهر');
    q('#toggleAr').click();
    await sleep(150);
    A(!q('#arBox').hidden, 'الترجمة لا تظهر');
    const opt = q('#readQuiz .option');
    A(opt, 'أسئلة الفهم لا تظهر');
    opt.click(); await sleep(300);
    A(q('#readQuiz .feedback'), 'لا يوجد تصحيح');
  });

  await step('الاختبار: من البداية حتى الشهادة', async () => {
    await nav('#/exams', 600);
    q('#quickExam').click();
    await sleep(500);
    q('#examGo').click();
    await sleep(800);
    await finish('#examRunner');
    A(q('#examRunner').innerHTML.includes('cert'), 'الشهادة لم تظهر');
    A(q('#examRunner').innerHTML.includes('printCert'), 'زر الطباعة غير موجود');
    return 'شهادة نتيجة جاهزة';
  });

  await step('الإعدادات: حفظ فعلي في التخزين المحلي', async () => {
    await nav('#/settings', 600);
    const goal = q('#goalInput'); goal.value = '30'; goal.dispatchEvent(new Event('change'));
    await sleep(300);
    const saved = JSON.parse(localStorage.getItem('lea.settings.v1'));
    A(saved.dailyGoal === 30, 'الهدف المحفوظ ' + saved.dailyGoal);
    q('#btnTheme').click(); await sleep(250);
    const theme = document.documentElement.dataset.theme;
    A(theme === 'dark' || theme === 'light', 'الثيم ' + theme);
  });

  await step('دفتر الكلمات: إضافة من المراجع', async () => {
    await nav('#/reference/pronouns', 600);
    q('[data-nb]').click();
    await sleep(250);
    await nav('#/notebook', 600);
    A(qa('[data-nb-row]').length >= 1, 'الدفتر فارغ');
  });

  await step('Service Worker مُسجَّل على HTTPS', async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    A(regs.length >= 1, 'لا يوجد Service Worker');
    A(regs[0].scope.includes('Learn-English'), 'النطاق ' + regs[0].scope);
    return regs[0].scope;
  });

  await step('رابط غير موجود → صفحة 404 داخلية', async () => {
    await nav('#/xyz-not-found', 600);
    A(V().includes('غير موجودة'), 'صفحة 404 لا تظهر');
  });

  await step('لا أخطاء JavaScript في كل رحلة الاختبار', async () => {
    A(errors.length === 0, errors.join(' | '));
  });

  const pre = document.createElement('pre');
  pre.id = 'livereport';
  pre.textContent = 'LIVE-RESULTS\n' + out.join('\n') + '\nERRORS:' + errors.length + '\nLIVE-END';
  document.body.appendChild(pre);
})();
