export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    username: string;
    access_token: string;
}

export interface AuthState {
    user: LoginResponse | null;
    isAuthenticated: boolean;
} 