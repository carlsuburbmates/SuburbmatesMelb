# DATABASE TRUTH — SuburbMates
> **Canonical reference.** Updated after each remote schema change + type regeneration.
> Remote project: `hmmqhwnxylqcbffjffpj`
> Last verified: 2026-04-11 (remote audit script + SSOT v2.1)

---

## Rules

### Auth → public.users sync
- **NO trigger exists** between `auth.users` and `public.users`.
- Every auth user creation MUST be followed by an explicit `INSERT` into `public.users`.
- `vendors.user_id` has a FK to `public.users.id` — skipping the insert causes FK violations.

### Region/suburb naming
- Public API and UI language: `region`, `region_id`
- Physical remote column on `business_profiles`: `suburb_id` (compatibility alias, intentional)
- The `regions` table (IDs 13–18) is the authoritative source. Do not use hardcoded IDs.
- `featured_slots` uses `region_id` (the correct column name on that table).

### Product/creator language
- User-facing: "creator", "digital product", "drop"
- DB table: `vendors` (operational record), `business_profiles` (discovery record)
- `user_type` value in `users` table: `'business_owner'`
- API routes: `/api/creator/*` is preferred; `/api/vendor/*` routes are legacy naming

### Featured eligibility
- A slot is active when: `status = 'active'`, `start_date <= now`, `end_date >= now`
- Managed manually via Supabase GUI — no automated FIFO or Stripe Connect logic
- Per-region capping enforced manually

---

## Active Tables (remote-verified 2026-04-11)

### `public.users`
Canonical columns: `id, email, first_name, last_name, user_type, created_at, updated_at, deleted_at, created_as_business_owner_at`
- No trigger sync from `auth.users`. Manual insert mandatory.
- `user_type` values: `'customer'`, `'business_owner'`, `'admin'`

### `business_profiles`
Canonical columns (remote-authoritative per SSOT §8):
`id, user_id, business_name, slug, profile_description, vendor_status, category_id, suburb_id, is_public, created_at, updated_at, profile_image_url, images, website, phone`

Compatibility columns (tolerated, do not remove):
- `suburb_id` — physical column for `region_id` (FK → `regions.id`)
- `images` (Json) — legacy image blob, tolerated while `profile_image_url` is primary

Visibility gate: `is_public = true` AND `vendor_status = 'active'`

### `vendors`
Canonical columns (remote-verified subset):
`id, user_id, business_name, bio, logo_url, primary_region_id, secondary_regions, product_count, vendor_status, abn, abn_verified, abn_verified_at, last_activity_at, inactivity_flagged_at, suspended_at, suspension_reason, can_appeal, created_at, updated_at`

Legacy columns still present on remote (do not rely on, candidates for Phase 5 drop):
- `dispute_count`, `last_dispute_at`, `auto_delisted_until`, `delist_until`
- `payment_reversal_window_start`
- `product_quota`, `storage_quota_gb`, `storage_used_mb`
- `can_sell_products`, `is_vendor`
- `profile_color_hex`, `profile_url`

### `products`
Canonical columns: `id, vendor_id, title, description, slug, product_url, image_urls, category_id, is_active, is_archived, deleted_at, price, created_at, updated_at`

Compatibility columns (tolerated):
- `images` (Json) — legacy format, data migrated to `image_urls` via migration 20260330
- `thumbnail_url` — legacy, superseded by `image_urls[1]`
- `digital_file_url`, `file_size_bytes` — legacy delivery columns, not used

Visibility gate: `is_active = true`, `is_archived = false`, `deleted_at IS NULL`

### `regions`
Canonical rows (remote-authoritative):
| ID | Name |
|----|------|
| 13 | Inner Metro |
| 14 | Inner South-east |
| 15 | Northern |
| 16 | Western |
| 17 | Eastern |
| 18 | Southern |

### `categories`
18 categories active on remote (IDs 1–18). SSOT intends ~6 umbrella categories but remote has 18 granular categories. Treat all 18 as active until a consolidation pass.

### `outbound_clicks`
Columns: `id, product_id, vendor_id, clicked_at`
- Zero-PII mandate: no `ip_address`, no `user_agent` (dropped in migration 20260331)
- `clicked_at` is the timestamp column (not `created_at`)

