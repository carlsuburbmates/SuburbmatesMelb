# Suburbmates — QA Checklist (Prelaunch)

This is a **checklist** of what must be tested before launch.
It contains **no “complete” claims** and should be used alongside `docs/VERIFICATION_LOG.md` to record evidence.

For product truth, see `docs/README.md`. For implementation sequence, see `docs/EXECUTION_PLAN.md`.

---

## 1) Credibility + positioning checks

* [ ] No fake testimonials, fake partners, fake usage counts, or fake team language on any public page.
* [ ] No generic “business directory” framing; copy matches SSOT positioning.
* [ ] No “merchant-of-record” implication language on marketplace/product pages.
* [ ] No hardcoded numeric limits/prices in docs or UI copy outside `src/lib/constants.ts`.

**Suggested validation commands (record outputs in Verification Log):**

* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`
* `rg -n "\$[0-9]+|30 days|max [0-9]+|up to [0-9]+|[0-9]+ products|[0-9]+ featured" docs src/app src/components`

---

## 2) Core loop QA (public)

### 2.1 Home

* [ ] Loads fast on mobile.
* [ ] “Alive” signals are real (recent creators, new drops, collections) and not gimmicks.
* [ ] Primary navigation is clear and thumb-friendly (e.g., bottom navigation if implemented).

### 2.2 Directory

* [ ] Search works (empty query, common queries, no results).
* [ ] Filters open as bottom sheet on mobile and are usable one-handed.
* [ ] Pagination/load-more does not freeze or shift layout badly.
* [ ] Empty states are helpful and credibility-safe.

### 2.3 Creator profile

* [ ] Creator identity and category info is clear.
* [ ] Share action produces a clean, convincing link preview (OG tags).
* [ ] Primary actions are reachable (save/share/view products).
* [ ] If templates exist, switching templates doesn’t break content.

### 2.4 Marketplace/product pages

* [ ] Product cards are consistent.
* [ ] Product detail page clearly shows “Sold by [Creator]. Payments processed by Stripe.”
* [ ] Delivery method labels are clear (link/file/license) and do not mislead.
* [ ] No claims that Suburbmates processes payments.

---

## 3) Creator (vendor) flows QA

### 3.1 Auth / session

* [ ] Signup/login/logout works.
* [ ] Protected routes are protected (no direct access without session).
* [ ] Session expiry behavior is sane (redirects, errors).

### 3.2 Profile management

* [ ] Create/edit profile works.
* [ ] Image uploads work and validate file types/sizes (behavior, not numeric limits).
* [ ] Validation errors are user-friendly and don’t leak stack traces.

### 3.3 Products management

* [ ] Create/edit product works.
* [ ] Product visibility matches expected rules (no leaking private drafts if drafts exist).
* [ ] If quotas exist, UI messaging is consistent and pulls from constants (no hardcoding).

### 3.4 Stripe onboarding

* [ ] Creator can start onboarding.
* [ ] Creator can resume onboarding.
* [ ] Onboarding status is visible and not confusing.
* [ ] Failures show clear next steps.

---

## 4) Featured placement QA (if present)

* [ ] Purchase flow succeeds in sandbox.
* [ ] If capacity is full, scheduling behavior is fairness-safe (FIFO).
* [ ] UI communicates scheduling truthfully (no guaranteed immediate placement language).
* [ ] Expiry behavior does not silently mislead creators.
* [ ] Reminder emails (if implemented) are idempotent and credibility-safe.

---

## 5) Accessibility (baseline)

* [ ] Semantic structure (header/nav/main/footer) on core pages.
* [ ] Keyboard navigation works (tab order, focus visible).
* [ ] Interactive controls have labels (including icon buttons).
* [ ] Color contrast acceptable for key text.
* [ ] Reduced motion respected (no forced animations).

---

## 6) Performance (baseline)

* [ ] Core routes pass a basic mobile Lighthouse run (Home/Directory/Profile/Product).
* [ ] Above-the-fold media is optimized (Next/Image or equivalent).
* [ ] Below-the-fold content is lazy loaded where appropriate.
* [ ] No major layout shift during load (CLS).

---

## 7) Security sanity checks

* [ ] No secrets in repo (scan history if needed).
* [ ] Webhooks verify signatures and reject invalid payloads.
* [ ] Rate limiting or abuse mitigations exist where appropriate (auth, webhooks).
* [ ] Error responses do not leak sensitive internals.

---

## 8) Legal/data practice alignment

* [ ] Terms/Privacy exist and match actual behavior (data collected, retention posture, contact method).
* [ ] No misleading claims about verification or safety.
* [ ] ABN verification is presented as a badge/trust signal only.

---
