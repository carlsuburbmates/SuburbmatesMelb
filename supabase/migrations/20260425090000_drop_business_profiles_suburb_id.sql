-- Remove legacy location compatibility column.
-- Canonical location source is vendors.primary_region_id.

alter table public.business_profiles
  drop column if exists suburb_id;
