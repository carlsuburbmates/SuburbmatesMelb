## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).
## 2024-03-11 - Semantic Forms for Inline Inputs
**Learning:** Found an inline newsletter signup input in `Footer.tsx` that lacks a semantic `<form>` wrapper, `<label>` (using `sr-only` for visual hiding), and `id`/`htmlFor` bindings. According to the system instructions, these elements must be wrapped in a `<form>` and include a visually hidden label for proper screen-reader accessibility.
**Action:** Always wrap inline inputs (like newsletter signups) in a `<form>` element and provide a linked `<label className="sr-only">` to ensure WCAG compliance without affecting visual design.
