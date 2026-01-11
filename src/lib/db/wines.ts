import { supabase } from './supabase';
import { wineSchema, wineInsertSchema, wineUpdateSchema, type Wine, type WineInsert, type WineUpdate } from '../types/wine';

export class WineNotFoundError extends Error {
    constructor(id: string) {
        super(`Wine with id ${id} not found`);
        this.name = 'WineNotFoundError';
    }
}

export async function getWines(): Promise<Wine[]> {
    const { data, error } = await supabase
        .from('wines')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(row => wineSchema.parse(row));
}

export async function getWine(id: string): Promise<Wine> {
    const { data, error } = await supabase
        .from('wines')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') throw new WineNotFoundError(id);
        throw error;
    }

    return wineSchema.parse(data);
}

export async function createWine(wine: WineInsert): Promise<Wine> {
    // Validate before sending to database
    const validated = wineInsertSchema.parse(wine);

    const { data, error } = await supabase
        .from('wines')
        .insert(validated)
        .select()
        .single();

    if (error) throw error;
    return wineSchema.parse(data);
}

export async function updateWine(id: string, updates: WineUpdate): Promise<Wine> {
    // Validate partial updates
    const validated = wineUpdateSchema.parse(updates);

    const { data, error } = await supabase
        .from('wines')
        .update(validated)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') throw new WineNotFoundError(id);
        throw error;
    }

    return wineSchema.parse(data);
}

export async function deleteWine(id: string): Promise<void> {
    const { error } = await supabase
        .from('wines')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Search wines by name, producer, or region
export async function searchWines(query: string): Promise<Wine[]> {
    const { data, error } = await supabase
        .from('wines')
        .select('*')
        .or(`name.ilike.%${query}%,producer.ilike.%${query}%,region.ilike.%${query}%`)
        .order('name', { ascending: true });

    if (error) throw error;
    return data.map(row => wineSchema.parse(row));
}
