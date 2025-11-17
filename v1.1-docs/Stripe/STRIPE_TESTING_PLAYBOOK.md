# Stripe Testing & Verification Playbook

**Scope:** Everything required to keep the Suburbmates V1.1 Stripe integration deterministic in dev/CI, fully exercised in staging, and production‑ready.  
**Sources:** Consolidates the guidance from `STRIPE_ACCESS_VERIFICATION.md`, `STRIPE_IMPLEMENTATION_COMPLETE.md`, `STRIPE_SETUP_SUMMARY.md`, and companion scripts under `scripts/`.

---

## 1. Local / CI Test Harness (Deterministic)

### 1.1 Environment & Dependencies
- Use the **test** keys in `.env.local`:
  ```
  STRIPE_SECRET_KEY=sk_test_…
  STRIPE_WEBHOOK_SECRET=whsec_test…
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…
  STRIPE_CLIENT_ID=ca_test… (optional in mocks)
  ```
- Install required packages before running any Stripe scripts:
  ```bash
  npm install dotenv stripe
  ```

### 1.2 Mocking Rules
- Set `DISABLE_RATE_LIMIT=true` and `STRIPE_MOCK_MODE=true` (or reuse `DISABLE_RATE_LIMIT`) when running Playwright/CI so:
  - `sendWelcomeEmail` short‑circuits (already tied to `DISABLE_RATE_LIMIT`).
  - Stripe helpers should return deterministic fake onboarding URLs / session IDs (add this as we expand scripts).
- Never hit live mode from CI—always use the sandbox credentials above.

### 1.3 Required Scripts
Run these before each Playwright or branch CI job:
1. **Access verification**  
   ```
   node scripts/verify-stripe-access.js
   ```
   Ensures env vars match the requirements listed in `STRIPE_ACCESS_VERIFICATION.md`.

2. **Integration sanity** (mock mode)  
   ```
   node scripts/test-stripe-integration.js
   ```
   Exercises checkout/session creation, webhook signature verification, and Connect stubs.

3. **Product quotas** (already wired)  
   Ensure migrations 008 & 009 have run so Supabase enforces JSONB columns + tier quotas.

### 1.4 Automated Test Coverage
- `DISABLE_RATE_LIMIT=true PLAYWRIGHT_BASE_URL=… npx playwright test`  
  Ensure `tests/e2e/product-crud-caps.spec.ts` remains green (10 published products OK, 11th 403, draft flows pass).
- Vitest/Unit tests should cover:
  - `src/lib/stripe-config.js` (env validation).
  - `src/lib/stripe.ts` helpers (via mocks).
  - Webhook handlers (simulate event payloads).

---

## 2. Staging “Full Stripe” Verification

Once per day (or before deploy), run against a TLS staging env with **test-mode** Stripe keys:

1. **Dashboard prerequisites**
   - Connect Standard enabled, OAuth redirect URLs registered (see `STRIPE_SETUP_SUMMARY.md`).
   - Products/prices live with IDs:
     - `prod_TPuOEuSTspxJVj` / `price_1ST4bqL1jaQsKn6Z6epmFbh9` (Vendor Pro, recurring A$20).
     - `prod_TPuPw6OUFH7W56` / `price_1ST4atL1jaQsKn6ZGWmPQAu4` (Featured slot, one-time A$20).
   - Webhook endpoint `https://staging.suburbmates.com/api/webhook/stripe` subscribed to:
     `checkout.session.completed`, `payment_intent.succeeded`, `charge.dispute.*`, `customer.subscription.*`, `charge.refunded`.

2. **Execution steps**
   - Deploy staging with real HTTPS + test keys.
   - Run:
     ```
     node scripts/verify-stripe-access.js
     node scripts/test-stripe-integration.js --env staging
     ```
   - Manually drive one end-to-end flow (vendors connect + buy Featured slot) using Stripe’s test cards.
   - Validate webhook logs (Stripe Dashboard + `/tmp/next-dev.log`) to ensure signatures verify and Supabase state updates.

