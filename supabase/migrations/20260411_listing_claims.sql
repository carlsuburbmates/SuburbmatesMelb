-- Phase 6: listing_claims table
-- Stores creator claim requests for pre-seeded or existing listings.
-- Admin reviews pending claims and approves/rejects via admin dashboard (future pass).
-- Apply via: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.listing_claims (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claimant_user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_profile_id uuid NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  evidence_text       text,
  status              text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'approved', 'rejected', 'more_info')),
  admin_notes         text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  reviewed_at         timestamptz
);

-- One active (non-rejected) claim per user per listing
CREATE UNIQUE INDEX IF NOT EXISTS listing_claims_active_unique
  ON public.listing_claims (claimant_user_id, business_profile_id)
  WHERE status IN ('pending', 'approved', 'more_info');

-- Index for admin review queue (all pending)
CREATE INDEX IF NOT EXISTS listing_claims_status_idx
  ON public.listing_claims (status, created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER listing_claims_updated_at
  BEFORE UPDATE ON public.listing_claims
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.listing_claims ENABLE ROW LEVEL SECURITY;

-- Claimants can see their own claims
CREATE POLICY "claimants_select_own"
  ON public.listing_claims FOR SELECT
  USING (claimant_user_id = auth.uid());

-- Any authenticated user can submit a claim
CREATE POLICY "authenticated_insert_claim"
  ON public.listing_claims FOR INSERT
  WITH CHECK (claimant_user_id = auth.uid());

-- Admin (service role) has full access — no policy needed (service role bypasses RLS)
