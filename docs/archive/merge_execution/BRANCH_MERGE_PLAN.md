# Branch Merge Plan - SuburbmatesMelb Repository

**Created:** December 27, 2025  
**Status:** Planning Phase  
**Target:** Consolidate all 18 feature branches into main branch

---

## Executive Summary

This document outlines a comprehensive strategy to merge all existing feature branches into the main branch of the SuburbmatesMelb repository. The plan identifies 18 branches requiring evaluation and provides a phased approach to safely consolidate all work.

## Current Repository State

### Main Branch
- **Latest Commit:** `64700f0` - "feat: add profile_image_url to business profiles (#10)"
- **Date:** December 25, 2025
- **Status:** Stable production baseline

### Branch Inventory

Total: 20 branches
- 1 main branch
- 1 current working branch (copilot/merge-all-branches-into-main)
- 18 feature/fix branches requiring merge evaluation

---

## Branch Analysis by Category

### 1. Infrastructure & Dependencies
**Priority:** HIGH (merge first, low risk)

| Branch | Description | Risk Level |
|--------|-------------|------------|
| `dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7` | Automated dependency updates | Low |
| `chore/pagination-util-cleanup-11545527530274447792` | Pagination utility cleanup + tests | Low |
| `copilot/set-up-copilot-instructions` | Initial Copilot configuration | Low |

**Rationale:** These changes affect tooling and utilities with minimal impact on core features.

### 2. Database Schema & Migrations
**Priority:** HIGH (foundational changes)

| Branch | Description | Risk Level |
|--------|-------------|------------|
| `update-schema-include-website-12369568459490167957` | Add website field to business_profiles | Medium |
| `add-business-images-to-api-946888828297667986` | Add images JSONB column to business_profiles | Medium |

**Rationale:** Schema changes must be merged before features that depend on new columns.

**Note:** Check if `add-business-images-to-api-946888828297667986` conflicts with the already-merged profile_image_url feature.

### 3. Core Business Features
**Priority:** HIGH (essential functionality)

| Branch | Description | Risk Level |
|--------|-------------|------------|
| `feat-business-profile-creation-10647071320409416453` | Business profile creation workflow | Medium |
| `feature/products-api-3808554909437837721` | Products API endpoints | Medium |
| `feature/api-reviews-15590871104578818330` | Reviews API implementation | Medium |
| `jules/count-business-reviews-12908797371811244599` | Business review counting logic | Low |

**Rationale:** These are core marketplace features required for MVP functionality.

**Merge Order:**
1. Business profiles (foundation)
2. Products API (depends on profiles)
3. Reviews API (depends on profiles)
4. Review counting (extends reviews)

### 4. Contact Form Implementations
**Priority:** MEDIUM (evaluate for duplication)

| Branch | Description | Risk Level |
|--------|-------------|------------|
| `feature/business-contact-form-10637158813823643494` | Contact form v1 | Medium |
| `feature/implement-contact-form-10286381009409655031` | Contact form v2 | Medium |
| `jules-contact-form-implementation-3878926283966977189` | Contact form v3 (Jules) | Medium |

**⚠️ DUPLICATE FEATURES DETECTED**

**Action Required:** 
1. Review code quality, test coverage, and completeness of each implementation
2. Select the BEST implementation based on:
   - Code quality and maintainability
   - Test coverage
   - Feature completeness
   - Integration with existing codebase
3. Merge the selected implementation
4. Close/delete the other two branches with explanation

**Evaluation Criteria:**
- Does it follow project architecture patterns?
- Is it compatible with V3 design system?
- Does it integrate with Resend email system?
- Are there comprehensive tests?

### 5. Stripe Payment Integration
**Priority:** HIGH (revenue-critical)

