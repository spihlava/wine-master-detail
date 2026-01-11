import { z } from 'zod';

// Enums
export const wineTypeEnum = z.enum([
    'Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'
]);

export type WineType = z.infer<typeof wineTypeEnum>;

// Full Wine Schema
export const wineSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    producer: z.string().nullable(),
    vintage: z.number().int().min(1800).max(2100).nullable(),
    type: wineTypeEnum.nullable(),
    varietal: z.string().nullable(),
    master_varietal: z.string().nullable(),
    country: z.string().nullable(),
    region: z.string().nullable(),
    sub_region: z.string().nullable(),
    appellation: z.string().nullable(),
    abv: z.number().nullable(),
    rating_min: z.number().int().min(0).max(100).nullable(),
    rating_max: z.number().int().min(0).max(100).nullable(),
    rating_notes: z.string().nullable(),
    food_pairing: z.string().nullable(),
    begin_consume: z.number().int().nullable(),
    end_consume: z.number().int().nullable(),
    image_url: z.string().url().nullable().or(z.literal('')).or(z.null()),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export type Wine = z.infer<typeof wineSchema>;

export const wineInsertSchema = wineSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
export type WineInsert = z.infer<typeof wineInsertSchema>;

export const wineUpdateSchema = wineInsertSchema.partial();
export type WineUpdate = z.infer<typeof wineUpdateSchema>;

// Computed Types
export interface WineStats {
    total: number;
    inCellar: number;
    consumed: number;
    gifted: number;
    sold: number;
    damaged: number;
    cellarValue: number;
    avgRating: number | null;
}

export interface WineWithStats extends Wine {
    stats: WineStats;
}
