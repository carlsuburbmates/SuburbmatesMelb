---
description: Reproduce, diagnose, patch, and re-verify issues in SuburbmatesMelb while protecting truth-sensitive and payment-sensitive behavior.
---

1. Reproduce the issue and capture concrete evidence:
   - failing route
   - failing command
   - console error
   - test failure
   - API/runtime error
2. Classify the issue surface:
   - frontend rendering/navigation
   - backend logic/API
   - Stripe/checkout/webhook
   - Supabase/data model
   - SSOT/copy truth drift
3. Re-read the relevant constraints before patching:
   - `docs/README.md`
   - `.agents/rules/core-workspace-rules.md`
   - `.agents/rules/verification-rules.md`
4. Form a root-cause hypothesis from evidence, not guesswork.
5. Apply the smallest targeted fix that addresses the root cause.
6. Re-run the appropriate verification path:
   - `verify-frontend-change` for browser/UI/redirect issues
   - `verify-backend-change` for API/logic/payment/schema issues
7. If the first fix fails, gather the new evidence before iterating again.
8. Escalate before continuing if the issue touches:
   - payment semantics
   - schema or migrations
   - legal/truth-sensitive product claims
   - destructive data operations
9. Summarize:
   - root cause
   - fix applied
   - verification evidence
   - remaining risk or follow-up
