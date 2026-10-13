/* الإعدادات: المظهر، الصوت، الإشعارات، Push، الأمان، البيانات */
import { t, setUiLang, applyI18n } from '../core/i18n.js';
import { esc, qs, qsa, toast, openModal, closeModal, download, readFileText, prettyTimeAr, copyText } from '../core/utils.js';
import { settings, saveSettings, resetProgress, resetSettings, wipeEverything, exportAll, importAll, progress } from '../core/store.js';
import { changePassword, lockNow, usingDefaultPassword, resetToDefaultPassword } from '../core/auth.js';
import { englishVoices, speak } from '../core/speech.js';
import { ensurePermission, fireReminder, enablePush, disablePush, pushStatus, nextReminderText, permissionState, initOneSignal, appId as currentAppId } from '../core/notify.js';
import { pageHead } from './shell.js';

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function renderSettings(host) {
  const s = settings;
  const voices = englishVoices();

  host.innerHTML = `
    ${pageHead({ icon: '⚙️', title: t('set.title'), subtitle: t('set.subtitle') })}

    <div class="card">
      <div class="card__title"><span class="ico">🎨</span><h2>${t('set.appearance')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.theme')}</b><span>فاتح، داكن، أو تلقائي حسب نظام جهازك.</span></div>
        <div class="setting-row__control seg" id="themeSeg">
          <button type="button" data-theme="auto" class="${s.theme === 'auto' ? 'is-active' : ''}">${t('set.themeAuto')}</button>
          <button type="button" data-theme="light" class="${s.theme === 'light' ? 'is-active' : ''}">${t('set.themeLight')}</button>
          <button type="button" data-theme="dark" class="${s.theme === 'dark' ? 'is-active' : ''}">${t('set.themeDark')}</button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.uiLang')}</b><span>لغة أزرار الموقع وقوائمه (المحتوى التعليمي يبقى كما هو).</span></div>
        <div class="setting-row__control seg" id="langSeg">
          <button type="button" data-lang="ar" class="${s.uiLang !== 'en' ? 'is-active' : ''}">العربية</button>
          <button type="button" data-lang="en" class="${s.uiLang === 'en' ? 'is-active' : ''}">English</button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.fontSize')}</b><span>كبّر الخط إن كنت تقرأ على شاشة صغيرة.</span></div>
        <div class="setting-row__control" style="min-width:220px">
          <input type="range" min="85" max="135" step="5" value="${s.fontSize}" id="fontRange" style="width:150px" />
          <span class="chip" id="fontValue">${s.fontSize}%</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔊</span><h2>الصوت والنطق</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.sound')}</b><span>${t('set.soundDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="setSound" ${s.sound ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.autoSpeak')}</b><span>${t('set.autoSpeakDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="setAutoSpeak" ${s.autoSpeak ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.voice')}</b><span>أصوات القراءة المتاحة في متصفحك (${voices.length}).</span></div>
        <div class="setting-row__control">
          <select class="select" id="voiceSelect" style="max-width:260px">
            <option value="">تلقائي (الأفضل المتاح)</option>
            ${voices.map((v) => `<option value="${esc(v.name)}" ${s.tts.voice === v.name ? 'selected' : ''}>${esc(v.name)} — ${esc(v.lang)}</option>`).join('')}
          </select>
          <button class="btn btn--sm" type="button" id="testVoice">🔊 تجربة</button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.rate')}</b><span>سرعة القراءة: أبطأ أنسب للمبتدئ.</span></div>
        <div class="setting-row__control" style="min-width:220px">
          <input type="range" min="0.5" max="1.3" step="0.02" value="${s.tts.rate}" id="rateRange" style="width:150px" />
          <span class="chip" id="rateValue">${Number(s.tts.rate).toFixed(2)}×</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">📚</span><h2>${t('set.learning')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.dailyGoal')}</b><span>عدد الأسئلة التي تريد إنجازها يومياً.</span></div>
        <div class="setting-row__control">
          <input class="input" type="number" min="5" max="200" step="5" value="${s.dailyGoal}" id="goalInput" style="width:110px" />
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.showTranslation')}</b><span>إظهار الترجمة العربية بجانب الأمثلة الإنجليزية.</span></div>
        <label class="switch"><input type="checkbox" id="setShowTranslation" ${s.showTranslation ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>اسمك في الشهادة</b><span>يظهر في شهادة نتيجة الاختبار.</span></div>
        <div class="setting-row__control"><input class="input" type="text" id="nameInput" value="${esc(s.learnerName || '')}" placeholder="اكتب اسمك" style="width:220px" /></div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔔</span><h2>${t('set.notifications')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reminderOn')}</b><span>${t('set.reminderDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="remEnabled" ${s.reminder.enabled ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reminderTime')}</b><span>التذكير القادم: ${esc(nextReminderText())} · إذن المتصفح: <b id="permState">${esc(permissionState())}</b></span></div>
        <div class="setting-row__control">
          <input class="input" type="time" id="remTime" value="${esc(s.reminder.time)}" style="width:140px" />
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reminderDays')}</b><span>اختر الأيام التي تريد أن يصلك فيها التذكير.</span></div>
        <div class="setting-row__control row row--wrap" style="gap:6px">
          ${DAYS.map((d, i) => `<button class="btn btn--sm ${s.reminder.days.includes(i) ? 'btn--primary' : ''}" type="button" data-day="${i}">${d}</button>`).join('')}
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>نص التذكير</b><span>العنوان والجملة التي تظهر في الإشعار.</span></div>
        <div class="setting-row__control" style="flex-direction:column;align-items:stretch;gap:6px;min-width:280px">
          <input class="input" type="text" id="remTitle" value="${esc(s.reminder.title)}" />
          <input class="input" type="text" id="remBody" value="${esc(s.reminder.body)}" />
        </div>
      </div>
      <div class="row row--wrap" style="gap:8px;margin-top:10px">
        <button class="btn btn--primary btn--sm" type="button" id="testReminder">🔔 ${t('set.pushTest')}</button>
        <button class="btn btn--sm" type="button" id="askPerm">${t('set.pushEnable')}</button>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">📲</span><h2>${t('set.pushOn')}</h2></div>
      <p class="small muted">${t('set.pushDesc')}</p>
      <div class="tip-box" style="margin-bottom:12px">
        <b>كيف تحصل على App ID؟</b>
        ١) ادخل إلى onesignal.com وأنشئ تطبيقاً من نوع <span class="en">Web</span>.
        ٢) اختر <span class="en">Typical Site</span> وأدخل رابط موقعك:
        <span class="en">https://ammarcharef06.github.io/Learn-English/</span>
        ٣) انسخ <span class="en">App ID</span> والصقه في الحقل أدناه ثم اضغط «تفعيل إشعارات Push».
      </div>
      <div class="field">
        <label for="appIdInput">${t('set.appId')}</label>
        <div class="row" style="gap:8px">
          <input class="input en" type="text" id="appIdInput" dir="ltr" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value="${esc(currentAppId())}" />
          <button class="btn" type="button" id="saveAppId">${t('common.save')}</button>
        </div>
        <span class="hint">${t('set.pushStatus')}: <b id="pushState">…</b></span>
      </div>
      <div class="row row--wrap" style="gap:8px">
        <button class="btn btn--primary" type="button" id="pushOn">🔔 ${t('set.pushEnable')}</button>
        <button class="btn" type="button" id="pushOff">🔕 إيقاف</button>
        <button class="btn" type="button" id="pushTest">${t('set.pushTest')}</button>
        <button class="btn btn--ghost btn--sm" type="button" id="copySubId">📋 نسخ معرّف اشتراكي</button>
      </div>
      <p class="hint" style="margin-top:8px">
        المعرّف المحفوظ في هذه الشاشة يعمل على <b>هذا الجهاز فقط</b>. لتشغيل الإشعارات تلقائياً على كل أجهزتك،
        ضع نفس المعرّف في الملف <span class="en">assets/js/config.js</span> في السطر
        <span class="en" dir="ltr">window.LEA_ONESIGNAL_APP_ID = '…';</span>
      </p>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔒</span><h2>${t('set.security')}</h2></div>
      ${usingDefaultPassword() ? `<div class="tip-box" style="margin-bottom:12px"><b>تنبيه أمني</b>${esc(t('set.stillDefault'))}</div>` : `<div class="tip-box tip-box--ok" style="margin-bottom:12px"><b>جيد</b>تستخدم كلمة مرور خاصة بك ✅</div>`}
      <div class="grid grid--3">
        <div class="field"><label for="pwCur">${t('set.currentPassword')}</label><input class="input" type="password" id="pwCur" autocomplete="current-password" /></div>
        <div class="field"><label for="pwNew">${t('set.newPassword')}</label><input class="input" type="password" id="pwNew" autocomplete="new-password" /></div>
        <div class="field"><label for="pwConf">${t('set.confirmPassword')}</label><input class="input" type="password" id="pwConf" autocomplete="new-password" /></div>
      </div>
      <div class="row row--wrap" style="gap:8px">
        <button class="btn btn--primary" type="button" id="pwSave">${t('set.changePassword')}</button>
        <button class="btn" type="button" id="lockNowBtn">🔒 ${t('set.lockNow')}</button>
        <button class="btn btn--ghost" type="button" id="pwReset">إعادة كلمة المرور الأولية</button>
      </div>
      <p class="hint" style="margin-top:8px">كلمة المرور تُخزَّن داخل متصفحك كبصمة مشفّرة (SHA-256) ولا تُرسل لأي خادم. إن نسيتها، استخدم «إعادة كلمة المرور الأولية» ثم غيّرها.</p>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">💾</span><h2>${t('set.data')}</h2></div>
      <div class="row row--wrap" style="gap:8px">
        <button class="btn" type="button" id="exportBtn">⬇ ${t('set.export')}</button>
        <button class="btn" type="button" id="importBtn">⬆ ${t('set.import')}</button>
        <input type="file" id="importFile" accept="application/json,.json" hidden />
        <button class="btn" type="button" id="resetProgBtn">♻️ ${t('set.resetProgress')}</button>
        <button class="btn" type="button" id="resetSetBtn">↩️ ${t('set.resetSettings')}</button>
        <button class="btn btn--bad" type="button" id="wipeBtn">🗑 ${t('set.wipe')}</button>
      </div>
      <p class="hint" style="margin-top:8px">عدد الكلمات في دفترك: ${(progress.notebook || []).length} · أيام الدراسة: ${(progress.studyDays || []).length}</p>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">📱</span><h2>${t('set.install')}</h2></div>
      <p class="small muted">${t('set.installDesc')}</p>
      <button class="btn btn--primary" type="button" id="installBtn">⬇ ${t('common.install')}</button>
      <div class="divider"></div>
      <p class="small muted">
        <b>على الهاتف (أندرويد/كروم):</b> افتح قائمة المتصفح ← «إضافة إلى الشاشة الرئيسية».
        <br><b>على الآيفون (سفاري):</b> زر المشاركة ← «إضافة إلى الشاشة الرئيسية».
        <br><b>على الكمبيوتر (كروم/إيدج):</b> أيقونة التثبيت في شريط العنوان أو زر التثبيت أعلى الصفحة.
      </p>
    </div>`;

  /* ---------- المظهر ---------- */
  qsa('#themeSeg button', host).forEach((b) => b.addEventListener('click', () => {
    saveSettings({ theme: b.dataset.theme });
    applyTheme();
    qsa('#themeSeg button', host).forEach((x) => x.classList.toggle('is-active', x === b));
    toast(t('set.saved'), 'ok');
  }));
  qsa('#langSeg button', host).forEach((b) => b.addEventListener('click', () => {
    saveSettings({ uiLang: b.dataset.lang });
    setUiLang(b.dataset.lang);
    applyLang();
    toast(t('set.saved'), 'ok');
    window.__leaRenderAll?.();
  }));
  const fontRange = qs('#fontRange', host);
  fontRange?.addEventListener('input', () => {
    const v = Number(fontRange.value);
    qs('#fontValue', host).textContent = `${v}%`;
    document.documentElement.style.setProperty('--font-scale', String(v / 100));
    saveSettings({ fontSize: v });
  });

  /* ---------- الصوت ---------- */
  qs('#setSound', host)?.addEventListener('change', (e) => { saveSettings({ sound: e.target.checked }); toast(t('set.saved'), 'ok'); });
  qs('#setAutoSpeak', host)?.addEventListener('change', (e) => saveSettings({ autoSpeak: e.target.checked }));
  qs('#setShowTranslation', host)?.addEventListener('change', (e) => saveSettings({ showTranslation: e.target.checked }));
  qs('#voiceSelect', host)?.addEventListener('change', (e) => {
    saveSettings({ tts: { voice: e.target.value } });
    speak('Hello, this is your English academy.');
  });
  qs('#testVoice', host)?.addEventListener('click', () => speak('Hello! Welcome to your English academy.'));
  const rateRange = qs('#rateRange', host);
  rateRange?.addEventListener('input', () => {
    const v = Number(rateRange.value);
    qs('#rateValue', host).textContent = `${v.toFixed(2)}×`;
    saveSettings({ tts: { rate: v } });
  });
  rateRange?.addEventListener('change', () => speak('This is the new reading speed.'));

  /* ---------- التعلّم ---------- */
  qs('#goalInput', host)?.addEventListener('change', (e) => {
    const v = Math.max(5, Math.min(200, Number(e.target.value) || 20));
    saveSettings({ dailyGoal: v });
    e.target.value = v;
    toast(`هدفك اليومي: ${v} سؤال`, 'ok');
  });
  qs('#nameInput', host)?.addEventListener('change', (e) => { saveSettings({ learnerName: e.target.value.trim() }); toast(t('set.saved'), 'ok'); });

  /* ---------- الإشعارات ---------- */
  qs('#remEnabled', host)?.addEventListener('change', (e) => {
    saveSettings({ reminder: { enabled: e.target.checked } });
    if (e.target.checked) ensurePermission().then((p) => { const el = qs('#permState', host); if (el) el.textContent = p; });
  });
  qs('#remTime', host)?.addEventListener('change', (e) => {
    saveSettings({ reminder: { time: e.target.value } });
    toast(`التذكير اليومي: ${prettyTimeAr(e.target.value)}`, 'ok');
  });
  qsa('[data-day]', host).forEach((b) => b.addEventListener('click', () => {
    const d = Number(b.dataset.day);
    const days = new Set(settings.reminder.days);
    if (days.has(d)) days.delete(d); else days.add(d);
    const arr = [...days].sort((x, y) => x - y);
    saveSettings({ reminder: { days: arr.length ? arr : [d] } });
    b.classList.toggle('btn--primary');
  }));
  qs('#remTitle', host)?.addEventListener('change', (e) => saveSettings({ reminder: { title: e.target.value } }));
  qs('#remBody', host)?.addEventListener('change', (e) => saveSettings({ reminder: { body: e.target.value } }));
  qs('#askPerm', host)?.addEventListener('click', async () => {
    const p = await ensurePermission();
    qs('#permState', host).textContent = p;
    toast(p === 'granted' ? 'تم منح إذن الإشعارات ✅' : 'لم يُمنح الإذن — فعّله من إعدادات المتصفح', p === 'granted' ? 'ok' : 'warn');
  });
  qs('#testReminder', host)?.addEventListener('click', async () => {
    const res = await fireReminder({ test: true });
    toast(res.ok ? 'أُرسل الإشعار التجريبي ✅' : (res.error || 'تعذّر الإرسال'), res.ok ? 'ok' : 'bad');
  });

  /* ---------- Push ---------- */
  const refreshPushState = async () => {
    const st = await pushStatus();
    const el = qs('#pushState', host);
    if (!el) return;
    const sourceText = st.source === 'config' ? 'مضبوط في ملف الإعدادات (كل الأجهزة)'
      : st.source === 'settings' ? 'مضبوط على هذا الجهاز'
        : t('set.pushNotConfigured');
    el.textContent = !st.configured
      ? sourceText
      : `${sourceText} · ${st.enabled || st.optedIn ? 'مُفعّل ✅' : 'غير مُفعّل'} · ${st.id ? `ID: ${st.id.slice(0, 14)}…` : 'لا مشترك'} · الإذن: ${st.permission}`;
  };
  refreshPushState();
  qs('#saveAppId', host)?.addEventListener('click', async () => {
    const id = qs('#appIdInput', host).value.trim();
    saveSettings({ push: { appId: id } });
    toast(id ? 'حُفظ App ID — اضغط «تفعيل إشعارات Push»' : 'أُفرغ الحقل', id ? 'ok' : 'info');
    refreshPushState();
  });
  qs('#pushOn', host)?.addEventListener('click', async () => {
    const id = qs('#appIdInput', host).value.trim();
    if (id) saveSettings({ push: { appId: id } });
    toast('جارٍ تهيئة OneSignal…', 'info');
    const res = await enablePush();
    toast(res.ok ? 'تم تفعيل إشعارات Push ✅' : (res.error || 'فشل التفعيل'), res.ok ? 'ok' : 'bad');
    refreshPushState();
  });
  qs('#pushOff', host)?.addEventListener('click', async () => {
    await disablePush();
    toast('أُوقفت إشعارات Push', 'info');
    refreshPushState();
  });
  qs('#pushTest', host)?.addEventListener('click', async () => {
    const st = await pushStatus();
    if (!st.configured) { toast('أضف OneSignal App ID أولاً', 'warn'); return; }
    if (!st.id) { toast('لم يتم الاشتراك بعد — اضغط «تفعيل إشعارات Push»', 'warn'); return; }
    toast(`معرّف اشتراكك: ${st.id}`, 'info', 'انسخه وأرسل منه إشعاراً تجريبياً من لوحة OneSignal');
    await fireReminder({ test: true });
  });
  qs('#copySubId', host)?.addEventListener('click', async () => {
    const st = await pushStatus();
    if (!st.id) { toast('لا يوجد اشتراك بعد — فعّل الإشعارات أولاً', 'warn'); return; }
    const ok = await copyText(st.id);
    toast(ok ? `نُسخ المعرّف: ${st.id}` : `معرّفك: ${st.id}`, ok ? 'ok' : 'info');
  });

  /* ---------- الأمان ---------- */
  qs('#pwSave', host)?.addEventListener('click', async () => {
    const cur = qs('#pwCur', host).value;
    const nw = qs('#pwNew', host).value;
    const cf = qs('#pwConf', host).value;
    if (nw !== cf) { toast('كلمتا المرور الجديدتان غير متطابقتين', 'bad'); return; }
    const res = await changePassword(cur, nw);
    if (!res.ok) { toast(res.error, 'bad'); return; }
    qs('#pwCur', host).value = qs('#pwNew', host).value = qs('#pwConf', host).value = '';
    toast(t('auth.changeOk'), 'ok');
    renderSettings(host);
  });
  qs('#lockNowBtn', host)?.addEventListener('click', () => {
    lockNow();
    window.__leaLockNow?.();
  });
  qs('#pwReset', host)?.addEventListener('click', () => {
    openModal({
      title: 'إعادة كلمة المرور الأولية',
      body: '<p>ستُعاد كلمة المرور إلى <b class="en">SAYPER</b>. استخدمها للدخول ثم غيّرها فوراً.</p>',
      actions: [
        { label: t('common.cancel'), variant: 'ghost' },
        { label: t('common.confirm'), variant: 'primary', onClick: async () => { await resetToDefaultPassword(); toast('أُعيدت كلمة المرور إلى SAYPER', 'ok'); renderSettings(host); } },
      ],
    });
  });

  /* ---------- البيانات ---------- */
  qs('#exportBtn', host)?.addEventListener('click', () => {
    download(`learn-english-backup-${new Date().toISOString().slice(0, 10)}.json`, exportAll());
    toast('تم تنزيل النسخة الاحتياطية ⬇', 'ok');
  });
  qs('#importBtn', host)?.addEventListener('click', () => qs('#importFile', host).click());
  qs('#importFile', host)?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileText(file);
      importAll(text);
      toast('تم الاستيراد بنجاح ✅', 'ok');
      window.__leaRenderAll?.();
      renderSettings(host);
    } catch (err) {
      toast('ملف غير صالح', 'bad');
    }
  });
  qs('#resetProgBtn', host)?.addEventListener('click', () => confirmAction('تصفير التقدّم', 'سيُحذف كل التقدم والنقاط والشارات، وتبقى الإعدادات وكلمة المرور.', () => { resetProgress(); toast('صُفِّر التقدّم', 'ok'); window.__leaRenderAll?.(); renderSettings(host); }));
  qs('#resetSetBtn', host)?.addEventListener('click', () => confirmAction('إعادة الإعدادات', 'ستعود كل الإعدادات للقيم الافتراضية.', () => { resetSettings(); applyTheme(); applyLang(); toast('أُعيدت الإعدادات', 'ok'); window.__leaRenderAll?.(); renderSettings(host); }));
  qs('#wipeBtn', host)?.addEventListener('click', () => confirmAction('حذف كل شيء', 'سيُحذف كل شيء: الإعدادات، التقدم، وكلمة المرور (ستعود SAYPER). لا يمكن التراجع!', () => { wipeEverything(); location.reload(); }));

  qs('#installBtn', host)?.addEventListener('click', () => window.__leaInstall?.());
}

function confirmAction(title, body, onOk) {
  openModal({
    title,
    body: `<p>${esc(body)}</p>`,
    actions: [
      { label: t('common.cancel'), variant: 'ghost' },
      { label: t('common.confirm'), variant: 'bad', onClick: () => { onOk(); } },
    ],
  });
}

export function applyTheme() {
  const theme = settings.theme || 'auto';
  const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
export function applyLang() {
  const lang = settings.uiLang === 'en' ? 'en' : 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  document.documentElement.dataset.uiLang = lang;
  setUiLang(lang);
  applyI18n(document);
  const btn = qs('#langLabel');
  if (btn) btn.textContent = lang === 'en' ? 'ع' : 'EN';
}
