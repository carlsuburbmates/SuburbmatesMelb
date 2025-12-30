-- Stage 3 Task 1: Product CRUD Migration
-- Tier cap enforcement + slug uniqueness

-- ============================================================================
-- TIER CAP ENFORCEMENT FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION check_product_tier_cap()
RETURNS TRIGGER AS $$
DECLARE
    vendor_tier VARCHAR(10);
    product_count INTEGER;
    tier_limit INTEGER;
BEGIN
    -- Get vendor tier
    SELECT v.vendor_tier INTO vendor_tier
    FROM vendors v
    WHERE v.id = NEW.vendor_id;

    -- Determine tier limit based on SSOT §3.2 (Basic=3, Pro=50)
    tier_limit := CASE vendor_tier
        WHEN 'basic' THEN 3
        WHEN 'pro' THEN 50
        ELSE 0
    END;

    -- Count current published products for this vendor
    SELECT COUNT(*) INTO product_count
    FROM products
    WHERE vendor_id = NEW.vendor_id 
      AND published = true
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid); -- Exclude self on UPDATE

    -- Enforce cap only if trying to publish
    IF NEW.published = true AND product_count >= tier_limit THEN
        RAISE EXCEPTION 'Product cap reached for % tier (limit: %)', vendor_tier, tier_limit
            USING ERRCODE = '23514'; -- check_violation
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Drop existing trigger if present
DROP TRIGGER IF EXISTS trigger_product_tier_cap ON products;

-- Create trigger for tier cap enforcement
CREATE TRIGGER trigger_product_tier_cap
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_product_tier_cap();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Vendor-scoped slug uniqueness (allows different vendors to use same slug)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_vendor_slug 
    ON products(vendor_id, slug);

-- Index for published product counting (used by tier cap check)
CREATE INDEX IF NOT EXISTS idx_products_vendor_published 
    ON products(vendor_id, published) 
    WHERE published = true;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION check_product_tier_cap() IS 
'Enforces tier-based product caps per SSOT §3.2: Basic=3, Pro=50';

COMMENT ON TRIGGER trigger_product_tier_cap ON products IS 
'Prevents vendors from exceeding tier product quotas when publishing';
