import { z } from 'zod';

// Enums (matching DB constraints if any, or general business logic)
export const bottleStatusEnum = z.enum([
    'cellar', 'consumed', 'gifted', 'sold', 'damaged', 'lost'
]);

export type BottleStatus = z.infer<typeof bottleStatusEnum>;

// Full Bottle Schema
export const bottleSchema = z.object({
    id: z.string().uuid(),
    wine_id: z.string().uuid(),
    status: bottleStatusEnum.default('cellar'),
    size: z.string().nullish(), // e.g. "750ml", "1.5L"
    location: z.string().nullish(),
    bin: z.string().nullish(),
    barcode: z.string().nullish(),

    // Purchase Info
    purchase_price: z.number().nullish(),
    purchase_location: z.string().nullish(),
    purchase_date: z.string().nullish(), // ISO date string

    // Consumption Info
    consumed_date: z.string().nullish(), // ISO date string
    my_rating: z.number().min(0).max(100).nullish(),
    my_notes: z.string().nullish(),
    price: z.number().nullish(), // Sale price if sold, or market value? DB says just 'price'. Assuming sale price/current value.

    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export type Bottle = z.infer<typeof bottleSchema>;

// Input schemas
export const bottleInsertSchema = bottleSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
}).partial({
    status: true,
});

export type BottleInsert = z.infer<typeof bottleInsertSchema>;

export const bottleUpdateSchema = bottleInsertSchema.partial();
export type BottleUpdate = z.infer<typeof bottleUpdateSchema>;

// Specialized schemas
export const consumeBottleSchema = z.object({
    date: z.string(),
    rating: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
});
