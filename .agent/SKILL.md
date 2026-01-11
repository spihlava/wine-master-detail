# Wine Cellar - Master-Detail Application

A wine inventory management system built on the **nested master-detail pattern**.
- Wine records (masters) → product information
- Bottle records (details) → inventory instances  
- Event records (sub-details) → transactions, movements, tastings

## When to Use This Skill
- Building or modifying the wine cellar application
- Working with master-detail relationships
- Adding wine/bottle/event features
- Database schema changes

## Quick Start
1. Read ARCHITECTURE.md to understand the system
2. Read DOMAIN.md to understand wine business rules
3. Check PROJECT.md for current status
4. Use workflows/iteration/hour-N-*.md for structured development

## Key Principles
- **Wine** = Product information (immutable reference data)
- **Bottle** = Inventory instance (your personal data, current state cached)
- **Events** = Audit trail (transactions, movements, tastings → source of truth)
- Computed aggregates (never store counts on parent tables)
- Generic UI components, wine-specific content

## Nested Master-Detail Pattern

```
Wine (Master)
  └─► Bottles (Detail of Wine / Master of Events)
        ├─► Transactions (purchase, sale, gift, valuation)
        ├─► Movements (location/bin tracking over time)
        └─► Tastings (sampling + consumption notes)
```

**Current state cached on bottle** (auto-updated by triggers):
- `current_status`, `current_location`, `current_bin`, `consumed_date`
- Avoids joins for common queries

**Events are source of truth**:
- Full audit trail per bottle
- Financial tracking, location history, tasting progression

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
├── SKILL.md                    # This file
├── RULES.md                    # Always-on constraints
├── PROJECT.md                  # Session context & progress
├── ARCHITECTURE.md             # System design (nested ER diagram)
├── DOMAIN.md                   # Business rules & event logging
├── workflows/iteration/        # Hour-by-hour development
└── reference/
    ├── schema-spec.md          # Full SQL schema with triggers
    ├── type-definitions.md     # Zod schemas for all entities
    └── master-detail-pattern.md
```
