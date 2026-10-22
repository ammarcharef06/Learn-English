import { appendFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const tagName = process.env.GITHUB_REF_NAME ?? process.env.GITHUB_REF?.split('/').at(-1);
const version = tagName?.startsWith('v') ? tagName.slice(1) : packageJson.version;
const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
if (!match) throw new Error(`Release version must be numeric major.minor.patch: ${version}`);

const [major, minor, patch] = match.slice(1).map(Number);
if (minor > 999 || patch > 999) throw new Error('Release minor and patch versions must be below 1000.');
const androidVersionCode = major * 1_000_000 + minor * 1_000 + patch;
if (!Number.isSafeInteger(androidVersionCode) || androidVersionCode < 1 || androidVersionCode > 2_100_000_000) {
  throw new Error(`Release version exceeds Android's supported version code range: ${version}`);
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npm, ['version', version, '--no-git-tag-version', '--allow-same-version'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`npm version failed with status ${result.status}`);

if (process.env.GITHUB_ENV) {
  appendFileSync(process.env.GITHUB_ENV, `APP_VERSION=${version}\nANDROID_VERSION_CODE=${androidVersionCode}\n`);
}
console.log(`Using application version ${version} (Android code ${androidVersionCode}).`);
