# Suburbmates — UX Spec (Patterns + Rules)

This document specifies interaction patterns and UX rules for the **v2.1 Minimal Directory**.

> [!IMPORTANT]
> **SSOT ALIGNMENT (v2.1):** No pricing, no quotas, no durations. Implementation truth belongs in `docs/VERIFICATION_LOG.md`. **Visual language is Obsidian & Ice.**

## 1) Information Architecture (Mobile-First)

### 1.1 Hierarchy of Intent
*   **Browse-first Discovery:** Hero tiles (Category/Region) provide low-intent entry points. 
*   **Global Search:** High-intent search bar provides instant querying.
*   **Creator Profiles as Mini-sites:** Profiles are the final destination for discovery and shareable assets.

### 1.2 Primary Destinations
*   **The Homepage (`/`):** High-density entry for Browse Tiles.
*   **Regional Folders (`/regions`):** The 6-Region Metro mapping.
*   **Creator Profiles (`/creator/[slug]`):** Branding, Portfolio, and Product Cards.
*   **Outbound Gate (`/api/redirect`):** Mandatory tracking layer (invisible to user).

---

## 2) Navigation Patterns (Glass UI)

### 2.1 Mobile Tab Bar
*   **Pattern:** Floating Glass Tab Bar at the bottom (`bottom-4`).
*   **Appearance:** `backdrop-blur-lg`, `bg-white/10` (dark) or `bg-black/5` (light), thin `border-t border-white/10`.
*   **Thumb-friendly:** Actions must be reachable within a 44px tap target.

### 2.2 Desktop Navigation
*   **Pattern:** Minimalist header with Logo (left), Search (center), and Profile (right).
*   **Constraint:** Do not "desktopify" the UI at the expense of mobile density.

---

## 3) Search & Taxonomy

### 3.1 Search UX
*   **Persistent Search:** The global search bar remains accessible on discovery routes.
*   **Constraint:** Autocomplete must be non-blocking. 

### 3.2 Regional Filters
*   **Pattern:** Bottom Sheet Drawer on mobile.
*   **Mapping:** Must strictly adhere to the **6 Metropolitan Regions** defined in `src/lib/constants.ts`.

---

## 4) Creator Profile (The Mini-Site)

### 4.1 Visual Hierarchy
1.  **Identity:** Creator Name + Unified Category + Council Cue.
2.  **Portfolio:** High-precision imagery crop (Obsidian & Ice).
3.  **Product Drops:** High-density 2-column mobile grid.

### 4.2 Product Cards (The Asset Showcase)
*   **Attribution:** "Distributed by [Creator]".
*   **Action:** "View Drop" or "Explore Asset".
*   **Implicit Tracking:** All clicks route through `/api/redirect`.
*   **Constraint:** No in-app "Product Detail" page. Tapping the card performs an external redirect.

---

## 5) Visual Constraints (Obsidian & Ice)

*   **Palette:** Background `#F5F5F7` (Cool White). Typography `#000000`.
*   **Typography:** strictly NO Serifs or Italics. Upright Bold Sans-Serif only.
*   **Liquid Glass Spec:** `bg-white/40`, `backdrop-blur-2xl`, `border border-white/60`.

---

## 6) Deprecated UX Patterns (Banned)
*   No in-app checkout or payment status screens.
*   No "Featured Queue" progress tracking.
*   No sidebars for navigation (Mobile).
*   No "Add to Cart" interactions.
