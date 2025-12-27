# Pre-Merge Checklist

Use this checklist before starting the branch merge process.

---

## Environment Setup

- [ ] **Local repository is clean**
  ```bash
  git status
  # Should show: working tree clean
  ```

- [ ] **On main branch and up to date**
  ```bash
  git checkout main
  git pull origin main
  ```

- [ ] **All dependencies installed**
  ```bash
  npm install
  ```

- [ ] **Current build passes**
  ```bash
  npm run build
  ```

- [ ] **Current tests pass**
  ```bash
  npm run test
  ```

- [ ] **Current lint passes**
  ```bash
  npm run lint
  ```

---

## Backup & Safety

- [ ] **Create backup tag**
  ```bash
  git tag pre-merge-backup-$(date +%Y%m%d)
  git push origin --tags
  ```

- [ ] **Create backup branch**
  ```bash
  git branch backup-main-$(date +%Y%m%d)
  git push origin backup-main-$(date +%Y%m%d)
  ```

- [ ] **Document starting SHA**
  ```bash
  git log -1 --format="%H" > merge-starting-sha.txt
  echo "Starting from: $(cat merge-starting-sha.txt)"
  ```

- [ ] **Verify backup exists**
  ```bash
  git tag | grep pre-merge-backup
  git branch -r | grep backup-main
  ```

---

## Documentation Review

- [ ] **Read BRANCH_MERGE_PLAN.md**
  - Understand the 7-phase strategy
  - Note special considerations for each phase
  - Review conflict resolution guidelines

- [ ] **Read MERGE_QUICK_START.md**
  - Bookmark for quick reference
  - Review commands for each phase

- [ ] **Read scripts/README.md**
  - Understand how to use automation scripts
  - Know when to use manual approach

- [ ] **Review MERGE_VISUAL_STRATEGY.md**
  - Understand dependencies between phases
  - Note risk levels for each phase

---

## Tools & Access

- [ ] **Git configured correctly**
  ```bash
  git config user.name
  git config user.email
  # Should show your correct name and email
  ```

- [ ] **GitHub access verified**
  ```bash
  git ls-remote origin
  # Should list branches without error
  ```

- [ ] **Scripts are executable**
  ```bash
  ls -l scripts/*.sh
  # Should show -rwxr-xr-x permissions
  ```

- [ ] **Stripe CLI installed** (for Phase 5)
  ```bash
  stripe --version
  # Should show version number
  ```

- [ ] **Stripe sandbox credentials available** (for Phase 5)
  - [ ] `STRIPE_SECRET_KEY` (test mode)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` (test mode)
  - [ ] Webhook secret for local testing

---

## Communication

- [ ] **Team notified about merge process**
  - Estimated timeline shared
  - Contact person identified
  - Escalation path defined

- [ ] **Merge schedule documented**
  - Start date/time
  - Expected completion
  - Daily check-in times

- [ ] **Stakeholders aware of potential issues**
  - Possible downtime windows
  - Rollback procedures
  - Support availability

---

## Knowledge Check

- [ ] **I understand the MoR (Merchant of Record) model**
  - Vendors handle refunds, not Suburbmates
  - Suburbmates deducts commission via `application_fee_amount`
  - Must not code platform-initiated refunds

- [ ] **I know how to resolve merge conflicts**
  - Edit files to remove conflict markers
  - Test the resolution
  - Use `git add` and `git commit`

- [ ] **I understand the duplicate contact form issue**
  - Three implementations exist
  - Must evaluate and select one
  - Close the other two with explanation

- [ ] **I know the Stripe testing requirements**
  - All testing in sandbox mode
  - Stripe CLI for webhook forwarding
  - Must verify MoR model preserved

---

## Final Checks

- [ ] **Time allocated for merge process**
  - Estimate: 5-8 days
  - Buffer added for unexpected issues
  - No hard deadlines during merge

- [ ] **Support resources available**
  - Access to documentation
  - Team members available for questions
  - Escalation path clear

- [ ] **Rollback plan understood**
  - Know how to revert commits
  - Know how to restore from backup
  - Know who to contact in emergency

---

## Ready to Start?

If all items above are checked:

✅ **You are ready to begin Phase 1!**

Start with:
```bash
./scripts/merge-branch.sh dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7
```

---

## During Merge Reminders

### After Each Successful Merge
- [ ] Update MERGE_PROGRESS.md
- [ ] Run full test suite
- [ ] Manual smoke test if needed
- [ ] Commit and push to main
- [ ] Delete remote branch
- [ ] Document any issues or decisions

### If Issues Occur
- [ ] Document the issue in MERGE_PROGRESS.md
- [ ] Don't rush - take time to understand
- [ ] Consult documentation
- [ ] Ask for help if needed
- [ ] Consider if rollback is necessary

### End of Day
- [ ] Update MERGE_PROGRESS.md with day's work
- [ ] Document any pending items
- [ ] Ensure main branch is stable
- [ ] Commit progress tracking updates

---

## Post-Merge Checklist

After all merges complete:

- [ ] All branches merged or closed
- [ ] MERGE_PROGRESS.md shows all complete
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Deploy to staging
- [ ] Full QA pass
- [ ] Production deployment
- [ ] Monitor Sentry for 24-48 hours
- [ ] Tag release version
- [ ] Announce completion to team
- [ ] Retrospective scheduled

---

**Date Started:** _______________  
**Started By:** _______________  
**Expected Completion:** _______________  

---

**Note:** Don't skip checklist items to save time. They're designed to prevent issues that would cost more time to fix later.
