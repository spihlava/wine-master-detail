---
description: Hour 0 - Initialize project structure, dependencies, and environment
---

# Hour 0: Project Setup

## Goal
Initialize the Next.js application, set up the development environment, and configure the core technologies (TypeScript, Tailwind CSS, Supabase).

## Success Criteria
> [!IMPORTANT]
> Verify each success criteria item and mark them as completed `[x]` in this file before proceeding to the next hour.

- [x] Next.js application scaffolded with TypeScript and App Router
- [x] Core dependencies installed (Supabase, React Query, Zod)
- [x] Environment variables configured (.env.local)
- [x] Project directory structure organized
- [x] Linting and formatting configurations active
- [x] Application successfully builds and runs locally

## Testing Checklist
> [!IMPORTANT]
> This checklist must be completed before any of the Success Criteria are met.

- [x] `npm run dev` starts without errors
- [x] Home page loads at http://localhost:3000
- [x] Directory structure exists under `src/`
- [x] `package.json` contains all installed dependencies
- [x] Tailwind CSS is working (edit page.tsx to test a class)

## Prerequisites
- Node.js 18+ installed
- npm installed
- Git initialized

## Implementation Steps

### 1. Scaffold Next.js Application

Initialize the project in the current directory.

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```
*Note: Accept the prompts to create the project in the current directory if asked.*

### 2. Install Core Dependencies

Install the essential libraries for the architecture.

```bash
npm install @supabase/supabase-js @tanstack/react-query zod clsx tailwind-merge lucide-react
```

- `@supabase/supabase-js`: Official Supabase client
- `@tanstack/react-query`: Server state management
- `zod`: Runtime schema validation
- `clsx` & `tailwind-merge`: Utility for conditional classes
- `lucide-react`: Icon set

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Setup Project Structure

Ensure the directory structure matches the architecture plan:

```bash
mkdir -p src/lib/db
mkdir -p src/lib/hooks
mkdir -p src/lib/types
mkdir -p src/lib/utils
mkdir -p src/components/generic
mkdir -p src/components/wine
mkdir -p src/components/bottle
mkdir -p src/components/ui
```

### 5. Create Utility Functions

Create `src/lib/utils/cn.ts` for Tailwind class merging:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 6. Verify Installation

Run the development server to ensure everything is connected.

```bash
npm run dev
```



## Deliverables
- Initialized Next.js codebase
- `package.json` with dependencies
- `.env.local` file (template)
- `src` directory with subfolders

## Time Box
30 minutes

## Next Hour
Hour 1: Database Setup (Supabase schema, types, Zod)

## Troubleshooting

### "Directory not empty" error
- If `create-next-app` complains about existing files (like README.md), use the `--use-npm` flag or clear the directory (except .agent and .git) before running.
- Alternatively, move the existing docs to a temporary folder, init the app, and move them back.

### Tailwind not working
- Verify `tailwind.config.ts` content matches the `src` directory structure.
- Ensure `globals.css` imports tailwind directives.
