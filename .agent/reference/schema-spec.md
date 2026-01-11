# Database Schema Specification

## wines Table (Master)

```sql
CREATE TABLE wines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core (required)
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Identity
  producer text,
  vintage integer CHECK (vintage IS NULL OR (vintage >= 1800 AND vintage <= 2100)),
  
  -- Classification
  type text CHECK (type IN ('Red','White','Rosé','Sparkling','Dessert','Fortified')),
  varietal text,
  master_varietal text,
  
  -- Origin
  country text,
  region text,
  sub_region text,
  appellation text,
  
  -- Attributes
  abv decimal(4,2),
  
  -- Drinking Window
  begin_consume integer,
  end_consume integer,
  CONSTRAINT valid_window CHECK (begin_consume IS NULL OR end_consume IS NULL OR begin_consume <= end_consume),
  
  -- Ratings (external/critic)
  rating_min integer CHECK (rating_min IS NULL OR (rating_min >= 0 AND rating_min <= 100)),
  rating_max integer CHECK (rating_max IS NULL OR (rating_max >= 0 AND rating_max <= 100)),
  rating_notes text,
  
  -- Additional
  food_pairing text,
  image_url text
);

-- Indexes
CREATE INDEX idx_wines_producer ON wines(producer);
CREATE INDEX idx_wines_vintage ON wines(vintage);
CREATE INDEX idx_wines_type ON wines(type);
CREATE INDEX idx_wines_region ON wines(region);
```

## bottles Table (Detail)

```sql
CREATE TABLE bottles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id uuid NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  
  -- Core
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Physical
  size text DEFAULT '750ml',
  barcode text UNIQUE,
  
  -- Status
  status text NOT NULL DEFAULT 'cellar' 
    CHECK (status IN ('cellar','consumed','gifted','sold','damaged')),
  
  -- Location
  location text,
  bin text,
  
  -- Purchase
  purchase_price decimal(10,2),
  purchase_location text,
  purchase_date date,
  
  -- Value
  price decimal(10,2),
  
  -- Consumption
  consumed_date date,
  my_rating integer CHECK (my_rating IS NULL OR (my_rating >= 0 AND my_rating <= 100)),
  my_notes text,
  
  CONSTRAINT consumed_has_date CHECK (status != 'consumed' OR consumed_date IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_bottles_wine_id ON bottles(wine_id);
CREATE INDEX idx_bottles_status ON bottles(status);
CREATE INDEX idx_bottles_location ON bottles(location);
```

## Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wines_updated_at BEFORE UPDATE ON wines
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bottles_updated_at BEFORE UPDATE ON bottles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```
