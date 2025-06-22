import React, { useState, useCallback } from 'react';
import { LoginRequest } from '../types/auth';

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (credentials: LoginRequest) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
    isOpen,
    onClose,
    onLogin,
    isLoading = false,
    error = null
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        try {
            await onLogin({
                username: username.trim(),
                password: password.trim(),
            });

            // Reset form on success
            setUsername('');
            setPassword('');
            setFormErrors({});
        } catch (error) {
            // Error is handled by parent component
        }
    }, [username, password, onLogin]);

    const handleCancel = useCallback(() => {
        setUsername('');
        setPassword('');
        setFormErrors({});
        onClose();
    }, [onClose]);

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleFormClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick} data-testid="login-dialog-overlay">
            <div className="bg-gray-100 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={handleFormClick}>
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Login</h2>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                            aria-label="Close dialog"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (formErrors.username) {
                                        setFormErrors(prev => ({ ...prev, username: undefined }));
                                    }
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your username"
                                disabled={isLoading}
                            />
                            {formErrors.username && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (formErrors.password) {
                                        setFormErrors(prev => ({ ...prev, password: undefined }));
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isLoading) {
                                        e.preventDefault();
                                        handleSubmit(e as any);
                                    }
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your password"
                                disabled={isLoading}
                            />
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginDialog; 