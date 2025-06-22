import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HabitItem from '../HabitItem';
import { Habit } from '../../types/habits';

// Mock data
const mockHabit: Habit = {
    id: 1,
    name: 'Test Habit',
    description: 'A test habit description',
    createdDate: '2024-01-01T00:00:00.000Z',
    updatedDate: '2024-01-01T00:00:00.000Z',
    currentStreak: 5,
    longestStreak: 10,
    lastCompletedAt: '2024-01-01T12:00:00.000Z',
    isCompletedToday: false,
    totalCompletions: 15,
    deletedDate: null,
    createdById: 1,
    updatedById: 1
};

const mockToggleHandler = jest.fn();
const mockDeleteHandler = jest.fn();

const defaultProps = {
    habit: mockHabit,
    isCompleted: false,
    onToggle: mockToggleHandler,
    onDelete: mockDeleteHandler,
    isDeleting: false
};

describe('HabitItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders habit name and description', () => {
            render(<HabitItem {...defaultProps} />);

            expect(screen.getByText('Test Habit')).toBeInTheDocument();
            expect(screen.getByText('A test habit description')).toBeInTheDocument();
        });

        it('renders without description when not provided', () => {
            const habitWithoutDescription = { ...mockHabit, description: undefined };
            render(<HabitItem {...defaultProps} habit={habitWithoutDescription} />);

            expect(screen.getByText('Test Habit')).toBeInTheDocument();
            expect(screen.queryByText('A test habit description')).not.toBeInTheDocument();
        });

        it('displays formatted creation date', () => {
            render(<HabitItem {...defaultProps} />);

            expect(screen.getByText(/Created:/)).toBeInTheDocument();
        });

        it('displays the current streak when it is greater than zero', () => {
            const habitWithStreak = { ...mockHabit, currentStreak: 5 };
            render(<HabitItem {...defaultProps} habit={habitWithStreak} />);

            expect(screen.getByText(/5 day streak/i)).toBeInTheDocument();
        });

        it('does not display the current streak when it is zero', () => {
            const habitWithoutStreak = { ...mockHabit, currentStreak: 0 };
            render(<HabitItem {...defaultProps} habit={habitWithoutStreak} />);

            expect(screen.queryByText(/day streak/i)).not.toBeInTheDocument();
        });

        it('shows "Not done" status when habit is not completed', () => {
            render(<HabitItem {...defaultProps} />);

            expect(screen.getByText('Not done')).toBeInTheDocument();
        });

        it('shows "Completed" status when habit is completed', () => {
            render(<HabitItem {...defaultProps} isCompleted={true} />);

            expect(screen.getByText('Completed')).toBeInTheDocument();
        });
    });

    describe('Toggle functionality', () => {
        it('calls onToggle when toggle button is clicked', async () => {
            render(<HabitItem {...defaultProps} />);

            const toggleButton = screen.getByLabelText('Mark as complete');
            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(mockToggleHandler).toHaveBeenCalledWith(1, false);
            });
        });

        it('shows loading spinner when toggling', async () => {
            render(<HabitItem {...defaultProps} />);

            const toggleButton = screen.getByLabelText('Mark as complete');
            fireEvent.click(toggleButton);

            // Check for loading spinner
            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Mark as complete' })).toBeDisabled();
            });
        });

        it('disables toggle button when deleting', () => {
            render(<HabitItem {...defaultProps} isDeleting={true} />);

            const toggleButton = screen.getByLabelText('Mark as complete');
            expect(toggleButton).toBeDisabled();
        });

        it('shows correct toggle button state for completed habit', () => {
            render(<HabitItem {...defaultProps} isCompleted={true} />);

            const toggleButton = screen.getByLabelText('Mark as incomplete');
            expect(toggleButton).toBeInTheDocument();
        });
    });

    describe('Delete functionality', () => {
        it('calls onDelete when delete button is clicked', async () => {
            render(<HabitItem {...defaultProps} />);

            const deleteButton = screen.getByLabelText('Delete habit');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(mockDeleteHandler).toHaveBeenCalledWith(1);
            });
        });

        it('shows loading state when deleting', () => {
            render(<HabitItem {...defaultProps} isDeleting={true} />);

            const deleteButton = screen.getByLabelText('Delete habit');
            expect(deleteButton).toHaveTextContent('...');
        });

        it('disables delete button when toggling', async () => {
            render(<HabitItem {...defaultProps} />);

            const toggleButton = screen.getByLabelText('Mark as complete');
            const deleteButton = screen.getByLabelText('Delete habit');

            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(deleteButton).toBeDisabled();
            });
        });
    });

    describe('Styling and visual states', () => {
        it('applies correct styling for completed habit', () => {
            render(<HabitItem {...defaultProps} isCompleted={true} />);

            const container = screen.getByText('Test Habit').closest('[data-habit-id]');
            expect(container).toHaveClass('bg-green-50', 'border-green-500');
        });

        it('applies correct styling for incomplete habit', () => {
            render(<HabitItem {...defaultProps} />);

            const container = screen.getByText('Test Habit').closest('[data-habit-id]');
            expect(container).toHaveClass('bg-gray-50', 'border-gray-200');
        });

        it('applies opacity when deleting', () => {
            render(<HabitItem {...defaultProps} isDeleting={true} />);

            const container = screen.getByText('Test Habit').closest('[data-habit-id]');
            expect(container).toHaveClass('opacity-50', 'pointer-events-none');
        });
    });

    describe('Error handling', () => {
        it('handles toggle errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            mockToggleHandler.mockRejectedValueOnce(new Error('Toggle failed'));

            render(<HabitItem {...defaultProps} />);

            const toggleButton = screen.getByLabelText('Mark as complete');
            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Failed to toggle habit:', expect.any(Error));
            });

            consoleSpy.mockRestore();
        });
    });
}); 