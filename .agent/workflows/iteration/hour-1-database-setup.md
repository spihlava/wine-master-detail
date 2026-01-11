---
description: Hour 1 - Set up Supabase database schema with wines and bottles tables
---

# Hour 1: Database Setup

## Goal
Create the foundational database schema with wines (master), bottles (detail), and event tables (sub-details) in Supabase.

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.

- [x] Supabase project connected
- [x] Wines table created with all fields
- [x] Bottles table created with current_* fields
- [x] Event tables created (transactions, movements, tastings)
- [x] Auto-update triggers created
- [x] Foreign key relationships established
- [x] Indexes created for common queries
- [x] TypeScript types generated from Supabase
- [x] Zod schemas created for validation

## Prerequisites
- Supabase account and project created
- Project URL and anon key available

## Implementation Steps

### 1. Create Next.js Project

// turbo
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

### 2. Install Dependencies

// turbo
```bash
npm install @supabase/supabase-js @tanstack/react-query zod
```

// turbo
```bash
npm install -D supabase
```

### 3. Set Up Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Create Wines Table

Run in Supabase SQL Editor:

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wines table (master records)
CREATE TABLE wines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core fields (every master needs these)
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Wine identity
  producer text,
  vintage integer CHECK (vintage IS NULL OR (vintage >= 1800 AND vintage <= 2100)),
  
  -- Classification
  type text CHECK (type IS NULL OR type IN ('Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified')),
  varietal text,
  master_varietal text,
  
  -- Location/origin
  country text,
  region text,
  sub_region text,
  appellation text,
  
  -- Wine attributes
  abv decimal(4,2),
  
  -- Drinking window
  begin_consume integer,
  end_consume integer,
  
  -- Reference ratings
  rating_min integer CHECK (rating_min IS NULL OR (rating_min >= 0 AND rating_min <= 100)),
  rating_max integer CHECK (rating_max IS NULL OR (rating_max >= 0 AND rating_max <= 100)),
  rating_notes text,
  
  -- Additional info
  food_pairing text,
  image_url text,
  
  -- Validate drinking window
  CONSTRAINT valid_drinking_window CHECK (
    begin_consume IS NULL OR 
    end_consume IS NULL OR 
    begin_consume <= end_consume
  )
);

-- Create indexes for common queries
CREATE INDEX idx_wines_producer ON wines(producer);
CREATE INDEX idx_wines_vintage ON wines(vintage);
CREATE INDEX idx_wines_type ON wines(type);
CREATE INDEX idx_wines_region ON wines(region);
CREATE INDEX idx_wines_country ON wines(country);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wines_updated_at
  BEFORE UPDATE ON wines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE wines IS 'Master records for wine products. One record per unique wine (producer + vintage + name).';
```

### 5. Create Bottles Table

Run in Supabase SQL Editor:

```sql
-- Create bottles table (detail records)
CREATE TABLE bottles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id uuid NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  
  -- Core fields
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Bottle attributes
  size text DEFAULT '750ml',
  status text NOT NULL DEFAULT 'cellar' 
    CHECK (status IN ('cellar', 'consumed', 'gifted', 'sold', 'damaged')),
  
  -- Location tracking
  location text,
  bin text,
  barcode text UNIQUE,
  
  -- Purchase info
  purchase_price decimal(10,2),
  purchase_location text,
  purchase_date date,
  
  -- Current value
  price decimal(10,2),
  
  -- Consumption info
  consumed_date date,
  my_rating integer CHECK (my_rating IS NULL OR (my_rating >= 0 AND my_rating <= 100)),
  my_notes text,
  
  -- Validate consumed_date when consumed
  CONSTRAINT consumed_must_have_date CHECK (
    status != 'consumed' OR consumed_date IS NOT NULL
  )
);

-- Create indexes
CREATE INDEX idx_bottles_wine_id ON bottles(wine_id);
CREATE INDEX idx_bottles_status ON bottles(status);
CREATE INDEX idx_bottles_location ON bottles(location);
CREATE INDEX idx_bottles_barcode ON bottles(barcode) WHERE barcode IS NOT NULL;

-- Create updated_at trigger
CREATE TRIGGER update_bottles_updated_at
  BEFORE UPDATE ON bottles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE bottles IS 'Detail records for physical bottle instances. Many bottles per wine. Tracks inventory, location, and personal notes.';
