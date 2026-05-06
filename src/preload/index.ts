import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (content: string, filePath: string) => 
    ipcRenderer.invoke('save-file', content, filePath),
  
  readFile: (filePath: string) => 
    ipcRenderer.invoke('read-file', filePath),
});
