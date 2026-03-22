---
name: gap-verification
description: Structural and logical validation skill to discover validation paths and self-review code before runtime testing.
---

# Gap Verification Skill

**Purpose:** To mechanically verify that code changes are logically sound and properly tested before attempting functional or UI verification.

## Verification Steps
1. **Discover Validation Paths**: Inspect the repository to discover how the project is actually structured and what real validation paths (linters, static checkers, unit tests) exist.
2. **Execute Existing Checks**: Run the relevant checks that actually exist for the modified code.
3. **Self-Review**: Review your own changes for:
   - Incomplete logic or missing implementations
   - Unhandled edge cases
   - Missing error handling
   - Potential regressions
4. **Thoughtful Retry**: If a check fails, analyze the error output carefully. Do not blindly retry the same command or slightly tweak the code without understanding the root cause.
5. **Completion Rules**: Do not mark your task as complete unless validation succeeds or there is a clearly documented blocker escalated to the user.
