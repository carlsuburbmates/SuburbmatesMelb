# Concierge Seed Mapping Reference

> **Last validated:** 2026-04-01 against remote Supabase (`hmmqhwnxylqcbffjffpj`)
> **Source of truth:** Remote `regions` and `categories` tables. Local DB is banned.

To prevent structural data integrity failures, the initial seed inputs explicitly enforce flat string-to-ID translations against primary relationship constraints (`regions.id`, `categories.id`).

## REGION_MAP Constraints (String → ID)

These IDs are from the **remote production** `regions` table. They are NOT sequential from 1.

```json
{
  "Inner Metro": 13,
  "Inner South-east": 14,
  "Northern": 15,
  "Western": 16,
  "Eastern": 17,
  "Southern": 18
}
```

> [!CAUTION]
> Previous versions of this document contained incorrect IDs (1–6) and incorrect names (e.g., "Western Metro", "South Eastern Metro") sourced from a local DB instance. Those values do not exist in the remote database. Using them causes `vendors_primary_region_id_fkey` violations.

## CATEGORY_MAP Constraints (String → ID)

```json
{
  "Design & Art": 11,
  "Courses & Training": 11,
  "Graphics & Design": 12,
  "Software & Apps": 13,
  "Music & Audio": 14,
  "Photography": 15,
  "Business Services": 16,
  "Marketing Materials": 17,
  "Legal Documents": 18
}
```

## Hard-Fail Rule
The `resolveRegionId` and `resolveCategoryId` parser utility forces intentional process abandonment. If a provided CSV string yields a `null` equivalent in mapped memory, the script throws an unhandled error indicating index malfunction, ensuring isolated data pollution is aborted before processing touches live Supabase constraints.

## Maintenance Notes
- Any additional Regions or Categories introduced to the remote database MUST be simultaneously defined in `./scripts/seed-mapping.ts`.
- **Verification path:** Run `scripts/audit-remote.ts` to query the live region/category tables before updating mappings.
- **Never use `supabase db query`** for verification — it targets the local Postgres instance, which is banned in this project.
