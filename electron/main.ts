import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the DiaryEntry interface
interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// In-memory storage for diary entries
const entries: DiaryEntry[] = [];

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Set up error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
  });

  // Development vs Production environment
  if (app.isPackaged) {
    // Production: load from dist
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  } else {
    // Development: load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  }
}

// Create window when Electron has initialized
app.whenReady().then(() => {
  createWindow();

  // Re-create window if activated with no windows (macOS behavior)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for diary operations
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
    id: randomUUID(),
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