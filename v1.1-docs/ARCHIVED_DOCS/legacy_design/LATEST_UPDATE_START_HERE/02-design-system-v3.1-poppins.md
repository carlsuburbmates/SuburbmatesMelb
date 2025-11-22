# Suburbmates Design System v3.1 – Poppins Typography

**Status:** LOCKED FOR DEVELOPMENT  
**Version:** 3.1 (Typography Upgrade from v3.0)  
**Date:** November 15, 2025  
**Supersedes:** 02-product-ux-design-v3.md (v3.0)  
**Cross-References:** 02.1-branding-design-system-complete.md, homepage-complete-specs-v2.1-evolved.md

---

## What Changed (v3.0 → v3.1)

- **Typography System:** System default fonts → **Poppins** (primary branded font)
- **Typeface Scale:** Refined heading sizes to accommodate Poppins' spacious rendering
- **Letter-Spacing:** Updated for Poppins optical balance
- **All other design system elements:** Preserved (colors, spacing, branding, accessibility)

---

## Design Philosophy

Suburbmates is a **premium, minimalist, hyper-local digital marketplace** designed for Melbourne creators and digital vendors. The design system emphasizes:

- **Branded Typography:** Poppins for a modern, confident, founder-forward aesthetic
- **Minimalism:** Grayscale UI with subtle accent colors (applied only in background images)
- **Performance:** Poppins family optimized for web; system fallback for offline/legacy browsers
- **Accessibility:** WCAG 2.1 AA compliance, high contrast, clear hierarchy

---

## Color Palette (Unchanged from v3.0)

### Primary Colors
- **White:** #FFFFFF (all backgrounds)
- **Black:** #000000 (headlines, primary text, icons)

### Grayscale (9 Shades)
- #F9FAFB (lightest, subtle backgrounds)
- #F3F4F6 (light card backgrounds, dividers)
- #EBEBF0 (hover states, subtle borders)
- #D1D5DB (light borders, disabled states)
- #9CA3AF (secondary text, metadata)
- #6B7280 (tertiary text, hints)
- #4B5563 (body text, secondary copy)
- #374151 (dark body text, primary readable)
- #1F2937 (near-black, high contrast)

### Accent Colors (Background Images Only)
Subtle accent colors appear **only in background images** at 5–10% opacity. UI text/components remain grayscale.

- **Orange:** #FF6B35 (hero, featured, CTA sections)
- **Teal:** #20B2AA (browse, directory sections)
- **Purple:** #8B7DB3 (how-it-works, growth sections)
- **Rose:** #D8A0C7 (why-join, community sections)
- **Amber:** #D4A574 (pricing, tier sections)
- **Sage:** #7CAA9D (footer, trust sections)

### Exception: Blue CTA Button
- **Primary CTA Button:** #1D4ED8 (medium blue) — purchase, checkout, high-priority actions only
- **Hover:** #1E40AF (darker blue)
- **Active:** #1E3A8A (darkest blue)
- **Disabled:** #9CA3AF (gray)

---

## Typography System (NEW – v3.1)

### Font Stack (Primary & Fallback)

```css
font-family: 'Poppins', -apple-system, 'Segoe UI', 'Helvetica Neue', sans-serif;
font-display: swap; /* Prevent FOIT */
```

**Poppins Weights to Load:**
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)
- 800 (ExtraBold)
- 900 (Black)

**Fallback Stack:**
1. SF Pro Display (macOS/iOS)
2. Segoe UI (Windows)
3. Helvetica Neue (legacy)
4. System UI (generic fallback)

---

### Heading Hierarchy

| Level | Font Size | Weight | Line Height | Letter-Spacing | Use Case |
|-------|-----------|--------|-------------|----------------|----------|
| **H1** | 48–56px | 800 | 1.1 | -0.02em | Hero headlines, page titles, major sections |
| **H2** | 36–44px | 700 | 1.2 | -0.01em | Section headlines, large cards |
| **H3** | 28–32px | 700 | 1.2 | 0em | Subsection titles, featured badges |
| **H4** | 20–24px | 600 | 1.3 | 0em | Card titles, form labels |
| **H5** | 16–18px | 600 | 1.3 | 0em | Button text, small headings |
| **H6** | 14px | 600 | 1.3 | 0em | Metadata, timestamps |

### Body Text

| Type | Font Size | Weight | Line Height | Letter-Spacing | Color | Use Case |
|------|-----------|--------|-------------|----------------|-------|----------|
| **Primary Body** | 14–16px | 400 | 1.5 | 0em | #374151 | Main copy, descriptions, paragraphs |
| **Secondary Body** | 13–14px | 400 | 1.5 | 0em | #6B7280 | Secondary copy, captions |
| **Tertiary/Hints** | 12px | 400 | 1.4 | 0em | #9CA3AF | Metadata, helper text, timestamps |
| **Microcopy** | 11px | 400 | 1.3 | 0em | #9CA3AF | Form hints, small UI text |

