const { app, BrowserWindow, Notification, Tray, Menu, ipcMain, shell } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createStaticServer } = require('./server.cjs');
const { listenWithStableOrigin } = require('./stable-server.cjs');
const { downloadInstaller } = require('./update-download.cjs');

app.setName('English Academy');

const WEB_ROOT = app.isPackaged ? app.getAppPath() : path.resolve(__dirname, '..');
const REMINDER_PATH = () => path.join(app.getPath('userData'), 'reminder.json');
const TRAY_ICON = path.join(WEB_ROOT, 'assets', 'img', 'icon-512.png');
let server;
let tray;
let reminderTimer;
let reminder = { enabled: false, days: [], time: '19:00', title: '', body: '' };
let quitting = false;
let trustedOrigin = '';
let downloadedInstaller = '';
const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) app.quit();
else app.on('second-instance', () => showWindow());

function validReminder(value) {
  return value && typeof value === 'object'
    && typeof value.enabled === 'boolean'
    && /^\d{2}:\d{2}$/.test(value.time)
    && Number(value.time.slice(0, 2)) < 24
    && Number(value.time.slice(3)) < 60
    && Array.isArray(value.days)
    && value.days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    && typeof value.title === 'string'
    && typeof value.body === 'string';
}

async function setStartup(enabled) {
  if (!app.isPackaged) return;
  if (process.platform === 'win32' || process.platform === 'darwin') {
    app.setLoginItemSettings({ openAtLogin: enabled, args: enabled ? ['--hidden'] : [] });
    return;
  }
  if (process.platform !== 'linux') return;
  const autostartDir = path.join(app.getPath('home'), '.config', 'autostart');
  const entry = path.join(autostartDir, 'learn-english-reminders.desktop');
  if (!enabled) {
    await fs.rm(entry, { force: true });
    return;
  }
  await fs.mkdir(autostartDir, { recursive: true });
  const executable = app.getPath('exe').replaceAll('"', '\\"');
  await fs.writeFile(entry, [
    '[Desktop Entry]',
    'Type=Application',
    'Name=English Academy reminders',
    `Exec="${executable}" --hidden`,
    `Icon=${TRAY_ICON}`,
    'Terminal=false',
    'X-GNOME-Autostart-enabled=true',
    '',
  ].join('\n'), { mode: 0o755 });
}

function showSystemNotification(title, body, url = '') {
  if (!Notification.isSupported()) throw new Error('System notifications are not supported.');
  const notification = new Notification({ title, body, icon: TRAY_ICON, silent: false });
  notification.on('click', () => {
    showWindow();
    if (url.includes('#/settings?section=updates')) {
      BrowserWindow.getAllWindows()[0]?.webContents.send('updates:open');
    }
  });
  notification.show();
}

function scheduleNextReminder() {
  clearTimeout(reminderTimer);
  reminderTimer = null;
  if (!reminder.enabled || !reminder.days.length) return;

  const [hour, minute] = reminder.time.split(':').map(Number);
  const now = new Date();
  let next = null;
  for (let offset = 0; offset <= 7; offset++) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + offset);
    candidate.setHours(hour, minute, 0, 0);
    if (candidate > now && reminder.days.includes(candidate.getDay())) {
      next = candidate;
      break;
    }
  }
  if (!next) return;

  reminderTimer = setTimeout(() => {
    try {
      showSystemNotification(reminder.title || 'English Academy', reminder.body || 'Time for your English practice.');
    } catch (error) {
      console.error('Could not show scheduled desktop reminder.', error);
    }
    scheduleNextReminder();
  }, Math.min(next.getTime() - now.getTime(), 2147483647));
}

async function saveReminder(nextReminder) {
  if (!validReminder(nextReminder)) throw new Error('Invalid reminder schedule.');
  reminder = {
    enabled: nextReminder.enabled,
    days: [...new Set(nextReminder.days)],
    time: nextReminder.time,
    title: nextReminder.title.slice(0, 120),
    body: nextReminder.body.slice(0, 500),
  };
  await fs.mkdir(path.dirname(REMINDER_PATH()), { recursive: true });
  await fs.writeFile(REMINDER_PATH(), JSON.stringify(reminder), 'utf8');
  await setStartup(reminder.enabled && nextReminder.launchAtLogin === true);
  scheduleNextReminder();
  if (reminder.enabled) createTray();
  else destroyTray();
  return { ok: true, mode: 'desktop' };
}

function createTray() {
  if (tray) return;
  tray = new Tray(TRAY_ICON);
  tray.setToolTip('English Academy');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open English Academy', click: () => showWindow() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]));
  tray.on('double-click', showWindow);
}

