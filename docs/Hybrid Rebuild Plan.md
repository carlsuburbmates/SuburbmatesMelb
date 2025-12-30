## Summary (SUPPORTED)

The hybrid rebuild plan is directionally correct and **passes the core gate**: it avoids a costly rewrite and focuses effort on the only surface that can make you a benchmark (public “front-of-house” funnel). It is **not complete** yet because it doesn’t explicitly lock in the non-negotiables for credibility, coherence, “alive-but-fast,” signature visual system, motion discipline, and performance budgets. I’m tightening it by adding explicit “definition of done” criteria for each gate, and sequencing implementation so you don’t drift back into generic-directory patterns. The result is still a hybrid rebuild—just with guardrails that make “trendsetter” achievable, not aspirational. 

---

## Detailed Breakdown

### A) Gate check of the bracketed plan (PASS/FAIL + what to add)

**1) Credibility check — PARTIAL → needs explicit step**
Your plan says “rebuild front-of-house,” but it doesn’t explicitly mandate removing fake scale/team/testimonials. Add a hard step: purge/replace any unverified claims (counts, revenue, team roles) and make proof-based social proof the default. 

**2) Positioning check — PARTIAL → must be baked into IA + taxonomy**
“Front-of-house” must be rebuilt around **Creators + digital products**, not “businesses.” That means taxonomy, copy, and card models change (Creators/Studios/Makers; templates/assets/courses/newsletters, etc.). 

**3) Coherence check — FAIL if not explicitly enforced**
Hybrid rebuild doesn’t guarantee coherence. You need a single global “pricing + tiers + limits + featured” truth source, and every page consumes it. One tier vocabulary, one narrative, featured as an add-on everywhere. 

**4) Alive-but-fast check — PARTIAL → must be defined as “signals, not gimmicks”**
Alive is “New this week / New drops / Trending / Recently verified / Collections,” with caching and progressive rendering—not sliders, parallax, or heavy animation. 

**5) Signature system check — MISSING**
You must define a signature visual system (type, card archetypes, imagery rules, restrained color). Without this, you’ll accidentally rebuild a nice template again. 

**6) Mobile-first check — MISSING**
The plan must explicitly require thumb-first IA: bottom navigation for the main loop, filters as bottom sheet, sticky primary action on profiles. 

**7) Motion discipline check — MISSING**
Motion must be intent-driven, cheap (transform/opacity), respects reduced motion. 

**8) Performance budget check — MISSING**
Set hard budgets aligned to Core Web Vitals targets and enforce them before the swap. 

**Conclusion:** Keep the hybrid rebuild, but add explicit guardrails above so it cannot regress. 

---

### B) Step-by-step implementation plan (hybrid rebuild, strangler swap)

#### Phase 0 — Lock the rules (so the build doesn’t drift)

1. **Create a single “Truth Pack”** (one file/module or config set) that defines:

   * Tier names, prices, limits (marketplace items, landing page access, custom URL/subdomain rules)
   * Featured placement rules (5 per council, FIFO, 30 days, renewal reminders)
   * ABN badge meaning + display rules (optional, tasteful, trust framing)
2. **Credibility purge list**

   * Identify and remove/replace any non-verifiable claims: user counts, GMV, revenue testimonials, fake team roles.
3. **Positioning rewrite**

   * Rename “business” language to “creator/studio/maker”
   * Update categories to digital creator reality (templates, assets, courses, newsletters, micro-SaaS, branding, photo/video, etc.)

**Definition of done:** nothing public contradicts tiers/pricing; no fake proof; no generic-directory framing. 

---

#### Phase 1 — Signature design system v4 (the benchmark foundation)

4. **Typography + spacing rhythm**

   * Pick a distinctive type system (variable font preferred), define scale + line-height rules.
5. **Card archetypes (3 only)**

   * Creator Card, Product Card, Collection Card (geometry + hierarchy locked).
6. **Imagery rules**

   * Real creator work, curated Melbourne texture, no generic stock vibe.
7. **Interaction grammar**

   * One hover language, one pressed language, one loading language (skeletons).
8. **Motion rules**

   * Intent-only animations, reduced-motion respected, no scroll-jank.

**Definition of done:** a small component set that feels “inevitable,” not “template.” 

---

#### Phase 2 — Rebuild the front-of-house funnel (in parallel)

