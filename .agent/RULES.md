# Wine Cellar - Always-On Rules

These rules are ALWAYS enforced. No exceptions without explicit user approval.

---

## Code Quality

### TypeScript
- All functions must have explicit type annotations
- No `any` types unless explicitly justified in comment
- Use `unknown` instead of `any` for truly unknown types
- Enable strict mode in tsconfig.json
- Prefer interface over type for object shapes

### Linting & Formatting
- All code must pass ESLint without warnings
- Use Prettier for consistent formatting
- Run `npm run lint` before committing
- Maximum function length: 50 lines (extract helpers if longer)

### Naming Conventions
- React components: PascalCase (`WineCard.tsx`)
- Hooks: camelCase with `use` prefix (`useWine.ts`)
- Services/utilities: camelCase (`wines.ts`, `formatDate.ts`)
- Types/interfaces: PascalCase (`Wine`, `Bottle`)
- Database tables: snake_case (`wines`, `bottles`)
- Database columns: snake_case (`wine_id`, `created_at`)

---

## Architecture

### Master-Detail Boundary (CRITICAL)
```
┌─────────────────────────────────────┐
│  MASTER (Wine)                      │
│  ─────────────────                  │
│  Reference/Product data             │
│  What the wine IS                   │
│  Rarely changes                     │
│                                     │
│  ❌ Never store: my_rating,         │
│     my_notes, status, location      │
└─────────────────────────────────────┘
               │
               │ 1:N relationship
               ▼
┌─────────────────────────────────────┐
│  DETAIL (Bottle)                    │
│  ─────────────────                  │
│  Personal/Instance data             │
│  What YOU do with it                │
│  Frequently changes                 │
│                                     │
│  ❌ Never store: producer,          │
│     vintage, region (duplicate)     │
└─────────────────────────────────────┘
```

### Component Organization
- `components/generic/` - Reusable master-detail patterns (domain-agnostic)
- `components/wine/` - Wine-specific implementations
- Generic components MUST NOT import from wine-specific code
- Wine components SHOULD use generic components

### Data Flow
```
Component → Hook → Service → Supabase
                       ↓
               Zod Validation
                       ↓
               Typed Response
```

- No direct Supabase calls in components
- All database access through service layer (`lib/db/`)
- All external data validated with Zod before use
- Hooks manage React Query caching

### No Business Logic in Components
- ❌ `<WineCard>{bottle.status === 'cellar' && <Badge>In Stock</Badge>}</WineCard>`
- ✅ `<WineCard><StatusBadge status={bottle.status} /></WineCard>`

---

## Database

### Table Standards
Every table MUST have:
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
created_at timestamptz DEFAULT now(),
updated_at timestamptz DEFAULT now()
```

### Constraints
- Use CHECK constraints for enum-like fields (status, type)
- Use REFERENCES for foreign keys with ON DELETE behavior
- Add indexes for:
  - Foreign keys (`CREATE INDEX idx_bottles_wine_id ON bottles(wine_id)`)
  - Frequently filtered columns (`CREATE INDEX idx_bottles_status ON bottles(status)`)

### Migration Safety
- Migrations must be reversible (include DOWN migration)
- Never rename columns directly (add new → migrate data → drop old)
- Test migrations on copy of production data before deploying

---

## Aggregates & Computed Values

### NEVER Store Aggregates on Master
```typescript
// ❌ WRONG - storing computed values
interface Wine {
  bottle_count: number;  // Stale immediately
  cellar_value: number;  // Stale immediately
}

// ✅ RIGHT - compute from details
function useWineStats(wineId: string) {
  const bottles = useBottles(wineId);
  return {
    total: bottles.length,
    inCellar: bottles.filter(b => b.status === 'cellar').length,
    cellarValue: bottles
      .filter(b => b.status === 'cellar')
      .reduce((sum, b) => sum + (b.price || 0), 0),
  };
}
```

---

## Status Lifecycle

### Valid Bottle Statuses
```
'cellar' → 'consumed' | 'gifted' | 'sold' | 'damaged'
```

### Status Transition Rules
- Only 'cellar' bottles can transition to other statuses
- Transitions are one-way (consumed cannot become cellar)
- 'consumed' requires consumed_date
- All transitions should record updated_at

---

## Frontend Design

### Anti-Generic AI Look
- Use curated color palettes (not plain red/blue/green)
- Implement dark mode toggle
- Use modern typography (Inter, Roboto, or Outfit from Google Fonts)
- Add micro-animations for interactions
- No placeholder images in final UI

### Tailwind Guidelines
- Utility classes only (no custom CSS without approval)
- Use design tokens from tailwind.config.ts
- Responsive design: mobile-first approach
- Use `cn()` or `clsx()` for conditional classes

---

## Testing Requirements

### Before Marking Hour Complete
- [ ] All TypeScript compiles (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Manual testing of new features
- [ ] No console errors in browser
- [ ] Responsive on mobile viewport
- [ ] All unit tests pass (`npm test`)

---

## Git Practices

### Commit Messages
Format: `<type>(<scope>): <description>`

Types: feat, fix, refactor, docs, style, test, chore

Examples:
- `feat(bottles): add status transition workflow`
- `fix(wine-card): correct drinking window calculation`
- `refactor(hooks): extract useWineStats from useWine`

### Branch Strategy
- `main` - production-ready code
- `hour-N-*` - work-in-progress for each iteration
- Merge to main after hour completion and testing

## Project Rules

### Testing Policy
All new code must be accompanied by unit tests.
The entire test suite must pass (`npm test`) before any changes are considered complete or merged.
Tests should cover critical logic, including service layer functions, component behavior, and schema validation.
Existing workflows (e.g., Hour 2, Hour 3, etc.) have been updated to enforce this rule.

### Linting Policy
ESLint is configured with default rules; custom rules are disabled to allow `console.error` and to avoid import ordering enforcement.

### Development Guidelines
- Follow the design system and UI component guidelines.
- Ensure accessibility by linking labels to form controls.
These rules are mandatory for all contributors.
