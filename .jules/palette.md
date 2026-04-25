## 2026-04-11 - Mobile Viewport in Playwright\n**Learning:** When using Playwright to visually verify mobile-specific UI elements (like responsive menus hidden on desktop via `md:hidden`), strictly setting the viewport to a mobile resolution is required before interacting with those elements.\n**Action:** Use `page.set_viewport_size({"width": 375, "height": 812})` in future Playwright verification scripts that target mobile layouts.

## 2024-04-25 - ARIA Labels on Icon-Only Buttons
**Learning:** Adding descriptive `aria-label` attributes to generic icon-only buttons (like X for close, chevrons for navigation, or magnifying glass for zoom) significantly improves screen reader accessibility without affecting the visual layout.
**Action:** Always verify that buttons containing only an SVG icon have an explicit `aria-label` providing context for their action.
