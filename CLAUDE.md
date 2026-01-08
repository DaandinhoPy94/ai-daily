# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Dagelijks (AI Daily) is a Dutch AI news aggregation platform with:
- **Web app**: Vite + React + TypeScript + shadcn/ui + Tailwind
- **Native apps**: React Native + Expo in `ai-daily-native/`
- **Backend**: Supabase (PostgreSQL with RLS, Auth, Edge Functions)

## Commands

### Web Development
```bash
npm run dev          # Start dev server (http://localhost:8080)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run tests once
npm run test:watch   # Watch mode
```

### Native Development
```bash
cd ai-daily-native
npm start            # Expo dev server
npm run ios          # Run on iOS
npm run android      # Run on Android
```

### Image Pipeline
```bash
npm run images:build   # Generate thumbnails
npm run images:upload  # Upload to Supabase storage
npm run images:all     # Both
npm run images:watch   # Watch for changes
```

### Database
```bash
npm run policy:lint    # Validate RLS policies (requires DATABASE_URL)
```

## Architecture

### Web App Structure (`src/`)
- **`App.tsx`**: Root with providers (QueryClient, Auth, Theme, Stock) and React Router routes
- **`pages/`**: Route components - `ResponsiveIndex` (home), `ArticleDetail`, `PaperPage`, `TopicPage`, etc.
- **`components/`**: UI components organized by feature (`auth/`, `header/`, `lists/`, `media/`, `ui/`)
- **`hooks/`**: Custom hooks including `useReadArticles` for read-state persistence
- **`contexts/`**: `AuthContext` (session management, profile ensure), `StockContext`
- **`lib/`**: Utilities - `ensureProfile.ts`, SEO helpers, search
- **`integrations/supabase/`**: Supabase client and generated types

### Native App (`ai-daily-native/`)
- File-based routing via Expo Router in `app/`
- NativeWind for Tailwind-style styling
- Shared Supabase client in `src/lib/`

### Database (Supabase)
- Migrations in `supabase/migrations/`
- Edge Functions in `supabase/functions/`
- Key tables: `articles`, `profiles`, `topics`, `article_comments`, `bookmarks`
- Types generated in `src/integrations/supabase/types.ts`

### Authentication Flow
1. Supabase Auth handles OAuth/magic link
2. `AuthCallback.tsx` processes OAuth redirect
3. `ensureProfile.ts` upserts profile on every sign-in
4. RLS policies enforce row-level access
5. Debug: Add `?debug=auth` to URL or set `localStorage.__auth_debug = 'true'`

### Read State System
Articles marked as read are stored in `localStorage` key `ai-daily:read-articles:v1`. Components add `data-read` attribute and apply `text-foreground/80` styling. Implementation in `src/hooks/useReadArticles.ts`.

## Security Model

- **Roles**: User (default), Editor, Admin
- **Admin assignment**: Set `profiles.role = 'admin'` in database (protected by `profiles_block_role_change` trigger)
- **RLS**: All public tables have row-level security. See `docs/SECURITY.md` for policy details
- **Functions**: Use `SECURITY INVOKER` by default, `SET search_path = public, pg_temp`

## Environment Variables

- `VITE_SITE_URL`: Base URL for canonical URLs and OG tags
- `VITE_DEBUG_AUTH`: Enable auth debug tracing
- `DATABASE_URL`: For policy linting

## Content Ingestion API

External content creation via `POST /functions/v1/ingest-content` with HMAC-SHA256 signature. Actions: `upsert_article`, `upsert_topic`, `upsert_tag`, `upload_media`. See `docs/content-ingestion-api.md`.

## Testing

Tests use Vitest with jsdom environment. Test files in `src/lib/__tests__/`. Setup in `src/test/setup.ts` includes `@testing-library/jest-dom` matchers and `matchMedia` polyfill.

Run single test file:
```bash
npx vitest run src/lib/__tests__/seo.test.ts
```
