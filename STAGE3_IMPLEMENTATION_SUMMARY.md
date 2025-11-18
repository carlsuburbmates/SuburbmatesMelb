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

**File:** `src/app/api/vendor/featured-slots/route.ts` (NEW)

- ✅ GET - Fetch vendor's featured slots
- ✅ POST - Purchase/activate featured slot
- ✅ Enforces premium tier requirement (403 if not premium)
- ✅ Enforces max 3 active slots per vendor (403 if cap reached)
- ✅ Enforces active vendor status

### 7. Stripe Webhook Enhancements

**File:** `src/app/api/webhook/stripe/route.ts`

- ✅ Commission ledger entry on `checkout.session.completed`
  - Inserts immutable `commission_deducted` record to `transactions_log`
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

- Search telemetry recording (needs integration into directory/marketplace search endpoints)
- Full-text query service (current `/api/search` route only logs telemetry and returns an empty placeholder payload)
- Featured slot purchase flow UI (API ready, UI pending)
- Unit tests for new logic
- E2E tests for tier downgrade, dispute gating, featured slot caps
  - `tests/e2e/featured-slots.spec.ts` currently marks premium flows with `test.fixme` because we still lack a deterministic premium-upgrade fixture + webhook simulation. Update roadmap + coverage metrics to reflect this partial state.
- Tier-limit reconciliation — current sources disagree:
  - `src/lib/constants.ts:28-35` defines `basic.product_quota = 10` while still citing “SSOT: Basic=3” in downstream comments (`src/lib/tier-utils.ts:43-48`).
  - `tests/unit/tier-utils.test.ts:11-18` asserts Basic tier caps at 3 products and drives upgrade recs off that value.
  - `supabase/migrations/009_vendor_product_quota.sql:16-57` assigns 10 products to Basic vendors, or 20 if `abn_verified = true`, and 50 for Pro.
  Aligning these values (or clearly documenting intentional overrides via `vendors.product_quota`) is required before Stage 3 sign-off.

## Environment Variables Required

Add to `.env.local`:

```bash
# Search telemetry salt (change in production!)
SEARCH_SALT=your-secret-salt-here-min-32-chars
```

## Next Steps

1. **Apply Migration:**

   ```bash
   # Via Supabase Studio SQL Editor (recommended)
   # Copy contents of: supabase/migrations/007_stage3_enhancements.sql
   # Paste and execute in SQL Editor
   ```

2. **Regenerate Types:**

   ```bash
   npx supabase gen types typescript --project-id your-project-ref > src/lib/database.types.ts
   ```

3. **Test Implementations:**

   - Test featured slot API: `POST /api/vendor/featured-slots` with premium vendor
   - Test dispute webhook with Stripe CLI
   - Test subscription cancellation → FIFO unpublish
   - Verify commission ledger entries in `transactions_log`

4. **Integration Tasks:**
   - Add `recordSearchTelemetry()` calls to search endpoints
   - Create vendor dashboard UI for featured slot management
   - Add tier upgrade/downgrade preview UI
   - Send email notifications for auto-suspensions

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
