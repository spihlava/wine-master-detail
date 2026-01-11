---
description: Hour 4 - Create master-detail layout with generic components and responsive design
---

# Hour 4: Master-Detail UI Layout

## Goal
Create generic layout components and apply premium styling to the wine/bottle interface.



## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [ ] MasterDetailLayout component
- [ ] MasterCard generic component
- [ ] DetailTable generic component
- [ ] Unit tests for generic components

## Testing Checklist
> [!IMPORTANT]
> This checklist must be completed before any of the Success Criteria are met.

- [ ] Generic layouts render correctlys and apply premium styling to the wine/bottle interface.
- [ ] Wine-specific wrappers using generics
- [ ] Responsive design (mobile-first)
- [ ] Dark mode support
- [ ] Screenshot of Master-Detail Layout (Desktop)
- [ ] Screenshot of Master-Detail Layout (Mobile)
- [ ] Screenshot of Dark Mode
- [ ] Screenshot of Dark Mode
- [ ] Test data imported (5+ wines, 20+ bottles)
- [ ] All unit tests pass

## Components to Create

### Generic (`components/generic/`)
```
MasterDetailLayout.tsx - Grid layout (1/3 master, 2/3 detail on desktop)
MasterCard.tsx - Card with title, subtitle, image, fields
MasterSection.tsx - Left column container
DetailSection.tsx - Right column container
DetailTable.tsx - Generic table with headers/rows
StatCard.tsx - Metric display (count, value)
```

### Wine-specific (`components/wine/`)
```
WineCard.tsx - Uses MasterCard with wine data
WineDetail.tsx - Full wine view with MasterDetailLayout
WineStats.tsx - Wine-specific aggregates
```

### 5. Data Seeding
- Create a seed script or UI button to generate:
  - 5+ Wines with varied types/regions
  - 20+ Bottles distributed across wines
  - Varied statuses (In Cellar, Consumed)

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Header / Navigation                                  │
├─────────────────┬───────────────────────────────────┤
│                 │                                   │
│  Master Card    │       Detail Section              │
│  (Wine Info)    │       (Bottles Table)             │
│                 │                                   │
│  ┌───────────┐  │  ┌─────────────────────────────┐  │
│  │  Image    │  │  │  Bottle Table               │  │
│  └───────────┘  │  │  - Row 1                    │  │
│  Name, Vintage  │  │  - Row 2                    │  │
│  Producer       │  │  - Row 3                    │  │
│  Type, Region   │  │                             │  │
│                 │  └─────────────────────────────┘  │
│  Stats Cards    │                                   │
│  [In Cellar]    │                                   │
│  [Value]        │                                   │
│                 │                                   │
└─────────────────┴───────────────────────────────────┘
```

## Responsive Breakpoints
- Mobile: Single column (master above detail)
- Tablet (md): 1/3 + 2/3 grid
- Desktop (lg): 1/3 + 2/3 grid with larger spacing

## Styling Focus
- Glassmorphism cards with subtle backdrop blur
- Wine-themed color gradients
- Smooth hover transitions (200ms)
- Shadow elevation on hover

## Time Box: 60 minutes
