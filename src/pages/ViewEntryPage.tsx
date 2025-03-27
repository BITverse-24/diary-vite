import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useDiary } from '../context/DiaryContext';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { DiaryEntry } from '../types';

const ViewEntryPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { deleteEntry } = useDiary();
	const [entry, setEntry] = useState<DiaryEntry | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	useEffect(() => {
		const loadEntry = async () => {
			if (!id) return;

			try {
				setIsLoading(true);
				const data = await api.getEntry(id);
				setEntry(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load entry',
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadEntry();
	}, [id]);

	const handleDelete = async () => {
		if (!entry) return;

		try {
			await deleteEntry(entry.id);
			navigate('/');
		} catch (err) {
			console.error('Failed to delete entry:', err);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#1E1E1E] p-6 flex items-center justify-center">
				<div className="text-[#FFD700] text-xl">Loading entry...</div>
			</div>
		);
	}

	if (error || !entry) {
		return (
			<div className="min-h-screen bg-[#1E1E1E] p-6 flex items-center justify-center">
				<div className="text-red-500 text-xl">
					{error || 'Entry not found'}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#1E1E1E] p-6">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<button
						onClick={() => navigate('/')}
						className="flex items-center gap-2 text-[#FFD700] hover:opacity-80 transition-opacity"
					>
						<ArrowLeft size={24} />
					</button>
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate(`/edit/${entry.id}`)}
							className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-[#1E1E1E] rounded hover:bg-[#FFE55C] transition-colors"
						>
							<Edit size={20} /> Edit
						</button>
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-red-500 rounded hover:bg-[#3A3A3A] transition-colors"
						>
							<Trash2 size={20} />
						</button>
					</div>
				</div>

				<div className="bg-[#2A2A2A] rounded-lg p-6">
					<div className="text-sm text-[#FFD700] opacity-50 mb-4">
						<span>
							Created:{' '}
							{format(new Date(entry.createdAt), 'MM/dd/yy')}
						</span>
					</div>
					<h1 className="text-2xl text-[#FFD700] mb-6">
						{entry.title}
					</h1>
					<div className="prose prose-invert prose-gold max-w-none">
						<ReactMarkdown>{entry.content}</ReactMarkdown>
					</div>
				</div>

				{showDeleteConfirm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-[#2A2A2A] p-6 rounded-lg max-w-md w-full mx-4">
							<h2 className="text-xl text-[#FFD700] mb-4">
								Delete Entry
							</h2>
							<p className="text-[#FFD700] opacity-70 mb-6">
								Are you sure you want to delete this entry? This
								action cannot be undone.
							</p>
							<div className="flex justify-end gap-4">
								<button
									onClick={() => setShowDeleteConfirm(false)}
									className="px-4 py-2 text-[#FFD700] hover:opacity-80 transition-opacity"
								>
									Cancel
								</button>
								<button
									onClick={handleDelete}
									className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewEntryPage;
