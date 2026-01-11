import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWines, getWine, createWine, updateWine, deleteWine, searchWines } from '../db/wines';
import type { WineInsert, WineUpdate } from '../types/wine';

// Query Keys
export const wineKeys = {
    all: ['wines'] as const,
    lists: () => [...wineKeys.all, 'list'] as const,
    list: (filters: string) => [...wineKeys.lists(), { filters }] as const,
    details: () => [...wineKeys.all, 'detail'] as const,
    detail: (id: string) => [...wineKeys.details(), id] as const,
    search: (query: string) => [...wineKeys.all, 'search', query] as const,
};

// --- Queries ---

export function useWines() {
    return useQuery({
        queryKey: wineKeys.lists(),
        queryFn: getWines,
    });
}

export function useWine(id: string) {
    return useQuery({
        queryKey: wineKeys.detail(id),
        queryFn: () => getWine(id),
        enabled: !!id,
    });
}

export function useSearchWines(query: string) {
    return useQuery({
        queryKey: wineKeys.search(query),
        queryFn: () => searchWines(query),
        enabled: query.length > 0,
    });
}

// --- Mutations ---

export function useCreateWine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (wine: WineInsert) => createWine(wine),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: wineKeys.lists() });
        },
    });
}

export function useUpdateWine(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updates: WineUpdate) => updateWine(id, updates),
        onSuccess: (updatedWine) => {
            // Update specific wine cache
            queryClient.setQueryData(wineKeys.detail(id), updatedWine);
            // Invalidate lists to ensure consistency
            queryClient.invalidateQueries({ queryKey: wineKeys.lists() });
        },
    });
}

export function useDeleteWine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteWine(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: wineKeys.lists() });
        },
    });
}
