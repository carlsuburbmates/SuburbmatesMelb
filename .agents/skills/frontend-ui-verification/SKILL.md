---
name: frontend-ui-verification
description: Safe validation of frontend components and user flows, prioritizing mobile density constraints and outbound redirects.
---

# Frontend UI Verification Skill

**Purpose:** To visually and functionally verify UI correctness in a safe manner, dynamically adapted to the Suburbmates mobile-first directory.

## Browser Isolation
- The browser may run in a separate profile without access to the user's usual cookies, sessions, or logins.
- Do not assume an authenticated state exists.

## Verification Sequence
1. **Discovery & Startup**: Discover how the project runs locally. Ensure the application server is genuinely running before attempting any browser verification.
2. **Baseline Render**: Verify the page loads successfully and the newly intended UI appears without crashing.
3. **Responsive Evidence**: Capture visual evidence for desktop layouts, but explicitly run **mobile viewport checks** to ensure vertical space protection, horizontal scroll for chips, and multi-line clamping remain intact.
4. **Diagnostic Checks**: Check browser console messages, relevant network failures, and visible runtime issues. Ensure no new silent errors or looping redirects were introduced.
5. **Interactive Testing**: Test key user interactions. Explicitly verify that "external" links or purchase buttons properly track via network events (e.g. hitting `/api/redirect`) before continuing to the real URL.
6. **Legacy Artifact Detection**: Capture visual evidence and flag if any operational remnants of legacy UI surfaces (e.g., an active "Add to Cart" checkout state) are spotted that contradict SSOT v2.0.
7. **Iterative Fixing**: If visual or interactive bugs are found, implement targeted fixes and rerun this sequence.
