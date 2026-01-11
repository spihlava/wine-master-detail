---
description: Hour 5 - Implement bottle status lifecycle with transitions and history
---

# Hour 5: Status Lifecycle

## Goal
Implement proper status transitions, filtering, and consumption history.



## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [ ] Status transition buttons (consume, gift, sell, damage)
- [ ] Transition validation (only cellar → other)
- [ ] Filter bottles by status
- [ ] Consumption history view
- [ ] Status statistics

## Testing Checklist
> [!IMPORTANT]
> This checklist must be completed before any of the Success Criteria are met.

- [ ] Status transitions obey rules
- [ ] All transition data fields are captured correctly
- [ ] Filtering by status works as expected
- [ ] Consumption history displays all relevant data
- [ ] Status statistics are accurate

## Status Flow
```
cellar → consumed (requires: consumed_date, optional: rating, notes)
       → gifted   (optional: recipient notes)
       → sold     (optional: sale price, buyer)
       → damaged  (optional: reason)
```

## Components
- StatusTransitionMenu - Dropdown with valid transitions
- BottleFilter - Filter by status tabs
- ConsumptionHistory - List of consumed bottles with ratings
- StatusStats - Count by status

## Validation Rules
```typescript
function canTransition(from: BottleStatus, to: BottleStatus): boolean {
  return from === 'cellar' && to !== 'cellar';
}

function getTransitionData(to: BottleStatus) {
  switch (to) {
    case 'consumed':
      return { consumed_date: new Date() };
    default:
      return {};
  }
}
```

## UI Enhancements
- Color-coded status badges
- Transition confirmation modals
- Success toast notifications
- Undo for recent transitions (soft delete pattern)

## Time Box: 60 minutes
