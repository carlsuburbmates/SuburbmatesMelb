## 2024-05-23 - Accessibility in Image Galleries
**Learning:** Image galleries often rely heavily on visual cues (icons, layout) and neglect screen reader users and keyboard navigation. Common misses are `aria-label` on icon-only buttons and keyboard support for modal navigation.
**Action:** Always verify that interactive elements like "Next/Previous" arrows have descriptive text labels for screen readers and that modals can be closed/navigated via keyboard (Escape, Arrows).

## 2024-05-24 - Custom Modal Scroll Locking
**Learning:** Custom modal implementations (like `ImageGallery`) often miss scroll locking, allowing the background page to scroll while the modal is open, which disorients users.
**Action:** Verify that any custom modal component implements `document.body.style.overflow = 'hidden'` on mount and cleans it up on unmount.
