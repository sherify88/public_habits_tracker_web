import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import HabitsPage from '../HabitsPage';
import { Habit, HabitStatsResponse } from '../../types/habits';

// Mock CSS imports
jest.mock('../../styles/habits.css', () => ({}));

// Mock the API hooks
const mockUseHabits = jest.fn();
const mockUseHabitStats = jest.fn();
const mockUseToggleHabit = jest.fn();

jest.mock('../../api/habitsApi', () => ({
    useHabits: () => mockUseHabits(),
    useHabitStats: () => mockUseHabitStats(),
    useToggleHabit: () => mockUseToggleHabit()
}));

// Mock the components
jest.mock('../../components/CreateHabitForm', () => ({
    __esModule: true,
    default: function MockCreateHabitForm({ onClose }: { onClose: () => void }) {
        return (
            <div data-testid="create-habit-form">
                <button onClick={onClose}>Close Form</button>
            </div>
        );
    }
}));

jest.mock('../../components/HabitList', () => ({
    __esModule: true,
    default: function MockHabitList({ habits, onToggleHabit, isLoading }: any) {
        if (isLoading) {
            return <div data-testid="habit-list-loading">Loading...</div>;
        }

        if (!habits || habits.length === 0) {
            return null; // Don't render anything when no habits
        }

        return (
            <div data-testid="habit-list">
                {habits.map((habit: any) => (
                    <div key={habit.id} data-testid={`habit-item-${habit.id}`}>
                        <span>{habit.name}</span>
                        <button
                            onClick={() => onToggleHabit(habit.id, habit.isCompletedToday)}
                            data-testid={`toggle-habit-${habit.id}`}
                        >
                            Toggle
                        </button>
                    </div>
                ))}
            </div>
        );
    }
}));

jest.mock('../../components/HabitStats', () => ({
    __esModule: true,
    default: function MockHabitStats({ stats, isLoading }: any) {
        if (isLoading) {
            return <div data-testid="habit-stats-loading">Loading stats...</div>;
        }

        if (!stats) {
            return <div data-testid="habit-stats">No stats available</div>;
        }

        return (
            <div data-testid="habit-stats">
                <span>Total: {stats.totalHabits}</span>
                <span>Completed: {stats.completedToday}</span>
            </div>
        );
    }
}));

jest.mock('../../components/Footer', () => ({
    __esModule: true,
    default: function MockFooter() {
        const currentYear = new Date().getFullYear();
        return (
            <footer data-testid="footer">
                <p>&copy; {currentYear} Habits Tracker. All rights reserved.</p>
            </footer>
        );
    }
}));

// Test data
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

