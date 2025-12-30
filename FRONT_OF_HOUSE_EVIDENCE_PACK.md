# FRONT_OF_HOUSE_EVIDENCE_PACK

## A) Route Map (App Router)

### / (Home)
*   **File**: `src/app/page.tsx`
*   **Main Components**: `HeroCarousel`, `FeaturesGrid`, `FeaturedSection`, `WhyJoinSection`, `HowItWorks`, `Testimonials`, `CTASection`.
*   **Data Fetching**: Primarily static/client components. `FeaturedSection` fetches image via `getImageBySection`.
*   **TODOs**: None found in file.

### /about
*   **File**: `src/app/about/page.tsx`
*   **Main Components**: Static HTML/Tailwind for Story, Mission, Team.
*   **Data Fetching**: Static content.
*   **TODOs**: None explicitly marked, but contains hardcoded placeholder team members.

### /pricing
*   **File**: `src/app/pricing/page.tsx`
*   **Main Components**: `Pricing` (Client Component), `PricingPlans` mapped array, `FAQSection`.
*   **Data Fetching**: Client-side state for `annualBilling` toggle. Hardcoded plan data.
*   **TODOs**: None explicitly marked.

### /directory
*   **File**: `src/app/directory/page.tsx`
*   **Main Components**: `DirectoryHeader`, `DirectorySearch`, `DirectoryFilters`, `DirectoryListing`.
*   **Data Fetching**: `searchParams` passed to `DirectoryListing`. `DirectoryListing` likely fetches data (client-side or server-side inside component).
*   **TODOs**: None found in file.

### /business/[slug]
*   **File**: `src/app/business/[slug]/page.tsx`
*   **Main Components**: `BusinessHeader`, `BusinessInfo`, `BusinessContact`, `BusinessProducts`, `BusinessReviews`, `ImageGallery`, `BusinessShowcase`.
*   **Data Fetching**: `getBusinessBySlug` (Server Side) calls `${baseUrl}/api/business/${slug}`.
*   **TODOs**: None found in file.

### /marketplace
*   **File**: `src/app/marketplace/page.tsx`
*   **Main Components**: `MarketplaceHeader`, `ProductSearch`, `ProductGrid`.
*   **Data Fetching**: Client-side fetch in `ProductGrid`.
*   **TODOs**: None found.

## B) Credibility Risk Register

| Claim Text | File:Line | Risk | Suggested Replacement |
| :--- | :--- | :--- | :--- |
| "Join hundreds of Melbourne businesses" | `src/app/pricing/page.tsx:255` | High (Unverified number) | "Join the growing community of Melbourne businesses" or DB count. |
| "Join hundreds of Melbourne businesses" | `src/components/home/WhyJoinSection.tsx:65` | High | Same as above. |
| "Founder & CEO" (Placeholder) | `src/app/about/page.tsx:184` | High (Fake persona) | Remove specific titles if single founder, or use real profiles. |
| "CTO" (Placeholder) | `src/app/about/page.tsx:194` | High (Fake persona) | Remove or replace with real team/advisor. |
| "Head of Partnerships" (Placeholder) | `src/app/about/page.tsx:204` | High (Fake persona) | Remove or replace. |
| "Trusted by" (implied context) | `src/components/home/HowItWorks.tsx:20` | Medium ("Build trust through reviews") | Ensure reviews are actually implemented and visible. |

## C) Coherence Check: Pricing/Tiers/Featured

### 1. Truth (src/lib/constants.ts)
*   **Basic**: `product_quota: 5`, `monthly_fee: 0`, `commission_rate: 0.08` (Lines 28-34)
*   **Pro**: `product_quota: 50`, `monthly_fee: 2900` ($29), `commission_rate: 0.06` (Lines 35-41)
*   **Premium**: `product_quota: 50`, `monthly_fee: 9900` ($99), `commission_rate: 0.05`, `featured_slots: 3` (Lines 42-49)

### 2. UI Copy (src/app/pricing/page.tsx)
*   **Basic**: "Up to 3 products" (Line 19) **CONFLICT**
*   **Standard** (Pro): "Up to 10 products" (Line 36), Price: $29 (Line 32) **CONFLICT (Product Limit)**
*   **Premium**: "Up to 50 products" (Line 55), Price: $99 (Line 51), "3 featured product slots" (Line 63) **MATCH**

### 3. Gating Logic
*   **Featured Slots**: `src/lib/constants.ts` defines `MAX_SLOTS_PER_LGA = 5` and `MAX_SLOTS_PER_VENDOR = 3`.

### 4. Verdict
| Rule | constants.ts | UI Copy | Conflict? | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| Basic Product Limit | 5 | 3 | **YES** | `constants.ts:29` vs `pricing/page.tsx:19` |
| Pro Product Limit | 50 | 10 | **YES** | `constants.ts:36` vs `pricing/page.tsx:36` |
| Pro Name | "pro" | "Standard" | **YES** | `constants.ts:35` vs `pricing/page.tsx:30` |

## D) Directory/Search Mechanics

