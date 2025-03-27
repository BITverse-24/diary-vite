import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	ArrowLeft,
	Bold,
	Italic,
	Underline,
	Link,
	Paperclip,
	FileText,
} from 'lucide-react';
import { useDiary } from '../context/DiaryContext';

const NewEntryPage = () => {
	const navigate = useNavigate();
	const { addEntry, error } = useDiary();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (!title.trim() || !content.trim()) return;

		try {
			setIsSaving(true);
			await addEntry({
				title,
				content,
				createdAt: new Date().toISOString(),
			});
			navigate('/');
		} catch (err) {
			console.error('Failed to save entry:', err);
		} finally {
			setIsSaving(false);
		}
	};

	const insertMarkdown = (type: string) => {
		const textarea = document.getElementById(
			'content',
		) as HTMLTextAreaElement;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = content.substring(start, end);
		let newText = '';

		switch (type) {
			case 'bold':
				newText = `**${selectedText}**`;
				break;
			case 'italic':
				newText = `*${selectedText}*`;
				break;
			case 'underline':
				newText = `_${selectedText}_`;
				break;
			case 'link':
				newText = `[${selectedText}](url)`;
				break;
			case 'code':
				newText = `\`${selectedText}\``;
				break;
			default:
				return;
		}

		setContent(
			content.substring(0, start) + newText + content.substring(end),
		);
	};

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
					<div className="flex items-center gap-2">
						<span className="text-sm text-[#FFD700] opacity-50">
							Created - {new Date().toLocaleDateString()}
						</span>
						<button
							onClick={handleSave}
							disabled={isSaving}
							className="px-4 py-2 bg-[#FFD700] text-[#1E1E1E] rounded hover:bg-[#FFE55C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? 'Saving...' : 'Save'}
						</button>
					</div>
				</div>

				{error && (
					<div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded text-red-500">
						{error}
					</div>
				)}

				<div className="space-y-4">
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Entry Name..."
						className="w-full p-4 bg-[#2A2A2A] text-[#FFD700] rounded border border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
					/>

					<div className="relative">
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Enter content here..."
							className="w-full h-[60vh] p-4 bg-[#2A2A2A] text-[#FFD700] rounded border border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700] resize-none"
						/>
						<div className="absolute right-2 top-2 flex flex-col gap-2 bg-[#3A3A3A] p-2 rounded">
							<button
								onClick={() => insertMarkdown('bold')}
								className="p-2 text-[#FFD700] hover:bg-[#2A2A2A] rounded transition-colors"
								title="Bold"
							>
								<Bold size={20} />
							</button>
							<button
								onClick={() => insertMarkdown('italic')}
								className="p-2 text-[#FFD700] hover:bg-[#2A2A2A] rounded transition-colors"
								title="Italic"
							>
								<Italic size={20} />
							</button>
							<button
								onClick={() => insertMarkdown('underline')}
								className="p-2 text-[#FFD700] hover:bg-[#2A2A2A] rounded transition-colors"
								title="Underline"
							>
								<Underline size={20} />
							</button>
							<button
								onClick={() => insertMarkdown('link')}
								className="p-2 text-[#FFD700] hover:bg-[#2A2A2A] rounded transition-colors"
								title="Link"
							>
								<Link size={20} />
							</button>
							<button
								onClick={() => insertMarkdown('code')}
								className="p-2 text-[#FFD700] hover:bg-[#2A2A2A] rounded transition-colors"
								title="Code"
							>
								<FileText size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewEntryPage;
