# Master-Detail Pattern Reference

## Core Concept

A **master-detail** relationship is a one-to-many association where:
- **Master** = The product/template/definition
- **Detail** = The instance/occurrence/item

## In This Application

| Concept | Master (Wine) | Detail (Bottle) |
|---------|---------------|-----------------|
| Definition | A wine product | A physical bottle you own |
| Cardinality | One per unique wine | Many per wine |
| Mutability | Rarely changes | Frequently changes |
| Data Source | External (Vivino, critics) | Personal (your records) |
| Example | "2018 Château Margaux" | Bottle #1 in bin A3 |

## The Golden Rule

> **Master describes WHAT it is. Detail describes WHAT YOU DO with it.**

### Valid Master (Wine) Fields ✅
- name, producer, vintage
- type, varietal, region
- critic ratings
- drinking window recommendation
- food pairing suggestions

### Valid Detail (Bottle) Fields ✅
- status (cellar/consumed/gifted)
- location, bin
- purchase price, date, location
- YOUR rating, YOUR notes
- consumed date

### NEVER on Master ❌
- bottle_count (aggregate)
- cellar_value (aggregate)
- my_rating (whose? which bottle?)
- location (bottle-level tracking)

### NEVER on Detail ❌
- producer, vintage (duplicate)
- region, country (duplicate)
- Anything that describes the wine itself

## Implementation Pattern

### Data Model
```
wines (1) ──────< bottles (N)
  │                │
  │ id ◄───────── wine_id
  │
  │ Product Data   Instance Data
```

### UI Pattern
```
┌─────────────────┬──────────────────────────┐
│   MASTER VIEW   │      DETAIL VIEW         │
│                 │                          │
│   Wine Card     │   Bottles Table          │
│   - Name        │   - Bottle 1             │
│   - Producer    │   - Bottle 2             │
│   - Vintage     │   - Bottle 3             │
│                 │                          │
│   Stats         │   [Add Bottle]           │
│   - In Cellar   │                          │
│   - Total Value │                          │
└─────────────────┴──────────────────────────┘
```

### Query Pattern
```typescript
// Get master with computed stats from details
const wine = await getWine(id);
const bottles = await getBottles(id);
const stats = computeStats(bottles);

return { wine, bottles, stats };
```

## Why This Matters

### Without Master-Detail (CellarTracker style)
```
// 12 bottles = 12 rows with duplicated wine data
{ id: 1, name: "Margaux", producer: "Château", vintage: 2018, location: "A1" }
{ id: 2, name: "Margaux", producer: "Château", vintage: 2018, location: "A2" }
...
{ id: 12, name: "Margaux", producer: "Château", vintage: 2018, location: "B6" }
```

### With Master-Detail (Our approach)
```
wines: { id: "w1", name: "Margaux", producer: "Château", vintage: 2018 }

bottles:
{ id: "b1", wine_id: "w1", location: "A1" }
{ id: "b2", wine_id: "w1", location: "A2" }
...
{ id: "b12", wine_id: "w1", location: "B6" }
```

### Benefits
1. **Normalization**: Update wine name once, affects all bottles
2. **Clean queries**: "What wines do I own?" is trivial
3. **Bulk operations**: Buy a case = 1 wine + 12 bottles
4. **Aggregates**: Sum, count, avg from bottles, display on wine
5. **Separation**: Reference data vs personal data
