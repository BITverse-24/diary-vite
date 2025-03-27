import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let mainWindow = null;
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: join(__dirname, "preload.cjs")
    }
  });
  if (process.env.NODE_ENV === "development") {
    await mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(join(__dirname, "../dist/index.html"));
  }
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorDescription);
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
let entries = [];
ipcMain.handle("getAllEntries", () => {
  return entries;
});
ipcMain.handle("getEntry", (_, id) => {
  const entry = entries.find((e) => e.id === id);
  if (!entry) {
    throw new Error("Entry not found");
  }
  return entry;
});
ipcMain.handle("createEntry", (_, entry) => {
  const newEntry = {
    ...entry,
    id: crypto.randomUUID()
  };
  entries.push(newEntry);
  return newEntry;
});
ipcMain.handle("updateEntry", (_, id, updatedEntry) => {
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Entry not found");
  }
  entries[index] = { ...entries[index], ...updatedEntry };
  return entries[index];
});
ipcMain.handle("deleteEntry", (_, id) => {
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Entry not found");
  }
  entries.splice(index, 1);
});
