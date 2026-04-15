# Suburbmates — PRD (Updated 16 April 2026)

## Current State
- 27 listings live in database (26 unclaimed + 1 test)
- 19 Inner Metro, 7 Northern
- 7 of 18 categories populated
- Design overhaul PR submitted: `ui-ux-design-overhaul` branch
- Featured v2 spec documented on `featured-listings-v2` branch (planning only)

## What Was Done This Session
1. Researched 26 real Melbourne digital creators across Inner Metro and Northern
2. Built `seed-unclaimed.ts` (v3) — unclaimed listing seeder using placeholder auth identifiers
3. Seeded 26 verified businesses to live Supabase database
4. Wrote LISTING_OPERATIONS_RUNBOOK.md with full instructions for future seeding, claims, removal

## Branches
| Branch | Status |
|---|---|
| `main` | Production |
| `ui-ux-design-overhaul` | PR submitted, pending merge |
| `design-and-featured` | Superseded by ui-ux-design-overhaul |
| `featured-listings-v2` | Planning spec only |

## Next Actions
- Merge UI/UX PR after review
- Monitor claim requests as creators discover their listings
- Seed Eastern, Western, Inner South-East regions (next batch)
- Diversify categories: Software & Apps, Guides & Ebooks
