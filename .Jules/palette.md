## 2025-05-23 - Modal Accessibility Patterns
**Learning:** React modals need explicit focus management. Simply unmounting/mounting content isn't enough; focus often gets lost or reset to `body`.
**Action:** Use a `useEffect` with a `ref` to programmatically move focus to the modal's close button or primary action upon opening. Also implement a basic focus trap or `onClick` on backdrop for easy dismissal.
## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).
