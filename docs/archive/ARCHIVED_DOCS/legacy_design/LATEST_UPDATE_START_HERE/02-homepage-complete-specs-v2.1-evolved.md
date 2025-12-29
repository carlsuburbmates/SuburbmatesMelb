# Suburbmates Homepage Complete Specifications v2.1 – Evolved

**Status:** LOCKED FOR DEVELOPMENT  
**Version:** 2.1 (Homepage Architecture + CTA Refinement + Poppins Integration)  
**Date:** November 15, 2025  
**Supersedes:** homepage-complete-specs-v2.md (v2.0)  
**Cross-References:** 02-design-system-v3.1-poppins.md, 02-ux-interactivity-layer-v1.0.md

---

## What Changed (v2.0 → v2.1)

- **CTA Structure:** Refined placement strategy—hero remains immersive (no button); all CTAs explicit in Section 2 + throughout page
- **Section Split:** FAQ and Pricing separated into distinct sections (improved focus)
- **Typography:** All sizes and weights now reference Poppins (v3.1 Design System)
- **Interactivity:** Added scroll behavior notes for v2.1 (see UX Interactivity Layer doc)
- **Core Psychology:** Preserved—forced scroll, immersive hero, grayscale + accent, minimalist aesthetic

---

## Executive Summary

The Suburbmates homepage is a **mobile-first, minimalist landing page** designed with sophisticated **behavioral psychology** to drive high-quality conversions. The page structure is **8 full-screen mobile sections (375×667px each)**, each with a **background image featuring subtle accent colors (5–10% opacity applied via CSS)**, **tight Poppins typography**, and **clear CTAs strategically placed for progressive engagement**.

**Core Philosophy:**
- Hero Section: Full-screen carousel with **NO conversion CTA**—pure visual storytelling + forced scroll for intent verification
- Forced Deliberate Scrolling: Users self-select by scrolling past hero → 2–3x higher conversion rate on engaged traffic
- Single CTA Per Section: Clear hierarchy, no decision fatigue
- Minimalist Aesthetic: Grayscale UI, subtle accent overlays in images only
- Poppins Typography: Modern, confident, premium brand signal

---

## Homepage Architecture Overview

