# Suburbmates — Execution Plan (v2.1)

> [!CAUTION]
> **LEGACY ROADMAP (SUPERSEDED):**
> Sections 3-5 of this document depict the legacy "Marketplace" model (PR0–PR10).
> These are retained for archival context ONLY. 
> For active implementation truth, see `docs/VERIFICATION_LOG.md`.

## 1) Core Operating Rules (v2.1)

### 1.1 Authority & Infrastructure
*   **SSOT (Product Constitution):** `docs/README.md` (v2.1).
*   **Numeric Policy:** `src/lib/constants.ts` (Limits, regions, durations).
*   **Remote-Only Supabase:** All database development **MUST** target the production project `hmmqhwnxylqcbffjffpj`. Local Postgres instances are banned.
*   **Docker-Free Mandate:** Usage of Docker or OrbStack for database hosting or tool execution is **EXPLICITLY BANNED**.

### 1.2 Validation Gates (Pre-Commit)
Every change must pass these mandatory gates:
1.  **Credibility Gate:** No fake testimonials, scale claims, or generic "business directory" wording.
2.  **Zero-Wall Gate:** Public routes (`/`, `/regions`, `/creator/[slug]`) must remain unauthenticated.
3.  **Outbound Filter:** No direct `href` links; everything must route via `/api/redirect`.
4.  **Density Gate:** "Three-Card Rule" — 2.5 to 3 cards visible on mobile; no excessive padding.
5.  **Motion Discipline:** No auto-advancing carousels or heavy animations.

---

## 2) Execution Artifacts

Each major change or PR must update:
*   `docs/VERIFICATION_LOG.md` (Record the date, branch, and evidence of compliance).

---

## 3) Global Validation Commands

### 3.1 Credibility & Positioning (Anti-Drift)
`rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`

### 3.2 Numeric Drift Scan
`rg -n "\$[0-9]+|30 days|max [0-9]+|up to [0-9]+|[0-9]+ products|[0-9]+ featured" docs src/app src/components`

### 3.3 Build & Lint
`npm run lint && npm run build`

---

## [ARCHIVED: LEGACY MARKETPLACE MODEL]

### 4) Legacy PR Roadmap (PR0–PR10)
*   **PR1 — Credibility Sweep:** (Obsolete: Focused on 2025 Marketplace positioning).
*   **PR2 — Coherence Hardening:** (Obsolete: Focused on Tiered Pricing).
*   **PR3 — Featured FIFO:** (Obsolete: Focused on automated slot booking).
*   **PR4 — Expiry Reminders:** (Obsolete: Focused on high-volume seller automation).
*   **PR5 — Fresh Signals:** (Baseline for current "Daily Shuffle").
*   **PR6 — Mobile-First UX:** (Baseline for current "Bottom Tab Bar").
*   **PR7 — Profile Templates:** (Obsolete: Focused on tiered designs).
*   **PR8 — Marketplace UX:** (Obsolete: Focused on in-app checkout safety).
*   **PR9 — Performance:** (Relevant: Focused on LCP and lazy loading).
*   **PR10 — Launch Readiness:** (Relevant: Focused on Legal/Privacy and monitoring).

---

## 5) Defusal of Stale Milestones
All remaining legacy milestones related to Stripe Connect onboarding, in-app product detail pages, and automated FIFO scheduling have been defused in the codebase (Transition to **Concierge Admin** model).
