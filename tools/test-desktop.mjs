import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readdir } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../desktop/server.cjs');
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const server = createStaticServer(root);

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
