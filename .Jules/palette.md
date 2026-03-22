## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2026-03-22 - Accessibility in Server Component Layouts
**Learning:** When adding semantic `<form>` wrappers with `onSubmit` handlers to purely client-side UI elements (e.g., newsletter signups) within Server Component layouts (like Footers), the interactive form must be isolated into a dedicated Client Component. Additionally, inline form inputs must have a visually hidden `<label>` (`sr-only`) associated via `id` and `htmlFor` to ensure proper screen-reader accessibility.
**Action:** Extract interactive form elements (inputs and buttons) into their own Client Component files rather than converting the entire layout to a Client Component. Ensure all inputs are correctly labeled.
