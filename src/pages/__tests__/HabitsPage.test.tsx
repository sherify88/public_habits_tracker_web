import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import HabitsPage from '../HabitsPage';
import { Habit, HabitStatsResponse } from '../../types/habits';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock CSS imports
jest.mock('../../styles/habits.css', () => ({}));

// Mock the API hooks
const mockUseHabits = jest.fn();
const mockUseHabitStats = jest.fn();
const mockUseToggleHabit = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('../../api/habitsApi', () => ({
    useHabits: (...args: any[]) => mockUseHabits(...args),
    useHabitStats: (...args: any[]) => mockUseHabitStats(...args),
    useToggleHabit: (...args: any[]) => mockUseToggleHabit(...args),
}));

jest.mock('../../contexts/AuthContext', () => ({
    ...jest.requireActual('../../contexts/AuthContext'),
    useAuth: () => mockUseAuth(),
}));

// Mock the components
jest.mock('../../components/CreateHabitForm', () => ({
    __esModule: true,
    default: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="create-habit-form">
            <button onClick={onClose}>Close Form</button>
        </div>
    ),
}));

jest.mock('../../components/HabitList', () => ({
    __esModule: true,
    default: ({ habits, onToggleHabit, isLoading }: any) => {
        if (isLoading) return <div data-testid="habit-list-loading">Loading...</div>;
        if (!habits || habits.length === 0) return null;
        return (
            <div data-testid="habit-list">
                {habits.map((habit: any) => (
                    <div key={habit.id} data-testid={`habit-item-${habit.id}`}>
                        <span>{habit.name}</span>
                        <button onClick={() => onToggleHabit(habit.id, habit.isCompletedToday)} data-testid={`toggle-habit-${habit.id}`}>Toggle</button>
                    </div>
                ))}
            </div>
        );
    },
}));

jest.mock('../../components/HabitStats', () => ({
    __esModule: true,
    default: ({ stats, isLoading }: any) => {
        if (isLoading) return <div data-testid="habit-stats-loading">Loading stats...</div>;
        if (!stats) return <div data-testid="habit-stats">No stats available</div>;
        return (
            <div data-testid="habit-stats">
                <span>Total: {stats.totalHabits}</span>
                <span>Completed: {stats.completedToday}</span>
            </div>
        );
    },
}));

jest.mock('../../components/Footer', () => ({
    __esModule: true,
    default: () => <footer data-testid="footer">Footer</footer>,
}));

// Test data
const mockHabits: Habit[] = [
    { id: 1, name: 'Morning Exercise', isCompletedToday: true, description: '', createdDate: '', currentStreak: 0, lastCompletedAt: '', longestStreak: 0, totalCompletions: 0, updatedDate: '', createdById: 1, deletedDate: null, updatedById: 1 },
    { id: 2, name: 'Read Books', isCompletedToday: false, description: '', createdDate: '', currentStreak: 0, lastCompletedAt: '', longestStreak: 0, totalCompletions: 0, updatedDate: '', createdById: 1, deletedDate: null, updatedById: 1 },
];

const mockStats: HabitStatsResponse = {
    totalHabits: 2, completedToday: 1, totalCompletions: 23, averageStreak: 4.0,
};

// Helper function to create a wrapper with all necessary providers
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
};

describe('HabitsPage', () => {
    const mockMutateAsync = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false, user: { username: 'testuser' } });
        mockUseHabits.mockReturnValue({ data: mockHabits, isLoading: false, error: null });
        mockUseHabitStats.mockReturnValue({ data: mockStats, isLoading: false, error: null });
        mockUseToggleHabit.mockReturnValue({ mutateAsync: mockMutateAsync, isLoading: false, error: null });
    });

    describe('Authentication', () => {
        it('shows a welcome message when user is not authenticated', () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false, user: null });
            render(<HabitsPage />, { wrapper: createWrapper() });
            expect(screen.getByText('Welcome to Habits Tracker')).toBeInTheDocument();
        });

        it('shows loading state when auth is loading', () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true, user: null });
            render(<HabitsPage />, { wrapper: createWrapper() });
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
    });

    describe('Rendering (Authenticated)', () => {
        it('renders the floating action button to add a new habit', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });
            expect(screen.getByRole('button', { name: /add new habit/i })).toBeInTheDocument();
        });

        it('renders stats, list, and footer', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });
            expect(screen.getByTestId('habit-stats')).toBeInTheDocument();
            expect(screen.getByTestId('habit-list')).toBeInTheDocument();
            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });
    });

    describe('Data States (Authenticated)', () => {
        it('shows loading state when habits are loading', () => {
            mockUseHabits.mockReturnValue({ data: undefined, isLoading: true, error: null });
            render(<HabitsPage />, { wrapper: createWrapper() });
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('shows an error message when habits fail to load', () => {
            mockUseHabits.mockReturnValue({ data: undefined, isLoading: false, error: new Error('Failed to load') });
            render(<HabitsPage />, { wrapper: createWrapper() });
            expect(screen.getByText('Error loading habits')).toBeInTheDocument();
            expect(screen.getByText('Could not fetch your habits. Please try again later.')).toBeInTheDocument();
        });

        it('shows the empty state when there are no habits', () => {
            mockUseHabits.mockReturnValue({ data: [], isLoading: false, error: null });
            render(<HabitsPage />, { wrapper: createWrapper() });
            expect(screen.getByText('No habits yet')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create your first habit/i })).toBeInTheDocument();
        });
    });

    describe('Interactions (Authenticated)', () => {
        it('shows the create form when the FAB is clicked', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });
            fireEvent.click(screen.getByRole('button', { name: /add new habit/i }));
            expect(screen.getByTestId('create-habit-form')).toBeInTheDocument();
        });

        it('hides the create form when it is closed', () => {
            render(<HabitsPage />, { wrapper: createWrapper() });
            fireEvent.click(screen.getByRole('button', { name: /add new habit/i }));
            fireEvent.click(screen.getByText('Close Form'));
            expect(screen.queryByTestId('create-habit-form')).not.toBeInTheDocument();
        });

        it('calls the toggle mutation when a habit is toggled', async () => {
            mockMutateAsync.mockResolvedValue({});
            render(<HabitsPage />, { wrapper: createWrapper() });
            fireEvent.click(screen.getByTestId('toggle-habit-1'));
            await waitFor(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith({ habitId: 1, completed: false });
            });
        });
    });
}); 