3. **Artifacts**
   - Save the console output to `/reports/stripe-staging-YYYYMMDD.md`.
   - File any discrepancies in `STRIPE_IMPLEMENTATION_COMPLETE.md` status table.

---

## 3. Production Gate & Monitoring

Before promoting to prod:
1. Re-run verification scripts with **live** keys (do **not** run Playwright with live keys).
2. Confirm Connect client ID, products, and webhook secrets in `.env.production` (mirrors `STRIPE_SETUP_SUMMARY.md`).
3. Enable Stripe Dashboard alerts for:
   - Webhook failure rate.
   - Disputes and payouts.
4. Document the rollback plan: how to rotate Stripe keys and replay webhook events (via Stripe Dashboard → Events → “Replay”).

After go-live:
- Monitor `/tmp/next-dev.log` (or structured logs) for `Stripe` namespace messages.
- Re-run `scripts/verify-stripe-access.js` whenever env vars change.

---

## 4. Folder & Documentation Map

| File | Purpose |
|------|---------|
| `STRIPE_ACCESS_VERIFICATION.md` | Step-by-step verification + scripts |
| `STRIPE_IMPLEMENTATION_COMPLETE.md` | Overview of helpers & scripts |
| `STRIPE_SETUP_SUMMARY.md` | Current Stripe dashboard state, product IDs |
| `STRIPE_SCRIPT_FIX.md` | Dependency requirements for scripts |
| `stripe-acl-compliance*.md` | ACL/legal constraints (reference for MPL obligations) |

Keep this playbook in sync whenever those docs change. Any new Stripe surface area (e.g., refunds, payouts) should add a section here and corresponding automated checks.

### 4.1 Stripe CLI + Webhook Workflow (for Copilot)

Use this flow whenever Copilot (or any developer) needs to run end-to-end tests against the local webhook:

1. **Prerequisites**
   - Install the Stripe CLI: https://stripe.com/docs/stripe-cli
   - Log in once: `stripe login` (opens browser)
   - Ensure `.env.local` uses **test** keys (`sk_test_*`, `pk_test_*`)

2. **Start local API + Supabase**
   ```bash
   DISABLE_RATE_LIMIT=true npm run dev
   ```

3. **Forward webhooks via Stripe CLI**
   ```bash
   stripe listen --forward-to http://localhost:3010/api/webhook/stripe
   ```
   - The CLI prints a signing secret (e.g., `whsec_123`). Copy it into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

4. **Trigger events for verification**
   Run any of the built-in triggers to simulate real payments:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger payment_intent.succeeded
   stripe trigger customer.subscription.created
   ```
   Watch `/tmp/next-dev.log` (or console) to confirm our webhook handler processes each event without errors.

5. **Coordinated tests**
   - While `stripe listen` runs, execute Playwright or manual flows (signup → vendor onboarding → checkout). Webhooks will reach the local server exactly as they do in staging.
   - After testing, press Ctrl‑C in the CLI window to stop forwarding.

6. **Document results**
   - Capture the CLI output and local logs in `/reports/stripe-cli-YYYYMMDD.md`.
   - Note any failures so we can trace them via event IDs in Stripe Dashboard → Developers → Events.

These steps align with the verification scripts in `STRIPE_IMPLEMENTATION_COMPLETE.md`; use them whenever Copilot needs to interact with Stripe in your local environment.

---

## 5. Adoption Checklist

1. [ ] Install/maintain `dotenv` + `stripe` packages.
2. [ ] Keep `.env.local`, `.env.staging`, `.env.production` aligned with real/test keys.
3. [ ] Run verification + integration scripts before every CI suite and staging deploy.
4. [ ] Run Playwright `product-crud-caps` test serially with `DISABLE_RATE_LIMIT=true`.
5. [ ] Perform end-to-end staging drill weekly (Connect + Checkout + webhooks).
6. [ ] Log/alert on Stripe failures in production.

Following this playbook ensures every release exercises Stripe from mocked dev flows through full test-mode staging, and nothing hits production without passing both layers. Adopt it as the default from now on.
