/* الإعدادات: المظهر، الصوت، الإشعارات، الأمان، البيانات */
import { t, setUiLang, applyI18n } from '../core/i18n.js';
import { esc, qs, qsa, toast, openModal, download, readFileText, prettyTimeAr } from '../core/utils.js';
import { settings, saveSettings, resetProgress, resetSettings, wipeEverything, exportAll, inspectImport, importAll, progress } from '../core/store.js';
import { hasPassword, lockEnabled, setLockEnabled, setPassword, lockNow, touchSession } from '../core/auth.js';
import { englishVoices, speak } from '../core/speech.js';
import { ensurePermission, fireReminder, nextReminderText, syncReminderSchedule } from '../core/notify.js';
import { pageHead } from './shell.js';
import { APP_VERSION } from '../core/app-version.js';
import { checkForUpdate, checkForUpdateInBackground, downloadAndOpenUpdate } from '../core/updater.js';
import { navigate } from '../core/router.js';

const SETTINGS_PAGES = [
  { id: 'appearance', target: 'settingsLook', icon: '🎨', title: 'set.appearance', desc: 'set.pageAppearanceDesc', group: 'experience', keywords: 'theme skin color language font size' },
  { id: 'accessibility', target: 'settingsAccess', icon: '♿', title: 'set.accessibility', desc: 'set.pageAccessDesc', group: 'experience', keywords: 'contrast motion accessibility' },
  { id: 'audio', target: 'settingsAudio', icon: '🔊', title: 'set.audioTitle', desc: 'set.pageAudioDesc', group: 'experience', keywords: 'sound voice speak pronunciation rate' },
  { id: 'learning', target: 'settingsLearning', icon: '📚', title: 'set.learning', desc: 'set.pageLearningDesc', group: 'experience', keywords: 'goal translation certificate questions' },
  { id: 'reminders', target: 'settingsReminders', icon: '🔔', title: 'set.notifications', desc: 'set.pageRemindersDesc', group: 'experience', keywords: 'notification reminder days time' },
  { id: 'updates', target: 'updateCard', icon: '⬆️', title: 'update.title', desc: 'set.pageUpdatesDesc', group: 'more', keywords: 'version update download' },
  { id: 'security', target: 'settingsSecurity', icon: '🔒', title: 'set.security', desc: 'set.pageSecurityDesc', group: 'privacy', keywords: 'password lock privacy idle' },
  { id: 'data', target: 'settingsData', icon: '💾', title: 'set.data', desc: 'set.pageDataDesc', group: 'privacy', keywords: 'backup export import reset progress restore' },
  { id: 'support', target: 'settingsSupport', icon: '📣', title: 'nav.support', desc: 'set.pageSupportDesc', group: 'more', keywords: 'help support donate' },
];

function resolveSettingsPage(value) {
  return SETTINGS_PAGES.find((page) => page.id === value || page.target === value) || null;
}

function pageSummary(page) {
  if (page.id === 'appearance') {
    const skin = settings.skin === 'gnome' ? 'GNOME' : settings.skin === 'classic' ? (settings.uiLang === 'en' ? 'Classic' : 'الكلاسيكي') : 'Kali GNOME';
    return `${skin} · ${t(settings.theme === 'light' ? 'set.themeLight' : settings.theme === 'dark' || settings.skin === 'kali' ? 'set.themeDark' : 'set.themeAuto')}`;
  }
  if (page.id === 'audio') return settings.autoSpeak ? t('set.summaryOn') : t('set.summaryOff');
  if (page.id === 'learning') return t('set.summaryGoal', { count: Number(settings.dailyGoal || 0).toLocaleString(settings.uiLang === 'en' ? 'en' : 'ar') });
  if (page.id === 'reminders') return settings.reminder?.enabled ? t('set.summaryOn') : t('set.summaryOff');
  if (page.id === 'updates') return APP_VERSION;
  if (page.id === 'security') return settings.security?.lockEnabled ? t('set.summaryOn') : t('set.summaryOff');
  if (page.id === 'data') return t('set.summaryBackup');
  return '';
}

