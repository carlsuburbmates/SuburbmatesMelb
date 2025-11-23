# Stage 3 Enhancement Implementation Summary

**Date:** 2025-11-16
**Migration:** 007_stage3_enhancements.sql

## Changes Applied

### 1. Database Schema (Migration 007)

- ✅ Added `dispute_count`, `last_dispute_at`, `auto_delisted_until` to `vendors` table
- ✅ Extended tier enum to include `premium` tier
- ✅ Created `search_telemetry` table with RLS policies (PII-redacted hashed queries)
- ✅ Updated featured slots RLS to enforce premium-tier-only access
- ✅ Added indexes for `transactions_log` performance

### 2. Constants & Configuration

**File:** `src/lib/constants.ts`

- ✅ Added `PREMIUM` tier to `VENDOR_TIERS`
- ✅ Added premium tier limits (50 products, 3 featured slots, $99/mo, 5% commission)
- ✅ Added `MAX_SLOTS_PER_VENDOR = 3` to `FEATURED_SLOT`
- ✅ Added `DISPUTE_AUTO_DELIST_THRESHOLD = 3`
- ✅ Added `AUTO_DELIST_DURATION_DAYS = 30`

### 3. Logging Events

**File:** `src/lib/logger.ts`

- ✅ Added `BusinessEvent.VENDOR_TIER_CHANGED`
- ✅ Added `BusinessEvent.VENDOR_PRODUCTS_AUTO_UNPUBLISHED`

### 4. Vendor Downgrade Logic (FIFO Unpublish)

**File:** `src/lib/vendor-downgrade.ts` (NEW)

- ✅ `enforceTierProductCap()` - Auto-unpublish oldest products when tier downgraded
- ✅ `getDowngradePreview()` - Preview which products would be unpublished
- ✅ Non-negotiable FIFO enforcement (oldest published products unpublished first)

### 5. Search Telemetry

**Files:** `src/lib/telemetry.ts`, `src/app/api/search/route.ts`

- ✅ `recordSearchTelemetry()` - Hash queries with SHA-256 + salt (never store raw) and insert telemetry rows via service client
- ✅ `validateTelemetryConfig()` - Warn if using insecure default salt
- ✅ Placeholder API route `src/app/api/search/route.ts` accepts POST `{ query, filters, session_id }`, records telemetry, and returns an empty result set so clients can start wiring calls without breaking UX.

### 6. Featured Slots API

**Files:** `src/app/api/vendor/featured-slots/route.ts`, `src/lib/featured-slot.ts`

- ✅ GET - Fetch vendor's featured slots plus queue state
- ✅ POST - Initiates a real Stripe Checkout session using `STRIPE_PRICE_FEATURED_30D`
- ✅ Includes metadata (`vendor_id`, `business_profile_id`, `lga_id`, `suburb_label`, `reserved_slot_id`) so the webhook can activate the slot after payment
- ✅ Falls back to queue enrollment when an LGA hits its slot cap
- ✅ Enforces premium tier requirement, vendor status, and max three active slots per vendor

### 7. Stripe Webhook Enhancements

**File:** `src/app/api/webhook/stripe/route.ts`

- ✅ Commission ledger entry on `checkout.session.completed`
  - Inserts immutable `commission_deducted` record to `transactions_log`
- ✅ Featured slot fulfillment
  - Activates the slot immediately after Stripe marks the session `completed`
  - Revalidates capacity at fulfillment time, queues if the LGA filled up in the meantime
- ✅ Dispute gating on `charge.dispute.created`
  - Increments `dispute_count`
  - Auto-suspends vendor for 30 days when count ≥ 3
  - Sets `vendor_status = 'suspended'`, `tier = 'suspended'`
- ✅ Subscription tier changes on `customer.subscription.updated/deleted`
  - Updates vendor tier (active → premium, canceled → basic)
  - Triggers FIFO downgrade unpublish if downgraded
  - Logs `VENDOR_TIER_CHANGED` event

### 8. Vendor Dashboard & Product Management UI (NEW)

