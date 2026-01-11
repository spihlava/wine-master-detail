# Wine Cellar - System Architecture

## Overview

This is a master-detail inventory management application for wine collections. The architecture emphasizes:

1. **Clear domain boundaries** - Wine (product) vs Bottle (instance)
2. **Type safety throughout** - TypeScript strict mode + Zod validation
3. **Generic patterns, specific content** - Reusable UI patterns wrapped with wine domain
4. **Server-first approach** - Next.js App Router with server components

---

## Data Model

### Entity Relationship

```
┌─────────────────────────────────────────┐
│                 WINES                    │
│  (Master Records)                        │
├─────────────────────────────────────────┤
│  id              uuid PK                 │
│  name            text NOT NULL           │
│  producer        text                    │
│  vintage         integer                 │
│  type            text                    │
│  varietal        text                    │
│  country         text                    │
│  region          text                    │
│  ...other reference fields...           │
│  created_at      timestamptz            │
│  updated_at      timestamptz            │
└─────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────────┐
│                BOTTLES                   │
│  (Detail Records)                        │
├─────────────────────────────────────────┤
│  id              uuid PK                 │
│  wine_id         uuid FK → wines(id)    │
│  size            text                    │
│  status          text NOT NULL           │
│  location        text                    │
│  bin             text                    │
│  purchase_price  decimal                 │
│  my_rating       integer                 │
│  my_notes        text                    │
│  ...other instance fields...            │
│  created_at      timestamptz            │
│  updated_at      timestamptz            │
└─────────────────────────────────────────┘
```

### Key Design Principle

| Question | Master (Wine) | Detail (Bottle) |
|----------|---------------|-----------------|
| What is it? | ✅ Yes | ❌ No |
| Where did I buy it? | ❌ No | ✅ Yes |
| What does the critic say? | ✅ Yes | ❌ No |
| What do I think? | ❌ No | ✅ Yes |
| How many do I have? | ❌ No (compute) | ✅ Source of truth |

---

## Application Structure

```
wine-master-detail/
├── .agent/                      # Antigravity workflow files
│   ├── SKILL.md
│   ├── RULES.md
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md         # This file
│   ├── DOMAIN.md
│   ├── workflows/
│   │   └── iteration/
│   └── reference/
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing/dashboard
│   │   ├── wines/
│   │   │   ├── page.tsx        # Wine list
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Create wine form
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Wine detail + bottles
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit wine form
│   │   └── bottles/
│   │       └── [id]/
│   │           └── page.tsx    # Bottle detail (if needed)
│   │
│   ├── components/
│   │   ├── generic/            # Domain-agnostic patterns
│   │   │   ├── MasterDetailLayout.tsx
│   │   │   ├── MasterCard.tsx
│   │   │   ├── DetailTable.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatCard.tsx
│   │   │
│   │   ├── wine/               # Wine-specific components
│   │   │   ├── WineCard.tsx
│   │   │   ├── WineForm.tsx
│   │   │   ├── WineList.tsx
│   │   │   └── DrinkingWindowBadge.tsx
│   │   │
│   │   ├── bottle/             # Bottle-specific components
│   │   │   ├── BottleTable.tsx
│   │   │   ├── BottleRow.tsx
│   │   │   ├── BottleForm.tsx
│   │   │   └── ConsumeModal.tsx
│   │   │
│   │   └── ui/                 # Base UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       └── Card.tsx
│   │
│   ├── lib/
│   │   ├── db/                 # Database service layer
│   │   │   ├── supabase.ts     # Supabase client setup
│   │   │   ├── wines.ts        # Wine CRUD operations
│   │   │   └── bottles.ts      # Bottle CRUD operations
│   │   │
│   │   ├── hooks/              # React hooks
│   │   │   ├── useWine.ts
│   │   │   ├── useWines.ts
│   │   │   ├── useBottles.ts
│   │   │   ├── useWineStats.ts
│   │   │   └── useDrinkingWindow.ts
│   │   │
│   │   ├── types/              # TypeScript types + Zod schemas
│   │   │   ├── wine.ts
│   │   │   ├── bottle.ts
│   │   │   └── common.ts
│   │   │
│   │   └── utils/              # Utility functions
│   │       ├── format.ts       # Date, currency formatting
│   │       ├── cn.ts           # Tailwind class merging
│   │       └── supabase-helpers.ts
│   │
│   └── styles/
│       └── globals.css         # Tailwind + custom styles
│
├── public/                     # Static assets
│   └── images/
│
├── supabase/
│   └── migrations/             # Database migrations
│       ├── 001_create_wines.sql
│       └── 002_create_bottles.sql
│
├── .env.local                  # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Data Flow

### Read Path (Server Component)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Server Component │────►│  Service Layer   │────►│    Supabase      │
│  (wines/[id])    │     │  (lib/db/wines)  │     │    Database      │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        │
         │                        ▼
         │               ┌──────────────────┐
         │               │  Zod Validation  │
         │               │  (parse response)│
         │               └──────────────────┘
         │                        │
         ▼                        ▼
┌──────────────────────────────────────────────┐
│              Typed Component Props            │
│     wine: Wine, bottles: Bottle[]            │
└──────────────────────────────────────────────┘
```