### Special Components

| Component | Font Size | Weight | Color | Use Case |
|-----------|-----------|--------|-------|----------|
| **Button Text** | 13–14px | 600 | White on dark bg | Primary CTAs, secondary buttons |
| **Featured Badge** | 11px | 700 | #000000 | "Featured" label, tier badges |
| **Label (PLANS, CREATORS, etc)** | 12px | 700 | #6B7280 | Section labels, filter tags |
| **Tagline/Subheadline** | 18–20px | 400 | #4B5563 | Hero subheading, context below H1 |
| **Caption** | 13px | 400 | #6B7280 | Image captions, figure descriptions |

---

## Spacing System (Unchanged from v3.0)

### Base Unit
- **8px** — all spacing calculations derived from this unit

### Standard Spacing Scale
- **xs:** 4px (minimal, rare)
- **sm:** 8px (between elements)
- **md:** 12px (card padding, button padding)
- **lg:** 16px (section vertical gap on mobile)
- **xl:** 24px (major section breaks)
- **2xl:** 32px (page-level spacing)

### Mobile Spacing (375px baseline)
- **Page margin:** 12px left/right (leaves 351px content width)
- **Card padding:** 12px all sides
- **Button height:** 44px minimum (touch-friendly)
- **Section gap:** 16–24px vertical

### Desktop Spacing (1024px+)
- **Page margin:** 24–40px left/right
- **Card padding:** 12–16px (maintain consistency)
- **Button height:** 48px recommended
- **Section gap:** 32px vertical
- **Max content width:** 1200px (centered)

---

## Responsive Breakpoints

| Breakpoint | Width | Use Case |
|------------|-------|----------|
| Mobile | 375px | iPhone SE baseline |
| Large Mobile | 480px | iPhone 12/13 |
| Tablet | 768px | iPad, tablet devices |
| Desktop | 1024px | Small laptops, desktop |
| Large Desktop | 1440px+ | Large monitors |

### Typography Scaling Per Breakpoint

**Mobile (375px):**
- H1: 48px
- H2: 32px
- H3: 28px
- Body: 14px

**Desktop (1024px+):**
- H1: 56px
- H2: 44px
- H3: 32px
- Body: 16px

---

## Branding & Logo System

### Logo Variants (Unchanged from v3.0)

**Variant 1: Icon Only**
- Use: Burger menu, favicon, app icon
- Size: 24–32px mobile, up to 64px app stores
- Design: Location pin outline + abstract 'S' glyph, orange gradient dot
- Stroke: 2px
- Spacing: 4px clearance

