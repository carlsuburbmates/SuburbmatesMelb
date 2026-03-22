---
description: Validate backend or logic changes in SuburbmatesMelb with special attention to truth-sensitive, payment-sensitive, and schema-sensitive behavior.
---

1. Identify the changed backend or logic surfaces and classify whether they affect:
   - checkout/session creation
   - Stripe webhook handling
   - vendor product CRUD
   - tier limits or featured logic
   - Supabase queries or migrations
   - legal or truth-sensitive behavior
2. Re-read the relevant SSOT sections in `docs/README.md` before validating behavior that changes product, marketplace, vendor, payment, or tier semantics.
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
5. If checkout, Stripe, or order semantics changed, inspect the related files directly:
   - `src/app/api/checkout/route.ts`
   - `src/app/api/webhooks/stripe/handler.ts`
   - `src/lib/stripe.ts`
   - `src/lib/database.types.ts`
6. If database behavior changed, inspect the affected `supabase/migrations/` files and ensure the intended model still matches SSOT and code assumptions.
7. If failures occur, analyze the root cause before retrying.
8. Summarize:
   - what backend behavior changed
   - what was verified
   - whether truth/payment/schema assumptions remain aligned
   - any blockers or risks