| Section | Screen | Purpose | Primary CTA | Accent Color | Scroll Behavior |
|---------|--------|---------|-------------|--------------|-----------------|
| 1. Hero Carousel | Mobile native 375×667px | Immersive brand introduction | None (scroll only) | N/A | Auto-advance 4s, manual dots, swipe gesture |
| 2. CTA + Definition | Mobile native 375×667px | Clarify dual model (Creator/Vendor) + first CTA | "Build Your Brand" | Orange (#FF6B35) | Fade-in on scroll |
| 3. Featured | Mobile native 375×667px | Promote scarcity & upgrade | "Be Featured" | Orange (#FF6B35) | Fade-in on scroll |
| 4. Browse by Suburb | Mobile native 375×667px | Promote directory discovery | "Browse Now" | Teal (#20B2AA) | Fade-in on scroll |
| 5. How It Works | Mobile native 375×667px | Simplify 3-step onboarding | "Start Now" | Purple (#8B7DB3) | Fade-in + translate-up |
| 6. Why Join | Mobile native 375×667px | Trust & value signals | "Join Free" | Rose (#D8A0C7) | Fade-in on scroll |
| 7. FAQ | Mobile native 375×667px | Answer common questions | None (accordion) | Amber (#D4A574) | Accordion collapse/expand |
| 7. Pricing | Mobile native 375×667px | Tier comparison | "See All Plans →" | Amber (#D4A574) | Fade-in on scroll |
| 8. Footer / Sign-Off | Mobile native 375×667px | Final CTA + brand | "Get Started Free" | Sage (#7CAA9D) | Always visible |

---

## Section Specifications (Detailed)

### SECTION 1: HERO CAROUSEL

**Purpose:** Immersive, brand-establishing first impression. Zero conversion CTA—purely visual storytelling.

**Layout Type:** Full-screen carousel, 3 images rotating

**Mobile Specs (375×667px):**
- Full-viewport coverage (9:16 portrait ratio)
- No margin or padding
- Background: Carousel images (grayscale + accent overlay via CSS)
- Overlay: Black gradient 50% opacity, transparent at 40% → solid at bottom

**Carousel Images (3 Total):**
1. **"Showcase Your Talent"** — Solo creator at laptop, focused, ambitious (Orange #FF6B35, 8% opacity)
2. **"Connect Locally"** — Diverse creators collaborating, Melbourne street, community (Teal #20B2AA, 6% opacity)
3. **"Grow Your Income"** — Creator celebrating success, growth visible on screen (Purple #8B7DB3, 7% opacity)

**Carousel Behavior:**
- Auto-advance: 4-second interval (can pause on hover/focus)
- Manual navigation: 3 white dots (12px diameter, centered, 8px spacing)
- Gesture: Swipe left/right to jump to image
- Transition: Fade, 300ms smooth
- Indicator: Subtle "Scroll to explore" text/icon at bottom (small, gray, fades on scroll)

**Text Overlay (Bottom Third):**
- Gradient overlay: Black 50% opacity, transparent at 40% mark → solid at bottom
- Headline: 48px Poppins 800, white, -0.02em tracking (Poppins H1 from v3.1)
- Tagline: 18px Poppins 400, #F3F4F6, -0em tracking
- Spacing: 16px padding bottom, 12px padding left/right
- Positioning: Starts at 60% viewport height

**Accessibility:**
- Carousel dots: Keyboard navigable (Tab, Arrow keys)
- Focus outline: 2px white on active dot
- Alt text: Descriptive per image
- ARIA labels: `aria-label="Image X of 3: [Theme]"`
- Pause button: Visible on hover (optional, for manual control)

**Desktop Behavior (1024px+):**
- Landscape ratio (16:9 or wider)
- Same carousel logic, navigation dots unchanged
- Text overlay scales up: headline 56px, tagline 20px
- Gradient overlay similar
- Scroll indicator more visible (hints at content below)

---

### SECTION 2: CTA + SUBURBMATES DEFINITION

**Purpose:** Explain dual model (free Creator directory + vendor marketplace) and present first major CTAs.

**Layout Type:** Single column, stacked content

**Mobile Specs (375×667px):**
- Background: White (#FFFFFF) with subtle geometric pattern (faint 1px grid, #EBEBF0)
- Padding: 24px all sides (leaves 351px content width)
- Background Accent: Orange #FF6B35, 8% opacity (barely visible corner or edge streak applied via CSS)

**Content Structure (Top to Bottom):**

**1. Headline Section**
- Headline: "Suburbmates is Melbourne's free directory for creators—and a digital marketplace for those ready to sell."
- Typography: 32px Poppins 700, #000000, -0.01em tracking, line-height 1.2
- Spacing below: 16px

**2. Two-Column Content Blocks (stacked on mobile)**

**Block A: For Creators**
- Mini-headline: "For Creators" (20px Poppins 600, #000000)
- Copy: 14px Poppins 400, #374151, line-height 1.5
  - Anyone can join **free**
  - Build profile, showcase work, get found locally
  - No obligation to sell
- Spacing below: 16px

**Block B: For Digital Vendors**
- Mini-headline: "For Digital Vendors" (20px Poppins 600, #000000)
- Copy: 14px Poppins 400, #374151, line-height 1.5
  - Upgrade to **vendor status** (basic free tier or pro)
  - List and **sell digital products** (templates, courses, services)
  - Basic: free, standard commission; Pro: lower fees
  - **No one sells without upgrading to vendor**
- Spacing below: 24px

**3. CTA Buttons (Two-Column Layout on Desktop, Stacked on Mobile)**

**Button A: "Build Your Brand"**
- Style: Primary dark gray (#374151)
- Dimensions: Full-width (351px minus 12px margins = 327px on mobile), 44px height
- Typography: White, 13px Poppins 600, -0.3px letter-spacing
- Interaction: Tap → scale 98%, 120ms press effect; Hover → #1F2937; Focus → 2px outline
- Destination: /signup (intent: creator)
- Spacing above: 8px
- Spacing below: 12px

**Button B: "Start Selling"**
- Style: Secondary light gray (#F3F4F6)
- Dimensions: Full-width (327px on mobile), 44px height
- Typography: Black, 13px Poppins 600
- Border: 1px #EBEBF0
- Interaction: Same as primary
- Destination: /signup (intent: vendor)

---

### SECTION 3: FEATURED SECTION

**Purpose:** Promote scarcity, featured slots, premium positioning.

**Layout Type:** Full-screen with semi-transparent text overlay

**Mobile Specs (375×667px):**
- Background: Grayscale minimalist workspace image (375×667px)
- Background Accent: Orange #FF6B35, 8% opacity (left-edge streak or corner tint applied via CSS)
- Content Overlay: Semi-transparent white 85% opacity, covers bottom 45% of section

**Overlay Content (Bottom Section):**
- Padding: 24px all sides (inside overlay)
- Headline: "Get Featured" (28px Poppins 700, #000000, -0.01em tracking)
- Spacing below: 8px
- Copy: 14px Poppins 400, #374151, line-height 1.5
  - "Stand out."
  - "Go first."
  - "Claim your spotlight in your suburb, every time."
- Spacing below: 16px
- Button: "Be Featured" (full-width, 44px, primary dark gray)
- Additional link: "How Featured Works?" (small, secondary, 12px)

**Featured Logic (Explained in Overlay):**
When user clicks "Be Featured" → Modal or page explains:
- Max 5 featured slots per suburb (LGA-based)
- Each slot: 1 vendor only (no duplicates)
- Duration: 30-day period
- Cost: $20 per slot
- Status: If all 5 full → FIFO queue notification
- Tier Eligibility: All tiers (basic & pro vendors)

**Desktop Behavior (1024px+):**
- Landscape image (16:9 or wider)
- Overlay: 50% height, centered bottom
- Font sizes: Headline 32px, copy 16px

---

### SECTION 4: BROWSE BY SUBURB

**Purpose:** Drive traffic to directory, promote hyper-local discovery (suburb-first, not LGA).

**Layout Type:** Full-screen with text overlay + search hint

**Mobile Specs (375×667px):**
- Background: Grayscale workspace or Melbourne neighborhood image (375×667px)
- Background Accent: Teal #20B2AA, 6% opacity (left-edge streak applied via CSS)
- Content Overlay: Semi-transparent white 85% opacity, bottom 45%

**Overlay Content:**
- Padding: 24px all sides
- Headline: "Explore Your Suburb" (28px Poppins 700, #000000)
- Spacing below: 8px
- Copy: 14px Poppins 400, #374151, line-height 1.5
  - "Search by suburb name, not council."
  - "Discover creators & vendors near you."
  - "200+ Melbourne suburbs."
- Spacing below: 16px
- Button: "Browse Now" (full-width, 44px, primary)
- Search hint: Small gray text, "Try: Fitzroy, Collingwood, Footscray" (optional, 12px Poppins 400)

**Desktop Behavior:** Landscape image, overlay adjustments

---

### SECTION 5: HOW IT WORKS

**Purpose:** Simplify 3-step onboarding, reduce friction.

**Layout Type:** Full-screen with overlay

**Mobile Specs (375×667px):**
- Background: Grayscale clean workspace image (375×667px)
- Background Accent: Purple #8B7DB3, 7% opacity (subtle shadow tint applied via CSS)
- Content Overlay: Semi-transparent white 85% opacity, bottom 45%

**Overlay Content:**
- Padding: 24px all sides
- Headline: "Three Steps to Get Found" (28px Poppins 700, #000000)
- Spacing below: 12px

**Step List (Numbered, Tight):**
- **1. Create Profile** — Signup free, add your work (13px Poppins 400, #374151)
- Spacing: 8px
- **2. Go Visible** — Listed in your suburb directory (13px Poppins 400, #374151)
- Spacing: 8px
- **3. Upgrade & Sell** — Become vendor (optional), go featured (13px Poppins 400, #374151)

**Spacing below steps:** 16px
- Button: "Start Now" (full-width, 44px, primary)

**Scroll Animation:** Sections fade in + translate-up on scroll (see UX Interactivity Layer)

---

### SECTION 6: WHY JOIN

**Purpose:** Build trust, highlight unique value propositions.

**Layout Type:** Full-screen with overlay

**Mobile Specs (375×667px):**
- Background: Grayscale hands-typing-at-desk image (close-up, realistic, 375×667px)
- Background Accent: Rose #D8A0C7, 6% opacity (subtle top-edge streak applied via CSS)
- Content Overlay: Semi-transparent white 85% opacity, bottom 45%

**Overlay Content:**
- Padding: 24px all sides
- Headline: "Built for Creators Like You" (28px Poppins 700, #000000)
- Spacing below: 12px

**Value Props (Bullet List, Tight):**
- Fair fees, no gatekeepers (13px Poppins 400, #374151)
- Spacing: 8px
- SLA-backed support (guaranteed response times) (13px Poppins 400, #374151)
- Spacing: 8px
- Hyper-local discovery (13px Poppins 400, #374151)
- Spacing: 8px
- Featured slots for visibility (13px Poppins 400, #374151)
- Spacing: 8px
- Growing community of makers (13px Poppins 400, #374151)

**Spacing below list:** 16px
- Button: "Join Free" (full-width, 44px, primary)

---

### SECTION 7A: FAQ (ACCORDION)

**Purpose:** Answer common questions, reduce objections.

**Layout Type:** Accordion (expandable/collapsible)

**Mobile Specs (375×667px):**
- Background: White (#FFFFFF)
- Padding: 24px all sides
- No background image for this section

**Accordion Specification:**
- **Headline:** "Common Questions" (28px Poppins 700, #000000)
- **Questions:**
  1. "What is Suburbmates?" → "A free directory + marketplace for Melbourne creators."
  2. "How do I list my digital products?" → "Sign up as a vendor, upload your first product..."
  3. "What fees do you charge?" → "See pricing section below."
  4. "Can I use Suburbmates as a creator only?" → "Yes, completely free..."
  5. "How do featured slots work?" → "Limited slots per suburb, 30-day periods..."

**Interaction:**
- Each question is a clickable accordion item (44px min height)
- Icon: Small chevron (16px, #6B7280) rotates on expand
- Answer: Slides open smoothly (200ms ease-out)
- Only one answer open at a time (typical accordion UX)

**Typography:**
- Question: 16px Poppins 600, #000000
- Answer: 14px Poppins 400, #374151, line-height 1.5

---

### SECTION 7B: PRICING

**Purpose:** Clarify tiers, fees, featured costs.

**Layout Type:** Full-screen with overlay

**Mobile Specs (375×667px):**
- Background: Grayscale creative desk image (books, tablet, minimalist, 375×667px)
- Background Accent: Amber #D4A574, 7% opacity (warm bottom-edge gradient applied via CSS)
- Content Overlay: Semi-transparent white 85% opacity, covers 60% of section (taller overlay)

**Overlay Content:**
- Padding: 24px all sides
- Headline: "Clear. Simple. Transparent." (28px Poppins 700, #000000)
- Spacing below: 12px

**Tier Breakdown (Definition List Format):**
- **Creator Tier:** Free (14px Poppins 400, #374151)
- Spacing: 8px
- **Basic Vendor:** Free listing + 8% commission on sales (14px Poppins 400, #374151)
- Spacing: 8px
- **Pro Vendor:** $20/month + 6% commission (14px Poppins 400, #374151)
- Spacing: 8px
- **Featured Slot:** $20 per slot, 30-day period (14px Poppins 400, #374151)

**Spacing below tiers:** 16px
- Link: "See Full Pricing & Compare →" (13px Poppins 400, #1D4ED8, underlined on hover)
- Destination: /pricing (full pricing page)

---

### SECTION 8: FOOTER / SIGN-OFF

**Purpose:** Final conversion push, brand info, legal links.

**Layout Type:** Stacked content, semi-transparent overlay

**Mobile Specs (375×667px):**
- Background: Grayscale laptop-at-workspace image (showing design, 375×667px)
- Background Accent: Sage #7CAA9D, 6% opacity (subtle overlay tint applied via CSS)
- Content Overlay: Semi-transparent white 95% opacity, covers full section

**Overlay Content (Top to Bottom):**

**1. Final CTA Section (Top)**
- Headline: "Ready to build your brand?" (20px Poppins 600, #000000)
- Spacing below: 12px
- Button: "Get Started Free" (full-width, 44px, primary dark gray)
- Spacing below: 24px

**2. Branding & Social (Middle)**
- Suburbmates logo: Horizontal lockup, 32px height, centered
- Spacing below: 12px
- Social icons (optional, minimal line, 20px, gray #9CA3AF):
  - Twitter/X, LinkedIn, Instagram (if applicable)
  - Spacing: 8px between icons
- Spacing below: 16px

**3. Legal Links (Bottom)**
- Text links (11px Poppins 400, #6B7280):
  - Privacy Policy | Terms of Service | Contact | © 2025 Suburbmates
- Spacing: 4px between links (vertical stack on mobile)
- Padding bottom: 12px

**Desktop Behavior (1024px+):**
- Max-width container, centered
- Logo: 40px height
- Legal links: Horizontal row with " | " dividers

---

## Header (Persistent on All Pages)

**Position:** Sticky to top (remains visible on scroll)

**Mobile Specs (375×667px):**
- Height: 56px
- Background: White (#FFFFFF)
- Border-bottom: 1px #EBEBF0
- Padding: 8px 12px

**Content Layout (Left to Right):**
- **Left:** Suburbmates logo (horizontal lockup, 28px height)
- **Right:** Burger menu icon (custom 'S' glyph pin, 24px, 2px stroke, black)

**Interaction:** Tap burger → Glassmorphic overlay menu slides in from left (see UX Interactivity Layer)

**Desktop Specs (1024px+):**
- Height: 64px
- Padding: 12px 24px
- Logo: 32px height
- Same burger icon or optional horizontal nav menu

---

## Burger Menu (Glassmorphic Overlay)

**Trigger:** Click burger icon

**Animation:**
- Slide-in from left: 300ms smooth ease-out
- Backdrop blur fade-in: 300ms

**Menu Background:**
- Overlay covers 85–90% of viewport width
- Background: Semi-transparent white rgba(255, 255, 255, 0.9)
- Backdrop filter: blur(12px) CSS
- Left-edge accent: 1–2px colored streak (rotating accent per session)

**Menu Content (Top to Bottom):**

**1. Close Button (Top-Right)**
- Icon: Minimal line 'X' (2px stroke, 20px)
- No background, no border
- Padding: 12px

**2. Navigation Links (Stacked Vertically)**
- Full-width, clickable area
- Link list:
  1. Home (→ /)
  2. Browse Directory (→ /browse)
  3. Marketplace (→ /marketplace)
  4. Featured (→ /featured)
  5. How It Works (→ /#how-it-works)
  6. Pricing (→ /pricing)
  7. Sign Up / Dashboard (→ /signup or /dashboard if logged in)

**Link Styling:**
- Font: 16px Poppins 600, tight line-height 1.3
- Color: Black (#000000) at rest
- Padding: 12px left, 8px vertical
- On press/hover: Text color → accent color OR subtle background (#F9FAFB)
- No icons (text-only)

**3. Primary CTA Button (Bottom)**
- Button: "Sign Up" or "Dashboard" (if logged in)
- Style: Primary blue (#1D4ED8)
- Dimensions: Full-width (minus 12px margins), 44px height
- Margin: 12px all sides
- Typography: White, 13px Poppins 600
- Interaction: Tap → scale 98%; Hover → #1E40AF; Focus → 2px outline
- Destination: /signup

**4. Footer (Bottom)**
- Social icons (optional, minimal line, 16px, gray)
- Padding: 12px
- Spacing: 8px between icons

**Close Behavior:**
- Tap menu link → navigates and closes menu
- Tap outside overlay → menu closes, fade-out
- Tap X button → menu closes
- Escape key → menu closes

---

## Responsive Breakpoints & Behavior

### Mobile (375–479px)
- All sections: 375×667px (1:1 mobile screen)
- Full-width buttons, margins 12px sides
- Header: 56px
- All text sizes as specified

### Tablet (480–767px)
- Section heights adjust for wider viewport
- 2-column layout for content blocks (if applicable)
- Button: Still full-width
- Header: 56px

### Desktop (768px+)
- Section widths: Max 1024px, centered
- Landscape image ratios (16:9)
- Button: Auto-width (min 200px) or max 400px
- Header: 64px
- Text sizes scale up (per Poppins scale in Design System v3.1)

---

## Microinteractions & Animation

### Button Press
- Scale: 100% → 98% on press (120ms)
- Opacity: Maintain 100%
- Shadow: Subtle press-down

### Button Hover (Desktop)
- Background color shift: 200ms ease-in
- Shadow: Subtle lift

### Carousel Fade Transition
- Duration: 300ms smooth fade
- Easing: ease-in-out

### Menu Slide-In
- Duration: 300ms
- Direction: Left (translateX -100% → 0)
- Easing: ease-out

### Scroll Animations (See UX Interactivity Layer)
- Fade-in on scroll: opacity 0 → 1 (300ms)
- Translate-up on scroll: translateY(20px → 0) (300ms)

### Focus States
- All interactive elements: 2px outline, color #1F2937 or white (depending on background)
- Outline-offset: 2px (for clarity)
- Duration: Immediate (no transition)

---

## Performance & Technical Notes

### Images
- Placeholder format: Optimized JPG (grayscale)
- Dimensions: 375×667px (mobile), 1024×576px (desktop)
- Accent overlay: Applied via CSS gradient (not baked in)
- Lazy-loading: All images except Hero Image 1
- CDN: Vercel Image Optimization or Cloudinary

### CSS & Performance
- No animations on page load (avoid jank)
- Use `will-change: transform` sparingly (button press only)
- Minimize repaints: Use CSS transforms, not width/height
- Throttle scroll listeners

### SEO & Structured Data
- Proper heading hierarchy: H1, H2, H3 tags
- Meta title, meta description
- Schema markup: JSON-LD for Organization, LocalBusiness (optional)

---

## Accessibility Compliance

**Target:** WCAG 2.1 Level AA

**Key Requirements:**
- Color contrast: 7:1+ for body text, 4.5:1+ for UI text
- Touch targets: Minimum 44×44px
- Keyboard navigation: Full support (Tab, Arrow, Enter, Escape)
- Focus indicators: Visible 2px outline
- Screen readers: Proper ARIA labels, semantic HTML
- Motion: Respect `prefers-reduced-motion`
- Alt text: Descriptive for all images
- Language: `lang="en-AU"` on HTML element

---

## Browser Support

- **Primary targets:** Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Mobile:** iOS Safari 12+, Chrome Android 90+
- **Fallbacks:** All gradients, backdrop filters have fallbacks for older browsers

---

## Handoff Checklist for Development

- [ ] All 8 section layouts coded (mobile + desktop)
- [ ] Carousel logic: auto-advance 4s, manual dots, swipe, fade transition
- [ ] Sticky header: Always visible, burger triggers overlay menu
- [ ] Burger menu: Glassmorphic, smooth slide-in/out, keyboard navigable
- [ ] All buttons: Primary/secondary/blue CTA styling, correct hover/active states, 44px mobile/48px desktop
- [ ] Background images: Placeholder paths defined, accent overlays via CSS
- [ ] Text: All copy as specified, Poppins fonts, sizes, weights, colors, line-height
- [ ] Scroll animations: Fade-in, translate-up on scroll (see UX Interactivity Layer)
- [ ] Responsive: Tested on 375px, 768px, 1024px viewports
- [ ] Accessibility: WCAG 2.1 AA audit passed, focus states visible, semantic HTML
- [ ] Performance: Images optimized, lazy-loaded, animations smooth (60fps)
- [ ] Links: All CTAs route to correct pages (/signup, /browse, /pricing, etc.)
- [ ] SEO: Meta tags, heading hierarchy, schema markup
- [ ] Browser testing: Chrome, Safari, Firefox, Edge (latest versions)

---

## Version History

- **v2.0** (Nov 9, 2025): Complete homepage specification, system fonts, 8 sections, locked psychology
- **v2.1** (Nov 15, 2025): CTA refinement (explicit placement), FAQ/Pricing split, Poppins typography integration, interactivity notes

---

**End of Document**