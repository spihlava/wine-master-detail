# TypeScript Type Definitions

## Wine Types

```typescript
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

// Insert (omit auto-generated)
export const wineInsertSchema = wineSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type WineInsert = z.infer<typeof wineInsertSchema>;

// Update (all optional)
export const wineUpdateSchema = wineInsertSchema.partial();
export type WineUpdate = z.infer<typeof wineUpdateSchema>;
```

## Bottle Types

```typescript
export const bottleStatusEnum = z.enum([
  'cellar', 'consumed', 'gifted', 'sold', 'damaged'
]);

export type BottleStatus = z.infer<typeof bottleStatusEnum>;

export const bottleSchema = z.object({
  id: z.string().uuid(),
  wine_id: z.string().uuid(),
  size: z.string().default('750ml'),
  status: bottleStatusEnum,
  location: z.string().nullable(),
  bin: z.string().nullable(),
  barcode: z.string().nullable(),
  purchase_price: z.number().nullable(),
  purchase_location: z.string().nullable(),
  purchase_date: z.coerce.date().nullable(),
  price: z.number().nullable(),
  consumed_date: z.coerce.date().nullable(),
  my_rating: z.number().int().min(0).max(100).nullable(),
  my_notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Bottle = z.infer<typeof bottleSchema>;

export const bottleInsertSchema = bottleSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type BottleInsert = z.infer<typeof bottleInsertSchema>;

export const bottleUpdateSchema = bottleInsertSchema.partial().omit({
  wine_id: true, // Cannot change wine association
});
export type BottleUpdate = z.infer<typeof bottleUpdateSchema>;
```

## Computed Types

```typescript
// Wine with computed stats
export interface WineWithStats extends Wine {
  stats: WineStats;
}

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

// Cellar overview stats
export interface CellarStats {
  totalBottles: number;
  uniqueWines: number;
  totalValue: number;
  byType: Record<WineType, number>;
  byStatus: Record<BottleStatus, number>;
}

// Drinking window status
export type DrinkingWindowStatus = 'too-young' | 'ready' | 'past-prime' | 'unknown';
```
