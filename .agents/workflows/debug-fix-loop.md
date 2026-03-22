---
description: Reproduce, diagnose, patch, and re-verify issues in SuburbmatesMelb while protecting truth-sensitive routing and legacy boundaries.
---

1. Reproduce the issue and capture concrete evidence:
   - failing route or command
   - console error
   - test failure
   - API/runtime error
2. Classify the issue surface. Does it involve:
   - frontend rendering, navigation, or mobile breakages
   - Open Graph parsing or payload failures (`/api/scrape`)
   - outbound routing or click tracking (`/api/redirect`)
   - deterministic rendering of daily seeded queries
   - Supabase/data model or RLS issues
   - transition conflicts with legacy transactional/checkout logic
   - SSOT/copy truth drift
3. Re-read the relevant constraints before patching:
   - `docs/README.md`
   - `.agents/rules/core-workspace-rules.md`
   - `.agents/rules/verification-rules.md`
4. Form a root-cause hypothesis from evidence, not guesswork.
5. Apply the smallest targeted fix that addresses the root cause.
6. Re-run the appropriate verification path:
   - `verify-frontend-change` for browser/UI/routing issues
   - `verify-backend-change` for API/logic/schema/migration issues
7. If the first fix fails, gather the new evidence before iterating again.
8. Escalate before continuing if the issue touches:
   - foundational outbound routing integrity or scraping payload changes
   - legacy payment semantics intersecting with new features
   - schema or migrations
   - destructive data operations
9. Summarize:
   - root cause and fix applied
   - verification evidence
   - remaining risk or follow-up
