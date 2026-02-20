## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-02-20 - Button Loading States with Radix Slot
**Learning:** When using Radix UI's `Slot` component (via `asChild` prop), you cannot easily inject sibling elements like loading spinners because `Slot` expects a single child. Additionally, for icon-only buttons, replacing the icon with a spinner is often cleaner than prepending/appending, to avoid layout shifts.
**Action:** Implement `isLoading` logic to conditionally replace children for icon buttons, and avoid modifying children structure when `asChild` is true (or handle it very carefully). Always explicitly size spinners (e.g., `h-4 w-4`) to match icon sizes.
