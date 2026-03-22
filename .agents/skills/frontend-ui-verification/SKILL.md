---
name: frontend-ui-verification
description: Safe validation of frontend components and user flows.
---

# Frontend UI Verification Skill

**Purpose:** To visually and functionally verify UI correctness in a safe manner dynamically adapted to the project.

## Browser Isolation
- The browser may run in a separate profile without access to the user's usual cookies, sessions, or logins.
- Do not assume an authenticated state exists. Authenticated flows require explicit handling.

## Verification Sequence
1. **Discovery & Startup**: Discover how the project actually runs locally. Ensure the application server is genuinely running before attempting any browser verification.
2. **Baseline Render**: Verify the page loads successfully and the newly intended UI appears without crashing.
3. **Responsive Evidence**: Capture visual evidence for desktop layouts, and also for narrow/mobile views when supported by the project.
4. **Diagnostic Checks**: Check the browser console, network tab, and runtime logs for issues relevant to the recent change. Ensure no new silent errors were introduced.
5. **Interactive Testing**: Test key user interactions (clicks, form submissions) introduced or affected by the change.
6. **Iterative Fixing**: If visual or interactive bugs are found, implement targeted fixes and rerun this specific verification sequence until success.
