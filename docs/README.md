# Suburbmates — Single Source of Truth (Product Constitution v2.1)

> [!IMPORTANT]
> **MVP LAUNCH FREEZE IN EFFECT**
> This document defines the lean MVP architecture (Aggressively Minimal Directory).
> Zero scope creep permitted. No custom admin UIs. No automated billing engines.
> **This is the ONLY authoritative document for product truth.**

---

## 1) Definition & Positioning

### 1.1 Core Identity
**Suburbmates is a mobile-first directory designed to bridge local Melbourne pride with borderless digital goods.**
*   **Creators:** Be discovered regionally, showcase digital drops via automated cards, and drive trackable outbound traffic.
*   **Visitors:** Browse talent via high-density Category/Region tiles and support the "Melbourne underground" digital economy.

### 1.2 What Suburbmates is NOT
*   Not a transaction processor (No checkout/fees). Vendor is the Merchant of Record.
*   Not a "Search-Only" empty state (Browse-first is mandatory).
*   Not an automated scraper engine (Manual claim/seed model).
*   Not a heavy React dashboard (Admin is 100% via Supabase GUI).
*   Suburbmates does not issue refunds.

### 1.3 Framing Language
*   **Use:** "Melbourne's top digital creators", "Support local", "Drops", "Mini-sites".
*   **Avoid:** "Hyperlocal business directory" (implies physical shops), "Near you".

---

## 2) System Architecture & Infrastructure

### 2.1 Tech Stack
*   Next.js (App Router), TailwindCSS, Supabase (`createRouteHandlerClient`).

### 2.2 Infrastructure Mandate
*   **Remote-Only Supabase:** All environments **MUST** connect to `hmmqhwnxylqcbffjffpj`.
*   **Docker-Free Mandate:** Local Docker/Postgres usage is **EXPLICITLY BANNED**.
*   **Zero-UI Admin:** All moderation, billing (Payment Links), and waitlists are handled via the Supabase Dashboard.

### 2.3 The Outbound Redirect Gate (`/api/redirect`)
*   **Protocol:** `GET /api/redirect?productId=<uuid>`
*   **Contract:** Parse `productId`, query DB for `published` status and `external_url`.
*   **Security:** NEVER accept arbitrary `url` params. Rejects links from unverified/unpublished creators.
*   **Telemetry:** Log `outbound_clicks` (anonymous: No IP/User-Agent).

---

## 3) Authentication (Zero-Wall)

*   **Public Discovery Loop:** `/`, `/regions`, and `/creator/[slug]` are strictly unauthenticated. No middleware or auth-guards permitted.
*   **Creator Authentication:** Standardize on Supabase Magic Link (Email OTP) and OAuth (Google/Twitter). **No password-based UI permitted.**

---

## 4) Taxonomy (The 6-Region Model)

Discovery is grouped by these 6 official Metropolitan Regions. Mapping is immutable:

*   **Inner Metro:** Melbourne, Port Phillip, Yarra. (CBD, Carlton, Richmond).
*   **Inner South-east:** Bayside, Boroondara, Glen Eira, Stonnington. (Hawthorn, Prahran).
*   **Northern:** Banyule, Darebin, Hume, Merri-bek, Nillumbik, Whittlesea. (Brunswick, Coburg).
*   **Western:** Brimbank, Hobsons Bay, Maribyrnong, Melton, Moonee Valley, Wyndham. (Footscray, Yarraville).
*   **Eastern:** Knox, Manningham, Maroondah, Whitehorse, Yarra Ranges. (Box Hill, Ringwood).
*   **Southern:** Cardinia, Casey, Frankston, Greater Dandenong, Kingston, Mornington Peninsula. (Frankston, Dandenong).

---

## 5) Visual Architecture (Obsidian & Ice)

### 5.1 Design System
*   **Palette:** Background `#F5F5F7` (Cool White). Accent `#000000` (Onyx).
*   **Typography:** Upright Bold Sans-Serif only. **Strictly NO Serifs/Italics.**

### 5.2 Liquid Glass Spec (`LazyBusinessCard.tsx`)
*   **Wrapper:** `bg-white/40`, `backdrop-blur-2xl`, `border border-white/60`, `rounded-2xl`.
*   **Density:** "Three-Card Rule" (2.5 to 3 cards visible on mobile).
*   **Clamping:** Strict 2-line limit for all descriptions.
*   **Navigation:** Floating Glass Tab Bar at (fixed `bottom-4`) with `backdrop-blur-lg`.

### 5.3 Asymmetrical Grid
*   The **FIRST** item in any list spans full width (`col-span-full`).
*   Remaining items flow in a 2-column mobile grid.

---

## 6) Core Workflows

*   **The Launch Gate:** Platform must have **15-20 active, claimed profiles** before marketing.
*   **The Daily Shuffle:** Non-featured profiles are randomized daily via database seed for fresh UI.
*   **Frictionless Scraper:** `/api/scrape` (Cheerio/Vercel) extracts Title, Desc, and OG:Image from pasted URLs.
*   **Trust Signal:** Optional ABN field with frontend 11-digit regex only. No ABR verification.

---

## 7) Exclusions & Deprecated Components (DEAD CODE)

The following must be purged or ignored by all agents:
*   In-app checkout / Stripe Connect product sales / `commission_rate`.
*   Marketplace sale webhooks / `marketplace_sale` branch.
*   Pro/Premium tiers.
*   Automated FIFO scheduling / `featured_queue` / `fn_try_reserve_featured_slot`.
*   Legacy `lgas` table (31 councils).
*   Custom Admin frontend routes.
