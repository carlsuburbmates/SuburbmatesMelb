## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-23 - Button Loading States
**Learning:** Standardizing loading states in the Button component drastically improves UX consistency. It prevents double-submission and provides immediate feedback.
**Action:** Implemented `isLoading` prop in standard Button component to automatically handle disabled state, aria-busy, and spinner rendering.
