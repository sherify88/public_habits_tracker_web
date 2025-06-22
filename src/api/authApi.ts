import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';
import { LoginRequest, LoginResponse } from '../types/auth';

const AUTH_ENDPOINT = `${API_CONFIG.BASE_URL}/auth`;

export const authApi = {
    // Login user
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await axios.post<LoginResponse>(`${AUTH_ENDPOINT}/login`, credentials, {
                timeout: API_CONFIG.TIMEOUT,
                headers: API_CONFIG.DEFAULT_HEADERS,
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                // Extract the error message from the backend response
                const errorMessage = error.response.data.message || error.response.data.error || error.message;
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    // Logout user
    logout: async (): Promise<void> => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                await axios.post(`${AUTH_ENDPOINT}/logout`, {}, {
                    timeout: API_CONFIG.TIMEOUT,
                    headers: {
                        ...API_CONFIG.DEFAULT_HEADERS,
                        'Authorization': `Bearer ${token}`
                    },
                });
            }
        } catch (error) {
            // Even if logout fails on server, we should still clear local storage
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        }
    },
};

// Helper functions for token management
export const tokenUtils = {
    getToken: (): string | null => {
        return localStorage.getItem('access_token');
    },

    setToken: (token: string): void => {
        localStorage.setItem('access_token', token);
    },

    removeToken: (): void => {
        localStorage.removeItem('access_token');
    },

    getUser: (): LoginResponse | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    setUser: (user: LoginResponse): void => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    removeUser: (): void => {
        localStorage.removeItem('user');
    },

    isAuthenticated: (): boolean => {
        return !!tokenUtils.getToken();
    },
}; 