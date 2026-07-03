const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onMediaCommand: (callback) => {
    ipcRenderer.on('media-command', (_event, command) => callback(command))
  },
})
