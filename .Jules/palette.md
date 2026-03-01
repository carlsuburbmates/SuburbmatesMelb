## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-23 - Accessibility in Search and Filter Forms
**Learning:** Forms designed for visual layouts often omit visible labels (relying on placeholders) or fail to link custom dropdowns programmatically. Missing `aria-label`s on inputs and unlinked `<label>` tags significantly impair screen reader navigation.
**Action:** Always ensure that form inputs have a visible `<label>` bound via `htmlFor`/`id`, or an `aria-label` when the design omits a visible label. Hide decorative icons with `aria-hidden="true"` to prevent redundant screen reader announcements.
