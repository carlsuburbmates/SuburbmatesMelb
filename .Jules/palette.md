## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).
## 2024-05-24 - Accessible Sticky Actions
**Learning:** Fixed positioning on mobile creates high-value interaction zones that need rigorous accessibility testing. Small touch targets with icons often miss `aria-pressed` states for toggles like 'Save'.
**Action:** Always add `aria-pressed` to toggle buttons and ensure touch targets are sufficient (min 44px) even if visual design is smaller.
