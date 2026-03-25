-- Phase 1: The Database Guillotine (Schema Purge)
-- Generated to align with SSOT v2.0 (Aggressively Minimal Directory)

-- DROP tables related to legacy commerce and marketplace
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS marketplace_sales CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS refund_requests CASCADE;
DROP TABLE IF EXISTS user_tiers CASCADE;

-- Enforce manual billing on featured slots by removing automated payment intent tracking
ALTER TABLE featured_slots DROP COLUMN IF EXISTS stripe_payment_intent_id;
