-- ============================================================================
-- SuburbMates — Automation: pg_cron + pg_net + claim status trigger
-- Applied: 2026-04-11
--
-- Schedules (UTC, Melbourne = UTC+10 AEST / UTC+11 AEDT):
--   1. Daily 00:00 UTC  — expire featured slots       (pure SQL)
--   2. Daily 23:00 UTC  — featured expiry reminders   (09:00 AEDT)
--   3. Sunday 15:00 UTC — broken URL checker          (01:00 AEDT Mon)
--   4. Monday 22:00 UTC — incomplete listing nudge    (08:00 AEDT Tue)
--
-- Event trigger:
--   listing_claims.status → approved / rejected / more_info
--   → net.http_post → /api/webhooks/claim-status
--
-- REQUIRED after deployment (run once per environment):
--   ALTER DATABASE postgres SET app.base_url = 'https://your-domain.com';
--   ALTER DATABASE postgres SET app.cron_secret = '<CRON_SECRET>';
--   SELECT pg_reload_conf();
-- ============================================================================

-- Extensions (idempotent — already enabled on Supabase free tier)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================================
-- HELPER: HTTP GET for cron — wraps net.http_get with config guard
-- ============================================================================

CREATE OR REPLACE FUNCTION public.cron_http_get(path TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_url    TEXT := current_setting('app.base_url', true);
  cron_secret TEXT := current_setting('app.cron_secret', true);
BEGIN
  IF base_url IS NULL OR cron_secret IS NULL THEN
    RAISE WARNING '[cron_http_get] app.base_url or app.cron_secret not set — skipping %', path;
    RETURN;
  END IF;

  PERFORM net.http_get(
    url     := base_url || path,
    headers := jsonb_build_object('Authorization', 'Bearer ' || cron_secret),
    timeout_milliseconds := 55000
  );
END;
$$;

-- ============================================================================
-- SCHEDULE 1: Expire featured slots — pure SQL, no HTTP needed
-- Daily 00:00 UTC
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-featured-slots') THEN
    PERFORM cron.unschedule('expire-featured-slots');
  END IF;
END;
$$;

SELECT cron.schedule(
  'expire-featured-slots',
  '0 0 * * *',
  $sql$UPDATE featured_slots SET status = 'expired' WHERE end_date < now() AND status = 'active'$sql$
);

-- ============================================================================
-- SCHEDULE 2: Featured expiry reminders — daily 23:00 UTC (09:00 AEDT)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'featured-reminders') THEN
    PERFORM cron.unschedule('featured-reminders');
  END IF;
END;
$$;

SELECT cron.schedule(
  'featured-reminders',
  '0 23 * * *',
  $sql$SELECT public.cron_http_get('/api/ops/featured-reminders')$sql$
);

-- ============================================================================
-- SCHEDULE 3: Broken product URL check — Sunday 15:00 UTC (01:00 AEDT Mon)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'broken-links-check') THEN
    PERFORM cron.unschedule('broken-links-check');
  END IF;
END;
$$;

SELECT cron.schedule(
  'broken-links-check',
  '0 15 * * 0',
  $sql$SELECT public.cron_http_get('/api/ops/broken-links')$sql$
);

-- ============================================================================
-- SCHEDULE 4: Incomplete listing nudge — Monday 22:00 UTC (08:00 AEDT Tue)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'incomplete-listings-nudge') THEN
    PERFORM cron.unschedule('incomplete-listings-nudge');
  END IF;
END;
$$;

SELECT cron.schedule(
  'incomplete-listings-nudge',
  '0 22 * * 1',
  $sql$SELECT public.cron_http_get('/api/ops/incomplete-listings')$sql$
);

-- ============================================================================
-- TRIGGER: listing_claims status change → claim-status webhook (async)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trigger_claim_status_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_url    TEXT := current_setting('app.base_url', true);
  cron_secret TEXT := current_setting('app.cron_secret', true);
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status
     AND NEW.status IN ('approved', 'rejected', 'more_info') THEN

    IF base_url IS NULL OR cron_secret IS NULL THEN
      RAISE WARNING '[claim_status_notification] app.base_url or app.cron_secret not set — claim % notification skipped', NEW.id;
      RETURN NEW;
    END IF;

    PERFORM net.http_post(
      url     := base_url || '/api/webhooks/claim-status',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || cron_secret
      ),
      body    := jsonb_build_object(
        'claim_id',            NEW.id::text,
        'vendor_id',           NEW.vendor_id::text,
        'business_profile_id', NEW.business_profile_id::text,
        'status',              NEW.status,
        'admin_notes',         NEW.admin_notes
      ),
      timeout_milliseconds := 10000
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS claim_status_change_notification ON listing_claims;

CREATE TRIGGER claim_status_change_notification
  AFTER UPDATE OF status ON listing_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_claim_status_notification();
