import { t as uiText } from '../core/i18n.js';
import { toast } from '../core/utils.js';
import { pageHead } from './shell.js';
import { showVoluntaryRewardedAd, isAndroidAdPlatform } from '../core/ads.js';

const DONATION_URL = 'https://ko-fi.com/yacine_charef';

export function renderSupport(host) {
  const en = document.documentElement.lang === 'en';
  host.innerHTML = `
    ${pageHead({
      icon: '💛',
      title: en ? 'Support the app' : uiText('ui.literal.626cf098'),
      subtitle: en ? 'Your support helps keep the learning experience free.' : uiText('ui.literal.e608aa04'),
    })}
    <section class="support-hero card">
      <span class="support-hero__icon" aria-hidden="true">☕</span>
      <div>
        <h2>${en ? 'Thank you for being here' : uiText('ui.literal.3c6143f6')}</h2>
        <p>${en ? 'If the academy has helped you, you can support its development in a way that suits you. Every contribution is voluntary.' : uiText('ui.literal.13a5eb9f')}</p>
      </div>
      <a class="btn btn--primary btn--lg" href="${DONATION_URL}" target="_blank" rel="noopener noreferrer">
        ${en ? 'Support on Ko-fi' : uiText('ui.literal.301bfcf9')} ↗
      </a>
    </section>
    <section class="card support-ad">
      <div class="card__title"><span class="ico" aria-hidden="true">🎬</span><h2>${en ? 'Watch an ad to support us' : uiText('ui.literal.e39ffb9d')}</h2></div>
      <p class="small muted">${en
    ? 'This is optional. The video is never required to use lessons or practice, and it does not unlock paid features.'
    : uiText('ui.literal.cc9eac4b')}</p>
      <button class="btn" type="button" id="rewardedSupport"${isAndroidAdPlatform() ? '' : ' disabled'}>
        ${en ? '▶ Watch a video ad' : uiText('ui.literal.fb4ba1ad')}
      </button>
      <span class="hint">${isAndroidAdPlatform()
    ? (en ? 'A test ad is currently used while the app is being prepared.' : uiText('ui.literal.299e0584'))
    : (en ? 'Rewarded video is available in the Android app only.' : uiText('ui.literal.6989a3e7'))}</span>
    </section>`;

  host.querySelector('#rewardedSupport')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await showVoluntaryRewardedAd();
      toast(en ? 'Thanks for supporting the academy!' : uiText('ui.literal.a134b8eb'), 'ok');
    } catch (error) {
      console.error('Could not show the voluntary support ad.', error);
      toast(error.message || (en ? 'The ad is unavailable right now.' : uiText('ui.literal.75b8591b')), 'warn');
    } finally {
      button.disabled = false;
    }
  });
}
