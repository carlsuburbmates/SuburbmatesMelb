# PLAN: Aggressively Minimal UI Final Overhaul

This plan covers the completion of the visual pivot for Suburbmates, focusing on aesthetic depth, mobile responsiveness, and the new Region Context UX.

## 1. Aesthetic Depth (Tesla Dark)
Apply ambient radial glows and grid textures to remaining major routes to ensure a cohesive, premium experience.

- [ ] **Dashboard (`/dashboard`):** Add background radial glow (primary/secondary) and subtle grid texture overlay.
- [ ] **Creator Profile (`/creator/[slug]`):** Inject category-aware or standard ambient glows and grid texture.
- [ ] **About Page (`/about`):** Apply full aesthetic stack (Glows + Grid).

## 2. Region Context UX (Popover/Bottom Sheet)
Implement a non-selectable information layer for suburbs within regions in `BrowseSection.tsx`.

- [ ] **Interaction:** Triggered by tapping on a region card or label.
- [ ] **UI:** Popover on desktop, Bottom Sheet on mobile.
- [ ] **Content:** Display suburbs for the selected region (Reference `Melbourne Councils Suburbs Council Reference.md`).
- [ ] **Constraint:** Suburbs are for info only; no navigation or selection from this sheet.

## 3. Dashboard Mobile Responsiveness
Refactor the product catalog into a high-density card layout for mobile screens.

- [ ] **Component:** `Dashboard` product table (`src/app/dashboard/page.tsx`).
- [ ] **Threshold:** `< 640px`.
- [ ] **Pattern:** Cards with clear labels, hiding table headers, maintaining vertical density.

## 4. Typography & Token Clean-sweep
Final audit of business components to eliminate "smudged" typography and legacy light-mode remnants.

- [ ] **Standardize Tracking:** Ensure `tracking-widest` (0.1em) is used for labels instead of 0.3em+.
- [ ] **Token Audit:** Replace any remaining `text-gray-*` with `text-ink-*`.
- [ ] **Components:** `BusinessInfo.tsx`, `BusinessContact.tsx`, `BusinessProducts.tsx`.

## 5. Final Verification
Ensure system stability and visual precision.

- [ ] **Build:** Run `npm run build`.
- [ ] **Visual:** Audit mobile views (375px) for all updated routes.
- [ ] **Security:** Run `security_scan.py`.

---

## 🎼 Orchestration Strategy

| Agent | Focus Area Task |
|---|---|
| **frontend-specialist** | Implementation of CSS depths, typography, and standard components. |
| **mobile-developer** | Bottom Sheet logic, Responsive card layouts, and mobile-first density. |
| **performance-optimizer** | Final visual audit, backdrop-filter check, and verification. |
