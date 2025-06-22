import React, { useEffect, useState } from 'react';
import { HabitStatsResponse } from '../types/habits';

interface HabitStatsProps {
    stats?: HabitStatsResponse;
    date: string;
    isLoading: boolean;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="stat-card">
        <div className="stat-number">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

const HabitStats: React.FC<HabitStatsProps> = ({ stats, date, isLoading }) => {
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        if (stats && stats.completedToday === stats.totalHabits && stats.totalHabits > 0) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowCelebration(false);
        }
    }, [stats]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="habit-stats is-loading">
                <div className="stats-header">
                    <h3>Today's Progress</h3>
                    <span className="date-placeholder"></span>
                </div>
                <div className="stats-grid">
                    <div className="stat-card-placeholder"></div>
                    <div className="stat-card-placeholder"></div>
                    <div className="stat-card-placeholder"></div>
                    <div className="stat-card-placeholder"></div>
                </div>
            </div>
        )
    }

    if (!stats || stats.totalHabits === 0) {
        return null; // Don't show stats if there are no habits
    }

    const { totalHabits, completedToday, totalCompletions, averageStreak } = stats;
    const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    return (
        <div className="habit-stats">
            <div className="stats-header">
                <h3>Today's Progress</h3>
                <span className="date">{formatDate(date)}</span>
            </div>

            <div className="stats-grid">
                <StatCard label="Completed Today" value={completedToday} />
                <StatCard label="Total Habits" value={totalHabits} />
                <StatCard label="Total Completions" value={totalCompletions} />
                <StatCard label="Avg. Streak" value={averageStreak} />
            </div>

            <div className="progress-section">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
                <span className="progress-text">{completionPercentage}% Complete</span>
            </div>

            {showCelebration && (
                <div className="celebration-message">
                    🎉 Great job! You've completed all your habits today!
                </div>
            )}
        </div>
    );
};

export default HabitStats; 