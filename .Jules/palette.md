## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Broken Shadcn UI Button Styles
**Learning:** The project seems to have incomplete Tailwind configuration for Shadcn UI components. Specifically, `bg-primary`, `bg-destructive`, and `text-primary-foreground` are not defined in `tailwind.config.js` or `globals.css`, causing standard variants of the `Button` component to render with missing styles (invisible text/backgrounds).
**Action:** Be cautious when using Shadcn UI components directly; verify they are visible. Developers seem to use custom classes like `.btn-primary` on native `<button>` elements instead. When improving `Button`, focus on functional props (`isLoading`) rather than relying on broken style variants.
