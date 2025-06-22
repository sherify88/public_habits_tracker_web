export interface Habit {
    id: number;
    name: string;
    description?: string;
    createdDate: string;
    updatedDate: string;
    currentStreak: number;
    longestStreak: number;
    lastCompletedAt?: string; // Should be string (ISO date) on the frontend
    isCompletedToday: boolean;
    totalCompletions: number;
    deletedDate: string | null;
    createdById: number | null;
    updatedById: number | null;
}

export interface HabitCompletion {
    id: string;
    habitId: string;
    completedAt: string;
    date: string; // YYYY-MM-DD format
}

export interface CreateHabitRequest {
    name: string;
    description?: string;
}

export interface UpdateHabitRequest {
    name?: string;
    description?: string;
}

export interface ToggleHabitRequest {
    habitId: number;
    completed: boolean;
}

export interface HabitsResponse {
    habits: Habit[];
}

export interface HabitCompletionsResponse {
    completions: HabitCompletion[];
}

export interface HabitStatsResponse {
    totalHabits: number;
    completedToday: number;
    totalCompletions: number;
    averageStreak: number;
} 