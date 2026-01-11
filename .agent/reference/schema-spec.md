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

## bottles Table (Detail of Wine / Master of Events)

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
  
  -- Current State (derived from events, cached here for fast queries)
  current_status text NOT NULL DEFAULT 'cellar' 
    CHECK (current_status IN ('cellar','consumed','gifted','sold','damaged')),
  current_location text,
  current_bin text,
  
  -- Purchase Cache (denormalized from first transaction)
  purchase_price decimal(10,2),
  purchase_location text,
  purchase_date date,
  
  -- Current Value
  current_value decimal(10,2),
  
  -- Consumption Cache (denormalized from consuming tasting)
  consumed_date date,
  
  CONSTRAINT consumed_has_date CHECK (current_status != 'consumed' OR consumed_date IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_bottles_wine_id ON bottles(wine_id);
CREATE INDEX idx_bottles_status ON bottles(current_status);
CREATE INDEX idx_bottles_location ON bottles(current_location);
```

---

## Event Tables (Sub-Details of Bottle)

### bottle_transactions (Financial Events)

```sql
CREATE TABLE bottle_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bottle_id uuid NOT NULL REFERENCES bottles(id) ON DELETE CASCADE,
  
  transaction_type text NOT NULL CHECK (transaction_type IN (
    'purchase', 'sale', 'gift_received', 'gift_given', 'valuation'
  )),
  transaction_date date NOT NULL,
  price decimal(10,2),
  counterparty text,  -- Store name, buyer, gift giver/recipient
  notes text,
  
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_transactions_bottle ON bottle_transactions(bottle_id);
CREATE INDEX idx_transactions_type ON bottle_transactions(transaction_type);
CREATE INDEX idx_transactions_date ON bottle_transactions(transaction_date);
```

### bottle_movements (Location Events)

```sql
CREATE TABLE bottle_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bottle_id uuid NOT NULL REFERENCES bottles(id) ON DELETE CASCADE,
  
  from_location text,
  to_location text NOT NULL,
  from_bin text,
  to_bin text,
  moved_at timestamptz NOT NULL DEFAULT now(),
  reason text,  -- 'reorganization', 'temperature', 'accessibility'
  notes text,
  
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_movements_bottle ON bottle_movements(bottle_id);
CREATE INDEX idx_movements_date ON bottle_movements(moved_at);
```

### bottle_tastings (Tasting Events)

```sql
CREATE TABLE bottle_tastings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bottle_id uuid NOT NULL REFERENCES bottles(id) ON DELETE CASCADE,
  
  tasted_at date NOT NULL,
  rating integer CHECK (rating IS NULL OR (rating >= 0 AND rating <= 100)),
  notes text,
  food_pairing text,
  occasion text,  -- 'dinner party', 'anniversary', 'casual'
  
  -- 'sample' = tasted but bottle still in cellar (e.g., Coravin)
  -- 'consumed' = bottle is now empty
  tasting_stage text NOT NULL DEFAULT 'consumed' 
    CHECK (tasting_stage IN ('sample', 'consumed')),
  
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_tastings_bottle ON bottle_tastings(bottle_id);
CREATE INDEX idx_tastings_date ON bottle_tastings(tasted_at);
CREATE INDEX idx_tastings_stage ON bottle_tastings(tasting_stage);
```

---

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

-- Auto-update bottle status when consumed
CREATE OR REPLACE FUNCTION on_tasting_consumed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tasting_stage = 'consumed' THEN
    UPDATE bottles 
    SET current_status = 'consumed', 
        consumed_date = NEW.tasted_at
    WHERE id = NEW.bottle_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasting_consumed_trigger 
AFTER INSERT ON bottle_tastings
FOR EACH ROW EXECUTE FUNCTION on_tasting_consumed();

-- Auto-update bottle location on movement
CREATE OR REPLACE FUNCTION on_bottle_movement()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bottles 
  SET current_location = NEW.to_location, 
      current_bin = NEW.to_bin
  WHERE id = NEW.bottle_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER movement_update_trigger 
AFTER INSERT ON bottle_movements
FOR EACH ROW EXECUTE FUNCTION on_bottle_movement();

-- Auto-update bottle on transaction
CREATE OR REPLACE FUNCTION on_bottle_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on transaction type
  IF NEW.transaction_type = 'sale' THEN
    UPDATE bottles SET current_status = 'sold' WHERE id = NEW.bottle_id;
  ELSIF NEW.transaction_type = 'gift_given' THEN
    UPDATE bottles SET current_status = 'gifted' WHERE id = NEW.bottle_id;
  ELSIF NEW.transaction_type = 'valuation' THEN
    UPDATE bottles SET current_value = NEW.price WHERE id = NEW.bottle_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_update_trigger 
AFTER INSERT ON bottle_transactions
FOR EACH ROW EXECUTE FUNCTION on_bottle_transaction();
```

---

## Entity Relationship

```
wines (1) ──────< bottles (N) ──────< bottle_transactions (N)
                      │
                      ├──────< bottle_movements (N)
                      │
                      └──────< bottle_tastings (N)
```
