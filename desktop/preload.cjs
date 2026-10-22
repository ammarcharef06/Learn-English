const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('leaNotifications', {
  requestPermission: () => ipcRenderer.invoke('notifications:permission'),
  show: (options) => ipcRenderer.invoke('notifications:show', options),
  schedule: (options) => ipcRenderer.invoke('notifications:schedule', options),
  cancel: () => ipcRenderer.invoke('notifications:cancel'),
});
