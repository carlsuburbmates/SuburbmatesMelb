## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-11-20 - Newsletter Signup Forms Accessibility
**Learning:** Newsletter signup forms embedded in layout components (like footers) frequently lack explicit `<form>` wrapping and visually hidden `<label>`s (like `sr-only`). This causes screen readers to announce an unlabeled text field.
**Action:** When implementing inline form inputs without visual labels, always wrap them in a semantically correct `<form>`, include a `sr-only` class `<label>` associated via `id` and `htmlFor`, and ensure the submit button has clear visible focus styles.
