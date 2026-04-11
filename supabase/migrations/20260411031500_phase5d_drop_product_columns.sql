-- Phase 5D: Drop dead product columns
-- All 5 columns confirmed absent from active code. Verified: 2026-04-11 via codebase grep.
-- Legacy delivery/image fields superseded by product_url and image_urls[].

ALTER TABLE products
  DROP COLUMN IF EXISTS thumbnail_url,
  DROP COLUMN IF EXISTS digital_file_url,
  DROP COLUMN IF EXISTS file_size_bytes,
  DROP COLUMN IF EXISTS images,
  DROP COLUMN IF EXISTS category;
