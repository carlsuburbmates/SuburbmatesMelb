# Suburbmates v1.1 — Product UX Master Spec (v3.1)

> Last updated: 19 November 2025  
> Sources: 02.0_DESIGN_SYSTEM, 02.1_HOMEPAGE_SPECIFICATION, 02.2_PAGE_MAPPING_AND_LAYOUTS, 02.3_PRODUCT_UX_SPECIFICATIONS, 02.4_PSYCHOLOGY_AND_IMMERSIVE_UX, 02-ux-interactivity-layer-v1.0, image-specifications.md, `LATEST_UPDATE_START_HERE` variants.  
> Policy links: `../00_MASTER_DECISIONS.md`, Stripe design constraints in `../Stripe/`.

This document consolidates every UX artifact into one implementable brief. All pixel values, flows, and interactions come from the locked design system; remove redundant files once they are referenced here.

---

## 1. Brand & Design System Highlights _(source: 02.0 + latest design-system v3.1)_
- **Visual DNA:** Confident minimalism, grayscale-first interface with accent washes (orange/teal/purple/rose/amber/sage) limited to background imagery. CTA blue `#1D4ED8` reserved solely for purchase/signup buttons.
- **Typography:** System sans stacks (SF Pro/Roboto/Segoe) sized at Hero 28px, H2 20px, body 14px, tight letter spacing (−0.3px) on headings, 1.4 line-height on copy. Buttons + inputs all 44px minimum height.
- **Spacing grid:** 8px base unit (12/16/24/32/48 multiples). Layouts adapt from 375px mobile → 1440px desktop with consistent gutters.
- **Component states:** Buttons include hover/active shadows (rgba(29,78,216,0.2)); inputs show success/error (green `#10B981`, red `#EF4444`). All interactive targets ≥44×44px.

## 2. Page Inventory & Layout System _(source: 02.2)_
- **Core surfaces (13 total):** Homepage, directory search, vendor profile, product detail, checkout, onboarding, login, vendor dashboard, analytics, featured placement queue, FAQ/support, legal pages, marketing landers.
- **Responsive rules:**
  - Mobile: single-column, sticky CTA bars, compress hero to 540px max height.
  - Tablet: 2-column sections for cards/testimonials, 24px gutters.
  - Desktop: 12-column CSS grid (content max 1200px) with float cards for featured vendors.
- **Automation callouts per page:** signup and business profile flows include ABN optional step, featured queue informs wait times, search logs telemetry triggered on submit.

## 3. Homepage & Marketing Content _(source: 02.1 + homepage v2.1 evolved)_
- **Hero:** Founder-led messaging (“Melbourne creators selling local-first”), search box with suburb autocomplete, CTA pair: `Browse directory` (primary blue) + `Become a vendor` (ghost). Background uses grayscale portrait with accent gradient overlay.
- **Sections:** Social proof, “How it works” (3 cards), featured business carousel (suburb-specific), featured slot upsell (“$20 featured placement for 30 days”), FAQ accordion, closing CTA.
- **Copy rules:** Transparent commission messaging (6–8%), highlight dozens of automations for zero-manual support, explicitly note “No SLAs. Founder escalation via FAQ.”

## 4. Product & Vendor UX Specs _(source: 02.3)_
- **Directory search:** Input pill with icons (search + filter). Filters for category, suburb (required), tier. Zero-state instructs to choose Melbourne suburb. Featured vendors show “Featured” badge + queue position.
- **Vendor dashboard flows:**
  - Overview: tier card (Directory/Basic/Pro), CTA to upgrade/downgrade, featured slot queue status, telemetry summary (search views, profile clicks).
  - Products: CRUD grid (max items per tier), slug collision warnings, `recordSearchTelemetry()` integration for search insights.
  - Analytics: shows search queries, conversion rates, zero-result alerts.
- **Checkout:** Transparent fee breakdown (product price, Stripe fee, Suburbmates commission). Buttons remain blue, 44px high, full width on mobile.

## 5. Psychology & Interaction Layer _(source: 02.4 + interactivity layer)_
- **Behavioral anchors:** Forced scroll story arc (problem → proof → payoff), grayscale imagery to spotlight CTA. Motion limited to 200ms fade/slide with reduced-motion respect.
- **Micro-interactions:**
  - Scroll-triggered counters on “Vendors served” stats.
  - Accordion for FAQ (one open at a time).
  - Featured carousel auto-advances but pauses on hover.
- **Trust levers:** Optional ABN badge messaging, founder signature block, “Vendor-owned refunds/disputes” note aligning with non-mediation rule.

## 6. Image & Asset Guidance _(source: image-specifications)_
- **Photography:** High-contrast grayscale portraits with overlay gradient (5–10% accent). Showcase real creators in Melbourne contexts (cafés, studios, street markets).
- **Iconography:** Custom “S” pin for loader/close button, line icons (2px stroke, #6B7280) for filters and queue states.
- **Illustrations:** None beyond accent backgrounds; keep page weight low.

## 7. Accessibility & QA Checklist _(source: 02.* + 07.0 QA)_
- WCAG 2.1 AA: color contrast met (grayscale palette), focus outlines visible (#1D4ED8 2px).
- Keyboard flows on search, filters, accordions, modals. Skip-link anchored to main content.
- Forms announce validation states via aria-live; error copy sits below field.
- Animations respect `prefers-reduced-motion` and degrade gracefully.

## 8. Source Mapping & Next Actions
| Section | Legacy assets replaced |
| --- | --- |
| Design system | `02.0_DESIGN_SYSTEM.md`, `LATEST_UPDATE_START_HERE/02-design-system-v3.1-poppins.md` |
| Page layouts | `02.2_PAGE_MAPPING_AND_LAYOUTS.md` |
| Homepage spec | `02.1_HOMEPAGE_SPECIFICATION.md`, `02-homepage-complete-specs-v2.1-evolved.md` |
| UX specs | `02.3_PRODUCT_UX_SPECIFICATIONS.md` |
| Psychology & interactivity | `02.4_PSYCHOLOGY_AND_IMMERSIVE_UX.md`, `02-ux-interactivity-layer-v1.0.md` |
| Imagery | `image-specifications.md` |

Future design tweaks should be applied here first; downstream engineers and QA reference only this v3.1 file plus the master decisions doc.
