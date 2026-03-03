## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2025-03-03 - Custom Animated Modals Lack A11y Roles
**Learning:** Custom one-off animated UI elements (like mobile drawers built with framer-motion) frequently lack the `role="dialog"`, focus trapping, escape handling, and ARIA labels that are typically baked into standard `Modal` components.
**Action:** Always verify that custom pop-ups and mobile drawers have `aria-modal="true"`, `role="dialog"`, `aria-labelledby`, an `Escape` key close handler, and `aria-hidden="true"` on their backdrops.
