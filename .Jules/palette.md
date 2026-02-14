## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-02-14 - Button Component State Management
**Learning:** The Button component lacked loading state and used invalid Tailwind colors (bg-primary), leading to invisible and non-interactive states in production. This pattern likely occurred from copying component libraries without matching config.
**Action:** Always verify custom color tokens exist in tailwind.config.js before using them, and ensure interactive components handle loading/disabled states internally.
