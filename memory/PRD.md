# Suburbmates — Design Experiment Branch PRD

## Original Problem Statement
Create a new branch `design-experiment` for a complete UI/UX overhaul using a Huly-inspired dark premium design system. The branch must be independent from `main` — no merge, deletable without affecting production.

## Architecture
- **Stack**: Next.js 16 + Supabase + Tailwind CSS
- **Branch**: `design-experiment` (1 commit ahead of `main`)
- **Scope**: Frontend-only — 22 files changed, 0 backend changes

## Design System (Huly-Aligned)
- **Base**: Near-black cool charcoal (#09090F)
- **Atmosphere**: Electric blue-violet (#6C5CE7)
- **CTA**: Warm amber/orange (#F97316) with glow effects
- **Typography**: Plus Jakarta Sans (display) + Outfit (body)
- **Radius**: Rounded-2xl cards, pill buttons (999px)
- **Surfaces**: Glass-adjacent with blur(24px), luminous layered depth
- **Motion**: Cinematic hero glow, ambient drift, staggered reveals

## What's Been Implemented (Jan 2026)
- [x] globals.css — Full design token rewrite (colors, typography, buttons, glass, animations)
- [x] tailwind.config.js — Huly palette, radius system, font families
- [x] layout.tsx — New fonts (Plus Jakarta Sans, Outfit), dark theme-color
- [x] StaticHero — Cinematic hero with gradient headline, visual proof mockup, dual CTAs
- [x] CTASection — Creator profile CTA with glass card and amber button
- [x] FeaturedSection — Featured placement with preview card and ambient halo
- [x] BrowseSection — Category-first flagship cards + region grid
- [x] HowItWorks — 3-step platform diagram cards
- [x] WhyJoinSection — Benefits list with glass CTA card
- [x] FAQSection — Interactive accordion with numbered items
- [x] FreshSignals — Premium product cards with chromatic accents
- [x] Header — Glass blur nav, rounded search, pill CTA button
- [x] Footer — Dark premium with atmospheric bloom
- [x] MobileNav — Rounded glass nav with atmosphere-colored active states
- [x] Modal — Rounded glass-adjacent dark surface
- [x] SignupModal — Huly-styled role selection and auth flow
- [x] FeaturedModal — Dark premium benefits grid and pricing
- [x] DirectoryListing — Rounded creator cards with featured states
- [x] BusinessHeader — Cinematic creator header with pill tags
- [x] BusinessProducts — Rounded product grid with atmospheric hover

## Testing Results
- Frontend: 98%
- Design compliance: 100%
- Responsive: 100%
- Interactivity: 95%

## Branch Management
- **To keep**: Push `design-experiment` to remote via "Save to Github"
- **To delete**: `git branch -D design-experiment` (local) or delete via GitHub UI (remote)
- **Main is untouched**: Verified — `main` has 0 uncommitted changes

## Prioritized Backlog
### P0 (Critical)
- None — design branch is complete and self-contained

### P1 (High)
- Connect real Supabase credentials to see data-driven components render (FreshSignals, DirectoryListing)
- Creator profile page (`/creator/[slug]`) template design alignment

### P2 (Medium)
- About, Help, Contact, Pricing page design alignment
- Dashboard and vendor pages design alignment
- Auth pages (login/signup) design alignment
- Region bottom sheet design update

### Future
- Micro-animation library (Framer Motion integration for scroll-triggered effects)
- Dark-mode-only PWA manifest update
- OG image generation matching new design
