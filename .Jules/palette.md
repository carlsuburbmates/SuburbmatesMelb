## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Accessibility in Custom Framer Motion Drawers
**Learning:** Custom animated components (like `framer-motion` modals or drawers) often lack built-in accessibility semantics. Screen readers need context to know a modal has opened and how to interact with it, while keyboard users need a way to easily dismiss it without mouse clicks.
**Action:** Always implement explicit `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-hidden="true"` (on backgrounds) for custom animated drawers/modals. Crucially, ensure keyboard accessibility by implementing an `Escape` key event listener to close the drawer, and add `aria-label` to icon-only close buttons.
