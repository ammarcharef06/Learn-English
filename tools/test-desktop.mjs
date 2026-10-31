import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createServer } from 'node:http';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../desktop/server.cjs');
const { validateReleaseUrl } = require('../desktop/update-download.cjs');
const { listenWithStableOrigin } = require('../desktop/stable-server.cjs');
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const server = createStaticServer(root);
const desktopMain = await readFile(resolve(root, 'desktop', 'main.cjs'), 'utf8');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const androidBuild = await readFile(resolve(root, 'android', 'app', 'build.gradle'), 'utf8');
const releaseWorkflow = await readFile(resolve(root, '.github', 'workflows', 'release.yml'), 'utf8');
const storeModule = await readFile(resolve(root, 'assets', 'js', 'core', 'store.js'), 'utf8');
const preload = await readFile(resolve(root, 'desktop', 'preload.cjs'), 'utf8');
const updater = await readFile(resolve(root, 'assets', 'js', 'core', 'updater.js'), 'utf8');
const updateDownload = await readFile(resolve(root, 'desktop', 'update-download.cjs'), 'utf8');
const updateCheckerPlugin = await readFile(resolve(root, 'android', 'app', 'src', 'main', 'java', 'com', 'ammarcharef06', 'learnenglish', 'UpdateCheckerPlugin.java'), 'utf8');
const updateWorker = await readFile(resolve(root, 'android', 'app', 'src', 'main', 'java', 'com', 'ammarcharef06', 'learnenglish', 'UpdateCheckWorker.java'), 'utf8');
const topbar = await readFile(resolve(root, 'assets', 'js', 'views', 'topbar.js'), 'utf8');
const shellView = await readFile(resolve(root, 'assets', 'js', 'views', 'shell.js'), 'utf8');
const zeroShell = await readFile(resolve(root, 'assets', 'js', 'views', 'zero-shell.js'), 'utf8');
const navigationStyles = await readFile(resolve(root, 'assets', 'css', 'main.css'), 'utf8');
const literacyStyles = await readFile(resolve(root, 'assets', 'css', 'literacy.css'), 'utf8');
const literacyEngine = await readFile(resolve(root, 'assets', 'js', 'literacy', 'engine.js'), 'utf8');
const appEntry = await readFile(resolve(root, 'assets', 'js', 'app.js'), 'utf8');
const serviceWorker = await readFile(resolve(root, 'service-worker.js'), 'utf8');
const progressStore = await readFile(resolve(root, 'assets', 'js', 'core', 'store.js'), 'utf8');
const journeyView = await readFile(resolve(root, 'assets', 'js', 'views', 'journey.js'), 'utf8');
const conversationsView = await readFile(resolve(root, 'assets', 'js', 'views', 'conversations.js'), 'utf8');
const settingsView = await readFile(resolve(root, 'assets', 'js', 'views', 'settings.js'), 'utf8');
const flashcardsView = await readFile(resolve(root, 'assets', 'js', 'views', 'flashcards.js'), 'utf8');
const zeroExamView = await readFile(resolve(root, 'assets', 'js', 'views', 'zero-exam.js'), 'utf8');
const mainStyles = await readFile(resolve(root, 'assets', 'css', 'main.css'), 'utf8');
const zeroStyles = await readFile(resolve(root, 'assets', 'css', 'zero.css'), 'utf8');
const zeroEntry = await readFile(resolve(root, 'assets', 'js', 'zero-main.js'), 'utf8');
const trustedHandlerHelper = desktopMain.match(/function registerTrustedHandler\(channel, handler\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(trustedHandlerHelper, 'trusted IPC handler helper exists');
assert.doesNotMatch(trustedHandlerHelper, /\n {2}registerTrustedHandler\(/, 'handler registrations must not be nested inside the helper');
assert.equal((desktopMain.match(/registerTrustedHandler\('updates:runtime'/g) || []).length, 1);
assert.equal(packageJson.build.appId, 'com.ammarcharef06.learnenglish');
assert.match(androidBuild, /applicationId\s+"com\.ammarcharef06\.learnenglish"/);
assert.match(releaseWorkflow, /secrets\.ANDROID_KEYSTORE_BASE64/);
assert.equal(packageJson.build.productName, 'English Academy');
assert.equal(packageJson.build.nsis.deleteAppDataOnUninstall, false);
assert.match(desktopMain, /app\.setName\('English Academy'\);/);
assert.ok(desktopMain.indexOf("app.setName('English Academy')") < desktopMain.indexOf("app.getPath('userData')"));
assert.match(storeModule, /const K_SETTINGS = isEshSandbox \? 'lea\.esh\.settings\.v1' : 'lea\.settings\.v1'/);
assert.match(storeModule, /const K_PROGRESS = isEshSandbox \? 'lea\.esh\.progress\.v1' : 'lea\.progress\.v1'/);
assert.match(storeModule, /const K_AUTH = isEshSandbox \? 'lea\.esh\.auth\.v1' : 'lea\.auth\.v1'/);
assert.match(storeModule, /const K_SESSION = isEshSandbox \? 'lea\.esh\.session\.v1' : 'lea\.session\.v1'/);
assert.match(preload, /downloadInstaller: \(options\) => ipcRenderer\.invoke\('updates:download-installer'/);
assert.match(preload, /onDownloadProgress/);
assert.match(updater, /desktop\.downloadInstaller\(/);
assert.doesNotMatch(updater, /fetch\(url\)/);
assert.match(updateDownload, /release-assets\.githubusercontent\.com/);
assert.match(updateDownload, /downloaded\.sha256 !== digest/);
assert.match(updateDownload, /updates:download-progress/);
assert.equal(validateReleaseUrl('https://github.com/ammarcharef06/Learn-English/releases/download/v1.0.8/installer.exe').hostname, 'github.com');
assert.equal(validateReleaseUrl('https://release-assets.githubusercontent.com/asset', true).hostname, 'release-assets.githubusercontent.com');
assert.throws(() => validateReleaseUrl('https://example.com/installer.exe'), /untrusted/i);
assert.throws(() => validateReleaseUrl('https://github.com/other/repo/releases/download/v1/installer.exe'), /untrusted/i);
assert.throws(() => validateReleaseUrl('https://example.com/asset', true), /untrusted/i);
assert.match(updateCheckerPlugin, /enqueueUniqueWork\(IMMEDIATE_WORK_NAME/);
assert.match(updateCheckerPlugin, /cancelUniqueWork\(IMMEDIATE_WORK_NAME\)/);
assert.match(updateWorker, /catch \(IOException error\)[\s\S]*?return Result\.retry\(\)/);
assert.doesNotMatch(topbar, /id="btn(?:Bell|Theme|Style)"/);
assert.match(shellView, /class="sidenav__brand"/);
assert.match(zeroShell, /class="sidenav__brand"/);
assert.match(navigationStyles, /\.sidebar\.is-open/);
assert.match(navigationStyles, /\.sidenav__brand/);
assert.match(appEntry, /route\('\/journey'/);
assert.match(appEntry, /route\('\/conversations'/);
assert.match(shellView, /key: 'nav\.journey'/);
assert.match(shellView, /key: 'nav\.conversations'/);
assert.match(serviceWorker, /'\.\/assets\/js\/views\/journey\.js'/);
assert.match(serviceWorker, /'\.\/assets\/js\/views\/conversations\.js'/);
assert.match(serviceWorker, /const VERSION = 'v4.17.0'/);
assert.match(appEntry, /route\('\/literacy'/);
assert.match(appEntry, /bootLiteracy/);
assert.match(shellView, /href=\"#\/literacy\"/);
assert.match(literacyStyles, /#literacy-experience/);
assert.doesNotMatch(literacyStyles, /body\s*\{/);
assert.match(literacyEngine, /host\.closest\("#literacy-experience"\)/);
assert.doesNotMatch(literacyEngine, /if \(typeof document !== "undefined"/);
assert.match(serviceWorker, /'\.\/assets\/css\/main\.css'/);
assert.match(progressStore, /const K_PROGRESS = isEshSandbox \? 'lea\.esh\.progress\.v1' : 'lea\.progress\.v1'/);
assert.match(journeyView, /weeklySummary/);
assert.match(conversationsView, /answerConversation/);
assert.match(settingsView, /id="remEnabled"/);
assert.match(settingsView, /id="themeSeg"/);
assert.doesNotMatch(settingsView, /id="skinSeg"/);
assert.match(settingsView, /id="highContrast"/);
assert.match(settingsView, /id="reduceMotion"/);
assert.match(mainStyles, /--bg: #0a0a0a/);
assert.match(mainStyles, /\.fc__face--front/);
assert.match(mainStyles, /\.fc-sheet-layer/);
assert.doesNotMatch(mainStyles, /data-skin="(?:atelier|gnome|kali)"/);
assert.doesNotMatch(await readFile(resolve(root, 'index.html'), 'utf8'), /assets\/css\/(?:redesign|skins\/|zero\.css)/);
assert.match(flashcardsView, /smartReviewPlan/);
assert.match(flashcardsView, /aria-expanded="false"/);
assert.match(flashcardsView, /role="status" aria-live="polite"/);
assert.match(zeroExamView, /id="certPrintHint"/);
assert.match(zeroExamView, /aria-live="polite"/);
assert.match(zeroStyles, /@page \{ size: A4 landscape/);
assert.match(zeroStyles, /#zeroCert \.zcert__field[\s\S]*?display: none/);
assert.match(mainStyles, /html\[data-contrast="high"\]/);
assert.match(mainStyles, /html\[data-reduce-motion="true"\]/);
assert.match(mainStyles, /\.sr-only/);
assert.match(appEntry, /focusMainHeading/);
assert.match(zeroEntry, /focusMainHeading/);
assert.doesNotMatch(appEntry, /community|supabase/i);
assert.doesNotMatch(shellView, /nav\.community|#\/community/);
assert.doesNotMatch(serviceWorker, /community|supabase/i);
assert.doesNotMatch(mainStyles, /community-|community-messenger-mode/i);
assert.doesNotMatch(await readFile(resolve(root, 'assets', 'js', 'core', 'i18n.js'), 'utf8'), /nav\.community/);
assert.doesNotMatch(await readFile(resolve(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml'), 'utf8'), /host="auth"/);
await assert.rejects(readFile(resolve(root, 'assets', 'js', 'views', 'community.js'), 'utf8'), { code: 'ENOENT' });
await assert.rejects(readFile(resolve(root, 'supabase', 'config.toml'), 'utf8'), { code: 'ENOENT' });
assert.match(navigationStyles, /@media \(max-width: (?:700|760)px\)/);
assert.match(storeModule, /const K_SETTINGS = isEshSandbox \? 'lea\.esh\.settings\.v1' : 'lea\.settings\.v1'/);
assert.match(storeModule, /const K_PROGRESS = isEshSandbox \? 'lea\.esh\.progress\.v1' : 'lea\.progress\.v1'/);
assert.match(storeModule, /const K_AUTH = isEshSandbox \? 'lea\.esh\.auth\.v1' : 'lea\.auth\.v1'/);
assert.match(desktopMain, /listenWithStableOrigin\(server, app\.getPath\('userData'\)\)/);
assert.doesNotMatch(desktopMain, /server\.listen\(0,/);

const temporaryUserData = await mkdtemp(join(tmpdir(), 'lea-origin-test-'));
let stablePort;
try {
  const firstServer = createServer();
  stablePort = await listenWithStableOrigin(firstServer, temporaryUserData, 0);
  await new Promise((resolveClose, reject) => firstServer.close((error) => error ? reject(error) : resolveClose()));
  const secondServer = createServer();
  assert.equal(await listenWithStableOrigin(secondServer, temporaryUserData, 0), stablePort);
  await new Promise((resolveClose, reject) => secondServer.close((error) => error ? reject(error) : resolveClose()));
} finally {
  await rm(temporaryUserData, { recursive: true, force: true });
}

async function findAudio(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      const result = await findAudio(entryPath);
      if (result) return result;
    } else if (entry.name.endsWith('.mp3')) {
      return entryPath;
    }
  }
  return null;
}

await new Promise((resolveListen, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolveListen);
});

try {
  const url = `http://127.0.0.1:${server.address().port}`;
  const home = await fetch(`${url}/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /أكاديمية الإنجليزية/);

  const icon = await fetch(`${url}/assets/img/favicon.svg`);
  assert.equal(icon.status, 200);
  assert.match(icon.headers.get('content-type'), /^image\/svg\+xml/);

  const audioPath = await findAudio(resolve(root, 'assets', 'audio'));
  assert.ok(audioPath, 'at least one offline pronunciation recording exists');
  const audioUrl = `${url}/${relative(root, audioPath).split(sep).join('/')}`;
  const audioRange = await fetch(audioUrl, { headers: { Range: 'bytes=0-15' } });
  assert.equal(audioRange.status, 206);
  assert.equal(audioRange.headers.get('content-type'), 'audio/mpeg');
  assert.equal((await audioRange.arrayBuffer()).byteLength, 16);

  const hiddenFile = await fetch(`${url}/README.md`);
  assert.equal(hiddenFile.status, 404);
  const traversal = await fetch(`${url}/%2e%2e%2fREADME.md`);
  assert.equal(traversal.status, 404);

  const unsupportedMethod = await fetch(url, { method: 'POST' });
  assert.equal(unsupportedMethod.status, 405);
  assert.equal(unsupportedMethod.headers.get('allow'), 'GET, HEAD');

  console.log('Desktop local-server checks passed: app entry, assets, path restrictions, and methods.');
} finally {
  await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
}
