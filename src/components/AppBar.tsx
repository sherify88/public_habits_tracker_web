import React, { useState, useCallback } from 'react';
import { LoginResponse } from '../types/auth';
import { tokenUtils } from '../api/authApi';
import LoginDialog from './LoginDialog';

interface AppBarProps {
    onLogin: (credentials: { username: string; password: string }) => Promise<void>;
    onLogout: () => void;
    user: LoginResponse | null;
    isLoading?: boolean;
    error?: string | null;
}

const AppBar: React.FC<AppBarProps> = ({
    onLogin,
    onLogout,
    user,
    isLoading = false,
    error = null
}) => {
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const handleLoginClick = useCallback(() => {
        setShowLoginDialog(true);
    }, []);

    const handleLoginClose = useCallback(() => {
        setShowLoginDialog(false);
    }, []);

    const handleLogin = useCallback(async (credentials: { username: string; password: string }) => {
        await onLogin(credentials);
        setShowLoginDialog(false);
    }, [onLogin]);

    const handleLogout = useCallback(() => {
        onLogout();
    }, [onLogout]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Habits Tracker
                            </h1>
                        </div>

                        {/* Right side - Auth */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-700">
                                        Welcome, <span className="font-medium">{user.username}</span>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <LoginDialog
                isOpen={showLoginDialog}
                onClose={handleLoginClose}
                onLogin={handleLogin}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
};

export default AppBar; 