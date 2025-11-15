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

**File:** `src/lib/telemetry.ts` (NEW)

- ✅ `recordSearchTelemetry()` - Hash queries with SHA-256 + salt (never store raw)
- ✅ `validateTelemetryConfig()` - Warn if using insecure default salt
- ✅ Requires `SEARCH_SALT` environment variable

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

## Non-Negotiable Compliance

### ✅ Implemented

1. **Dispute Gating** - 3+ disputes = 30-day auto-suspension
2. **Downgrade FIFO** - Oldest products unpublished first on tier downgrade
3. **Commission Immutable** - Ledger entry created on every commission deduction
4. **Premium Featured Slots** - Only premium tier can purchase; max 3 per vendor
5. **PII Redaction** - Search queries hashed with SHA-256, never stored raw

### 🔄 Pending Integration

- Search telemetry recording (needs integration into directory/marketplace search endpoints)
- Featured slot purchase flow UI (API ready, UI pending)
- Unit tests for new logic
- E2E tests for tier downgrade, dispute gating, featured slot caps

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

## Files Modified

- `src/lib/constants.ts`
- `src/lib/logger.ts`
- `src/app/api/webhook/stripe/route.ts`

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
