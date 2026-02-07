## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2025-02-07 - Button Loading State & Icon Sizing
**Learning:** When adding a `Loader2` spinner to a `Button` component, the spinner must have explicit sizing (e.g., `h-4 w-4`). Inherited styles from `buttonVariants` (like `[&_svg]`) may not reliably apply to dynamic icons. Also, using `asChild` on a `Button` (e.g., with Radix Slot) prevents the spinner from being rendered automatically; the consumer must handle the loading state visualization in the child element.
**Action:** Always apply explicit height/width classes to the `Loader2` icon. Be cautious when adding loading states to Buttons that might be used as `asChild`.
