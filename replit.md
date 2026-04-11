# SuburbMates — Replit Project

**Melbourne digital creator directory.** Creators showcase their digital work. Visitors discover and click through to external stores. Monetisation is via paid featured placement slots charged through Stripe.

## Working Rules

- **Single branch by default:** All work happens on `main`. No feature or fix branches unless explicitly requested or the change is high-risk (destructive migration, large refactor). Agent recommends and explains before creating a branch.
- **Every sync leaves one local + one remote:** After any push/sync, exactly one local branch (`main`) and one remote branch (`origin/main`). Push to GitHub using `GITHUB_TOKEN` after every checkpoint.
- **Database parity:** All migration files go directly on `main`. Apply via Supabase Management API (`SUPABASE_REPLIT` PAT). Regen types after every schema change.
- **Gaps tracker:** `docs/GAPS.md` — pull this before planning the next work session.

---

## Monetisation Model

SuburbMates charges creators for **featured placement slots** in the directory.

- `featured_slots` table: `id, business_profile_id, vendor_id, region_id, suburb_label, start_date, end_date, status, charged_amount_cents, created_at`
- `webhook_events` table: Stripe webhook log target — `stripe_event_id` field confirms this
- **Current phase:** Stripe is NOT yet integrated. Featured placement is manually activated by admin (Discovery Mode stub).
- **Planned approach (per SSOT):** Admin sends creator a Stripe Payment Link → creator pays → admin confirms → admin activates featured slot. No in-app checkout. No Stripe Connect.
- **Banned (per SSOT):** embedded checkout, Stripe Connect, FIFO automated billing engine (`fn_try_reserve_featured_slot` was dropped in Phase 5).

---

## Stack

- **Framework**: Next.js 16.2.3 (App Router, webpack mode)
- **Database**: Supabase (PostgreSQL) — project ID `hmmqhwnxylqcbffjffpj`
- **Auth**: Supabase Magic Link / OTP + approved OAuth. Password auth is banned.
- **Email**: Resend — all creator transactional emails
- **Payments**: Stripe — **NOT YET INSTALLED** — planned for featured slot payments (manual Payment Links, not embedded checkout). SDK to install: `stripe`.
- **Scheduled jobs**: Supabase pg_cron (free tier, built-in) + pg_net for HTTP calls. Migration written (`20260411_automation_jobs.sql`) — pending apply (blocked on SUPABASE_REPLIT PAT expiry — see GAPS.md G10). DB trigger on `listing_claims.status` change → pg_net POST → `/api/webhooks/claim-status`.
- **Error monitoring**: Sentry (configured, no startup warnings — activate by setting `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` secrets)
- **Analytics**: Google Analytics GA4 (tag in root layout)
- **ABR**: Australian Business Register API (ABN lookup) — configured, verify wired in create flow (see GAPS.md G6)
- **Port**: 5000 (0.0.0.0)

---

## Key Environment Variables

