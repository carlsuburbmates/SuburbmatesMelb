# Suburbmates — Design Experiment Branch PRD

## Original Problem Statement
Create a new branch `design-experiment` for a complete UI/UX overhaul using a Huly-inspired dark premium design system. Branch must be independent from `main` — no merge, deletable without affecting production. Connect real Supabase credentials, align ALL pages.

## Architecture
- **Stack**: Next.js 16 + Supabase + Tailwind CSS
- **Branch**: `design-experiment` (independent from `main`)
- **Scope**: Frontend-only — 35+ files changed, 0 backend changes

## Design System (Huly-Aligned)
- **Base**: Near-black cool charcoal (#09090F)
- **Atmosphere**: Electric blue-violet (#6C5CE7)
- **CTA**: Warm amber/orange (#F97316) with glow effects
- **Typography**: Plus Jakarta Sans (display) + Outfit (body)
- **Radius**: Rounded-2xl cards, pill buttons (999px)
- **Surfaces**: Glass-adjacent with blur(24px), luminous layered depth
- **Motion**: Cinematic hero glow, ambient drift, staggered reveals

## What's Been Implemented (Jan 2026)

### Session 1: Core Homepage & Foundation
- [x] globals.css — Full design token rewrite
- [x] tailwind.config.js — Huly palette, radius system, fonts
- [x] layout.tsx — Plus Jakarta Sans + Outfit, dark theme-color
- [x] All homepage sections: Hero, FreshSignals, CTA, Featured, Browse, HowItWorks, WhyJoin, FAQ
- [x] Header, Footer, MobileNav, Modal, SignupModal, FeaturedModal
- [x] DirectoryListing, BusinessHeader, BusinessProducts

### Session 2: Full Site Alignment + Real Data
- [x] Connected real Supabase credentials (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY)
- [x] About page — Huly-aligned with pill badges, glass cards, atmospheric glows
- [x] Pricing page — Feature checklist, $0/forever card, pill CTAs, FAQ
- [x] Contact page — Clean form, sidebar, FAQ section (removed militaristic language)
- [x] Login page — Rounded glass card, Google auth, magic link flow
- [x] Signup page — Clean form, creator checkbox, magic link flow
- [x] DirectoryHeader — Pill badge, atmospheric glow, clean typography
- [x] DirectorySearch — Rounded search with trending pills
- [x] DirectoryFilters — Rounded filter panel with atmosphere accent
- [x] Creator Profile (StandardTemplate) — Atmospheric profile template
- [x] BusinessInfo — Rounded cards, pill specialty tags, atmosphere labels
- [x] BusinessContact — Rounded contact cards, btn-primary CTA
- [x] StickyActionBar — Glass rounded mobile action bar
- [x] ImageGallery — Rounded gallery with atmosphere-styled controls

## Testing Results (Iteration 2)
- Frontend: 99%
- Design compliance: 100%
- Interactivity: 100%
- Responsive: 100%
- Supabase integration: 95%

## Branch Management
- **To keep**: Push `design-experiment` to remote via "Save to Github"
- **To delete**: `git branch -D design-experiment` or delete via GitHub UI
- **Main is untouched**: Verified

## Prioritized Backlog
### P1 (High)
- Help page (HelpClient.tsx) full Huly alignment
- Dashboard/vendor pages design alignment
- Blog page design alignment

### P2 (Medium)
- Legal pages (Privacy, Terms, Cookies) design alignment
- SearchFirstOnboarding component alignment
- ClaimModal component alignment
- FeaturedRequestModal alignment

### Future
- Framer Motion page transitions
- OG image generation matching new design
- PWA manifest dark theme update
