# Suburbmates — Single Source of Truth (Product Constitution v2.0)

> [!IMPORTANT]
> **MVP LAUNCH FREEZE IN EFFECT**
> This document defines the lean MVP architecture.
> Zero scope creep permitted. No custom admin UIs. No automated billing engines.

This document defines **what Suburbmates is** and the **non-negotiable rules** that govern product scope, positioning, trust, UX, and the minimal-overhead operational model.

**Immutability rule:** This file is treated as a constitution. It is not used for execution checklists or implementation status.
**No other documentation file may define product truth.** If another file contradicts this, it is wrong.

---

## 1) What Suburbmates is (and is not)

### 1.1 Definition
**Suburbmates is a mobile-first directory designed to bridge local Melbourne pride with borderless digital goods.**
Creators use it to:
* Be discovered regionally (Grouped by 6 Metro Regions for MVP)
* Showcase their digital drops via automatically generated, editable product cards
* Drive trackable outbound traffic to their external storefronts

Visitors use it to:
* Browse local digital talent via high-density Category and Region tiles
* Support the "Melbourne underground" digital economy
* Click through to purchase on the creator's preferred platform

### 1.2 What Suburbmates is NOT
* Not a transaction processor (No MoR, no PCI, no checkout).
* Not a "Search-Only" blank canvas (Browse-first architecture is mandatory).
* Not an automated scraping engine (Profiles are manually claimed or seeded).
* Not a heavy React dashboard (Admin is handled 100% via Supabase GUI).

---

## 2) Positioning & The "Local Digital" Narrative

### 2.1 Framing language
Every UI surface must reinforce the intersection of local talent and digital products:
* **"Melbourne's top digital creators"**
* **"Support local digital talent"**
* **Drops, Products, Collections, Mini-sites**

### 2.2 Banned positioning signals
* "Hyperlocal business directory" (Implies brick-and-mortar)
* "Find businesses near you" (Digital goods are borderless; regions are for identity, not proximity)

---

## 3) Trust Model & Payments

### 3.1 Payment truth
* **Creators sell through their own platforms** (Gumroad, Stripe).
* Suburbmates is strictly a discovery and routing layer.

### 3.2 ABN Verification (Trust Signal)
* ABN input is **optional** and acts purely as a creator-supplied trust badge.
* **No API Verification:** The MVP will use a strict 11-digit regex frontend validation. Suburbmates does not guarantee the legal business status of a creator.

---

## 4) Core Loops & The Launch Gate

### 4.1 The Launch Gate (Pre-Launch Constraint)
* **Rule:** The platform must not be publicly marketed until **15 to 20 active, claimed profiles** are manually seeded via Concierge Onboarding. Zero "ghost town" UI permitted.

### 4.2 Creator Onboarding Loop (Frictionless)
1. Creator pastes a product URL (Gumroad/Stripe).
2. Backend automatically scrapes Open Graph data (`og:title`, `og:image`, `og:description`).
3. Frontend populates an editable form.
4. Creator tweaks text, assigns an "Umbrella Category," and publishes.

### 4.3 Visitor Loop (Dual-Intent)
* **Low-Intent:** Homepage hero provides Category/Region tiles for immediate browsing.
* **High-Intent:** Global top-navigation sticky search bar allows instant querying.

---

## 5) Admin & Infrastructure (Zero-UI Mandate)

* **No custom Admin frontend will be built.**
* **Waitlist/Billing:** Managed via Supabase Table Editor and manual Stripe Payment Links.
* **Moderation:** Managed via Supabase Row Level Security (RLS) toggling `draft` to `published`.
* **To-Do Lists:** Managed via Supabase Custom SQL Reports on the dashboard.

---

## 6) Monetization (Regional MVP Model)

### 6.1 Featured Placement
* **Grouped Inventory:** Capped at 6 Metropolitan Regions (Inner Metro, Western, etc.) to manufacture scarcity.
* **Duration:** 30-day timeboxed slots.
* **Waitlist:** Standard FIFO billing engines are banned. The UI must utilize an Email Waitlist when a region's slots are full.

### 6.2 Numeric rules
* All caps, regions, and pricing are defined strictly in `src/lib/constants.ts`.

---

## 7) Taxonomy (Umbrella + Escape Hatch)

* Discovery is driven by ~6 broad Umbrella Categories (e.g., Design & Art, Dev Tools).
* An **"Other" text input** must exist for niche products, allowing the database to capture emerging trends without upfront market research.

---

## 8) "Alive-but-fast" Rule (Daily Shuffle)

* Manual editorial curation is banned for the MVP to reduce overhead.
* **The Daily Shuffle:** The default directory query for non-featured profiles must use a daily randomized database seed so the UI looks fresh every 24 hours.

---

## 9) Signature UI & High-Density Constraints

### 9.1 High-Density UI (Anti-Scroll Fatigue)
* Cards must prioritize information density over "airy" padding.
* Strict 2-line clamping for all descriptions.
* Horizontal scrolling must be used for tags and categories to protect vertical viewport space on mobile.

### 9.2 Headless Architecture
* Use unstyled component libraries (e.g., shadcn/ui) to enforce accessibility without writing primitive CSS.
* React Server Components (RSC) must be heavily utilized for read-heavy public profile pages to guarantee mobile Lighthouse performance.

---

## 10) Credibility & Data Automation

### 10.1 Zero-Touch Metrics
* Banned claims: "Thousands of users", "Trusted by".
* **Rule:** All social proof (e.g., "145 active digital drops", "Updated Today") must be powered by automated Supabase Views/RPCs. No hardcoded or manually updated stats.

### 10.2 Outbound Click Tracking
* **Rule:** To measure MVP success, direct `href` links to external stores are banned.
* All product outbound links must route through an internal API endpoint (e.g., `/api/redirect?url=...`) to log the CTR event before redirecting the visitor.