- ✅ `GET /api/vendor/products` — returns vendor-owned products plus tier stats/featured counts (file: `src/app/api/vendor/products/route.ts`)
- ✅ `useVendorProducts` hook for authenticated fetch + CRUD helpers (file: `src/hooks/useVendorProducts.ts`)
- ✅ Vendor workspace route group (`src/app/(vendor)/vendor/*`)
  - `/vendor/dashboard` — utilization overview, featured slot highlights, quota warnings
  - `/vendor/products` — CRUD form, publish toggles, delete controls, cap-aware messaging
  - `/vendor/analytics` — lightweight insights (category mix, publication ratios, upgrade tips)
- ✅ Layout guard enforces vendor-only access and links to help/upgrade flows
- ✅ UI messaging references SSOT non-negotiables (MoR, no SLAs, FIFO downgrade)

## Non-Negotiable Compliance

### ✅ Implemented

1. **Dispute Gating** - 3+ disputes = 30-day auto-suspension
2. **Downgrade FIFO** - Oldest products unpublished first on tier downgrade
3. **Commission Immutable** - Ledger entry created on every commission deduction
4. **Premium Featured Slots** - Only premium tier can purchase; max 3 per vendor
5. **PII Redaction** - Search queries hashed with SHA-256, never stored raw

### 🔄 Pending Integration

- Search telemetry analytics surfacing (API + directory now emit telemetry; need dashboards/cron aggregation)
- Cron jobs for tier-cap validation, featured-slot expiry, telemetry cleanup, and analytics rollups (see “Cron Jobs / Maintenance” section)
- Unit + E2E coverage for tier upgrades/downgrades, featured purchases/queueing, and search telemetry zero-result handling
  - `tests/e2e/featured-slots.spec.ts` still `test.skip` until we add a deterministic premium fixture and webhook harness.
- Tier-limit reconciliation — current sources disagree:
  - `src/lib/constants.ts:28-35` defines `basic.product_quota = 10` while still citing “SSOT: Basic=3” in downstream comments (`src/lib/tier-utils.ts:43-48`).
  - `tests/unit/tier-utils.test.ts:11-18` asserts Basic tier caps at 3 products and drives upgrade recs off that value.
  - `supabase/migrations/009_vendor_product_quota.sql:16-57` assigns 10 products to Basic vendors, or 20 if `abn_verified = true`, and 50 for Pro.
  Aligning these values (or clearly documenting intentional overrides via `vendors.product_quota`) is required before Stage 3 sign-off.
- Documentation sync (SSOT architecture, vendor workflows, Stage reports) reflecting suburb-first search + business-level featured placements

## Environment Variables Required

Add to `.env.local`:

```bash
# Search telemetry salt (change in production!)
SEARCH_SALT=your-secret-salt-here-min-32-chars
```

## Next Steps

1. **Apply Migrations:** ensure `007_stage3_enhancements.sql`, `010_create_search_logs.sql`, `011_featured_business_schema.sql`, plus the renumbered `015_stage3_products_tiers.sql`, `016_webhook_events.sql`, `017_featured_slots_schema_fix_fixed.sql`, and the new `018_enable_business_profiles_search_logs_rls.sql` are all applied to Supabase.
2. **Regenerate Types:**

   ```bash
   npx supabase gen types typescript --project-id hmmqhwnxylqcbffjffpj > src/lib/database.types.ts
   ```

3. **Stripe Checkout QA:**
   - Trigger `/api/vendor/featured-slots` for a premium vendor, confirm it returns a Stripe Checkout URL (set `FEATURED_SLOT_CHECKOUT_MODE=mock` in CI to avoid hitting Stripe during automated tests)
   - Complete payment via Stripe CLI (`stripe checkout sessions create ... --metadata type=featured_slot`) and verify the webhook activates the slot or enqueues when full

4. **Cron + Telemetry Automation:**
   - Implement `scripts/check-tier-caps.js`, `scripts/cleanup-search-logs.js`, `scripts/expire-featured-slots.js`, `scripts/aggregate-analytics.js`
   - Schedule via Vercel Cron or document the manual run-book

5. **Testing:**
   - Add unit coverage for `/api/vendor/tier`, `/api/vendor/featured-slots`, and search telemetry helpers
   - Unskip Playwright flows for tier upgrade/downgrade, featured purchase + queueing, and directory search telemetry/zero-result UX

6. **Documentation Sync:** update SSOT architecture, vendor workflows, and Stage 3 status to describe suburb-first search, business-level featured placements, Stripe checkout, the new cron responsibilities, and the migration history repairs listed below.

