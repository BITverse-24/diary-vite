var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_preload = __commonJS({
  "preload.cjs"() {
    const { contextBridge, ipcRenderer } = require("electron");
    const api = {
      getAllEntries: () => ipcRenderer.invoke("getAllEntries"),
      getEntry: (id) => ipcRenderer.invoke("getEntry", id),
      createEntry: (entry) => ipcRenderer.invoke("createEntry", entry),
      updateEntry: (id, entry) => ipcRenderer.invoke("updateEntry", id, entry),
      deleteEntry: (id) => ipcRenderer.invoke("deleteEntry", id)
    };
    contextBridge.exposeInMainWorld("api", api);
  }
});
export default require_preload();