```

### 6. Create Supabase Client

Create `src/lib/db/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 7. Generate TypeScript Types

// turbo
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/db/database.types.ts
```

Or use the Supabase Dashboard: Settings > API > Generate Types

### 8. Create Zod Schemas

Create `src/lib/types/wine.ts`:

```typescript
import { z } from 'zod';

export const wineTypeEnum = z.enum([
  'Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'
]);

export const wineSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Wine name is required'),
  producer: z.string().nullable(),
  vintage: z.number().int().min(1800).max(2100).nullable(),
  type: wineTypeEnum.nullable(),
  varietal: z.string().nullable(),
  master_varietal: z.string().nullable(),
  country: z.string().nullable(),
  region: z.string().nullable(),
  sub_region: z.string().nullable(),
  appellation: z.string().nullable(),
  abv: z.number().min(0).max(100).nullable(),
  rating_min: z.number().int().min(0).max(100).nullable(),
  rating_max: z.number().int().min(0).max(100).nullable(),
  rating_notes: z.string().nullable(),
  food_pairing: z.string().nullable(),
  begin_consume: z.number().int().nullable(),
  end_consume: z.number().int().nullable(),
  image_url: z.string().url().nullable().or(z.literal('')),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Wine = z.infer<typeof wineSchema>;
export type WineType = z.infer<typeof wineTypeEnum>;

export const wineInsertSchema = wineSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type WineInsert = z.infer<typeof wineInsertSchema>;

export const wineUpdateSchema = wineInsertSchema.partial();
export type WineUpdate = z.infer<typeof wineUpdateSchema>;
```

Create `src/lib/types/bottle.ts`:

```typescript
import { z } from 'zod';

export const bottleStatusEnum = z.enum([
  'cellar', 'consumed', 'gifted', 'sold', 'damaged'
]);

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
export type BottleStatus = z.infer<typeof bottleStatusEnum>;

export const bottleInsertSchema = bottleSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type BottleInsert = z.infer<typeof bottleInsertSchema>;

export const bottleUpdateSchema = bottleInsertSchema.partial().omit({
  wine_id: true,
});

export type BottleUpdate = z.infer<typeof bottleUpdateSchema>;
```

### 9. Verify Setup

Test by inserting sample data in Supabase SQL Editor:

```sql
-- Insert a test wine
INSERT INTO wines (name, producer, vintage, type, region, country)
VALUES ('Château Margaux', 'Château Margaux', 2018, 'Red', 'Margaux', 'France')
RETURNING *;

-- Insert a test bottle (use the wine id from above)
INSERT INTO bottles (wine_id, location, bin, purchase_price, purchase_date)
VALUES ('YOUR_WINE_ID', 'Main Cellar', 'A3', 450.00, '2023-06-15')
RETURNING *;

-- Verify the join works
SELECT w.name, w.vintage, b.location, b.status
FROM wines w
JOIN bottles b ON b.wine_id = w.id;
```

## Testing Checklist
- [ ] Next.js project created and running (`npm run dev`)
- [ ] Supabase connection works (no errors in console)
- [ ] Wines table accepts inserts
- [ ] Bottles table accepts inserts with valid wine_id
- [ ] Bottles table rejects inserts with invalid wine_id
- [ ] CHECK constraints work (try invalid status, rating > 100)
- [ ] Indexes created (check in Supabase dashboard)
- [ ] TypeScript types match database schema
- [ ] Zod schemas validate correctly

## Deliverables
- Working Next.js + Supabase project
- wines and bottles tables with proper constraints
- TypeScript types for database
- Zod schemas for validation

## Time Box
60 minutes

## Next Hour
Hour 2: Wine CRUD operations (service layer + hooks + basic UI)

## Troubleshooting

### Supabase connection fails
- Check `.env.local` values are correct
- Ensure no trailing slashes in URL
- Verify anon key is the correct one (not service role key)

### Type generation fails
- Login to Supabase CLI: `npx supabase login`
- Check project ID is correct
- Or manually copy types from dashboard

### Foreign key constraint fails
- Ensure wine_id exists in wines table
- Check UUID format is correct
