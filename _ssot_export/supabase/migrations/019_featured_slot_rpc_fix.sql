-- Migration: Update fn_try_reserve_featured_slot to handle business_profile_id and reserved charge defaults
BEGIN;

ALTER TABLE IF EXISTS featured_slots
  ALTER COLUMN charged_amount_cents SET DEFAULT 0;

ALTER TABLE IF EXISTS featured_slots
  DROP CONSTRAINT IF EXISTS featured_slots_status_check;

ALTER TABLE IF EXISTS featured_slots
  ADD CONSTRAINT featured_slots_status_check
    CHECK (status IN ('reserved', 'active', 'expired', 'cancelled'));

CREATE OR REPLACE FUNCTION fn_try_reserve_featured_slot(
  p_vendor_id uuid,
  p_business_profile_id uuid,
  p_lga_id integer,
  p_suburb_label text,
  p_start_date timestamptz,
  p_end_date timestamptz
) RETURNS uuid AS $$
DECLARE
  v_count int;
  v_vendor_count int;
  v_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(p_lga_id::bigint);

  SELECT COUNT(*) INTO v_count FROM featured_slots
    WHERE lga_id = p_lga_id
      AND status = 'active'
      AND NOT (end_date < p_start_date OR start_date > p_end_date);

  IF v_count >= 5 THEN
    RAISE EXCEPTION 'lga_cap_exceeded' USING ERRCODE = 'P0001';
  END IF;

  SELECT COUNT(*) INTO v_vendor_count FROM featured_slots
    WHERE vendor_id = p_vendor_id
      AND status = 'active'
      AND NOT (end_date < p_start_date OR start_date > p_end_date);

  IF v_vendor_count >= 3 THEN
    RAISE EXCEPTION 'vendor_cap_exceeded' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO featured_slots (
    vendor_id,
    business_profile_id,
    lga_id,
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
      p_lga_id,
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