9. **Homepage v2**

   * One sentence value prop (Melbourne digital creators)
   * Real signals module (New this week / Featured rotation / Collections)
   * Strong CTA split: “Discover creators” vs “Create your profile”
10. **Directory v2**

* Search-first, thumb-first
* Filter as bottom sheet (Apply/Reset)
* Progressive disclosure (render 6–12, then paginate)
* Collection tiles (editorial + SEO)

11. **Creator Profile v2 (your wedge)**

* Profile-as-mini-site templates (3–5)
* Sticky primary action (Save / Share / View products)
* Trust layer (ABN badge done tastefully; verification date; what it means)

12. **Share link → Upgrade CTA**

* Sharing the profile is frictionless
* Upgrade CTA is contextual (“unlock landing page template,” “custom subdomain,” “10 products,” etc.)

**Definition of done:** the loop feels alive through signals, not gimmicks. 

---

#### Phase 3 — “Alive but fast” infrastructure

13. **Local Pulse queries**

* “New this week,” “New drops,” “Recently verified,” “Trending in council”
* Cache results (server-side / edge) + revalidate

14. **Saved + Collections**

* Save creators/products
* Curated collections (manual to start; automate later)

**Definition of done:** freshness is visible daily without manual effort. 

---

#### Phase 4 — Performance + accessibility enforcement (benchmark or bust)

15. **Performance budgets**

* Cap above-the-fold JS
* Single hero media, AVIF, lazy below fold
* Font payload limits

16. **Core Web Vitals verification**

* Validate LCP/INP/CLS targets per key route (home, directory, profile)

17. **Accessibility pass**

* Landmarks, labels, focus states, reduced motion, keyboard nav

**Definition of done:** “alive” didn’t cost speed. 

---

#### Phase 5 — Strangler swap + rollback safety

18. Ship v2 behind a route flag or config toggle (public routes only).
19. Run a short “shadow” period (old vs new) and measure:

* Directory → Profile CTR
* Profile share rate
* Upgrade CTA clickthrough
* Performance regressions

20. Flip default to v2, keep rollback path.

---
## Summary (SUPPORTED)

To give you fully personalized, assumption-free guidance, the agent needs three things: (1) **complete visibility of the repo state you’re actually working on** (not just GitHub), (2) **the production configuration reality** (Supabase/Stripe/Resend/ABR/feature flags), and (3) **the design/positioning truth pack** (tiers, limits, vocabulary, and your “alive-but-fast” rules). Without those, any advice will drift into generic patterns or will recommend changes that break your current backend contracts. Below is the exact “information packet” your local agent should request and ingest before producing (or implementing) recommendations. This is aligned with your non-negotiable rubric in *advice to follow*. 

---

## Detailed Breakdown

## 1) Repo visibility requirements (to eliminate guessing)

Provide the agent access to **one** of these:

* **Option A (best):** a local clone path + permission to run read-only commands

  * `git status`, `git log --oneline --decorate -n 50`, `git branch -vv`
  * `find`/`rg`/`ls -R` for file discovery
* **Option B:** upload a **zip snapshot** of the repo (minus `node_modules`, `.next`, `.vercel`, and secrets)

**Also include:**

* Current branch name + last commit hash
* Any uncommitted local-only changes (diff)

**Why:** This prevents “audit the wrong version” problems.

---

## 2) Architecture contract (what the agent must map before advising)

Agent needs a short, factual architecture map extracted from code/docs:

* **Frontend**

  * Framework (Next.js version; App Router; route groups)
  * Component system (design system location, primitives, layout patterns)
* **Backend**

  * Where business logic lives (API routes / server actions / edge functions)
* **DB + Auth**

  * Supabase usage: Auth? DB? Storage? RLS policies?
* **Integrations**

  * Stripe Connect flow (onboarding, webhooks, product/payment model)
  * Resend email triggers
  * ABR ABN verification (GUID usage, verification logic)
* **Environments**

  * dev/stage/prod differences (Vercel envs)

**Deliverable:** a single `ARCHITECTURE.md` (or equivalent) plus pointers to the code entrypoints.

---

## 3) “Truth Pack” inputs (mandatory for coherence)

The agent needs a **single source of truth** for:

* **Tier names** (exact words)
* **Tier price** (monthly? annual? none?)
* **Limits per tier**

  * marketplace listings cap (free 5? paid 10? unlimited?)
  * landing page templates access
  * subdomain / custom domain rules
