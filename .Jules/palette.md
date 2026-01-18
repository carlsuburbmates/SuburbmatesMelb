## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Focus Trapping in Reusable Modals
**Learning:** Reusable modal components must strictly manage focus to prevent keyboard users from tabbing into the background content, which destroys context and usability.
**Action:** Implement focus trapping (Tab cycle) and focus restoration (on close) in the core `Modal` component so all usages inherit accessible behavior by default.
