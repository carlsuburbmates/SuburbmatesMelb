# Merge Scripts

This directory contains helper scripts to automate and streamline the branch merge process.

## Available Scripts

### 1. merge-branch.sh
**Purpose:** Automate the initial merge and testing of a feature branch.

**Usage:**
```bash
./scripts/merge-branch.sh <branch-name>
```

**What it does:**
1. Updates main branch
2. Creates a merge branch (`merge/<branch-name>`)
3. Merges the feature branch
4. Runs build, lint, and tests
5. Reports success or failure

**Example:**
```bash
./scripts/merge-branch.sh dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7
```

**Output:**
- Creates a log file in `/tmp/merge-log-TIMESTAMP.txt`
- Shows progress in terminal with color coding
- Stops on first error for review

---

### 2. test-merge.sh
**Purpose:** Run all tests after manually resolving merge conflicts.

**Usage:**
```bash
./scripts/test-merge.sh
```

**What it does:**
1. Runs `npm run build`
2. Runs `npm run lint`
3. Runs `npm run test`
4. Reports pass/fail status

**When to use:**
- After resolving merge conflicts manually
- After making fixes based on test failures
- To verify changes before finalizing

---

### 3. finalize-merge.sh
**Purpose:** Complete the merge by pushing to main and cleaning up.

**Usage:**
```bash
./scripts/finalize-merge.sh <branch-name>
```

**What it does:**
1. Asks for confirmation
2. Merges the merge branch into main
3. Pushes main to remote
4. Deletes the remote feature branch
5. Deletes the local merge branch

**Example:**
```bash
./scripts/finalize-merge.sh dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7
```

**⚠️ Warning:** This pushes to main and deletes branches. Make sure tests pass first!

---

## Typical Workflow

### Simple merge (no conflicts)

```bash
# 1. Start the merge
./scripts/merge-branch.sh feature/my-feature

# 2. If tests pass, review the changes
git log main..merge/feature/my-feature

# 3. Test manually if needed
npm run dev

# 4. Finalize the merge
./scripts/finalize-merge.sh feature/my-feature

# 5. Update progress
# Edit MERGE_PROGRESS.md to mark branch as complete
```

### Merge with conflicts

```bash
# 1. Start the merge
./scripts/merge-branch.sh feature/my-feature

# 2. Script will stop and show conflicts
# Resolve conflicts in your editor

# 3. After resolving conflicts:
git add <resolved-files>
git commit -m "Resolve merge conflicts"

# 4. Run tests
./scripts/test-merge.sh

# 5. If tests pass, finalize
./scripts/finalize-merge.sh feature/my-feature
```

### Merge with test failures

```bash
# 1. Start the merge
./scripts/merge-branch.sh feature/my-feature

# 2. Tests fail - fix the issues
# Edit code to fix test failures

# 3. Re-run tests
./scripts/test-merge.sh

# 4. When tests pass, finalize
./scripts/finalize-merge.sh feature/my-feature
```

---

## Script Features

### Color-coded output
- 🟢 **Green:** Success messages and logs
- 🔴 **Red:** Errors
- 🟡 **Yellow:** Warnings

### Logging
- All merge attempts are logged to `/tmp/merge-log-TIMESTAMP.txt`
- Includes timestamps and full output
- Useful for debugging issues

### Safety checks
- Verifies branch exists before merging
- Stops on test failures
- Asks for confirmation before finalizing
- Handles errors gracefully

---

## Manual Alternative

If you prefer manual control, here's the equivalent commands:

```bash
# Start merge
git checkout main
git pull origin main
git checkout -b merge/feature/my-feature
git merge origin/feature/my-feature

# Resolve conflicts if any
# <edit files>
git add <files>
git commit -m "Resolve conflicts"

# Test
npm run build && npm run lint && npm run test

# Finalize
git checkout main
git merge merge/feature/my-feature
git push origin main
git push origin --delete feature/my-feature
git branch -d merge/feature/my-feature
```

---

## Troubleshooting

### Script fails with "Permission denied"
```bash
chmod +x scripts/*.sh
```

### Script can't find npm commands
Make sure you're in the repository root directory.

### Merge conflicts are too complex
1. Abort the merge: `git merge --abort`
2. Review both branches carefully
3. Consider manual merge or seek help

### Tests fail after merge
1. Check the error messages
2. Review what changed in the branch
3. Fix the code or tests
4. Re-run tests with `./scripts/test-merge.sh`

### Accidental push to main
1. If immediate, revert: `git revert HEAD`
2. If delayed, create hotfix branch
3. Restore from backup if critical

---

## Best Practices

1. **Always start from updated main:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Test each merge individually:**
   - Don't merge multiple branches without testing between

3. **Keep merge branches:**
   - Don't delete until confirmed working in production

4. **Document issues:**
   - Update MERGE_PROGRESS.md after each merge
   - Note any problems or decisions

5. **Backup before risky merges:**
   ```bash
   git tag backup-before-stripe-$(date +%Y%m%d)
   ```

---

## Phase-Specific Notes

### Phase 4: Contact Forms
For evaluating multiple implementations:
```bash
# Test each one
for branch in feature/business-contact-form-10637158813823643494 \
              feature/implement-contact-form-10286381009409655031 \
              jules-contact-form-implementation-3878926283966977189
do
  echo "Testing $branch"
  git checkout origin/$branch
  npm run dev
  # Manually test and document findings
done
```

### Phase 5: Stripe
Before merging Stripe branches:
```bash
# Set up Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhook/stripe

# In another terminal
npm run dev

# Test webhooks
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
```

---

## Support

For questions or issues:
1. Check [BRANCH_MERGE_PLAN.md](../BRANCH_MERGE_PLAN.md) for detailed strategy
2. Check [MERGE_QUICK_START.md](../MERGE_QUICK_START.md) for phase guides
3. Review [MERGE_PROGRESS.md](../MERGE_PROGRESS.md) for status
4. Ask for help if stuck

---

**Remember:** These scripts are helpers, not requirements. Use what makes sense for your workflow!
