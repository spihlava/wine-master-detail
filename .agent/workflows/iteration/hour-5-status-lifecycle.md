---
description: Hour 5 - Implement bottle status lifecycle with transitions and history
---

# Hour 5: Status Lifecycle

## Goal
Implement proper status transitions, filtering, and consumption history.

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [ ] Status transition logic (cellar -> others only)
- [ ] StatusTransitionMenu component
- [ ] BottleFilter component
- [ ] ConsumptionHistory component
- [ ] Integration with Wine Detail

## Implementation Steps

### 1. Logic & Validation (`src/lib/types/`, `src/lib/db/`)
- Define helper functions in `src/lib/types/bottle.ts` or similar:
  - `canTransition(from, to)`
  - `getTransitionFields(to)` (e.g., date, price)
- Ensure DB service handles status updates correctly (already partially done).

### 2. Components (`src/components/bottle/`)
- Create `StatusTransitionMenu.tsx`
  - Dropdown menu for each bottle row.
  - Disable options based on `canTransition`.
- Create `BottleFilter.tsx`
  - Tab or Pill selector: "All" | "In Cellar" | "History" (Consumed/Sold/etc).
- Create `ConsumptionHistory.tsx`
  - Specialized list view for consumed bottles showing rating/notes primarily.
- Create `StatusStats.tsx`
  - Simple row of counters (Total, Cellar, Consumed).

### 3. UI Integration (`src/components/wine/WineDetail.tsx`)
- Add `BottleFilter` above the `BottleTable`.
- Conditionally render `BottleTable` (active) vs `ConsumptionHistory`.
- Integrate `StatusStats` into the Wine Master Card or dedicated section.

### 4. Verification
> [!IMPORTANT]
> The following checklist must be completed before marking the hour as done.

- [ ] Status transitions obey rules (cannot consume an invalid bottle)
- [ ] All transition data fields are captured correctly
- [ ] Filtering by status works as expected
- [ ] Consumption history displays all relevant data
- [ ] Status statistics are accurate
- [ ] Screenshot of Status Filter
- [ ] Screenshot of Consumption History
- [ ] Screenshot of Status Badge
- [ ] All unit tests pass
