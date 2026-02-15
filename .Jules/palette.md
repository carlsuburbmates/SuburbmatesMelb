## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-02-15 - Standardizing Button Loading States
**Learning:** Adding a standardized `isLoading` prop to the base `Button` component simplifies the codebase and ensures consistent accessibility (`aria-busy`, `disabled`) across the application, reducing the risk of custom, inaccessible implementations.
**Action:** When working with Shadcn/Radix components, consider extending base components with common UX patterns (like loading states) instead of repeating them in feature components.
