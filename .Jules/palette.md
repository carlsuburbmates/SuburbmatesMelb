# Palette's Journal 🎨

## 2025-02-23 - Interactive Scroll Indicators
**Learning:** Users instinctively try to interact with "scroll" indicators (like arrows) in full-screen hero sections. Static indicators provide affordance without function, leading to frustration.
**Action:** Always wrap scroll indicators in a `<button>` with an `onClick` handler (e.g., `window.scrollBy`) and proper `aria-label`. This turns a passive cue into a helpful navigation tool.
