# Suburbmates — Execution Plan (PR0–PR10)

This document is the **execution checklist** for building and shipping Suburbmates against the immutable **SSOT** in `docs/README.md`.
It defines **what to do**, **in what order**, **what “done” means**, and **how to validate**.
It does not define product truth. If anything here conflicts with SSOT, SSOT wins.

---

## 0) Operating rules

### 0.1 Authority and boundaries

* Product constitution / truth: `docs/README.md` (immutable SSOT)
* Numeric policy (limits/prices/caps/durations): `src/lib/constants.ts` only
* This file: execution steps + acceptance criteria + validations

### 0.2 Stop-the-line gates (fail any → stop, fix, re-run)

These gates apply to every PR before merging:

1. **Credibility gate**
   No fake team, fake testimonials, fake scale, fake readiness claims, or ambiguous payment language.
2. **Positioning gate**
   No “generic business directory” framing. Must match SSOT positioning.
3. **Coherence gate**
   Tier vocabulary and rules must not drift; any quotas/prices must source from `src/lib/constants.ts`.
4. **Middleman truth gate**
   Marketplace copy cannot imply Suburbmates is merchant of record.
5. **Alive-but-fast gate**
   “Alive” comes from real signals/collections; no heavy gimmicks as substitute.
6. **Mobile-first gate**
   Thumb-first patterns; filters as bottom sheet; sticky primary actions as needed.
7. **Motion discipline gate**
   Intent-driven motion only; reduced-motion respected; avoid auto-advancing sliders.
8. **Performance gate**
   Core Web Vitals guardrails (LCP/INP/CLS) and no heavy above-the-fold payload.

### 0.3 Merge discipline

* One PR per PR# below (PR0–PR10).
* Each PR must include:

  * **What changed**
  * **Acceptance criteria evidence**
  * **Validation outputs** (commands listed per PR)
* Avoid “cleanup drive-bys” that expand scope.

---

## 1) Global validation commands (use in every PR)

Run these at minimum (use pnpm/yarn equivalents if applicable):

### 1.1 Credibility + positioning grep (public + docs)

* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`

### 1.2 Numeric SSOT drift scan (detect restated limits)

* `rg -n "\$[0-9]+|30 days|max [0-9]+|up to [0-9]+|[0-9]+ products|[0-9]+ featured" docs src/app src/components`

### 1.3 Constants usage scan (spot hardcoding)

* `rg -n "TIER_LIMITS|FEATURED_SLOT|constants\.ts" src/app src/components src/lib`

### 1.4 Build/lint/test (choose what exists)

* `npm run lint`
* `npm test`
* `npm run build`

### 1.5 Lighthouse (when PR affects front-of-house)

* Lighthouse/PageSpeed for: Home, Directory, Profile, Product page

---

## 2) PR roadmap (PR0–PR10)

## PR0 — SSOT Foundation & Drift Controls

**Goal:** Make SSOT immutable in practice and prevent drift across docs/app copy.

**Dependencies:** None (this is the foundation).

**Targets (typical):**

* `docs/README.md` (SSOT)
* `src/lib/constants.ts` (numeric policy source)
* repo scripts: `ssot:check` (or equivalent)

**Acceptance criteria:**

* SSOT exists and is treated as constitution (no execution/status language).
* Docs outside SSOT do not restate product truth or numbers.
* Repo has an enforcement check that fails on banned phrases outside SSOT.

**Validation:**

* Run global greps in §1.1 and §1.2
* Run `npm run ssot:check` (or equivalent) if present

---

## PR1 — Credibility + Creator Positioning Sweep (Public Surfaces + Docs)

**Goal:** Pass credibility and positioning gates prelaunch.

**Dependencies:** PR0.

**Targets:**

* Public pages: Home, About, Pricing, Directory, Profile, Marketplace
* Shared components: headers/footers/CTAs
* Docs that leak marketing/scale language (ops/design)

**Expected outputs:**

* Copy aligned to creator framing (SSOT positioning rules).
* Removed/rewritten phrases that imply fake scale/traction or generic directory.
* Payment language aligned to SSOT middleman truth.

**Acceptance criteria:**

* No banned phrases appear in public surfaces or non-SSOT docs.
* No “merchant-of-record” implication language exists.
* No “annual subscription” mention unless SSOT allows and code supports.

**Validation:**

* §1.1 grep returns 0 matches
* `rg -n "merchant of record|we process payments|guaranteed by" docs src/app src/components` returns 0 matches
* Build/lint/test

---

## PR2 — Coherence Hardening (Repo-wide SSOT Usage)

**Goal:** Eliminate hardcoded tier names/limits/prices; enforce constants usage everywhere.

**Dependencies:** PR0, PR1.

**Targets:**

* Pricing page rendering logic
* Upgrade CTAs (dashboard/profile prompts)
* Feature gating (templates/products/featured eligibility)
* Any place quotas/limits are enforced or displayed

**Expected outputs:**

* All tier gating and quotas pull from `src/lib/constants.ts`.
* UI labels match SSOT tier vocabulary (Free/Pro/Premium).
* No duplicated tables of limits in docs (except SSOT principles without numbers).

**Acceptance criteria:**

* No hardcoded tier limits/prices in UI or docs outside constants.ts.
* Gating uses a single shared source (constants + shared helper).

**Validation:**

* §1.2 drift scan shows no restated numeric limits outside constants.ts
* `rg -n "free|pro|premium" src` review for label drift
* `rg -n "up to|max|products" src/app src/components` and confirm sources
* Build/lint/test

---

## PR3 — Featured FIFO Scheduling Mechanics

**Goal:** Featured placement is fair and schedulable even when capacity is full.

**Dependencies:** PR0–PR2.

**Targets (typical):**

* Featured purchase API routes
* Featured scheduling logic (capacity overlap checks)
* Featured UI feedback components

**Expected outputs:**

* If a council is “full,” purchases schedule the **next available window** instead of blocking.
* UI displays “Scheduled for [date]” rather than implying immediate placement.
* Admin audit surface can review scheduled placements.

**Acceptance criteria:**

* FIFO scheduling behavior matches SSOT featured fairness rules.
* No copy claims “guaranteed immediate placement” when full.
* Edge cases handled: overlapping windows, timezone, idempotency.

**Validation:**

* Unit/route tests if present
* Manual test script (document in PR description):

  * council full scenario → purchase schedules future date
  * council not full → purchase schedules immediate window
* Build/lint/test

---

## PR4 — Featured Expiry Reminders (Idempotent)

**Goal:** Automated reminders for expiring featured placements, with no duplicates.

**Dependencies:** PR3.

**Targets (typical):**

* Cron scheduler config (Vercel Cron or equivalent)
* Secure cron handler route
* Email provider integration (Resend)
* DB fields for idempotency (reminded_at or similar)

**Expected outputs:**

* Reminders sent at configured lead times (policy requires reminders; specifics in implementation).
* Idempotency ensures no duplicate reminders.

**Acceptance criteria:**

* Cron route is protected (auth token or internal-only).
* Idempotency is enforced at the data layer.
* Emails use credibility-safe copy (no pressure tactics).

**Validation:**

* Manual dry-run mode (if available) shows recipients list
* Logs confirm single send per slot
* Build/lint/test

---

## PR5 — Alive-but-Fast Signals (Homepage + Key Collections)

**Goal:** Homepage feels alive from real signals, not heavy UI gimmicks.

**Dependencies:** PR0–PR2.

**Targets:**

* Home page modules (fresh signals)
* Data queries for “recently added”, “new drops”, “recently updated”
* Caching strategy for these modules

**Expected outputs:**

* Server-rendered or cached “Fresh signals” modules.
* Reduced reliance on heavy hero carousels or unnecessary JS.
* Progressive disclosure for lists.

**Acceptance criteria:**

* “Alive” comes from real data signals or curated collections.
* No heavy above-the-fold widgets substitute for freshness.
* Initial list loads are capped with pagination/load-more.

**Validation:**

* Lighthouse on Home
* Inspect bundle impact (if tooling available)
* Manual: slow 4G simulation check (no blocking UI)

---

## PR6 — Mobile-First Directory UX (Thumb-first)

**Goal:** Benchmark mobile directory experience.

**Dependencies:** PR5 (recommended), PR0–PR2 required.

**Targets:**

* Bottom navigation (public surfaces)
* Directory filters as bottom sheet
* Sticky profile actions (save/share/view products)

**Expected outputs:**

* Thumb-first navigation for the core loop.
* Filter UI optimized for mobile (apply/reset).
* Profile actions accessible one-handed.

**Acceptance criteria:**

* Filters do not require desktop-style sidebar on mobile.
* Tap targets meet accessibility guidelines.
* Directory remains fast with pagination.

**Validation:**

* Manual mobile QA: iPhone/Android viewports
* Lighthouse mobile runs for Directory + Profile

---

## PR7 — Profile-as-Mini-Site Templates

**Goal:** Creators get a shareable mini-site feel via templates, gated by tier.

**Dependencies:** PR2.

**Targets:**

* Template renderer system
* Template selection UI in creator settings
* Tier gating logic for template selection
* OpenGraph metadata consistency

**Expected outputs:**

* Template registry (Template A baseline; Template B high-end).
* Template B is selectable only for eligible tiers.
* Public profile view renders the chosen template.

**Acceptance criteria:**

* Gating uses constants policy (no hardcoded limits).
* Template choice is persisted safely and scoped to creator.
* OG/meta reflects profile content and does not break sharing.

**Validation:**

* Manual: switch templates, refresh, share link preview test
* Build/lint/test

---

## PR8 — Marketplace UX Tightening (Middleman Clarity)

**Goal:** Marketplace is clear, trustworthy, and aligned to the Stripe middleman model.

**Dependencies:** PR1, PR2.

**Targets:**

* Product listing pages and product detail pages
* Vendor profile “Shop” tab
* Stripe onboarding status surfaces for creators

**Expected outputs:**

* Explicit “Sold by [Creator]. Payments processed by Stripe.” copy.
* Product card standardization (consistent UI).
* Clear delivery method labels (link/file/license) without ambiguity.

**Acceptance criteria:**

* No copy implies Suburbmates processes/holds funds.
* Creator attribution is always visible.
* Purchase pathways are clear and minimal.

**Validation:**

* §1.1 grep + merchant-of-record scan
* Manual: product detail → vendor profile → product list consistency
* Lighthouse on Product detail

---

## PR9 — Performance & Accessibility Baseline

**Goal:** Meet performance and accessibility baseline on core routes.

**Dependencies:** PR5–PR8 (as applicable).

**Targets:**

* Next/Image usage for user media and hero images
* Lazy loading below the fold
* Keyboard navigation and focus states
* Semantic layout structure

**Expected outputs:**

* Image optimization for heavy pages.
* Reduced layout shift and improved input responsiveness.
* Basic WCAG compliance for core flows.

**Acceptance criteria:**

* Lighthouse improvements on Home/Directory/Profile/Product.
* Reduced-motion is respected for animations.
* No critical a11y violations (labels, focus, contrast).

**Validation:**

* Lighthouse reports saved (attach links or numbers in PR)
* Keyboard-only walkthrough of core loop
* `rg -n "framer-motion|motion\." src` review intent-driven usage

---

## PR10 — Launch Readiness (Ops + Safety + Legal)

**Goal:** No surprises at launch: secrets, monitoring, legal, and operational readiness.

**Dependencies:** PR9 (recommended), PR4 (for reminders), PR0–PR2 mandatory.

**Targets:**

* Secrets hygiene (rotation, no keys in history)
* Monitoring (Sentry, logs)
* Legal pages (Terms/Privacy) aligned to actual practices
* Runbooks and incident response (no SLA claims)

**Expected outputs:**

* Confirm secrets rotation where required.
* Monitoring verified (events captured).
* Legal pages exist and match data practices.
* Ops runbook is solo-founder honest.

**Acceptance criteria:**

* No sensitive keys in repo history (scan documented in Verification Log).
* Legal copy does not overpromise and matches product behavior.
* “No SLA” posture is consistent across docs and UI.

**Validation:**

* Targeted git history scans for key patterns (document outputs)
* Sentry test event confirms capture (if configured)
* Legal pages reviewed against actual data capture

---

## 3) Execution artifacts to maintain during implementation

Each PR must update:

* `docs/VERIFICATION_LOG.md` (date + branch + commit + evidence + command outputs)

This keeps “what’s true” separate from SSOT.

---

## 4) Open questions (must be resolved in execution PRs, not SSOT)

* Domain support scope and timeline (Phase 2+)
* Any platform fee structure (if introduced later) and how it is disclosed

---

## 5) Post-Launch Optimisation (Deferred)

**Status:** DOCUMENT ONLY (Not for PR7)

These features are explicitly deferred until after V1 stability is proven. They are NOT to be implemented in PR7.

### 5.1 Monetisation Levers (Candidate List)

* **Share Prompts:** Nudge users to share their profile after publishing a new product.
* **Upgrade Nudges:** Contextual prompts when hitting tier limits (e.g., "Unlock 5 more product slots").
* **Behavioural Triggers:** "Your profile got X views" emails (requires analytics V2).
* **Pricing Psychology:** Compare "cost of website" vs "benefit of SuburbMates".

### 5.2 Growth Loops

* **Referral Program:** "Invite a creator friend."
* **Verified Badge Gamification:** Progressive checklist completion.

---
