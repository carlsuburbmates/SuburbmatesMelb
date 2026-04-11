-- Phase 5C: Drop dead vendor columns
-- All 10 columns confirmed absent from active code. Verified: 2026-04-11 via codebase grep.
-- Commerce-era dispute/delist/quota/cosmetic fields no longer used.

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
