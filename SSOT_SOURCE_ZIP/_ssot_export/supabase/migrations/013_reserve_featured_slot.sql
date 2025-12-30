-- Migration: Create atomic reservation RPC for featured slots
BEGIN;

-- Function: fn_try_reserve_featured_slot
-- Attempts to reserve a featured_slot atomically. Raises exceptions on cap violations.
CREATE OR REPLACE FUNCTION fn_try_reserve_featured_slot(
  p_vendor_id uuid,
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
  -- Acquire an advisory lock on the LGA to serialize reservations for that LGA
  PERFORM pg_advisory_xact_lock(p_lga_id::bigint);

  -- Count overlapping active slots in the LGA
  SELECT COUNT(*) INTO v_count FROM featured_slots
    WHERE lga_id = p_lga_id
      AND status = 'active'
      AND NOT (end_date < p_start_date OR start_date > p_end_date);

  IF v_count >= 5 THEN
    RAISE EXCEPTION 'lga_cap_exceeded' USING ERRCODE = 'P0001';
  END IF;

  -- Count vendor's overlapping active slots
  SELECT COUNT(*) INTO v_vendor_count FROM featured_slots
    WHERE vendor_id = p_vendor_id
      AND status = 'active'
      AND NOT (end_date < p_start_date OR start_date > p_end_date);

  IF v_vendor_count >= 3 THEN
    RAISE EXCEPTION 'vendor_cap_exceeded' USING ERRCODE = 'P0002';
  END IF;

  -- Reserve slot with status 'reserved' (pending payment)
  INSERT INTO featured_slots (vendor_id, lga_id, suburb_label, start_date, end_date, status, created_at)
    VALUES (p_vendor_id, p_lga_id, p_suburb_label, p_start_date, p_end_date, 'reserved', now())
    RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
