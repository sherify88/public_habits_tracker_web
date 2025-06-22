import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LoginResponse } from '../types/auth';
import { authApi, tokenUtils } from '../api/authApi';

interface AuthContextType {
    user: LoginResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<LoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing token on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = tokenUtils.getToken();
                const savedUser = tokenUtils.getUser();

                if (token && savedUser) {
                    setUser(savedUser);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid data
                tokenUtils.removeToken();
                tokenUtils.removeUser();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback(async (credentials: { username: string; password: string }) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authApi.login(credentials);

            // Save to localStorage
            tokenUtils.setToken(response.access_token);
            tokenUtils.setUser(response);

            // Update state
            setUser(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear state regardless of server response
            setUser(null);
            setError(null);
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 