| Branch | Description | Risk Level |
|--------|-------------|------------|
| `jules-stripe-account-query-954478057820138488` | Stripe Connect account queries | Medium |
| `jules-stripe-webhook-implementation-4671317611597569415` | Webhook event handling | High |
| `jules-webhook-refund-18424877112051176606` | Refund processing | High |
| `jules-dispute-handler-1-5842272508693809648` | Dispute handling | High |

**Rationale:** Payment infrastructure is critical for marketplace functionality.

**⚠️ SPECIAL CONSIDERATIONS:**
- All Stripe changes must be tested in sandbox mode
- Verify webhook signature validation is implemented
- Ensure MoR (Merchant of Record) model is preserved: vendors handle refunds, not Suburbmates
- Check compliance with [STRIPE_TESTING_PLAYBOOK.md](v1.1-docs/Stripe/STRIPE_TESTING_PLAYBOOK.md)

**Merge Order:**
1. Stripe account queries (foundation)
2. Webhook implementation (core)
3. Refund handling (extends webhooks)
4. Dispute handling (extends webhooks)

### 6. Security & Logging
**Priority:** HIGH (production readiness)

| Branch | Description | Risk Level |
|--------|-------------|------------|
| `sentinel-logging-security-14848806251031819962` | Enhanced security logging | Medium |
| `sentinel-webhook-refactor-10747781692254562034` | Webhook code refactoring | Medium |

**Rationale:** Security and observability are essential for production deployment.

**Action:** Review for PII exposure in logs (violates Sentry best practices).

### 7. UI/UX Improvements
**Priority:** MEDIUM (enhances user experience)

| Branch | Description | Risk Level |
|--------|-------------|------------|
| `palette-image-gallery-a11y-227846487572166473` | Image gallery accessibility | Low |

**Rationale:** A11y improvements enhance usability and compliance.

---

## Phased Merge Strategy

### Phase 1: Foundation (Days 1-2)
**Goal:** Establish stable base with minimal risk

```
1. dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7
2. chore/pagination-util-cleanup-11545527530274447792
3. copilot/set-up-copilot-instructions
```

**Success Criteria:**
- ✅ `npm run build` passes
- ✅ `npm run lint` passes
- ✅ All existing tests pass
- ✅ No console errors in dev mode

### Phase 2: Database Schema (Days 2-3)
**Goal:** Update database structure before dependent features

```
1. update-schema-include-website-12369568459490167957
2. add-business-images-to-api-946888828297667986 (if not conflicting)
```

**Success Criteria:**
- ✅ Migrations run successfully
- ✅ Database types regenerated (`src/lib/database.types.ts`)
- ✅ No breaking changes to existing API endpoints
- ✅ RLS policies updated if needed

### Phase 3: Core Business Features (Days 3-5)
**Goal:** Merge essential marketplace functionality

```
1. feat-business-profile-creation-10647071320409416453
2. feature/products-api-3808554909437837721
3. feature/api-reviews-15590871104578818330
4. jules/count-business-reviews-12908797371811244599
```

**Success Criteria:**
- ✅ API endpoints return expected responses
- ✅ Integration tests pass
- ✅ Postman/manual API testing successful
- ✅ Frontend can consume new APIs

### Phase 4: Contact Form Consolidation (Days 5-6)
**Goal:** Select and merge best contact form implementation

**Process:**
1. Checkout each branch locally
2. Run and test each implementation
3. Review code quality and test coverage
4. Document evaluation in `CONTACT_FORM_EVALUATION.md`
5. Merge selected implementation
6. Close other branches with explanation

**Success Criteria:**
- ✅ Contact form works on business detail pages
- ✅ Email delivery via Resend confirmed
- ✅ Form validation works correctly
- ✅ Mobile-responsive design

### Phase 5: Stripe Payment Integration (Days 6-8)
**Goal:** Complete payment processing infrastructure

```
1. jules-stripe-account-query-954478057820138488
2. jules-stripe-webhook-implementation-4671317611597569415
3. jules-webhook-refund-18424877112051176606
4. jules-dispute-handler-1-5842272508693809648
```

