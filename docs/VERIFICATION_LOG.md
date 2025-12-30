# Suburbmates — Verification Log (Rolling Evidence)

This file is the rolling, date-stamped record of **what the codebase actually contains** at specific commits/branches.
It is evidence-only: **no future plans, no tasks, no roadmaps** (those belong in `docs/EXECUTION_PLAN.md`).
Each entry must include:

* Date (YYYY-MM-DD)
* Branch + commit hash
* Validation outputs (ssot:check + grep scans + build/lint/test where applicable)
* Evidence snippets: file path + line references (or small excerpts) supporting key claims

---

## 2025-12-30 — Baseline Doc Governance Verification

**Context:** Post-purge baseline verification of new documentation set.
**Branch:** `fix/ssot-readme-sanity`
**Commit:** `2c76c7b`
**Author/Agent:** Antigravity (Antigravity Agent)
**Scope:** Repository-wide documentation and source code (src/app, src/components).

### A) Enforcement Checks (Required)

#### A1) ssot:check

**Command:**
* `npm run ssot:check`

**Result:** PASS
**Output (paste):**
```text
> suburbmatesv1@0.1.0 ssot:check
> rg -n "join hundreds|trusted by|already using|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components --glob "!docs/README.md"
```

#### A2) Credibility + Positioning Grep

**Command:**
* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`

**Result:** Matches found (Allowed in non-SSOT docs for check description)
**Output (paste):**
```text
docs/VERIFICATION_LOG.md:43:* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`
docs/QA_CHECKLIST.md:13:* [ ] No generic “business directory” framing; copy matches SSOT positioning.
docs/QA_CHECKLIST.md:19:* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`
docs/EXECUTION_PLAN.md:24:   No “generic business directory” framing. Must match SSOT positioning.
docs/EXECUTION_PLAN.md:56:* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`
```

#### A3) Numeric Drift Scan (Docs/UI)

**Command:**
* `rg -n "\$[0-9]+|30 days|max [0-9]+|up to [0-9]+|[0-9]+ products|[0-9]+ featured" docs src/app src/components`

**Result:** matches found
**Output (paste):**
```text
src/app/help/page.tsx:25: "Basic listing is completely free! We offer three tiers: Basic (3 products, free), Standard (10 products, $29/month), and Premium (50 products, $99/month)."
src/app/contact/page.tsx:91: "Basic listing is free! We offer three tiers: Basic (3 products, free), Standard (10 products, $29/month), and Premium (50 products, $99/month)."
src/components/home/FAQSection.tsx:118: <li>• Up to 10 products</li>
src/components/home/FeaturedSection.tsx:58: <span className="text-sm">30 days of featured visibility</span>
src/app/dashboard/page.tsx:287: Get 50 products and 3 featured slots
src/app/(vendor)/vendor/dashboard/page.tsx:20: description: "Sell up to 10 products • 8% platform fee",
```

### B) Build / Lint / Tests (As Applicable)

#### B1) Lint

**Command:** `npm run lint`
**Result:** FAIL
**Output:**
```text
✖ 37 problems (12 errors, 25 warnings)
/tests/unit/deprecated-webhook-route.test.ts:36:67 error Unexpected any. Specify a different type
```

### C) Evidence Snippets (File + Line References)

#### C1) SSOT + Doc Governance

* **Path:** `docs/README.md:1-10`
  **Evidence:**
  ```markdown
  # Suburbmates — Single Source of Truth (Product Constitution)

  This document defines **what Suburbmates is** and the **non-negotiable rules** that govern product scope, positioning, trust, UX, design language, and monetization logic.
  ```

#### C4) Tier/Quota Enforcement Source (if changed)

* **Path:** `src/lib/constants.ts:39-48` (Reference)
  **Evidence:**
  ```typescript
  export const TIER_LIMITS = {
    FREE: { products: 3, featured_slots: 0 },
    PRO: { products: 10, featured_slots: 1 },
    PREMIUM: { products: 50, featured_slots: 3 }
  };
  ```

