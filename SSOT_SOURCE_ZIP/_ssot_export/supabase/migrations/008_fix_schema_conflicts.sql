-- Migration 008: Fix Schema Conflicts
-- Resolves PGRST204 errors and column reference mismatches
-- Date: 2025-11-16

BEGIN;

-- ============================================================================
-- 1. FIX TRIGGER FUNCTION (vendor_tier -> tier)
-- ============================================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS trigger_product_tier_cap ON products;
DROP FUNCTION IF EXISTS check_product_tier_cap();

-- Recreate function with correct column reference
CREATE OR REPLACE FUNCTION check_product_tier_cap()
RETURNS TRIGGER AS $$
DECLARE
    vendor_tier VARCHAR(20);
    tier_limit INTEGER;
    product_count INTEGER;
BEGIN
    -- Read tier + quota directly from vendors table (no hard-coded assumptions)
    SELECT v.tier, v.product_quota
    INTO vendor_tier, tier_limit
    FROM vendors v
    WHERE v.id = NEW.vendor_id;

    -- If no quota is defined for this vendor/tier, skip enforcement
    IF tier_limit IS NULL OR tier_limit <= 0 THEN
        RETURN NEW;
    END IF;

    -- Count current published products for this vendor (excluding current row on update)
    SELECT COUNT(*) INTO product_count
    FROM products
    WHERE vendor_id = NEW.vendor_id
      AND published = TRUE
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

    IF NEW.published = TRUE AND product_count >= tier_limit THEN
        RAISE EXCEPTION 'Product cap reached for % tier (limit: %)', vendor_tier, tier_limit
            USING ERRCODE = '23514';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER trigger_product_tier_cap
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_product_tier_cap();

-- ============================================================================
-- 2. ADD MISSING COLUMNS (images support)
-- ============================================================================

-- Add images column as JSONB array to support multiple product images
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add constraint to ensure images is an array
ALTER TABLE products 
ADD CONSTRAINT products_images_is_array 
CHECK (jsonb_typeof(images) = 'array');

-- Add constraint to limit image count (max 3 as per validation schema)
ALTER TABLE products 
ADD CONSTRAINT products_images_max_count 
CHECK (jsonb_array_length(images) <= 3);

-- ============================================================================
-- 3. ADD CATEGORY COLUMN (string support)
-- ============================================================================

-- Add category as text field (in addition to category_id for flexibility)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT;

-- ============================================================================
-- 4. INDEXES FOR NEW COLUMNS
-- ============================================================================

-- Index for images JSONB queries (if needed for search)
CREATE INDEX IF NOT EXISTS idx_products_images_gin ON products USING gin (images);

-- Index for category text search
CREATE INDEX IF NOT EXISTS idx_products_category_text ON products(category) WHERE category IS NOT NULL;

-- ============================================================================
-- 5. UPDATE COMMENTS
-- ============================================================================

COMMENT ON COLUMN products.images IS 'JSONB array of image URLs, max 3 images per product';
COMMENT ON COLUMN products.category IS 'Text category field for flexible categorization';
COMMENT ON FUNCTION check_product_tier_cap() IS 
'Enforces vendor-specific product quotas using vendors.product_quota (no hard-coded tier assumptions)';

COMMIT;
