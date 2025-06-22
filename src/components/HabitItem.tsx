import React, { useState, useCallback } from 'react';
import { Habit } from '../types/habits';

// Loading spinner component
const LoadingSpinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-t-transparent border-gray-300 rounded-full animate-spin"></div>
);

// Helper function for date formatting
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

interface HabitItemProps {
    habit: Habit;
    isCompleted: boolean;
    onToggle: (habitId: number, isCompleted: boolean) => Promise<void>;
    onDelete: (habitId: number) => Promise<void>;
    isDeleting: boolean;
}

const HabitItem: React.FC<HabitItemProps> = ({
    habit,
    isCompleted,
    onToggle,
    onDelete,
    isDeleting
}) => {
    const [isToggling, setIsToggling] = useState(false);

    // Memoize the toggle handler to prevent unnecessary re-renders
    const handleToggle = useCallback(async () => {
        setIsToggling(true);
        try {
            await onToggle(habit.id, isCompleted);
        } catch (error) {
            console.error('Failed to toggle habit:', error);
        } finally {
            setIsToggling(false);
        }
    }, [onToggle, habit.id, isCompleted]);

    // Memoize the delete handler
    const handleDelete = useCallback(async () => {
        await onDelete(habit.id);
    }, [onDelete, habit.id]);

    // Extract conditional styling logic
    const isCompletedStyle = isCompleted ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md";
    const isDeletingStyle = isDeleting ? "opacity-50 pointer-events-none" : "";
    const toggleButtonStyle = isCompleted
        ? "bg-green-500 border-green-500 text-white"
        : "bg-white border-gray-300 hover:border-indigo-500 hover:scale-105";

    const containerClasses = `flex justify-between items-center p-4 rounded-xl border-2 transition-all duration-300 ease-in-out ${isCompletedStyle} ${isDeletingStyle}`;
    const toggleButtonClasses = `w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 text-2xl ${toggleButtonStyle}`;

    return (
        <div className={containerClasses} data-habit-id={habit.id}>
            <div className="flex-1 mr-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1">{habit.name}</h3>
                    <button
                        className="bg-transparent border-none text-red-500 text-2xl cursor-pointer p-1 rounded transition-all duration-200 ml-2 hover:bg-red-100 hover:text-red-700"
                        onClick={handleDelete}
                        disabled={isDeleting || isToggling}
                        aria-label="Delete habit"
                    >
                        {isDeleting ? '...' : '×'}
                    </button>
                </div>

                {habit.description && (
                    <p className="text-gray-500 my-2 leading-relaxed">{habit.description}</p>
                )}

                <div className="text-sm text-gray-400">
                    <span>
                        Created: {formatDate(habit.createdDate)}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <button
                    className={toggleButtonClasses}
                    onClick={handleToggle}
                    disabled={isToggling || isDeleting}
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                    {isToggling ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {isCompleted ? (
                                <span className="font-bold">✓</span>
                            ) : (
                                <span className="text-gray-300">○</span>
                            )}
                        </>
                    )}
                </button>

                <span className="text-sm text-gray-500 font-medium">
                    {isCompleted ? 'Completed' : 'Not done'}
                </span>
            </div>
        </div>
    );
};

export default HabitItem;