### D) Findings Summary (Evidence-Based Only)

* **Pass/Fail state:** SSOT check passes for banned phrases in source code, but numeric drift is prevalent in UI pages (`/help`, `/contact`, `/dashboard`). Lint fails due to legacy code and test errors.
* **Risks detected:**
  - `src/app/help/page.tsx`: Hardcoded prices and limits (Direct drift from `constants.ts`).
  - `src/app/contact/page.tsx`: Hardcoded prices and limits.
  - `src/app/dashboard/page.tsx`: Hardcoded tier perks.
  - `src/app/(vendor)/vendor/dashboard/page.tsx`: Hardcoded fees and limits.

---

## Log Index (Optional)

Add new entries to the top. Maintain reverse chronological order.

---

## Entry Template (copy per verification event)

## YYYY-MM-DD — <Short Title>

**Context:** (e.g., “Post-merge PR1 compliance patch”)
**Branch:** `<branch-name>`
**Commit:** `<full-hash>` (or `<short-hash>`)
**Author/Agent:** `<who ran verification>`
**Scope:** (e.g., “Docs + public copy”, “Marketplace page”, “Featured scheduling API”)

### A) Enforcement Checks (Required)

#### A1) ssot:check

**Command:**

* `npm run ssot:check` (or pnpm/yarn equivalent)

**Result:** PASS | FAIL
**Output (paste):**

```text
<paste command output here>
```

#### A2) Credibility + Positioning Grep

**Command:**

* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`

**Result:** 0 matches | matches found
**Output (paste):**

```text
<paste grep output here>
```

#### A3) Numeric Drift Scan (Docs/UI)

**Command:**

* `rg -n "\$[0-9]+|30 days|max [0-9]+|up to [0-9]+|[0-9]+ products|[0-9]+ featured" docs src/app src/components`

**Result:** 0 matches | matches found
**Output (paste):**

```text
<paste grep output here>
```

### B) Build / Lint / Tests (As Applicable)

#### B1) Lint

**Command:** `npm run lint`
**Result:** PASS | FAIL
**Output:**

```text
<paste output>
```

#### B2) Tests

**Command:** `npm test`
**Result:** PASS | FAIL
**Output:**

```text
<paste output>
```

#### B3) Build

**Command:** `npm run build`
**Result:** PASS | FAIL
**Output:**

```text
<paste output>
```

### C) Evidence Snippets (File + Line References)

#### C1) SSOT + Doc Governance (if changed)

* **Path:** `docs/README.md:<line-start>-<line-end>`
  **Evidence:**

  ```text
  <paste excerpt>
  ```

#### C2) Middleman Truth Copy (if changed)

* **Path:** `src/app/products/[slug]/page.tsx:<line-start>-<line-end>`
  **Evidence:**

  ```text
  <paste excerpt>
  ```

#### C3) Positioning Copy (if changed)

* **Path:** `src/app/about/page.tsx:<line-start>-<line-end>`
  **Evidence:**

  ```text
  <paste excerpt>
  ```

#### C4) Tier/Quota Enforcement Source (if changed)

* **Path:** `src/lib/constants.ts:<line-start>-<line-end>`
  **Evidence:**

  ```text
  <paste excerpt>
  ```

#### C5) Featured Scheduling / Reminder Evidence (if changed)

* **Path:** `<relevant file>:<line-start>-<line-end>`
  **Evidence:**

  ```text
  <paste excerpt>
  ```

### D) Findings Summary (Evidence-Based Only)

* **Pass/Fail state:** (e.g., “All required enforcement checks passed.”)
* **Notable matches:** (Only if grep found matches; list file paths.)
* **Risks detected:** (Only if supported by outputs/snippets.)

### E) Attachments / Links (Optional)

* Lighthouse report links or stored artifacts (if generated)
* Screenshot filenames (if used for UI verification)
