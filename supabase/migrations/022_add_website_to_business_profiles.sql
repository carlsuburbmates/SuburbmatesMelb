-- Add website column to business_profiles table
ALTER TABLE public.business_profiles
ADD COLUMN IF NOT EXISTS website text;

-- Add comment for documentation
COMMENT ON COLUMN public.business_profiles.website IS 'Website URL for the business';
