# Suburbmates — UX Spec (Patterns + Rules)

This document specifies interaction patterns and UX rules.
It contains **no pricing, no quotas, no durations, no caps** (those are numeric policy in `src/lib/constants.ts`).
It contains **no “complete” claims** (implementation truth belongs in `docs/VERIFICATION_LOG.md`).

For product constitution, see `docs/README.md`.

---

## 1) Information architecture (mobile-first)

### 1.1 Default hierarchy

* **Search-first discovery**: Search is primary. Filters are secondary.
* **Collections as taste layer**: Collections create meaning and “alive” signals.
* **Profiles as mini-sites**: Profiles must feel shareable and premium.

### 1.2 Primary destinations

* Discover (Directory)
* Collections (Editorial + signal-based)
* Creator profile
* Marketplace/product detail (where applicable)
* Creator dashboard (for creators only)

---

## 2) Navigation patterns

* Thumb-first bottom navigation is the preferred pattern for the core loop surfaces (if implemented).
* Secondary navigation lives behind a lightweight menu, not a dense header.

### 2.2 Desktop navigation

* Desktop should remain clean and fast; do not “desktopify” the entire UI at the expense of mobile.

---

## 3) Search and filters

### 3.1 Search UX

* Search box is always easy to find on Directory.
* Autocomplete is optional; if used, it must be fast and not block input.

### 3.2 Filters UX (mobile)

* Filters open as a **bottom sheet**.
* Bottom sheet includes:

  * Clear section headings
  * Apply and Reset actions
  * Persisted selection state while open
* Avoid long filter forms; prefer progressive disclosure.

### 3.3 Empty and no-results states

* Provide a helpful next step:

  * broaden search
  * remove a filter
  * view a relevant collection
* No guilt/pressure copy.

---

## 4) Creator profile (mini-site rules)

### 4.1 Profile hierarchy (public)

* Identity: creator name + category + location cue (Melbourne/council if applicable)
* Proof: portfolio/media, product highlights, links
* Action: save/share/view products/contact

### 4.2 Sticky actions (mobile)

* On profile pages, keep primary actions reachable:

  * Save / Share / View Products
* Sticky UI must not obstruct content; it should collapse when scrolling if needed.

### 4.3 Template behavior (if templates exist)

* Templates change layout presentation, not core content.
* Template switching must not lose content or break share previews.

---

## 5) Cards (canonical archetypes)

### 5.1 Creator card

* Clear identity + category + council cue (if used)
* One primary image (consistent crop rules)
* One clear tap target for full profile

### 5.2 Product card

* Product title, image, category cue
* Creator attribution is visible or one tap away
* Consistent affordance for “view details”

### 5.3 Collection card

* Collection name + short descriptor
* Avoid noisy badges; keep it tasteful
* Tap takes you into a focused list experience

---

## 6) Marketplace UX rules (truth + clarity)

* Product detail must show:

  * “Sold by [Creator]. Payments processed by Stripe.”
* Delivery method must be explicit and non-misleading.
* Reduce friction:

  * clean layout
  * simple hierarchy
  * minimal distractions

---

## 7) “Alive-but-fast” implementation constraints

* “Alive” comes from:

  * fresh creators
  * fresh drops
  * updated profiles
  * collections
* Avoid heavy carousels as default.
* Prefer server-rendered modules and cached queries over client-heavy widgets.

---

## 8) Motion discipline

* Motion is user-intent driven (open sheet, confirm action).
* Cheap primitives only (opacity/transform).
* Respect reduced motion.
* Avoid auto-advancing carousels and background motion effects.

---

## 9) Feedback and error states

### 9.1 Forms

* Inline errors near the field.
* Clear success confirmation states.
* Loading states that are calm and non-janky.

### 9.2 Toasts/alerts

* Use sparingly.
* No “gamified” or manipulative messaging.

---

## 10) Accessibility baseline

* Semantic page landmarks.
* Keyboard operability.
* Visible focus states.
* Alt text for meaningful images.
* Avoid “icon-only” buttons without labels.

---
