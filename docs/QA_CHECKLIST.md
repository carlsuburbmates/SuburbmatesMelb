# Suburbmates — QA Checklist (Prelaunch)

This is a **checklist** of what must be tested before launch.

> [!IMPORTANT]
> **SSOT ALIGNMENT (v2.1):** It contains **no “complete” claims** and should be used alongside `docs/VERIFICATION_LOG.md` to record evidence.

---

## 1) Credibility + Positioning Checks

* [ ] No fake testimonials, fake partners, fake usage counts, or fake team language on any public page.
* [ ] No generic “business directory” framing; copy matches SSOT positioning.
* [ ] No “merchant-of-record” implication language on creator/product pages.
* [ ] No hardcoded numeric limits/prices in docs or UI copy outside `src/lib/constants.ts`.

**Suggested validation commands:**
* `rg -n "already using|trusted by|join hundreds|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates" docs src/app src/components`
* `rg -n "\$[0-9]+|30 days|max [0-9]+|up to [0-9]+|[0-9]+ products|[0-9]+ featured" docs src/app src/components`

---

## 2) Core Loop QA (Public Discovery)

### 2.1 Homepage (`/`)
* [ ] Loads fast on mobile (Lighthouse > 90).
* [ ] “Alive” signals are real (recent creators, new drops) and not gimmicks.
* [ ] Hero tiles (Category/Region) provide clear entry points for low-intent browsing.

### 2.2 Regional Directory (`/regions`)
* [ ] Search works (empty query, common queries, no results).
* [ ] Region filters open as a bottom sheet on mobile.
* [ ] Taxonomy strictly adheres to the **6 Metropolitan Regions**.
* [ ] Empty states provide a path back to discovery.

### 2.3 Creator Profile (`/creator/[slug]`)
* [ ] Creator identity and category info is clear.
* [ ] Share action produces a clean, convincing link preview (OG tags).
* [ ] Product Drop cards are consistent and display the correct "Distributed by" attribution.
* [ ] Mobile Page Density: "Three-Card Rule" is met (2.5 to 3 cards visible on screen).

### 2.4 Outbound Redirect (`/api/redirect`)
* [ ] Direct `href` links to external stores are absent from the UI.
* [ ] Tapping a Product Card triggers a 302 redirect via internal identifier lookup.
* [ ] SECURE: Endpoint rejects arbitrary `url` query parameters (Open Redirect test).
* [ ] IDEMPOTENCY: Outbound click is logged to DB without stalling the visitor's redirect.

---

## 3) Creator (Workspace) Flows QA

### 3.1 Auth / Session
* [ ] Magic Link (Email OTP) and OAuth login work.
* [ ] No password-based UI exists in the application.

### 3.2 Workspace & Products
* [ ] `/api/scrape` extracted product metadata (Title, OG:Image, Desc) accurately.
* [ ] Create/Edit Product Drop flows are frictionless.
* [ ] Image uploads are optimized and follow Obsidian & Ice crop rules.

---

## 4) Featured Placement QA (Manual Audit)

* [ ] Manual scheduling of featured creators in Supabase results in correct UI placement.
* [ ] UI communicates "Featured" status without overpromising specific ranking outcomes.

---

## 5) Accessibility & Performance (Baseline)

* [ ] **Motion:** Reduced motion is respected. No auto-advancing carousels.
* [ ] **A11y:** Semanticlandmarks (header/nav/main/footer) on core routes. All interactive controls have labels.
* [ ] **Performance:** No major layout shift (CLS). Above-the-fold media is eagerly loaded/prioritized.
* [ ] **Obsidian & Ice:** Strictly no serifs/italics on any interface element.

---

## 6) Security & Privacy

* [ ] **Zero-Wall:** Public discovery routes (`/`, `/regions`, `/creator/[slug]`) are accessible without authentication.
* [ ] **Data Minimization:** No IP addresses or User-Agents are logged in the `outbound_clicks` table.
* [ ] **Secrets:** No API keys (Supabase Service Role, Resend) are exposed in the frontend or git history.
