'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/**
 * @typedef {Object} IpcApi
 * @property {() => Promise<any[]>} getAllEntries
 * @property {(id: string) => Promise<any>} getEntry
 * @property {(entry: any) => Promise<any>} createEntry
 * @property {(id: string, entry: any) => Promise<any>} updateEntry
 * @property {(id: string) => Promise<void>} deleteEntry
 */

/** @type {IpcApi} */
const api = {
  getAllEntries: () => ipcRenderer.invoke('getAllEntries'),
  getEntry: (id) => ipcRenderer.invoke('getEntry', id),
  createEntry: (entry) => ipcRenderer.invoke('createEntry', entry),
  updateEntry: (id, entry) => ipcRenderer.invoke('updateEntry', id, entry),
  deleteEntry: (id) => ipcRenderer.invoke('deleteEntry', id)
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', api); 