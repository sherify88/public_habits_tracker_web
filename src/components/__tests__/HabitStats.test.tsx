import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HabitStats from '../HabitStats';
import { HabitStatsResponse } from '../../types/habits';

// Mock data
const mockStats: HabitStatsResponse = {
    totalHabits: 5,
    completedToday: 3,
    totalCompletions: 25,
    averageStreak: 4.2
};

const defaultProps = {
    stats: mockStats,
    date: '2024-01-15',
    isLoading: false
};

describe('HabitStats', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders stats header with title', () => {
            render(<HabitStats {...defaultProps} />);

            expect(screen.getByText("Today's Progress")).toBeInTheDocument();
        });

        it('renders formatted date', () => {
            render(<HabitStats {...defaultProps} />);

            expect(screen.getByText('Monday, January 15, 2024')).toBeInTheDocument();
        });

        it('renders all stat cards with correct values', () => {
            render(<HabitStats {...defaultProps} />);

            expect(screen.getByText('3')).toBeInTheDocument(); // Completed Today
            expect(screen.getByText('5')).toBeInTheDocument(); // Total Habits
            expect(screen.getByText('25')).toBeInTheDocument(); // Total Completions
            expect(screen.getByText('4.2')).toBeInTheDocument(); // Avg. Streak
        });

        it('renders stat labels', () => {
            render(<HabitStats {...defaultProps} />);

            expect(screen.getByText('Completed Today')).toBeInTheDocument();
            expect(screen.getByText('Total Habits')).toBeInTheDocument();
            expect(screen.getByText('Total Completions')).toBeInTheDocument();
            expect(screen.getByText('Avg. Streak')).toBeInTheDocument();
        });

        it('renders progress bar with correct percentage', () => {
            render(<HabitStats {...defaultProps} />);

            const progressText = screen.getByText('60% Complete');
            expect(progressText).toBeInTheDocument();
        });
    });

    describe('Loading state', () => {
        it('shows loading skeleton when isLoading is true', () => {
            render(<HabitStats {...defaultProps} isLoading={true} />);

            expect(screen.getByText("Today's Progress")).toBeInTheDocument();
            expect(screen.queryByText('Monday, January 15, 2024')).not.toBeInTheDocument();
        });

        it('shows placeholder elements when loading', () => {
            render(<HabitStats {...defaultProps} isLoading={true} />);

            // Check for placeholder elements (these would be styled differently in CSS)
            const placeholderElements = document.querySelectorAll('.stat-card-placeholder');
            expect(placeholderElements.length).toBeGreaterThan(0);
        });
    });

    describe('Empty state', () => {
        it('renders nothing when no stats provided', () => {
            const { container } = render(<HabitStats {...defaultProps} stats={undefined} />);

            expect(container.firstChild).toBeNull();
        });

        it('renders nothing when totalHabits is 0', () => {
            const emptyStats = { ...mockStats, totalHabits: 0 };
            const { container } = render(<HabitStats {...defaultProps} stats={emptyStats} />);

            expect(container.firstChild).toBeNull();
        });
    });

    describe('Progress calculation', () => {
        it('calculates 100% completion correctly', () => {
            const fullCompletionStats = { ...mockStats, completedToday: 5, totalHabits: 5 };
            render(<HabitStats {...defaultProps} stats={fullCompletionStats} />);

            expect(screen.getByText('100% Complete')).toBeInTheDocument();
        });

        it('calculates 0% completion correctly', () => {
            const noCompletionStats = { ...mockStats, completedToday: 0, totalHabits: 5 };
            render(<HabitStats {...defaultProps} stats={noCompletionStats} />);

            expect(screen.getByText('0% Complete')).toBeInTheDocument();
        });

        it('handles decimal percentages correctly', () => {
            const partialStats = { ...mockStats, completedToday: 1, totalHabits: 3 };
            render(<HabitStats {...defaultProps} stats={partialStats} />);

            expect(screen.getByText('33% Complete')).toBeInTheDocument();
        });
    });

    describe('Celebration logic', () => {
        it('shows celebration message when all habits completed', async () => {
            const fullCompletionStats = { ...mockStats, completedToday: 5, totalHabits: 5 };
            render(<HabitStats {...defaultProps} stats={fullCompletionStats} />);

            await waitFor(() => {
                expect(screen.getByText("🎉 Great job! You've completed all your habits today!")).toBeInTheDocument();
            });
        });

        it('does not show celebration when not all habits completed', () => {
            render(<HabitStats {...defaultProps} />);

            expect(screen.queryByText("🎉 Great job! You've completed all your habits today!")).not.toBeInTheDocument();
        });

        it('does not show celebration when no habits exist', () => {
            const emptyStats = { ...mockStats, totalHabits: 0 };
            render(<HabitStats {...defaultProps} stats={emptyStats} />);

            expect(screen.queryByText("🎉 Great job! You've completed all your habits today!")).not.toBeInTheDocument();
        });
    });

    describe('Date formatting', () => {
        it('formats different dates correctly', () => {
            render(<HabitStats {...defaultProps} date="2024-12-25" />);

            expect(screen.getByText('Wednesday, December 25, 2024')).toBeInTheDocument();
        });

        it('handles invalid dates gracefully', () => {
            render(<HabitStats {...defaultProps} date="invalid-date" />);

            // Should still render something, even if date is invalid
            expect(screen.getByText("Today's Progress")).toBeInTheDocument();
        });
    });

    describe('Edge cases', () => {
        it('handles very large numbers', () => {
            const largeStats = {
                totalHabits: 1000,
                completedToday: 999,
                totalCompletions: 50000,
                averageStreak: 99.9
            };
            render(<HabitStats {...defaultProps} stats={largeStats} />);

            expect(screen.getByText('999')).toBeInTheDocument();
            expect(screen.getByText('1000')).toBeInTheDocument();
            expect(screen.getByText('50000')).toBeInTheDocument();
            expect(screen.getByText('99.9')).toBeInTheDocument();
        });

        it('handles zero values', () => {
            const zeroStats = {
                totalHabits: 3,
                completedToday: 0,
                totalCompletions: 0,
                averageStreak: 0
            };
            render(<HabitStats {...defaultProps} stats={zeroStats} />);

            // Check for specific stat values by looking at their context
            expect(screen.getByText('Completed Today')).toBeInTheDocument();
            expect(screen.getByText('Total Habits')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });
}); 