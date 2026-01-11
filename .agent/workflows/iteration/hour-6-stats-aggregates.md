---
description: Hour 6 - Implement computed stats, aggregates, and dashboard
---

# Hour 6: Stats & Aggregates

## Goal
Create computed statistics from bottle data and build a cellar dashboard.

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [ ] useWineStats hook implemented
- [ ] useCellarStats hook implemented
- [ ] Dashboard page created
- [ ] Dashboard components (Overview, Drink Soon, Distribution)
- [ ] Unit tests for stats logic

## Implementation Steps

### 1. Hooks & Logic (`src/lib/hooks/`)
- Create `useWineStats(wineId)`
  - Computes: Total bottles, In Cellar, Consumed, Cellar Value, Avg Rating.
- Create `useCellarStats()`
  - Computes global stats: Total bottles, Total Value, Unique Wines.
  - Aggregates by Type (Red, White, etc.).
  - Filters "Drinking Soon" (end_consume <= current_year + 2).

### 2. Dashboard Components (`src/components/dashboard/`)
- `CellarOverview.tsx`: Grid of `StatCard`s (Total Bottles, Value, etc.).
- `DrinkingSoonList.tsx`: List/Table of wines nearing their drinking window end.
- `TypeDistribution.tsx`: Simple visual (bar or list) showing count by wine type.
- `ValueTrend.tsx` (Optional): Placeholder for future value history.

### 3. Integration (`src/app/page.tsx`)
- Update the home page to be the Dashboard.
- Section 1: Cellar Overview.
- Section 2: Drinking Soon Alerts.
- Section 3: Distribution / Quick Actions.

### 4. Verification
> [!IMPORTANT]
> The following checklist must be completed before marking the hour as done.

- [ ] Dashboard stats match database values
- [ ] Value tracking is accurate (sum of purchase prices)
- [ ] Basic charts/visualizations render
- [ ] Screenshot of Dashboard
- [ ] Screenshot of Drinking Window Alerts
- [ ] All unit tests pass
