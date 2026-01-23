## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-01-23 - Focus Trap in Custom Modals
**Learning:** Custom modals (like ImageGallery) require manual focus management (trap & restore) to be accessible. Simply handling Escape/Arrows is insufficient for keyboard users who might Tab out of the modal.
**Action:** When building custom modals, always implement a `useEffect` that:
1. Stores `document.activeElement` on open.
2. Focuses the first interactive element inside the modal.
3. Listens for `Tab` (and `Shift+Tab`) to cycle focus within the modal.
4. Restores focus to the stored element on close.
