## 2026-04-11 - Mobile Viewport in Playwright\n**Learning:** When using Playwright to visually verify mobile-specific UI elements (like responsive menus hidden on desktop via `md:hidden`), strictly setting the viewport to a mobile resolution is required before interacting with those elements.\n**Action:** Use `page.set_viewport_size({"width": 375, "height": 812})` in future Playwright verification scripts that target mobile layouts.

## 2026-04-18 - ARIA Labels in Image Gallery
**Learning:** Icon-only buttons (like those used for image galleries and modals) often lack accessible names by default, making them completely opaque to screen reader users.
**Action:** Always ensure that icon-only `<button>` or `<a>` elements have descriptive `aria-label` attributes to communicate their function (e.g., "Zoom in", "Next image", "Close modal").
