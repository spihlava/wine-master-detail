---
description: Hour 4 - Create master-detail layout with generic components and responsive design
---

# Hour 4: Master-Detail UI Layout

## Goal
Create generic layout components and apply premium styling to the wine/bottle interface.

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [ ] MasterDetailLayout generic component
- [ ] MasterCard generic component
- [ ] Detail generic components (Table, Section)
- [ ] Integration with Wine Detail page
- [ ] Responsive design verification

## Implementation Steps

### 1. Generic Layout Components (`src/components/generic/`)
- Create `MasterDetailLayout.tsx`
  - Grid layout: 100% width on mobile, 1/3 - 2/3 split on desktop (lg).
  - Use `main` and `aside` semantic tags.
- Create `MasterCard.tsx`
  - Reusable card for the left column (image, title, subtitles, key fields).
  - Glassmorphism styling (backdrop-blur, border-opacity).
- Create `DetailSection.tsx`
  - Container for right-column content sections.
  - Title header with action buttons.

### 2. Wine Components (`src/components/wine/`)
- Refactor `WineDetail.tsx` to use `MasterDetailLayout`.
- Create `WineMasterCard.tsx`
  - Wrap `MasterCard` with wine specific data mappings.
- Update `WineDetail` to render `BottleTable` inside a `DetailSection`.

### 3. Styling & Micro-interactions
- Apply "Premium" design tokens.
  - Fonts: Inter/Geist (sans), Serif for headers if available.
  - Colors: Wine/Slate palette.
- Add hover effects to cards and rows.
- Transitions: properties `all`, duration `200ms`.

### 4. Data Seeding (Optional but recommended)
- Ensure enough data exists to test scrolling and layout.
- Manual entry of 5+ bottles via the new Add Bottle page.

### 5. Verification
> [!IMPORTANT]
> The following checklist must be completed before marking the hour as done.

- [ ] Generic layouts render correctly
- [ ] Wine-specific wrappers using generics works
- [ ] Responsive design (mobile-first) check
    - [ ] Stacked on Mobile (< 768px)
    - [ ] Split on Desktop (> 1024px)
- [ ] Dark mode support checks
- [ ] Screenshot of Master-Detail Layout (Desktop)
- [ ] Screenshot of Master-Detail Layout (Mobile)
- [ ] Screenshot of Dark Mode
- [ ] Test data present (5+ wines, 20+ bottles)
