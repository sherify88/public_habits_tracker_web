import React from 'react';
import AppBar from './AppBar';
import Footer from './Footer';
import VersionUpdateDialog from './VersionUpdateDialog';
import { useAuth } from '../contexts/AuthContext';
import { useVersionChecker } from '../hooks/useVersionChecker';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, login, logout, isLoading, error } = useAuth();
    const {
        showUpdateDialog,
        versionInfo,
        currentVersion,
        onUpdate,
        onCloseDialog
    } = useVersionChecker();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppBar
                user={user}
                onLogin={login}
                onLogout={logout}
                isLoading={isLoading}
                error={error}
            />
            <main className="pt-16 flex-1">
                {children}
            </main>
            <Footer />

            <VersionUpdateDialog
                isOpen={showUpdateDialog}
                currentVersion={currentVersion}
                minimumVersion={versionInfo?.version || ''}
                onUpdate={onUpdate}
            />
        </div>
    );
};

export default Layout; 