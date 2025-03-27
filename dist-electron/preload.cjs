import { contextBridge, ipcRenderer } from "electron";
const api = {
  getAllEntries: () => ipcRenderer.invoke("getAllEntries"),
  getEntry: (id) => ipcRenderer.invoke("getEntry", id),
  createEntry: (entry) => ipcRenderer.invoke("createEntry", entry),
  updateEntry: (id, entry) => ipcRenderer.invoke("updateEntry", id, entry),
  deleteEntry: (id) => ipcRenderer.invoke("deleteEntry", id)
};
contextBridge.exposeInMainWorld("api", api);
export {
  api as default
};
