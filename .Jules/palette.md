## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2025-02-02 - Search Input Accessibility
**Learning:** Search components in this app consistently lack visible `<label>` elements, relying solely on placeholders. This fails accessibility standards for screen readers.
**Action:** When working on search interfaces, always add `aria-label` to the input fields if a visible label is not design-compliant.
