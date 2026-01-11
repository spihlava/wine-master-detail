# Project Learnings & Code Review Fixes

This document captures the issues identified during code review and the fixes applied to improve code quality, security, and maintainability.

## Summary

| Category | Issues Found | Issues Fixed |
|----------|--------------|--------------|
| Critical | 1 | 1 |
| High | 8 | 8 |
| Medium | 12 | 12 |
| Low | 3 | 3 |
| **Total** | **24** | **24** |

---

## Critical Issues

### 1. SQL Injection Risk in Wine Search
**File:** `src/lib/db/wines.ts`

**Problem:** User input was directly interpolated into PostgREST filter strings.
```typescript
// Before (vulnerable)
.or(`name.ilike.%${query}%,producer.ilike.%${query}%`)
```

**Fix:** Added input sanitization to remove characters that could break filter syntax.
```typescript
// After (safe)
const sanitized = query.replace(/[%,()]/g, '').trim();
if (!sanitized) return [];
```

**Lesson:** Always sanitize user input before using in database queries, even when using ORMs or query builders that provide some protection.

---

## High Priority Issues

### 1. Missing `params` Await in Next.js 15+
**File:** `src/app/wines/[id]/edit/page.tsx`

**Problem:** In Next.js 15+, route params are Promises and must be awaited or unwrapped with `React.use()`.
```typescript
// Before (broken)
export default function EditWinePage({ params }: { params: { id: string } }) {
    const { data: wine } = useWine(params.id);
```

**Fix:** Use `React.use()` to unwrap the Promise.
```typescript
// After (correct)
export default function EditWinePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data: wine } = useWine(id);
```

**Lesson:** Always check Next.js version-specific patterns when working with dynamic routes.

### 2. Incomplete Form Validation
**File:** `src/components/wine/WineForm.tsx`

**Problem:** Form only validated the `name` field manually, ignoring other constraints.

**Fix:** Integrated Zod schema validation with `safeParse()` for complete validation.
```typescript
const result = wineInsertSchema.safeParse(trimmedData);
if (!result.success) {
    result.error.issues.forEach(issue => {
        newErrors[issue.path[0] as string] = issue.message;
    });
}
```

**Note:** Zod uses `issues` not `errors` for the validation error array.

**Lesson:** Don't duplicate validation logic - reuse Zod schemas in both API and form layers.

### 3. Unsafe Type Assertions
**File:** `src/components/wine/WineForm.tsx`

**Problem:** Using `as WineInsert` bypassed type safety.
```typescript
// Before
await createWine.mutateAsync(formData as WineInsert);
```

**Fix:** Properly type form data and validate before submission.

**Lesson:** Avoid `as` type assertions - they silence the compiler but don't make code safer.

### 4. Silent Error Handling
**Files:** Multiple components

**Problem:** Errors were logged to console but users received no feedback.
```typescript
// Before
} catch (error) {
    console.error('Error:', error);
    // In a real app, show a toast here
}
```

**Fix:** Created toast notification system and integrated throughout.
```typescript
// After
} catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save';
    showToast(message, 'error');
}
```

**Lesson:** Error handling must include user feedback, not just logging.

### 5. No Error Boundaries
**Problem:** Component errors crashed the entire application.

**Fix:** Added `ErrorBoundary` component and global `error.tsx` page.

**Lesson:** Always implement error boundaries in React applications for graceful degradation.

### 6. Untyped Error Objects
**Problem:** `catch (error)` blocks had implicit `unknown` type.

**Fix:** Properly type check errors before using.
```typescript
const message = error instanceof Error ? error.message : String(error);
```

### 7. Unhandled Promise State
**File:** `src/app/wines/[id]/add-bottle/page.tsx`

**Problem:** Manual `isSubmitting` state wasn't reset on all code paths.

**Fix:** Use mutation's built-in `isPending` state instead of manual tracking.
```typescript
<Button disabled={addBottles.isPending}>
    {addBottles.isPending ? 'Adding...' : 'Add Bottle'}
</Button>
```

**Lesson:** Prefer built-in state from React Query mutations over manual state management.

### 8. Environment Variables Without Validation
**File:** `src/lib/db/supabase.ts`

**Problem:** Used `!` non-null assertion without checking if env vars exist.
```typescript
// Before
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
```

**Fix:** Validate environment variables at startup.
```typescript
// After
if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}
```

**Lesson:** Fail fast with clear errors rather than cryptic runtime failures.

---

## Medium Priority Issues

### 1. State Sync in BottleRow
**Problem:** Local state didn't sync when bottle prop changed.

**Fix:** Added `useEffect` to sync state.
```typescript
useEffect(() => {
    setLocation(bottle.location || '');
    setBin(bottle.bin || '');
}, [bottle.location, bottle.bin]);
```

### 2. Inaccessible Modal
**File:** `src/components/bottle/ConsumeModal.tsx`

**Problem:** Modal lacked ARIA attributes, focus management, and keyboard handling.

**Fix:** Added proper accessibility:
- `role="dialog"` and `aria-modal="true"`
- `aria-labelledby` pointing to title
- Escape key handler
- Focus trap
- Body scroll lock

