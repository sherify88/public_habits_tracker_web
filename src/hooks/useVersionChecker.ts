import { useState, useEffect, useCallback, useRef } from 'react';
import { checkVersion, VersionInfo } from '../api/versionApi';
import { APP_VERSION, VERSION_CHECK_CONFIG } from '../config/version';
import { useInterval } from './useInterval';

export const useVersionChecker = () => {
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
    const isChecking = useRef(false);

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

    const checkForUpdates = async () => {
        if (isChecking.current) return;

        isChecking.current = true;
        try {
            const info = await checkVersion();
            setVersionInfo(info);

            const needsUpdate = compareVersions(APP_VERSION, info.version);
            if (needsUpdate) {
                setShowUpdateDialog(true);
            }
        } catch (error) {
            console.error('Version check failed:', error);
        } finally {
            isChecking.current = false;
        }
    };

    const handleUpdate = useCallback(() => {
        window.location.reload();
    }, []);

    const handleCloseDialog = useCallback(() => {
        setShowUpdateDialog(false);
    }, []);

    // Initial check on mount
    useEffect(() => {
        checkForUpdates();
    }, []);

    // Set up the interval for periodic checks
    useInterval(checkForUpdates, VERSION_CHECK_CONFIG.CHECK_INTERVAL);

    return {
        showUpdateDialog,
        versionInfo,
        currentVersion: APP_VERSION,
        onUpdate: handleUpdate,
        onCloseDialog: handleCloseDialog,
    };
}; 