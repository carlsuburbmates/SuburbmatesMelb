## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-02-05 - Modal Focus & Scroll Management
**Learning:** Even with keyboard navigation (arrows/escape), custom modals often miss critical "invisible" accessibility features: preventing background scrolling (scroll lock) and managing focus (restoration to trigger, trapping within modal).
**Action:** When building custom modals, always use a `useEffect` to set `document.body.style.overflow = 'hidden'` on mount and restore focus to the triggering element (`document.activeElement`) on unmount.
