## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-23 - Built-in Loading States
**Learning:** Developers often manually implement loading states (disabling button + adding spinner) which leads to inconsistent UI and forgotten accessibility attributes like `aria-busy`.
**Action:** Bake `isLoading` logic directly into the base Button component to enforce consistent behavior (spinner injection, disabled state, aria-busy) and reduce boilerplate.
