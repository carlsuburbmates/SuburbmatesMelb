## 2024-04-10 - Add aria-labels to Icon-Only Buttons
**Learning:** Found that custom search inputs and bottom sheets in `src/components/regions/` heavily utilized icon-only `<button>`s (like the `X` clear/dismiss icons) without `aria-label`s, which causes screen readers to either read out raw text/components or skip them.
**Action:** Always ensure any `<button>` element that only contains an icon (like Lucide's `<X>`) has a descriptive `aria-label` (e.g., `aria-label="Clear search"`).
