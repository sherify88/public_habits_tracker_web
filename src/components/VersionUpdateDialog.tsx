import React from 'react';

interface VersionUpdateDialogProps {
    isOpen: boolean;
    currentVersion: string;
    minimumVersion: string;
    onUpdate: () => void;
}

const VersionUpdateDialog: React.FC<VersionUpdateDialogProps> = ({
    isOpen,
    currentVersion,
    minimumVersion,
    onUpdate
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl bg-gray-100">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                        <svg
                            className="h-6 w-6 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Update Required
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                        A new version of the application is available. Please update to continue using the app.
                    </p>

                    <div className="bg-gray-50 rounded-md p-3 mb-4">
                        <div className="text-xs text-gray-600">
                            <div className="flex justify-between mb-1">
                                <span>Current Version:</span>
                                <span className="font-mono text-red-600">{currentVersion}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Minimum Required:</span>
                                <span className="font-mono text-green-600">{minimumVersion}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onUpdate}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        Update Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VersionUpdateDialog; 