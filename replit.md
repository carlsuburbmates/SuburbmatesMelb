# SuburbMates — Replit Project

**Melbourne digital creator directory.** Discover Melbourne's top digital creators, their products, and drops.

## Working Rules

- **Single branch by default:** All work happens on `main`. No feature or fix branches are created unless explicitly requested by the user, or the agent determines a branch is strongly warranted (e.g. a destructive schema migration, a large risky refactor, or work that must be reviewed before landing on main). In those cases the agent will recommend the branch and explain why before creating it.
- **Every sync leaves one local + one remote:** After any push/sync, the repo must have exactly one local branch (`main`) and one remote branch (`origin/main`). Temporary task-agent branches are cleaned up automatically after merge.
- **Database parity:** Once the remote schema is at its target state (Phase 5 complete), the same rule applies — all migration files go directly on `main` unless a branch is explicitly warranted.

---

## Stack

- **Framework**: Next.js 16 (App Router, webpack mode)
- **Database**: Supabase (PostgreSQL) — project ID `hmmqhwnxylqcbffjffpj`
- **Auth**: Supabase Magic Link / OAuth (password-based auth is banned — SSOT §3)
- **Email**: Resend
- **ABR**: Australian Business Register API (ABN lookup)
- **Port**: 5000 (0.0.0.0)

## Key Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ABR_API_KEY`

## Architecture

### Auth
- Client-side: `src/contexts/AuthContext.tsx` — uses `supabase.auth.signInWithOtp()` and `signInWithOAuth()`
- Server-side: `src/app/api/_utils/auth.ts` — `requireAuth()` and `requireCreator()` parse JWT from header

### Database Clients
- `src/lib/supabase.ts` exports:
  - `supabase` — anon/RLS client (use for read-only public queries)
  - `supabaseAdmin` — service role client (nullable; use in API routes that need admin access)
- **No auth → public.users trigger exists** — every new auth user requires explicit insert into `public.users`

### Search
- `src/lib/search.ts` → `executeDirectorySearch()` — paginates business profiles
- Ordering: stable `id ASC` for DB pagination + daily shuffle hash in post-fetch sort
- Featured profiles always bubble to top

### Redirect
- `src/app/api/redirect/route.ts` — Zero-PII click logger (`outbound_clicks` uses `clicked_at`, no IP/UA)

## Canonical References

- `docs/USER_MODEL.md` — **authority on user types** (3 types: Visitor, Creator, Admin). Overrides any conflicting user-type language in older docs.
- `docs/WORKFLOWS.md` — **authority on all workflows** (Visitor, Creator, Admin). Overrides any older workflow language that assumes Supabase GUI alone is the operating surface.
- `docs/ADMIN_DASHBOARD_SPEC.md` — **authority on admin dashboard**. Internal admin cockpit required post-launch. Replaces Zero-UI Admin assumption in SSOT v2.1.
- `docs/SSOT_V2.1.md` — product and architecture specification (see above three docs for overrides on user model, workflows, and admin UI mandate)
- `docs/DATABASE_TRUTH.md` — remote schema reference (tables, columns, RPCs, deprecated items)

## Completed Migration Phases

### Phase 1 — Remote Database Audit + DATABASE_TRUTH.md
- Confirmed: 6 regions (IDs 13–18), 18 categories, no auth→users trigger
- `outbound_clicks` timestamp: `clicked_at` (not `created_at`)
- Deprecated tables: `appeals`, `reviews` (Phase 5 cleanup candidates)
- Written: `docs/DATABASE_TRUTH.md` as canonical SSOT reference

### Phase 2 — Type Regeneration
- Attempted; requires Supabase PAT (`SUPABASE_ACCESS_TOKEN`) for CLI auth
- Command: `SUPABASE_ACCESS_TOKEN=<pat> npx supabase gen types typescript --project-id hmmqhwnxylqcbffjffpj > src/lib/database.types.ts`
- Must be re-run after every remote schema change

