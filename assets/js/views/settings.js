import { t as uiText } from '../core/i18n.js';
/* الإعدادات: المظهر، الصوت، الإشعارات، الأمان، البيانات */
import { t, setUiLang, applyI18n } from '../core/i18n.js';
import { esc, qs, qsa, toast, openModal, download, readFileText, prettyTimeAr } from '../core/utils.js';
import { settings, saveSettings, resetProgress, resetSettings, wipeEverything, exportAll, exportCloudProgress, importAll, progress, isEshSandbox } from '../core/store.js';
import { hasPassword, lockEnabled, setLockEnabled, setPassword, lockNow } from '../core/auth.js';
import { englishVoices, speak } from '../core/speech.js';
import { ensurePermission, fireReminder, nextReminderText, syncReminderSchedule } from '../core/notify.js';
import { pageHead } from './shell.js';
import { APP_VERSION } from '../core/app-version.js';
import { checkForUpdate, checkForUpdateInBackground, downloadAndOpenUpdate } from '../core/updater.js';
import { getSyncQueueStatus, queueSyncProgress } from '../core/sync.js';

export function renderSettings(host, query = {}) {
  const s = settings;
  const days = s.uiLang === 'en'
    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : [uiText('ui.literal.8215f21b'), uiText('ui.literal.0e895458'), uiText('ui.literal.28a30847'), uiText('ui.literal.bafd26ed'), uiText('ui.literal.6cb22eec'), uiText('ui.literal.e16147b3'), uiText('ui.literal.2b9da5dd')];
  const voices = englishVoices();
  const passwordConfigured = hasPassword();
  const passwordLockEnabled = lockEnabled();
  const syncStatus = getSyncQueueStatus();

  host.innerHTML = `
    ${pageHead({ icon: '⚙️', title: t('set.title'), subtitle: t('set.subtitle') })}

    <div class="card">
      <div class="card__title"><span class="ico">🎨</span><h2>${t('set.appearance')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.theme')}</b><span id="themeHint">${uiText('ui.literal.6787affa')} </span></div>
        <div class="setting-row__control seg" id="themeSeg">
          <button type="button" data-theme="auto" class="${s.theme === 'auto' ? 'is-active' : ''}">${t('set.themeAuto')}</button>
          <button type="button" data-theme="light" class="${s.theme === 'light' ? 'is-active' : ''}">${t('set.themeLight')}</button>
          <button type="button" data-theme="dark" class="${s.theme === 'dark' ? 'is-active' : ''}">${t('set.themeDark')}</button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.accent')}</b><span>${t('set.accentDesc')}</span></div>
        <div class="setting-row__control accent-picker" role="group" aria-label="${t('set.accent')}">
          ${['blue', 'mint', 'violet'].map((accent) => `<button type="button" class="accent-picker__option" data-accent-choice="${accent}" aria-pressed="${(s.accent || 'blue') === accent}" aria-label="${t(`set.accent${accent[0].toUpperCase()}${accent.slice(1)}`)}">
            <i class="accent-picker__swatch" data-accent="${accent}" aria-hidden="true"></i><span>${t(`set.accent${accent[0].toUpperCase()}${accent.slice(1)}`)}</span>
          </button>`).join('')}
        </div>
      </div>
      ${isEshSandbox ? '' : `<div class="setting-row">
        <div class="setting-row__text"><b>${t('set.uiLang')}</b><span>${uiText('ui.literal.dea7a57d')} </span></div>
        <div class="setting-row__control seg" id="langSeg">
          <button type="button" data-lang="ar" class="${s.uiLang !== 'en' ? 'is-active' : ''}">${uiText('ui.literal.a76ce029')} </button>
          <button type="button" data-lang="en" class="${s.uiLang === 'en' ? 'is-active' : ''}">English</button>
        </div>
      </div>`}
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

    ${isEshSandbox ? '' : `<div class="card" style="margin-top:16px" id="syncCard">
      <div class="card__title"><span class="ico">☁️</span><h2>${t('set.syncProgress')}</h2></div>
      <p class="small muted">${t('set.syncLocalOnly')}</p>
      <div class="row row--wrap" style="gap:8px">
        <button class="btn btn--primary" type="button" id="queueSyncBtn">☁️ ${t('set.syncProgress')}</button>
        <span class="chip" id="syncQueueStatus" role="status" aria-live="polite">${syncStatus.pending ? t('set.syncQueued', { count: syncStatus.cardCount }) : t('set.syncNoPending')}</span>
      </div>
    </div>`}

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔊</span><h2>${uiText('ui.literal.5470f9a7')} </h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.sound')}</b><span>${t('set.soundDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="setSound" ${s.sound ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.autoSpeak')}</b><span>${t('set.autoSpeakDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="setAutoSpeak" ${s.autoSpeak ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.voice')}</b><span>${uiText('ui.literal.4ba6ae4c')} ${voices.length}).</span></div>
        <div class="setting-row__control">
          <select class="select" id="voiceSelect" style="max-width:260px">
            <option value="">${uiText('ui.literal.4e271a0e')} </option>
            ${voices.map((v) => `<option value="${esc(v.name)}" ${s.tts.voice === v.name ? 'selected' : ''}>${esc(v.name)} — ${esc(v.lang)}</option>`).join('')}
          </select>
          <button class="btn btn--sm" type="button" id="testVoice">🔊 ${uiText('ui.literal.fae90ca9')} </button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.rate')}</b><span>${uiText('ui.literal.aed4b43d')} </span></div>
        <div class="setting-row__control" style="min-width:220px">
          <input type="range" min="0.5" max="1.3" step="0.02" value="${s.tts.rate}" id="rateRange" style="width:150px" />
          <span class="chip" id="rateValue">${Number(s.tts.rate).toFixed(2)}×</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">📚</span><h2>${t('set.learning')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.dailyGoal')}</b><span>${uiText('ui.literal.5f0047be')} </span></div>
        <div class="setting-row__control">
          <input class="input" type="number" min="5" max="200" step="5" value="${s.dailyGoal}" id="goalInput" style="width:110px" />
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.reviewLoad')}</b><span>${t('set.reviewLoadDesc')}</span></div>
        <div class="setting-row__control">
          <select class="select" id="reviewLoad">
            ${[10, 15, 20, 30, 50].map((size) => `<option value="${size}" ${Number(s.reviewSize || 15) === size ? 'selected' : ''}>${size} ${t('common.cards')}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.showTranslation')}</b><span>${uiText('ui.literal.643e847e')} </span></div>
        <label class="switch"><input type="checkbox" id="setShowTranslation" ${s.showTranslation ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${uiText('ui.literal.ba283ce9')} </b><span>${uiText('ui.literal.b8c5984b')} </span></div>
        <div class="setting-row__control"><input class="input" type="text" id="nameInput" value="${esc(s.learnerName || '')}" placeholder="${uiText('ui.literal.afff22fd')} " style="width:220px" /></div>
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
      <p class="small muted">${s.uiLang === 'en' ? 'Support the continued development of the academy.' : uiText('ui.literal.6da7a82f')}</p>
      <a class="btn btn--primary btn--sm" href="#/support">${s.uiLang === 'en' ? 'Support us' : uiText('ui.literal.626cf098')} →</a>
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
      <p class="hint" style="margin-top:8px">${uiText('ui.literal.2674749d')} ${(progress.notebook || []).length} · ${uiText('ui.literal.e3a379ae')} ${(progress.studyDays || []).length}</p>
    </div>`;

    if (query.section === 'updates') {
      requestAnimationFrame(() => qs('#updateCard', host)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }

  /* ---------- المظهر ---------- */
  qsa('#themeSeg button', host).forEach((b) => b.addEventListener('click', () => {
    saveSettings({ theme: b.dataset.theme });
    applyTheme();
    qsa('#themeSeg button', host).forEach((x) => x.classList.toggle('is-active', x === b));
    toast(t('set.saved'), 'ok');
  }));
  qsa('[data-accent-choice]', host).forEach((button) => button.addEventListener('click', () => {
    saveSettings({ accent: button.dataset.accentChoice });
    applyAccent();
    qsa('[data-accent-choice]', host).forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
    toast(t('set.saved'), 'ok');
  }));
  if ((settings.skin || 'atelier') === 'kali') {
    const themeHint = qs('#themeHint', host);
    if (themeHint) themeHint.textContent = uiText('ui.literal.47be7b06');
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
    toast(`${uiText('ui.literal.5a2cac93')} ${v} ${uiText('ui.literal.360f3b31')} `, 'ok');
  });
  qs('#reviewLoad', host)?.addEventListener('change', (event) => {
    const size = [10, 15, 20, 30, 50].includes(Number(event.target.value)) ? Number(event.target.value) : 15;
    saveSettings({ reviewSize: size });
    toast(t('set.saved'), 'ok');
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
    toast(`${uiText('ui.literal.84d2b514')} ${prettyTimeAr(e.target.value)}`, 'ok');
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
    const notes = result.release.notes || (s.uiLang === 'en' ? 'No release notes provided.' : uiText('ui.literal.7b819b09'));
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
          ? (s.uiLang === 'en' ? 'Download complete' : uiText('ui.literal.28287413'))
          : (s.uiLang === 'en' ? 'Installer opened' : uiText('ui.literal.f0ba8607'));
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
    toast(e.target.checked ? uiText('ui.literal.2609433a') : uiText('ui.literal.0668fd59'), 'ok');
    renderSettings(host);
  });
  qs('#pwSave', host)?.addEventListener('click', async () => {
    const cur = qs('#pwCur', host)?.value || '';
    const nw = qs('#pwNew', host)?.value || '';
    const cf = qs('#pwConf', host)?.value || '';
    if (nw !== cf) { toast(uiText('ui.literal.0d379650'), 'bad'); return; }
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
  qs('#queueSyncBtn', host)?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    if (button.disabled) return;
    const idleLabel = button.innerHTML;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.innerHTML = `<span class="sync-spinner" aria-hidden="true"></span>${t('set.syncPreparing')}`;
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    try {
      const queued = queueSyncProgress(exportCloudProgress());
      const status = qs('#syncQueueStatus', host);
      if (status) status.textContent = t('set.syncQueued', { count: queued.cardCount });
      toast(t('set.syncPrepared'), 'ok');
    } catch (error) {
      console.error('Could not prepare local cloud sync snapshot', error);
      toast(t('set.syncPrepareFailed'), 'bad');
    } finally {
      button.innerHTML = idleLabel;
      button.removeAttribute('aria-busy');
      button.disabled = false;
    }
  });
  qs('#exportBtn', host)?.addEventListener('click', () => {
    download(`learn-english-backup-${new Date().toISOString().slice(0, 10)}.json`, exportAll());
    toast(uiText('ui.literal.ea3692de'), 'ok');
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
      toast(uiText('ui.literal.a33f9417'), 'ok');
      window.__leaRenderAll?.();
      renderSettings(host);
    } catch (err) {
      toast(uiText('ui.literal.76f1bb2f'), 'bad');
    }
  });
  qs('#resetProgBtn', host)?.addEventListener('click', () => confirmAction(uiText('ui.literal.8965beb4'), uiText('ui.literal.a9f7002b'), () => { resetProgress(); toast(uiText('ui.literal.2bf0e350'), 'ok'); window.__leaRenderAll?.(); renderSettings(host); }));
  qs('#resetSetBtn', host)?.addEventListener('click', () => confirmAction(uiText('ui.literal.94e5096d'), uiText('ui.literal.cbbaa497'), async () => {
    resetSettings();
    try { await syncReminderSchedule(); }
    catch (error) {
      console.error('Could not cancel reminders after settings reset', error);
      toast(t('set.notificationScheduleFailed'), 'warn');
    }
    applySkin();
    applyLang();
    toast(uiText('ui.literal.b444bb10'), 'ok');
    window.__leaRenderAll?.();
    renderSettings(host);
  }));
  qs('#wipeBtn', host)?.addEventListener('click', () => confirmAction(uiText('ui.literal.36d5262b'), uiText('ui.literal.667d00c8'), async () => {
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
import { applyTheme, applySkin, applyLang, applyAccessibility, applyAccent } from '../core/theme.js';
export { applyTheme, applySkin, applyLang, applyAccessibility, applyAccent };