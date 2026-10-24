/* الإعدادات: المظهر، الصوت، الإشعارات، الأمان، البيانات */
import { t, setUiLang, applyI18n } from '../core/i18n.js';
import { esc, qs, qsa, toast, openModal, download, readFileText, prettyTimeAr } from '../core/utils.js';
import { settings, saveSettings, resetProgress, resetSettings, wipeEverything, exportAll, importAll, progress } from '../core/store.js';
import { hasPassword, lockEnabled, setLockEnabled, setPassword, lockNow } from '../core/auth.js';
import { englishVoices, speak } from '../core/speech.js';
import { ensurePermission, fireReminder, nextReminderText, syncReminderSchedule } from '../core/notify.js';
import { pageHead } from './shell.js';
import { APP_VERSION } from '../core/app-version.js';
import { checkForUpdate, checkForUpdateInBackground, downloadAndOpenUpdate } from '../core/updater.js';

export function renderSettings(host, query = {}) {
  const s = settings;
  const days = s.uiLang === 'en'
    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const voices = englishVoices();
  const passwordConfigured = hasPassword();
  const passwordLockEnabled = lockEnabled();

  host.innerHTML = `
    ${pageHead({ icon: '⚙️', title: t('set.title'), subtitle: t('set.subtitle') })}

    <div class="card">
      <div class="card__title"><span class="ico">🎨</span><h2>${t('set.appearance')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>ستايل الواجهة</b><span>شكل الموقع العام: كالي GNOME (الافتراضي)، GNOME (فاتح/داكن)، أو الكلاسيكي.</span></div>
        <div class="setting-row__control seg" id="skinSeg">
          ${SKINS.map((s) => `<button type="button" data-skin="${s.id}" class="${settings.skin === s.id ? 'is-active' : ''}" title="${esc(s.desc)}">${esc(s.ar)}</button>`).join('')}
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.theme')}</b><span id="themeHint">فاتح، داكن، أو تلقائي حسب نظام جهازك.</span></div>
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
        <div class="setting-row__text"><b>${t('set.fontSize')}</b><span id="fontSizeHint">${t('set.fontSizeDesc')}</span></div>
        <div class="setting-row__control" style="min-width:220px">
          <input type="range" min="85" max="135" step="5" value="${s.fontSize}" id="fontRange" aria-describedby="fontSizeHint fontValue" style="width:150px" />
          <span class="chip" id="fontValue">${s.fontSize}%</span>
        </div>
      </div>
    </div>

    <section class="card" style="margin-top:16px" aria-labelledby="accessibilityTitle">
      <div class="card__title"><span class="ico" aria-hidden="true">♿</span><h2 id="accessibilityTitle">${t('set.accessibility')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.highContrast')}</b><span id="highContrastHint">${t('set.highContrastDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="highContrast" aria-label="${t('set.highContrast')}" aria-describedby="highContrastHint" ${s.highContrast ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reduceMotion')}</b><span id="reduceMotionHint">${t('set.reduceMotionDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="reduceMotion" aria-label="${t('set.reduceMotion')}" aria-describedby="reduceMotionHint" ${s.reduceAnimations ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
    </section>

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
      <p class="small muted">${t('set.notificationsDesc')}</p>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.notificationsEnabled')}</b><span>${t('set.reminderDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="remEnabled" aria-label="${t('set.notificationsEnabled')}" ${s.reminder.enabled ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reminderTime')}</b><span>${t('set.nextReminder')}: ${esc(nextReminderText())}</span></div>
        <div class="setting-row__control">
          <input class="input" type="time" id="remTime" aria-label="${t('set.reminderTime')}" value="${esc(s.reminder.time)}" style="width:140px" />
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reminderDays')}</b><span>${t('set.reminderDaysDesc')}</span></div>
        <div class="setting-row__control row row--wrap" style="gap:6px">
          ${days.map((d, i) => `<button class="btn btn--sm ${s.reminder.days.includes(i) ? 'btn--primary' : ''}" type="button" data-day="${i}" aria-pressed="${s.reminder.days.includes(i)}">${d}</button>`).join('')}
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reminderText')}</b><span>${t('set.reminderTextDesc')}</span></div>
        <div class="setting-row__control" style="flex-direction:column;align-items:stretch;gap:6px;min-width:280px">
          <input class="input" type="text" id="remTitle" aria-label="${t('set.reminderTitle')}" value="${esc(s.reminder.title)}" />
          <input class="input" type="text" id="remBody" aria-label="${t('set.reminderMessage')}" value="${esc(s.reminder.body)}" />
        </div>
      </div>
      <div class="row row--wrap" style="gap:8px;margin-top:10px">
        <button class="btn btn--primary btn--sm" type="button" id="testReminder">🔔 ${t('set.testNotification')}</button>
      </div>
    </div>

    <div class="card" style="margin-top:16px" id="updateCard">
      <div class="card__title"><span class="ico">⬆️</span><h2>${t('update.title')}</h2></div>
      <p class="small muted">${t('update.desc')}</p>
      <div class="row row--wrap" style="gap:10px;margin-top:12px">
        <span class="chip">${esc(APP_VERSION)}</span>
        <button class="btn btn--primary" type="button" id="checkUpdates">${t('update.check')}</button>
      </div>
      <div id="updateStatus" class="update-status" role="status" aria-live="polite"></div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">📣</span><h2>${t('nav.support')}</h2></div>
      <p class="small muted">${s.uiLang === 'en' ? 'Support the continued development of the academy.' : 'ساهم في استمرار تطوير الأكاديمية.'}</p>
      <a class="btn btn--primary btn--sm" href="#/support">${s.uiLang === 'en' ? 'Support us' : 'دعم التطبيق'} →</a>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔒</span><h2>${t('set.security')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.passwordLock')}</b><span>${t('set.passwordLockDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="lockEnabled" ${passwordLockEnabled ? 'checked' : ''} aria-label="${t('set.passwordLock')}" /><span class="switch__track"></span></label>
      </div>
      <div class="tip-box ${passwordLockEnabled ? 'tip-box--ok' : ''}" style="margin-bottom:12px">
        <b>${passwordLockEnabled ? t('set.lockActive') : t('set.appOpen')}</b>
        ${passwordLockEnabled ? t('set.lockActiveDesc') : t('set.appOpenDesc')}
      </div>
      <div class="grid ${passwordLockEnabled && passwordConfigured ? 'grid--3' : 'grid--2'}">
        ${passwordLockEnabled && passwordConfigured ? `<div class="field"><label for="pwCur">${t('set.currentPassword')}</label><input class="input" type="password" id="pwCur" autocomplete="current-password" /></div>` : ''}
        <div class="field"><label for="pwNew">${passwordConfigured ? t('set.newPassword') : t('set.createPassword')}</label><input class="input" type="password" id="pwNew" autocomplete="new-password" /></div>
        <div class="field"><label for="pwConf">${t('set.confirmPassword')}</label><input class="input" type="password" id="pwConf" autocomplete="new-password" /></div>
      </div>
      <div class="row row--wrap" style="gap:8px">
        <button class="btn btn--primary" type="button" id="pwSave">${passwordConfigured ? t('set.changePassword') : t('set.createAndEnable')}</button>
        ${passwordLockEnabled ? `<button class="btn" type="button" id="lockNowBtn">🔒 ${t('set.lockNow')}</button>` : ''}
      </div>
      <p class="hint" style="margin-top:8px">${t('set.passwordLocalHint')}</p>
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
    </div>`;

    if (query.section === 'updates') {
      requestAnimationFrame(() => qs('#updateCard', host)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }

  /* ---------- المظهر ---------- */
  qsa('#skinSeg button', host).forEach((b) => b.addEventListener('click', () => {
    saveSettings({ skin: b.dataset.skin });
    applySkin();
    qsa('#skinSeg button', host).forEach((x) => x.classList.toggle('is-active', x === b));
    const label = SKINS.find((s) => s.id === b.dataset.skin);
    toast(`الستايل: ${label ? label.ar : b.dataset.skin}`, 'ok');
    renderSettings(host);
  }));
  qsa('#themeSeg button', host).forEach((b) => b.addEventListener('click', () => {
    saveSettings({ theme: b.dataset.theme });
    applySkin();
    qsa('#themeSeg button', host).forEach((x) => x.classList.toggle('is-active', x === b));
    toast(t('set.saved'), 'ok');
  }));
  if ((settings.skin || 'atelier') === 'kali') {
    const themeHint = qs('#themeHint', host);
    if (themeHint) themeHint.textContent = 'ستايل كالي داكن دائماً — اختر «GNOME» لتتمكن من التبديل بين الفاتح والداكن.';
    qsa('#themeSeg button', host).forEach((b) => { b.disabled = true; b.style.opacity = '.45'; });
  }
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
  qs('#highContrast', host)?.addEventListener('change', (e) => {
    saveSettings({ highContrast: e.target.checked });
    applyAccessibility();
    toast(t('set.saved'), 'ok');
  });
  qs('#reduceMotion', host)?.addEventListener('change', (e) => {
    saveSettings({ reduceAnimations: e.target.checked });
    applyAccessibility();
    toast(t('set.saved'), 'ok');
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
  qs('#remEnabled', host)?.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    if (enabled) {
      const permission = await ensurePermission();
      if (!['granted', 'available', 'native'].includes(permission)) {
        e.target.checked = false;
        toast(permission === 'denied'
          ? t('set.notificationPermissionBlocked')
          : t('set.notificationPermissionRequired'), 'warn');
        return;
      }
    }
    saveSettings({ reminder: { enabled, launchAtLogin: enabled } });
    try {
      const result = await syncReminderSchedule({ requestPermission: enabled });
      if (!result.ok) {
        saveSettings({ reminder: { enabled: false, launchAtLogin: false } });
        e.target.checked = false;
        toast(result.error === 'notification-permission-required'
          ? t('set.notificationPermissionRequired')
          : t('set.notificationScheduleFailed'), 'bad');
        return;
      }
      toast(enabled ? t('set.notificationsEnabledToast') : t('set.notificationsDisabledToast'), 'ok');
      if (enabled) await checkForUpdateInBackground();
    } catch (error) {
      console.error('Could not update reminder schedule', error);
      saveSettings({ reminder: { enabled: !enabled, launchAtLogin: !enabled } });
      e.target.checked = !enabled;
      toast(t('set.notificationScheduleFailed'), 'bad');
    }
  });
  const saveReminderSchedule = async (patch) => {
    saveSettings({ reminder: patch });
    try {
      const result = await syncReminderSchedule();
      if (!result.ok) toast(t('set.notificationScheduleFailed'), 'bad');
    } catch (error) {
      console.error('Could not update reminder schedule', error);
      toast(t('set.notificationScheduleFailed'), 'bad');
    }
  };
  qs('#remTime', host)?.addEventListener('change', async (e) => {
    await saveReminderSchedule({ time: e.target.value });
    toast(`التذكير اليومي: ${prettyTimeAr(e.target.value)}`, 'ok');
  });
  qsa('[data-day]', host).forEach((b) => b.addEventListener('click', () => {
    const d = Number(b.dataset.day);
    const days = new Set(settings.reminder.days);
    if (days.has(d)) days.delete(d); else days.add(d);
    const arr = [...days].sort((x, y) => x - y);
    if (!arr.length) arr.push(d);
    saveReminderSchedule({ days: arr });
    b.classList.toggle('btn--primary', arr.includes(d));
    b.setAttribute('aria-pressed', String(arr.includes(d)));
  }));
  qs('#remTitle', host)?.addEventListener('change', (e) => saveReminderSchedule({ title: e.target.value }));
  qs('#remBody', host)?.addEventListener('change', (e) => saveReminderSchedule({ body: e.target.value }));
  qs('#testReminder', host)?.addEventListener('click', async () => {
    const res = await fireReminder({ test: true });
    toast(res.ok ? t('set.testNotificationSent') : (res.error || t('set.notificationScheduleFailed')), res.ok ? 'ok' : 'bad');
  });

  const updateStatus = qs('#updateStatus', host);
  const checkButton = qs('#checkUpdates', host);
  const showUpdateStatus = (result) => {
    if (!updateStatus) return;
    if (!result.supported) {
      updateStatus.innerHTML = `<p class="small muted">${t('update.webUnsupported')}</p>`;
      return;
    }
    if (!result.update) {
      updateStatus.innerHTML = `<p class="small muted">${t('update.current', { version: esc(result.currentVersion) })}</p>`;
      return;
    }
    const notes = result.release.notes || (s.uiLang === 'en' ? 'No release notes provided.' : 'لا توجد ملاحظات لهذا الإصدار.');
    updateStatus.innerHTML = `
      <section class="update-release">
        <h3>${t('update.available', { version: esc(result.latestVersion) })}</h3>
        <p class="small muted">${esc(result.release.name)} · ${esc(result.release.asset.name)}</p>
        <h4>${t('update.notes')}</h4>
        <pre class="update-release__notes">${esc(notes)}</pre>
        <div class="update-progress" hidden>
          <div class="row row--between"><span>${t('update.progress')}</span><span data-progress-label>0%</span></div>
          <progress max="100" value="0" aria-label="${t('update.progress')}"></progress>
        </div>
        <button class="btn btn--primary" type="button" data-download-update>${t('update.download')}</button>
      </section>`;
    updateStatus.querySelector('[data-download-update]')?.addEventListener('click', async (event) => {
      const button = event.currentTarget;
      const progress = updateStatus.querySelector('.update-progress');
      const bar = progress?.querySelector('progress');
      const label = progress?.querySelector('[data-progress-label]');
      button.disabled = true;
      progress.hidden = false;
      try {
        const downloaded = await downloadAndOpenUpdate(result.release, (state) => {
          const percentage = Number.isFinite(state.percent) ? state.percent : 0;
          if (bar) bar.value = percentage;
          if (label) label.textContent = `${percentage}%`;
        });
        const completeMessage = downloaded.manualInstall
          ? t('update.appimage', { filename: esc(downloaded.filename) })
          : t('update.done');
        updateStatus.querySelector('.update-release')?.insertAdjacentHTML('beforeend', `<p class="tip-box tip-box--ok" role="status">${completeMessage}</p>`);
        button.textContent = downloaded.manualInstall
          ? (s.uiLang === 'en' ? 'Download complete' : 'اكتمل التنزيل')
          : (s.uiLang === 'en' ? 'Installer opened' : 'فُتح مثبت النظام');
      } catch (error) {
        console.error('Could not download or open the update.', error);
        const message = t('update.error', { error: esc(error.message || String(error)) });
        updateStatus.querySelector('.update-release')?.insertAdjacentHTML('beforeend', `<p class="tip-box" role="alert">${message}</p>`);
        button.disabled = false;
      }
    });
  };
  const runUpdateCheck = async () => {
    if (!checkButton) return;
    checkButton.disabled = true;
    checkButton.textContent = t('update.checking');
    if (updateStatus) updateStatus.textContent = t('update.checking');
    try {
      showUpdateStatus(await checkForUpdate({ force: true }));
    } catch (error) {
      console.error('Could not check for app updates.', error);
      if (updateStatus) updateStatus.innerHTML = `<p class="tip-box" role="alert">${t('update.error', { error: esc(error.message || String(error)) })}</p>`;
    } finally {
      checkButton.disabled = false;
      checkButton.textContent = t('update.check');
    }
  };
  checkButton?.addEventListener('click', runUpdateCheck);
  if (query.section === 'updates') void runUpdateCheck();

  /* ---------- الأمان ---------- */
  qs('#lockEnabled', host)?.addEventListener('change', (e) => {
    const result = setLockEnabled(e.target.checked);
    if (!result.ok) {
      e.target.checked = false;
      toast(result.error, 'warn');
      return;
    }
    toast(e.target.checked ? 'تم تفعيل القفل بكلمة مرور' : 'تم إيقاف القفل بكلمة مرور', 'ok');
    renderSettings(host);
  });
  qs('#pwSave', host)?.addEventListener('click', async () => {
    const cur = qs('#pwCur', host)?.value || '';
    const nw = qs('#pwNew', host)?.value || '';
    const cf = qs('#pwConf', host)?.value || '';
    if (nw !== cf) { toast('كلمتا المرور الجديدتان غير متطابقتين', 'bad'); return; }
    const res = await setPassword(nw, cur);
    if (!res.ok) { toast(res.error, 'bad'); return; }
    if (!passwordConfigured) setLockEnabled(true);
    qs('#pwNew', host).value = qs('#pwConf', host).value = '';
    toast(t('auth.changeOk'), 'ok');
    renderSettings(host);
  });
  qs('#lockNowBtn', host)?.addEventListener('click', () => {
    lockNow();
    window.__leaLockNow?.();
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
      try {
        const notificationResult = await syncReminderSchedule();
        if (!notificationResult.ok) toast(t('set.notificationScheduleFailed'), 'warn');
      } catch (error) {
        console.error('Could not restore imported notification schedule', error);
        toast(t('set.notificationScheduleFailed'), 'warn');
      }
      toast('تم الاستيراد بنجاح ✅', 'ok');
      window.__leaRenderAll?.();
      renderSettings(host);
    } catch (err) {
      toast('ملف غير صالح', 'bad');
    }
  });
  qs('#resetProgBtn', host)?.addEventListener('click', () => confirmAction('تصفير التقدّم', 'سيُحذف كل التقدم والنقاط والشارات، وتبقى الإعدادات وكلمة المرور.', () => { resetProgress(); toast('صُفِّر التقدّم', 'ok'); window.__leaRenderAll?.(); renderSettings(host); }));
  qs('#resetSetBtn', host)?.addEventListener('click', () => confirmAction('إعادة الإعدادات', 'ستعود كل الإعدادات للقيم الافتراضية.', async () => {
    resetSettings();
    try { await syncReminderSchedule(); }
    catch (error) {
      console.error('Could not cancel reminders after settings reset', error);
      toast(t('set.notificationScheduleFailed'), 'warn');
    }
    applySkin();
    applyLang();
    toast('أُعيدت الإعدادات', 'ok');
    window.__leaRenderAll?.();
    renderSettings(host);
  }));
  qs('#wipeBtn', host)?.addEventListener('click', () => confirmAction('حذف كل شيء', 'سيُحذف كل شيء: الإعدادات، التقدم، وكلمة المرور. لا يمكن التراجع!', async () => {
    wipeEverything();
    try { await syncReminderSchedule(); }
    catch (error) { console.error('Could not cancel reminders after clearing app data', error); }
    finally { location.reload(); }
  }));

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

/* المظهر واللغة: منطق مشترك بين الصفحتين (انظر core/theme.js) */
import { SKINS, applyTheme, applySkin, applyLang, applyAccessibility } from '../core/theme.js';
export { SKINS, applyTheme, applySkin, applyLang, applyAccessibility };