### Phase 3 — Runtime Bug Fixes
1. **`redirect/route.ts`**: Fixed `.is('is_archived', false)` → `.eq('is_archived', false)`; replaced inline `createClient` with shared `supabaseAdmin`
2. **`creator/route.ts`**: Replaced inline `createClient` with named `{ supabase }` (anon client; GET is read-only)
3. **`creator/[slug]/route.ts`**: Replaced inline `createClient` with shared `supabaseAdmin` + null guard
4. **`search.ts`**: Replaced `order("created_at", {ascending: false})` with `order("id", {ascending: true})` (stable pagination) + daily shuffle post-fetch sort via `dailySortKey(id)` hash
5. **`analytics/search/route.ts`**: Removed dead `tier` field from `latestSearches` response
6. **`auth.ts`**: Marked entire file as legacy dead code; active auth is in `AuthContext.tsx` + `_utils/auth.ts`

## Known Issues / Future Phases

- **Phase 4**: ✅ `src/lib/auth.ts` deleted (2026-04-11) — zero imports confirmed, typecheck passed
- **Phase 5**: ✅ Complete (2026-04-11)
  - SQL run via Supabase Dashboard SQL editor (CLI/API blocked — PAT scope + no IPv4 DB path from Replit)
  - Dropped: `appeals` table, `reviews` table, 3 dead RPCs, 10 vendor columns, 5 product columns
  - `src/lib/database.types.ts` manually updated to match (920 → 736 lines); TypeScript: 0 errors
  - Migration files committed to `supabase/migrations/` (4 files, Phase 5A–D)
- **`SUPABASE_REPLIT` PAT**: Working — used via Management API (`/v1/projects/.../database/query`) to apply migrations and regen types
  - To regen types: `SUPABASE_ACCESS_TOKEN="$SUPABASE_REPLIT" npx supabase gen types typescript --project-id hmmqhwnxylqcbffjffpj > src/lib/database.types.ts`
  - To apply SQL directly: `curl -s -X POST "https://api.supabase.com/v1/projects/hmmqhwnxylqcbffjffpj/database/query" -H "Authorization: Bearer ${SUPABASE_REPLIT}" -H "Content-Type: application/json" -d "{\"query\": ...}"`
- **Sentry**: Instrumentation warnings present — `instrumentation-client.ts` needs `onRouterTransitionStart` hook
- **Category join in directory search**: `category.name` returns null from PostgREST join — pre-existing issue, investigate FK constraint name alignment
- **`business_profiles.suburb_id`**: intentional compatibility alias for `region_id` — do not rename
- **Security pass (2026-04-11)**: `npm audit` resolved — 0 vulnerabilities
  - `next` upgraded 16.1.1 → 16.2.3 (patches DoS via Image Optimizer, HTTP request smuggling, unbounded memory/disk growth, CSRF bypass, null-origin bypass — 9 CVEs)
  - Auto-fixed: `flatted`, `minimatch`, `picomatch`, `preact`, `rollup`, `vite`, `ajv`, `brace-expansion`
  - `package.json` pinned at `"next": "^16.2.3"`
  - TypeScript: 0 errors after clearing stale `.next/dev` cache
- **Phase 6**: ✅ Creator Claim + Featured Request workflows (2026-04-11)
  - `listing_claims` + `featured_requests` tables applied to Supabase via Management API
  - `src/lib/database.types.ts` regenerated (832 lines) — all new tables + `primary_region_id` fully typed
  - API: `POST /api/creator/claim` — auth + duplicate guard + email acknowledgement
  - API: `POST /api/vendor/featured-request` — eligibility gate (suburb_id + primary_region_id) + email
  - UI: `ClaimModal`, `ClaimButton`, `FeaturedRequestModal`, `SearchFirstOnboarding` components
  - VendorLayoutClient: search-first onboarding for users with no vendor profile
  - VendorDashboardClient: "Request Featured Listing" button in sidebar
  - Creator profile (`/creator/[slug]`): `ClaimButton` visible to authenticated non-owners
  - All new data states admin-ready: pending/approved/rejected/more_info
  - TypeScript: 0 errors
