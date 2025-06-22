import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';
import { tokenUtils } from './authApi';
import {
    Habit,
    CreateHabitRequest,
    UpdateHabitRequest,
    ToggleHabitRequest,
    HabitCompletion,
    HabitsResponse,
    HabitCompletionsResponse,
    HabitStatsResponse
} from '../types/habits';

// API endpoints using config
const HABITS_ENDPOINT = `${API_CONFIG.BASE_URL}/habits`;
const STATS_ENDPOINT = `${HABITS_ENDPOINT}/stats`;
const COMPLETIONS_ENDPOINT = `${API_CONFIG.BASE_URL}/completions`;

// Helper function to get headers with auth token
const getAuthHeaders = () => {
    const token = tokenUtils.getToken();
    return {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Query keys
export const habitKeys = {
    all: ['habits'] as const,
    lists: () => [...habitKeys.all, 'list'] as const,
    list: (filters: string) => [...habitKeys.lists(), { filters }] as const,
    details: () => [...habitKeys.all, 'detail'] as const,
    detail: (id: number | string) => [...habitKeys.details(), id] as const,
};

export const statsKeys = {
    all: ['stats'] as const,
};

export const completionKeys = {
    all: ['completions'] as const,
    lists: () => [...completionKeys.all, 'list'] as const,
    list: (date: string) => [...completionKeys.lists(), { date }] as const,
};

// API functions
export const habitsApi = {
    // Get all habits
    getHabits: async (): Promise<Habit[]> => {
        try {
            const response = await axios.get<HabitsResponse | Habit[]>(HABITS_ENDPOINT, {
                timeout: API_CONFIG.TIMEOUT,
                headers: getAuthHeaders(),
            });
            // Handle both {habits: []} and [] response shapes
            if (Array.isArray(response.data)) {
                return response.data;
            }
            return response.data.habits || [];
        } catch (error) {
            console.error("Error fetching habits:", error);
            if (error instanceof AxiosError && error.response?.status === 404) {
                return []; // Return empty array on 404 to prevent query error
            }
            throw error; // Re-throw other errors for React Query to handle
        }
    },

    // Create a new habit
    createHabit: async (habitData: CreateHabitRequest): Promise<Habit> => {
        try {
            const response = await axios.post<Habit>(HABITS_ENDPOINT, habitData, {
                timeout: API_CONFIG.TIMEOUT,
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                // Extract the error message from the backend response
                const errorMessage = error.response.data.message || error.response.data.error || error.message;
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    // Delete a habit
    deleteHabit: async (id: number): Promise<void> => {
        await axios.delete(`${HABITS_ENDPOINT}/${id}`, {
            timeout: API_CONFIG.TIMEOUT,
            headers: getAuthHeaders(),
        });
    },

    getHabitStats: async (): Promise<HabitStatsResponse> => {
        const response = await axios.get<HabitStatsResponse>(STATS_ENDPOINT, {
            timeout: API_CONFIG.TIMEOUT,
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    // Toggle habit completion status (matches NestJS ToggleHabitDto)
    toggleHabit: async (toggleData: ToggleHabitRequest): Promise<Habit> => {
        const { habitId, completed } = toggleData;
        const response = await axios.patch<Habit>(`${HABITS_ENDPOINT}/${habitId}/toggle`,
            { completed }, // Body contains only the 'completed' boolean
            {
                timeout: API_CONFIG.TIMEOUT,
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    },
};

// React Query hooks
export const useHabits = (enabled: boolean = true) => {
    return useQuery({
        queryKey: habitKeys.lists(),
        queryFn: habitsApi.getHabits,
        enabled,
    });
};

export const useHabitStats = (enabled: boolean = true) => {
    return useQuery({
        queryKey: statsKeys.all,
        queryFn: habitsApi.getHabitStats,
        enabled,
    });
};

export const useHabit = (id: number) => {
    return useQuery({
        queryKey: habitKeys.detail(id),
        queryFn: () => habitsApi.getHabits().then(habits => habits.find(h => h.id === id)),
        enabled: !!id,
    });
};

// Mutations
export const useCreateHabit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: habitsApi.createHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
        },
    });
};

export const useDeleteHabit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: habitsApi.deleteHabit,
        onSuccess: () => {
            // Invalidate both habits and stats queries to refetch all data
            queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
            queryClient.invalidateQueries({ queryKey: statsKeys.all });
        },
    });
};

// Updated to use single toggle mutation
export const useToggleHabit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: habitsApi.toggleHabit,
        onSuccess: () => {
            // Invalidate both habits and stats queries to refetch all data
            queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
            queryClient.invalidateQueries({ queryKey: statsKeys.all });
        },
    });
}; 