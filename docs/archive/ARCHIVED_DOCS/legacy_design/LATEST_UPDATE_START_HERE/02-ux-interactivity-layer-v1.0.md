# Suburbmates UX Interactivity Layer v1.0

**Status:** LOCKED FOR DEVELOPMENT  
**Version:** 1.0 (Advanced UX + Growth Layer)  
**Date:** November 15, 2025  
**Cross-References:** 02-design-system-v3.1-poppins.md, 02-homepage-complete-specs-v2.1-evolved.md

---

## Purpose

This document specifies the **interactive and behavioral layer** for the Suburbmates homepage and key pages. It builds on the static layout specs (v2.1) and design system (v3.1) to define:

- Scroll animations and scroll-triggered behaviors
- Filter, search, and dynamic content interactions
- Modal flows (onboarding, featured explanations)
- Analytics tracking and event instrumentation
- Performance optimization strategies
- SEO and structured data layer

---

## Scroll Animations & Scroll-Triggered Behaviors

### Animation Hooks

All animations use the following event listener pattern:
```javascript
useScrollAnimation() // Detects element visibility on scroll
useParallax()       // Parallax motion for hero (optional)
```

### Section-by-Section Scroll Behavior

#### **Section 1: Hero Carousel**
- **Behavior:** Hero stays fixed until scroll past (parallax depth: -0.5 on hero image)
- **Scroll Indicator:** Appears at 2% scroll, fades out at 10% scroll
- **Animation:** Subtle fade (opacity 1 → 0, 200ms)
- **Purpose:** Visual hint to scroll; removes when user begins scrolling

#### **Section 2: CTA + Definition**
- **Behavior:** Fade-in on scroll (opacity 0 → 1, 300ms ease-out)
- **Trigger:** When section enters viewport (90% visibility threshold)
- **Stagger:** Text content staggers in 100ms apart (headline → copy → buttons)
- **Purpose:** Progressive content engagement

#### **Section 3: Featured**
- **Behavior:** Fade-in on scroll + subtle shadow depth (2px → 4px blur)
- **Trigger:** When section enters viewport
- **Animation duration:** 300ms
- **Purpose:** Premium positioning signal

#### **Section 4: Browse by Suburb**
- **Behavior:** Fade-in on scroll + translate-up (translateY(20px → 0))
- **Trigger:** When section 50% visible
- **Animation:** Combined fade + translate (300ms ease-out)
- **Purpose:** Energetic entrance

#### **Section 5: How It Works**
- **Behavior:** Fade-in on scroll + translate-up (per step staggered)
- **Trigger:** When section enters viewport
- **Stagger per step:** 1 → 100ms delay, 2 → 200ms delay, 3 → 300ms delay
- **Purpose:** Sequential narrative emphasis

#### **Section 6: Why Join**
- **Behavior:** Fade-in on scroll (with value prop list items staggered)
- **Trigger:** When section 50% visible
- **Stagger per item:** 50ms delay between each bullet
- **Purpose:** Benefit accumulation effect

#### **Section 7: FAQ + Pricing**
- **Behavior:** 
  - FAQ: Fade-in on scroll (accordion items animate when expanded)
  - Pricing: Fade-in + slight scale (scaleY 0.95 → 1)
- **Trigger:** When section enters viewport
- **Animation:** 300ms ease-out

#### **Section 8: Footer**
- **Behavior:** Fade-in on scroll + translate-up
- **Trigger:** When section 75% visible (lazy load footer content)
- **Animation:** 400ms ease-out

### Reduced Motion Support

For users with `prefers-reduced-motion: reduce` media query set:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Hero Parallax (Optional Advanced)

If implementing parallax on hero:
- **Depth:** -0.5 (image moves up slower than scroll)
- **Max offset:** 50px (to prevent extreme distortion)
- **Performance:** Use `transform: translateZ()` and `GPU acceleration` (will-change: transform)
- **Fallback:** Disable parallax on devices <768px or low performance

---

## Filters, Search, and Interactive Content

### Browse by Suburb Section (Future Expansion)

When adding live search + filters to the homepage or `/browse` page:

