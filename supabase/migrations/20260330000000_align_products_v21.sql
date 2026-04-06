-- Migration: Align products table with SSOT v2.1 Canonical Contract
-- 2026-03-30 00:00:00

DO $$ 
BEGIN 
  -- 0. Drop dependent triggers and functions (Legacy Quota model)
  DROP TRIGGER IF EXISTS trg_enforce_product_quota ON public.products;
  DROP FUNCTION IF EXISTS public.fn_enforce_product_quota();

  -- 1. Align Visibility Model (is_active)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'published') THEN
    -- Handle Policy Dependency
    DROP POLICY IF EXISTS "public_select_is_active" ON public.products;
    DROP POLICY IF EXISTS "public_select_published" ON public.products;
    
    ALTER TABLE public.products RENAME COLUMN published TO is_active;
    
    CREATE POLICY "public_select_is_active" ON public.products FOR SELECT USING (is_active = true);
  END IF;

  -- 2. Rename external_url to product_url
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'external_url') THEN
    ALTER TABLE public.products RENAME COLUMN external_url TO product_url;
  END IF;

  -- 3. Add is_archived
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_archived') THEN
    ALTER TABLE public.products ADD COLUMN is_archived BOOLEAN DEFAULT false;
  END IF;

  -- 4. Create image_urls
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_urls') THEN
    ALTER TABLE public.products ADD COLUMN image_urls TEXT[];
  END IF;

  -- 5. Migrate Data for image_urls
  UPDATE public.products 
  SET image_urls = CASE 
    WHEN images IS NOT NULL AND jsonb_array_length(images) > 0 THEN 
      (SELECT array_agg(val) FROM jsonb_array_elements_text(images) AS val)
    WHEN thumbnail_url IS NOT NULL THEN 
      ARRAY[thumbnail_url]
    ELSE 
      ARRAY[]::TEXT[]
  END
  WHERE image_urls IS NULL OR cardinality(image_urls) = 0;

  -- Update indices
  DROP INDEX IF EXISTS idx_products_published;
  DROP INDEX IF EXISTS idx_products_vendor_published;
  CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
  CREATE INDEX IF NOT EXISTS idx_products_is_archived ON public.products(is_archived);
  
END $$;
