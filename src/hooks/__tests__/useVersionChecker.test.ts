import { checkVersion } from '../../api/versionApi';

// Mock the version API
jest.mock('../../api/versionApi');
const mockCheckVersion = checkVersion as jest.MockedFunction<typeof checkVersion>;

// Mock the version config
jest.mock('../../config/version', () => ({
    APP_VERSION: '0.1.0',
    VERSION_CHECK_CONFIG: {
        CHECK_INTERVAL: 20000,
        ENDPOINT: '/version',
    },
}));

// Test version comparison logic directly
const compareVersions = (current: string, minimum: string): boolean => {
    const currentParts = current.split('.').map(Number);
    const minimumParts = minimum.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, minimumParts.length); i++) {
        const currentPart = currentParts[i] || 0;
        const minimumPart = minimumParts[i] || 0;

        if (currentPart < minimumPart) {
            return true; // Update needed
        } else if (currentPart > minimumPart) {
            return false; // No update needed
        }
    }

    return false; // Versions are equal, no update needed
};

describe('Version Checker Logic', () => {
    it('should not require update when current version is higher than minimum', () => {
        const needsUpdate = compareVersions('0.1.0', '0.0.9');
        expect(needsUpdate).toBe(false);
    });

    it('should require update when current version is lower than minimum', () => {
        const needsUpdate = compareVersions('0.1.0', '0.1.1');
        expect(needsUpdate).toBe(true);
    });

    it('should not require update when versions are equal', () => {
        const needsUpdate = compareVersions('0.1.0', '0.1.0');
        expect(needsUpdate).toBe(false);
    });

    it('should handle different version formats correctly', () => {
        expect(compareVersions('1.0.0', '1.0.1')).toBe(true);
        expect(compareVersions('1.0.1', '1.0.0')).toBe(false);
        expect(compareVersions('1.0.0', '1.0.0')).toBe(false);
    });
}); 