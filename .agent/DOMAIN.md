# Wine Cellar - Domain Model & Business Rules

## Core Entities

### Wine (Master Record)

**Definition:** A unique wine product identified by producer + vintage + name

**Purpose:** Store reference/product information about a wine - the stuff you'd find on Vivino or CellarTracker.

**Attributes:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| name | text | Yes | Wine name (e.g., "Château Margaux") |
| producer | text | No | Winery/producer name |
| vintage | integer | No | Year (1800-2100) |
| type | text | No | Red, White, Rosé, Sparkling, Dessert, Fortified |
| varietal | text | No | Grape variety (e.g., "Cabernet Sauvignon") |
| master_varietal | text | No | Parent varietal category |
| country | text | No | Country of origin |
| region | text | No | Wine region (e.g., "Bordeaux") |
| sub_region | text | No | Sub-region (e.g., "Margaux") |
| appellation | text | No | Specific appellation/AOC |
| abv | decimal | No | Alcohol by volume (%) |
| rating_min | integer | No | Low end of critic ratings (0-100) |
| rating_max | integer | No | High end of critic ratings (0-100) |
| rating_notes | text | No | Notes about ratings/reviews |
| food_pairing | text | No | Suggested food pairings |
| begin_consume | integer | No | Year to start drinking |
| end_consume | integer | No | Year to stop drinking (past prime) |
| image_url | text | No | Wine label image |
| created_at | timestamp | Yes | Record creation time |
| updated_at | timestamp | Yes | Last modification time |

**Invariants:**
- Name is required (cannot be null or empty)
- Vintage must be between 1800-2100 if provided
- Ratings must be 0-100 if provided
- begin_consume <= end_consume if both provided
- type must be one of: Red, White, Rosé, Sparkling, Dessert, Fortified

---

### Bottle (Detail of Wine / Master of Events)

**Definition:** A physical bottle instance of a wine in your inventory

**Purpose:** Track your personal bottle collection. Also serves as the master record for event logging (transactions, movements, tastings).

**Attributes:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | Yes | Primary key |
| wine_id | uuid | Yes | Foreign key to wines table |
| size | text | No | Bottle size (default: "750ml") |
| barcode | text | No | Unique barcode (for scanning) |
| current_status | text | Yes | Current status (default: "cellar") |
| current_location | text | No | Current cellar/storage location |
| current_bin | text | No | Current bin/rack position |
| current_value | decimal | No | Current estimated value |
| purchase_price | decimal | No | What you paid (cached from transaction) |
| purchase_location | text | No | Where you bought it (cached) |
| purchase_date | date | No | When you bought it (cached) |
| consumed_date | date | No | When you drank it (cached from tasting) |
| created_at | timestamp | Yes | Record creation time |
| updated_at | timestamp | Yes | Last modification time |

**Status Values:**
- `cellar` - In storage, available to drink
- `consumed` - You drank it
- `gifted` - Given to someone
- `sold` - Sold to someone
- `damaged` - Broken, corked, or otherwise unusable

**Dual Role:** Bottle is both:
- **Detail** of Wine (many bottles → one wine)
- **Master** of Events (one bottle → many transactions/movements/tastings)

---

## Event Logging (Sub-Details of Bottle)

### Architecture

```
Wine (Master)
  │
  └─► Bottles (Detail of Wine / Master of Events)
        │
        ├─► Transactions (purchase, sale, gift, valuation)
        ├─► Movements (location/bin tracking over time)
        └─► Tastings (sampling + consumption notes)
```

### bottle_transactions

Financial events: purchases, sales, gifts, valuations.

| Field | Type | Description |
|-------|------|-------------|
| transaction_type | text | purchase, sale, gift_received, gift_given, valuation |
| transaction_date | date | When it happened |
| price | decimal | Amount (purchase price, sale price, valuation) |
| counterparty | text | Store, buyer, gift recipient |
| notes | text | Additional notes |

