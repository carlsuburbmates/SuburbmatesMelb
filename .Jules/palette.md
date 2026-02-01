## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-02-01 - Standardizing Async Button States
**Learning:** Replacing ad-hoc loading spinners (divs) with a standardized `isLoading` prop on the `Button` component not only reduces code duplication but ensures consistent accessibility attributes (`aria-busy`, `disabled`) and visual feedback across the application.
**Action:** When implementing async actions, always check if the `Button` component supports `isLoading` before creating manual spinners. If not, enhance the core component first.
