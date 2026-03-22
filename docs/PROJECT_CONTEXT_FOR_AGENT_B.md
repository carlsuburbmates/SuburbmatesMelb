# Project Context for Agent B (SuburbmatesMelb)

## 1) Current Product Surface (Local Web App)

### Pages & Routes
*   **Public (Marketing & Discovery):**
    *   `/` (Home - Featured signals, hero)
    *   `/directory` (Search & Browse Businesses - Mobile-first filters)
    *   `/marketplace` (Products Browser)
    *   `/pricing` (Vendor Tiers: Basic/Pro - *Note: Current page might still show Premium*)
    *   `/about`, `/help`, `/contact`, `/blog`
    *   `/business/[slug]` (Live Business Profile - renders via `BusinessProfileRenderer`)
    *   `/products/[slug]` (Product Detail Page)
*   **Auth:**
    *   `/auth/login`
    *   `/auth/signup` (with Vendor toggle)
*   **Vendor Portal (`/vendor`):**
    *   `/dashboard` (Overview, Stats)
    *   `/products` (CRUD Management)
    *   `/settings` (Profile, Tier, Stripe Connect)
    *   `/analytics`
*   **Admin:**
    *   **None.** No `/admin` frontend route exists.
    *   *Note:* API middleware supports `role='admin'`, and DB tables (`disputes`, `appeals`, `featured_queue`) exist, but operations are currently manual/SQL-based.

### Navigation Model
*   **Desktop:** Top Header.
    *   Left: Logo ("suburb" + "mates").
    *   Center: Directory, Marketplace, About, Help.
    *   Right: Auth / Profile Dropdown (User Name + Vendor Badge) -> Dashboard / Logout.
*   **Mobile:** Bottom Navigation Bar (Fixed).
    *   Items: Home, Discover (Directory), Shop (Marketplace), Profile (Dashboard).
    *   *Behavior:* Hides automatically on `/business/*` routes ("Sticky Action Bar" takes over).
*   **Special Components:**
    *   **Directory Filters:** Implemented as a "Bottom Sheet" / Drawer on mobile.
    *   **Business Profile:** Uses templates (`StandardTemplate`, `HighEndTemplate`).

### Available Visual Context (E2E Snapshots)
*   `public-home-desktop-darwin.png` / `public-home-mobile-darwin.png`
*   `public-directory-desktop-darwin.png` / `public-directory-mobile-darwin.png`
*   `vendor-vendor-dashboard-desktop-darwin.png` / `vendor-vendor-dashboard-mobile-darwin.png`
*   `vendor-vendor-products-desktop-darwin.png`

---

## 2) Core Entities & Meaning

### The "Things"
*   **Creator (Vendor):** A registered business entity (`vendors` table). Has a tier, verification status (`abn_verified`), and Stripe Connect account.
*   **Listing (Business Profile):** The public face (`business_profiles` table). One-to-one with Vendor. Contains `slug`, `theme_config`, and `template_key`.
*   **Product:** Digital/Physical item sold (`products` table). Managed by Vendor, "Sold by Vendor, Processed by Stripe" (Middleman model).
*   **Featured Slot:** A 30-day promotional placement in a specific Council Area (LGA). Cap of 5 slots per LGA.
*   **Featured Queue:** A FIFO waiting list for Featured Slots when an LGA is full.

### Vendor Tiers (Desired State vs Current Code)
*   **Basic (Free):**
    *   **Cost:** $0/mo.
    *   **Features:** Directory listing + Marketplace access.
    *   **Quotas:** Max **3** products.
    *   **Platform Fee:** **8%** per sale (Paid to SuburbMates).
*   **Pro (Paid):**
    *   **Cost:** **$29 AUD/month** (Recurring).
    *   **Features:** **Minisite** (Profile Template B), Priority visibility (?).
    *   **Quotas:** Max **10** products (Current code says 50).
    *   **Platform Fee:** **6%** per sale (Paid to SuburbMates).
