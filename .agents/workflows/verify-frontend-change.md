---
description: Validate frontend changes in SuburbmatesMelb with attention to truth alignment, mobile-first density, outbound routing, and browser-visible behavior.
---

1. Identify the changed frontend surfaces and whether they affect:
   - home, directory, or region-filtered pages
   - creator profiling and product display cards
   - scraping/onboarding forms
   - outbound CTA, redirect, or navigation logic
   - removed or legacy marketplace pathways
   - legal or explanatory copy
2. Re-check `docs/README.md` if the change affects directory, density constraints, region terminology, or outbound routing claims.
3. Ensure the app is running in a usable local state. Use the repo’s actual run context:
   - `npm run dev` for development
   - `http://localhost:3010` for E2E/browser-style validation when applicable
4. Invoke `frontend-ui-verification` for the changed route or UI surface.
5. Verify:
   - page renders successfully
   - intended UI appears with strict adherence to high-density limitations (e.g., text clamping on mobile)
   - outbound "Buy/Support" CTAs correctly hit the `/api/redirect` endpoint mapping
   - legacy UI elements (e.g., internal carts) do not falsely promise in-app checkouts
   - browser console messages and relevant network failures do not reveal newly introduced issues
6. If the change touches legacy paths (like the old `/marketplace`), explicitly verify what redirects occur and ensure user expectation matches the new SSOT.
7. If the change affects important user journeys, run the most relevant supporting checks:
   - `npm run lint`
   - `npm run build`
   - `npm run test:e2e` when the route or flow is critical and the environment is ready
8. Summarize:
   - what UI/path behavior changed
   - what routes/interactions were verified
   - whether copy, density, and flow remain aligned with SSOT
   - any remaining risks