## Supabase Migration Repairs (22 Nov 2025)

- ✅ Renamed duplicate Stage 3 migrations to avoid version collisions:
  - `010_stage3_products_tiers.sql` → `015_stage3_products_tiers.sql`
  - `011_webhook_events.sql` → `016_webhook_events.sql`
  - `014_featured_slots_schema_fix_fixed.sql` → `017_featured_slots_schema_fix_fixed.sql`
- ✅ Applied `supabase/migrations/018_enable_business_profiles_search_logs_rls.sql` to enable RLS and policies on `business_profiles` + `search_logs`.
- ✅ Repaired `supabase_migrations.schema_migrations` so versions `001–018` show as applied (see `psql ... select version,name ...`).
- ✅ Validated schema with `node scripts/analyze-database.js` and `node scripts/validate-database.js` (now updated to handle RPC fallbacks and correct `orders.amount_cents`).
- ✅ Supabase CLI 2.58.5 logged in via PAT and `supabase migration list` confirms remote parity.

## Cron / Maintenance Scripts

| Script | Purpose | Recommended cadence | Notes |
| --- | --- | --- | --- |
| `scripts/check-tier-caps.js` | Warn when vendors exceed their product quota (uses `product_quota` field + live counts). | Daily at 02:00 AEDT | Output lists offenders; follow up manually or run FIFO auto-unpublish. |
| `scripts/cleanup-search-logs.js` | Delete `search_logs` rows older than 90 days to keep telemetry lean. | Weekly on Sunday | Safe to run more frequently; relies on service-role key. |
| `scripts/expire-featured-slots.js` | Flip featured slots to `expired` when their `end_date` passes or the vendor is suspended. | Every 6 hours | Prevents stale featured badges after downgrades. |
| `scripts/aggregate-analytics.js` | Generate `reports/analytics/daily-YYYY-MM-DD.json` with search + inventory KPIs. | Daily at 00:30 AEDT | Output consumed by dashboard or downloaded from Vercel logs. |

> **Vercel Cron wiring:** add four cron jobs pointing to `npm run cron:<name>` (see below) or invoke the scripts directly via `node scripts/<file>.js`. Each script expects `.env.local` with Supabase service-role credentials available in the runtime.

## Files Created

- `supabase/migrations/007_stage3_enhancements.sql`
- `src/lib/vendor-downgrade.ts`
- `src/lib/telemetry.ts`
- `src/app/api/vendor/featured-slots/route.ts`
- `STAGE3_IMPLEMENTATION_SUMMARY.md` (this file)
- `src/hooks/useVendorProducts.ts`
- `src/app/(vendor)/vendor/layout.tsx`
- `src/app/(vendor)/vendor/page.tsx`
- `src/app/(vendor)/vendor/dashboard/page.tsx`
- `src/app/(vendor)/vendor/products/page.tsx`
- `src/app/(vendor)/vendor/analytics/page.tsx`

## Files Modified

- `src/lib/constants.ts`
- `src/lib/logger.ts`
- `src/app/api/webhook/stripe/route.ts`
- `src/app/api/vendor/products/route.ts`

## Verification Checklist

- [ ] Migration 007 applied successfully
- [ ] Types regenerated without errors
- [ ] Build passes: `npm run build`
- [ ] Featured slots API returns 403 for non-premium vendors
- [ ] Featured slots API returns 403 at 4th slot attempt
- [ ] Dispute webhook increments `dispute_count`
- [ ] 3rd dispute auto-suspends vendor for 30 days
- [ ] Subscription cancellation triggers FIFO unpublish
- [ ] Commission ledger entry created on every order
- [ ] Search telemetry hashes queries (when integrated)
- ✅ Layout guard enforces vendor-only access and links to help/upgrade flows
- ✅ UI messaging references SSOT non-negotiables (MoR, no SLAs, FIFO downgrade)

### 9. Search Telemetry Infrastructure (NEW)

- ✅ Migration `010_create_search_logs.sql` replaces the earlier `search_telemetry` table with `search_logs` storing hashed queries, filters, result counts, and session IDs.
- ✅ `POST /api/search/telemetry` (`src/app/api/search/telemetry/route.ts`) validates payloads and delegates to `recordSearchTelemetry`.
- ✅ `/api/search` now reuses the same telemetry helper to avoid duplicate logging paths until full search logic ships.
