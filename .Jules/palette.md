## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-01-19 - Focus Management in Modals
**Learning:** Modals without focus trapping allow users to accidentally navigate to the background content via keyboard, causing confusion and accessibility failures.
**Action:** Always implement a focus trap that loops Tab navigation within the modal and restores focus to the trigger element upon closing.