### bottle_movements

Location tracking over time.

| Field | Type | Description |
|-------|------|-------------|
| from_location | text | Previous location (null if first) |
| to_location | text | New location |
| from_bin | text | Previous bin |
| to_bin | text | New bin |
| moved_at | timestamp | When moved |
| reason | text | reorganization, temperature, accessibility |

### bottle_tastings

Tasting notes and consumption records.

| Field | Type | Description |
|-------|------|-------------|
| tasted_at | date | When tasted |
| rating | integer | Your rating (0-100) |
| notes | text | Tasting notes |
| food_pairing | text | What you paired it with |
| occasion | text | dinner party, anniversary, casual |
| tasting_stage | text | `sample` (Coravin) or `consumed` (finished) |

### Event Triggers

Database triggers auto-update bottle state:
- **Tasting with stage=consumed** → Sets `current_status='consumed'`, `consumed_date`
- **Movement inserted** → Updates `current_location`, `current_bin`
- **Transaction sale/gift_given** → Updates `current_status`
- **Transaction valuation** → Updates `current_value`

---

## Status Lifecycle

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    ▼                                         │
              ┌─────────┐                                     │
   Created → │ cellar  │ ─────────────────────────────────────┤
              └────┬────┘                                     │
                   │                                          │
      ┌────────────┼────────────┬────────────┬───────────┐    │
      │            │            │            │           │    │
      ▼            ▼            ▼            ▼           │    │
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │    │
│ consumed │ │  gifted  │ │   sold   │ │ damaged  │      │    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘      │    │
      │            │            │            │           │    │
      └────────────┴────────────┴────────────┴───────────┘    │
                   │                                          │
                   │ (Terminal states - no return)            │
                   └──────────────────────────────────────────┘
```

**How Status Changes:**
- `consumed` ← Insert tasting with `tasting_stage='consumed'`
- `gifted` ← Insert transaction with `transaction_type='gift_given'`
- `sold` ← Insert transaction with `transaction_type='sale'`
- `damaged` ← Direct update (no event, just mark damaged)

---

## Drinking Window Logic

The drinking window indicates when a wine is ready to drink.

```
Timeline:
─────────────────────────────────────────────────────────────────►
     │           │                    │
  vintage    begin_consume        end_consume
     │           │                    │
     └───────────┤ TOO YOUNG          │
                 │                    │
                 ├────────────────────┤ DRINK NOW!
                 │                    │
                 │                    ├──────────────────► PAST PRIME
```

**UI States:**
- `currentYear < begin_consume` → "Too Young (X years to wait)"
- `begin_consume <= currentYear <= end_consume` → "Drink Now!"
- `currentYear > end_consume` → "Past Prime (X years ago)"

---

## Common Queries

### Inventory Queries

**What wines do I own?** (unique products in cellar)
```sql
SELECT DISTINCT w.* 
FROM wines w
JOIN bottles b ON b.wine_id = w.id
WHERE b.status = 'cellar';
```

**What's my total inventory?** (bottles by wine)
```sql
SELECT 
  w.name, 
  w.vintage, 
  w.producer,
  COUNT(b.id) as bottle_count, 
  SUM(b.price) as total_value
FROM wines w
JOIN bottles b ON b.wine_id = w.id
WHERE b.status = 'cellar'
GROUP BY w.id
ORDER BY total_value DESC;
```

**Cellar summary stats**
```sql
SELECT 
  COUNT(*) as total_bottles,
  COUNT(DISTINCT wine_id) as unique_wines,
  SUM(price) as total_value,
  AVG(price) as avg_bottle_value
FROM bottles 
WHERE status = 'cellar';
```

### Drinking Window Queries

**What should I drink soon?** (approaching end of window)
```sql
SELECT w.*, COUNT(b.id) as bottles_available
FROM wines w
JOIN bottles b ON b.wine_id = w.id
WHERE b.status = 'cellar'
  AND w.end_consume IS NOT NULL
  AND w.end_consume <= EXTRACT(YEAR FROM NOW()) + 2
