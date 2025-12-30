-- Migration: Align Basic tier cap with SSOT (3 products)
BEGIN;

CREATE OR REPLACE FUNCTION fn_enforce_product_quota()
RETURNS trigger AS $$
DECLARE
  v_tier text;
  v_quota int;
  v_count int;
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND (NEW.published = TRUE) THEN
    SELECT tier INTO v_tier FROM vendors WHERE id = NEW.vendor_id;
    IF v_tier IS NULL THEN
      v_tier := 'none';
    END IF;
    v_quota := CASE v_tier
      WHEN 'basic' THEN 3
      WHEN 'pro' THEN 50
      WHEN 'premium' THEN 50
      ELSE 0 END;

    SELECT COUNT(*) INTO v_count FROM products WHERE vendor_id = NEW.vendor_id AND published = TRUE;

    IF v_count >= v_quota THEN
      RAISE EXCEPTION 'quota_exceeded: vendor % allowed % published %', NEW.vendor_id, v_quota, v_count;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
