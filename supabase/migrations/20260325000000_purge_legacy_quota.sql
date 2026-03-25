-- SSOT v2.0 Final Cleanup: Purge legacy quota enforcement from trigger
CREATE OR REPLACE FUNCTION fn_enforce_product_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_quota int := 12; -- Global standard for SSOT v2 directory
  v_count int;
BEGIN
  -- We now have a fixed quota for the discovery loop (directory-level)
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND (NEW.published = TRUE) THEN
    SELECT COUNT(*) INTO v_count 
    FROM products 
    WHERE vendor_id = NEW.vendor_id AND published = TRUE AND id != NEW.id;

    IF v_count >= v_quota THEN
      RAISE EXCEPTION 'quota_exceeded: vendor % allowed % published %', NEW.vendor_id, v_quota, v_count;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
