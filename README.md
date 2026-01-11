# Wine Cellar - Master-Detail Application

A wine inventory management system built on the master-detail pattern. Track your wine collection with proper normalization: wines (products) and bottles (your inventory).

## 🍷 Overview

This app solves the problem of wine inventory tracking by properly separating:
- **Wine** (Master): What the wine IS (producer, vintage, ratings)
- **Bottle** (Detail): What YOU have (location, purchase price, your notes)

When you buy a case of 12 bottles, create ONE wine record and TWELVE bottle records.

## ✨ Features

- **Wine Management**: Add, edit, and organize wines by producer, vintage, type, region
- **Bottle Tracking**: Track individual bottles with location, purchase info, and value
- **Status Lifecycle**: Bottles move from cellar → consumed/gifted/sold/damaged
- **Consumption History**: Record your ratings and tasting notes when you drink
- **Drinking Window Alerts**: Know when wines are ready or past their prime
- **Cellar Stats**: See total value, bottle counts, and inventory insights

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **State**: React Query

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Set up database schema (see `.agent/workflows/iteration/hour-1-database-setup.md`)

5. Run the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
wine-master-detail/
├── .agent/                  # Antigravity workflow files
│   ├── SKILL.md            # Project overview
│   ├── RULES.md            # Code quality constraints
│   ├── PROJECT.md          # Progress tracking
│   ├── ARCHITECTURE.md     # System design
│   ├── DOMAIN.md           # Business rules
│   ├── workflows/          # Hour-by-hour development guides
│   └── reference/          # Schema, types, patterns
│
├── src/
│   ├── app/                # Next.js routes
│   ├── components/
│   │   ├── generic/        # Reusable master-detail patterns
│   │   ├── wine/           # Wine-specific components
│   │   ├── bottle/         # Bottle-specific components
│   │   └── ui/             # Base UI components
│   ├── lib/
│   │   ├── db/             # Supabase service layer
│   │   ├── hooks/          # React Query hooks
│   │   ├── types/          # TypeScript + Zod schemas
│   │   └── utils/          # Helpers
│   └── styles/
│
└── supabase/
    └── migrations/         # SQL schema
```

## 📖 Development Workflow

This project uses hour-based iterations. Each workflow in `.agent/workflows/iteration/` is a focused, 60-minute development session:

1. **Hour 1**: Database setup (Supabase schema, types)
2. **Hour 2**: Wine CRUD (service layer, hooks, UI)
3. **Hour 3**: Bottle tracking (detail records, status)
4. **Hour 4**: Master-detail UI (layout, responsive design)
5. **Hour 5**: Status lifecycle (transitions, history)
6. **Hour 6**: Stats & aggregates (dashboard, charts)

## 🏗 Architecture Principles

### 1. Strict Master-Detail Separation
We strictly separate **Product Data** (The Wine) from **Inventory Data** (The Bottle).
- **Master (Wine):** Immutable facts about the product (Producer, Vintage, Varietal, Region). Shared by all bottles.
- **Detail (Bottle):** Mutable state of your specific instance (Location, Purchase Price, Status, Notes).
*Benefit: This normalization prevents data duplication and allows bulk operations (e.g., "Add Case") without redundant data entry.*

### 2. Computed Aggregates & Single Source of Truth
We never store derived data like `bottle_count` or `total_value` in the Wine record.
- **Rule:** Aggregates are calculated on-the-fly from the `bottles` table using SQL `count()` or `sum()`.
*Benefit: Eliminates synchronization bugs where the counter gets out of sync with the actual rows.*

### 3. Server-First Data Flow
Leveraging Next.js App Router and React Server Components (RSC).
- **Read:** Server Components fetch data directly from Supabase (via the service layer) and pass typed props to the UI.
- **Write:** Client Components invoke Server Actions or API routes, which then invalidate the cache.
*Benefit: Reduces client-side JavaScript, improves initial load performance, and simplifies security.*

### 4. End-to-End Type Safety
Trust nothing; validate everything.
- **Database:** PostgreSQL constraints (Foreign Keys, Check Constraints).
- **Boundary:** Zod schemas validate all data entering/leaving the application (DB results, Form inputs).
- **Code:** TypeScript Strict Mode ensures compile-time correctness based on the Zod schemas.

### 5. Domain-Agnostic UI Patterns
We separate the "Shape" of the UI from the "Content" of the domain.
- **Generic Components:** `MasterDetailLayout`, `StatusBadge`, `StatCard` handle the *look*.
- **Domain Wrappers:** `WineCard`, `BottleRow` handle the *data* and pass it to generic components.

## 📜 License

MIT
