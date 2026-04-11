-- Phase 5B: Drop dead tables
-- Pre-flight confirmed: appeals=0 rows, reviews=0 rows (verify before running).
-- No active code references either table. Verified: 2026-04-11.

DROP TABLE IF EXISTS appeals CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
