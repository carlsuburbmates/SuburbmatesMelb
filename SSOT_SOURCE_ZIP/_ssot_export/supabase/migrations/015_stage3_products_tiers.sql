-- Migration: Stage 3 - Products, Tiers, Featured Slots, RLS
-- Adds vendor tier fields, dispute tracking, featured_slots table,
-- RLS policies for products and featured_slots, and FIFO unpublish function

BEGIN;

-- 1) Add tier and dispute fields to vendors table
ALTER TABLE IF EXISTS vendors
  ADD COLUMN IF NOT EXISTS tier text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS vendor_status text DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS dispute_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delist_until timestamptz DEFAULT NULL;

-- 2) Create featured_slots table
CREATE TABLE IF NOT EXISTS featured_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL,
  lga text NOT NULL,
  suburb_label text,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status text DEFAULT 'active',
  purchased_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE IF EXISTS featured_slots
  ADD CONSTRAINT fk_featured_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;

-- 3) Add indexes
CREATE INDEX IF NOT EXISTS idx_products_vendor_published ON products (vendor_id, published);
CREATE INDEX IF NOT EXISTS idx_featured_lga_status ON featured_slots (lga, status);

-- 4) RLS policies - products
-- Public can select published products
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "public_select_published" ON products
  FOR SELECT USING (published = true);

-- Authenticated vendors can manage their own products
CREATE POLICY IF NOT EXISTS "vendor_manage_own" ON products
  FOR ALL USING (auth.uid() IS NOT NULL AND auth.uid() = vendor_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = vendor_id);

-- 5) RLS policies - featured_slots
ALTER TABLE IF NOT EXISTS featured_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "vendor_manage_featured" ON featured_slots
  FOR ALL USING (auth.uid() IS NOT NULL AND auth.uid() = vendor_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = vendor_id);

CREATE POLICY IF NOT EXISTS "public_select_active_featured" ON featured_slots
  FOR SELECT USING (status = 'active');

-- 6) FIFO unpublish function: unpublish oldest published products for a vendor
CREATE OR REPLACE FUNCTION fn_unpublish_oldest_products(p_vendor_id uuid, p_to_unpublish integer)
RETURNS void AS $$
DECLARE
  r RECORD;
BEGIN
  IF p_to_unpublish <= 0 THEN
    RETURN;
  END IF;

  FOR r IN
    SELECT id FROM products
    WHERE vendor_id = p_vendor_id AND published = TRUE
    ORDER BY created_at ASC
    LIMIT p_to_unpublish
  LOOP
    UPDATE products SET published = FALSE, updated_at = now() WHERE id = r.id;
    INSERT INTO vendor_changes_history (vendor_id, change_type, details, created_at)
      VALUES (p_vendor_id, 'fifo_unpublish', jsonb_build_object('product_id', r.id), now());
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7) Trigger function to enforce product_quota on insert/update (final guard)
CREATE OR REPLACE FUNCTION fn_enforce_product_quota()
RETURNS trigger AS $$
DECLARE
  v_tier text;
  v_quota int;
  v_count int;
BEGIN
  -- Only check when publishing
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND (NEW.published = TRUE) THEN
    SELECT tier INTO v_tier FROM vendors WHERE id = NEW.vendor_id;
    IF v_tier IS NULL THEN
      v_tier := 'none';
    END IF;
    -- Map quotas (kept intentionally small; mirror src/lib/constants.ts)
    v_quota := CASE v_tier
      WHEN 'basic' THEN 10
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

-- Attach trigger to products table
DROP TRIGGER IF EXISTS trg_enforce_product_quota ON products;
CREATE TRIGGER trg_enforce_product_quota
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION fn_enforce_product_quota();

COMMIT;
