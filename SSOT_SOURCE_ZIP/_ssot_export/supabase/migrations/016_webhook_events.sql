-- Migration: Add webhook_events table for idempotent webhook processing
BEGIN;

CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb,
  processed_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);

COMMIT;
