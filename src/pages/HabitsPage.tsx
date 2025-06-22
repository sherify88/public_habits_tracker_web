import React, { useState, useCallback, useMemo } from 'react';
import { useHabits, useToggleHabit, useHabitStats } from '../api/habitsApi';
import CreateHabitForm from '../components/CreateHabitForm';
import HabitList from '../components/HabitList';
import HabitStats from '../components/HabitStats';
import Footer from '../components/Footer';
import '../styles/habits.css';

const HabitsPage: React.FC = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Memoize today's date to avoid recalculation on every render
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const { data: habits, isLoading: habitsLoading, error: habitsError } = useHabits();
    const { data: stats, isLoading: statsLoading } = useHabitStats();
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

    if (habitsLoading) {
        return (
            <div className="habits-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading habits...</p>
                </div>
            </div>
        );
    }

    if (habitsError) {
        return (
            <div className="habits-page">
                <div className="error-container">
                    <h2>Error loading habits</h2>
                    <p>Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="habits-page">
            <div className="habits-header">
                <h1>Habits Tracker</h1>
                <button
                    className="create-habit-btn"
                    onClick={handleShowCreateForm}
                >
                    + Add New Habit
                </button>
            </div>

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

            <Footer />
        </div>
    );
};

export default HabitsPage; 