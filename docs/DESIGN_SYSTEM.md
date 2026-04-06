# Suburbmates — Design System (Obsidian & Ice)

> Canonical reference for all visual tokens, component recipes, and style rules.
> This is the **single source of truth** for design. Code must match these values exactly.

---

## 1. Colour Palette

### 1.1 Core Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `silica` | `#FAFAFA` | Card/section backgrounds |
| `onyx` | `#090A0B` | Primary text, headings, icons |
| `cool-white` | `#F5F5F7` | `<body>` background — **never pure white** |
| `glass` | `rgba(255,255,255,0.05)` | Transparent glass base |

### 1.2 Grayscale Ramp (UI only)

| Token | Value | Usage |
|-------|-------|-------|
| `gray-50` | `#FAFAFA` | Lightest hover backgrounds |
| `gray-100` | `#F5F5F5` | Card hover states |
| `gray-200` | `#E5E5E5` | Borders, dividers |
| `gray-300` | `#D4D4D4` | Secondary borders |
| `gray-400` | `#A3A3A3` | Placeholder text, muted icons |
| `gray-500` | `#737373` | Supporting copy |
| `gray-600` | `#525252` | Body copy |
| `gray-700` | `#404040` | — |
| `gray-800` | `#262626` | Button hover states |
| `gray-900` | `#171717` | `btn-primary` background |

### 1.3 Accent Colours (Section overlay tints only)

| Token | Value | Surface usage |
|-------|-------|---------------|
| `accent-orange` | `#FF6B35` | CSS overlay `rgba(..., 0.05–0.1)` |
| `accent-teal` | `#20B2AA` | CSS overlay |
| `accent-purple` | `#8B7DB3` | CSS overlay |
| `accent-rose` | `#D8A0C7` | CSS overlay |
| `accent-amber` | `#D4A574` | CSS overlay |
| `accent-sage` | `#7CAA9D` | CSS overlay |

> [!IMPORTANT]
> Accent colours are **never** used directly on text, icons, or borders. They exist only as `background: linear-gradient(135deg, rgba(..., 0.05), rgba(..., 0.1))` overlays on sections.

### 1.4 Restricted Colours

| Token | Value | Rule |
|-------|-------|------|
| `blue-600` | `#1D4ED8` | **Purchase/checkout CTA only** — never general UI |
| `blue-700` | `#1E40AF` | Blue hover state |

### 1.5 Deny List

These colours must **never** appear in the codebase:

- `green-*` (any shade) — no green checkmarks, success states, or badges
- `red-*` (any shade) — no red error badges; use `gray-500` + copy for errors
- `amber-600` / `yellow-*` — not in the system
- `slate-*` — use the `gray` ramp above instead
- Any Tailwind default colour not listed here

---

## 2. Typography

### 2.1 Font Stack

| Role | Font | CSS Variable | Loaded via |
|------|------|-------------|------------|
| **Primary** | Poppins (300–900) | `--font-poppins` | `next/font/google` + Google Fonts CSS |
| **Mono** | Geist Mono (100–900) | `--font-geist-mono` | `next/font/google` |

### 2.2 Rules

- **Strictly NO serifs.** No serif font may appear anywhere — headings, body, or accents.
- **Strictly NO italics.** All type is upright.
- **Minimum font size: `11px`** (`text-[11px]`). The `text-[10px]` class is banned for accessibility.

### 2.3 Heading Scale (fluid via `clamp`)

| Level | Size | Weight | Letter-spacing |
|-------|------|--------|----------------|
| `h1` | `clamp(2rem, 5vw + 1rem, 3.5rem)` | 800 | `-0.02em` |
| `h2` | `clamp(1.75rem, 4vw + 0.5rem, 2.75rem)` | 700 | `-0.01em` |
| `h3` | `clamp(1.25rem, 3vw + 0.25rem, 2rem)` | 700 | — |
| `h4` | `clamp(1.125rem, 2.5vw + 0.25rem, 1.5rem)` | 600 | — |

### 2.4 Body Copy

| Element | Size | Weight | Line-height |
|---------|------|--------|-------------|
| `p` | `clamp(0.9375rem, 2vw, 1rem)` | 400 | 1.6 |
| Labels / captions | `11px–12px` | 600–700 | 1.2–1.4 |
| Navigation links | `10px` (header only*) | 900 | — |

> \* The header nav uses `text-[10px]` with `tracking-[0.4em]` uppercase — this is an exception to the 11px rule because the extreme tracking makes it visually equivalent to 12px.

### 2.5 OpenType Features

```css
font-feature-settings: "ss01", "ss02", "cv01";
```

---

## 3. Component Recipes

### 3.1 Liquid Glass Card