### Write Path (Client Component)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Client Component │────►│   React Hook     │────►│  Service Layer   │
│ (Form submit)    │     │  (useMutation)   │     │  (lib/db/wines)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Zod Validation  │     │ Optimistic Update│     │    Supabase      │
│  (client-side)   │     │ (React Query)    │     │    Database      │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Invalidate    │
                         │   Query Cache    │
                         └──────────────────┘
```

---

## Type System

### Layered Type Safety

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (Supabase)                          │
│  Tables with CHECK constraints                                  │
│  - wines.type CHECK IN ('Red', 'White', ...)                   │
│  - bottles.status CHECK IN ('cellar', 'consumed', ...)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ZOD SCHEMAS                                   │
│  Runtime validation at I/O boundaries                           │
│  - wineSchema.parse(row)                                        │
│  - bottleInsertSchema.parse(formData)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TYPESCRIPT TYPES                              │
│  Compile-time checking                                          │
│  - type Wine = z.infer<typeof wineSchema>                      │
│  - function WineCard({ wine }: { wine: Wine })                 │
└─────────────────────────────────────────────────────────────────┘
```

### Example Type Definition

```typescript
// lib/types/wine.ts
import { z } from 'zod';

export const wineTypeEnum = z.enum([
  'Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'
]);

export const wineSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  producer: z.string().nullable(),
  vintage: z.number().int().min(1800).max(2100).nullable(),
  type: wineTypeEnum.nullable(),
  varietal: z.string().nullable(),
  master_varietal: z.string().nullable(),
  country: z.string().nullable(),
  region: z.string().nullable(),
  sub_region: z.string().nullable(),
  appellation: z.string().nullable(),
  abv: z.number().nullable(),
  rating_min: z.number().int().min(0).max(100).nullable(),
  rating_max: z.number().int().min(0).max(100).nullable(),
  rating_notes: z.string().nullable(),
  food_pairing: z.string().nullable(),
  begin_consume: z.number().int().nullable(),
  end_consume: z.number().int().nullable(),
  image_url: z.string().url().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Wine = z.infer<typeof wineSchema>;
export type WineType = z.infer<typeof wineTypeEnum>;

// For inserts - id and timestamps omitted
export const wineInsertSchema = wineSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type WineInsert = z.infer<typeof wineInsertSchema>;
```

---

## Component Architecture

