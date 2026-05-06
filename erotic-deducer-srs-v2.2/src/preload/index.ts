import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key: string) => ipcRenderer.invoke('get-store', key),
    set: (key: string, data: any) => ipcRenderer.invoke('set-store', key, data),
    delete: (key: string) => ipcRenderer.invoke('delete-store', key),
  },
  file: {
    save: (content: string, path: string) => ipcRenderer.invoke('save-file', content, path),
    read: (path: string) => ipcRenderer.invoke('read-file', path),
  },
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.invoke('is-maximized'),
  },
})
