alter table "public"."business_profiles" drop constraint if exists "business_profiles_suburb_id_fkey";
drop index if exists "public"."idx_business_profiles_suburb_id";
