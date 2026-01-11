# Wine Cellar - Project Status

## Current Iteration
**Hour:** 0 (Project Setup)  
**Goal:** Create project structure and Antigravity workflow files  
**Started:** 2026-01-11  
**Status:** In Progress

---

## Iteration Roadmap

### Hour 0: Project Setup ⏳
- [x] Initialize repository
- [ ] Create Antigravity workflow files
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Supabase client
- [ ] Configure ESLint and Prettier

### Hour 1: Database Setup
- [ ] Create wines table with schema
- [ ] Create bottles table with schema
- [ ] Add indexes and constraints
- [ ] Set up Supabase TypeScript types
- [ ] Create Zod validation schemas

### Hour 2: Wine CRUD
- [ ] Wine service layer (lib/db/wines.ts)
- [ ] Wine hooks (useWine, useWines)
- [ ] Wine list page
- [ ] Wine form (create/edit)
- [ ] Wine detail page shell

### Hour 3: Bottle Tracking
- [ ] Bottle service layer (lib/db/bottles.ts)
- [ ] Bottle hooks (useBottles, useAddBottle, etc.)
- [ ] Bottle table component
- [ ] Add/edit bottle modal
- [ ] Integrate with wine detail page

### Hour 4: Master-Detail UI
- [ ] Generic MasterDetailLayout component
- [ ] Generic MasterCard component
- [ ] Generic DetailTable component
- [ ] Wine-specific implementations
- [ ] Responsive design polish

### Hour 5: Status Lifecycle
- [ ] Status badge component
- [ ] Status transition actions
- [ ] Consume bottle workflow
- [ ] Consumption history view
- [ ] Status filtering

### Hour 6: Stats & Aggregates
- [ ] useWineStats hook
- [ ] Cellar overview dashboard
- [ ] Drinking window alerts
- [ ] Value tracking
- [ ] Charts/visualizations

---

## Technical Decisions Log

### 2026-01-11 - Master-Detail Table Design
**Context:** CellarTracker duplicates wine data per bottle (denormalized)  
**Decision:** Separate wines (master) and bottles (detail) tables  
**Rationale:** 
- Proper normalization
- Bulk operations are natural (buy case = 1 wine + 12 bottles)
- Clean aggregates (count bottles, sum values)
- Update wine info once, affects all bottles

### 2026-01-11 - Technology Stack Selection
**Context:** Need modern full-stack with good DX  
**Decision:** Next.js 14 + Supabase + TypeScript + Tailwind  
**Rationale:**
- Next.js App Router for SSR and good React patterns
- Supabase for PostgreSQL + real-time + auth (future)
- TypeScript strict mode for type safety
- Tailwind for rapid UI development with design consistency

### 2026-01-11 - Generic vs Wine-Specific Components
**Context:** Should components be generic or domain-specific?  
**Decision:** Generic bones, wine-specific content  
**Rationale:**
- `components/generic/` has reusable master-detail patterns
- `components/wine/` wraps generic with wine data
- Patterns emerge naturally, not forced upfront
- Can extract to shared library later if needed

---

## Known Issues

*None yet - project just started*

---

## Questions for Future Sessions

- [ ] Multi-user support: How to handle when adding auth?
- [ ] Wine source sync: API integration with Vivino/CellarTracker?
- [ ] Barcode scanning: PWA camera access or native app needed?
- [ ] Multiple cellars: Add locations table or handle in bottle.location?
- [ ] Import/export: CSV format for bulk operations?

---

## Environment Setup

### Required Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

---

## Session Notes

### 2026-01-11 - Initial Planning
- Discussed master-detail pattern with LLM
- Designed wines/bottles schema
- Created Antigravity workflow structure
- Ready to begin Hour 0 setup
