---
description: Hour 2 - Implement Wine CRUD operations with service layer, hooks, and basic UI
---

# Hour 2: Wine CRUD Operations

## Goal
Create complete CRUD operations for wine master records with proper service layer, React hooks, and basic UI.

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.
- [x] Wine service layer with getWines, getWine, createWine, updateWine, deleteWine
- [x] React Query hooks for all operations
- [x] Wine list page with search/filter
- [x] Wine detail page showing wine info
- [x] Create wine form
- [x] Edit wine form
- [x] Delete wine confirmation
- [x] All operations type-safe with Zod validation
- [x] Unit tests for Zod schemas
- [x] Unit tests for WineForm component

## Testing Checklist
> [!IMPORTANT]
> This checklist must be completed before any of the Success Criteria are met.

- [x] `npm run dev` starts without errors
- [x] Wine list shows all wines from database
- [x] Can create a new wine (form validates, saves to DB)
- [x] Wine appears in list after creation
- [x] Can click wine to view details
- [x] Can edit wine and changes persist
- [x] Can delete wine and it's removed from list
- [x] Error states handled (loading, error messages)
- [x] TypeScript compiles without errors
- [x] ESLint passes
- [x] All unit tests pass

## Prerequisites
- Hour 1 completed (database schema)
- Supabase connection working
- TypeScript types and Zod schemas created

## Implementation Steps

### 1. Create Wine Service Layer

Create `src/lib/db/wines.ts`:

```typescript
import { supabase } from './supabase';
import { wineSchema, wineInsertSchema, type Wine, type WineInsert, type WineUpdate } from '../types/wine';

export class WineNotFoundError extends Error {
  constructor(id: string) {
    super(`Wine with id ${id} not found`);
    this.name = 'WineNotFoundError';
  }
}

export async function getWines(): Promise<Wine[]> {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => wineSchema.parse(row));
}

export async function getWine(id: string): Promise<Wine> {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') throw new WineNotFoundError(id);
    throw error;
  }
  
  return wineSchema.parse(data);
}

export async function createWine(wine: WineInsert): Promise<Wine> {
  // Validate before sending to database
  const validated = wineInsertSchema.parse(wine);
  
  const { data, error } = await supabase
    .from('wines')
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return wineSchema.parse(data);
}

export async function updateWine(id: string, updates: WineUpdate): Promise<Wine> {
  const { data, error } = await supabase
    .from('wines')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') throw new WineNotFoundError(id);
    throw error;
  }
  
  return wineSchema.parse(data);
}

export async function deleteWine(id: string): Promise<void> {
  const { error } = await supabase
    .from('wines')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Search wines by name, producer, or region
export async function searchWines(query: string): Promise<Wine[]> {
  const { data, error } = await supabase
    .from('wines')
    .select('*')
    .or(`name.ilike.%${query}%,producer.ilike.%${query}%,region.ilike.%${query}%`)
    .order('name', { ascending: true });

  if (error) throw error;
  return data.map(row => wineSchema.parse(row));
}
```

### 2. Create React Query Provider

Create `src/lib/providers/query-provider.tsx`:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

Update `src/app/layout.tsx` to include QueryProvider.

### 3. Create Wine Hooks

Create `src/lib/hooks/useWines.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getWines, searchWines } from '../db/wines';

export function useWines() {
  return useQuery({
    queryKey: ['wines'],
    queryFn: getWines,
  });
}

export function useSearchWines(query: string) {
  return useQuery({
    queryKey: ['wines', 'search', query],
    queryFn: () => searchWines(query),
    enabled: query.length > 0,
  });
}
```

Create `src/lib/hooks/useWine.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWine, createWine, updateWine, deleteWine } from '../db/wines';
import type { WineInsert, WineUpdate } from '../types/wine';

export function useWine(id: string) {
  return useQuery({
    queryKey: ['wine', id],
    queryFn: () => getWine(id),
    enabled: !!id,
  });
}

export function useCreateWine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (wine: WineInsert) => createWine(wine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines'] });
    },
  });
}

export function useUpdateWine(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: WineUpdate) => updateWine(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines'] });
      queryClient.invalidateQueries({ queryKey: ['wine', id] });
    },
  });
}

export function useDeleteWine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteWine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines'] });
    },
  });
}
```

### 4. Create Base UI Components

Create `src/lib/utils/cn.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install clsx: `npm install clsx tailwind-merge`

Create basic UI components in `src/components/ui/`:
- Button.tsx
- Input.tsx
- Select.tsx
- Card.tsx

### 5. Create Wine List Page

Create `src/app/wines/page.tsx`:

```typescript
import { WineList } from '@/components/wine/WineList';