The canonical glass recipe. **All glass components must use these exact values.**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.4);     /* bg-white/40 */
  backdrop-filter: blur(40px);               /* backdrop-blur-2xl */
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.6); /* border-white/60 */
  border-radius: 1rem;                        /* rounded-2xl */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.02);
}
```

### 3.2 Mobile Tab Bar (Floating Glass)

```
Position:    fixed bottom-4 left-4 right-4
Background:  bg-black/5 (light mode)
Blur:        backdrop-blur-lg
Border:      border border-white/10
Radius:      rounded-2xl
Height:      h-14
Shadow:      shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]
Active text: text-onyx (fill-current on icon)
Inactive:    text-onyx/40
Label size:  text-[11px] font-bold tracking-wide
```

### 3.3 Buttons

| Class | Background | Text | Radius | Min-height | Use case |
|-------|-----------|------|--------|------------|----------|
| `.btn-primary` | `gray-900` (#171717) | white | 6px | 44px | General primary actions |
| `.btn-secondary` | white | `gray-900` | 6px | 44px | Secondary actions |
| `.btn-cta` | `blue-600` (#1D4ED8) | white | 6px | 44px | **Purchase/checkout only** |

All buttons: `font-weight: 600`, `font-size: 14px`, `letter-spacing: 0.05em`, `text-transform: uppercase`, `transition: all 0.3s ease-out`, hover `scale(1.05)`.

### 3.4 Section Overlays

Accent tints applied via `::before` pseudo-element:

```css
background: linear-gradient(135deg, rgba(COLOR, 0.05) 0%, rgba(COLOR, 0.1) 100%);
pointer-events: none;
```

Classes: `.accent-overlay-orange`, `-teal`, `-purple`, `-rose`, `-amber`, `-sage`.

---

## 4. Spacing & Layout

### 4.1 Container

```
Max-width:  1200px
Padding:    16px (mobile) → 20px (sm) → 24px (md+)
```

### 4.2 Section Padding

```
Vertical:   py-12 md:py-16 lg:py-24 (standard sections)
Vertical:   py-16 md:py-24 (feature sections)
```

### 4.3 Card Radius

| Component | Radius |
|-----------|--------|
| Glass cards | `rounded-2xl` (1rem) |
| Buttons | `rounded-md` (6px) |
| Region/category tiles | `rounded-2xl` |
| Header search input | `rounded-lg` |

---

## 5. Icon System

| Rule | Value |
|------|-------|
| **Library** | Lucide React only — no emojis in UI components |
| **Default size** | `w-5 h-5` (inline), `w-6 h-6` (tiles), `w-8 h-8` (feature circles) |
| **Default stroke** | `strokeWidth={1.5}` |
| **Active stroke** | `strokeWidth={2.5}` |
| **Colour** | `text-onyx` or `text-white` — never accent colours on icons |

---

## 6. Image System

| Rule | Value |
|------|-------|
| **Format** | JPEG (current) — target WebP |
| **Grayscale** | All 18 pre-generated hero images are monochrome |
| **Source of truth** | `src/lib/images.ts` |
| **Asset path** | `/public/images/` |
| **Optimisation** | Use Next.js `<Image>` with `priority` for above-fold |

---

## 7. Animation & Motion

### 7.1 Available Animations

| Name | Duration | Easing |
|------|----------|--------|
| `fade-in` | 0.5s | ease-in-out |
| `slide-up` | 0.6s | ease-out |
| `slide-in-left` | 0.3s | ease-out |
| `carousel` | 20s | infinite |

### 7.2 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 7.3 Transition Defaults

All interactive elements: `transition-colors` or `transition-all duration-300`.

---

## 8. Background Treatment

### 8.1 Body

- Background: `#F5F5F7` (Cool White)
- Noise overlay: SVG fractal noise at `opacity: 0.02`, fixed position, `pointer-events: none`

### 8.2 Surface Hierarchy

| Surface | Background |
|---------|-----------|
| Body | `#F5F5F7` |
| Cards (elevated) | `white` or `glass-card` |
| Section overlays | Accent tint `::before` |
| Dark sections | `bg-gray-900` or `bg-onyx` |

---

## 9. Accessibility

| Constraint | Rule |
|-----------|------|
| Min tap target | 44px × 44px |
| Min font size | 11px (effective, accounting for letter-spacing) |
| Focus visible | Must have visible focus ring (pending P2 implementation) |
| Reduced motion | Respected via `prefers-reduced-motion` media query |
| Colour contrast | Onyx on Cool White ≈ 19:1 (exceeds AAA) |

---

## 10. Visual Hierarchy Enforcement

Rendering priority order on every surface. No element may visually compete with a higher-priority element.

| Priority | Element | Treatment |
|----------|---------|-----------|
| 1 (highest) | Image | Largest visual area, above fold |
| 2 | Title / Name | Bold, high-contrast, immediately below image |
| 3 | Metadata | Smaller, muted (`gray-500`/`gray-600`), secondary position |
| 4 (lowest) | Actions | Minimal footprint, bottom of card, or implicit (tap = action) |

> [!CAUTION]
> If an action button visually competes with the title, or metadata draws equal attention to the image, the hierarchy is broken. Fix it.
