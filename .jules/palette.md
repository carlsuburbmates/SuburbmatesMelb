## 2025-04-02 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons used for input manipulation (like the clear search 'X' button in `DirectorySearch.tsx`) need an explicit `aria-label` to communicate their function to screen readers, and the decorative SVG icons within should be hidden with `aria-hidden="true"` to prevent redundant announcements.
**Action:** Always ensure that any button without visible text content has a descriptive `aria-label` and that its internal icon is marked with `aria-hidden="true"`.
