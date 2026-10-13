/* شاشة القفل (تسجيل الدخول بكلمة المرور) */
import { qs, esc, toast } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { login, usingDefaultPassword, lockRemainingMs } from '../core/auth.js';

export function renderLock(onSuccess) {
  const host = qs('#lockScreen');
  if (!host) return;
  const showHint = usingDefaultPassword();
  host.hidden = false;
  host.innerHTML = `
    <div class="lock-card">
      <div class="brand__mark">EN</div>
      <h1>${esc(t('auth.title'))}</h1>
      <p class="sub">${esc(t('auth.subtitle'))}</p>
      <form id="lockForm" autocomplete="on">
        <div class="field">
          <label for="lockPass">${esc(t('auth.password'))}</label>
          <div class="row" style="gap:8px">
            <input class="input pin-input" id="lockPass" type="password" name="password" autocomplete="current-password"
                   placeholder="••••••" required aria-describedby="lockError" />
            <button class="btn btn--icon" type="button" id="togglePass" aria-label="${esc(t('auth.show'))}">👁</button>
          </div>
        </div>
        <label class="switch" style="justify-content:center;margin:6px 0 14px">
          <input type="checkbox" id="lockRemember" checked />
          <span class="switch__track"></span>
          <span class="small">${esc(t('auth.remember'))}</span>
        </label>
        <button class="btn btn--primary btn--block btn--lg" type="submit" id="lockSubmit">🔓 ${esc(t('auth.enter'))}</button>
        <p class="lock-error" id="lockError" role="alert" aria-live="assertive"></p>
      </form>
      ${showHint ? `<div class="tip-box"><b>ملاحظة أول دخول</b>${esc(t('auth.defaultWarn'))}</div>` : ''}
      <p class="tiny muted" style="margin-top:14px">بياناتك محفوظة على جهازك فقط 🔒</p>
    </div>`;

  const form = qs('#lockForm', host);
  const input = qs('#lockPass', host);
  const errorEl = qs('#lockError', host);
  const submitBtn = qs('#lockSubmit', host);

  qs('#togglePass', host)?.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
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
    submitBtn.textContent = '…';
    const res = await login(input.value, qs('#lockRemember', host).checked);
    submitBtn.disabled = false;
    submitBtn.textContent = `🔓 ${t('auth.enter')}`;
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
    if (typeof window.__leaAfterUnlock === 'function') window.__leaAfterUnlock();
  });
}
