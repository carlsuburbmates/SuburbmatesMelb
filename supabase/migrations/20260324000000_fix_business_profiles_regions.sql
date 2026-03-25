-- Fix business_profiles to correctly reference the new regions table
-- This restores the relationship required for the SSOT v2.0 directory search.

-- 1. Ensure the column exists and type matches (already INTEGER from alignment migration)
-- 2. Add the foreign key constraint with the EXACT hint name expected by PostgREST/Search logic
ALTER TABLE business_profiles
  DROP CONSTRAINT IF EXISTS business_profiles_suburb_id_fkey,
  ADD CONSTRAINT business_profiles_suburb_id_fkey 
  FOREIGN KEY (suburb_id) REFERENCES regions(id) ON DELETE SET NULL;

-- 3. Also fix category relationship just in case it's misnamed
ALTER TABLE business_profiles 
  DROP CONSTRAINT IF EXISTS business_profiles_category_id_fkey,
  ADD CONSTRAINT business_profiles_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- 4. Re-map existing suburb_id to a default region (Inner Metro = 1) if they are now invalid 
--    (Old LGAs had higher IDs, new regions are 1-6)
UPDATE business_profiles 
SET suburb_id = 1 
WHERE suburb_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM regions WHERE id = business_profiles.suburb_id);

-- 5. Add index for search performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_suburb_id ON business_profiles(suburb_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_category_id ON business_profiles(category_id);