function destroyTray() {
  if (!tray) return;
  tray.destroy();
  tray = null;
}

function showWindow() {
  const window = BrowserWindow.getAllWindows()[0];
  if (window) {
    if (window.isMinimized()) window.restore();
    window.show();
    window.focus();
  }
}

function registerTrustedHandler(channel, handler) {
  ipcMain.handle(channel, (event, ...args) => {
    let senderOrigin = '';
    try { senderOrigin = new URL(event.senderFrame?.url || '').origin; } catch {}
    if (!trustedOrigin || senderOrigin !== trustedOrigin) {
      throw new Error('Rejected IPC request from an untrusted renderer.');
    }
    return handler(event, ...args);
  });
}

registerTrustedHandler('updates:runtime', async () => ({
  platform: process.platform,
  isAppImage: process.platform === 'linux' && !!process.env.APPIMAGE,
}));
registerTrustedHandler('updates:save-installer', async (_event, options) => {
  const filename = options?.filename;
  const bytes = options?.bytes;
  if (typeof filename !== 'string' || path.basename(filename) !== filename
    || !/^[A-Za-z0-9._ -]+\.(exe|AppImage|deb)$/i.test(filename)) {
    throw new Error('Rejected an invalid installer filename.');
  }
  const data = Buffer.isBuffer(bytes) ? bytes : ArrayBuffer.isView(bytes)
    ? Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    : bytes instanceof ArrayBuffer ? Buffer.from(bytes) : null;
  if (!data?.length || data.length > 700 * 1024 * 1024) throw new Error('Rejected invalid installer data.');
  const destination = path.join(app.getPath('downloads'), `Learn-English-${Date.now()}-${filename}`);
  await fs.writeFile(destination, data, { flag: 'wx' });
  downloadedInstaller = destination;
  return { filename: path.basename(destination) };
});
registerTrustedHandler('updates:download-installer', async (event, options) => {
  const result = await downloadInstaller({
    ...options,
    sender: event.sender,
    downloadsPath: app.getPath('downloads'),
  });
  downloadedInstaller = path.join(app.getPath('downloads'), result.filename);
  return result;
});
registerTrustedHandler('updates:open-installer', async () => {
  const downloads = path.resolve(app.getPath('downloads'));
  if (!downloadedInstaller || path.dirname(path.resolve(downloadedInstaller)) !== downloads) {
    throw new Error('No verified installer is ready to open.');
  }
  const error = await shell.openPath(downloadedInstaller);
  if (error) throw new Error(`Could not open the installer: ${error}`);
  return true;
});

function createWindow(url) {
  const window = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 360,
    minHeight: 560,
    autoHideMenuBar: true,
    icon: TRAY_ICON,
    show: !process.argv.includes('--hidden'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
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
  window.on('close', (event) => {
    if (reminder.enabled && !quitting) {
      event.preventDefault();
      window.hide();
      createTray();
    }
  });
  window.loadURL(url);
}

registerTrustedHandler('notifications:permission', async () => ({
  permission: Notification.isSupported() ? 'granted' : 'unsupported',
}));
registerTrustedHandler('notifications:show', async (_event, options) => {
  if (!options || typeof options.title !== 'string' || typeof options.body !== 'string') {
    throw new Error('Invalid notification content.');
  }
  showSystemNotification(options.title.slice(0, 120), options.body.slice(0, 500), String(options.url || '').slice(0, 300));
  return true;
});
registerTrustedHandler('notifications:schedule', (_event, options) => saveReminder(options));
registerTrustedHandler('notifications:cancel', async () => {
  await saveReminder({ ...reminder, enabled: false, launchAtLogin: false });
  return true;
});

app.whenReady().then(async () => {
  if (!hasSingleInstanceLock) return;
  try {
    const storedReminder = JSON.parse(await fs.readFile(REMINDER_PATH(), 'utf8'));
    if (validReminder(storedReminder)) reminder = storedReminder;
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Could not load reminder schedule.', error);
  }
  scheduleNextReminder();
  if (reminder.enabled) {
    createTray();
    try { await setStartup(true); }
    catch (error) { console.error('Could not enable startup reminders.', error); }
  }

  server = createStaticServer(WEB_ROOT);
  try {
    const port = await listenWithStableOrigin(server, app.getPath('userData'));
    const url = `http://127.0.0.1:${port}/`;
    trustedOrigin = new URL(url).origin;
    createWindow(url);
  } catch (error) {
    console.error('Could not start the local app server.', error);
    app.quit();
  }
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && server?.listening) {
      createWindow(`http://127.0.0.1:${server.address().port}/`);
    } else {
      showWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!reminder.enabled && process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  quitting = true;
  clearTimeout(reminderTimer);
  server?.close();
});
