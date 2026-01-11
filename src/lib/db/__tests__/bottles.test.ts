
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBottles, addBottle, updateBottle, deleteBottle, consumeBottle } from '../bottles';
import { supabase } from '../supabase';

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
            single: vi.fn(),
        })),
    }
}));

// Helper to mock the chain easily
const mockFrom = supabase.from as any;

describe('Bottle Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getBottles', () => {
        it('should return a list of bottles for a wine', async () => {
            const mockData = [
                { id: '123e4567-e89b-12d3-a456-426614174000', wine_id: '123e4567-e89b-12d3-a456-426614174001', status: 'cellar', created_at: new Date(), updated_at: new Date() }
            ];

            mockFrom.mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({ data: mockData, error: null })
                    })
                })
            });

            const result = await getBottles('123e4567-e89b-12d3-a456-426614174001');
            expect(result).toHaveLength(1);
            expect(result[0].status).toBe('cellar');
        });
    });

    describe('addBottle', () => {
        it('should insert and return new bottle', async () => {
            const newBottle = { wine_id: '123e4567-e89b-12d3-a456-426614174001', status: 'cellar' };
            const returnedBottle = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                ...newBottle,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockFrom.mockReturnValue({
                insert: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: returnedBottle, error: null })
                    })
                })
            });

            const result = await addBottle(newBottle as any);
            expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
        });
    });

    describe('updateBottle', () => {
        it('should update bottle details', async () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';
            const updates = { location: 'Cellar A', bin: 'A1' };
            const returnedBottle = {
                id,
                wine_id: '123e4567-e89b-12d3-a456-426614174001',
                status: 'cellar',
                ...updates,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockFrom.mockReturnValue({
                update: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        select: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: returnedBottle, error: null })
                        })
                    })
                })
            });

            const result = await updateBottle(id, updates);
            expect(result.location).toBe('Cellar A');
        });
    });

    describe('deleteBottle', () => {
        it('should delete a bottle', async () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';

            mockFrom.mockReturnValue({
                delete: vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ error: null })
                })
            });

            await expect(deleteBottle(id)).resolves.not.toThrow();
        });
    });

    describe('addMultipleBottles', () => {
        it('should add multiple bottles at once', async () => {
            const count = 3;
            // Mock return for 3 bottles
            const mockData = Array(3).fill(null).map((_, i) => ({
                id: `123e4567-e89b-12d3-a456-42661417400${i}`,
                wine_id: '123e4567-e89b-12d3-a456-426614174001',
                status: 'cellar',
                created_at: new Date(),
                updated_at: new Date()
            }));

            mockFrom.mockReturnValue({
                insert: vi.fn().mockReturnValue({
                    select: vi.fn().mockResolvedValue({ data: mockData, error: null })
                })
            });

            // We mock the implementation inside addMultipleBottles which calls insert(array)
            // But since we are mocking the query chain, it should just work if we mock the return of the final execution.
            // Wait, addMultipleBottles calls .insert(validatedArray).select()
            const result = await import('../bottles').then(m => m.addMultipleBottles('123e4567-e89b-12d3-a456-426614174001', count));
            expect(result).toHaveLength(3);
        });
    });

    describe('consumeBottle', () => {
        it('should update bottle status to Consumed', async () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';
            const updates = { status: 'consumed', my_rating: 90 };
            const returnedBottle = {
                id,
                wine_id: '123e4567-e89b-12d3-a456-426614174001',
                status: 'consumed',
                my_rating: 90,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockFrom.mockReturnValue({
                update: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        select: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: returnedBottle, error: null })
                        })
                    })
                })
            });

            const result = await consumeBottle(id, 90, undefined);
            expect(result.status).toBe('consumed');
            expect(result.my_rating).toBe(90);
        });
    });
});
