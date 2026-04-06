# Suburbmates — UX Spec (Interaction Patterns & Rules)

> Defines interaction patterns, information architecture, and UX rules for the **v2.1 Minimal Directory**.
> For visual tokens, component recipes, and colour/typography rules → see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
> For runtime visibility rules, schema contracts, and seeder requirements → see [`SSOT_V2.1.md`](./SSOT_V2.1.md) §8.

> [!IMPORTANT]
> **SSOT ALIGNMENT (v2.1):** No pricing, no quotas, no durations. Implementation truth belongs in `docs/VERIFICATION_LOG.md`.

---

## 1) Core Comprehension Rule

> The user should understand within 1 second:
> 1. What this surface is
> 2. What they can do
> 3. Where the action is

Every surface, card, and page must pass this test. If it doesn't, the surface has too much cognitive load.

---

## 2) Information Architecture (Mobile-First)

### 2.1 Hierarchy of Intent
*   **Browse-first Discovery:** Hero tiles (Category/Region) provide low-intent entry points.
*   **Global Search:** High-intent search bar provides instant querying.
*   **Creator Profiles as Mini-sites:** Profiles are the final destination for discovery and shareable assets.

### 2.2 Primary Destinations
*   **The Homepage (`/`):** High-density entry for Browse Tiles.
*   **Regional Folders (`/regions`):** The 6-Region Metro mapping.
*   **Creator Profiles (`/creator/[slug]`):** Branding, Portfolio, and Product Cards.
*   **Outbound Gate (`/api/redirect`):** Mandatory tracking layer (invisible to user).

---

## 3) Navigation Patterns

### 3.1 Mobile Tab Bar
*   **Pattern:** Floating Glass Tab Bar at the bottom (`bottom-4`).
*   **Thumb-friendly:** All tap targets must be ≥ 44px.
*   For exact styling → see `DESIGN_SYSTEM.md` §3.2.

### 3.2 Desktop Navigation
*   **Pattern:** Minimalist header with Logo (left), Search (center), and Profile (right).
*   **Constraint:** Do not "desktopify" the UI at the expense of mobile density.

---

## 4) Search & Taxonomy

### 4.1 Search UX
*   **Persistent Search:** The global search bar remains accessible on all discovery routes.
*   **Desktop:** Embedded in the header (routes to `/regions?search=`).
*   **Directory:** Full-width search bar with trending term chips.
*   **Constraint:** Autocomplete must be non-blocking.

### 4.2 Regional Filters
*   **Pattern:** Bottom Sheet Drawer on mobile.
*   **Mapping:** Must strictly adhere to the **6 Metropolitan Regions** defined in `src/lib/constants.ts`.

---

## 5) Interaction Enforcement Rules

### 5.1 Primary Action Rule

Every surface must have exactly **ONE** primary action. No competing CTAs.

| Surface | Primary Action | Terminal? |
|---------|---------------|-----------|
| Creator Card | Open creator profile | No |
| Product Card | Redirect externally via `/api/redirect` | Yes |
| Creator Profile | Browse products | No |
| Search Results | Open creator profile | No |

### 5.2 Information Density Rule

Each card or list item may display a **maximum** of:
*   1 primary label (name or title)
*   2 metadata fields (region, category)
*   1 optional count (products)

**Descriptions are NOT allowed on cards.** Descriptions only appear on the creator profile page itself.

### 5.3 View Modes

| Mode | Default? | Purpose | Layout |
|------|----------|---------|--------|
| **Grid View** | Yes | Visual discovery, image-first | 2-col mobile, 3-col desktop |
| **List View** | No | Fast scanning, metadata-first | Thumbnail + metadata rows |

Grid is the default. List view is a future enhancement but the architecture must not block it.

---

## 6) Creator Profile (The Mini-Site)

### 6.1 Visual Hierarchy
1.  **Identity:** Creator Name + Unified Category + Council Cue.
2.  **Portfolio:** High-precision imagery.
3.  **Product Drops:** High-density 2-column mobile grid.

### 6.2 Product Cards (The Asset Showcase)
*   **Attribution:** "Distributed by [Creator]".
*   **Action:** "View Drop" or "Explore Asset".
*   **Implicit Tracking:** All clicks route through `/api/redirect`.
*   **Constraint:** No in-app "Product Detail" page. Tapping the card performs an external redirect.

---

## 7) Deprecated UX Patterns (Banned)

These constraints protect the core advantage: **speed + clarity**.

### 7.1 Permanently Banned
*   No in-app checkout or payment status screens.
*   No "Featured Queue" progress tracking.
*   No sidebars for navigation (Mobile).
*   No "Add to Cart" interactions.
*   No tier-based or vendor-based language in any surface.
*   No product detail pages (cards → external redirect only).
*   No modal interruptions in the core discovery flow.
*   No multi-step interactions before the user reaches content.

### 7.2 Deferred (Not Before Data Scale)
*   No "Save" / "Wishlist" / "Bookmark" features.
*   No "Compare" features.
*   No user-generated reviews or ratings.
*   No in-app messaging between visitors and creators.

> [!CAUTION]
> Adding any §7.1 item back requires an explicit SSOT amendment with justification. These are architectural constraints, not feature backlog items.