**Success Criteria:**
- ✅ Stripe CLI webhook forwarding works
- ✅ Test events trigger correct handlers
- ✅ Webhook signature validation implemented
- ✅ Vendor payouts correctly calculated
- ✅ Refund flow documented (vendor-initiated only)
- ✅ All Stripe tests in sandbox mode pass

### Phase 6: Security & Logging (Days 8-9)
**Goal:** Enhance production readiness

```
1. sentinel-logging-security-14848806251031819962
2. sentinel-webhook-refactor-10747781692254562034
```

**Success Criteria:**
- ✅ Sensitive data not logged (PII, tokens, etc.)
- ✅ Sentry integration working correctly
- ✅ Error tracking captures useful context
- ✅ Webhook code follows DRY principles

### Phase 7: UI/UX Polish (Days 9-10)
**Goal:** Complete user-facing improvements

```
1. palette-image-gallery-a11y-227846487572166473
```

**Success Criteria:**
- ✅ WCAG 2.1 AA compliance for gallery
- ✅ Keyboard navigation works
- ✅ Screen reader compatibility verified
- ✅ Lighthouse accessibility score > 90

---

## Merge Execution Procedure

### Pre-Merge Checklist (for each branch)
- [ ] Create backup branch: `git branch backup-main-YYYYMMDD main`
- [ ] Document current main branch SHA
- [ ] Review branch commits and files changed
- [ ] Identify potential conflicts with main
- [ ] Check for test coverage

### Merge Steps
```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create a merge branch
git checkout -b merge/<branch-name>

# 3. Merge the feature branch
git merge origin/<feature-branch-name>

# 4. Resolve any conflicts
# (Prioritize: newer > older, complete > partial, tested > untested)

# 5. Test thoroughly
npm run build
npm run lint
npm run test

# 6. Manual testing
npm run dev
# Test affected features manually

# 7. Commit merge
git commit -m "Merge <feature-branch-name> into main"

# 8. Push to main
git push origin merge/<branch-name>
# Create PR for review

# 9. After PR approval, merge to main
# 10. Delete feature branch
git push origin --delete <feature-branch-name>
```

### Post-Merge Verification
- [ ] Build succeeds without warnings
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Manual smoke test of merged feature
- [ ] Documentation updated (if needed)
- [ ] Changelog entry added

---

## Conflict Resolution Guidelines

### When Conflicts Occur

1. **Analyze the conflict:**
   - What files are affected?
   - What functionality overlaps?
   - Which version is more recent/complete?

2. **Resolution priority:**
   - ✅ Keep code that aligns with V1.1 architecture
   - ✅ Prefer more recent implementations
   - ✅ Choose more thoroughly tested code
   - ✅ Maintain consistency with existing patterns

3. **Document decisions:**
   - Add comment explaining why you chose one version
   - Note in PR description if significant choices were made
   - Update relevant documentation

### Common Conflict Scenarios

**Scenario 1: Duplicate Features (e.g., contact forms)**
- **Resolution:** Evaluate each implementation, select best, document reasoning
- **Action:** Close duplicate branches with explanation

**Scenario 2: Schema Conflicts**
- **Resolution:** Merge schemas, ensure migrations are sequential
- **Action:** Update database.types.ts, test all affected APIs

**Scenario 3: API Endpoint Conflicts**
- **Resolution:** Keep more complete implementation or merge features
- **Action:** Update API documentation

**Scenario 4: TypeScript Type Conflicts**
- **Resolution:** Use most accurate/complete type definitions
- **Action:** Ensure type safety across codebase

---

## Risk Management

### High-Risk Merges
- Stripe payment changes (refund/dispute handlers)
- Database schema migrations
- Authentication/authorization changes

