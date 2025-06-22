// Version configuration
// This should be updated to match the version in package.json
export const APP_VERSION = '1.2.0';

// Version checking configuration
export const VERSION_CHECK_CONFIG = {
    // Check interval in milliseconds (20 seconds)
    CHECK_INTERVAL: 20000,

    // API endpoint for version checking
    ENDPOINT: '/version/web',
} as const; 