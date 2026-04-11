-- Phase 6: featured_requests table
-- Stores creator-initiated featured placement requests.
-- Admin reviews pending requests and activates/rejects via admin dashboard (future pass).
-- Apply via: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.featured_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  region_id   integer NOT NULL REFERENCES public.regions(id),
  status      text NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

-- One active (pending/approved) request per vendor per region at a time
CREATE UNIQUE INDEX IF NOT EXISTS featured_requests_active_unique
  ON public.featured_requests (vendor_id, region_id)
  WHERE status IN ('pending', 'approved');

-- Index for admin review queue
CREATE INDEX IF NOT EXISTS featured_requests_status_idx
  ON public.featured_requests (status, created_at DESC);

-- RLS
ALTER TABLE public.featured_requests ENABLE ROW LEVEL SECURITY;

-- Vendors can see their own requests
CREATE POLICY "vendors_select_own_requests"
  ON public.featured_requests FOR SELECT
  USING (
    vendor_id IN (
      SELECT id FROM public.vendors WHERE user_id = auth.uid()
    )
  );

-- Vendors can insert their own requests
CREATE POLICY "vendors_insert_own_request"
  ON public.featured_requests FOR INSERT
  WITH CHECK (
    vendor_id IN (
      SELECT id FROM public.vendors WHERE user_id = auth.uid()
    )
  );

-- Admin (service role) has full access — no policy needed (service role bypasses RLS)
