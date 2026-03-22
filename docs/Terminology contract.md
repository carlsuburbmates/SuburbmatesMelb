# SuburbMates — Canonical Terminology Contract v1.0

**Status:** LOCKED (must be used across UI copy, specs, and internal docs)
**Scope:** Public web app + Creator (Studio) workspace + Operator dashboard + policies/support lanes
**Banned words:** “profile”, “vendor” (never use anywhere)

---

## 1) Core principles (non-negotiable)

1. **One concept = one canonical term.** No synonyms in UI copy.
2. **“Studio” is private only.** Never refer to the public page as “studio.”
3. **Public destinations are always named explicitly:** “Studio page” (Basic) or “Pro Mini-site” (Pro mode).
4. **Directory must safely include unclaimed entries.** Therefore “Listing” is the public noun for Directory items.
5. **Truth UI language is mandatory.** No implied endorsement; paid placement and verification are mechanism-honest.

---

## 2) Canonical vocabulary (must use)

### 2.1 People and roles

**Creator**

* **Definition:** A registered owner of a claimed Listing, who can publish Products and manage their presence.
* **Where used:** Public + Creator area.
* **Example UI:** “Sold by [Creator]”; “Become a Creator”.

**Customer**

* **Definition:** Any visitor/buyer browsing Directory/Marketplace (may be logged out).
* **Where used:** Public help text only.

**Operator**

* **Definition:** The solo platform owner running internal operations and enforcement.
* **Where used:** Internal only.

---

### 2.2 Public objects and destinations

**Listing**

* **Definition:** A Directory entry representing a local business/entity. Listings may be unclaimed or claimed.
* **Where used:** Public Directory UI.
* **Example UI:** “Claim this listing”.

**Unclaimed listing**

* **Definition:** A Listing with no Creator owner.
* **Hard rule:** **Unclaimed listings route to Claim flow only.** No public detail page.

**Claimed listing**

* **Definition:** A Listing that has been claimed and is now owned by a Creator.

**Studio page**

* **Definition:** The public destination page for a claimed Creator on **Basic (free)**.
* **Hard rule:** “Studio page” is the public label for Basic mode.

**Mini-site** (Pro mode)

* **Definition:** The **Pro (paid)** upgrade mode of the Studio page at the **same URL** (unlocked capabilities).
* **Public label rule:** Always display as **“Pro Mini-site”** when you need to signal tier, otherwise keep page label “Studio page” and add a “Pro Mini-site” badge.

**Product**

* **Definition:** A digital item sold by a Creator in the Marketplace.
* **Truth UI rule:** Product pages must clearly state “Sold by [Creator]”.

**Collection**

* **Definition:** A curated public page containing Studios and/or Products.

---

### 2.3 Private creator area (logged-in)

**Studio**

* **Definition:** The Creator’s private workspace (dashboard) where they manage listing details, products, mini-site settings, verification, and share tools.
* **Hard rule:** “Studio” is private-only.

**Mini-site editor**

* **Definition:** A section inside **Studio** where Pro Creators configure Mini-site mode features (Spotlight, Share Kit, ordering, vibe knobs).
* **Availability:** Pro-only controls may appear locked for Basic.

**Share Kit**

* **Definition:** Pro-only share tools (campaign links, deep links, QR mode, preview fields).

---

### 2.4 UI components

**Card**

* **Definition:** A preview component in a list/grid. Cards link to destinations.
* **Types:** Listing card, Studio card, Product card, Collection card.

---

### 2.5 Badges and states (Truth UI)

**ABN verified**

* **Definition:** Verification state based on ABN status check.
* **Rule:** Not paywalled. Independent of tier and Featured.

**Featured placement**

* **Definition:** Paid placement state (time-bound).
* **Rule:** Must always be labeled “Featured placement” and must never imply endorsement.

**Basic**

* **Definition:** Free Creator tier (Studio page mode).
* **Rule:** Not required to be shown as a badge publicly.

**Pro**

* **Definition:** Paid Creator tier (Mini-site mode).
* **Public badge rule:** Use “Pro Mini-site” where it matters (share, top-of-page identity block, etc.).

---

## 3) Forbidden vocabulary (must not appear)

These terms must not appear in **public UI** or **creator-facing UI**, and should be avoided entirely in specs to prevent drift:

* profile
* vendor
* business profile
* admin (public-facing)

Allowed internal-only phrase: “Operator dashboard” (internal tool label), but never public.

---

## 4) Mapping (internal concepts → canonical terms)

Use this mapping when translating code/database concepts into UX copy/spec language.

* Business record / scraped entry → **Listing**
* Unowned scraped entry → **Unclaimed listing** (Claim flow only)
* Owned business record → **Claimed listing**
* Registered owner user → **Creator**
* Creator private portal → **Studio**
* Public creator destination (Basic) → **Studio page**
* Public creator destination (Pro) → **Pro Mini-site** (mode of same URL)
* Curated grouping → **Collection**

---

## 5) State machine (authoritative)

1. **Listing (Unclaimed)**
   → user taps card
   → **Claim flow**

2. **Claim flow**
   → minimal registration
   → user becomes **Creator**
   → Creator gains access to **Studio** (private workspace)

3. **Claimed listing** exists
   → public destination becomes **Studio page** (Basic mode) at canonical URL

4. **Upgrade to Pro**
   → same URL unlocks **Pro Mini-site** mode (Spotlight, Share Kit, advanced controls)

5. **Downgrade from Pro**
   → Pro Mini-site features remain active **until the paid period ends**
   → at end date, Pro features disable automatically and page reverts to **Studio page** mode
   → Pro campaign/deep links are disabled gracefully (no hard 404)

---

## 6) Canonical UI copy bank (must match exactly)

### Public (Directory / Marketplace)

* “Listings”
* “Claim this listing”
* “View Studio page”
* “Pro Mini-site” (badge/label)
* “Featured placement” (badge/label)
* “ABN verified” (badge/label)
* “Sold by [Creator]”

### Creator (Studio)

* “Studio”
* “Mini-site editor”
* “Share Kit”
* “Upgrade to Pro”
* “Pro ends on [date]” (creator-only notice)

### Operator

* “Operator dashboard” (internal only)

---

## 7) Governance (stop-the-line rule)

* Any new term must be added here before it’s used in UI/specs.
* If a doc or UI string uses a forbidden term, treat as a **blocking defect** and replace with canonical wording.
* If there is a mismatch, this contract overrides other docs.

---
