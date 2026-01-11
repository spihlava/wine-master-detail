import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBottles, addBottle, addMultipleBottles, updateBottle, deleteBottle, consumeBottle } from '../db/bottles';
import type { BottleInsert, BottleUpdate } from '../types/bottle';

// Query Keys
export const bottleKeys = {
    all: ['bottles'] as const,
    lists: () => [...bottleKeys.all, 'list'] as const,
    list: (wineId: string) => [...bottleKeys.lists(), wineId] as const,
};

// --- Queries ---

export function useBottles(wineId: string) {
    return useQuery({
        queryKey: bottleKeys.list(wineId),
        queryFn: () => getBottles(wineId),
        enabled: !!wineId,
    });
}

// --- Mutations ---

export function useAddBottle(wineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bottle: BottleInsert) => addBottle(bottle),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bottleKeys.list(wineId) });
        },
    });
}

export function useAddMultipleBottles(wineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ count, details }: { count: number; details?: Partial<BottleInsert> }) =>
            addMultipleBottles(wineId, count, details),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bottleKeys.list(wineId) });
        },
    });
}

export function useUpdateBottle(wineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: BottleUpdate }) =>
            updateBottle(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bottleKeys.list(wineId) });
        },
    });
}

export function useDeleteBottle(wineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBottle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bottleKeys.list(wineId) });
        },
    });
}

export function useConsumeBottle(wineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, rating, notes, date }: { id: string; rating?: number; notes?: string, date?: string }) =>
            consumeBottle(id, rating, notes, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bottleKeys.list(wineId) });
        },
    });
}