**Variant 2: Stacked Lockup**
- Use: Mobile footers, narrow layouts
- Icon: 32–48px centered at top
- Text: "suburbmates" lowercase, "suburb" in black, "mates" in slate blue (#5B8DC7)
- Total height: 80–100px

**Variant 3: Horizontal Lockup (Primary)**
- Use: Headers, hero, brand communications
- Icon: Left (28–32px)
- Text: Right (12–16px gap)
- Font: Poppins, 600 weight (SemiBold)
- Word split: "suburb" black, "mates" slate blue

---

## Navigation System

### Header (All Pages)

**Mobile (375px):**
- Height: 56px
- Logo: Horizontal lockup, 28px height
- Right: Burger icon (custom 'S' glyph, 24px, 2px stroke)
- Sticky to top, white background, 1px border-bottom (#EBEBF0)

**Desktop (1024px+):**
- Height: 64px
- Logo: Horizontal lockup, 32px height
- Center: Optional horizontal nav (future)
- Right: Burger or account dropdown
- Sticky, white background, 1px border-bottom

### Burger Menu (Glassmorphic Overlay)

**Trigger:** Tap burger icon

**Animation:**
- Slide in from left: 300ms ease-out
- Backdrop blur: 12px (CSS filter)

**Menu Background:**
- Semi-transparent white: rgba(255, 255, 255, 0.9)
- Backdrop filter: blur(12px)
- Left-edge accent: 1–2px colored streak

**Menu Content:**
- Navigation links: 16px Poppins, 600 weight
- Full-width CTA at bottom: "Sign Up" button
- Spacing: 12px padding around content

---

## Button System

### Primary Button (Main CTA)
- **Background:** Dark gray (#374151)
- **Text:** White, 13px Poppins 600, -0.3px letter-spacing
- **Height:** 44px (mobile), 48px (desktop)
- **Border-radius:** 6px
- **Hover:** Background #1F2937
- **Active:** Background #111827, scale 98%
- **Focus:** 2px outline #1F2937

### Secondary Button
- **Background:** Light gray (#F3F4F6)
- **Text:** Black, 13px Poppins 600
- **Border:** 1px #EBEBF0
- **Hover:** Background #EBEBF0

### Blue CTA Button (Purchase/Checkout)
- **Background:** #1D4ED8
- **Text:** White, 13px Poppins 600
- **Height:** 44px (mobile), 48px (desktop)
- **Hover:** #1E40AF
- **Active:** #1E3A8A
- **Shadow:** Subtle (2px blur, rgba(29, 78, 216, 0.2))

---

## Component Library

### Documented Components (Ready for Dev)

1. **Button** (primary, secondary, ghost, blue CTA)
2. **Input** (text, textarea, select, checkbox, radio)
3. **Card** (standard, featured, product)
4. **Avatar** (24px, 32px, 48px, 64px circles)
5. **Badge** (featured, pro, verified—icon + text only)
6. **Modal** (signup, onboarding, transparent overlay)
7. **Toast/Alert** (success, error, info)
8. **Navbar** (sticky, burger menu, logo)
9. **Pagination** (dots for carousel)
10. **Loading Spinner** (minimalist, gray)
11. **Breadcrumb** (optional, text-only)

---

## Microinteractions & Animation

### Standard Durations
- Quick feedback: 120–150ms (button press)
- Medium transition: 300–400ms (menu, fade)
- Slow transition: 500–600ms (page load, scroll)

### Common Interactions

**Button Press:**
- Scale: 100% → 98% on press (120ms)
- Maintains shadow lift

**Menu Slide-In:**
- From left: translateX(-100% → 0)
- Duration: 300ms ease-out
- Backdrop fade-in: 300ms

**Scroll Animations:**
- Fade-in: opacity 0 → 1 (300ms on scroll)
- Translate-up: translateY(20px → 0) (300ms on scroll)
- Respects prefers-reduced-motion

**Card Hover:**
- Border color shift: 200ms
- Shadow slightly stronger: 200ms

---

## Accessibility (WCAG 2.1 Level AA)

### Color Contrast
- Body text vs background: 7:1+ contrast
- All UI text: 4.5:1+ minimum
- Disabled text: 3:1+ acceptable

### Touch Targets
- Minimum 44×44px interactive elements
- 8px spacing between targets

### Keyboard Navigation
- All interactive elements Tab-accessible
- Focus outline: 2px, high-contrast
- No keyboard traps
- Logical tab order

### Screen Readers
- Semantic HTML (buttons, links, headings, lists)
- ARIA labels for icons
- Form labels associated
- Descriptive alt text on images

### Motion & Animation
- Animations default 300–500ms
- Respect `prefers-reduced-motion` media query
- No rapid flashing (>3Hz)

---

## Design Tokens (CSS Variables)

```css
/* Typography */
--font-primary: 'Poppins', system-ui, sans-serif;
--text-h1: 3rem; /* 48px */
--text-h2: 2.25rem; /* 36px */
--text-h3: 1.75rem; /* 28px */
--text-base: 1rem; /* 16px */
--text-sm: 0.875rem; /* 14px */
--text-xs: 0.75rem; /* 12px */

/* Colors */
--color-white: #FFFFFF;
--color-black: #000000;
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-300: #EBEBF0;
--color-gray-600: #4B5563;
--color-text-primary: #374151;
--color-text-secondary: #6B7280;
--color-accent-orange: #FF6B35;
--color-accent-teal: #20B2AA;
--color-cta-blue: #1D4ED8;

/* Spacing */
--space-xs: 0.25rem; /* 4px */
--space-sm: 0.5rem; /* 8px */
--space-md: 0.75rem; /* 12px */
--space-lg: 1rem; /* 16px */
--space-xl: 1.5rem; /* 24px */
--space-2xl: 2rem; /* 32px */

/* Responsive */
--container-max-width: 1200px;
--page-margin-mobile: 0.75rem; /* 12px */
--page-margin-desktop: 1.5rem; /* 24px */
```

---

## Performance Considerations

### Font Loading
- Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)
- Load Poppins from Google Fonts or Bunny Fonts (EU-friendly)
- Subset to Latin characters only (reduce file size ~20%)
- Cache for 1 year (HTTP cache headers)

### Image Optimization
- Lazy-load below-fold images
- Use WebP with JPEG fallback
- Responsive images via srcset
- Optimize accent color overlays via CSS (no image processing)

### CSS & JS
- Minimize repaints (use CSS transforms for animations)
- Defer non-critical CSS
- Throttle scroll listeners

---

## Version History

- **v3.0** (Nov 9, 2025): Initial UX Design System (system fonts, 8px grid, grayscale, accent colors)
- **v3.1** (Nov 15, 2025): Typography upgrade (Poppins primary font, refined heading scale, letter-spacing)

---

**End of Document**