### 1. Implementation
*   **Search Endpoint**: `src/app/api/search/route.ts` (Line 15 calls `searchBusinessProfiles`)
*   **Suburb Resolver**: `src/lib/search.ts` uses `resolveLgaMatch` (Line 6) to map suburb terms to LGA IDs.
*   **Data Fetching**: `src/lib/search.ts` -> `searchBusinessProfiles` builds Supabase query:
    *   `from("business_profiles")`
    *   Filtering: `.in("suburb_id", lgaIds)`, `.in("category_id", categoryIds)`, `.eq("vendor_tier", payload.tier)`, `.or("business_name.ilike... profile_description.ilike...")`
    *   Ordering: `featuredMatchesSelection`, `isFeatured`, `tierWeight`, `createdAt` (Lines 163-175).

### 2. Search Pipeline Diagram
```
UI (DirectorySearch) [src/components/directory/DirectorySearch.tsx]
   |
   v (Next.js Navigation)
Page (DirectoryPage) [src/app/directory/page.tsx]
   | (params passed)
   v
API Call (`/api/search`) OR Server Function
   |
   v
Logic (`searchBusinessProfiles`) [src/lib/search.ts:47]
   |
   v (resolveLgaMatch)
DB Query (Supabase) [src/lib/search.ts:87-128]
   |
   v
Result Mapping & Sorting (Featured/Tier logic) [src/lib/search.ts:163]
   |
   v
UI Rendering (`DirectoryListing`)
```

## E) Featured FIFO Mechanics + Expiry

### 1. Selection Logic (The Query)
*   **File**: `src/lib/search.ts`
*   **Function**: `resolveFeaturedProfileMetadata` (Lines 213-263)
*   **Query**:
    ```typescript
    client
      .from("featured_slots")
      .select("business_profile_id, suburb_label, lga_id")
      .eq("status", "active")
      .lte("start_date", now)
      .gte("end_date", now)
    ```
*   **Evidence**: Only "active" slots within the valid date range (`start_date` <= now <= `end_date`) are returned for display.

### 2. Slot Cap Enforcement
*   **File**: `src/app/api/vendor/featured-slots/route.ts`
*   **Line 29**: Queries count of existing slots.
*   **Logic**:
    ```typescript
    const { count } = await supabaseAdmin
      .from("featured_slots")
      .select("*", { count: "exact", head: true })
      .eq("lga_id", targetLgaId)
      .eq("status", "active")
      .gte("end_date", new Date().toISOString());
    // ...
    if (count >= FEATURED_SLOT.MAX_SLOTS_PER_LGA) {
       // Return error: "Featured slots are full..."
    }
    ```
*   **FIFO**: implied by "oldest unpublish" logic in other contexts, but strictly broadly checking "full" here prevents purchase.

### 3. Expiry/Reminders
*   **Selection Expiry**: Handled by the `.gte("end_date", now)` clause in `src/lib/search.ts`. Expired slots simply stop showing up in search results.
*   **Status Update**: **NOT FOUND**. No evidence of a cron job explicitly flipping status to 'expired'.
*   **Reminders**: **NOT FOUND**. No evidence of email triggers or scheduled jobs for reminders found in `src`.

## F) Profile-as-mini-site Readiness

### 1. Current Sections (src/app/business/[slug]/page.tsx)
*   **Header**: `BusinessHeader` (Line 154) - Logo, Name, Verified Badge.
*   **Info**: `BusinessInfo` (Line 160) - Description, Attributes.
*   **Gallery**: `ImageGallery` (Line 164) - Grid of images.
*   **Showcase**: `BusinessShowcase` (Line 168) - Specific feature/highlight component.
*   **Products**: `BusinessProducts` (Line 172) - Digital goods list.
*   **Reviews**: `BusinessReviews` (Line 177).
*   **Sidebar**: `BusinessContact` (Line 184) - Phone, Email, Website, Hours.

### 2. Missing for Variants
*   **Schema**: `BusinessData` interface (Lines 25-49) lacks `template_id` or `theme_config` fields.
*   **Dynamic Rendering**: `BusinessPage` component (Line 142) has a hardcoded layout structure (`grid-cols-1 lg:grid-cols-3`).
*   **Evidence**: `src/app/business/[slug]/page.tsx` directly imports and places components. To support templates, this needs to be a dynamic registry or switch statement based on a DB field.

## G) Safe-to-Change in Hybrid Rebuild

### Safe to Rebuild (UI Surfaces)
*   **Public Pages**: Home (`/`), About (`/about`), Pricing (`/pricing`), Contact (`/contact`).
*   **Directory UI**: `src/app/directory/page.tsx` and all `src/components/directory/*`.
*   **Business Profile UI**: `src/app/business/[slug]/page.tsx` (as long as it fetches same API shape).
*   **Vendor Dashboard UI**: The visible layer of dashboard pages (keeping the data fetching logic intact).

### Do Not Touch (Contracts)
*   **API Routes**: `src/app/api/**/*` - These are working and verified (Stage 3).
*   **Database Schema**: `src/lib/database.types.ts` and actual Supabase tables.
*   **Business Logic**: `src/lib/constants.ts`, `src/lib/stripe.ts`, `src/lib/search.ts` (unless fixing the pricing conflict to match constants).
*   **Webhooks**: `src/app/api/webhooks/stripe/route.ts` - Payment integrity depends on this.