### Active
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_PASSWORD` — direct DB access for migrations
- `SUPABASE_REPLIT` — PAT for Supabase Management API (type regen + SQL execution)
- `RESEND_API_KEY`
- `ABR_API_KEY`
- `GITHUB_TOKEN` — used for `git push origin main`
- `CRON_SECRET` — protects `/api/ops/*` routes from public access (verify this is set)

### Not yet configured (needed for Stripe)
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## Architecture

### User model (3 types only)
- **Visitor** — unauthenticated, browses, searches, clicks out, submits contact forms
- **Creator** — authenticated (`business_owner` in DB), claims/creates listing, manages profile + products, requests featured
- **Admin** — internal operator, one-admin business, runs the cockpit (not yet built — see GAPS.md G5)

DB user_type values: `customer | business_owner | admin` (internal only, never shown publicly)

### Auth
- Client-side: `src/contexts/AuthContext.tsx` — `supabase.auth.signInWithOtp()` + `signInWithOAuth()`
- Server-side: `src/middleware/auth.ts` — `getUserFromRequest()` parses JWT from Authorization header
- No auth → public.users trigger — every new Supabase auth user requires explicit insert into `public.users`

### Database clients
- `src/lib/supabase.ts` exports:
  - `supabase` — anon/RLS client (read-only public queries)
  - `supabaseAdmin` — service role client (nullable — guard with null check in every API route)
- `business_profiles.suburb_id` — intentional alias for `region_id`. Do NOT rename.
- `featured_slots` vs `featured_requests` — two different tables. `featured_requests` = creator-submitted request (pending admin review). `featured_slots` = activated placement with billing data.

### Search
- `src/lib/search.ts` → `executeDirectorySearch()` — paginates business profiles
- Ordering: stable `id ASC` for DB pagination + daily shuffle hash in post-fetch sort (`dailySortKey(id)`)
- Featured profiles always bubble to top
- Known issue: `category.name` returns null from PostgREST join (FK constraint name mismatch — GAPS.md G8)

### Redirect / click logging
- `src/app/api/redirect/route.ts` — Zero-PII click logger. `outbound_clicks` uses `clicked_at`, no IP/UA stored.

### Featured placement flow
1. Creator requests featured via `/api/vendor/featured-request` → `featured_requests` row with `status=pending`
2. Eligibility gate: `vendors.primary_region_id IS NOT NULL` AND `business_profiles.suburb_id IS NOT NULL`
3. Admin reviews request (via future admin dashboard)
4. Admin sends Stripe Payment Link to creator (manually, until Stripe integration is built)
5. Creator pays
6. Admin activates: creates `featured_slots` row with `charged_amount_cents`, sets `status=active`
7. Cron job (`/api/ops/featured-reminders`) sends expiry reminders before `end_date`

### Email (Resend)
All templates in `src/lib/email.ts`. Active:
- `sendWelcomeEmail` — on creator registration
- `sendClaimAcknowledgementEmail` — on claim submit
- `sendFeaturedRequestConfirmationEmail` — on featured request submit
- `sendFeaturedSlotExpiryEmail` — called by `/api/ops/featured-reminders` cron

Built but not yet triggered (pending admin dashboard):
- `sendClaimOutcomeEmail` — claim approved/rejected by admin
- `sendVendorApprovedEmail` — listing activated by admin
- `sendVendorWarningEmail` — listing flagged by admin

Dead / to clean up (see GAPS.md G3):
- `sendVendorSuspensionEmail` — no suspension flow
- `sendAppealDecisionEmail` — `appeals` table dropped in Phase 5

---

## Canonical References

- `docs/USER_MODEL.md` — authority on user types (3 types: Visitor, Creator, Admin)
- `docs/WORKFLOWS.md` — authority on all workflows (Visitor, Creator, Admin)
- `docs/ADMIN_DASHBOARD_SPEC.md` — authority on admin dashboard (deferred — see GAPS.md G5)
- `docs/SSOT_V2.1.md` — product and architecture specification
- `docs/DATABASE_TRUTH.md` — remote schema reference (tables, columns, RPCs, deprecated items)
- `docs/GAPS.md` — known gaps and deferred work — pull before each planning session

---

## Completed Migration Phases

### Phase 1 — Remote Database Audit + DATABASE_TRUTH.md
- Confirmed: 6 regions (IDs 13–18), 18 categories, no auth→users trigger
- `outbound_clicks` timestamp: `clicked_at` (not `created_at`)
- Written: `docs/DATABASE_TRUTH.md` as canonical schema reference

### Phase 2 — Type Regeneration (working)
- Regen command: `SUPABASE_ACCESS_TOKEN="$SUPABASE_REPLIT" npx supabase gen types typescript --project-id hmmqhwnxylqcbffjffpj > src/lib/database.types.ts`
- Must run after every schema change. Current: 832 lines, generated 2026-04-11.

### Phase 3 — Runtime Bug Fixes
1. `redirect/route.ts` — `.is('is_archived', false)` → `.eq('is_archived', false)`. Shared `supabaseAdmin`.
2. `creator/route.ts` — replaced inline `createClient` with shared anon `supabase`
3. `creator/[slug]/route.ts` — shared `supabaseAdmin` + null guard
4. `search.ts` — stable `id ASC` ordering + daily shuffle post-fetch sort
5. `analytics/search/route.ts` — removed dead `tier` field
6. `src/lib/auth.ts` — deleted (Phase 4). Active auth: `AuthContext.tsx` + `src/middleware/auth.ts`

### Phase 4 — Dead Code Removal
- `src/lib/auth.ts` deleted. Zero imports confirmed. TypeScript: 0 errors.

### Phase 5 — Schema Cleanup (complete 2026-04-11)
- Applied via Supabase Dashboard SQL Editor
- Dropped: `appeals` table, `reviews` table, 3 dead RPCs, 10 vendor columns, 5 product columns
- `fn_try_reserve_featured_slot` RPC dropped (referenced removed `lga_id` field)
- Types updated: 920 → 736 lines. Migrations in `supabase/migrations/` (4 files: 5A–D)

### Phase 7 — Automation infrastructure + code cleanup (2026-04-11)

- G9 (Sentry): `instrumentation.ts` + `instrumentation-client.ts` rewritten — `register()` + `onRequestError` + `onRouterTransitionStart` hooks. `sentry.server.config.ts` + `sentry.edge.config.ts` deleted. Zero startup warnings.
- G3 (dead email): `sendVendorSuspensionEmail` + `sendAppealDecisionEmail` removed. Added `sendBrokenLinkEmail` + `sendIncompleteListingEmail`.
- G2 (routes): `/api/ops/broken-links` — HEAD checks all product URLs, flags dead ones, emails creator. `/api/ops/incomplete-listings` — finds profiles missing desc/image/category/suburb, emails creator. `/api/webhooks/claim-status` — POST handler for DB trigger, calls `sendClaimOutcomeEmail`.
- G1 (schedules): Migration written `20260411_automation_jobs.sql` — pg_cron + pg_net + 4 schedules + claim status trigger. **Pending apply** (SUPABASE_REPLIT PAT expired — see GAPS.md G10).
- CRON_SECRET set as shared env var.
- G8 confirmed resolved: search.ts category join uses local Map, no PostgREST FK issue.
- G6 clarified: ABR API key is set but unused — dormant until admin dashboard claim review.

### Phase 6 — Creator Claim + Featured Request workflows (2026-04-11)
- Tables `listing_claims` + `featured_requests` applied via Supabase Management API
- Types regenerated: 736 → 832 lines
- API: `POST /api/creator/claim` — auth + duplicate guard + acknowledgement email
- API: `POST /api/vendor/featured-request` — eligibility gate + confirmation email
- UI: `ClaimModal`, `ClaimButton`, `FeaturedRequestModal`, `SearchFirstOnboarding`
- VendorLayoutClient: search-first onboarding for users without a listing
- VendorDashboardClient: "Request Featured Listing" button wired to modal
- Creator profile `/creator/[slug]`: `ClaimButton` visible to authenticated non-owners
- All states admin-ready: `pending / approved / rejected / more_info`
- TypeScript: 0 errors

### Security pass (2026-04-11)
- `next` upgraded 16.1.1 → 16.2.3 (9 CVEs patched)
- Auto-fixed: `flatted`, `minimatch`, `picomatch`, `preact`, `rollup`, `vite`, `ajv`, `brace-expansion`
- `npm audit`: 0 vulnerabilities

---

## Supabase Operations Reference

```bash
# Apply SQL via Management API
curl -s -X POST "https://api.supabase.com/v1/projects/hmmqhwnxylqcbffjffpj/database/query" \
  -H "Authorization: Bearer ${SUPABASE_REPLIT}" \
  -H "Content-Type: application/json" \
  -d '{"query": "<SQL here>"}'

# Regen types
SUPABASE_ACCESS_TOKEN="$SUPABASE_REPLIT" npx supabase gen types typescript \
  --project-id hmmqhwnxylqcbffjffpj > src/lib/database.types.ts

# Push to GitHub
git push https://x-access-token:${GITHUB_TOKEN}@github.com/carlsuburbmates/SuburbmatesMelb.git main
```
