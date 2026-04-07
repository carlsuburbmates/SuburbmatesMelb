## 2025-04-07 - Interactive Toggle Button Accessibility
**Learning:** Interactive toggle buttons (like mobile hamburger menus) must include dynamic `aria-expanded` and `aria-controls` attributes, and dynamic `aria-label`s reflecting the current state (e.g., 'Open menu' / 'Close menu') rather than a single static label, and their decorative icons should have `aria-hidden="true"`.
**Action:** Always apply `aria-expanded`, `aria-controls` referencing the target ID, state-dependent `aria-label`s, and `aria-hidden="true"` on icons for custom UI toggles going forward.