export default function WinesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Wine Collection</h1>
        <a
          href="/wines/new"
          className="bg-wine-600 text-white px-4 py-2 rounded-lg hover:bg-wine-700"
        >
          Add Wine
        </a>
      </div>
      <WineList />
    </main>
  );
}
```

Create `src/components/wine/WineList.tsx`:

```typescript
'use client';

import { useWines } from '@/lib/hooks/useWines';
import { WineCard } from './WineCard';

export function WineList() {
  const { data: wines, isLoading, error } = useWines();

  if (isLoading) return <div>Loading wines...</div>;
  if (error) return <div>Error loading wines</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wines?.map((wine) => (
        <WineCard key={wine.id} wine={wine} />
      ))}
      {wines?.length === 0 && (
        <p className="text-gray-500 col-span-full text-center">
          No wines yet. Add your first wine!
        </p>
      )}
    </div>
  );
}
```

### 6. Create Wine Card Component

Create `src/components/wine/WineCard.tsx`:

```typescript
import Link from 'next/link';
import type { Wine } from '@/lib/types/wine';

export function WineCard({ wine }: { wine: Wine }) {
  return (
    <Link href={`/wines/${wine.id}`}>
      <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{wine.name}</h2>
            {wine.producer && (
              <p className="text-gray-600">{wine.producer}</p>
            )}
          </div>
          {wine.vintage && (
            <span className="text-2xl font-light text-wine-600">
              {wine.vintage}
            </span>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {wine.type && (
            <span className="px-2 py-1 bg-wine-100 text-wine-800 rounded text-sm">
              {wine.type}
            </span>
          )}
          {wine.region && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              {wine.region}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
```

### 7. Create Wine Detail Page

Create `src/app/wines/[id]/page.tsx`:

```typescript
import { WineDetail } from '@/components/wine/WineDetail';

export default function WineDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <WineDetail wineId={params.id} />
    </main>
  );
}
```

### 8. Create Wine Form

Create `src/components/wine/WineForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateWine, useUpdateWine } from '@/lib/hooks/useWine';
import type { Wine, WineInsert, WineType } from '@/lib/types/wine';

interface WineFormProps {
  wine?: Wine;
}

const WINE_TYPES: WineType[] = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];

export function WineForm({ wine }: WineFormProps) {
  const router = useRouter();
  const createWine = useCreateWine();
  const updateWine = useUpdateWine(wine?.id || '');
  
  const [formData, setFormData] = useState<Partial<WineInsert>>({
    name: wine?.name || '',
    producer: wine?.producer || '',
    vintage: wine?.vintage || null,
    type: wine?.type || null,
    varietal: wine?.varietal || '',
    country: wine?.country || '',
    region: wine?.region || '',
    // ... other fields
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (wine) {
        await updateWine.mutateAsync(formData);
      } else {
        await createWine.mutateAsync(formData as WineInsert);
      }
      router.push('/wines');
    } catch (error) {
      console.error('Error saving wine:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Wine Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wine-500 focus:ring-wine-500"
        />
      </div>

      {/* Producer field */}
      {/* Vintage field */}
      {/* Type select */}
      {/* ... other fields ... */}

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-wine-600 text-white px-6 py-2 rounded-lg hover:bg-wine-700"
        >
          {wine ? 'Update Wine' : 'Add Wine'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

### 9. Create New Wine Page

Create `src/app/wines/new/page.tsx`:

```typescript
import { WineForm } from '@/components/wine/WineForm';

export default function NewWinePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Wine</h1>
      <WineForm />
    </main>
  );
}
```

### 10. Configure Tailwind Colors

Update `tailwind.config.ts` to add wine color palette:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7794',
          500: '#df4d70',
          600: '#c92d56',
          700: '#a82347',
          800: '#8b2040',
          900: '#761e3b',
          950: '#420c1c',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
```

Install forms plugin: `npm install -D @tailwindcss/forms`



## Deliverables
- Complete wine service layer
- All wine CRUD hooks
- Wine list page with cards
- Wine detail page
- Create/edit wine form
- Tailwind wine color palette

## Time Box
60 minutes

## Next Hour

## Test Implementation
### 11. Implemented Unit Tests
- `src/lib/types/__tests__/wine.test.ts`: Verifies Zod schemas for validation logic (required fields, optional fields, constraints).
- `src/components/wine/__tests__/WineForm.test.tsx`: Verifies form rendering, validation messaging, and submissions using mocked hooks.
- `src/lib/db/__tests__/wines.test.ts`: Verifies Wine Service layer (`getWines`, `getWine`, `createWine`) using mocked Supabase client.
- Updated `Input` and `Select` components to ensure accessibility by properly linking labels to controls.

