## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-03-05 - Accessibility for Custom Framer-Motion Modals
**Learning:** Custom animated modals and drawers built with libraries like framer-motion lack built-in accessibility semantics compared to native `<dialog>` elements.
**Action:** Always manually implement `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-hidden="true"` on background overlays, and Escape key close handlers for custom animated overlays.
