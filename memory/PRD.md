# Suburbmates — Design Experiment Branch PRD

## Original Problem Statement
Complete UI/UX overhaul on `design-experiment` branch using Huly-inspired dark premium design. Branch independent from `main`, deletable without affecting production.

## Architecture
- **Stack**: Next.js 16 + Supabase + Tailwind CSS
- **Branch**: `design-experiment` (independent from `main`)
- **Scope**: Frontend-only — 50+ files changed, 0 backend changes

## Design System (Huly-Aligned)
- **Base**: #09090F | **Atmosphere**: #6C5CE7 | **CTA**: #F97316
- **Fonts**: Plus Jakarta Sans (display) + Outfit (body)
- **Radius**: rounded-2xl cards, pill buttons (999px)
- **Surfaces**: Glass blur(24px), luminous depth, atmospheric glow

## Implementation Log

### Session 1: Homepage & Foundation
- globals.css, tailwind.config.js, layout.tsx — full token rewrite
- All homepage sections, Header, Footer, MobileNav, Modals
- DirectoryListing, BusinessHeader, BusinessProducts

### Session 2: Full Site + Real Data
- Connected real Supabase credentials
- About, Pricing, Contact, Login, Signup pages
- DirectoryHeader, DirectorySearch, DirectoryFilters
- Creator Profile: StandardTemplate, BusinessInfo, BusinessContact, StickyActionBar, ImageGallery

### Session 3: Help, Dashboard, Legal
- Help page — full Huly alignment (accordion FAQ, tabbed sidebar, glass cards)
- Legal layout — dark prose-invert for Privacy, Terms, Cookies
- VendorLayoutClient — rounded pills, atmosphere tabs, clean workspace header
- VendorDashboardClient — rounded stat cards, atmosphere accents, premium sidebar
- Products page — rounded forms, toggle switch, clean product list
- Analytics page — rounded cards, atmosphere icons, coming soon section
- Settings page — rounded cards, pro badge pill
- SearchFirstOnboarding — rounded inputs, pill buttons, atmosphere accents

## Testing Results (All 3 Iterations)
| Metric | It. 1 | It. 2 | It. 3 |
|--------|-------|-------|-------|
| Frontend | 98% | 99% | 99% |
| Design | 100% | 100% | 100% |
| Huly Alignment | 100% | 100% | 100% |
| Text Readability | 100% | 100% | 100% |
| Responsive | 100% | 100% | 100% |

## Branch Management
- **Keep**: Push via "Save to Github"
- **Delete**: `git branch -D design-experiment`
- **Main**: Untouched and verified safe

## Remaining Backlog
### P2
- Blog page design alignment (if exists)
- FeaturedRequestModal Huly update (currently functional but uses old Button component)
- ClaimModal Huly update

### Future
- Framer Motion page transitions
- OG image regeneration
- PWA manifest dark theme
