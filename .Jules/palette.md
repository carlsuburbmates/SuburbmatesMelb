## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Accessibility in Custom Drawers
**Learning:** Custom motion components (like `framer-motion` drawers) don't natively provide essential accessibility out-of-the-box. Screen readers may misinterpret overlays, and users might be trapped without standard Escape key support or focus rings.
**Action:** When creating or modifying custom modals/drawers, strictly enforce manual accessibility implementation: use `role="dialog"`, `aria-modal="true"`, `aria-hidden` on backdrops, descriptive `aria-labelledby`, add an `Escape` key close listener, and ensure proper `focus-visible` styling on interactive elements.
