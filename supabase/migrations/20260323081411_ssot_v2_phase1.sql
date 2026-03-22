-- Step 2: SSOT v2 Phase 1 Migration

-- 1. Create the regions table to replace lgas
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the 6 Metro Regions defined by MVP
INSERT INTO regions (name) VALUES 
('Inner Metro'), 
('Western Metro'), 
('Northern Metro'), 
('Eastern Metro'), 
('Southern Metro'), 
('South Eastern Metro');

-- 2. Update featured_slots to use region_id instead of lga_id
ALTER TABLE featured_slots 
  DROP COLUMN IF EXISTS lga_id CASCADE,
  ADD COLUMN region_id INTEGER REFERENCES regions(id);

-- 3. Update featured_queue to use region_id instead of lga_id
ALTER TABLE featured_queue
  DROP COLUMN IF EXISTS lga_id CASCADE,
  ADD COLUMN region_id INTEGER REFERENCES regions(id);

-- 4. Update Vendors table
ALTER TABLE vendors
  DROP COLUMN IF EXISTS primary_lga_id CASCADE,
  DROP COLUMN IF EXISTS secondary_lgas CASCADE,
  DROP COLUMN IF EXISTS tier CASCADE,
  DROP COLUMN IF EXISTS stripe_account_id CASCADE,
  DROP COLUMN IF EXISTS pro_subscription_id CASCADE,
  DROP COLUMN IF EXISTS pro_subscribed_at CASCADE,
  DROP COLUMN IF EXISTS pro_cancelled_at CASCADE,
  ADD COLUMN primary_region_id INTEGER REFERENCES regions(id),
  ADD COLUMN secondary_regions INTEGER[];

-- 5. Drop the old LGAs table
DROP TABLE IF EXISTS lgas CASCADE;

--   Also drop the `idx_vendors_tier` because we dropped tier
DROP INDEX IF EXISTS idx_vendors_tier;

-- 6. Update products
ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_price_check,
  ALTER COLUMN price DROP NOT NULL,
  DROP COLUMN IF EXISTS delivery_type CASCADE,
  DROP COLUMN IF EXISTS file_type CASCADE,
  DROP COLUMN IF EXISTS file_url CASCADE,
  DROP COLUMN IF EXISTS file_size_mb CASCADE,
  ADD COLUMN external_url VARCHAR(1000);

-- Make external_url required for all new and existing rows.
UPDATE products SET external_url = 'https://example.com' WHERE external_url IS NULL;

ALTER TABLE products 
  ALTER COLUMN external_url SET NOT NULL;

-- 7. Create outbound_clicks table
CREATE TABLE outbound_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_address VARCHAR(45)
);

-- Index for analytics
CREATE INDEX idx_outbound_clicks_product_id ON outbound_clicks(product_id);
CREATE INDEX idx_outbound_clicks_vendor_id ON outbound_clicks(vendor_id);
CREATE INDEX idx_outbound_clicks_time ON outbound_clicks(clicked_at);
