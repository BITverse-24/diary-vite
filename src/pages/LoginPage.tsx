import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
	const [password, setPassword] = useState('');
	const { login, isInitialized } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		login(password);
		navigate('/');
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] text-[#FFD700] p-4">
			<h1 className="text-4xl font-mono mb-8">Personal Diary</h1>
			<div className="bg-[#2A2A2A] p-6 rounded-lg w-full max-w-md">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm mb-2">
							{isInitialized ? "Secret Key" : "Set Your Secret Key"}
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 bg-[#1E1E1E] border border-[#FFD700] rounded focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
							placeholder={isInitialized ? "Enter your secret key" : "Create a secret key"}
						/>
					</div>
					{!isInitialized && (
						<p className="text-sm text-amber-400">
							First time? Create a secret key to protect your diary.
						</p>
					)}
					<button
						type="submit"
						className="w-full bg-[#FFD700] text-[#1E1E1E] py-2 rounded hover:bg-[#FFE55C] transition-colors"
					>
						{isInitialized ? "Enter" : "Create Diary"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
