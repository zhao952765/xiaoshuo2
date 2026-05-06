import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userStore = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1680,
    height: 1020,
    minWidth: 1280,
    minHeight: 800,
    backgroundColor: '#0F0F12',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

// IPC Handlers
ipcMain.handle('save-file', async (_, content: string, filePath: string) => {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true, path: filePath };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
});

ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
});

// Store (electron-store)
ipcMain.handle('get-store', (_event, key: string) => {
  return userStore.get(key)
})
ipcMain.handle('set-store', (_event, key: string, data: any) => {
  userStore.set(key, data)
})
ipcMain.handle('delete-store', (_event, key: string) => {
  userStore.delete(key)
})

// 窗口控制
ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize()
  else mainWindow?.maximize()
})
ipcMain.on('window-close', () => mainWindow?.close())
ipcMain.handle('is-maximized', () => mainWindow?.isMaximized() ?? false)

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
