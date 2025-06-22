import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { habitsApi } from '../habitsApi';
import { Habit, CreateHabitRequest, ToggleHabitRequest, HabitStatsResponse } from '../../types/habits';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock API config
jest.mock('../../config/api', () => ({
    API_CONFIG: {
        BASE_URL: 'http://localhost:3000/api',
        TIMEOUT: 5000,
        DEFAULT_HEADERS: {
            'Content-Type': 'application/json'
        }
    }
}));

// Test data
const mockHabit: Habit = {
    id: 1,
    name: 'Test Habit',
    description: 'A test habit',
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
};

const mockStats: HabitStatsResponse = {
    totalHabits: 5,
    completedToday: 3,
    totalCompletions: 25,
    averageStreak: 4.2
};

describe('habitsApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getHabits', () => {
        it('fetches habits successfully with array response', async () => {
            const mockResponse = [mockHabit];
            mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

            const result = await habitsApi.getHabits();

            expect(result).toEqual(mockResponse);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:3000/api/habits',
                expect.objectContaining({
                    timeout: 5000,
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        });

        it('fetches habits successfully with object response', async () => {
            const mockResponse = { habits: [mockHabit] };
            mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

            const result = await habitsApi.getHabits();

            expect(result).toEqual([mockHabit]);
        });

        it('returns an empty array on 404 error', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            try {
                // Create a proper AxiosError for the mock
                const error = new AxiosError('Request failed with status code 404');
                error.response = {
                    status: 404,
                    data: 'Not Found',
                    statusText: 'Not Found',
                    headers: {},
                    config: {} as any,
                };
                mockedAxios.get.mockRejectedValue(error);

                const habits = await habitsApi.getHabits();
                expect(habits).toEqual([]);
            } finally {
                consoleErrorSpy.mockRestore();
            }
        });

        it('throws other errors', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            try {
                mockedAxios.get.mockRejectedValue(new Error('Network error'));
                await expect(habitsApi.getHabits()).rejects.toThrow('Network error');
            } finally {
                consoleErrorSpy.mockRestore();
            }
        });
    });

    describe('createHabit', () => {
        it('creates habit successfully', async () => {
            const createData: CreateHabitRequest = {
                name: 'New Habit',
                description: 'A new habit'
            };
            mockedAxios.post.mockResolvedValueOnce({ data: mockHabit });

            const result = await habitsApi.createHabit(createData);

            expect(result).toEqual(mockHabit);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/habits',
                createData,
                expect.objectContaining({
                    timeout: 5000,
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        });
    });

    describe('deleteHabit', () => {
        it('deletes habit successfully', async () => {
            mockedAxios.delete.mockResolvedValueOnce({});

            await habitsApi.deleteHabit(1);

            expect(mockedAxios.delete).toHaveBeenCalledWith(
                'http://localhost:3000/api/habits/1',
                expect.objectContaining({
                    timeout: 5000,
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        });
    });

    describe('getHabitStats', () => {
        it('fetches stats successfully', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

            const result = await habitsApi.getHabitStats();

            expect(result).toEqual(mockStats);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:3000/api/habits/stats',
                expect.objectContaining({
                    timeout: 5000,
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        });
    });

    describe('toggleHabit', () => {
        it('toggles habit successfully', async () => {
            const toggleData: ToggleHabitRequest = {
                habitId: 1,
                completed: true
            };
            mockedAxios.patch.mockResolvedValueOnce({ data: mockHabit });

            const result = await habitsApi.toggleHabit(toggleData);

            expect(result).toEqual(mockHabit);
            expect(mockedAxios.patch).toHaveBeenCalledWith(
                'http://localhost:3000/api/habits/1/toggle',
                { completed: true },
                expect.objectContaining({
                    timeout: 5000,
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        });
    });
}); 