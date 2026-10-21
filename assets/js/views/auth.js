/* شاشة القفل (تسجيل الدخول بكلمة المرور) */
import { qs, esc, toast } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { login, lockRemainingMs } from '../core/auth.js';
import { settings, saveSettings } from '../core/store.js';
import { applyLang } from '../core/theme.js';

export function renderLock(onSuccess) {
  const host = qs('#lockScreen');
  if (!host) return;
  host.hidden = false;
  host.innerHTML = `
    <div class="lock-layout">
      <aside class="lock-aside" aria-label="${esc(t('auth.title'))}">
        <a class="lock-brand" href="#/" aria-label="${esc(t('auth.title'))}">
          <span class="brand__mark" aria-hidden="true">EN</span>
          <span>${esc(t('auth.title'))}</span>
        </a>
        <div class="lock-aside__copy">
          <span class="lock-kicker">${esc(t('auth.eyebrow'))}</span>
          <h2>${esc(t('auth.headline'))}</h2>
          <p>${esc(t('auth.learning'))}</p>
        </div>
        <div class="lock-aside__foot"><span aria-hidden="true">✦</span> ${esc(t('auth.privacy'))}</div>
      </aside>

      <section class="lock-card" aria-labelledby="lockTitle">
        <div class="lock-card__top">
          <span class="lock-card__eyebrow">${esc(t('auth.welcome'))}</span>
          <button class="lock-language" id="lockLang" type="button" aria-label="${settings.uiLang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}">
            ${settings.uiLang === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>
        <div class="lock-card__heading">
          <span class="lock-card__icon" aria-hidden="true">↗</span>
          <h1 id="lockTitle">${esc(t('auth.title'))}</h1>
          <p class="sub">${esc(t('auth.subtitle'))}</p>
        </div>
        <form id="lockForm" autocomplete="on">
          <div class="field">
            <label for="lockPass">${esc(t('auth.password'))}</label>
            <div class="lock-password">
              <input class="input pin-input" id="lockPass" type="password" name="password" autocomplete="current-password"
                     placeholder="••••••" required aria-describedby="lockError" />
              <button class="lock-show" type="button" id="togglePass" aria-label="${esc(t('auth.show'))}" aria-pressed="false">◉</button>
            </div>
          </div>
          <label class="lock-remember">
            <input type="checkbox" id="lockRemember" checked />
            <span class="lock-check" aria-hidden="true"></span>
            <span>${esc(t('auth.remember'))}</span>
          </label>
          <button class="btn btn--primary btn--block btn--lg lock-submit" type="submit" id="lockSubmit">
            <span>${esc(t('auth.enter'))}</span><span aria-hidden="true">↗</span>
          </button>
          <p class="lock-error" id="lockError" role="alert" aria-live="assertive"></p>
        </form>
        <p class="lock-privacy"><span aria-hidden="true">♧</span> ${esc(t('auth.privacy'))}</p>
      </section>
    </div>`;

  const form = qs('#lockForm', host);
  const input = qs('#lockPass', host);
  const errorEl = qs('#lockError', host);
  const submitBtn = qs('#lockSubmit', host);

  qs('#lockLang', host)?.addEventListener('click', () => {
    const password = input.value;
    const remember = qs('#lockRemember', host).checked;
    saveSettings({ uiLang: settings.uiLang === 'en' ? 'ar' : 'en' });
    applyLang();
    renderLock(onSuccess);
    const nextInput = qs('#lockPass', host);
    nextInput.value = password;
    qs('#lockRemember', host).checked = remember;
    nextInput.focus();
  });

  qs('#togglePass', host)?.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    qs('#togglePass', host).setAttribute('aria-pressed', String(input.type === 'text'));
    input.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const wait = lockRemainingMs();
    if (wait > 0) {
      errorEl.textContent = `محاولات كثيرة. انتظر ${Math.ceil(wait / 1000)} ثانية.`;
      return;
    }
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = '…';
    const res = await login(input.value, qs('#lockRemember', host).checked);
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = t('auth.enter');
    if (!res.ok) {
      errorEl.textContent = res.error;
      qs('.lock-card', host)?.classList.add('shake');
      setTimeout(() => qs('.lock-card', host)?.classList.remove('shake'), 420);
      input.select();
      return;
    }
    errorEl.textContent = '';
    host.hidden = true;
    host.innerHTML = '';
    if (typeof onSuccess === 'function') onSuccess();
  });

  setTimeout(() => input.focus(), 200);
}

export function hideLock() {
  const host = qs('#lockScreen');
  if (host) { host.hidden = true; host.innerHTML = ''; }
}

export function lockSite() {
  hideLock();
  renderLock(() => {
    toast('تم فتح الموقع من جديد', 'ok');
    // إعادة رسم كاملة بدل الاعتماد على دالة داشبورد قد تشير إلى عنصر مُتلَف
    if (typeof window.__leaRenderAll === 'function') window.__leaRenderAll();
  });
}