### `featured_slots`
Columns: `id, business_profile_id, vendor_id, region_id, suburb_label, start_date, end_date, status, charged_amount_cents, created_at`
- `status` values: `'active'`, `'expired'`, `'cancelled'`
- Managed manually via Supabase GUI

### `featured_slot_reminders`
Columns: `id, featured_slot_id, vendor_id, reminder_window, sent_at, status, error`
- Active operational table — not deprecated

### `search_logs`
Columns: `id, hashed_query, filters, result_count, session_id, user_id, created_at`
- Zero-PII: queries are hashed, no raw text stored

### `contact_submissions`
Columns: `id, name, email, subject, message, status, metadata, created_at`
- Clean, purpose-built, not deprecated

---

## Active RPCs (remote-deployed)

### `get_daily_shuffle_products(p_limit int)`
Returns: `id, title, description, image_urls, product_url, vendor_id, business_name, business_slug, created_at`
- Shuffles non-featured products daily using `md5(id || CURRENT_DATE)`
- Used by `FreshSignals` homepage component

---

## Deprecated / Dead (do not reference in new code)

### Tables confirmed dead (Phase 5 drop candidates — verify data before dropping)
- `appeals` — no active code paths; was commerce-era dispute flow
- `reviews` — no active code paths; was marketplace-era peer review

### Columns confirmed dead on remote (Phase 5 drop candidates)
- `business_profiles.vendor_tier`
- `business_profiles.is_vendor`
- `vendors.dispute_count`, `vendors.last_dispute_at`
- `vendors.auto_delisted_until`, `vendors.delist_until`
- `vendors.payment_reversal_window_start`
- `vendors.product_quota`, `vendors.storage_quota_gb`, `vendors.storage_used_mb`
- `vendors.can_sell_products`

### Auth flows (dead — SSOT §3 mandates Magic Links / OAuth only)
- `src/lib/auth.ts` `AuthManager.signUp(email, password)`
- `src/lib/auth.ts` `AuthManager.signIn(email, password)`
- The entire `AuthManager` class is a dead parallel auth layer

### Banned RPCs / functions
- `fn_try_reserve_featured_slot` — references dropped `lga_id`, legacy automated queue
- `fn_enforce_product_quota` — tier-based quota, purged in migration 20260325/20260330

### Banned tables (already dropped on remote)
- `lgas`, `orders`, `marketplace_sales`, `disputes`, `refund_requests`, `user_tiers`, `transactions_log`, `featured_queue`

---

## Type Generation

To regenerate `src/lib/database.types.ts` from the live remote schema:

```bash
SUPABASE_ACCESS_TOKEN=<your-pat> npx supabase gen types typescript \
  --project-id hmmqhwnxylqcbffjffpj \
  > src/lib/database.types.ts
```

**This must be run after every remote schema change.**
A Supabase Personal Access Token (PAT) is required. Generate one at: https://supabase.com/dashboard/account/tokens

---

## Post-Phase-3 Cleanup Candidates (Phase 5)

Run in this order after fresh remote type generation:
1. `DROP TABLE IF EXISTS appeals CASCADE;`
2. `DROP TABLE IF EXISTS reviews CASCADE;`
3. `ALTER TABLE business_profiles DROP COLUMN IF EXISTS vendor_tier, DROP COLUMN IF EXISTS is_vendor;`
4. `ALTER TABLE vendors DROP COLUMN IF EXISTS dispute_count, DROP COLUMN IF EXISTS last_dispute_at, DROP COLUMN IF EXISTS auto_delisted_until, DROP COLUMN IF EXISTS delist_until, DROP COLUMN IF EXISTS payment_reversal_window_start, DROP COLUMN IF EXISTS product_quota, DROP COLUMN IF EXISTS storage_quota_gb, DROP COLUMN IF EXISTS storage_used_mb, DROP COLUMN IF EXISTS can_sell_products;`
5. `ALTER TABLE products DROP COLUMN IF EXISTS images, DROP COLUMN IF EXISTS thumbnail_url, DROP COLUMN IF EXISTS digital_file_url, DROP COLUMN IF EXISTS file_size_bytes;`

**Hard gate:** re-run audit script and check data presence before each drop. Regenerate types after each batch.
