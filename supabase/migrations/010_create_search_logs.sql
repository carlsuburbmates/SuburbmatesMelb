-- Migration 010: Search Logs table replacing legacy search_telemetry storage
-- Stores hashed queries + filters, result counts, and session identifiers

BEGIN;

DROP TABLE IF EXISTS search_telemetry CASCADE;

CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hashed_query TEXT NOT NULL,
  filters JSONB,
  result_count INTEGER,
  session_id TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_logs_hashed_query ON search_logs(hashed_query);
CREATE INDEX IF NOT EXISTS idx_search_logs_user_id ON search_logs(user_id) WHERE user_id IS NOT NULL;

COMMENT ON TABLE search_logs IS 'PII-redacted search queries (hashed) with filters/result counts for analytics';
COMMENT ON COLUMN search_logs.hashed_query IS 'SHA-256 hash with salt; raw query never stored';

COMMIT;
