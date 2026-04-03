## 2024-04-03 - Avoid Overriding Descriptive Inner Text with ARIA Labels
**Learning:** Adding `aria-label` to elements that already contain visible, descriptive text (like listing counts or roles) overrides the inner text for screen readers, hiding important information and violating WCAG 2.5.3 (Label in Name).
**Action:** When improving accessibility, only add `aria-label` to elements without visible text (like icon-only buttons). For elements with visible text alongside decorative icons, leave the element alone and only add `aria-hidden="true"` to the decorative icon component itself.
