import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VersionUpdateDialog from '../VersionUpdateDialog';

describe('VersionUpdateDialog', () => {
    const defaultProps = {
        isOpen: true,
        currentVersion: '0.1.0',
        minimumVersion: '0.1.1',
        onUpdate: jest.fn(),
    };

    it('should not render when isOpen is false', () => {
        render(<VersionUpdateDialog {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('Update Required')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
        render(<VersionUpdateDialog {...defaultProps} />);

        expect(screen.getByText('Update Required')).toBeInTheDocument();
        expect(screen.getByText('A new version of the application is available. Please update to continue using the app.')).toBeInTheDocument();
        expect(screen.getByText('Update Now')).toBeInTheDocument();
    });

    it('should display version information correctly', () => {
        render(<VersionUpdateDialog {...defaultProps} />);

        expect(screen.getByText('Current Version:')).toBeInTheDocument();
        expect(screen.getByText('0.1.0')).toBeInTheDocument();
        expect(screen.getByText('Minimum Required:')).toBeInTheDocument();
        expect(screen.getByText('0.1.1')).toBeInTheDocument();
    });

    it('should call onUpdate when Update Now button is clicked', () => {
        const onUpdate = jest.fn();
        render(<VersionUpdateDialog {...defaultProps} onUpdate={onUpdate} />);

        const updateButton = screen.getByText('Update Now');
        fireEvent.click(updateButton);

        expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    it('should have proper styling classes', () => {
        render(<VersionUpdateDialog {...defaultProps} />);

        const dialogContainer = screen.getByText('Update Required').closest('.bg-white');
        expect(dialogContainer).toHaveClass('bg-white', 'rounded-lg', 'p-6');

        const updateButton = screen.getByText('Update Now');
        expect(updateButton).toHaveClass('bg-blue-600', 'text-white', 'px-4', 'py-2', 'rounded-md');
    });
}); 