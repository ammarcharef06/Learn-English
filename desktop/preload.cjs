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
  openInstaller: () => ipcRenderer.invoke('updates:open-installer'),
  onUpdateClick: (callback) => {
    if (typeof callback !== 'function') return;
    ipcRenderer.on('updates:open', callback);
  },
});
