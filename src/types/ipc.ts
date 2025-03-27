import { DiaryEntry } from '../types';

export interface IpcApi {
  getAllEntries: () => Promise<DiaryEntry[]>;
  getEntry: (id: string) => Promise<DiaryEntry>;
  createEntry: (entry: Omit<DiaryEntry, 'id'>) => Promise<DiaryEntry>;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => Promise<DiaryEntry>;
  deleteEntry: (id: string) => Promise<void>;
}

declare global {
  interface Window {
    api: IpcApi;
  }
} 