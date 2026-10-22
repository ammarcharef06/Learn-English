const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
const ROOT_FILES = new Set([
  'index.html',
  'zero.html',
  'manifest.webmanifest',
  'manifest-zero.webmanifest',
  'service-worker.js',
]);

function createStaticServer(webRoot) {
  const root = path.resolve(webRoot);
  return http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end();
      return;
    }
    const requestedPath = pathname.replace(/^[/\\]+/, '');
    const relativePath = requestedPath ? path.normalize(requestedPath) : 'index.html';
    const filePath = path.resolve(root, relativePath);
    const fromRoot = path.relative(root, filePath);
    const allowed = ROOT_FILES.has(fromRoot) || fromRoot.startsWith(`assets${path.sep}`);
    if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot) || !allowed) {
      response.writeHead(404).end('Not found');
      return;
    }

    fs.stat(filePath, (statError, stat) => {
      if (statError || !stat.isFile()) {
        response.writeHead(404).end('Not found');
        return;
      }
      const headers = {
        'Accept-Ranges': 'bytes',
        'Content-Type': CONTENT_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
      };
      const range = request.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
      let statusCode = 200;
      let start = 0;
      let end = stat.size - 1;
      if (request.headers.range) {
        if (!range || (!range[1] && !range[2])) {
          response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end();
          return;
        }
        if (range[1]) {
          start = Number(range[1]);
          end = range[2] ? Number(range[2]) : end;
        } else {
          start = Math.max(0, stat.size - Number(range[2]));
        }
        if (start > end || start >= stat.size) {
          response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end();
          return;
        }
        end = Math.min(end, stat.size - 1);
        statusCode = 206;
        headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
      }
      headers['Content-Length'] = end - start + 1;
      response.writeHead(statusCode, headers);
      if (request.method === 'HEAD') {
        response.end();
        return;
      }
      fs.createReadStream(filePath, { start, end }).pipe(response);
    });
  });
}

module.exports = { createStaticServer };
