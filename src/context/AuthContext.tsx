import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

const STORED_PASSWORD_KEY = 'diary-password-hash';

// Simple hash function (in a real app, use a proper crypto library)
const hashPassword = (password: string) => {
	return password.split('').reduce((hash, char) => {
		return ((hash << 5) - hash) + char.charCodeAt(0) | 0;
	}, 0).toString(16);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// Check if password is set
		const storedHash = localStorage.getItem(STORED_PASSWORD_KEY);
		setIsInitialized(!!storedHash);
		setIsAuthenticated(false);
	}, []);

	const login = (password: string) => {
		const storedHash = localStorage.getItem(STORED_PASSWORD_KEY);
		const inputHash = hashPassword(password);
		
		if (!storedHash) {
			// First time setup
			localStorage.setItem(STORED_PASSWORD_KEY, inputHash);
			setIsAuthenticated(true);
			setIsInitialized(true);
		} else if (storedHash === inputHash) {
			// Password matches
			setIsAuthenticated(true);
		}
	};

	const logout = () => {
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, isInitialized, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
