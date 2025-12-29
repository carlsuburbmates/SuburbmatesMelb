# Branch Merge Quick Start Guide

**Purpose:** Fast reference for executing the branch merge plan  
**Full Details:** See [BRANCH_MERGE_PLAN.md](BRANCH_MERGE_PLAN.md)

---

## Prerequisites

```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Create backup
git tag pre-merge-backup-$(date +%Y%m%d)
git push origin --tags
git branch backup-main-$(date +%Y%m%d)

# 3. Document starting point
git log -1 --format="%H" > /tmp/merge-starting-sha.txt
echo "Starting from SHA: $(cat /tmp/merge-starting-sha.txt)"
```

---

## Phase 1: Infrastructure (Est. 2-3 hours)

### Branches to Merge
1. `dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7`
2. `chore/pagination-util-cleanup-11545527530274447792`
3. `copilot/set-up-copilot-instructions`

### Execution

```bash
# For each branch:
BRANCH="dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7"

git checkout main
git pull origin main
git checkout -b merge/$BRANCH
git merge origin/$BRANCH

# If conflicts, resolve and then:
git add .
git commit -m "Merge $BRANCH into main"

# Test
npm run build && npm run lint && npm run test

# If tests pass
git checkout main
git merge merge/$BRANCH
git push origin main

# Delete remote branch
git push origin --delete $BRANCH

# Repeat for next branch
```

### Success Criteria
- ✅ Build passes
- ✅ Lint passes
- ✅ Tests pass
- ✅ No console errors

---

## Phase 2: Database Schema (Est. 3-4 hours)

### Branches to Merge
1. `update-schema-include-website-12369568459490167957`
2. `add-business-images-to-api-946888828297667986` (check for conflicts first)

### Special Considerations
- Run migrations after merging
- Regenerate types: Check if needed
- Test API endpoints manually

### Execution

```bash
BRANCH="update-schema-include-website-12369568459490167957"

git checkout main
git pull origin main
git checkout -b merge/$BRANCH
git merge origin/$BRANCH

# Check for migration conflicts
ls supabase/migrations/

# Resolve conflicts if any
# Run tests
npm run build && npm run lint && npm run test

# Test migrations locally (if Supabase local dev available)
# supabase db reset

# Merge to main
git checkout main
git merge merge/$BRANCH
git push origin main
git push origin --delete $BRANCH
```

### Success Criteria
- ✅ Migrations in correct order
- ✅ Types updated
- ✅ API tests pass
- ✅ Manual API testing successful

---

## Phase 3: Core Features (Est. 1-2 days)

### Branches to Merge (in order)
1. `feat-business-profile-creation-10647071320409416453`
2. `feature/products-api-3808554909437837721`
3. `feature/api-reviews-15590871104578818330`
4. `jules/count-business-reviews-12908797371811244599`

### Testing Requirements
- Test each API endpoint after merge
- Verify data flows correctly
- Check frontend integration

---

## Phase 4: Contact Forms (Est. 4-6 hours)

### Special Process: Evaluation Required

```bash
# 1. Checkout and test each implementation
for BRANCH in \
  "feature/business-contact-form-10637158813823643494" \
  "feature/implement-contact-form-10286381009409655031" \
  "jules-contact-form-implementation-3878926283966977189"
do
  echo "Testing $BRANCH"
  git checkout $BRANCH
  npm run dev
  # Manually test the contact form
  # Document findings
done

# 2. Select best implementation (document decision)

# 3. Merge selected branch (e.g., jules-contact-form-implementation-3878926283966977189)
SELECTED_BRANCH="jules-contact-form-implementation-3878926283966977189"
git checkout main
git merge origin/$SELECTED_BRANCH
git push origin main

# 4. Close other branches without merging
git push origin --delete "feature/business-contact-form-10637158813823643494"
git push origin --delete "feature/implement-contact-form-10286381009409655031"
```

### Evaluation Criteria
- Code quality and maintainability
- Test coverage
- Email integration (Resend)
- Mobile responsiveness
- Form validation

---

## Phase 5: Stripe Integration (Est. 2-3 days)

### Branches to Merge (in order)
1. `jules-stripe-account-query-954478057820138488`
2. `jules-stripe-webhook-implementation-4671317611597569415`
3. `jules-webhook-refund-18424877112051176606`
4. `jules-dispute-handler-1-5842272508693809648`

### Critical Requirements
- ⚠️ **Test in sandbox mode only**
- ⚠️ **Use Stripe CLI for webhook testing**
- ⚠️ **Verify MoR model maintained**

