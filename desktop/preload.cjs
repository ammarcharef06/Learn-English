const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('leaNotifications', {
  requestPermission: () => ipcRenderer.invoke('notifications:permission'),
  show: (options) => ipcRenderer.invoke('notifications:show', options),
  schedule: (options) => ipcRenderer.invoke('notifications:schedule', options),
  cancel: () => ipcRenderer.invoke('notifications:cancel'),
});

contextBridge.exposeInMainWorld('leaUpdates', {
  getRuntime: () => ipcRenderer.invoke('updates:runtime'),
  saveInstaller: (filename, bytes) => ipcRenderer.invoke('updates:save-installer', { filename, bytes }),
  downloadInstaller: (options) => ipcRenderer.invoke('updates:download-installer', options),
  openInstaller: () => ipcRenderer.invoke('updates:open-installer'),
  onDownloadProgress: (callback) => {
    if (typeof callback !== 'function') return () => {};
    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on('updates:download-progress', listener);
    return () => ipcRenderer.removeListener('updates:download-progress', listener);
  },
  onUpdateClick: (callback) => {
    if (typeof callback !== 'function') return;
    ipcRenderer.on('updates:open', callback);
  },
});
