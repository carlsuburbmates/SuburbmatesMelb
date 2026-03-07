## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Accessibility in Custom Modals and Drawers
**Learning:** Custom animated modals or drawers (e.g. built with framer-motion) often omit native dialog roles and key interactions. A visually appearing drawer still requires dialog semantics for screen readers and must allow keyboard users to dismiss it without requiring tab navigation back to the close button.
**Action:** Always ensure custom overlays manually implement `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-hidden="true"` on backdrops, and an `Escape` key close handler.