### Mitigation Strategies
1. **Backup Strategy:**
   - Tag main branch before starting: `git tag pre-merge-backup-$(date +%Y%m%d)`
   - Create backup branch: `backup-main-YYYYMMDD`
   - Document SHA of last known good state

2. **Testing Strategy:**
   - Run full test suite after each merge
   - Manual testing of critical paths
   - Staging deployment before production

3. **Rollback Plan:**
   - Document each merge with SHA
   - Keep rollback commands ready
   - Test rollback procedure before starting

4. **Communication:**
   - Notify team before starting merge process
   - Document progress in this file
   - Report blockers immediately

---

## Testing Requirements

### After Each Merge
```bash
# 1. TypeScript compilation
npm run build

# 2. Linting
npm run lint

# 3. Unit tests
npm run test

# 4. Integration tests (if applicable)
npm run test:integration

# 5. Manual smoke test
npm run dev
```

### Critical Test Cases
- [ ] User authentication flow
- [ ] Business profile creation/viewing
- [ ] Product listing and details
- [ ] Review submission and display
- [ ] Contact form submission
- [ ] Stripe webhook processing (sandbox)
- [ ] Image gallery navigation
- [ ] Mobile responsiveness

---

## Post-Merge Activities

### Immediate Actions
1. **Branch Cleanup:**
   ```bash
   # List all merged branches
   git branch --merged main
   
   # Delete merged branches
   git branch -d <branch-name>
   git push origin --delete <branch-name>
   ```

2. **Documentation Updates:**
   - Update README.md with new features
   - Update API documentation
   - Update CHANGELOG.md
   - Update v1.1-docs/ if architecture changed

3. **Deployment:**
   - Deploy to staging
   - Run full QA pass
   - Deploy to production
   - Monitor Sentry for errors

### Long-Term Actions
1. **Create Release:**
   - Tag release: `v1.1.0`
   - Write release notes
   - Announce to stakeholders

2. **Retrospective:**
   - Document lessons learned
   - Update merge procedures if needed
   - Identify process improvements

3. **Branch Hygiene:**
   - Establish branch naming convention
   - Set up branch protection rules
   - Configure auto-delete on merge

---

## Tracking Progress

### Merge Status Log

| Phase | Branch | Status | Merged Date | Merged By | Notes |
|-------|--------|--------|-------------|-----------|-------|
| 1 | dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7 | ⏳ Pending | - | - | - |
| 1 | chore/pagination-util-cleanup-11545527530274447792 | ⏳ Pending | - | - | - |
| 1 | copilot/set-up-copilot-instructions | ⏳ Pending | - | - | - |
| 2 | update-schema-include-website-12369568459490167957 | ⏳ Pending | - | - | - |
| 2 | add-business-images-to-api-946888828297667986 | ⏳ Pending | - | - | Check for conflicts |
| 3 | feat-business-profile-creation-10647071320409416453 | ⏳ Pending | - | - | - |
| 3 | feature/products-api-3808554909437837721 | ⏳ Pending | - | - | - |
| 3 | feature/api-reviews-15590871104578818330 | ⏳ Pending | - | - | - |
| 3 | jules/count-business-reviews-12908797371811244599 | ⏳ Pending | - | - | - |
| 4 | feature/business-contact-form-10637158813823643494 | ⏳ Pending | - | - | Evaluate vs others |
| 4 | feature/implement-contact-form-10286381009409655031 | ⏳ Pending | - | - | Evaluate vs others |
| 4 | jules-contact-form-implementation-3878926283966977189 | ⏳ Pending | - | - | Evaluate vs others |
| 5 | jules-stripe-account-query-954478057820138488 | ⏳ Pending | - | - | Test in sandbox |
| 5 | jules-stripe-webhook-implementation-4671317611597569415 | ⏳ Pending | - | - | Test in sandbox |
| 5 | jules-webhook-refund-18424877112051176606 | ⏳ Pending | - | - | Verify MoR model |
| 5 | jules-dispute-handler-1-5842272508693809648 | ⏳ Pending | - | - | Test in sandbox |
| 6 | sentinel-logging-security-14848806251031819962 | ⏳ Pending | - | - | Check for PII |
| 6 | sentinel-webhook-refactor-10747781692254562034 | ⏳ Pending | - | - | - |
| 7 | palette-image-gallery-a11y-227846487572166473 | ⏳ Pending | - | - | - |

