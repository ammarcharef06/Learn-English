const fs = require('node:fs/promises');
const path = require('node:path');

function listen(server, port) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.removeListener('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.removeListener('error', onError);
      resolve(server.address().port);
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, '127.0.0.1');
  });
}

async function listenWithStableOrigin(server, userDataPath, defaultPort = 43173) {
  const originFile = path.join(userDataPath, 'local-app-origin.json');
  let savedPort = null;
  try {
    const saved = JSON.parse(await fs.readFile(originFile, 'utf8'));
    if (Number.isInteger(saved.port) && saved.port > 0 && saved.port <= 65535) savedPort = saved.port;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (savedPort !== null) return listen(server, savedPort);

  let port;
  try {
    port = await listen(server, defaultPort);
  } catch (error) {
    if (error.code !== 'EADDRINUSE' || defaultPort === 0) throw error;
    port = await listen(server, 0);
  }
  await fs.mkdir(userDataPath, { recursive: true });
  await fs.writeFile(originFile, JSON.stringify({ port }), 'utf8');
  return port;
}

module.exports = { listenWithStableOrigin };
