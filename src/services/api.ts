import { DiaryEntry } from '../types';

export const api = {
	async getAllEntries(): Promise<DiaryEntry[]> {
		return window.api.getAllEntries();
	},

	async getEntry(id: string): Promise<DiaryEntry> {
		return window.api.getEntry(id);
	},

	async createEntry(entry: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> {
		return window.api.createEntry(entry);
	},

	async updateEntry(
		id: string,
		entry: Partial<DiaryEntry>,
	): Promise<DiaryEntry> {
		return window.api.updateEntry(id, entry);
	},

	async deleteEntry(id: string): Promise<void> {
		return window.api.deleteEntry(id);
	},
};
