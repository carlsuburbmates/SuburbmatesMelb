# Suburbmates — Single Source of Truth (Product Constitution)

This document defines **what Suburbmates is** and the **non-negotiable rules** that govern product scope, positioning, trust, UX, design language, and monetization logic.

**Immutability rule:** This file is treated as a constitution. It is not used for execution checklists, implementation status, or “what’s done.” Those live elsewhere (execution plan + verification logs).
**No other documentation file may define product truth** (tiers, pricing vocabulary, featured rules, verification rules, marketplace model, positioning). If another file contradicts this, it is wrong.

---

## 1) What Suburbmates is (and is not)

### 1.1 Definition

**Suburbmates is a mobile-first Melbourne directory for digital creators and their digital products.**
Creators use it to:

* be discovered locally (Melbourne-first, council-aware)
* showcase their work in a profile that feels like a mini-site
* share a single link that converts (profile → products → upgrade)

Visitors use it to:

* discover creators by council/category/search
* browse digital products
* click through to purchase from creators via Stripe

### 1.2 What Suburbmates is NOT

* Not a generic “business directory.”
* Not a marketplace where Suburbmates holds funds or acts as merchant of record.
* Not a social network or messaging platform (prelaunch).
* Not a scraping engine (no ABN scraping; no auto-importing of creator data).
* Not a “fake scale” brand (no fake team, fake testimonials, fake counts).

---

## 2) Positioning rules (no exceptions)

### 2.1 Framing language

Every public-facing page and UI surface must reinforce:

* **Melbourne digital creators**
* **digital products / drops**
* **profiles as mini-sites**
* **local discovery without corporate directory vibes**

### 2.2 Banned positioning signals

Avoid words/phrases that imply “generic directory”:

* “local business directory”
* “hyperlocal business directory”
* “find businesses near you”
* “business listings platform”

Preferred language:

* creator directory, studios, makers, digital creators
* drops, products, collections
* profile, mini-site, landing page

---

## 3) Trust model (middleman truth)

### 3.1 Payment truth

* **Products are sold by creators.**
* **Payments are processed by Stripe** (creator-controlled Stripe onboarding).
* Suburbmates is a discovery layer and optional platform logic layer (e.g., featured placement, subscription access), but **does not take custody of funds**.

### 3.2 Copy rules for payments

Allowed:

* “Sold by [Creator]. Payments processed by Stripe.”
* “Creators handle sales via Stripe.”

Not allowed:

* “Secure transaction via Suburbmates”
* “We process payments”
* “Guaranteed by Suburbmates”
* anything implying merchant-of-record

---

## 4) Core loop (the only loop that matters prelaunch)

### 4.1 Visitor loop

Home → Discover → Creator Profile → Share/Save → Browse Products → (Purchase via Stripe) → Return to creator discovery

### 4.2 Creator loop

Create profile → Publish products → Share profile link → Upgrade for better presence → Buy featured placement (optional)

---

## 5) Roles and surfaces

### 5.1 Roles

* Visitor (public, no login required)
* Creator (vendor) — manages profile/products and Stripe onboarding
* Admin — moderates, resolves claims/disputes, audits featured placements

### 5.2 Surfaces

* Public site (fast, credible, shareable)
* Creator app (profile + products + payouts/onboarding + featured)
* Admin tools (minimal but real)

---

## 6) Pricing vocabulary and tier model

### 6.1 Tier vocabulary (canonical)

Marketing names must be consistent everywhere:

* **Free**
* **Pro**
* **Premium**

Internal tier keys may exist for implementation, but external vocabulary must not drift.

### 6.2 What tiers control

Tiers govern:

* product listing quotas
* template access (profile mini-site templates)
* marketplace visibility perks (e.g., eligibility for certain modules)
* domain features (Phase 2+)

### 6.3 Numeric rules (single numeric policy source)

**No document may restate numeric limits, prices, caps, or durations.**
All numeric policy values live in: **`src/lib/constants.ts`**
Examples of numeric policy domains:

* product quotas per tier
* featured slot capacity per council
* featured placement price and duration
* any platform fee configuration rules

---

## 7) Featured placement (council-based sponsorship)

### 7.1 What featured is

Featured placement is a timeboxed, council-scoped promotional slot that increases visibility within council views and relevant collections.

### 7.2 Fairness rules

