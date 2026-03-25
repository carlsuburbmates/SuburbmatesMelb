-- Final SSOT v2.0 Residual Database Purge (Legacy Marketplace Logic)
-- This removes any triggers or functions that still reference 'tier' or 'quota' based on tiers.

DROP TRIGGER IF EXISTS trigger_product_tier_cap ON products;
DROP FUNCTION IF EXISTS check_product_tier_cap();
DROP FUNCTION IF EXISTS set_vendor_product_quota();
DROP FUNCTION IF EXISTS get_vendor_tier(uuid);

-- Also drop any other quota triggers that might be hiding
DROP TRIGGER IF EXISTS trigger_set_vendor_quota ON vendors;
