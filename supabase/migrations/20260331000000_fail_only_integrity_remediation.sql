-- Remediation: Drop strictly documented remaining legacy items

-- 1. Drop unused commerce tables
DROP TABLE IF EXISTS public.featured_queue CASCADE;
DROP TABLE IF EXISTS public.transactions_log CASCADE;

-- 2. Drop legacy vendor commerce columns
ALTER TABLE public.vendors 
  DROP COLUMN IF EXISTS commission_rate,
  DROP COLUMN IF EXISTS payment_reversal_count,
  DROP COLUMN IF EXISTS stripe_account_status,
  DROP COLUMN IF EXISTS stripe_onboarding_complete;

-- 3. Drop PII telemetry columns
ALTER TABLE public.outbound_clicks
  DROP COLUMN IF EXISTS ip_address,
  DROP COLUMN IF EXISTS user_agent;
