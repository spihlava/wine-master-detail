import { supabase } from './supabase';
import { bottleSchema, bottleInsertSchema, bottleUpdateSchema, type Bottle, type BottleInsert, type BottleUpdate } from '../types/bottle';

export async function getBottles(wineId: string): Promise<Bottle[]> {
    const { data, error } = await supabase
        .from('bottles')
        .select('*')
        .eq('wine_id', wineId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(row => bottleSchema.parse(row));
}

export async function addBottle(bottle: BottleInsert): Promise<Bottle> {
    const validated = bottleInsertSchema.parse(bottle);

    const { data, error } = await supabase
        .from('bottles')
        .insert(validated)
        .select()
        .single();

    if (error) throw error;
    return bottleSchema.parse(data);
}

export async function addMultipleBottles(wineId: string, count: number, details: Partial<BottleInsert> = {}): Promise<Bottle[]> {
    if (count <= 0) return [];

    const bottlesToInsert: BottleInsert[] = Array(count).fill(null).map(() => ({
        wine_id: wineId,
        status: 'cellar',
        ...details
    }));

    // Validate one to be sure, or map and validate all.
    // Let's validate all locally first.
    const validated = bottlesToInsert.map(b => bottleInsertSchema.parse(b));

    const { data, error } = await supabase
        .from('bottles')
        .insert(validated)
        .select();

    if (error) throw error;
    return data.map(row => bottleSchema.parse(row));
}

export async function updateBottle(id: string, updates: BottleUpdate): Promise<Bottle> {
    const validated = bottleUpdateSchema.parse(updates);

    const { data, error } = await supabase
        .from('bottles')
        .update(validated)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return bottleSchema.parse(data);
}

export async function deleteBottle(id: string): Promise<void> {
    const { error } = await supabase
        .from('bottles')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function consumeBottle(id: string, rating?: number, notes?: string, date?: string): Promise<Bottle> {
    const updates: BottleUpdate = {
        status: 'consumed',
        consumed_date: date || new Date().toISOString(),
        my_rating: rating,
        my_notes: notes
    };

    return updateBottle(id, updates);
}
