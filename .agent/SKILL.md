# Wine Cellar - Master-Detail Application

A wine inventory management system built on the master-detail pattern.
Wine records (masters) represent the product, Bottle records (details) 
represent physical inventory instances.

## When to Use This Skill
- Building or modifying the wine cellar application
- Working with master-detail relationships
- Adding wine/bottle features
- Database schema changes

## Quick Start
1. Read ARCHITECTURE.md to understand the system
2. Read DOMAIN.md to understand wine business rules
3. Check PROJECT.md for current status
4. Use workflows/iteration/hour-N-*.md for structured development

## Key Principles
- Master (Wine) = Product information (immutable reference data)
- Detail (Bottle) = Inventory instance (your personal data)
- Status-driven lifecycle for bottles
- Computed aggregates (never store counts)
- Generic UI components, wine-specific content

## Technology Stack
- Database: Supabase (PostgreSQL)
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Type Validation: Zod
- Code Quality: ESLint, Prettier

## File Structure
```
.agent/
├── SKILL.md                    # This file - main entry point
├── RULES.md                    # Always-on constraints
├── PROJECT.md                  # Session context & progress tracking
├── ARCHITECTURE.md             # Living system design doc
├── DOMAIN.md                   # Wine cellar business rules & data model
├── workflows/
│   └── iteration/
│       ├── hour-1-database-setup.md
│       ├── hour-2-wine-crud.md
│       ├── hour-3-bottle-tracking.md
│       ├── hour-4-master-detail-ui.md
│       ├── hour-5-status-lifecycle.md
│       └── hour-6-stats-aggregates.md
└── reference/
    ├── schema-spec.md
    ├── type-definitions.md
    └── master-detail-pattern.md
```

## Master-Detail Pattern Summary

### Wine (Master Record)
The **product** - what CellarTracker/Vivino would tell you about this wine.
- One record per unique wine (producer + vintage + name)
- Immutable reference data
- Examples: Producer, vintage, region, varietal, ratings, drinking window

### Bottle (Detail Record)  
Your **inventory** - what YOU know about each physical bottle.
- Many records per wine (one per bottle you own/owned)
- Mutable personal data
- Examples: Location, purchase price, your rating, consumption date, status

### Why This Matters
When you buy a case of 2018 Bordeaux:
- ✅ Create 1 wine record
- ✅ Create 12 bottle records

This is proper normalization. CellarTracker duplicates wine data per bottle (bad).
