-- Migration 021: Add business images
-- Adds an 'images' JSONB column to business_profiles to support image galleries
-- Date: 2024-05-23

BEGIN;

-- Add images column as JSONB array to support multiple business images
ALTER TABLE business_profiles
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add constraint to ensure images is an array
ALTER TABLE business_profiles
ADD CONSTRAINT business_profiles_images_is_array
CHECK (jsonb_typeof(images) = 'array');

-- Add constraint to limit image count (max 10 for business gallery)
ALTER TABLE business_profiles
ADD CONSTRAINT business_profiles_images_max_count
CHECK (jsonb_array_length(images) <= 10);

-- Index for images JSONB queries
CREATE INDEX IF NOT EXISTS idx_business_profiles_images_gin ON business_profiles USING gin (images);

COMMENT ON COLUMN business_profiles.images IS 'JSONB array of image URLs for business gallery, max 10 images';

COMMIT;
