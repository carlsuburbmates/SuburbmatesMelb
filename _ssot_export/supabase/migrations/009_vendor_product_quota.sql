-- Migration 009: Vendor Product Quotas
-- Auto-assign product_quota based on tier + ABN verification
-- Date: 2025-11-17

BEGIN;

-- ============================================================================
-- 1. TRIGGER TO MAINTAIN PRODUCT QUOTAS
-- ============================================================================

CREATE OR REPLACE FUNCTION set_vendor_product_quota()
RETURNS TRIGGER AS $$
DECLARE
    quota INTEGER;
BEGIN
    IF NEW.tier = 'pro' THEN
        quota := 50;
    ELSE
        quota := CASE
            WHEN NEW.abn_verified IS TRUE THEN 10
            ELSE 5
        END;
    END IF;

    NEW.product_quota := quota;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_vendor_product_quota ON vendors;

CREATE TRIGGER trigger_vendor_product_quota
    BEFORE INSERT OR UPDATE OF tier, abn_verified
    ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION set_vendor_product_quota();

-- ============================================================================
-- 2. BACKFILL EXISTING VENDORS
-- ============================================================================

UPDATE vendors
SET product_quota = CASE
    WHEN tier = 'pro' THEN 50
    WHEN abn_verified IS TRUE THEN 10
    ELSE 5
END
WHERE product_quota IS DISTINCT FROM (
    CASE
        WHEN tier = 'pro' THEN 50
        WHEN abn_verified IS TRUE THEN 10
        ELSE 5
    END
);

COMMENT ON FUNCTION set_vendor_product_quota() IS 'Assigns product_quota based on tier and ABN verification (Basic:5/10, Pro:50).';

COMMIT;