**Status Legend:**
- ⏳ Pending
- 🔄 In Progress
- ✅ Merged
- ❌ Rejected/Closed
- ⚠️ Blocked

---

## Appendix A: Branch Details

### Full Branch List with SHAs

| Branch Name | SHA | Last Commit Date |
|-------------|-----|------------------|
| add-business-images-to-api-946888828297667986 | 0d1ab827 | Dec 25, 2025 |
| chore/pagination-util-cleanup-11545527530274447792 | 90374b21 | Dec 25, 2025 |
| copilot/set-up-copilot-instructions | d3a29041 | Dec 27, 2025 |
| dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7 | 580e47d9 | - |
| feat-business-profile-creation-10647071320409416453 | f083e112 | - |
| feature/api-reviews-15590871104578818330 | 4148fd8e | - |
| feature/business-contact-form-10637158813823643494 | 478b5db2 | - |
| feature/implement-contact-form-10286381009409655031 | cab22442 | - |
| feature/products-api-3808554909437837721 | 86182dd2 | - |
| jules/count-business-reviews-12908797371811244599 | b151d6c8 | - |
| jules-contact-form-implementation-3878926283966977189 | 75958110 | - |
| jules-dispute-handler-1-5842272508693809648 | 9131a12f | - |
| jules-stripe-account-query-954478057820138488 | 0a022dc3 | - |
| jules-stripe-webhook-implementation-4671317611597569415 | 03c7376f | - |
| jules-webhook-refund-18424877112051176606 | 5c621916 | - |
| palette-image-gallery-a11y-227846487572166473 | e1fb625c | - |
| sentinel-logging-security-14848806251031819962 | 855e5127 | - |
| sentinel-webhook-refactor-10747781692254562034 | a2edea76 | - |
| update-schema-include-website-12369568459490167957 | 034f6f48 | - |

---

## Appendix B: Commands Reference

### Useful Git Commands

```bash
# View all branches with last commit
git for-each-ref --sort=-committerdate refs/remotes/origin --format='%(refname:short) %(committerdate:short) %(subject)'

# Compare branch with main
git log main..<branch-name> --oneline

# View files changed in branch
git diff --name-only main..<branch-name>

# Check if branch is merged
git branch --merged main

# Delete multiple merged branches
git branch --merged main | grep -v "main" | xargs git branch -d

# Create backup tag
git tag pre-merge-backup-$(date +%Y%m%d)
git push origin --tags
```

---

## Questions & Decisions

### Open Questions
1. **Contact Forms:** Which implementation should be kept? (Requires code review)
2. **Business Images:** Does this conflict with already-merged profile_image_url?
3. **Stripe Integration:** Are all webhook handlers compatible with current Stripe API version?
4. **Testing:** Are there integration tests for Stripe webhooks?

### Decisions Made
- **Strategy:** Phased approach with testing between phases
- **Priority:** Infrastructure first, then schema, then features
- **Duplicates:** Will evaluate and select best implementation
- **Risk Mitigation:** Backup branches and tags before starting

---

## Contact & Support

For questions or issues during the merge process:
- Review this document first
- Check [AGENTS.md](AGENTS.md) for Copilot guidance
- Refer to [v1.1-docs/](v1.1-docs/) for architecture details
- Consult [STRIPE_TESTING_PLAYBOOK.md](v1.1-docs/Stripe/STRIPE_TESTING_PLAYBOOK.md) for payment testing

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2025  
**Next Review:** After Phase 1 completion
