import React, { useState, useCallback } from 'react';
import { Habit } from '../types/habits';
import { useDeleteHabit } from '../api/habitsApi';
import HabitItem from './HabitItem';

interface HabitListProps {
    habits: Habit[];
    onToggleHabit: (habitId: number, isCompleted: boolean) => Promise<void>;
    isLoading: boolean;
}

const HabitList: React.FC<HabitListProps> = ({
    habits,
    onToggleHabit,
    isLoading
}) => {
    const deleteHabitMutation = useDeleteHabit();
    const [deletingHabitId, setDeletingHabitId] = useState<number | null>(null);

    // Memoize the delete handler to prevent unnecessary re-renders
    const handleDeleteHabit = useCallback(async (habitId: number) => {
        if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
            setDeletingHabitId(habitId);
            try {
                await deleteHabitMutation.mutateAsync(habitId);
            } catch (error) {
                console.error('Failed to delete habit:', error);
            } finally {
                setDeletingHabitId(null);
            }
        }
    }, [deleteHabitMutation]);

    if (isLoading) {
        return (
            <div className="habit-list-loading">
                <div className="loading-spinner"></div>
                <p>Loading today's progress...</p>
            </div>
        );
    }

    if (!habits || habits.length === 0) {
        return null; // Empty state is handled in the parent component
    }

    return (
        <div className="habit-list">
            <h2>Your Habits</h2>
            <div className="habits-grid">
                {habits.map((habit) => (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        isCompleted={habit.isCompletedToday}
                        onToggle={onToggleHabit}
                        onDelete={handleDeleteHabit}
                        isDeleting={deletingHabitId === habit.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default HabitList; 