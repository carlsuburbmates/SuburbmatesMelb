## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).
## 2024-05-24 - Accessibility in Search Forms
**Learning:** Icon-only submit buttons and search inputs within forms often miss `aria-label`s, negatively impacting screen reader users.
**Action:** Always ensure search inputs and icon-only submit buttons have descriptive `aria-label` attributes to improve accessibility.
