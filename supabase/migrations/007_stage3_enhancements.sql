-- Migration 007: Stage 3 Enhancements
-- Dispute gating, premium tier, search telemetry, featured slots enforcement
-- Date: 2025-11-16

BEGIN;

-- ============================================================================
-- 1. VENDOR TABLE ENHANCEMENTS
-- ============================================================================

-- Add dispute tracking and auto-delist columns
ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS dispute_count INT DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS last_dispute_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS auto_delisted_until TIMESTAMPTZ;

-- Extend tier enum to include 'premium' (featured slot access)
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_tier_check;
ALTER TABLE vendors
  ADD CONSTRAINT vendors_tier_check 
  CHECK (tier IN ('none', 'basic', 'pro', 'premium', 'suspended'));

COMMENT ON COLUMN vendors.dispute_count IS 'Non-negotiable: 3+ disputes triggers auto-delist for 30 days';
COMMENT ON COLUMN vendors.auto_delisted_until IS 'Suspension end date; null if not auto-delisted';

-- ============================================================================
-- 2. SEARCH TELEMETRY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS search_telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  hashed_query TEXT NOT NULL,
  filters JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_telemetry_created_at ON search_telemetry(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_telemetry_user_id ON search_telemetry(user_id) WHERE user_id IS NOT NULL;

COMMENT ON TABLE search_telemetry IS 'PII-redacted search queries (hashed) for analytics';
COMMENT ON COLUMN search_telemetry.hashed_query IS 'SHA-256 hash with salt; raw query never stored';

-- ============================================================================
-- 3. SEARCH TELEMETRY RLS POLICIES
-- ============================================================================

ALTER TABLE search_telemetry ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own telemetry
CREATE POLICY "Telemetry insert (authenticated)" ON search_telemetry
FOR INSERT TO authenticated
WITH CHECK (true);

-- Only admins can read telemetry (analytics)
CREATE POLICY "Telemetry admin read only" ON search_telemetry
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  )
);

-- ============================================================================
-- 4. FEATURED SLOTS ENFORCEMENT (PREMIUM TIER ONLY)
-- ============================================================================

-- Drop existing public read policy and recreate with premium restriction
DROP POLICY IF EXISTS "Public can read active featured slots" ON featured_slots;

CREATE POLICY "Public can read active featured slots" ON featured_slots
FOR SELECT USING (
  status = 'active'
  AND EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.id = featured_slots.vendor_id
      AND vendors.tier = 'premium'
      AND vendors.vendor_status = 'active'
  )
);

COMMENT ON POLICY "Public can read active featured slots" ON featured_slots IS 
  'Non-negotiable: Only premium tier vendors can have active featured slots';

-- ============================================================================
-- 5. TRANSACTIONS LOG INDEXES
-- ============================================================================

-- Optimize commission ledger queries
CREATE INDEX IF NOT EXISTS idx_transactions_log_vendor_id ON transactions_log(vendor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_log_type ON transactions_log(type);
CREATE INDEX IF NOT EXISTS idx_transactions_log_created_at ON transactions_log(created_at DESC);

COMMENT ON TABLE transactions_log IS 'Immutable ledger: commission_deducted entries enforce non-refundable platform fee';

COMMIT;