*   **Premium:**
    *   *Status:* **TO BE REMOVED**. (Current code has a $99/mo Premium tier; User specifies only Basic + Pro exist).

### "Featured" Operationally
*   **Definition:** "Featured in [Council Name]". Cost: **$20.00 / 30 days** (Non-recurring).
*   **Rules:**
    *   **Hard Cap:** Max 5 slots per LGA (Local Government Area).
    *   **Fairness:** FIFO (First-In, First-Out).
    *   **Queueing:** If full, a purchase enters the `featured_queue`.
    *   **Automation:** When a slot opens (metadata `end_date`), the next in queue is scheduled.
    *   **Reminders:** Reminder email sent 3 days before expiry.

### Verification States
*   **Identity:** `abn_verified` (Boolean in DB).
*   **Payment:** `stripe_onboarding_complete`.
*   **Evidence:** Admin manually verifies ABN (Australian Business Number).

---

## 3) Public Workflows

### Primary Journey (Search -> Trust -> Connect)
1.  **Entry:** User lands on Home or Directory.
2.  **Filter:** Uses Mobile-first filters (Category, Suburb) to find `BusinessProfile`.
3.  **Evaluate:** Views Profile (Template A/B). Checks "Verified" badges, Products, and "Why Join" trust signals.
4.  **Action:** Clicks "Contact" (Lead) or "Buy Product" (Marketplace Sale).

### Secondary Journey (Vendor Onboarding)
1.  **Signup:** Register -> Toggle "I am a Business".
2.  **Onboard:** Complete Profile -> Connect Stripe -> Pick Tier.
3.  **Upgrade:** Upgrade to Pro/Premium for more specific quotas (50 products vs 3).

### Edge Cases
*   **Dispute:** Customer files dispute -> Vendor gets flagged (?) -> 3 disputes = Auto-Suspend (`auto_delisted_until`).
*   **Featured Capacity:** Vendor tries to buy feature -> "LGA Full" -> Joins Queue (Scheduled future date).

---

## 4) Admin Workflows (Solo Operator Reality)

### Current Status
*   **Manual Only:** Operators must query Supabase directly or use the standard Supabase Dashboard to view `disputes`, `appeals`, or manually flip `vendor_status` to `suspended`.

### Weekly Tasks (The "Queue")
*   **Moderation:** Review new `BusinessProfile` content (Post-publish? Pre-publish? Currently seems post-publish but "Appeals" imply proactive suspension).
*   **Disputes:** Review open `disputes`. Read `evidence_customer` vs `evidence_vendor`.
*   **Decision:** Accept (Refund/Strike) or Reject (No Refund).
*   **Appeals:** Review banned vendors begging to return.
*   **Featured:** Audit the Queue ensures fairness; resolve "stuck" slots.
*   **ABN Verification (Audit):** Check `vendors`. If `abn_verified` is false, check ABN in government lookup (manual) -> flip to `true`.

### "Done" Definition
*   **Zero Inbox:** No open disputes, no unreviewed appeals, no "stuck" queue items.

### Admin Security Model (RLS)
The database already has "Golden Key" RLS policies for `user_type = 'admin'` (Migration 003).
*   **Super-Admin Access:** Autos with `user_type='admin'` can:
    *   `ALL` on: `lgas`, `categories`, `orders`, `refund_requests`, `disputes`, `featured_slots`, `featured_queue`.
    *   `ALL` on `vendors` (including suspending anyone).
    *   `ALL` on `products` (including unpublishing anyone).
    *   `SELECT` on `users` (read all users).
*   **Marketplace View:** `026_enable_admin_marketplace_view.sql` explicitly grants Admins visibility into all `marketplace_sales`.

