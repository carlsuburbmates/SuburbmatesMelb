## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-23 - Focus Management in Custom Modals
**Learning:** Custom modal implementations often lack "focus trapping," allowing keyboard users to tab outside the modal into the background content. This breaks the expected interaction model.
**Action:** Implement manual focus management: 1) Save `activeElement` on open. 2) Move focus to first interactive element in modal. 3) Trap `Tab` cycle within modal. 4) Restore focus to saved element on close.
