## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-02-28 - Multiple Form Inputs with Same `id`
**Learning:** Using static strings like `"category"` and `"suburb"` for `id`s in reusable form components (like `FilterInputs.tsx`) can lead to duplicate IDs in the DOM if the component is rendered multiple times (e.g., once for desktop, once for mobile drawer). This degrades accessibility as `htmlFor` on a `<label>` will only ever focus the first matching `<input>`/`<select>`.
**Action:** When creating reusable form components, use `React.useId()` to generate unique `id`s for inputs and link them to their corresponding `<label>` elements via `htmlFor`.
