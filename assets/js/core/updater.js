import { APP_VERSION } from './app-version.js';
import { settings } from './store.js';

const RELEASE_API = 'https://api.github.com/repos/ammarcharef06/Learn-English/releases/latest';
const CHECKSUMS_NAME = 'SHA256SUMS.txt';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000;
const MAX_DOWNLOAD_BYTES = 700 * 1024 * 1024;

export function compareVersions(left, right) {
  const parse = (value) => {
    const match = String(value).replace(/^v/i, '').match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) throw new Error(`Invalid release version: ${value}`);
    return match.slice(1).map(Number);
  };
  const a = parse(left);
  const b = parse(right);
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

export function selectReleaseAsset(assets, platform, isAppImage = false) {
  if (!Array.isArray(assets)) throw new Error('Release assets are missing.');
  const allowed = (asset) => {
    if (!asset || typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string') return false;
    if (!/^[A-Za-z0-9._ -]{1,180}\.(apk|exe|AppImage|deb)$/i.test(asset.name)) return false;
    return isTrustedReleaseUrl(asset.browser_download_url);
  };
  const usable = assets.filter(allowed);
  let asset;
  if (platform === 'android') {
    asset = usable.find((item) => item.name === 'Learn-English-Android.apk');
  } else if (platform === 'win32') {
    asset = usable.find((item) => /\.exe$/i.test(item.name) && /setup/i.test(item.name))
      || usable.find((item) => /\.exe$/i.test(item.name));
  } else if (platform === 'linux') {
    asset = isAppImage
      ? usable.find((item) => /\.AppImage$/i.test(item.name))
      : usable.find((item) => /\.deb$/i.test(item.name))
        || usable.find((item) => /\.AppImage$/i.test(item.name));
  }
  if (!asset) throw new Error(`No update installer is available for ${platform}.`);
  return asset;
}

async function runtimeInfo() {
  if (window.Capacitor?.isNativePlatform?.()) return { platform: window.Capacitor.getPlatform() };
  return await window.leaUpdates?.getRuntime?.() || { platform: 'web' };
}

export async function checkForUpdate({ force = false } = {}) {
  const runtime = await runtimeInfo();
  const platform = runtime.platform;
  if (platform === 'web') return { supported: false, currentVersion: APP_VERSION };
  const lastChecked = Number(localStorage.getItem('lea.update.lastCheck') || 0);
  if (!force && Date.now() - lastChecked < CHECK_INTERVAL) {
    return { supported: true, skipped: true, currentVersion: APP_VERSION };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error(`GitHub release check failed (${response.status}).`);
  const release = await response.json();
  if (release.draft || release.prerelease || !Array.isArray(release.assets)) {
    throw new Error('GitHub returned an invalid stable release.');
  }
  const latestVersion = String(release.tag_name || '').replace(/^v/, '');
  const asset = selectReleaseAsset(release.assets, platform, runtime.isAppImage === true);
  const checksumAsset = release.assets.find((item) => item.name === CHECKSUMS_NAME && isTrustedReleaseUrl(item.browser_download_url));
  const digest = parseAssetDigest(asset.digest);
  if (!digest && !checksumAsset) {
    throw new Error('The release is missing its trusted SHA-256 checksum file.');
  }
  localStorage.setItem('lea.update.lastCheck', String(Date.now()));
  const update = compareVersions(latestVersion, APP_VERSION) > 0;
  return {
    supported: true,
    update,
    currentVersion: APP_VERSION,
    latestVersion,
    release: {
      name: String(release.name || `v${latestVersion}`),
      url: String(release.html_url || ''),
      notes: String(release.body || ''),
      publishedAt: String(release.published_at || ''),
      asset,
      checksumAsset,
      isAppImage: runtime.isAppImage === true,
      platform,
    },
  };
}

export async function downloadAndOpenUpdate(release, onProgress = () => {}) {
  if (!release?.asset || !isTrustedReleaseUrl(release.asset.browser_download_url)
    || (!parseAssetDigest(release.asset.digest) && !isTrustedReleaseUrl(release.checksumAsset?.browser_download_url))) {
    throw new Error('The update links are not trusted GitHub release assets.');
  }
  if (!Number.isSafeInteger(release.asset.size) || release.asset.size <= 0 || release.asset.size > MAX_DOWNLOAD_BYTES) {
    throw new Error('The installer has an invalid or unsupported file size.');
  }
  const platform = release.platform || (await runtimeInfo()).platform;
  const expectedHash = parseAssetDigest(release.asset.digest) || findChecksum(
    platform === 'android'
      ? await downloadAndroidText(release.checksumAsset)
      : await fetchTrustedText(release.checksumAsset.browser_download_url),
    release.asset.name,
  );

  if (platform === 'android') {
    const update = await downloadAndroidAsset(release.asset, onProgress);
    const actualHash = await hashAndroidFile(update.filePath);
    if (actualHash !== expectedHash) {
      await update.filesystem.deleteFile({ path: update.filePath });
      throw new Error('The downloaded APK failed its SHA-256 verification.');
    }
    await update.fileOpener.open({
      filePath: update.filePath,
      contentType: 'application/vnd.android.package-archive',
      openWithDefault: true,
    });
    return { opened: true, platform };
  }

  const bytes = await downloadWebAsset(release.asset.browser_download_url, onProgress, release.asset.size);
  const actualHash = await hashBytes(bytes);
  if (actualHash !== expectedHash) throw new Error('The downloaded installer failed its SHA-256 verification.');
  const desktop = window.leaUpdates;
  if (!desktop) throw new Error('The desktop installer bridge is unavailable.');
  const saved = await desktop.saveInstaller(release.asset.name, bytes);
  if (platform === 'linux' && release.isAppImage) {
    return { opened: false, manualInstall: true, platform, filename: saved.filename };
  }
  await desktop.openInstaller();
  return { opened: true, platform, filename: saved.filename };
}

export function scheduleBackgroundUpdateChecks() {
  const announcePending = async () => {
    if (!settings.reminder.enabled) return;
    let pending;
    try { pending = JSON.parse(localStorage.getItem('lea.update.pending') || 'null'); }
    catch { pending = null; }
    if (!pending?.version || pending.version === localStorage.getItem('lea.update.notified')) return;
    const { showNotification } = await import('./notify.js');
    await showNotification(
      'تحديث جديد لأكاديمية الإنجليزية',
      `الإصدار ${pending.version} متاح الآن. اضغط لعرض التفاصيل والتحديث.`,
      { tag: 'lea-update', url: './index.html#/settings?section=updates' },
    );
    localStorage.setItem('lea.update.notified', pending.version);
  };
  const check = async () => {
    if (!navigator.onLine) return;
    try {
      const result = await checkForUpdate();
      if (result.supported && result.update) {
        localStorage.setItem('lea.update.pending', JSON.stringify({
          version: result.latestVersion,
          url: result.release.url,
        }));
      } else if (result.supported) {
        localStorage.removeItem('lea.update.pending');
      }
      await announcePending();
    } catch (error) {
      console.warn('Background update check failed.', error);
    }
  };
  void check();
  return setInterval(check, CHECK_INTERVAL);
}

function isTrustedReleaseUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com'
      && url.pathname.startsWith('/ammarcharef06/Learn-English/releases/download/');
  } catch {
    return false;
  }
}

