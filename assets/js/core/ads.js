const AD_IDS = {
  app: 'ca-app-pub-3940256099942544~3347511713',
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};
const SAFE_BANNER_ROUTES = new Set(['/about', '/support']);
const INTERSTITIAL_KEY = 'lea.ad.sessions';
const INTERSTITIAL_COOLDOWN = 4 * 60 * 60 * 1000;
let initialization;
let bannerVisible = false;
let interstitialQueued = false;

function admob() {
  if (!window.Capacitor?.isNativePlatform?.() || window.Capacitor.getPlatform?.() !== 'android') return null;
  return window.Capacitor?.Plugins?.AdMob || window.CapacitorAdMobBundle?.AdMob || null;
}

export function isAndroidAdPlatform() {
  return !!admob();
}

async function prepareAds() {
  const plugin = admob();
  if (!plugin) return false;
  if (!initialization) {
    initialization = (async () => {
      let consent = await plugin.requestConsentInfo();
      if (consent.isConsentFormAvailable && consent.status === 'REQUIRED') {
        consent = await plugin.showConsentForm();
      }
      if (!consent.canRequestAds) return false;
      await plugin.initialize();
      return true;
    })();
  }
  try {
    return await initialization;
  } catch (error) {
    initialization = null;
    throw error;
  }
}

export async function updateBannerForRoute(path) {
  const plugin = admob();
  if (!plugin) return;
  if (!SAFE_BANNER_ROUTES.has(path)) {
    if (bannerVisible) await plugin.removeBanner();
    bannerVisible = false;
    return;
  }
  if (bannerVisible || !(await prepareAds())) return;
  await plugin.showBanner({
    adId: AD_IDS.banner,
    adSize: 'ADAPTIVE_BANNER',
    position: 'BOTTOM_CENTER',
    margin: 72,
  });
  bannerVisible = true;
}

export async function maybeShowInterstitial(eventKey) {
  const plugin = admob();
  if (!plugin || !eventKey) return false;
  const state = readInterstitialState();
  if (state.lastEvent === eventKey) return false;
  state.completedSessions += 1;
  state.lastEvent = eventKey;
  localStorage.setItem(INTERSTITIAL_KEY, JSON.stringify(state));
  if (state.completedSessions % 4 !== 0 || Date.now() - state.lastShown < INTERSTITIAL_COOLDOWN) return false;
  interstitialQueued = true;
  return true;
}

export async function showQueuedInterstitial() {
  const plugin = admob();
  if (!interstitialQueued || !plugin || document.hidden) return false;
  interstitialQueued = false;
  if (!(await prepareAds())) return false;
  await plugin.prepareInterstitial({ adId: AD_IDS.interstitial });
  await plugin.showInterstitial();
  const state = readInterstitialState();
  state.lastShown = Date.now();
  localStorage.setItem(INTERSTITIAL_KEY, JSON.stringify(state));
  return true;
}

function readInterstitialState() {
  try {
    const value = JSON.parse(localStorage.getItem(INTERSTITIAL_KEY) || '{}');
    return {
      completedSessions: Number.isSafeInteger(value.completedSessions) && value.completedSessions >= 0
        ? value.completedSessions : 0,
      lastShown: Number.isFinite(value.lastShown) ? value.lastShown : 0,
      lastEvent: typeof value.lastEvent === 'string' ? value.lastEvent : '',
    };
  } catch {
    return { completedSessions: 0, lastShown: 0, lastEvent: '' };
  }
}

export async function showVoluntaryRewardedAd() {
  const plugin = admob();
  if (!plugin) throw new Error('Rewarded video ads are available in the Android app only.');
  if (!(await prepareAds())) throw new Error('Ads are unavailable until consent is provided.');
  await plugin.prepareRewardVideoAd({ adId: AD_IDS.rewarded });
  return plugin.showRewardVideoAd();
}