function renderSettingsHome(host) {
  const groups = [
    { id: 'experience', title: 'set.groupExperience' },
    { id: 'privacy', title: 'set.groupPrivacy' },
    { id: 'more', title: 'set.groupMore' },
  ];
  host.innerHTML = `
    ${pageHead({ icon: '⚙️', title: t('set.title'), subtitle: t('set.subtitle') })}
    <label class="settings-search">
      <span aria-hidden="true">⌕</span>
      <input id="settingsSearch" type="search" autocomplete="off" placeholder="${t('set.searchPlaceholder')}" aria-label="${t('set.searchLabel')}" />
      <kbd>Ctrl K</kbd>
    </label>
    <p class="settings-search__empty" id="settingsSearchEmpty" hidden>${t('set.searchNoResults')}</p>
    <div class="settings-home">
      ${groups.map((group) => `
        <section class="settings-group" data-settings-group="${group.id}">
          <h2>${t(group.title)}</h2>
          <div class="settings-list">
            ${SETTINGS_PAGES.filter((page) => page.group === group.id).map((page) => `
              <a class="settings-option" href="#/settings/${page.id}" data-settings-page="${page.id}" data-search-terms="${esc(page.keywords)}">
                <span class="settings-option__icon" aria-hidden="true">${page.icon}</span>
                <span class="settings-option__copy"><b>${t(page.title)}</b><small>${t(page.desc)}</small></span>
                ${pageSummary(page) ? `<span class="settings-option__summary">${esc(pageSummary(page))}</span>` : ''}
                <span class="settings-option__arrow" aria-hidden="true">›</span>
              </a>`).join('')}
          </div>
        </section>`).join('')}
    </div>`;

  const search = qs('#settingsSearch', host);
  const empty = qs('#settingsSearchEmpty', host);
  const filter = () => {
    const term = search.value.trim().toLocaleLowerCase();
    let count = 0;
    host.querySelectorAll('.settings-option').forEach((item) => {
      const visible = !term || `${item.textContent} ${item.dataset.searchTerms}`.toLocaleLowerCase().includes(term);
      item.hidden = !visible;
      if (visible) count += 1;
    });
    host.querySelectorAll('[data-settings-group]').forEach((group) => {
      group.hidden = !group.querySelector('.settings-option:not([hidden])');
    });
    empty.hidden = !term || count > 0;
  };
  search.addEventListener('input', filter);
  host.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
    } else if (event.key === 'Enter' && document.activeElement === search && search.value.trim()) {
      const first = host.querySelector('.settings-option:not([hidden])');
      if (first) { event.preventDefault(); navigate(`/settings/${first.dataset.settingsPage}`); }
    } else if (event.key === 'Escape' && document.activeElement === search && search.value) {
      search.value = '';
      filter();
    }
  });
}

