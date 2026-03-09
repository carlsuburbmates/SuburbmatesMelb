## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Accessibility in Accordion Components
**Learning:** Custom accordion components often lack proper state indication for screen reader users when toggling visibility. The visual cue of a chevron icon changing direction is insufficient.
**Action:** Always add `aria-expanded` to the toggle button reflecting the current open/closed state, and use `aria-controls` on the button pointing to the `id` of the content panel it controls, allowing screen readers to accurately convey the relationship and state of the interactive elements.