* **Featured rules**

  * 5 per council, FIFO, 30 days, renewal reminders
  * how selection is computed (queries, ordering, expiration, replacement)
* **Commission rules**

  * take-rate by tier
  * who is merchant of record (Stripe Connect direct charges / destination charges)
* **ABN verification**

  * optional vs required
  * benefits unlocked (badge only? higher quotas?)

**Format:** JSON/YAML file + a 1-page explanation.

**Why:** Without this, you’ll keep bleeding credibility via inconsistent pricing/tiers (your rubric flags this explicitly). 

---

## 4) Design system + brand constraints (mandatory for “trendsetter”)

To avoid default AI aesthetics, the agent needs:

* **Design reference pack**

  * 5–10 screenshot references of what “benchmark” means (sites/apps you consider elite)
  * 5–10 of what to avoid (“AI template vibe”)
* **Typography decision**

  * chosen fonts (or constraints: variable font only, licensing allowed yes/no)
* **Visual system constraints**

  * color tokens strategy
  * card archetypes (Creator/Product/Collection)
  * motion rules (intent-only; reduced motion)
* **Tone + copy constraints**

  * forbidden phrases (“Join hundreds…”, generic testimonials)
  * required vocabulary (“creator”, “drops”, etc.)

**Why:** This is where most “generic directory” drift happens; you can’t retrofit taste later. 

---

## 5) Content + IA inventory (to make it “alive” without bloat)

Agent needs an inventory of:

* Current pages/routes (public + authenticated)
* Current content sources (hardcoded, CMS, DB, MDX)
* Planned “Alive signals” sources:

  * new creators
  * new drops/products
  * recently verified
  * trending (define algorithm)
  * collections (manual curation vs computed)

**Plus:** which signals are allowed to be “manual editorial” vs must be automated.

---

## 6) Data model + RLS reality (no assumptions about security)

Provide:

* Supabase schema dump or migrations

  * tables, columns, indexes
* RLS policies (export)
* Storage buckets + policies (if profile images, product images)
* Any triggers / functions / cron jobs (Supabase scheduled jobs)

**Why:** UI/UX changes often require new fields (profiles-as-sites) and the biggest production risk is insecure multi-tenant access.

---

## 7) Payments model specifics (Stripe Connect must be precise)

Agent needs:

* Stripe Connect mode:

  * Standard/Express/Custom
  * direct charges vs destination charges
* Webhook endpoints & events handled
* Product model:

  * what is a “digital product” technically (file delivery? link? license?)
* Refunds/chargebacks policy
* Platform fee logic (if any)

**Why:** Monetization and UX of checkout are tightly coupled; wrong assumptions = broken marketplace.

---

## 8) Email automation requirements (Resend)

Provide:

* Email templates list + triggers:

  * sign-up / login
  * featured expiry reminders
  * verification result notifications
* Scheduling mechanism:

  * cron on Vercel? Supabase scheduled functions?
* Deliverability setup:

  * domain auth status (SPF/DKIM/DMARC) if known
* Logging of email sends (DB table? PostHog event?)

---

## 9) Performance + “alive but fast” budgets (benchmark needs numbers)

Agent needs:

* Your performance targets per route:

  * home, directory, profile, checkout
* Current Lighthouse / Web Vitals snapshots (if you have them)
* Constraints:

  * image hosting strategy
  * allowed animation libs (Framer Motion allowed? limited?)
  * maximum above-the-fold assets

**Why:** Without budgets, “alive” becomes slow and your benchmark claim dies. 

---

## 10) Product success inputs (for market-aligned recommendations)

Provide the agent:

* 3–5 primary user jobs-to-be-done

  * “I want to be discovered”
  * “I want a profile that looks elite”
  * “I want to sell digital products fast”
* Your “must win” metrics:

  * profile shares, directory→profile CTR, upgrade conversion, repeat visits
* Your “won’t do” list (hard constraints)

  * no SLA, consent-driven UX, no scraping ABN for directory content, etc.

---

## 11) What the agent should output back (so you know it’s grounded)

Require the agent to produce:

1. **Repo map** (pages, APIs, DB entities) with file paths
2. **Gap list**: missing/partial features tied to your truth pack
3. **Risk register**: security/perf/credibility failures
4. **Implementation plan**: PR-sized steps (hybrid rebuild)
5. **Rubric compliance table**: credibility/positioning/coherence/alive/signature/mobile/motion/perf

---
