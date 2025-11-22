-- Migration: Extend webhook_events with payload_summary JSONB
BEGIN;

ALTER TABLE IF EXISTS webhook_events
  ADD COLUMN IF NOT EXISTS payload_summary jsonb DEFAULT '{}'::jsonb;

COMMIT;
