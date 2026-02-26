## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-02-26 - Verifying Component States
**Learning:** When adding visual states (like loading spinners) to components without a component library playground (e.g., Storybook), creating a temporary Next.js page is an effective way to visually verify all variants and states using Playwright.
**Action:** Use a temporary route (e.g., `src/app/temp-test/page.tsx`) to render component permutations, verify with a screenshot, and then clean up before submission.
