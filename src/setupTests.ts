import '@testing-library/jest-dom';

// Mock the config/api module to avoid import.meta issues
jest.mock('./config/api', () => ({
    API_CONFIG: {
        BASE_URL: 'http://localhost:3000/api',
        TIMEOUT: 10000,
        DEFAULT_HEADERS: {
            'Content-Type': 'application/json',
        },
    },
    ENV_CONFIG: {
        isDevelopment: true,
        isProduction: false,
        isTest: true,
    },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords() { return []; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
};

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
                args[0].includes('Warning: unmountComponentAtNode is deprecated') ||
                args[0].includes('Warning: componentWillReceiveProps has been renamed') ||
                args[0].includes('Warning: `ReactDOMTestUtils.act` is deprecated'))
        ) {
            return;
        }
        originalError.call(console, ...args);
    };

    console.warn = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning: componentWillReceiveProps has been renamed') ||
                args[0].includes('Warning: componentWillMount has been renamed'))
        ) {
            return;
        }
        originalWarn.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
}); 