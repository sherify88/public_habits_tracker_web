import React, { useState, useCallback, useMemo } from 'react';
import { useHabits, useToggleHabit, useHabitStats } from '../api/habitsApi';
import { useAuth } from '../contexts/AuthContext';
import CreateHabitForm from '../components/CreateHabitForm';
import HabitList from '../components/HabitList';
import HabitStats from '../components/HabitStats';
import Footer from '../components/Footer';
import '../styles/habits.css';

const HabitsPage: React.FC = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Memoize today's date to avoid recalculation on every render
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    // Only fetch data if the user is authenticated
    const { data: habits, isLoading: habitsLoading, error: habitsError } = useHabits(isAuthenticated);
    const { data: stats, isLoading: statsLoading } = useHabitStats(isAuthenticated);
    const toggleHabitMutation = useToggleHabit();

    // Memoize the toggle handler to prevent unnecessary re-renders
    const handleToggleHabit = useCallback(async (habitId: number, isCompleted: boolean) => {
        await toggleHabitMutation.mutateAsync({
            habitId,
            completed: !isCompleted
        });
    }, [toggleHabitMutation]);

    // Memoize the create form toggle handler
    const handleShowCreateForm = useCallback(() => {
        setShowCreateForm(true);
    }, []);

    const handleCloseCreateForm = useCallback(() => {
        setShowCreateForm(false);
    }, []);

    if (isAuthLoading || (isAuthenticated && habitsLoading)) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-screen p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Habits Tracker</h2>
                <p className="text-gray-600">Please log in to manage and track your habits.</p>
            </div>
        );
    }

    if (habitsError) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-screen p-4">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading habits</h2>
                <p className="text-gray-600">Could not fetch your habits. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="habits-page">
            <HabitStats
                stats={stats}
                date={today}
                isLoading={statsLoading}
            />

            {showCreateForm && (
                <CreateHabitForm
                    onClose={handleCloseCreateForm}
                />
            )}

            <HabitList
                habits={habits || []}
                onToggleHabit={handleToggleHabit}
                isLoading={habitsLoading}
            />

            {(!habits || habits.length === 0) && (
                <div className="empty-state">
                    <h3>No habits yet</h3>
                    <p>Create your first habit to get started!</p>
                    <button
                        className="create-first-habit-btn"
                        onClick={handleShowCreateForm}
                    >
                        Create Your First Habit
                    </button>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={handleShowCreateForm}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Add new habit"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            <Footer />
        </div>
    );
};

export default HabitsPage; 