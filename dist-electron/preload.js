"use strict";
const electron = require("electron");
const api = {
  getAllEntries: () => electron.ipcRenderer.invoke("getAllEntries"),
  getEntry: (id) => electron.ipcRenderer.invoke("getEntry", id),
  createEntry: (entry) => electron.ipcRenderer.invoke("createEntry", entry),
  updateEntry: (id, entry) => electron.ipcRenderer.invoke("updateEntry", id, entry),
  deleteEntry: (id) => electron.ipcRenderer.invoke("deleteEntry", id)
};
electron.contextBridge.exposeInMainWorld("api", api);
