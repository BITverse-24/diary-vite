"use strict";
const electron = require("electron");
const path = require("path");
const crypto = require("crypto");
const url = require("url");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const __filename$1 = url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href);
const __dirname$1 = path.dirname(__filename$1);
const entries = [];
let mainWindow = null;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname$1, "../dist-electron/preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorDescription);
  });
  if (electron.app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  }
}
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.handle("getAllEntries", () => {
  return entries;
});
electron.ipcMain.handle("getEntry", (_, id) => {
  const entry = entries.find((e) => e.id === id);
  if (!entry) {
    throw new Error("Entry not found");
  }
  return entry;
});
electron.ipcMain.handle("createEntry", (_, entry) => {
  const newEntry = {
    ...entry,
    id: crypto.randomUUID()
  };
  entries.push(newEntry);
  return newEntry;
});
electron.ipcMain.handle("updateEntry", (_, id, updatedEntry) => {
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Entry not found");
  }
  entries[index] = { ...entries[index], ...updatedEntry };
  return entries[index];
});
electron.ipcMain.handle("deleteEntry", (_, id) => {
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Entry not found");
  }
  entries.splice(index, 1);
});
