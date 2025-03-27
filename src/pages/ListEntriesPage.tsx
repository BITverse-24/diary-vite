import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, SlidersHorizontal, LogOut } from 'lucide-react';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';

const ListEntriesPage = () => {
	const navigate = useNavigate();
	const { entries, isLoading, error } = useDiary();
	const { logout } = useAuth();
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const filteredEntries = entries
		.filter(
			(entry) =>
				entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				entry.content.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		});

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#1E1E1E] p-6 flex items-center justify-center">
				<div className="text-[#FFD700] text-xl">Loading entries...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#1E1E1E] p-6 flex items-center justify-center">
				<div className="text-red-500 text-xl">{error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#1E1E1E] p-6">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center gap-4 mb-8">
					<button
						onClick={() => navigate('/new')}
						className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-[#1E1E1E] rounded hover:bg-[#FFE55C] transition-colors"
					>
						<Plus size={20} /> New Entry
					</button>
					<div className="flex-1 relative">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]"
							size={20}
						/>
						<input
							type="text"
							placeholder="Search..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] text-[#FFD700] rounded border border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
						/>
					</div>
					<button
						onClick={() =>
							setSortOrder((prev) =>
								prev === 'asc' ? 'desc' : 'asc',
							)
						}
						className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-[#FFD700] rounded hover:bg-[#3A3A3A] transition-colors"
					>
						<SlidersHorizontal size={20} /> Sort by
					</button>
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-[#FFD700] rounded hover:bg-[#3A3A3A] transition-colors"
					>
						<LogOut size={20} />
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredEntries.map((entry) => (
						<div
							key={entry.id}
							onClick={() => navigate(`/entry/${entry.id}`)}
							className="bg-[#2A2A2A] p-4 rounded-lg cursor-pointer hover:bg-[#3A3A3A] transition-colors"
						>
							<h2 className="text-xl text-[#FFD700] mb-2">
								{entry.title}
							</h2>
							<p className="text-[#FFD700] opacity-70 mb-4 line-clamp-2">
								{entry.content}
							</p>
							<div className="text-sm text-[#FFD700] opacity-50">
								<span>
									Created:{' '}
									{format(
										new Date(entry.createdAt),
										'MM/dd/yy',
									)}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ListEntriesPage;
