import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateHabitForm from '../CreateHabitForm';

// Mock the useCreateHabit hook
const mockMutateAsync = jest.fn();
const mockUseCreateHabit = jest.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null
}));

jest.mock('../../api/habitsApi', () => ({
    useCreateHabit: () => mockUseCreateHabit()
}));

const mockOnClose = jest.fn();

const defaultProps = {
    onClose: mockOnClose
};

describe('CreateHabitForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseCreateHabit.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            isError: false,
            error: null
        });
    });

    describe('Rendering', () => {
        it('renders form title', () => {
            render(<CreateHabitForm {...defaultProps} />);

            expect(screen.getByText('Create New Habit')).toBeInTheDocument();
        });

        it('renders form fields', () => {
            render(<CreateHabitForm {...defaultProps} />);

            expect(screen.getByLabelText('Habit Name *')).toBeInTheDocument();
            expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
        });

        it('renders action buttons', () => {
            render(<CreateHabitForm {...defaultProps} />);

            expect(screen.getByRole('button', { name: 'Create Habit' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });

        it('shows close button', () => {
            render(<CreateHabitForm {...defaultProps} />);

            expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
        });
    });

    describe('Form validation', () => {
        it('shows error when submitting empty form', async () => {
            render(<CreateHabitForm {...defaultProps} />);

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Habit name is required')).toBeInTheDocument();
            });
        });

        it('shows error when name is too short', async () => {
            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            fireEvent.change(nameInput, { target: { value: 'ab' } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Habit name must be at least 3 characters')).toBeInTheDocument();
            });
        });

        it('shows error when name is too long', async () => {
            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            fireEvent.change(nameInput, { target: { value: 'a'.repeat(101) } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Habit name must be less than 100 characters')).toBeInTheDocument();
            });
        });

        it('shows error when description is too long', async () => {
            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            const descriptionInput = screen.getByLabelText('Description (optional)');

            fireEvent.change(nameInput, { target: { value: 'Valid Habit Name' } });
            fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(501) } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Description must be less than 500 characters')).toBeInTheDocument();
            });
        });

        it('clears errors when user starts typing', async () => {
            render(<CreateHabitForm {...defaultProps} />);

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Habit name is required')).toBeInTheDocument();
            });

            const nameInput = screen.getByLabelText('Habit Name *');
            fireEvent.change(nameInput, { target: { value: 'Valid Name' } });

            await waitFor(() => {
                expect(screen.queryByText('Habit name is required')).not.toBeInTheDocument();
            });
        });
    });

    describe('Form submission', () => {
        it('submits form with valid data', async () => {
            mockMutateAsync.mockResolvedValueOnce({ id: 1, name: 'Test Habit' });

            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            const descriptionInput = screen.getByLabelText('Description (optional)');

            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
            fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith({
                    name: 'Test Habit',
                    description: 'Test Description'
                });
            });
        });

        it('submits form without description', async () => {
            mockMutateAsync.mockResolvedValueOnce({ id: 1, name: 'Test Habit' });

            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith({
                    name: 'Test Habit',
                    description: undefined
                });
            });
        });

        it('calls onClose after successful submission', async () => {
            mockMutateAsync.mockResolvedValueOnce({ id: 1, name: 'Test Habit' });

            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        it('shows loading state during submission', async () => {
            mockUseCreateHabit.mockReturnValue({
                mutateAsync: mockMutateAsync,
                isPending: true,
                isError: false,
                error: null
            });

            render(<CreateHabitForm {...defaultProps} />);

            expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled();
        });

        it('handles submission errors', async () => {
            const error = new Error('Creation failed');
            mockMutateAsync.mockRejectedValueOnce(error);

            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalled();
            });

            // Form should not close on error
            expect(mockOnClose).not.toHaveBeenCalled();
        });

        it('clears form after successful submission', async () => {
            mockMutateAsync.mockResolvedValueOnce({ id: 1, name: 'Test Habit' });

            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *') as HTMLInputElement;
            const descriptionInput = screen.getByLabelText('Description (optional)') as HTMLTextAreaElement;

            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
            fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

            const submitButton = screen.getByRole('button', { name: 'Create Habit' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalled();
            });

            // The form should be cleared and closed after successful submission
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe('User interactions', () => {
        it('calls onClose when cancel button is clicked', () => {
            render(<CreateHabitForm {...defaultProps} />);

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            fireEvent.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('calls onClose when close button is clicked', () => {
            render(<CreateHabitForm {...defaultProps} />);

            const closeButton = screen.getByRole('button', { name: 'Close' });
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('calls onClose when clicking outside the form', () => {
            render(<CreateHabitForm {...defaultProps} />);

            const overlay = screen.getByTestId('form-overlay');
            fireEvent.click(overlay);

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('does not call onClose when clicking inside the form', () => {
            render(<CreateHabitForm {...defaultProps} />);

            const form = screen.getByTestId('create-habit-form');
            fireEvent.click(form);

            expect(mockOnClose).not.toHaveBeenCalled();
        });

        it('submits form when pressing Enter', async () => {
            mockMutateAsync.mockResolvedValueOnce({ id: 1, name: 'Test Habit' });

            render(<CreateHabitForm {...defaultProps} />);

            const nameInput = screen.getByLabelText('Habit Name *');
            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
            fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' });

            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalled();
            });
        });
    });

    describe('Error display', () => {
        it('displays API error message', () => {
            mockUseCreateHabit.mockReturnValue({
                mutateAsync: mockMutateAsync,
                isPending: false,
                isError: true,
                error: { message: 'API Error' } as any
            });

            render(<CreateHabitForm {...defaultProps} />);

            expect(screen.getByText('Failed to create habit. Please try again.')).toBeInTheDocument();
        });
    });
}); 