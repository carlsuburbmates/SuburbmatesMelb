# DATABASE TRUTH — SuburbMates
> **Canonical reference.** Updated after each remote schema change + type regeneration.
> Remote project: `hmmqhwnxylqcbffjffpj`
> Last verified: 2026-04-11 (Phase 5 complete — all drops applied; `database.types.ts` regenerated from live remote via CLI; TypeScript 0 errors)

---

## Type Generation

To regenerate `src/lib/database.types.ts` from the live remote schema:

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_REPLIT" npx supabase gen types typescript \
  --project-id hmmqhwnxylqcbffjffpj \
  > src/lib/database.types.ts
```

**Must be run after every remote schema change.** The `SUPABASE_REPLIT` secret holds the PAT.

---

## Invariant Rules

### Auth → public.users sync
- **NO trigger exists** between `auth.users` and `public.users`.
- Every new auth user requires an explicit `INSERT` into `public.users`.
- `vendors.user_id` has a FK to `public.users.id` — skipping the insert causes FK violations.

### Region/suburb naming
- Public API and UI language: `region`, `region_id`
- Physical column on `business_profiles`: `suburb_id` (compatibility alias — intentional, do not rename)
- The `regions` table (IDs 13–18) is authoritative. Do not hardcode IDs.
- `featured_slots` uses `region_id` (the correct name on that table).

### Product/creator language
- User-facing: "creator", "digital product", "drop"
- DB tables: `vendors` (operational record), `business_profiles` (discovery record)
- `user_type` values in `users` table: `'customer'`, `'business_owner'`, `'admin'`
- API routes: `/api/creator/*` is canonical; `/api/vendor/*` is legacy naming

### Featured eligibility
- A slot is active when: `status = 'active'`, `start_date <= now`, `end_date >= now`
- Creator eligibility gate (enforced in `FeaturedModal`): `vendors.primary_region_id IS NOT NULL` AND `business_profiles.suburb_id IS NOT NULL`
- If either field is missing, creator is blocked from requesting and shown a "complete your location details" prompt
- Featured requests go into `featured_requests` (status=`pending`) for admin review — no automated approval
- Per-region capping enforced manually by admin during review

---

## Active Tables (type-verified 2026-04-11)

### `public.users` (9 cols)
`id, email, first_name, last_name, user_type, created_at, updated_at, deleted_at, created_as_business_owner_at`

### `business_profiles` (15 cols)
`id, user_id, business_name, slug, profile_description, vendor_status, category_id, suburb_id, is_public, created_at, updated_at, profile_image_url, images, website, phone`

Tolerated compatibility columns (do not drop yet):
- `suburb_id` — FK → `regions.id` (alias for `region_id`)
- `images` (Json) — legacy image blob; `profile_image_url` is primary

Visibility gate: `is_public = true` AND `vendor_status = 'active'`

**Type-verified drift notes:**
- `vendor_tier` — ALREADY DROPPED on remote ✅ (removed from Phase 5 list)
- `is_vendor` — ALREADY DROPPED on remote ✅ (removed from Phase 5 list)

### `vendors` (27 cols)
Active canonical: `id, user_id, business_name, bio, logo_url, primary_region_id, secondary_regions, product_count, vendor_status, abn, can_appeal, suspended_at, suspension_reason, last_activity_at, inactivity_flagged_at, created_at, updated_at`

**Type-verified drift notes:**
- `abn_verified` — NOT present on remote (was expected per SSOT but never migrated)
- `abn_verified_at` — NOT present on remote (same)
- `product_quota` — NOT present on remote (already dropped) ✅

Dead columns still present (Phase 5 drop candidates — no code references found):
`dispute_count, last_dispute_at, auto_delisted_until, delist_until, payment_reversal_window_start, storage_quota_gb, storage_used_mb, can_sell_products, profile_color_hex, profile_url`

### `products` (19 cols)
Active canonical: `id, vendor_id, title, description, slug, product_url, image_urls, category_id, is_active, is_archived, deleted_at, price, created_at, updated_at`

Dead columns still present (Phase 5 drop candidates — no code references found):
`thumbnail_url, digital_file_url, file_size_bytes, images, category`

- `images` (Json) — legacy blob, migrated to `image_urls`
- `thumbnail_url` — superseded by `image_urls[1]`
- `digital_file_url`, `file_size_bytes` — legacy delivery, not used
- `category` (text) — legacy free-text before `category_id` FK was added

Visibility gate: `is_active = true`, `is_archived = false`, `deleted_at IS NULL`

### `regions` (4 cols)
`id, name, active, created_at`

| ID | Name |
|----|------|
| 13 | Inner Metro |
| 14 | Inner South-east |
| 15 | Northern |
| 16 | Western |
| 17 | Eastern |
| 18 | Southern |

### `categories` (remote-authoritative)
18 categories active on remote (IDs 1–18). SSOT intends ~6 umbrella categories but remote has 18 granular ones. Treat all 18 as active until consolidation pass.

### `outbound_clicks` (4 cols)
`id, product_id, vendor_id, clicked_at`
- Zero-PII: no `ip_address`, no `user_agent` (dropped in migration 20260331)
- Timestamp column: `clicked_at` (not `created_at`)

### `featured_slots`
`id, business_profile_id, vendor_id, region_id, suburb_label, start_date, end_date, status, charged_amount_cents, created_at`
- `status` values: `'active'`, `'expired'`, `'cancelled'`

### `featured_slot_reminders`
`id, featured_slot_id, vendor_id, reminder_window, sent_at, status, error`

### `search_logs`
`id, hashed_query, filters, result_count, session_id, user_id, created_at`
- Zero-PII: queries are hashed, no raw text stored

### `listing_claims` (added Phase 6 — 2026-04-11)
`id, claimant_user_id FK users, business_profile_id FK business_profiles, evidence_text, status, admin_notes, created_at, updated_at, reviewed_at`
- `status` values: `pending`, `approved`, `rejected`, `more_info`
- One active claim per user per listing enforced by unique partial index
- Migration file: `supabase/migrations/20260411_listing_claims.sql`

### `featured_requests` (added Phase 6 — 2026-04-11)
`id, vendor_id FK vendors, region_id FK regions, status, admin_notes, created_at, reviewed_at`
- `status` values: `pending`, `approved`, `rejected`
- Migration file: `supabase/migrations/20260411_featured_requests.sql`

### `contact_submissions`
`id, name, email, subject, message, status, metadata, created_at`

### `webhook_events` (6 cols)
`id, event_type, payload, processed_at, stripe_event_id, created_at`
- **KEEP.** Stripe will be used for featured placement payments (confirmed 2026-04-11).
- This table is the correct log target for incoming Stripe webhook events.
- Currently dormant — no active code references yet. Will be wired up during Stripe integration phase.

---

## Active RPCs (type-verified 2026-04-11)

### `get_daily_shuffle_products(p_limit int)`
Returns: `id, title, description, image_urls, product_url, vendor_id, business_name, business_slug, created_at`
- Shuffles non-featured products daily using `md5(id || CURRENT_DATE)`
- Used by `FreshSignals` homepage component

### `get_vendor_status`
- Returns status for a vendor. No active code references found in `src/`.
- Likely an admin/support utility function.

### `fn_try_reserve_featured_slot`
- Still present in current generated types as of 2026-04-13.
- Linked remote migration history does not show the Phase 5 cleanup migration as applied.
- Treat as a legacy RPC that still exists in schema reality until cleanup is actually applied and types are regenerated.

### `fn_unpublish_oldest_products`
- ~~Bulk-unpublishes oldest products (quota enforcement).~~ **DROPPED in Phase 5** (2026-04-11)

---

## Deprecated / Dead (do not reference in new code)

### Dead tables — **DROPPED Phase 5** (2026-04-11)
- ~~`appeals`~~ — commerce-era dispute flow; 0 rows; dropped
- ~~`reviews`~~ — marketplace-era peer review; 0 rows; dropped

### Dead RPCs — **DROPPED Phase 5** (2026-04-11)
- ~~`auto_reject_expired_appeals`~~
- ~~`is_appeal_within_deadline`~~
- ~~`fn_unpublish_oldest_products`~~

### Dead auth (SSOT §3 — Magic Link / OAuth only)
- `src/lib/auth.ts` — **DELETED in Phase 4** (2026-04-11)
- Zero imports confirmed before deletion; TypeScript typecheck passed after
- Active auth paths: `src/contexts/AuthContext.tsx` (OTP/OAuth) + `src/app/api/_utils/auth.ts` (server JWT)

### Banned functions (intended state, not yet fully reconciled on linked remote)
- `fn_try_reserve_featured_slot` — **not yet confirmed removed**. Current generated types still include it, and linked remote migration history on 2026-04-13 does not show `20260411031200_phase5a_drop_dead_rpcs.sql` as applied.
- `fn_enforce_product_quota` — tier-based quota, purged in migration 20260325/20260330

### Banned tables (confirmed dropped on remote)
- `lgas`, `orders`, `marketplace_sales`, `disputes`, `refund_requests`, `user_tiers`, `transactions_log`, `featured_queue`

---

## Phase 5 Cleanup — local files present, linked remote not yet reconciled

Migration files exist in `supabase/migrations/` (Phase 5A–D), but linked remote verification on 2026-04-13 shows the remote has not applied the Phase 5 cleanup migrations yet.
`src/lib/database.types.ts` therefore still reflects a mixed state and should not be treated as proof that Phase 5 cleanup has been applied remotely.

**Dropped:**
- Tables: `appeals`, `reviews`
- RPCs: `auto_reject_expired_appeals`, `is_appeal_within_deadline`, `fn_unpublish_oldest_products`
- Vendor columns (10): `dispute_count`, `last_dispute_at`, `auto_delisted_until`, `delist_until`, `payment_reversal_window_start`, `storage_quota_gb`, `storage_used_mb`, `can_sell_products`, `profile_color_hex`, `profile_url`
- Product columns (5): `thumbnail_url`, `digital_file_url`, `file_size_bytes`, `images`, `category`

**Kept:** `webhook_events` — Stripe featured placement payments.