### Testing Commands

```bash
# 1. Set up Stripe CLI
stripe login

# 2. Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhook/stripe

# 3. Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded

# 4. Verify handlers work correctly
# Check logs and database
```

### Success Criteria
- ✅ Webhook signature validation works
- ✅ Test events processed correctly
- ✅ Vendor payouts calculated correctly
- ✅ MoR model preserved (vendors handle refunds)

---

## Phase 6: Security & Logging (Est. 4-6 hours)

### Branches to Merge
1. `sentinel-logging-security-14848806251031819962`
2. `sentinel-webhook-refactor-10747781692254562034`

### Validation
- Check no PII in logs
- Sentry integration working
- Error contexts useful

---

## Phase 7: UI/UX (Est. 2-3 hours)

### Branches to Merge
1. `palette-image-gallery-a11y-227846487572166473`

### Testing
- Keyboard navigation
- Screen reader compatibility
- Lighthouse accessibility score > 90

---

## Emergency Rollback

If critical issues occur:

```bash
# Option 1: Revert last merge
git revert HEAD
git push origin main

# Option 2: Reset to backup tag
git checkout main
git reset --hard pre-merge-backup-YYYYMMDD
# Note: Force push may be restricted

# Option 3: Create hotfix from backup
git checkout -b hotfix-rollback backup-main-YYYYMMDD
# Cherry-pick critical fixes
# Create PR to restore main
```

---

## Progress Tracking

### Create tracking file

```bash
cat > MERGE_PROGRESS.md << 'EOF'
# Merge Progress Log

## Phase 1: Infrastructure
- [ ] dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7
- [ ] chore/pagination-util-cleanup-11545527530274447792
- [ ] copilot/set-up-copilot-instructions

## Phase 2: Database Schema
- [ ] update-schema-include-website-12369568459490167957
- [ ] add-business-images-to-api-946888828297667986

## Phase 3: Core Features
- [ ] feat-business-profile-creation-10647071320409416453
- [ ] feature/products-api-3808554909437837721
- [ ] feature/api-reviews-15590871104578818330
- [ ] jules/count-business-reviews-12908797371811244599

## Phase 4: Contact Forms
- [ ] Evaluate all 3 implementations
- [ ] Select best implementation
- [ ] Merge selected branch
- [ ] Close other branches

## Phase 5: Stripe Integration
- [ ] jules-stripe-account-query-954478057820138488
- [ ] jules-stripe-webhook-implementation-4671317611597569415
- [ ] jules-webhook-refund-18424877112051176606
- [ ] jules-dispute-handler-1-5842272508693809648

## Phase 6: Security & Logging
- [ ] sentinel-logging-security-14848806251031819962
- [ ] sentinel-webhook-refactor-10747781692254562034

## Phase 7: UI/UX
- [ ] palette-image-gallery-a11y-227846487572166473

## Notes
- Started: [DATE]
- Completed: [DATE]
- Issues encountered: [NOTES]
EOF
```

---

## Common Issues & Solutions

### Issue: Merge Conflicts

```bash
# View conflicting files
git status

# For each conflict:
# 1. Open file in editor
# 2. Resolve conflict markers (<<<<, ====, >>>>)
# 3. Choose correct version
# 4. Test the resolution

git add <resolved-file>
git commit -m "Resolve merge conflicts in <files>"
```

### Issue: Test Failures After Merge

```bash
# 1. Check what failed
npm run test -- --verbose

# 2. Fix the test or code
# 3. Re-run tests
npm run test

# 4. If unfixable, consider:
# - Reverting the merge
# - Creating a fix commit
# - Asking for help
```

### Issue: TypeScript Errors

```bash
# Check errors
npx tsc --noEmit

# Common fixes:
# - Update type definitions
# - Fix import paths
# - Regenerate database types
```

---

## Final Checklist

After all phases complete:

- [ ] All branches merged or closed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Deployed to staging
- [ ] QA pass completed
- [ ] Production deployment
- [ ] Monitor Sentry for errors
- [ ] Tag release version
- [ ] Announce to team

---

## Time Estimate

| Phase | Est. Time |
|-------|-----------|
| Phase 1 | 2-3 hours |
| Phase 2 | 3-4 hours |
| Phase 3 | 1-2 days |
| Phase 4 | 4-6 hours |
| Phase 5 | 2-3 days |
| Phase 6 | 4-6 hours |
| Phase 7 | 2-3 hours |
| **Total** | **5-8 days** |

---

**Note:** This is an aggressive timeline. Add buffer for unexpected conflicts and testing.
