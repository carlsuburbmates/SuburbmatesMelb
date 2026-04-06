# Concierge Seeding Input Specification

This file strictly structures the expected inputs of the CSV file injected into the root seeding mechanism.

## Standard Form Constraint
Name the target document `seed_queue.csv` residing within `./scripts/`.

### Note on Quota Maximum
A maximum of 5 products should be seeded sequentially per single creator `email` address payload via subsequent runs. Overpopulating products disrupts targeted discovery density priorities.

## Required Columns (Exact Matches)
1. `email`
   - Role: Authentication index generator.
   - Validation: Must be RFC active format. Must not already exist in `auth.users`.

2. `business_name`
   - Role: Origin string for visual naming and root URL resolution (`slug`).
   - Validation: Alphanumeric standard limit.

3. `region`
   - Role: Physical grouping index string.
   - Validation: Strict literal match with one of the predefined regional keys (e.g. `Inner Metro`). Fails script parsing if mismatched.

4. `category`
   - Role: Primary discovery grouping string.
   - Validation: Strict literal match with predefined category schema string (e.g. `Photography`). Fails script parsing if mismatched.

5. `description`
   - Role: General bio index.
   - Validation: Escaped textual standard, no character limit imposed by seeder.

6. `product_url`
   - Role: External product routing mechanism and the dedicated scraping mechanism origin.
   - Validation: Absolute valid URL structure (`https://...`). Should return valid HTTP 200 responses to typical `fetch` executions.

## Validation Examples

### Valid Data Row
```csv
email,business_name,region,category,description,product_url
hello@suburbmates.com.au,"Suburbmates Launch Partner","Inner Metro","Photography","A curated directory profile example.","https://suburbmates.com.au"
```

### Invalid Data Row (Errors Expected)
```csv
email,business_name,region,category,description,product_url
bad-string,"Missing Category Example","Unknown Region District",,"No bio provided","not_a_url"
```
*Script response:* The parser will throw hard extraction block on null categories and unrecognized regions via definition tables, and immediately crash parsing operations.
