---
description: Validate frontend changes in SuburbmatesMelb with attention to truth alignment, marketplace/product flows, redirects, and browser-visible behavior.
---

1. Identify the changed frontend surfaces and whether they affect:
   - home or directory pages
   - `/marketplace`
   - `/products/[slug]`
   - vendor pages and profile/product displays
   - CTA, redirect, or navigation logic
   - legal or explanatory copy
2. Re-check `docs/README.md` if the change affects marketplace, product, vendor, featured, pricing, or tier language.
3. Ensure the app is running in a usable local state. Use the repo’s actual run context:
   - `npm run dev` for development
   - `http://localhost:3010` for E2E/browser-style validation when applicable
4. Invoke `frontend-ui-verification` for the changed route or UI surface.
5. Verify:
   - page renders successfully
   - intended UI appears
   - redirects/CTAs lead to the intended destination
   - browser console messages and relevant network failures do not reveal newly introduced issues
   - visible runtime issues are absent
6. If the marketplace is being simplified or redirected, explicitly verify:
   - what route the old user flow now lands on
   - whether copy still overpromises marketplace behavior
   - whether related pages still create inconsistent expectations
7. If the change affects important user journeys, run the most relevant supporting checks:
   - `npm run lint`
   - `npm run build`
   - `npm run test:e2e` when the route or flow is critical and the environment is ready
8. Summarize:
   - what UI/path behavior changed
   - what routes/interactions were verified
   - whether copy and flow remain aligned with SSOT
   - any remaining risks
