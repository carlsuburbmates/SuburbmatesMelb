# Phase 5 — Remote Schema Cleanup Plan
> **Basis:** Type-verified against live remote 2026-04-11. No speculative drops.
> All items below were confirmed absent from active code before this plan was written.
> Execute in batches. Regenerate types and update DATABASE_TRUTH.md after each batch.

---

## Pre-flight Checklist (run before ANY batch)

```sql
-- Row counts for tables being dropped
SELECT 'appeals'  AS tbl, COUNT(*) FROM appeals;
SELECT 'reviews'  AS tbl, COUNT(*) FROM reviews;

-- Confirm dead columns exist before dropping (avoids errors on re-run)
SELECT column_name FROM information_schema.columns
WHERE table_name = 'vendors'
  AND column_name IN (
    'dispute_count','last_dispute_at','auto_delisted_until','delist_until',
    'payment_reversal_window_start','storage_quota_gb','storage_used_mb',
    'can_sell_products','profile_color_hex','profile_url'
  );

SELECT column_name FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN (
    'thumbnail_url','digital_file_url','file_size_bytes','images','category'
  );
```

**Hard gate:** if `appeals` or `reviews` has any rows with non-null, meaningful content — export before dropping.

Code scan before each batch (run from repo root):
```bash
# No code references to dead items
grep -rn "appeals\|reviews" src/ --include="*.ts" --include="*.tsx" | grep -v database.types
grep -rn "dispute_count\|auto_delisted_until\|delist_until\|can_sell_products\|storage_quota" src/ --include="*.ts" --include="*.tsx"
grep -rn "thumbnail_url\|digital_file_url\|file_size_bytes\|products\.category" src/ --include="*.ts" --include="*.tsx"
```

---

## Batch A — Dead RPCs (lowest risk, no data)

Drop the three dead functions. No data is affected.

```sql
-- A1: Appeals-related RPCs (depend on dead appeals table)
DROP FUNCTION IF EXISTS auto_reject_expired_appeals();
DROP FUNCTION IF EXISTS is_appeal_within_deadline(uuid);

-- A2: Quota RPC (quota system dropped in Phase 3 migrations)
DROP FUNCTION IF EXISTS fn_unpublish_oldest_products();
```

**After Batch A:**
1. Regenerate types: `SUPABASE_ACCESS_TOKEN="$SUPABASE_REPLIT" npx supabase gen types typescript --project-id hmmqhwnxylqcbffjffpj > src/lib/database.types.ts`
2. Verify the three function names no longer appear in the generated types
3. Update DATABASE_TRUTH.md — move them from "Phase 5 drop candidates" to "Banned functions (confirmed removed)"
4. Commit to `main`

---

## Batch B — Dead Tables

Drop the two dead tables. Run row-count pre-flight first.

```sql
-- B1: Appeals (commerce-era dispute flow — no active code paths)
DROP TABLE IF EXISTS appeals CASCADE;

-- B2: Reviews (marketplace-era peer review — no active code paths)
DROP TABLE IF EXISTS reviews CASCADE;
```

**After Batch B:**
1. Regenerate types
2. Verify `appeals` and `reviews` no longer appear in generated types
3. Update DATABASE_TRUTH.md
4. Run: `npx tsc --noEmit` — confirm zero TypeScript errors
5. Restart app and hit `GET /api/creator` to confirm no runtime regression
6. Commit to `main`

---

## Batch C — Dead Vendor Columns

All ten confirmed absent from any active code path.

```sql
ALTER TABLE vendors
  DROP COLUMN IF EXISTS dispute_count,
  DROP COLUMN IF EXISTS last_dispute_at,
  DROP COLUMN IF EXISTS auto_delisted_until,
  DROP COLUMN IF EXISTS delist_until,
  DROP COLUMN IF EXISTS payment_reversal_window_start,
  DROP COLUMN IF EXISTS storage_quota_gb,
  DROP COLUMN IF EXISTS storage_used_mb,
  DROP COLUMN IF EXISTS can_sell_products,
  DROP COLUMN IF EXISTS profile_color_hex,
  DROP COLUMN IF EXISTS profile_url;
```

**After Batch C:**
1. Regenerate types
2. Verify none of the dropped columns appear in `vendors` Row type
3. Update DATABASE_TRUTH.md — canonical vendor column list now matches remote exactly
4. Run `npx tsc --noEmit`
5. Hit `GET /api/creator/anya-studio` and `GET /api/creator` — confirm 200
6. Commit to `main`

---

## Batch D — Dead Product Columns

Five confirmed dead columns on `products`.

```sql
ALTER TABLE products
  DROP COLUMN IF EXISTS thumbnail_url,
  DROP COLUMN IF EXISTS digital_file_url,
  DROP COLUMN IF EXISTS file_size_bytes,
  DROP COLUMN IF EXISTS images,
  DROP COLUMN IF EXISTS category;
```

**Note on `products.images`:** confirm no FreshSignals or product display component reads `row.images` directly from a DB query before dropping. The `image_urls` array is the canonical field.

**After Batch D:**
1. Regenerate types
2. Verify none of the dropped columns appear in `products` Row type
3. Update DATABASE_TRUTH.md — canonical product column list now matches remote exactly
4. Run `npx tsc --noEmit`
5. Hit `GET /api/redirect?id=<slug>` — confirm 302
6. Commit to `main`

---

## Batch E — `webhook_events`: KEEP (do not drop)

**Decision confirmed 2026-04-11:** Stripe will be used for featured placement payments.

`webhook_events` (`id, event_type, payload, processed_at, stripe_event_id, created_at`) is the correct table to receive and log Stripe webhook events. It stays dormant until Stripe integration is built in a later phase.

No action required in Phase 5. The table is intentionally preserved.

---

## Post-Phase-5 State (target)

After all batches complete, the remote schema will contain exactly:

**Active tables:** `users`, `business_profiles`, `vendors`, `products`, `regions`, `categories`, `outbound_clicks`, `featured_slots`, `featured_slot_reminders`, `search_logs`, `contact_submissions`, `webhook_events`

**Active RPCs:** `get_daily_shuffle_products`, `get_vendor_status`

**No legacy columns anywhere.** Generated types will match `DATABASE_TRUTH.md` exactly with zero drift.

At that point the database is at optimal state for development and the schema is trustworthy as a foundation for Phase 6 product work.

---

## Migration File Convention

Each batch above should be written as a Supabase migration file before execution:

```
supabase/migrations/YYYYMMDDHHMMSS_phase5a_drop_dead_rpcs.sql
supabase/migrations/YYYYMMDDHHMMSS_phase5b_drop_dead_tables.sql
supabase/migrations/YYYYMMDDHHMMSS_phase5c_drop_vendor_columns.sql
supabase/migrations/YYYYMMDDHHMMSS_phase5d_drop_product_columns.sql
```

Commit the migration file to `main` before applying it to the remote. This keeps the migration history in sync with the codebase.