function findChecksum(text, filename) {
  const line = String(text).split(/\r?\n/).find((entry) => entry.trim().endsWith(`  ${filename}`));
  const match = line?.match(/^([a-f0-9]{64})\s{2,}/i);
  if (!match) throw new Error(`SHA-256 checksum is missing for ${filename}.`);
  return match[1].toLowerCase();
}

function parseAssetDigest(value) {
  const match = typeof value === 'string' ? value.match(/^sha256:([a-f0-9]{64})$/i) : null;
  return match ? match[1].toLowerCase() : '';
}

async function fetchTrustedText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download checksum file (${response.status}).`);
  const text = await response.text();
  if (text.length > 1024 * 1024) throw new Error('The release checksum file is too large.');
  return text;
}

async function downloadWebAsset(url, onProgress, expectedSize = 0) {
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error(`Installer download failed (${response.status}).`);
  const total = Number(response.headers.get('content-length') || expectedSize || 0);
  if (total > MAX_DOWNLOAD_BYTES) throw new Error('The installer is larger than the supported download limit.');
  const reader = response.body.getReader();
  const chunks = [];
  let bytesRead = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytesRead += value.byteLength;
    if (bytesRead > MAX_DOWNLOAD_BYTES) throw new Error('The installer is larger than the supported download limit.');
    chunks.push(value);
    onProgress({ bytes: bytesRead, total, percent: total ? Math.min(100, Math.round(bytesRead / total * 100)) : 0 });
  }
  const result = new Uint8Array(bytesRead);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

async function hashBytes(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function androidPlugins() {
  const bundle = window.CapacitorUpdateBundle;
  if (!bundle) throw new Error('Android update plugins are unavailable.');
  return bundle;
}

async function downloadAndroidText(asset) {
  if (!Number.isSafeInteger(asset.size) || asset.size <= 0 || asset.size > 1024 * 1024) {
    throw new Error('The release checksum file has an invalid size.');
  }
  const { FileTransfer, Filesystem, Directory } = await androidPlugins();
  const uri = await Filesystem.getUri({ directory: Directory.Cache, path: `lea-${asset.name}` });
  const downloaded = await FileTransfer.downloadFile({ url: asset.browser_download_url, path: uri.uri });
  const contents = await Filesystem.readFile({ path: downloaded.path });
  await Filesystem.deleteFile({ path: downloaded.path });
  return atob(contents.data);
}

async function downloadAndroidAsset(asset, onProgress) {
  const { FileTransfer, Filesystem, FileOpener, Directory } = await androidPlugins();
  const uri = await Filesystem.getUri({ directory: Directory.Cache, path: `lea-${asset.name}` });
  const listener = await FileTransfer.addListener('progress', ({ bytes, contentLength }) => {
    const total = Number(contentLength || asset.size || 0);
    onProgress({
      bytes,
      total,
      percent: total ? Math.min(100, Math.round(bytes / total * 100)) : 0,
    });
  });
  try {
    const result = await FileTransfer.downloadFile({
      url: asset.browser_download_url,
      path: uri.uri,
      progress: true,
      connectTimeout: 30000,
      readTimeout: 60000,
    });
    return { filePath: result.path, filesystem: Filesystem, fileOpener: FileOpener };
  } finally {
    await listener.remove();
  }
}

async function hashAndroidFile(filePath) {
  const { Filesystem } = await androidPlugins();
  const contents = await Filesystem.readFile({ path: filePath });
  return hashBytes(Uint8Array.from(atob(contents.data), (character) => character.charCodeAt(0)));
}
