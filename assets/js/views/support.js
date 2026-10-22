import { toast } from '../core/utils.js';
import { pageHead } from './shell.js';
import { showVoluntaryRewardedAd, isAndroidAdPlatform } from '../core/ads.js';

const DONATION_URL = 'https://ko-fi.com/yacine_charef';

export function renderSupport(host) {
  const en = document.documentElement.lang === 'en';
  host.innerHTML = `
    ${pageHead({
      icon: '💛',
      title: en ? 'Support the app' : 'دعم التطبيق',
      subtitle: en ? 'Your support helps keep the learning experience free.' : 'مساهمتك تساعدنا على إبقاء تجربة التعلّم مجانية.',
    })}
    <section class="support-hero card">
      <span class="support-hero__icon" aria-hidden="true">☕</span>
      <div>
        <h2>${en ? 'Thank you for being here' : 'شكراً لوجودك معنا'}</h2>
        <p>${en ? 'If the academy has helped you, you can support its development in a way that suits you. Every contribution is voluntary.' : 'إذا أفادتك الأكاديمية، يمكنك دعم تطويرها بالطريقة التي تناسبك. كل مساهمة اختيارية تماماً.'}</p>
      </div>
      <a class="btn btn--primary btn--lg" href="${DONATION_URL}" target="_blank" rel="noopener noreferrer">
        ${en ? 'Support on Ko-fi' : 'ادعم عبر Ko-fi'} ↗
      </a>
    </section>
    <section class="card support-ad">
      <div class="card__title"><span class="ico" aria-hidden="true">🎬</span><h2>${en ? 'Watch an ad to support us' : 'شاهد إعلاناً لدعمنا'}</h2></div>
      <p class="small muted">${en
    ? 'This is optional. The video is never required to use lessons or practice, and it does not unlock paid features.'
    : 'هذا الخيار اختياري. لا يلزم مشاهدة الفيديو لاستخدام الدروس أو التدريبات، ولا يفتح ميزات مدفوعة.'}</p>
      <button class="btn" type="button" id="rewardedSupport"${isAndroidAdPlatform() ? '' : ' disabled'}>
        ${en ? '▶ Watch a video ad' : '▶ مشاهدة إعلان فيديو'}
      </button>
      <span class="hint">${isAndroidAdPlatform()
    ? (en ? 'A test ad is currently used while the app is being prepared.' : 'يُستخدم إعلان تجريبي حالياً أثناء تجهيز التطبيق.')
    : (en ? 'Rewarded video is available in the Android app only.' : 'الفيديو المكافئ متاح في تطبيق Android فقط.')}</span>
    </section>`;

  host.querySelector('#rewardedSupport')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await showVoluntaryRewardedAd();
      toast(en ? 'Thanks for supporting the academy!' : 'شكراً لدعمك الأكاديمية!', 'ok');
    } catch (error) {
      console.error('Could not show the voluntary support ad.', error);
      toast(error.message || (en ? 'The ad is unavailable right now.' : 'الإعلان غير متاح حالياً.'), 'warn');
    } finally {
      button.disabled = false;
    }
  });
}
