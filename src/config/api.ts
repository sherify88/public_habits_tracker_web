// API Configuration
export const API_CONFIG = {
    // Base URL for API requests
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',

    // Timeout for API requests (in milliseconds)
    TIMEOUT: 10000,

    // Headers that will be included in all requests
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

// Environment-specific configurations
export const ENV_CONFIG = {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    isTest: import.meta.env.MODE === 'test',
} as const; 