## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2025-03-19 - Semantic Forms in Server Layouts
**Learning:** Client-side interactions like newsletter signups require `<form>` tags with an `onSubmit={(e) => e.preventDefault()}` handler to properly prevent accidental page reloads and improve keyboard accessibility. However, inserting this handler directly into global layout server components forces the entire layout into a Client Component.
**Action:** Isolate these purely client-side accessible form elements into their own dedicated Client Components (e.g., `<NewsletterForm />`) and import them into the Server layout to maintain Next.js server component benefits while guaranteeing proper semantic `<form>` interaction.
