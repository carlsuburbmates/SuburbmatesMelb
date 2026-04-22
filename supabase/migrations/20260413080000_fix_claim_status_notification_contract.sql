-- Correct claim-status notification contract to match the actual listing_claims schema.
-- listing_claims has claimant_user_id + business_profile_id, not vendor_id.

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
        'claim_id',    NEW.id::text,
        'status',      NEW.status,
        'admin_notes', NEW.admin_notes
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