**Search Bar UX:**
- Placeholder: "Search suburbs... (e.g., Fitzroy, Collingwood)"
- Input: 14px Poppins 400, #374151
- Icon: Magnifying glass, 18px, #6B7280
- Debounce: 300ms (delay before API call)
- Suggestion dropdown: Max 5 results, full-width below input

**Filter Chips:**
- Category filters: "Creators", "Vendors", "Digital Products"
- Active state: Background #1D4ED8 (blue), white text
- Inactive: Background #F3F4F6, border 1px #EBEBF0
- Interaction: Click toggles active state
- Multiple selection: Yes (AND logic)

**Sort Options:**
- Dropdown: "Recommended", "New", "Popular", "A–Z"
- Default: "Recommended"
- Icon: Chevron down (12px, #6B7280)

**Results Display:**
- Grid: 1 column mobile (full-width), 2 columns tablet, 3 columns desktop
- Card: Image (16:9), avatar (32px), name (16px Poppins 600), snippet (13px Poppins 400), CTA button
- Pagination: Infinite scroll OR numbered pagination (12 results per page)
- Empty state: "No creators found in [suburb]. Try another search." (14px, #6B7280, centered)

---

## Featured Creators Section (Interactive Grid)

**Grid Layout:**
- Mobile: 1 column (full-width cards)
- Tablet: 2 columns
- Desktop: 3 columns

**Card Specification:**
- Image: 16:9 ratio (portfolio sample)
- Avatar: 32px circle, positioned top-left
- Name: 16px Poppins 600, #000000
- Badge: "Featured" label (12px, uppercase, on avatar)
- Snippet: Creator bio (13px Poppins 400, #6B7280, max 2 lines)
- CTA: "View Profile" button (13px, secondary style)

**Card Hover/Interaction:**
- Desktop hover: Shadow lift (2px → 8px blur), background subtle shift (#F9FAFB)
- Reveal: "View Profile" becomes prominent
- Animation: 200ms ease-out
- Mobile: Tap reveals "View Profile"; second tap navigates

**Data Source:**
- Pulled from `/api/featured-creators?limit=6&random=true` (rotate daily or per session)
- Or hard-coded mock data for MVP phase

---

## Onboarding Modal Flow

### Trigger Points
1. Click "Build Your Brand" (Section 2)
2. Click "Start Now" (Section 5)
3. Click "Join Free" (Section 6)
4. Click "Get Started Free" (Section 8 footer)
5. Click "Sign Up" (Burger menu)

### Modal Behavior

**Step 1: Role Selection**
- **Title:** "Welcome to Suburbmates!" (20px Poppins 700)
- **Subtitle:** "What brings you here?" (16px Poppins 400, #6B7280)
- **Two buttons:**
  - "I'm a Creator" → Go to Step 2 (Creator flow)
  - "I Want to Sell" → Go to Step 3 (Vendor flow)
- **Interaction:** Buttons have clear hover state (background shift + shadow)

**Step 2: Creator Signup**
- **Fields:**
  - Email: `input type="email"` (placeholder: "your@email.com")
  - Name: `input type="text"` (placeholder: "Your Name")
  - Suburb: `select` (dropdown, 200+ Melbourne suburbs)
  - Consent: Checkbox "I agree to the Terms & Privacy Policy" (required)
- **Button:** "Create My Profile" (blue CTA #1D4ED8)
- **Link:** "Already have an account?" (secondary link, 13px)
- **Validation:** Required fields highlighted in red on error
- **Error message:** "Please complete all fields" (12px, #EF4444 red)

**Step 3: Vendor Signup (Extended)**
- **All Step 2 fields +**
  - ABN: `input type="text"` (placeholder: "12 345 678 901", optional)
  - Business Name: `input type="text"` (placeholder: "Your Business Name", required)
  - Tier selection: "Basic (Free + Commission)" OR "Pro ($20/month)" (radio buttons)
- **Button:** "Start Selling" (blue CTA)
- **Validation:** Same as Step 2

**Modal Styling:**
- **Overlay:** Semi-transparent black rgba(0, 0, 0, 0.5)
- **Modal background:** White #FFFFFF
- **Border-radius:** 6px
- **Max-width:** 400px (mobile), 500px (desktop)
- **Padding:** 24px
- **Shadow:** 2px 8px 24px rgba(0, 0, 0, 0.1)

**Modal Animation:**
- **Open:** Scale 0.95 → 1 + fade in (200ms ease-out)
- **Close:** Scale 1 → 0.95 + fade out (200ms ease-in)

**Close Behavior:**
- Escape key closes modal
- Click outside modal closes modal (optional)
- "X" button top-right (20px, 2px stroke, #6B7280)

---

## CTA Button Split Logic

Based on Section 2 content, implement these button destinations:

**"Build Your Brand"** (Creators)
- Destination: /signup?intent=creator
- Logic: Route to Step 2 (creator flow) in onboarding modal

**"Start Now"** (How It Works)
- Destination: /signup?intent=creator
- Logic: Same as above

**"Join Free"** (Why Join)
- Destination: /signup?intent=creator
- Logic: Same as above

**"Be Featured"** (Featured Section)
- Destination: Modal explanation first (see Featured Info Modal below)
- Then: /signup?intent=vendor

**"Browse Now"** (Browse Section)
- Destination: /browse (directory listing page)
- Logic: No signup required; direct link

**"See Full Pricing & Compare"** (Pricing Section)
- Destination: /pricing (pricing comparison page)
- Logic: No signup required; informational

**"Get Started Free"** (Footer)
- Destination: /signup?intent=creator (default)
- Logic: Can be overridden if user has been browsing vendor sections

---

## Featured Info Modal

**Trigger:** Click "Be Featured" button

**Modal Content:**
- **Headline:** "How Featured Works" (24px Poppins 700, #000000)
- **Body:** 
  - "Featured slots get prime visibility in your suburb directory. Only 5 slots available per suburb, and they rotate every 30 days."
  - "Cost: $20 per slot"
  - "Tier eligible: All vendors (basic & pro)"
  - "Queue: If all slots full, you'll be notified when one becomes available."
- **Button:** "Become a Vendor" (blue CTA, → /signup?intent=vendor)
- **Close:** "Maybe Later" (secondary button)

**Modal Animation:** Same as onboarding modal (scale + fade)

---

## Analytics & Event Instrumentation

### Events to Track

| Event Name | Trigger | Data Captured | Purpose |
|------------|---------|---------------|---------|
| `homepage_load` | Page load | Timestamp, device, referrer | Traffic metrics |
| `hero_scroll_past` | User scrolls past hero (>15% scroll) | Timestamp | Intent verification (forced scroll) |
| `cta_click` | Any CTA button clicked | Button text, section, intent (creator/vendor) | Funnel tracking |
| `signup_modal_open` | Signup modal opens | Source button, intent | Modal conversion |
| `signup_modal_step_complete` | User completes onboarding step | Step #, fields filled, time taken | Funnel analysis |
| `featured_click` | "Be Featured" clicked | Timestamp | Featured interest |
| `featured_info_modal_open` | Featured info modal opens | Timestamp | Education engagement |
| `browse_click` | "Browse Now" clicked | Timestamp | Directory interest |
| `pricing_view` | Pricing section scrolled into view | Timestamp, scroll depth | Pricing interest |
| `filter_applied` | User applies search filter/sort | Filter type, value | Directory engagement |
| `product_card_click` | Featured creator card clicked | Creator ID, position (1-6) | Card engagement |

### Implementation (Pseudocode)

```javascript
// Example using Google Analytics 4 or Mixpanel
import { trackEvent } from '@/lib/analytics';

// CTA Click
button.addEventListener('click', () => {
  trackEvent('cta_click', {
    button_text: 'Build Your Brand',
    section: 'CTA + Definition',
    intent: 'creator'
  });
  openSignupModal('creator');
});

// Scroll past hero
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.15) {
    trackEvent('hero_scroll_past', { timestamp: Date.now() });
    // Fire only once (use flag to prevent duplicate)
  }
});

// Modal completion
form.addEventListener('submit', () => {
  trackEvent('signup_modal_step_complete', {
    step: currentStep,
    fields_filled: filledFieldCount,
    time_taken_ms: Date.now() - stepStartTime
  });
});
```

---

## SEO & Structured Data

### Meta Tags (Per Page)

**Homepage:**
```html
<title>Suburbmates - Free Directory + Digital Marketplace for Melbourne Creators</title>
<meta name="description" content="Join Suburbmates, Melbourne's free creator directory and digital marketplace. Build your brand, get found locally, sell digital products. No fees to list.">
<meta name="keywords" content="creators, digital products, Melbourne, marketplace, directory, freelance">
<meta name="og:title" content="Suburbmates - Free Directory for Melbourne Creators">
<meta name="og:description" content="Join thousands of creators in Melbourne's hyper-local directory and marketplace.">
<meta name="og:image" content="https://suburbmates.com/og-image.jpg">
```

**Pricing Page:**
```html
<title>Suburbmates Pricing - Transparent, Fair Fees</title>
<meta name="description" content="Creator tier: free. Vendor tiers: free basic + commission, or $20/month pro. No hidden fees.">
```

**Browse Directory Page:**
```html
<title>Browse Melbourne Creators by Suburb - Suburbmates Directory</title>
<meta name="description" content="Explore 200+ Melbourne suburbs. Find local creators, vendors, and digital products.">
```

### JSON-LD Schema (Structured Data)

**Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Suburbmates",
  "url": "https://suburbmates.com",
  "logo": "https://suburbmates.com/logo.png",
  "sameAs": [
    "https://twitter.com/suburbmates",
    "https://instagram.com/suburbmates",
    "https://linkedin.com/company/suburbmates"
  ],
  "description": "Free directory and digital marketplace for Melbourne creators"
}
```

**LocalBusiness Schema (Optional):**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Suburbmates",
  "areaServed": "Melbourne, Australia",
  "description": "Hyper-local digital marketplace",
  "url": "https://suburbmates.com"
}
```

---

## Performance Optimization

### Image Optimization
- **Format:** WebP primary, JPEG fallback
- **Sizes:** Lazy-load all images except hero
- **Srcset:** Responsive images per breakpoint
- **Compression:** Tinify/Squoosh (reduce to 200KB mobile, 300KB desktop max)

### JavaScript Optimization
- **Bundle splitting:** Separate code for above-fold vs below-fold
- **Lazy load:** Defer scroll listeners until needed
- **Debounce:** Filter/search input (300ms debounce to API)
- **Memoization:** Cache featured creators, pricing tiers

### CSS Optimization
- **Critical CSS:** Inline critical path (header, hero, fold)
- **Defer non-critical:** Load via `<link rel="preload">`
- **Remove unused:** PurgeCSS on production build

### Lighthouse Targets
- **Performance:** 85+
- **Accessibility:** 95+
- **Best Practices:** 90+
- **SEO:** 95+

---

## A/B Testing Hooks

Ready-to-implement A/B test flags:

| Test | Variation A | Variation B | Metric |
|------|-------------|-------------|--------|
| Hero CTA Visibility | No hero button (current) | Soft hero button above fold | Conversion rate |
| CTA Copy | "Build Your Brand" | "Get Started Free" | CTR, signup rate |
| Featured Price | $20/slot | $15/slot | Featured uptake |
| Pricing Tier Default | Basic (selected) | Pro (highlighted) | Tier adoption |
| Modal Steps | 3 steps (current) | 2 steps (condensed) | Modal completion rate |
| Onboarding Flow | Modal (current) | Dedicated page | Conversion rate |

---

## Future Roadmap (Phase 2+)

- **Social proof:** Testimonial section + metrics band ("1000+ creators", "5000+ products")
- **Dynamic content:** Personalized recommendations based on user history
- **Video:** Hero video with fallback to carousel
- **Live chat:** Support widget (Intercom, Drift)
- **Waitlist:** If capacity-limited, add waitlist signup flow
- **Newsletter:** Email capture for product updates

---

## Version History

- **v1.0** (Nov 15, 2025): Complete UX interactivity layer, analytics, SEO, performance, A/B testing

---

**End of Document**