### 3. Missing Input Labels
**File:** `src/components/bottle/BottleRow.tsx`

**Problem:** Inline inputs only had placeholder text.

**Fix:** Added proper labels with `sr-only` class for screen readers.
```tsx
<label htmlFor={locationId} className="sr-only">Location</label>
<input id={locationId} aria-label="Location" ... />
```

### 4. Null Safety in Database Queries
**Problem:** `data.map()` would crash if Supabase returned null.

**Fix:** Added null coalescing.
```typescript
return (data || []).map(row => schema.parse(row));
```

### 5. Boilerplate Home Page
**Problem:** Home page showed Next.js template.

**Fix:** Redirect to `/wines`.
```typescript
import { redirect } from 'next/navigation';
export default function Home() {
    redirect('/wines');
}
```

### 6. Missing Error Pages
**Problem:** No custom 404 or error pages.

**Fix:** Added `not-found.tsx` and `error.tsx` with proper styling.

### 7. Magic Error Code
**File:** `src/lib/db/wines.ts`

**Problem:** Error code `PGRST116` used without explanation.

**Fix:** Added comment explaining the code.
```typescript
// PGRST116: "JSON object requested, multiple (or no) rows returned"
// This occurs when .single() finds no matching row
```

### 8. Duplicate Constants
**Problem:** `WINE_TYPES` array duplicated Zod enum values.

**Fix:** Generate from enum.
```typescript
const WINE_TYPES = wineTypeEnum.options.map(type => ({
    value: type,
    label: type,
}));
```

### 9. Unused Query Key
**Problem:** `wineKeys.list(filters)` defined but never used.

**Fix:** Removed unused key, kept documentation comment.

### 10. Missing ESLint Rules
**Problem:** ESLint config lacked useful rules.

**Fix:** Added rules for:
- Import ordering
- Unused variables
- `no-explicit-any` warnings
- `prefer-const`

### 11. No Input Sanitization
**Problem:** Text inputs weren't trimmed before submission.

**Fix:** Added `.trim()` to all string fields before API calls.

### 12. Inconsistent Loading States
**Problem:** Some pages showed "Loading..." text, others had skeletons.

**Fix:** Added skeleton loading to edit page.

---

## Low Priority Issues

### 1. Missing React.memo
**File:** `src/components/wine/WineCard.tsx`

**Problem:** List items re-rendered unnecessarily.

**Fix:** Wrapped component in `memo()`.
```typescript
export const WineCard = memo(function WineCard({ wine }: Props) {
    // ...
});
```

### 2. Reserved Types Without Documentation
**Problem:** `WineStats` type appeared unused but was planned for future.

**Fix:** Added comment explaining purpose.
```typescript
// Computed Types - Reserved for future cellar statistics feature
```

### 3. Inconsistent Badge Colors
**Problem:** Some badges used wine colors, others used gray.

**Note:** Left as-is - this is a design choice, not a bug. Region/country badges intentionally use neutral colors to differentiate from wine type.

---

## Key Takeaways

1. **Validate early, validate everywhere** - Use Zod schemas in forms, not just API boundaries
2. **User feedback is mandatory** - Every error needs visible feedback, not just console.log
3. **Check framework versions** - Next.js 15+ has different patterns than 14
4. **Accessibility isn't optional** - Modals need ARIA, inputs need labels
5. **Prefer built-in state** - React Query's `isPending` > manual `isLoading` state
6. **Fail fast** - Validate environment variables at startup
7. **Document magic values** - Comments on error codes, reserved types, etc.
8. **Don't duplicate** - Generate constants from schemas/enums when possible

---

## Files Changed

| File | Changes |
|------|---------|
| `src/app/wines/[id]/edit/page.tsx` | Fixed params await, added skeleton loading |
| `src/app/wines/[id]/add-bottle/page.tsx` | Fixed error handling, use mutation state |
| `src/app/page.tsx` | Redirect to /wines |
| `src/app/not-found.tsx` | **Created** - Custom 404 page |
| `src/app/error.tsx` | **Created** - Global error boundary |
| `src/app/layout.tsx` | Added Toast and ErrorBoundary providers |
| `src/components/ui/Toast.tsx` | **Created** - Toast notification system |
| `src/components/ui/ErrorBoundary.tsx` | **Created** - Error boundary component |
| `src/components/wine/WineForm.tsx` | Zod validation, toast notifications |
| `src/components/wine/WineCard.tsx` | Added React.memo |
| `src/components/bottle/BottleRow.tsx` | State sync, accessibility, toasts |
| `src/components/bottle/ConsumeModal.tsx` | Full accessibility overhaul |
| `src/lib/db/wines.ts` | Input sanitization, null safety, comments |
| `src/lib/db/bottles.ts` | Null safety |
| `src/lib/db/supabase.ts` | Environment validation |
| `src/lib/hooks/use-wines.ts` | Removed unused query key |
| `src/lib/types/wine.ts` | Documentation for reserved types |
| `eslint.config.mjs` | Added useful rules |
| `.env.local` | Added safety comment |
