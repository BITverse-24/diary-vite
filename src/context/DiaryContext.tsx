import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiaryEntry } from '../types';
import { api } from '../services/api';

interface DiaryContextType {
	entries: DiaryEntry[];
	addEntry: (entry: Omit<DiaryEntry, 'id'>) => Promise<void>;
	deleteEntry: (id: string) => Promise<void>;
	updateEntry: (id: string, entry: Partial<DiaryEntry>) => Promise<void>;
	isLoading: boolean;
	error: string | null;
}

const DiaryContext = createContext<DiaryContextType | null>(null);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [entries, setEntries] = useState<DiaryEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadEntries();
	}, []);

	const loadEntries = async () => {
		try {
			setIsLoading(true);
			const data = await api.getAllEntries();
			setEntries(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to load entries',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const addEntry = async (entry: Omit<DiaryEntry, 'id'>) => {
		try {
			const newEntry = await api.createEntry(entry);
			setEntries([...entries, newEntry]);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to create entry',
			);
			throw err;
		}
	};

	const deleteEntry = async (id: string) => {
		try {
			await api.deleteEntry(id);
			setEntries(entries.filter((entry) => entry.id !== id));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to delete entry',
			);
			throw err;
		}
	};

	const updateEntry = async (
		id: string,
		updatedEntry: Partial<DiaryEntry>,
	) => {
		try {
			const updated = await api.updateEntry(id, updatedEntry);
			setEntries(
				entries.map((entry) => (entry.id === id ? updated : entry)),
			);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to update entry',
			);
			throw err;
		}
	};

	return (
		<DiaryContext.Provider
			value={{
				entries,
				addEntry,
				deleteEntry,
				updateEntry,
				isLoading,
				error,
			}}
		>
			{children}
		</DiaryContext.Provider>
	);
};

export const useDiary = () => {
	const context = useContext(DiaryContext);
	if (!context) {
		throw new Error('useDiary must be used within a DiaryProvider');
	}
	return context;
};