GROUP BY w.id
ORDER BY w.end_consume ASC;
```

**What's ready to drink now?**
```sql
SELECT w.*, COUNT(b.id) as bottles_available
FROM wines w
JOIN bottles b ON b.wine_id = w.id
WHERE b.status = 'cellar'
  AND (w.begin_consume IS NULL OR w.begin_consume <= EXTRACT(YEAR FROM NOW()))
  AND (w.end_consume IS NULL OR w.end_consume >= EXTRACT(YEAR FROM NOW()))
GROUP BY w.id;
```

### History Queries

**What have I drunk from this wine?**
```sql
SELECT * 
FROM bottles
WHERE wine_id = $1 
  AND status = 'consumed'
ORDER BY consumed_date DESC;
```

**My consumption history** (all wines)
```sql
SELECT 
  w.name,
  w.vintage,
  w.producer,
  b.consumed_date,
  b.my_rating,
  b.my_notes
FROM bottles b
JOIN wines w ON w.id = b.wine_id
WHERE b.status = 'consumed'
ORDER BY b.consumed_date DESC;
```

### Location Queries

**What's in a specific location?**
```sql
SELECT w.name, w.vintage, b.*
FROM bottles b
JOIN wines w ON w.id = b.wine_id
WHERE b.status = 'cellar'
  AND b.location = 'Main Cellar'
ORDER BY b.bin;
```

---

## Wine Types Reference

| Type | Description | Example Varietals |
|------|-------------|-------------------|
| Red | Still red wine | Cabernet, Merlot, Pinot Noir |
| White | Still white wine | Chardonnay, Sauvignon Blanc, Riesling |
| Rosé | Pink wine | Provence Rosé, White Zinfandel |
| Sparkling | Bubbles | Champagne, Prosecco, Cava |
| Dessert | Sweet wines | Sauternes, Ice Wine, Tokaji |
| Fortified | High alcohol, spirit added | Port, Sherry, Madeira |

---

## Bottle Sizes Reference

| Size | Volume | Notes |
|------|--------|-------|
| 375ml | Half bottle | Good for single person |
| 750ml | Standard | Default size |
| 1.5L | Magnum | Ages better, great for parties |
| 3L | Double Magnum | Rare, ages excellently |
| 6L | Imperial | Very rare, display piece |

---

## Aggregate Calculations

**IMPORTANT:** These are always computed from bottles, never stored on wines.

### In Application Code
```typescript
interface WineStats {
  total: number;           // All bottles ever owned
  inCellar: number;        // status = 'cellar'
  consumed: number;        // status = 'consumed'
  gifted: number;          // status = 'gifted'
  sold: number;            // status = 'sold'
  damaged: number;         // status = 'damaged'
  cellarValue: number;     // SUM of price where status = 'cellar'
  avgRating: number | null; // AVG of my_rating where my_rating is not null
}

function computeWineStats(bottles: Bottle[]): WineStats {
  const cellarBottles = bottles.filter(b => b.status === 'cellar');
  const ratedBottles = bottles.filter(b => b.my_rating !== null);
  
  return {
    total: bottles.length,
    inCellar: cellarBottles.length,
    consumed: bottles.filter(b => b.status === 'consumed').length,
    gifted: bottles.filter(b => b.status === 'gifted').length,
    sold: bottles.filter(b => b.status === 'sold').length,
    damaged: bottles.filter(b => b.status === 'damaged').length,
    cellarValue: cellarBottles.reduce((sum, b) => sum + (b.price || 0), 0),
    avgRating: ratedBottles.length > 0
      ? ratedBottles.reduce((sum, b) => sum + b.my_rating!, 0) / ratedBottles.length
      : null,
  };
}
```
