# LISTING OPERATIONS RUNBOOK
> How to add, manage, and maintain creator listings in the Suburbmates directory.

---

## 1. Current State (as of 16 April 2026)

| Metric | Count |
|---|---|
| Total listings | 27 (26 unclaimed + 1 test) |
| Inner Metro region | 19 listings |
| Northern region | 7 listings |
| Categories covered | 7 of 18 (Graphics & Design, Business Services, Marketing Materials, Photography, Music & Audio, Courses & Training) |
| Unclaimed listings | 26 |
| Claimed listings | 0 |

---

## 2. Listing Types

### Unclaimed Listing
- Created by the concierge seed script
- Owned by a placeholder auth user (`unclaimed+{slug}@suburbmates.internal`)
- Fully visible in the public directory (`is_public = true`, `vendor_status = 'active'`)
- Awaiting creator to find and claim via the search-first onboarding flow
- Has: business_profile, vendor record, 1+ products (scraped from website)

### Claimed Listing
- Owned by a real authenticated user (real email, real auth session)
- Creator has full dashboard access to edit profile, add products, manage settings
- Claim transfer replaces the placeholder `user_id` across: auth.users, public.users, vendors, business_profiles

---

## 3. How to Add New Listings

### Step 1: Research
- Find real Melbourne digital creators with a **verified website**
- Confirm **suburb/region** (Inner Metro = region 13, Northern = region 15, etc.)
- Confirm **category** maps to an existing category in the database
- **Never infer emails** — if no verified email, leave blank. Listing will be unclaimed.

### Step 2: Add to CSV
Edit `/scripts/seed_queue.csv`:
```csv
business_name,region,category,description,product_url
"New Creator Name","Inner Metro","Graphics & Design","Verified description of what they do.",https://their-website.com.au
```

Required columns:
| Column | Required | Notes |
|---|---|---|
| `business_name` | YES | Real verified name |
| `region` | YES | Must match `seed-mapping.ts` (e.g., "Inner Metro", "Northern") |
| `category` | YES | Must match `seed-mapping.ts` (e.g., "Graphics & Design", "Photography") |
| `description` | YES | Factual description — do not embellish or invent |
| `product_url` | YES | Verified working URL — the seeder scrapes OG metadata from this |

### Step 3: Dry Run
```bash
npx tsx --env-file=.env.local scripts/seed-unclaimed.ts --dry-run
```
Validates all mappings and scrapes without writing to the database.

### Step 4: Seed
```bash
npx tsx --env-file=.env.local scripts/seed-unclaimed.ts
```
Writes to the live Supabase database. Aborts on first failure with cleanup.

### Step 5: Verify
```bash
npx tsx --env-file=.env.local scripts/audit-remote.ts
```
Confirms all records are in place.

---

## 4. How the Claim Flow Works

1. **Creator signs up** → lands on search-first onboarding
2. **Searches directory** → finds their business already listed
3. **Clicks "Claim"** → `ClaimModal` opens → submits claim request
4. **Claim stored** in `listing_claims` table with status `pending`
5. **Admin reviews** → approves or rejects
6. **On approval**: Admin transfers ownership:
   - Update `business_profiles.user_id` → claiming user's id
   - Update `vendors.user_id` → claiming user's id
   - Delete the old placeholder auth user (`unclaimed+{slug}@suburbmates.internal`)
   - Delete the old `public.users` row for the placeholder

### Manual Claim Transfer (Admin SQL)
```sql
-- 1. Get the claiming user's ID (from their auth session/email)
-- 2. Get the listing's current placeholder user_id from business_profiles

-- Transfer ownership
UPDATE business_profiles SET user_id = '{claiming_user_id}' WHERE slug = '{business_slug}';
UPDATE vendors SET user_id = '{claiming_user_id}' WHERE user_id = '{old_placeholder_user_id}';

-- Cleanup placeholder
DELETE FROM users WHERE id = '{old_placeholder_user_id}';
-- Then delete from auth.users via Supabase dashboard or admin API
```

---

## 5. Region & Category Mappings

### Regions (current)
| ID | Name |
|---|---|
| 13 | Inner Metro |
| 14 | Inner South-East |
| 15 | Northern |
| 16 | Western |
| 17 | Eastern |
| 18 | Southern |

### Categories (current)
| ID | Name |
|---|---|
| 11 | Guides & Ebooks |
| 12 | Graphics & Design |
| 13 | Software & Apps |
| 14 | Music & Audio |
| 15 | Photography |
| 16 | Business Services |
| 17 | Marketing Materials |
| 18 | Legal Documents |

See `/scripts/seed-mapping.ts` for the canonical mapping functions.

---

## 6. Data Integrity Rules

1. **Never infer emails** — if not verified from the creator's website, leave blank (listing is unclaimed)
2. **Never invent descriptions** — use factual info from the business website or flag as unknown
3. **Always verify the website URL** loads before adding to CSV
4. **Always confirm the suburb/region** from the business website or directory listing
5. **One product per listing minimum** — the seeder scrapes OG metadata from `product_url` as the initial product
6. **Abort on failure** — the seeder stops on first error and cleans up partial writes. Fix the CSV row and re-run.
7. **Placeholder emails follow strict pattern** — `unclaimed+{slug}@suburbmates.internal`. These are system identifiers, not real emails.

---

## 7. Removing a Listing

If a business requests removal or data is found to be incorrect:

```sql
-- Find the listing
SELECT id, user_id, slug FROM business_profiles WHERE slug = '{slug}';

-- Delete in order (FK chain)
DELETE FROM products WHERE vendor_id IN (SELECT id FROM vendors WHERE user_id = '{user_id}');
DELETE FROM business_profiles WHERE user_id = '{user_id}';
DELETE FROM vendors WHERE user_id = '{user_id}';
DELETE FROM users WHERE id = '{user_id}';
-- Then delete auth user via Supabase dashboard
```

---

## 8. Scaling Beyond 30

### Next regions to seed
- **Eastern** (region 17) — Hawthorn, Box Hill, Camberwell studios
- **Western** (region 16) — Footscray, Yarraville creative studios
- **Inner South-East** (region 14) — South Yarra, Prahran, Windsor

### Categories to diversify
- **Software & Apps** (13) — Melbourne indie makers, SaaS founders
- **Guides & Ebooks** (11) — Melbourne authors, educators, coaches
- **Legal Documents** (18) — Melbourne legal tech, template providers

### Research sources
- Google Maps: `"[suburb] design studio"`, `"[suburb] creative agency"`
- Clutch.co, DesignRush, The Manifest — filter by Melbourne suburb
- LinkedIn: `"based in [suburb]" "creative" OR "digital"`
- Local council creative directories (City of Yarra, Merri-bek, etc.)

---

## 9. Files Reference

| File | Purpose |
|---|---|
| `/scripts/seed_queue.csv` | Input CSV — all listings to seed |
| `/scripts/seed-unclaimed.ts` | Seeder script (v3) — creates unclaimed listings |
| `/scripts/seed-concierge.ts` | Original seeder (requires real email — for claimed listings) |
| `/scripts/seed-mapping.ts` | Region/category name → ID resolution |
| `/scripts/audit-remote.ts` | Database audit — counts and integrity checks |
| `/scripts/research_findings.md` | Research notes from initial seed batch |
| `/docs/CONCIERGE_SEEDING_SPEC.md` | Original seeding architecture spec |
| `/docs/CLAIM_HANDOVER_BOUNDARY.md` | Claim flow architecture |
| `/docs/WORKFLOWS.md` | End-to-end workflow documentation |
