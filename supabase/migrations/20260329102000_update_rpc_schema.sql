-- Update daily_shuffle RPC to align with SSOT v2.1 schema
-- Replaces thumbnail_url -> image_urls[1] (as text) and external_url -> product_url
-- Uses is_active and is_archived for visibility check

DROP FUNCTION IF EXISTS get_daily_shuffle_products(int);

CREATE OR REPLACE FUNCTION get_daily_shuffle_products(p_limit int DEFAULT 12)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_urls TEXT[],
  product_url TEXT,
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
    p.title::TEXT,
    p.description::TEXT,
    p.image_urls,
    p.product_url::TEXT,
    p.vendor_id,
    v.business_name::TEXT,
    bp.slug::TEXT as business_slug,
    p.created_at
  FROM public.products p
  JOIN public.vendors v ON p.vendor_id = v.id
  JOIN public.business_profiles bp ON v.user_id = bp.user_id
  WHERE p.is_active = true
    AND (p.is_archived = false OR p.is_archived IS NULL)
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
