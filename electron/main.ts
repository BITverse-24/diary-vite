import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DiaryEntry } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: join(__dirname, 'preload.cjs'),
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    await mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }

  // Handle IPC errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In-memory storage for diary entries (replace with actual database in production)
let entries: DiaryEntry[] = [];

// IPC handlers
ipcMain.handle('getAllEntries', () => {
  return entries;
});

ipcMain.handle('getEntry', (_, id: string) => {
  const entry = entries.find(e => e.id === id);
  if (!entry) {
    throw new Error('Entry not found');
  }
  return entry;
});

ipcMain.handle('createEntry', (_, entry: Omit<DiaryEntry, 'id'>) => {
  const newEntry: DiaryEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };
  entries.push(newEntry);
  return newEntry;
});

ipcMain.handle('updateEntry', (_, id: string, updatedEntry: Partial<DiaryEntry>) => {
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Entry not found');
  }
  entries[index] = { ...entries[index], ...updatedEntry };
  return entries[index];
});

ipcMain.handle('deleteEntry', (_, id: string) => {
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Entry not found');
  }
  entries.splice(index, 1);
}); 