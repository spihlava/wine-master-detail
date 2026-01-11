---
description: Hour 6 - Implement computed stats, aggregates, and dashboard
---

# Hour 6: Stats & Aggregates

## Goal
Create computed statistics from bottle data and build a cellar dashboard.

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [ ] useWineStats hook (count, value, avg rating)
- [ ] Cellar overview dashboard
- [ ] Drinking window alerts
- [ ] Value tracking
- [ ] Basic charts/visualizations

## Key Computations

```typescript
interface WineStats {
  total: number;
  inCellar: number;
  consumed: number;
  cellarValue: number;
  avgRating: number | null;
}

interface CellarStats {
  totalBottles: number;
  uniqueWines: number;
  totalValue: number;
  byType: Record<WineType, number>;
  byStatus: Record<BottleStatus, number>;
  drinkingSoon: Wine[];  // end_consume within 2 years
}
```

## useWineStats Hook
```typescript
function useWineStats(wineId: string) {
  const { data: bottles } = useBottles(wineId);
  return useMemo(() => computeStats(bottles || []), [bottles]);
}
```

## Dashboard Components
- CellarOverview - Total stats summary
- DrinkingSoonList - Wines approaching end of window
- TypeDistribution - Pie/bar chart by wine type
- ValueTrend - (Future) Track cellar value over time

## Queries for Dashboard
```sql
-- Cellar summary
SELECT COUNT(*), SUM(price) FROM bottles WHERE status = 'cellar';

-- Drink soon
SELECT w.* FROM wines w
JOIN bottles b ON b.wine_id = w.id
WHERE b.status = 'cellar' 
  AND w.end_consume <= YEAR(NOW()) + 2;

-- By type
SELECT w.type, COUNT(b.id)
FROM wines w JOIN bottles b ON b.wine_id = w.id
WHERE b.status = 'cellar'
GROUP BY w.type;
```

## Time Box: 60 minutes
