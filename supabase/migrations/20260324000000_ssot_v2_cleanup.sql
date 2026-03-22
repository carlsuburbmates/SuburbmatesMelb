-- Cleanup remaining bits from SSOT v2 Phase 1 & 2
BEGIN;

-- 1. Drop the orphaned lga_id from products
ALTER TABLE IF EXISTS products
  DROP COLUMN IF EXISTS lga_id;

-- 2. Drop the old function first to prevent signature conflict issues
DROP FUNCTION IF EXISTS fn_try_reserve_featured_slot(uuid, uuid, integer, text, timestamptz, timestamptz, integer, integer);

-- 3. Recreate the function using region_id and region_cap
CREATE OR REPLACE FUNCTION fn_try_reserve_featured_slot(
  p_vendor_id uuid,
  p_business_profile_id uuid,
  p_region_id integer,
  p_suburb_label text,
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_region_cap integer,
  p_vendor_cap integer
) RETURNS uuid AS $$
DECLARE
  v_count int;
  v_vendor_count int;
  v_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(p_region_id::bigint);

  SELECT COUNT(*) INTO v_count FROM featured_slots
    WHERE region_id = p_region_id
      AND status = 'active'
      AND NOT (end_date < p_start_date OR start_date > p_end_date);

  IF v_count >= p_region_cap THEN
    RAISE EXCEPTION 'region_cap_exceeded' USING ERRCODE = 'P0001';
  END IF;

  SELECT COUNT(*) INTO v_vendor_count FROM featured_slots
    WHERE vendor_id = p_vendor_id
      AND status = 'active'
      AND NOT (end_date < p_start_date OR start_date > p_end_date);

  IF v_vendor_count >= p_vendor_cap THEN
    RAISE EXCEPTION 'vendor_cap_exceeded' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO featured_slots (
    vendor_id,
    business_profile_id,
    region_id,
    suburb_label,
    start_date,
    end_date,
    status,
    charged_amount_cents,
    created_at
  )
    VALUES (
      p_vendor_id,
      p_business_profile_id,
      p_region_id,
      p_suburb_label,
      p_start_date,
      p_end_date,
      'reserved',
      0,
      now()
    )
    RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
