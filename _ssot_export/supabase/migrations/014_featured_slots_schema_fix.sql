-- Migration 014: Reconcile featured_slots schema to Stage-3 expectations
BEGIN;

-- Add canonical columns that Stage-3 code and RPC expect. Use IF NOT EXISTS where possible
ALTER TABLE IF EXISTS featured_slots
  ADD COLUMN IF NOT EXISTS vendor_id uuid,
  ADD COLUMN IF NOT EXISTS business_profile_id uuid,
  ADD COLUMN IF NOT EXISTS lga_id integer,
  ADD COLUMN IF NOT EXISTS suburb_label text;

-- Rename legacy timestamp columns if present (safe noop if not)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='featured_slots' AND column_name='start_at') THEN
    EXECUTE 'ALTER TABLE featured_slots RENAME COLUMN start_at TO start_date';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='featured_slots' AND column_name='end_at') THEN
    EXECUTE 'ALTER TABLE featured_slots RENAME COLUMN end_at TO end_date';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='featured_slots' AND column_name='purchased_at') THEN
    EXECUTE 'ALTER TABLE featured_slots RENAME COLUMN purchased_at TO created_at';
  END IF;
END
$$;

-- Ensure canonical columns exist for payments and status
ALTER TABLE IF EXISTS featured_slots
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS charged_amount_cents integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Add foreign key constraints if referencing tables exist and fk not present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'vendors') THEN
    BEGIN
      ALTER TABLE featured_slots
        ADD CONSTRAINT IF NOT EXISTS featured_slots_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_table THEN
      -- ignore
    END;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'business_profiles') THEN
    BEGIN
      ALTER TABLE featured_slots
        ADD CONSTRAINT IF NOT EXISTS featured_slots_business_profile_id_fkey FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_table THEN
    END;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'lgas') THEN
    BEGIN
      ALTER TABLE featured_slots
        ADD CONSTRAINT IF NOT EXISTS featured_slots_lga_id_fkey FOREIGN KEY (lga_id) REFERENCES lgas(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_table THEN
    END;
  END IF;
END
$$;

-- Recreate helpful indexes (use IF NOT EXISTS pattern where possible)
CREATE INDEX IF NOT EXISTS idx_featured_slots_lga_status ON featured_slots (lga_id, status);
CREATE INDEX IF NOT EXISTS idx_featured_slots_stripe_pi ON featured_slots (stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_featured_slots_expires_at ON featured_slots (end_date);

COMMIT;
