const { createHash, randomUUID } = require('node:crypto');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const https = require('node:https');
const path = require('node:path');
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const MAX_DOWNLOAD_BYTES = 700 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const RELEASE_HOSTS = new Set([
  'github.com',
  'release-assets.githubusercontent.com',
  'objects.githubusercontent.com',
  'github-releases.githubusercontent.com',
]);

function validateReleaseUrl(value, isRedirect = false) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Invalid GitHub release download URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password || !RELEASE_HOSTS.has(url.hostname)
    || (!isRedirect && (url.hostname !== 'github.com'
      || !url.pathname.startsWith('/ammarcharef06/Learn-English/releases/download/')))) {
    throw new Error('Rejected an untrusted GitHub release download URL.');
  }
  return url;
}

function getResponse(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      const status = response.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        response.resume();
        if (redirects >= MAX_REDIRECTS || !response.headers.location) {
          reject(new Error('The GitHub download redirected too many times.'));
          return;
        }
        let next;
        try {
          next = validateReleaseUrl(new URL(response.headers.location, url).href, true);
        } catch (error) {
          reject(error);
          return;
        }
        getResponse(next, redirects + 1).then(resolve, reject);
        return;
      }
      if (status !== 200) {
        response.resume();
        reject(new Error(`GitHub download failed (${status}).`));
        return;
      }
      resolve(response);
    });
    request.setTimeout(30000, () => request.destroy(new Error('GitHub download timed out.')));
    request.once('error', reject);
  });
}

async function downloadTrustedFile(url, destination, { maxBytes, expectedSize = 0, onProgress = () => {} }) {
  validateReleaseUrl(url);
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0 || maxBytes > MAX_DOWNLOAD_BYTES) {
    throw new Error('The download size limit is invalid.');
  }
  const response = await getResponse(url);
  const contentLength = Number(response.headers['content-length'] || expectedSize || 0);
  if (contentLength > maxBytes) {
    response.destroy();
    throw new Error('The download is larger than the supported limit.');
  }
  let bytes = 0;
  const hash = createHash('sha256');
  const meter = new Transform({
    transform(chunk, _encoding, callback) {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        callback(new Error('The download is larger than the supported limit.'));
        return;
      }
      hash.update(chunk);
      onProgress({ bytes, total: contentLength, percent: contentLength ? Math.min(100, Math.round(bytes / contentLength * 100)) : 0 });
      callback(null, chunk);
    },
  });
  try {
    await pipeline(response, meter, fs.createWriteStream(destination, { flags: 'wx' }));
    if (expectedSize > 0 && bytes !== expectedSize) throw new Error('The downloaded installer size does not match the release metadata.');
    return { bytes, sha256: hash.digest('hex') };
  } catch (error) {
    await fsp.rm(destination, { force: true });
    throw error;
  }
}

function findChecksum(text, filename) {
  const line = String(text).split(/\r?\n/).find((entry) => entry.trim().endsWith(`  ${filename}`));
  const match = line?.match(/^([a-f0-9]{64})\s{2,}/i);
  if (!match) throw new Error(`SHA-256 checksum is missing for ${filename}.`);
  return match[1].toLowerCase();
}

async function downloadInstaller({ url, filename, expectedSize, expectedSha256, checksumUrl, sender, downloadsPath }) {
  if (typeof filename !== 'string' || path.basename(filename) !== filename
    || !/^[A-Za-z0-9._ -]+\.(exe|AppImage|deb)$/i.test(filename)) {
    throw new Error('Rejected an invalid installer filename.');
  }
  if (!Number.isSafeInteger(expectedSize) || expectedSize <= 0 || expectedSize > MAX_DOWNLOAD_BYTES) {
    throw new Error('The installer has an invalid or unsupported file size.');
  }
  const token = randomUUID();
  const partialPath = path.join(downloadsPath, `.lea-update-${token}.part`);
  const checksumPath = path.join(downloadsPath, `.lea-checksums-${token}.txt`);
  const destination = path.join(downloadsPath, `Learn-English-${Date.now()}-${filename}`);
  let digest = typeof expectedSha256 === 'string' && /^[a-f0-9]{64}$/i.test(expectedSha256)
    ? expectedSha256.toLowerCase()
    : '';
  try {
    if (!digest) {
      if (typeof checksumUrl !== 'string') throw new Error('The release is missing its trusted SHA-256 checksum.');
      await downloadTrustedFile(checksumUrl, checksumPath, { maxBytes: 1024 * 1024 });
      digest = findChecksum(await fsp.readFile(checksumPath, 'utf8'), filename);
    }
    const downloaded = await downloadTrustedFile(url, partialPath, {
      maxBytes: MAX_DOWNLOAD_BYTES,
      expectedSize,
      onProgress: (progress) => {
        if (!sender.isDestroyed()) sender.send('updates:download-progress', progress);
      },
    });
    if (downloaded.sha256 !== digest) throw new Error('The downloaded installer failed its SHA-256 verification.');
    await fsp.rename(partialPath, destination);
    return { filename: path.basename(destination) };
  } finally {
    await Promise.all([
      fsp.rm(partialPath, { force: true }),
      fsp.rm(checksumPath, { force: true }),
    ]);
  }
}

module.exports = { downloadInstaller, downloadTrustedFile, validateReleaseUrl };