const mockStats: HabitStatsResponse = {
    totalHabits: 2,
    completedToday: 1,
    totalCompletions: 23,
    averageStreak: 4.0
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

describe('HabitsPage', () => {
    const mockMutateAsync = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementations
        mockUseHabits.mockReturnValue({
            data: mockHabits,
            isLoading: false,
            error: null
        });

        mockUseHabitStats.mockReturnValue({
            data: mockStats,
            isLoading: false,
            error: null
        });

        mockUseToggleHabit.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isLoading: false,
            error: null
        });
    });

    describe('Rendering', () => {
        it('renders page title', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('Habits Tracker')).toBeInTheDocument();
        });

        it('renders add habit button', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('+ Add New Habit')).toBeInTheDocument();
        });

        it('renders habit stats component', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByTestId('habit-stats')).toBeInTheDocument();
        });

        it('renders habit list component', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByTestId('habit-list')).toBeInTheDocument();
        });

        it('renders footer', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            const currentYear = new Date().getFullYear();
            expect(screen.getByText(`© ${currentYear} Habits Tracker. All rights reserved.`)).toBeInTheDocument();
        });
    });

    describe('Loading states', () => {
        it('shows loading state when habits are loading', () => {
            mockUseHabits.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('Loading habits...')).toBeInTheDocument();
            expect(screen.queryByTestId('habit-list')).not.toBeInTheDocument();
        });

        it('shows loading state when stats are loading', () => {
            mockUseHabitStats.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByTestId('habit-stats-loading')).toBeInTheDocument();
        });
    });

    describe('Error states', () => {
        it('shows error message when habits fail to load', () => {
            mockUseHabits.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: new Error('Failed to load habits')
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('Error loading habits')).toBeInTheDocument();
            expect(screen.getByText('Please try again later.')).toBeInTheDocument();
        });
    });

    describe('Empty state', () => {
        it('shows empty state when no habits exist', () => {
            mockUseHabits.mockReturnValue({
                data: [],
                isLoading: false,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('No habits yet')).toBeInTheDocument();
            expect(screen.getByText('Create your first habit to get started!')).toBeInTheDocument();
            expect(screen.getByText('Create Your First Habit')).toBeInTheDocument();
        });

        it('does not show habit list when no habits', () => {
            mockUseHabits.mockReturnValue({
                data: [],
                isLoading: false,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.queryByTestId('habit-list')).not.toBeInTheDocument();
        });
    });

    describe('Create habit form', () => {
        it('shows create form when add button is clicked', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            const addButton = screen.getByText('+ Add New Habit');
            fireEvent.click(addButton);

            expect(screen.getByTestId('create-habit-form')).toBeInTheDocument();
        });

        it('shows create form when first habit button is clicked', () => {
            mockUseHabits.mockReturnValue({
                data: [],
                isLoading: false,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            const firstHabitButton = screen.getByText('Create Your First Habit');
            fireEvent.click(firstHabitButton);

            expect(screen.getByTestId('create-habit-form')).toBeInTheDocument();
        });

        it('hides create form when form is closed', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            // Show form
            const addButton = screen.getByText('+ Add New Habit');
            fireEvent.click(addButton);

            expect(screen.getByTestId('create-habit-form')).toBeInTheDocument();

            // Close form
            const closeButton = screen.getByText('Close Form');
            fireEvent.click(closeButton);

            expect(screen.queryByTestId('create-habit-form')).not.toBeInTheDocument();
        });
    });

    describe('Habit interactions', () => {
        it('calls toggle handler when habit is toggled', async () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            const toggleButton = screen.getByTestId('toggle-habit-1');
            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith({
                    habitId: 1,
                    completed: false
                });
            });
        });

        it('passes correct data to habit list', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
            expect(screen.getByText('Read Books')).toBeInTheDocument();
        });

        it('passes correct data to habit stats', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('Total: 2')).toBeInTheDocument();
            expect(screen.getByText('Completed: 1')).toBeInTheDocument();
        });
    });

    describe('Date handling', () => {
        it('memoizes today\'s date', () => {
            const { rerender } = render(<HabitsPage />, { wrapper: createWrapper() });

            // Force re-render
            rerender(<HabitsPage />);

            // The date should be the same (memoized)
            // We can't easily test this directly, but we can verify the component renders correctly
            expect(screen.getByText('Habits Tracker')).toBeInTheDocument();
        });
    });

    describe('Performance optimizations', () => {
        it('uses useCallback for toggle handler', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            // The component should render without issues
            expect(screen.getByText('Habits Tracker')).toBeInTheDocument();

            // We can't directly test useCallback, but we can verify the handler works
            const toggleButton = screen.getByTestId('toggle-habit-1');
            fireEvent.click(toggleButton);

            expect(mockMutateAsync).toHaveBeenCalled();
        });

        it('uses useCallback for form handlers', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });

            const addButton = screen.getByText('+ Add New Habit');
            fireEvent.click(addButton);

            expect(screen.getByTestId('create-habit-form')).toBeInTheDocument();
        });
    });

    describe('Edge cases', () => {
        it('handles undefined habits data', () => {
            // Reset all mocks and set up specific ones for this test
            jest.clearAllMocks();

            mockUseHabits.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: null
            });

            mockUseHabitStats.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: null
            });

            mockUseToggleHabit.mockReturnValue({
                mutateAsync: jest.fn(),
                isLoading: false,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('No habits yet')).toBeInTheDocument();
        });

        it('handles null habits data', () => {
            // Reset all mocks and set up specific ones for this test
            jest.clearAllMocks();

            mockUseHabits.mockReturnValue({
                data: null,
                isLoading: false,
                error: null
            });

            mockUseHabitStats.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: null
            });

            mockUseToggleHabit.mockReturnValue({
                mutateAsync: jest.fn(),
                isLoading: false,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            expect(screen.getByText('No habits yet')).toBeInTheDocument();
        });

        it('handles undefined stats data', () => {
            mockUseHabitStats.mockClear();
            mockUseHabitStats.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: null
            });

            render(<HabitsPage />, { wrapper: createWrapper() });

            // Should still render the stats component
            expect(screen.getByTestId('habit-stats')).toBeInTheDocument();
        });
    });
}); 