export function renderSettings(host, query = {}, section = '') {
  const selectedPage = resolveSettingsPage(section || query.section);
  if (!selectedPage) {
    renderSettingsHome(host);
    return;
  }
  const s = settings;
  const days = s.uiLang === 'en'
    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const voices = englishVoices();
  const passwordConfigured = hasPassword();
  const passwordLockEnabled = lockEnabled();

  host.innerHTML = `
    ${pageHead({
      icon: selectedPage.icon,
      title: t(selectedPage.title),
      subtitle: t(selectedPage.desc),
      actionsHtml: `<a class="btn btn--sm settings-back" href="#/settings"><span aria-hidden="true">←</span>${t('set.back')}</a>`,
    })}

    <div class="card" id="settingsLook">
      <div class="card__title"><span class="ico">🎨</span><h2>${t('set.appearance')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.skin')}</b><span>${t('set.skinDesc')}</span></div>
        <div class="setting-row__control seg" id="skinSeg">
          ${SKINS.map((skin) => `<button type="button" data-skin="${skin.id}" class="${settings.skin === skin.id ? 'is-active' : ''}" title="${esc(t(`set.skin${skin.id[0].toUpperCase()}${skin.id.slice(1)}`))}">${skin.id === 'classic' ? (s.uiLang === 'en' ? 'Classic' : 'الكلاسيكي') : esc(skin.ar)}</button>`).join('')}
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.theme')}</b><span id="themeHint">${t('set.themeDesc')}</span></div>
        <div class="setting-row__control seg" id="themeSeg">
          <button type="button" data-theme="auto" class="${s.theme === 'auto' ? 'is-active' : ''}">${t('set.themeAuto')}</button>
          <button type="button" data-theme="light" class="${s.theme === 'light' ? 'is-active' : ''}">${t('set.themeLight')}</button>
          <button type="button" data-theme="dark" class="${s.theme === 'dark' ? 'is-active' : ''}">${t('set.themeDark')}</button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.uiLang')}</b><span>${t('set.uiLangDesc')}</span></div>
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

    <section class="card" id="settingsAccess" style="margin-top:16px" aria-labelledby="accessibilityTitle">
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

    <div class="card" id="settingsAudio" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔊</span><h2>${t('set.audioTitle')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.sound')}</b><span>${t('set.soundDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="setSound" ${s.sound ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.autoSpeak')}</b><span>${t('set.autoSpeakDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="setAutoSpeak" ${s.autoSpeak ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.voice')}</b><span>${t('set.voiceDesc', { count: voices.length })}</span></div>
        <div class="setting-row__control">
          <select class="select" id="voiceSelect" style="max-width:260px">
            <option value="">${t('set.voiceAuto')}</option>
            ${voices.map((v) => `<option value="${esc(v.name)}" ${s.tts.voice === v.name ? 'selected' : ''}>${esc(v.name)} — ${esc(v.lang)}</option>`).join('')}
          </select>
          <button class="btn btn--sm" type="button" id="testVoice">🔊 ${t('set.testVoice')}</button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.rate')}</b><span>${t('set.rateDesc')}</span></div>
        <div class="setting-row__control" style="min-width:220px">
          <input type="range" min="0.5" max="1.3" step="0.02" value="${s.tts.rate}" id="rateRange" style="width:150px" />
          <span class="chip" id="rateValue">${Number(s.tts.rate).toFixed(2)}×</span>
        </div>
      </div>
    </div>

    <div class="card" id="settingsLearning" style="margin-top:16px">
      <div class="card__title"><span class="ico">📚</span><h2>${t('set.learning')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.dailyGoal')}</b><span>${t('set.dailyGoalDesc')}</span></div>
        <div class="setting-row__control">
          <input class="input" type="number" min="5" max="200" step="5" value="${s.dailyGoal}" id="goalInput" style="width:110px" />
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.showTranslation')}</b><span>${t('set.showTranslationDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="setShowTranslation" ${s.showTranslation ? 'checked' : ''} /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.learnerName')}</b><span>${t('set.learnerNameDesc')}</span></div>
        <div class="setting-row__control"><input class="input" type="text" id="nameInput" value="${esc(s.learnerName || '')}" placeholder="${t('set.learnerNamePlaceholder')}" style="width:220px" /></div>
      </div>
    </div>

    <div class="card" id="settingsReminders" style="margin-top:16px">
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

    <div class="card" style="margin-top:16px" id="settingsSupport">
      <div class="card__title"><span class="ico">📣</span><h2>${t('nav.support')}</h2></div>
      <p class="small muted">${s.uiLang === 'en' ? 'Support the continued development of the academy.' : 'ساهم في استمرار تطوير الأكاديمية.'}</p>
      <a class="btn btn--primary btn--sm" href="#/support">${s.uiLang === 'en' ? 'Support us' : 'دعم التطبيق'} →</a>
    </div>

    <div class="card" id="settingsSecurity" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔒</span><h2>${t('set.security')}</h2></div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.passwordLock')}</b><span>${t('set.passwordLockDesc')}</span></div>
        <label class="switch"><input type="checkbox" id="lockEnabled" ${passwordLockEnabled ? 'checked' : ''} aria-label="${t('set.passwordLock')}" /><span class="switch__track"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-row__text"><b>${t('set.idleLock')}</b><span>${t('set.idleLockDesc')}</span></div>
        <select class="select" id="idleLockTime" aria-label="${t('set.idleLock')}" style="max-width:190px">
          <option value="0" ${Number(s.security?.idleMinutes) === 0 ? 'selected' : ''}>${t('set.idleNever')}</option>
          <option value="15" ${Number(s.security?.idleMinutes) === 15 ? 'selected' : ''}>${t('set.idle15')}</option>
          <option value="30" ${Number(s.security?.idleMinutes) === 30 ? 'selected' : ''}>${t('set.idle30')}</option>
          <option value="60" ${Number(s.security?.idleMinutes) === 60 ? 'selected' : ''}>${t('set.idle60')}</option>
        </select>
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

    <div class="card" id="settingsData" style="margin-top:16px">
      <div class="card__title"><span class="ico">💾</span><h2>${t('set.data')}</h2></div>
      <div class="row row--wrap" style="gap:8px">
        <button class="btn" type="button" id="exportBtn">⬇ ${t('set.export')}</button>
        <button class="btn" type="button" id="importBtn">⬆ ${t('set.import')}</button>
        <input type="file" id="importFile" accept="application/json,.json" hidden />
        <button class="btn" type="button" id="resetProgBtn">♻️ ${t('set.resetProgress')}</button>
        <button class="btn" type="button" id="resetSetBtn">↩️ ${t('set.resetSettings')}</button>
        <button class="btn btn--bad" type="button" id="wipeBtn">🗑 ${t('set.wipe')}</button>
      </div>
      <p class="hint" style="margin-top:8px">${t('set.dataCounts', {
        words: (progress.notebook || []).length.toLocaleString(s.uiLang === 'en' ? 'en' : 'ar'),
        days: (progress.studyDays || []).length.toLocaleString(s.uiLang === 'en' ? 'en' : 'ar'),
      })}</p>
    </div>`;

  const selectedCard = qs(`#${selectedPage.target}`, host);
  if (!selectedCard) {
    renderSettingsHome(host);
    return;
  }
  host.querySelectorAll('.card[id]').forEach((card) => {
    if (card !== selectedCard) card.remove();
  });
  selectedCard.classList.add('settings-detail-card');
  selectedCard.querySelector(':scope > .card__title')?.remove();

  /* ---------- المظهر ---------- */
  qsa('#skinSeg button', host).forEach((b) => b.addEventListener('click', () => {
    saveSettings({ skin: b.dataset.skin });
    applySkin();
    qsa('#skinSeg button', host).forEach((x) => x.classList.toggle('is-active', x === b));
    const label = SKINS.find((s) => s.id === b.dataset.skin);
    toast(`${t('set.skin')}: ${label ? (b.dataset.skin === 'classic' && s.uiLang === 'en' ? 'Classic' : label.ar) : b.dataset.skin}`, 'ok');
    renderSettings(host, query, selectedPage.id);
  }));
  qsa('#themeSeg button', host).forEach((b) => b.addEventListener('click', () => {
    saveSettings({ theme: b.dataset.theme });
    applySkin();
    qsa('#themeSeg button', host).forEach((x) => x.classList.toggle('is-active', x === b));
    toast(t('set.saved'), 'ok');
  }));
  if ((settings.skin || 'kali') === 'kali') {
    const themeHint = qs('#themeHint', host);
    if (themeHint) themeHint.textContent = t('set.themeKaliHint');
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
    toast(t('set.goalToast', { count: v }), 'ok');
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
    toast(t('set.reminderTimeToast', { time: s.uiLang === 'en' ? e.target.value : prettyTimeAr(e.target.value) }), 'ok');
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
  if (selectedPage.id === 'updates') void runUpdateCheck();

  /* ---------- الأمان ---------- */
  qs('#idleLockTime', host)?.addEventListener('change', (e) => {
    saveSettings({ security: { idleMinutes: Math.max(0, Number(e.target.value) || 0) } });
    touchSession();
    toast(t('set.saved'), 'ok');
  });
  qs('#lockEnabled', host)?.addEventListener('change', (e) => {
    const result = setLockEnabled(e.target.checked);
    if (!result.ok) {
      e.target.checked = false;
      toast(result.error === 'أنشئ كلمة مرور خاصة بك قبل تفعيل القفل.' ? t('set.createPasswordFirst') : result.error, 'warn');
      return;
    }
    toast(e.target.checked ? t('set.lockEnabledToast') : t('set.lockDisabledToast'), 'ok');
    renderSettings(host, query, selectedPage.id);
  });
  qs('#pwSave', host)?.addEventListener('click', async () => {
    const cur = qs('#pwCur', host)?.value || '';
    const nw = qs('#pwNew', host)?.value || '';
    const cf = qs('#pwConf', host)?.value || '';
    if (nw !== cf) { toast(t('set.passwordMismatch'), 'bad'); return; }
    const res = await setPassword(nw, cur);
    if (!res.ok) {
      const message = res.error === 'كلمة المرور الجديدة قصيرة جداً (4 أحرف على الأقل).' ? t('set.passwordTooShort')
        : res.error === 'كلمة المرور الحالية غير صحيحة.' ? t('set.currentPasswordWrong')
          : res.error;
      toast(message, 'bad');
      return;
    }
    if (!passwordConfigured) setLockEnabled(true);
    qs('#pwNew', host).value = qs('#pwConf', host).value = '';
    toast(t('auth.changeOk'), 'ok');
    renderSettings(host, query, selectedPage.id);
  });
  qs('#lockNowBtn', host)?.addEventListener('click', () => {
    lockNow();
    window.__leaLockNow?.();
  });
  /* ---------- البيانات ---------- */
  qs('#exportBtn', host)?.addEventListener('click', () => {
    download(`learn-english-backup-${new Date().toISOString().slice(0, 10)}.json`, exportAll());
    toast(t('set.exportDownloaded'), 'ok');
  });
  qs('#importBtn', host)?.addEventListener('click', () => qs('#importFile', host).click());
  qs('#importFile', host)?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backupText = await readFileText(file);
      const preview = inspectImport(backupText);
      const exportedDate = preview.exportedAt ? new Date(preview.exportedAt) : null;
      const date = exportedDate && !Number.isNaN(exportedDate.getTime())
        ? exportedDate.toLocaleString(s.uiLang === 'en' ? 'en' : 'ar')
        : t('set.importUnknownDate');
      const included = [
        preview.hasSettings ? t('set.importSettingsCount', { count: preview.settingsCount }) : '',
        preview.hasProgress ? t('set.importProgressCount', { count: preview.progressCount }) : '',
        preview.hasProgress ? t('set.importWords', { count: preview.words }) : '',
        preview.hasProgress ? t('set.importDays', { count: preview.studyDays }) : '',
      ].filter(Boolean);
      const modalBody = `
        <p>${t('set.importMeta', { date: esc(date) })}</p>
        <b>${t('set.importIncludes')}</b>
        <ul>${included.map((item) => `<li>${item}</li>`).join('')}</ul>
        <p class="hint">${t('set.importLockNote')}</p>
        <hr />
        <b>${t('set.importChoose')}</b>
        <p class="small muted">${t('set.importMergeDesc')}</p>
        <p class="small muted">${t('set.importReplaceDesc')}</p>`;
      const commitImport = async (mode) => {
        try {
          if (mode === 'replace') {
            download(`learn-english-safety-${new Date().toISOString().slice(0, 10)}.json`, exportAll());
          }
          importAll(backupText, { mode });
          try {
            const notificationResult = await syncReminderSchedule();
            if (!notificationResult.ok) toast(t('set.notificationScheduleFailed'), 'warn');
          } catch (error) {
            console.error('Could not restore imported notification schedule', error);
            toast(t('set.notificationScheduleFailed'), 'warn');
          }
          toast(mode === 'merge' ? t('set.importMerged') : t('set.importReplaced'), 'ok');
          window.__leaRenderAll?.();
          renderSettings(host, query, selectedPage.id);
          return true;
        } catch (error) {
          console.error('Could not import backup', error);
          toast(t('set.importInvalid'), 'bad');
          return false;
        }
      };
      openModal({
        title: t('set.importTitle'),
        body: modalBody,
        actions: [
          { label: t('common.cancel'), variant: 'ghost' },
          { label: t('set.importMerge'), variant: 'primary', onClick: () => commitImport('merge') },
          { label: t('set.importReplace'), variant: 'bad', onClick: (root) => {
            openModal({
              title: t('set.importReplace'),
              body: `<p>${t('set.importReplaceDesc')}</p><p class="hint">${t('set.importLockNote')}</p>`,
              actions: [
                { label: t('common.cancel'), variant: 'ghost' },
                { label: t('set.importReplace'), variant: 'bad', onClick: () => commitImport('replace') },
              ],
            });
            return false;
          } },
        ],
      });
    } catch (err) {
      console.error('Invalid backup file', err);
      toast(t('set.importInvalid'), 'bad');
    } finally {
      e.target.value = '';
    }
  });
  qs('#resetProgBtn', host)?.addEventListener('click', () => confirmAction(t('set.resetProgressTitle'), t('set.resetProgressConfirm'), () => { resetProgress(); toast(t('set.resetProgressDone'), 'ok'); window.__leaRenderAll?.(); renderSettings(host, query, selectedPage.id); }));
  qs('#resetSetBtn', host)?.addEventListener('click', () => confirmAction(t('set.resetSettingsTitle'), t('set.resetSettingsConfirm'), async () => {
    resetSettings();
    try { await syncReminderSchedule(); }
    catch (error) {
      console.error('Could not cancel reminders after settings reset', error);
      toast(t('set.notificationScheduleFailed'), 'warn');
    }
    applySkin();
    applyLang();
    toast(t('set.resetSettingsDone'), 'ok');
    window.__leaRenderAll?.();
    renderSettings(host, query, selectedPage.id);
  }));
  qs('#wipeBtn', host)?.addEventListener('click', () => confirmAction(t('set.wipeTitle'), t('set.wipeConfirm'), async () => {
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
