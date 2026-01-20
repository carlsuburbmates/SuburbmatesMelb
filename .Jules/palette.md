## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Standardizing Loading States
**Learning:** Found manual implementation of loading states (text change) in forms. Standardizing `isLoading` prop on the base `Button` component ensures consistency (spinner + visual disable) and reduces boilerplate code in feature pages.
**Action:** When adding async actions, always check if the base component supports a native loading state before implementing custom logic.
