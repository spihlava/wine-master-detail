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
    producer: z.string().nullish(),
    vintage: z.number().int().min(1800).max(2100).nullish(),
    type: wineTypeEnum.nullish(),
    varietal: z.string().nullish(),
    master_varietal: z.string().nullish(),
    country: z.string().nullish(),
    region: z.string().nullish(),
    sub_region: z.string().nullish(),
    appellation: z.string().nullish(),
    abv: z.number().nullish(),
    rating_min: z.number().int().min(0).max(100).nullish(),
    rating_max: z.number().int().min(0).max(100).nullish(),
    rating_notes: z.string().nullish(),
    food_pairing: z.string().nullish(),
    begin_consume: z.number().int().nullish(),
    end_consume: z.number().int().nullish(),
    image_url: z.string().url().nullish().or(z.literal('')).or(z.null()),
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
