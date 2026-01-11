---
description: Hour 3 - Implement bottle tracking with CRUD operations and master-detail integration
---

# Hour 3: Bottle Tracking

## Goal
Implement bottle detail records with CRUD operations and integrate with wine detail page.

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [ ] Add bottles to a wine
- [ ] View all bottles for a wine
- [ ] Edit bottle status/location
- [ ] Delete bottles
- [ ] Consume bottle workflow
- [ ] Bottle count on wine view

## Steps

### 1. Bottle Service (`src/lib/db/bottles.ts`)
- getBottles(wineId)
- addBottle(bottle)
- addMultipleBottles(wineId, count)
- updateBottle(id, updates)
- deleteBottle(id)
- consumeBottle(id, rating, notes)

### 2. Bottle Hooks (`src/lib/hooks/useBottles.ts`)
- useBottles(wineId)
- useAddBottle(wineId)
- useUpdateBottle(wineId)
- useDeleteBottle(wineId)
- useConsumeBottle(wineId)

### 3. Components
- `components/generic/StatusBadge.tsx` - Reusable status display
- `components/bottle/BottleTable.tsx` - Table with all bottles
- `components/bottle/BottleRow.tsx` - Single bottle row
- `components/bottle/ConsumeModal.tsx` - Rating/notes input

### 4. Integration
Update WineDetail to include BottleTable below wine info.

## Key Code Patterns

```typescript
// Consume workflow
const consumeBottle = useConsumeBottle(wineId);
consumeBottle.mutate({ 
  id: bottle.id, 
  rating: 92, 
  notes: "Excellent with steak" 
});
```

## Testing Checklist
> [!IMPORTANT]
> This checklist must be completed before any of the Success Criteria are met.

- [ ] `npm run dev` starts without errorstable

## Testing
- Add bottle → appears in table
- Delete bottle → removed
- Consume → status changes, date set
- Count updates correctly

## Time Box: 60 minutes

## Next: Hour 4 - Master-Detail UI Layout