* **Council-scoped capacity** (cap defined in numeric policy source).
* **FIFO scheduling** (no silent favoritism, no hidden overrides).
* Timeboxed windows (duration defined in numeric policy source).
* Renewals are explicit, with reminder notifications (mechanism lives in implementation; policy is required here).

### 7.3 Featured truth in copy

Featured must be described as:

* a paid promotional placement
* timeboxed
* limited per council
* scheduled fairly

No copy may imply “guaranteed sales,” “exclusive monopoly,” or “permanent top rank.”

---

## 8) Verification (ABN badge)

### 8.1 ABN verification

* ABN verification is **optional** during signup/onboarding.
* Verification grants a **trust badge** only.

### 8.2 What ABN verification does NOT do

* It does not scrape ABN data into listings.
* It does not auto-create listings.
* It does not change quotas by default (badge = trust signal, not power-up).

---

## 9) “Alive-but-fast” rule (fresh signals, not gimmicks)

### 9.1 Alive comes from real signals

Allowed “alive” signals:

* newly added creators
* new drops/products
* recently updated profiles
* recently verified badge additions
* curated collections (editorial)

Not allowed:

* heavy carousels as a substitute for real freshness
* fake “trending” without transparent basis
* motion gimmicks to simulate activity

### 9.2 Curation policy (collections)

Collections are allowed and encouraged as the “taste layer,” especially prelaunch:

* council collections
* category collections
* “new this week” (timeboxed)
* editorial spotlights

---

## 10) Mobile-first interaction rules (thumb-first)

### 10.1 Navigation

* Thumb-first IA is mandatory.
* Filters behave as a bottom sheet with Apply/Reset.
* Primary actions on profiles should be reachable one-handed (Save/Share/View Products).

### 10.2 Search-first structure

* Search is a first-class entry point.
* Filters are secondary and progressively disclosed.

---

## 11) Signature design system (trendsetter mandate)

### 11.1 Visual language principles

Suburbmates must look like it belongs to creators:

* restrained color system (no “AI neon” clichés)
* deliberate typography hierarchy
* strong spacing rhythm
* premium card archetypes and consistent imagery rules
* “quiet authority” but alive through content, not glow

### 11.2 Card archetypes (canonical)

* Creator card
* Product card
* Collection card

Each archetype has:

* consistent information hierarchy
* clear tap targets
* consistent imagery/cropping rules

### 11.3 Avoid “default AI website”

Banned vibes:

* glowing gradients
* generic hero carousels
* stocky “AI SaaS” patterns
* meaningless abstract blobs
* overly animated landing pages

---

## 12) Motion discipline (performance + taste)

Motion is allowed only when it:

* responds to user intent (tap, open sheet, confirm action)
* uses cheap primitives (opacity/transform)
* respects reduced motion preferences
* never blocks content access or readability

Auto-advancing motion (carousels/sliders) is not a default pattern.

---

## 13) Performance and accessibility (benchmark standard)

### 13.1 Performance

* Mobile performance is the benchmark, not desktop.
* Avoid heavy above-the-fold payloads.
* Progressive disclosure for long lists.

### 13.2 Accessibility

* Semantic structure: header/nav/main/footer
* Keyboard navigable flows
* Visible focus states
* Alt text for meaningful images

---

## 14) Data and analytics (ethical, minimal, useful)

### 14.1 What data is used for

* improve discovery quality
* measure conversions (share → profile → product click)
* detect broken flows

### 14.2 What is not done

* no sale of personal data
* no dark patterns
* no “tracking for tracking’s sake”

---

## 15) Governance and document boundaries

### 15.1 This file controls (SSOT)

* product definition and positioning
* trust model and copy rules
* tier vocabulary and what tiers control
* featured placement policy rules
* verification (ABN badge policy)
* alive-but-fast rules
* signature design system principles
* mobile-first rules, motion discipline, perf/a11y principles

### 15.2 This file does NOT contain

* task lists, PR checklists, “phase complete” claims
* implementation status
* operational schedules and scripts
* test completion claims

Those belong in:

* **Execution Plan** (separate file)
* **Verification Logs** (separate file)
* **Numeric Policy**: `src/lib/constants.ts` (single numeric truth source)

---

## 16) Credibility gate (banned claims list)

These are banned across public pages and non-SSOT docs:

* “already using”
* “trusted by”
* “join hundreds”
* “dozens of automations”
* “annual subscription”
* “secure transaction via Suburbmates”
* any fake scale, fake testimonials, fake partners, fake team roles, or SLA promises

If any surface needs proof, it must be measured and logged before being stated as fact.
