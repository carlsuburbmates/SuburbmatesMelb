-- Migration 011: Featured business placement alignment
-- Converts featured slots/queue to operate on business profiles + suburb labels

BEGIN;

ALTER TABLE featured_slots
  ADD COLUMN IF NOT EXISTS business_profile_id UUID REFERENCES business_profiles(id),
  ADD COLUMN IF NOT EXISTS suburb_label TEXT;

UPDATE featured_slots
SET business_profile_id = bp.id
FROM business_profiles bp
JOIN vendors v ON v.user_id = bp.user_id
WHERE featured_slots.vendor_id = v.id
  AND featured_slots.business_profile_id IS NULL;

ALTER TABLE featured_slots
  ALTER COLUMN business_profile_id SET NOT NULL;

ALTER TABLE featured_slots
  DROP COLUMN IF EXISTS category_id;

ALTER TABLE featured_queue
  ADD COLUMN IF NOT EXISTS business_profile_id UUID REFERENCES business_profiles(id),
  ADD COLUMN IF NOT EXISTS suburb_label TEXT;

UPDATE featured_queue
SET business_profile_id = bp.id
FROM business_profiles bp
JOIN vendors v ON v.user_id = bp.user_id
WHERE featured_queue.vendor_id = v.id
  AND featured_queue.business_profile_id IS NULL;

ALTER TABLE featured_queue
  ALTER COLUMN business_profile_id SET NOT NULL;

ALTER TABLE featured_queue
  DROP COLUMN IF EXISTS category_id;

CREATE INDEX IF NOT EXISTS idx_featured_slots_business_profile ON featured_slots(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_featured_queue_business_profile ON featured_queue(business_profile_id);

COMMIT;
