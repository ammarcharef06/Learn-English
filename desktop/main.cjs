const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const { createStaticServer } = require('./server.cjs');
const WEB_ROOT = app.isPackaged ? app.getAppPath() : path.resolve(__dirname, '..');
let server;

function createWindow(url) {
  const window = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 360,
    minHeight: 560,
    autoHideMenuBar: true,
    icon: path.join(WEB_ROOT, 'assets', 'img', 'icon-512.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  window.webContents.setWindowOpenHandler(({ url: target }) => {
    if (target.startsWith('https://') || target.startsWith('http://')) shell.openExternal(target);
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, target) => {
    if (!target.startsWith(url)) event.preventDefault();
  });
  window.loadURL(url);
}

app.whenReady().then(() => {
  server = createStaticServer(WEB_ROOT);
  server.once('error', (error) => {
    console.error('Could not start the local app server.', error);
    app.quit();
  });
  server.listen(0, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${server.address().port}/`;
    createWindow(url);
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && server?.listening) {
      createWindow(`http://127.0.0.1:${server.address().port}/`);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => server?.close());
