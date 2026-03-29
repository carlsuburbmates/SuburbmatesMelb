1. ALIGNED (matches SSOT)
	•	“Not a transaction processor (No MoR, no PCI, no checkout).”  ￼
	•	“Creators sell through their own platforms… discovery and routing layer.”  ￼
	•	“No custom Admin frontend… Supabase GUI.”  ￼
	•	“Manual Stripe Payment Links.”  ￼
	•	“All outbound product links MUST use the /api/redirect?productId=... pattern.”  ￼
	•	“Outbound Redirect Gate… Mandatory tracking layer.”  ￼
	•	“Manual billing only; no automated Stripe billing logic.”  ￼
	•	“Click tracking… anonymous via redirect gate.”  ￼
	•	“Discovery Platform… not the seller.”  ￼
	•	“Moderation… Supabase GUI (status = 'published').”  ￼
	•	“Frictionless Scraper… Cheerio for metadata extraction.”  ￼
	•	“Daily Shuffle RPC… randomized discovery.”  ￼

⸻

2. MISSING (defined in SSOT but not implemented / not present)
	•	“Visitors must never encounter a login screen… no middleware protecting public routes.”
→ No explicit confirmation in REFERENCE_ARCHITECTURE.md
	•	“Magic Links + OAuth only… no password UI.”
→ Not explicitly stated in REFERENCE_ARCHITECTURE.md
	•	“Concierge claim profile flow using supabase.auth.admin.generateLink.”
→ Not present in REFERENCE_ARCHITECTURE.md
	•	“6 Metropolitan Regions replacing LGAs (strict taxonomy enforcement).”
→ Not explicitly defined in REFERENCE_ARCHITECTURE.md
	•	“Launch Gate: 15–20 seeded profiles before public release.”
→ Not present in REFERENCE_ARCHITECTURE.md
	•	“ABN regex-only trust model (no API verification).”
→ Not present in REFERENCE_ARCHITECTURE.md
	•	“High-density UI rules (2-line clamp, horizontal scroll, 2.5–3 cards visible).”
→ Not present in REFERENCE_ARCHITECTURE.md
	•	“Browse-first architecture with Category/Region tiles.”
→ Not explicitly present in REFERENCE_ARCHITECTURE.md
	•	“Email waitlist replacing FIFO scheduling.”
→ Not present in REFERENCE_ARCHITECTURE.md

⸻

3. VIOLATIONS (exists but banned by SSOT)
	•	“Route Protection: src/middleware.ts.”  ￼
→ Conflicts with:
	•	“Visitors must never encounter a login screen… no middleware protecting public routes.”

⸻

4. AMBIGUOUS (unclear / conflicting)
	•	“Creator Profiles: src/app/[slug]/page.tsx.”  ￼
→ SSOT expects /creator/[slug] pattern (path naming mismatch not clarified)
	•	“Daily Shuffle RPC: get_daily_shuffle_products.”  ￼
→ SSOT defines behavior but not RPC naming; unclear if logic fully compliant
	•	“Vendor Dashboard: src/app/(vendor)/vendor/dashboard/page.tsx.”  ￼
→ SSOT allows creator dashboard but bans heavy admin UI; unclear scope boundary
	•	“AuthContext + middleware present.”  ￼
→ Could violate Zero-Wall depending on configuration (not defined)

⸻
