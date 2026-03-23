-- daily_shuffle RPC
-- Randomizes non-featured products daily based on CURRENT_DATE seed.
-- Returns joined vendor/profile info for organic discovery.

DROP FUNCTION IF EXISTS get_daily_shuffle_products(int);

CREATE OR REPLACE FUNCTION get_daily_shuffle_products(p_limit int DEFAULT 12)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  external_url TEXT,
  vendor_id UUID,
  business_name TEXT,
  business_slug TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.thumbnail_url,
    p.external_url,
    p.vendor_id,
    v.business_name,
    bp.slug as business_slug,
    p.created_at
  FROM public.products p
  JOIN public.vendors v ON p.vendor_id = v.id
  JOIN public.business_profiles bp ON v.user_id = bp.user_id
  WHERE p.published = true
    AND p.deleted_at IS NULL
    AND bp.is_public = true
    AND NOT EXISTS (
      SELECT 1 FROM public.featured_slots fs
      WHERE fs.vendor_id = p.vendor_id
        AND fs.status = 'active'
        AND fs.end_date >= CURRENT_DATE
    )
  ORDER BY md5(p.id::text || CURRENT_DATE::text)
  LIMIT p_limit;
END;
$$;
