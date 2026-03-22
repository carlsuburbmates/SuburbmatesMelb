---
description: Validate backend or logic changes in SuburbmatesMelb with special attention to truth-sensitive, routing, scraping, and schema-sensitive behavior.
---

1. Identify the changed backend or logic surfaces and classify whether they affect:
   - outbound click tracking (`/api/redirect`)
   - URL scraping payloads (`/api/scrape`)
   - daily randomized seed queries
   - Supabase queries, RLS logic, or migrations
   - legacy checkout or Stripe webhook logic
   - legal or truth-sensitive behavior
2. Re-read the relevant SSOT sections in `docs/README.md` before validating behavior that changes discovery, routing, region semantics, or founder payments.
3. Invoke `gap-verification` on the changed logic to inspect for:
   - incomplete behavior
   - unhandled edge cases
   - regressions
   - missing error handling
4. Run the most relevant repo checks:
   - `npm run test:unit`
   - `npm run lint`
   - `npm run build`
   Use judgment based on scope, but do not skip verification silently.
5. If legacy checkout or Stripe logic changed, verify it only impacts featured placement manual administration or safely deprecates legacy product commerce without breaking shared dependencies.
6. If database behavior changed, inspect the affected `supabase/migrations/` files and ensure the intended model matches SSOT assumptions (e.g., strict RLS isolation, `outbound_clicks` tracking).
7. If failures occur, analyze the root cause before retrying.
8. Summarize:
   - what backend behavior changed
   - what was verified
   - whether truth/routing/schema assumptions, and legacy safety boundaries, remain aligned
   - any blockers or risks
