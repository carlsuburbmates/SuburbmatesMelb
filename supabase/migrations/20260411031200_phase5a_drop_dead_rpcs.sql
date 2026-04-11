-- Phase 5A: Drop dead RPCs
-- Safe to run: no data affected, no active code references any of these functions.
-- Verified: 2026-04-11 via full codebase grep + type audit.

-- Appeals-era RPCs (depend on dead appeals table)
DROP FUNCTION IF EXISTS auto_reject_expired_appeals();
DROP FUNCTION IF EXISTS is_appeal_within_deadline(uuid);

-- Quota-era RPC (quota system removed in Phase 3 migrations)
DROP FUNCTION IF EXISTS fn_unpublish_oldest_products();
