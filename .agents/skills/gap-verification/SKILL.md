---
name: gap-verification
description: Structural and logical validation skill to discover validation paths and self-review code before runtime testing.
---

# Gap Verification Skill

**Purpose:** To mechanically verify that code changes are logically sound, properly tested, and free from scope creep before attempting functional verification.

## Verification Steps
1. **Discover Validation Paths**: Inspect the repository to discover actual validation paths (linters, static checkers, unit tests).
2. **Execute Existing Checks**: Run the relevant checks that actually exist for the modified code.
3. **Self-Review**: Review your own changes for:
   - Incomplete logic or missing implementations
   - Unhandled edge cases
   - Missing error handling
   - Potential regressions
   - **Scope Creep Constraint**: Ensure new logic does not inadvertently reconnect to or depend upon `to-be-removed` legacy marketplace commerce systems. Confirm no unapproved database structures or payment-driven features were introduced under the guise of "missing logic".
4. **Thoughtful Retry**: If a check fails, analyze the error output carefully. Do not blindly retry the same command or slightly tweak the code without understanding the root cause.
5. **Completion Rules**: Do not mark your task as complete unless validation succeeds or there is a clearly documented blocker escalated to the user.
