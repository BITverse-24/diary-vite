import { contextBridge, ipcRenderer } from 'electron';

/**
 * API for communicating with the main process.
 * Exposes a set of functions for diary entry operations.
 */
const api = {
  getAllEntries: () => ipcRenderer.invoke('getAllEntries'),
  getEntry: (id: string) => ipcRenderer.invoke('getEntry', id),
  createEntry: (entry: { title: string; content: string; createdAt: string }) => 
    ipcRenderer.invoke('createEntry', entry),
  updateEntry: (id: string, entry: { title?: string; content?: string }) => 
    ipcRenderer.invoke('updateEntry', id, entry),
  deleteEntry: (id: string) => ipcRenderer.invoke('deleteEntry', id)
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('api', api);