### Generic vs Wine-Specific

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENERIC COMPONENTS                           │
│  components/generic/                                            │
│                                                                 │
│  - Know about "master" and "detail" concepts                   │
│  - Accept generic props (title, subtitle, fields, items)       │
│  - Handle layout, spacing, responsiveness                       │
│  - NO wine-specific logic or types                             │
│                                                                 │
│  Example:                                                       │
│  <MasterCard                                                    │
│    title={string}                                               │
│    subtitle={string}                                            │
│    image={string}                                               │
│    fields={Array<{label, value}>}                              │
│  />                                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ uses
┌─────────────────────────────────────────────────────────────────┐
│                    WINE COMPONENTS                              │
│  components/wine/                                               │
│                                                                 │
│  - Know about Wine and Bottle types                            │
│  - Transform domain data to generic props                      │
│  - Handle wine-specific UI (drinking window, ratings)          │
│  - Import from generic/ and wrap with wine logic               │
│                                                                 │
│  Example:                                                       │
│  function WineCard({ wine }: { wine: Wine }) {                 │
│    return (                                                     │
│      <MasterCard                                                │
│        title={wine.name}                                        │
│        subtitle={`${wine.producer} - ${wine.vintage}`}         │
│        image={wine.image_url}                                   │
│        fields={[                                                │
│          { label: 'Type', value: wine.type },                  │
│          { label: 'Region', value: wine.region },              │
│        ]}                                                       │
│      />                                                         │
│    );                                                           │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

### Server State (React Query)

```typescript
// Fetching
const { data: wine, isLoading, error } = useQuery({
  queryKey: ['wine', wineId],
  queryFn: () => getWine(wineId),
});

// Mutations with optimistic updates
const mutation = useMutation({
  mutationFn: updateBottleStatus,
  onMutate: async (newData) => {
    // Optimistically update cache
    await queryClient.cancelQueries({ queryKey: ['bottles', wineId] });
    const previous = queryClient.getQueryData(['bottles', wineId]);
    queryClient.setQueryData(['bottles', wineId], (old) => /* update */);
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['bottles', wineId], context?.previous);
  },
  onSettled: () => {
    // Refetch after settlement
    queryClient.invalidateQueries({ queryKey: ['bottles', wineId] });
  },
});
```

### No Global State

- All shared state comes from server (fetched with React Query)
- Local UI state (modals, forms) uses useState
- No Redux, Zustand, or other global stores needed

---

## Error Handling Strategy

### Database Errors
```typescript
// lib/db/wines.ts
export async function getWine(id: string): Promise<Wine | null> {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new DatabaseError(error.message, error.code);
  }
  
  return wineSchema.parse(data);
}
```

### Validation Errors
```typescript
// Show form field errors from Zod
const result = wineInsertSchema.safeParse(formData);
if (!result.success) {
  return { errors: result.error.flatten().fieldErrors };
}
```

### UI Error Boundaries
```typescript
// app/wines/[id]/error.tsx
export default function WineError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong loading this wine</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Performance Considerations

### Database Indexes
```sql
-- Primary indexes (automatic)
-- wines.id, bottles.id

-- Foreign key index
CREATE INDEX idx_bottles_wine_id ON bottles(wine_id);

-- Query optimization indexes
CREATE INDEX idx_bottles_status ON bottles(status);
CREATE INDEX idx_wines_producer ON wines(producer);
CREATE INDEX idx_wines_vintage ON wines(vintage);
CREATE INDEX idx_wines_type ON wines(type);
```

### React Query Caching
- Wine list cached with stale time of 5 minutes
- Individual wines cached until mutated
- Bottles invalidated when any bottle in the wine changes

### Image Optimization
- Use Next.js Image component for wine labels
- Supabase Storage or external CDN for images
- Lazy loading for wine list thumbnails

---

## Security Considerations

### Current (No Auth)
- All data public
- Single user/browser assumed
- Supabase anon key in client

### Future (With Auth)
- Supabase Auth for authentication
- Row Level Security (RLS) policies
- Add user_id to bottles table (wines could be shared reference)

```sql
-- Future RLS example
ALTER TABLE bottles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own bottles"
  ON bottles FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Styling Approach

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          // ... deep reds for primary
          900: '#4a0d1c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

### Component Styling Pattern

```typescript
// Using cn() for conditional classes
import { cn } from '@/lib/utils/cn';

function StatusBadge({ status }: { status: BottleStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-green-100 text-green-800': status === 'cellar',
          'bg-gray-100 text-gray-800': status === 'consumed',
          'bg-blue-100 text-blue-800': status === 'gifted',
          'bg-yellow-100 text-yellow-800': status === 'sold',
          'bg-red-100 text-red-800': status === 'damaged',
        }
      )}
    >
      {status}
    </span>
  );
}
```
