import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userStore = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1720,
    height: 1080,
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

// IPC 文件操作
ipcMain.handle('save-file', async (_, content: string, filePath: string) => {
  try {
    const fullPath = path.resolve(filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf-8');
    return { success: true, path: fullPath };
  } catch (error: any) {
    console.error('保存文件失败:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    return await fs.readFile(path.resolve(filePath), 'utf-8');
  } catch {
    return null;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
