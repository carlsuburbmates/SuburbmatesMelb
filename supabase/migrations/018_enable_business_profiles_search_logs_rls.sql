-- Migration: Enable RLS on business_profiles and search_logs
-- Ensures SSOT compliance for vendor privacy and telemetry protection

BEGIN;

-- Business Profiles RLS
ALTER TABLE IF EXISTS business_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business profile owners manage their record" ON business_profiles;
CREATE POLICY "Business profile owners manage their record"
ON business_profiles
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can read published business profiles" ON business_profiles;
CREATE POLICY "Public can read published business profiles"
ON business_profiles
FOR SELECT USING (
  is_public = TRUE
  OR auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins manage business profiles" ON business_profiles;
CREATE POLICY "Admins manage business profiles"
ON business_profiles
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
  )
);

-- Search Logs RLS
ALTER TABLE IF EXISTS search_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Record hashed search telemetry" ON search_logs;
CREATE POLICY "Record hashed search telemetry"
ON search_logs
FOR INSERT
WITH CHECK (
  auth.uid() IS NULL
  OR auth.uid() = user_id
);

DROP POLICY IF EXISTS "Vendors/customers read their telemetry" ON search_logs;
CREATE POLICY "Vendors/customers read their telemetry"
ON search_logs
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage search telemetry" ON search_logs;
CREATE POLICY "Admins manage search telemetry"
ON search_logs
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
  )
);

COMMIT;
