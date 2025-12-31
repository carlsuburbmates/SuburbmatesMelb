# Suburbmates — Ops Runbook (Solo Founder, No SLA)

This runbook describes how to operate Suburbmates as a solo founder.
It contains **no SLA promises**, **no fake roles/team**, and **no claims of automation coverage**.
For product truth, see `docs/README.md`. For execution sequencing, see `docs/EXECUTION_PLAN.md`. For what is actually implemented, see `docs/VERIFICATION_LOG.md`.

---

## 1) Operating principles

* **Credibility first:** Never publish operational promises you cannot sustain.
* **No SLA:** Response times are best-effort. Do not imply guaranteed timelines.
* **Security over convenience:** Treat secrets and webhooks as high risk.
* **Observability or it didn’t happen:** If you can’t see it (logs/alerts), assume it’s broken.
* **Minimal moving parts:** Prefer reliable, boring workflows over complex automation.

---

## 2) Daily routine (best-effort)

### 2.1 Monitor (10–20 minutes)

* Check error monitoring dashboard (e.g., Sentry if configured).
* Check platform email deliverability (provider dashboard).
* Spot-check the core loop:

  * Home → Directory → Profile → Product page → Vendor attribution copy
* Review admin queues if present (claims/disputes/reporting).

### 2.2 Respond (best-effort)

* Triage any creator onboarding blockers (Stripe onboarding issues).
* Triage broken links/product delivery confusion.
* Handle reports/flags (fraud/spam/impersonation).

---

## 3) Weekly routine (best-effort)

* Review performance snapshots (Lighthouse / PageSpeed) on core routes.
* Review top user pain points (support inbox tags, common error clusters).
* Rotate any at-risk secrets if there was exposure or suspicious activity.
* Review featured placement behavior (fairness, scheduling, expiries) using admin tools/logs.

---

## 4) Incident handling (solo-founder realistic)

### 4.1 Incident categories (guidance, not SLA)

* **Payment / Stripe onboarding issues:** Creators can’t connect or customers can’t proceed.
* **Security:** webhook verification failure, unexpected auth bypass, suspicious access.
* **Data integrity:** incorrect listings, wrong creator attribution, broken delivery links.
* **Availability:** site down, API errors, extreme latency.

### 4.2 Triage steps (repeatable)

1. **Confirm scope:** what’s broken, which route, which user role.
2. **Capture evidence:** screenshot + timestamp + request id (if logged).
3. **Check monitoring/logs:** correlate errors with timeframe.
4. **Contain:** disable or hide the failing surface if needed (feature flag / temporary UI block).
5. **Fix:** minimal change to restore core loop.
6. **Verify:** rerun the broken flow + add entry to `docs/VERIFICATION_LOG.md`.

### 4.3 Communication (credibility-safe)

* Use short, factual status updates.
* Do not claim timelines you can’t keep.
* Never imply you “guarantee” payments or outcomes.

---

## 5) Secrets and access hygiene

### 5.1 Rules

* Never store secrets in docs.
* Keep environment variables in the host provider’s secret manager.
* Use least privilege for service roles.
* Rotate keys after any suspected exposure.

### 5.2 Rotation workflow (high-level)

1. Identify exposed key(s) and scope (provider dashboard).
2. Generate replacements.
3. Update host env vars.
4. Redeploy.
5. Verify critical flows:

   * Auth/session access
   * Stripe webhooks
   * Email sending
6. Record the rotation in `docs/VERIFICATION_LOG.md` (no secrets, just evidence of rotation).

---

## 6) Webhooks and scheduled jobs (truth-safe)

* Treat all webhook endpoints as internet-facing and hostile.
* Verify signatures and reject unsigned/invalid payloads.
* Scheduled jobs (cron) must be idempotent.
* Do not claim a cron exists unless proven in `docs/VERIFICATION_LOG.md`.

---

## 7) Support handling (solo founder)

### 7.1 Support channels

* Use one inbox (email) and optionally one form.
* Tag issues as:

  * Stripe onboarding
  * Product delivery confusion
  * Profile edits
  * Featured placement
  * Abuse/reporting

### 7.2 Credibility rules for support

* Never imply 24/7 monitoring.
* Avoid time promises.
* Provide a workaround when possible (e.g., manual Stripe reconnect link).

---

## 8) Abuse / fraud / impersonation

### 8.1 Common cases

* Impersonation of creators
* Spam listings
* Misleading product descriptions
* Fake “verified” signals

### 8.2 Response pattern

* Remove/hide the content if clearly abusive.
* Request evidence if ambiguous.
* Log the action (admin audit trail where possible).
* Record a short entry in `docs/VERIFICATION_LOG.md` if it impacts platform policy.

---

## 9) Deployment (operational notes)

* Deploy changes in small PRs aligned to `docs/EXECUTION_PLAN.md`.
* After deploy, verify the core loop and run the enforcement checks.
* Log verification evidence in `docs/VERIFICATION_LOG.md`.

---

## 10) Launch Communications (Draft Only)

**Status:** DOCUMENT ONLY (Not implemented)

This section contains approved copy for the V1 launch. It adheres to strict "no ranking/traffic promises" rules.

### 10.1 Announcement Email / Post

> **Subject:** Your official creator profile is live
>
> **Body:**
> SuburbMates V1 is now open. You can now build a professional mini-site to showcase your work and sell digital products directly to neighbours.
>
> **What it is:**
> * A portfolio for your service or studio
> * A verified home for your digital products (templates, courses, guides)
> * A simpler alternative to building a full website
>
> **What it isn't:**
> * We don't sell your leads (neighbours contact you directly)
> * We don't promise algorithmic traffic (you share your page with your audience)
>
> [Create your profile]

### 10.2 Social Bio

> "Official creator portfolio on SuburbMates using the Pro template."

---