### ABN Verification Logic
*   **Validation Check:** Zod schema (`abnValidationSchema`) validates input format (11 digits).
*   **Algorithm Check:** `validateABNChecksum` function implements the official Mod-89 ABN algorithm.
*   **Verification Status:** `vendors.abn_verified` defaults to `false`.
### ABN Verification Logic
*   **Validation Check:** Zod schema (`abnValidationSchema`) validates input format (11 digits).
*   **Algorithm Check:** `validateABNChecksum` function implements the official Mod-89 ABN algorithm.
*   **Verification Status:** `vendors.abn_verified` defaults to `false`.
*   **Current State:** There is **NO automated verification**. The code does not call `validateABNChecksum` in any API route to auto-verify. It is a regex/checksum pass for data entry only. Verification is a **Manual Admin Action** (Operator must verify offline and update DB).

### SSOT Policy (Rationale)
*   **Source:** `docs/README.md`, Section 8.1.
*   **Intent:** "ABN verification is **optional** during signup... It does not scrape ABN data into listings."
*   **Why Manual?** Project explictly avoids being a "Scraping Engine". The manual check validates the *human behind the ABN*, not just the number.
*   **Plan:** No immediate plan to automate. This is a deliberate "High Friction, High Trust" gate.

### Implications of Manual Verification
*   **Public (Vendor):**
    *   **Revenue Bottleneck:** Vendors **CANNOT** purchase Featured Slots until verified (Code: `FeaturedModal.tsx`).
    *   **Trust Gap:** New profiles show as "Unverified" until Admin acts.
    *   **Outcome:** Onboarding is friction-heavy; vendors wait for "human approval" to spend money.
*   **Admin (Operator):**
    *   **Daily Task:** Must manually copy ABN -> Check `abr.business.gov.au` -> Update SQL/Dashboard.
    *   **Risk:** If Admin is unavailable, no one can buy Featured Slots.

---

## 5) Automation Intent

### Internal Automation (Executed by Code)
*   **Featured Expiry:** Cron job (`api/cron/featured-expiry`) auto-emails vendors 3 days before expiry.
*   **Queue Promotion:** When slot expires, auto-promote next in line (implied by `fn_try_reserve_featured_slot`).
*   **Auto-Suspend:** If disputes >= 3, Vendor is automatically suspended for 30 days (`src/lib/constants.ts`).

### External Automation (Email/Ops)
*   **Notifications:** "Your slot is expiring", "You have been suspended", "Welcome to Pro".
*   **Risk:**
    *   **High Risk:** Banning a vendor (Auto-suspend exists, but permanent ban likely human).
    *   **Financial:** Refunds (likely human approval required for platform-lost funds, but simple refunds might be vendor-driven).

---

## 6) Brand/UX Constraints

### Design System Fundamentals
*   **Font:** `Poppins` (via Google Fonts).
*   **Gray Scale:** `gray-50` to `gray-900` (Warm/Neutral tone).
*   **Accent Palette:** Specific named accents for overlays/highlights:
    *   `orange` (#FF6B35), `teal` (#20B2AA), `purple` (#8B7DB3), `rose` (#D8A0C7), `amber` (#D4A574), `sage` (#7CAA9D).
*   **Action Colors:** `blue-600` / `blue-700` reserved strictly for Primary CTAs (Buy/Checkout).
*   **Global Classes:** Manual CSS classes exist in `globals.css` (not just Tailwind utility classes):
    *   `.btn-primary` (Dark gray #171717), `.btn-secondary` (White w/ border), `.btn-cta` (Blue).
*   **Animations:** `fade-in`, `slide-up`, `slide-in-left` custom keyframes.

### UX Patterns
*   **Mobile-First:** "Thumb-friendly" is non-negotiable. Filters must be bottom sheets, not sidebars.
*   **No "Admin" Bleed:** Public users must never see "Admin" controls.
*   **Navigation:** Clean, hiding complex menus on Business Profiles to focus on the business content.
*   **Visuals:** Templates (`Standard` vs `HighEnd`) differentiate tiers.

### Trust & Tone
*   **"Middleman" Truth:** Marketplace must explicitly state "Sold by [Creator], Processed by Stripe". No "We sell this" language.
*   **Honesty:** No fake countdowns, no fake "X people viewing this". "Alive" signals must be real data.
*   **No SLA:** The platform is "Solo-founder honest" - do not promise 24/7 support.
