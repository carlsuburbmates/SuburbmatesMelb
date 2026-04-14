# Suburbmates — Design Experiment Branch PRD

## Original Problem Statement
Complete UI/UX overhaul on `design-experiment` branch using Huly-inspired dark premium design. Branch independent from `main`, deletable without affecting production.

## Architecture
- **Stack**: Next.js 16 + Supabase + Tailwind CSS
- **Branch**: `design-experiment` (independent from `main`)
- **Scope**: Frontend-only — 50+ files changed, 0 backend changes

## Branch Map
| Branch | Purpose | Status |
|---|---|---|
| `main` | Production | Untouched |
| `design-experiment` | Huly UI overhaul | Active — design complete |
| `featured-listings-v2` | Automated featured pipeline | Planning — spec saved, no code |

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
- Help page — accordion FAQ, tabbed sidebar, glass cards
- Legal layout — dark prose-invert for Privacy, Terms, Cookies
- VendorLayout, Dashboard, Products, Analytics, Settings, SearchFirstOnboarding

### Session 4: Creator Spotlight + Featured Analysis
- Built CreatorSpotlight homepage section (auto-rotating carousel, cinematic card, daily data)
- Replaced FeaturedSection with CreatorSpotlight on homepage
- Deep analysis of featured logic from canonical docs (SSOT_V2.1.md, DATABASE_TRUTH.md)
- Created Featured Listings v2 spec on separate `featured-listings-v2` branch
- Spec includes: automated pipeline, Stripe Checkout, 5 consolidated regions (249 suburbs), multi-region rule, waitlist, cooldown, caps, daily shuffle, kill-switch

## Testing Results (All Iterations)
| Metric | It. 1 | It. 2 | It. 3 |
|---|---|---|---|
| Frontend | 98% | 99% | 99% |
| Design | 100% | 100% | 100% |
| Huly Alignment | 100% | 100% | 100% |
| Text Readability | 100% | 100% | 100% |

## Remaining Backlog (design-experiment)
### P2
- FeaturedRequestModal Huly update (uses legacy Button component)
- ClaimModal Huly update
- "Alive" feel enhancements: mouse-reactive glow, scroll parallax, shimmer skeletons

## Featured Listings v2 (separate branch — post-MVP)
Full spec at: `/app/docs/featured-v2/FEATURED_LISTINGS_V2_SPEC.md`
- 5 regions, 249 suburbs, 3 multi-region suburbs
- Automated: request → validate → Stripe Checkout → webhook activate → expire → waitlist rotate
- Caps: 12/region, 4/category/region, 30-day cooldown
- Zero admin intervention, zero refund policy
- **Blocked until**: sufficient creator base for launch
