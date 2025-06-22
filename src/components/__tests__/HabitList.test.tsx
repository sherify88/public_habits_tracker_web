import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import HabitList from '../HabitList';
import { Habit } from '../../types/habits';

// Mock the HabitItem component
jest.mock('../HabitItem', () => ({
    __esModule: true,
    default: function MockHabitItem({ habit, onToggle, onDelete, isDeleting }: any) {
        return (
            <div data-testid={`habit-item-${habit.id}`}>
                <span>{habit.name}</span>
                <button
                    onClick={() => onToggle(habit.id, false)}
                    data-testid={`toggle-${habit.id}`}
                >
                    Toggle
                </button>
                <button
                    onClick={() => onDelete(habit.id)}
                    data-testid={`delete-${habit.id}`}
                    disabled={isDeleting}
                >
                    Delete
                </button>
            </div>
        );
    }
}));

// Mock data
const mockHabits: Habit[] = [
    {
        id: 1,
        name: 'Morning Exercise',
        description: '30 minutes of cardio',
        createdDate: '2024-01-01T00:00:00.000Z',
        updatedDate: '2024-01-01T00:00:00.000Z',
        currentStreak: 5,
        longestStreak: 10,
        lastCompletedAt: '2024-01-01T12:00:00.000Z',
        isCompletedToday: true,
        totalCompletions: 15,
        deletedDate: null,
        createdById: 1,
        updatedById: 1
    },
    {
        id: 2,
        name: 'Read Books',
        description: 'Read 20 pages daily',
        createdDate: '2024-01-01T00:00:00.000Z',
        updatedDate: '2024-01-01T00:00:00.000Z',
        currentStreak: 3,
        longestStreak: 7,
        lastCompletedAt: null,
        isCompletedToday: false,
        totalCompletions: 8,
        deletedDate: null,
        createdById: 1,
        updatedById: 1
    }
];

const mockToggleHandler = jest.fn();
const defaultProps = {
    habits: mockHabits,
    onToggleHabit: mockToggleHandler,
    isLoading: false
};

// Helper function to create a wrapper with QueryClient
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('HabitList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders list title', () => {
            render(<HabitList {...defaultProps} />, { wrapper: createWrapper() });

            expect(screen.getByText('Your Habits')).toBeInTheDocument();
        });

        it('renders all habits', () => {
            render(<HabitList {...defaultProps} />, { wrapper: createWrapper() });

            expect(screen.getByTestId('habit-item-1')).toBeInTheDocument();
            expect(screen.getByTestId('habit-item-2')).toBeInTheDocument();
            expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
            expect(screen.getByText('Read Books')).toBeInTheDocument();
        });

        it('renders empty state when no habits provided', () => {
            render(<HabitList {...defaultProps} habits={[]} />, { wrapper: createWrapper() });

            expect(screen.queryByText('Your Habits')).not.toBeInTheDocument();
        });
    });

    describe('Loading state', () => {
        it('shows loading spinner when isLoading is true', () => {
            render(<HabitList {...defaultProps} isLoading={true} />, { wrapper: createWrapper() });

            expect(screen.getByText("Loading today's progress...")).toBeInTheDocument();
            expect(screen.queryByText('Your Habits')).not.toBeInTheDocument();
        });

        it('does not show habits when loading', () => {
            render(<HabitList {...defaultProps} isLoading={true} />, { wrapper: createWrapper() });

            expect(screen.queryByTestId('habit-item-1')).not.toBeInTheDocument();
            expect(screen.queryByTestId('habit-item-2')).not.toBeInTheDocument();
        });
    });

    describe('Interaction with habits', () => {
        it('calls onToggleHabit when habit toggle is clicked', async () => {
            render(<HabitList {...defaultProps} />, { wrapper: createWrapper() });

            const toggleButton = screen.getByTestId('toggle-1');
            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(mockToggleHandler).toHaveBeenCalledWith(1, false);
            });
        });

        it('calls onDeleteHabit when habit delete is clicked', async () => {
            // Mock window.confirm to return true
            const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

            render(<HabitList {...defaultProps} />, { wrapper: createWrapper() });

            const deleteButton = screen.getByTestId('delete-1');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this habit? This action cannot be undone.');
            });

            confirmSpy.mockRestore();
        });

        it('does not call onDeleteHabit when user cancels confirmation', async () => {
            // Mock window.confirm to return false
            const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

            render(<HabitList {...defaultProps} />, { wrapper: createWrapper() });

            const deleteButton = screen.getByTestId('delete-1');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(confirmSpy).toHaveBeenCalled();
            });

            confirmSpy.mockRestore();
        });
    });

    describe('Delete functionality', () => {
        it('shows deleting state for specific habit', async () => {
            const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

            render(<HabitList {...defaultProps} />, { wrapper: createWrapper() });

            const deleteButton = screen.getByTestId('delete-1');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(deleteButton).toBeDisabled();
            });

            confirmSpy.mockRestore();
        });

        it('handles delete errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

            // Mock the delete mutation to throw an error
            const mockDeleteMutation = {
                mutateAsync: jest.fn().mockRejectedValue(new Error('Delete failed'))
            };

            // We need to mock the useDeleteHabit hook
            jest.doMock('../../api/habitsApi', () => ({
                useDeleteHabit: () => mockDeleteMutation
            }));

            render(<HabitList {...defaultProps} />, { wrapper: createWrapper() });

            const deleteButton = screen.getByTestId('delete-1');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Failed to delete habit:', expect.any(Error));
            });

            consoleSpy.mockRestore();
            confirmSpy.mockRestore();
        });
    });

    describe('Props validation', () => {
        it('handles undefined habits gracefully', () => {
            render(<HabitList {...defaultProps} habits={undefined} />, { wrapper: createWrapper() });

            expect(screen.queryByText('Your Habits')).not.toBeInTheDocument();
        });

        it('handles null habits gracefully', () => {
            render(<HabitList {...defaultProps} habits={null} />, { wrapper: createWrapper() });

            expect(screen.queryByText('Your Habits')).not.toBeInTheDocument();
        });
    });
}); 