import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { supabase } from '../supabase';
import { getWines, getWine, createWine, WineNotFoundError } from '../wines';
import type { WineInsert } from '@/lib/types/wine';

// Mock Supabase client
vi.mock('../supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            or: vi.fn().mockReturnThis(),
            single: vi.fn(),
        })),
    }
}));

// Helper to mock the chain easily
const mockFrom = supabase.from as Mock;

describe('Wine Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getWines', () => {
        it('should return a list of wines', async () => {
            const mockData = [
                { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Wine A', created_at: new Date(), updated_at: new Date() },
                { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Wine B', created_at: new Date(), updated_at: new Date() }
            ];

            // Setup mock chain
            mockFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: mockData, error: null })
                })
            });

            const result = await getWines();
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Wine A');
        });

        it('should throw error if supabase fails', async () => {
            mockFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } })
                })
            });

            await expect(getWines()).rejects.toEqual({ message: 'DB Error' });
        });
    });

    describe('getWine', () => {
        it('should return a single wine', async () => {
            const mockWine = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Wine A', created_at: new Date(), updated_at: new Date() };

            mockFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: mockWine, error: null })
                    })
                })
            });

            const result = await getWine('123e4567-e89b-12d3-a456-426614174000');
            expect(result.id).toBe(mockWine.id);
        });

        it('should throw WineNotFoundError if not found', async () => {
            mockFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
                    })
                })
            });

            await expect(getWine('bad-id')).rejects.toThrow(WineNotFoundError);
        });
    });

    describe('createWine', () => {
        it('should insert and return new wine', async () => {
            const newWine: WineInsert = { name: 'New Wine', type: 'Red' };
            const returnedWine = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                ...newWine,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockFrom.mockReturnValue({
                insert: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: returnedWine, error: null })
                    })
                })
            });

            const result = await createWine(newWine);
            expect(result.name).toBe('New Wine');
        });
    });
});
