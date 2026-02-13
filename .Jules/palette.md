## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-02-13 - Standardized Button Loading State
**Learning:** Reusable UI components like `Button` often lack built-in loading states, leading to inconsistent and ad-hoc implementations (e.g., custom spinners, missing accessibility attributes) across the application.
**Action:** Always implement a standardized `isLoading` prop in the core `Button` component that handles the disabled state, `aria-busy` attribute, and spinner rendering to ensure consistency and accessibility.
