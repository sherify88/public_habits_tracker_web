import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginDialog from '../LoginDialog';

const mockOnClose = jest.fn();
const mockOnLogin = jest.fn();

const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onLogin: mockOnLogin,
    isLoading: false,
    error: null
};

describe('LoginDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders when isOpen is true', () => {
            render(<LoginDialog {...defaultProps} />);

            expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
            expect(screen.getByLabelText('Username')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
        });

        it('does not render when isOpen is false', () => {
            render(<LoginDialog {...defaultProps} isOpen={false} />);

            expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument();
        });

        it('shows error message when provided', () => {
            render(<LoginDialog {...defaultProps} error="Invalid credentials" />);

            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });

        it('shows loading state', () => {
            render(<LoginDialog {...defaultProps} isLoading={true} />);

            expect(screen.getByText('Logging in...')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
        });
    });

    describe('Form validation', () => {
        it('shows error when submitting empty form', async () => {
            render(<LoginDialog {...defaultProps} />);

            const submitButton = screen.getByRole('button', { name: 'Login' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Username is required')).toBeInTheDocument();
                expect(screen.getByText('Password is required')).toBeInTheDocument();
            });
        });

        it('clears errors when user starts typing', async () => {
            render(<LoginDialog {...defaultProps} />);

            const submitButton = screen.getByRole('button', { name: 'Login' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Username is required')).toBeInTheDocument();
            });

            const usernameInput = screen.getByLabelText('Username');
            fireEvent.change(usernameInput, { target: { value: 'testuser' } });

            await waitFor(() => {
                expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
            });
        });
    });

    describe('Form submission', () => {
        it('submits form with valid data', async () => {
            mockOnLogin.mockResolvedValueOnce(undefined);

            render(<LoginDialog {...defaultProps} />);

            const usernameInput = screen.getByLabelText('Username');
            const passwordInput = screen.getByLabelText('Password');

            fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            const submitButton = screen.getByRole('button', { name: 'Login' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockOnLogin).toHaveBeenCalledWith({
                    username: 'testuser',
                    password: 'password123'
                });
            });
        });

        it('submits form when pressing Enter', async () => {
            mockOnLogin.mockResolvedValueOnce(undefined);

            render(<LoginDialog {...defaultProps} />);

            const usernameInput = screen.getByLabelText('Username');
            const passwordInput = screen.getByLabelText('Password');

            fireEvent.change(usernameInput, { target: { value: 'testuser' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            // Press Enter on the password input
            fireEvent.keyDown(passwordInput, { key: 'Enter', code: 'Enter' });

            await waitFor(() => {
                expect(mockOnLogin).toHaveBeenCalledWith({
                    username: 'testuser',
                    password: 'password123'
                });
            });
        });
    });

    describe('User interactions', () => {
        it('calls onClose when cancel button is clicked', () => {
            render(<LoginDialog {...defaultProps} />);

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            fireEvent.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('calls onClose when close button is clicked', () => {
            render(<LoginDialog {...defaultProps} />);

            // The close button is the X button in the header
            const closeButton = screen.getByRole('button', { name: 'Close dialog' });
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('calls onClose when clicking outside the dialog', () => {
            render(<LoginDialog {...defaultProps} />);

            // Click on the overlay
            const overlay = screen.getByTestId('login-dialog-overlay');
            fireEvent.click(overlay);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('does not call onClose when clicking inside the dialog', () => {
            render(<LoginDialog {...defaultProps} />);

            const form = screen.getByRole('button', { name: 'Login' }).closest('form');
            fireEvent.click(form!);

            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });
}); 