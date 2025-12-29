# Visual Merge Strategy

```
                                    MAIN BRANCH
                                        │
                                        │ (Current: 64700f0 - profile_image_url)
                                        ├──────────────────────────────────────┐
                                        │                                      │
                    ┌───────────────────┴────────────┐                         │
                    │                                │                         │
              PHASE 1: Infrastructure          PHASE 2: Schema                 │
                 (2-3 hours)                     (3-4 hours)                   │
                    │                                │                         │
        ┌───────────┼───────────┐          ┌────────┴────────┐                │
        │           │           │          │                 │                │
    dependabot  pagination  copilot     website         images               │
                                        field         column                  │
                    │                                │                         │
                    └────────────┬───────────────────┘                         │
                                 │                                             │
                        PHASE 3: Core Features                                 │
                           (1-2 days)                                          │
                                 │                                             │
                 ┌───────────────┼───────────────┬────────────┐               │
                 │               │               │            │               │
            business        products         reviews      review             │
            profiles          API             API        counting            │
                 │               │               │            │               │
                 └───────────────┴───────────────┴────────────┘               │
                                 │                                             │
                        PHASE 4: Contact Forms                                 │
                          (4-6 hours)                                          │
                                 │                                             │
                    ┌────────────┼────────────┐                               │
                    │            │            │                               │
            contact-form-1  contact-form-2  contact-form-3                    │
                    │            │            │                               │
                    └────── EVALUATE ────────┘                               │
                                 │                                             │
                           SELECT BEST                                         │
                                 │                                             │
                    ┌────────────┴────────────┐                               │
                    │                         │                               │
                  MERGE                     CLOSE                              │
                (selected)                (others)                             │
                    │                                                          │
                    └─────────────────┬────────────────────────────────────────┘
                                      │
                            PHASE 5: Stripe Integration
                                 (2-3 days)
                                      │
                      ┌───────────────┼───────────────┬────────────┐
                      │               │               │            │
                  account         webhook         refund      dispute
                  query         handling        handling    handling
                      │               │               │            │
                      └───────────────┴───────────────┴────────────┘
                                      │
                            PHASE 6: Security & Logging
                               (4-6 hours)
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                    logging-security        webhook-refactor
                         │                         │
                         └────────────┬────────────┘
                                      │
                              PHASE 7: UI/UX
                               (2-3 hours)
                                      │
                                      │
                              image-gallery-a11y
                                      │
                                      │
                              ┌───────┴────────┐
                              │                │
                         CLEANUP            RELEASE
                              │                │
                    ┌─────────┴──────────┐     │
                    │                    │     │
              Delete merged         Create    │
               branches             tag       │
                    │                    │     │
                    └────────────────────┴─────┘
                                      │
                              PRODUCTION DEPLOY
```

## Merge Flow Diagram

### Sequential Dependencies

```
Infrastructure → Schema → Core Features → Contact Forms → Stripe → Security → UI/UX
     ✓              ✓           ✓              ✓            ✓          ✓        ✓
   Low Risk     Medium Risk  Medium Risk   High Risk    High Risk  Medium   Low Risk
                                          (evaluate)  (test sandbox)  Risk
```

## Branch Status Overview

```
📊 Total: 18 branches to merge

├── ✅ Phase 1 (3 branches) - Infrastructure
│   ├── dependabot/npm_and_yarn/npm_and_yarn-3c3c744ce7
│   ├── chore/pagination-util-cleanup-11545527530274447792
│   └── copilot/set-up-copilot-instructions
│
├── ✅ Phase 2 (2 branches) - Database Schema
│   ├── update-schema-include-website-12369568459490167957
│   └── add-business-images-to-api-946888828297667986
│
├── ✅ Phase 3 (4 branches) - Core Features
│   ├── feat-business-profile-creation-10647071320409416453
│   ├── feature/products-api-3808554909437837721
│   ├── feature/api-reviews-15590871104578818330
│   └── jules/count-business-reviews-12908797371811244599
│
├── ⚠️  Phase 4 (3 branches) - Contact Forms [EVALUATE - Pick 1, Close 2]
│   ├── feature/business-contact-form-10637158813823643494
│   ├── feature/implement-contact-form-10286381009409655031
│   └── jules-contact-form-implementation-3878926283966977189
│
├── 🔐 Phase 5 (4 branches) - Stripe Integration [SANDBOX TESTING REQUIRED]
│   ├── jules-stripe-account-query-954478057820138488
│   ├── jules-stripe-webhook-implementation-4671317611597569415
│   ├── jules-webhook-refund-18424877112051176606
│   └── jules-dispute-handler-1-5842272508693809648
│
├── 🔒 Phase 6 (2 branches) - Security & Logging
│   ├── sentinel-logging-security-14848806251031819962
│   └── sentinel-webhook-refactor-10747781692254562034
│
└── 🎨 Phase 7 (1 branch) - UI/UX
    └── palette-image-gallery-a11y-227846487572166473
```

## Risk Heat Map

```
┌─────────────────────────────────────────────────────┐
│ Phase │ Risk Level │ Conflict Prob │ Test Complexity │
├─────────────────────────────────────────────────────┤
│   1   │    🟢 LOW   │     Low       │      Low        │
│   2   │  🟡 MEDIUM  │    Medium     │     Medium      │
│   3   │  🟡 MEDIUM  │    Medium     │     Medium      │
│   4   │   🟠 HIGH   │     High      │      High       │ ← DUPLICATE FEATURES
│   5   │   🔴 HIGH   │    Medium     │   Very High     │ ← PAYMENT CRITICAL
│   6   │  🟡 MEDIUM  │     Low       │     Medium      │
│   7   │    🟢 LOW   │     Low       │      Low        │
└─────────────────────────────────────────────────────┘
```

## Timeline Visualization

```
Week 1                    Week 2
├────────────────────────┼────────────────────────┤
│                        │                        │
Day 1-2      Day 3-5     Day 6-8      Day 9-10
├─────┬──────┼──────────┬┼──────────┬─┼──────┬───┤
│ P1  │  P2  │    P3    ││    P5    │ │  P6  │P7 │
│     │      │          ││          │P│      │   │
│Infra│Schema│ Features ││  Stripe  │4│ Sec  │UI │
└─────┴──────┴──────────┴┴──────────┴─┴──────┴───┘
                           ^
                           │
                    Evaluate contact forms
```

## Decision Tree for Contact Forms (Phase 4)

```
                    Contact Form Evaluation
                            │
                ┌───────────┴───────────┐
                │                       │
         Checkout Each Branch    Test Each Implementation
                │                       │
                └───────────┬───────────┘
                            │
                     Score Each One
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        Code Quality   Test Coverage   Features
              │             │             │
              └─────────────┼─────────────┘
                            │
                     Select Winner
                            │
                  ┌─────────┴─────────┐
                  │                   │
            Merge Winner         Close Others
                  │                   │
                  └─────────┬─────────┘
                            │
                    Document Decision
```

## Testing Strategy Per Phase

```
Phase 1: Infrastructure
├── npm run build ✓
├── npm run lint ✓
└── npm run test ✓

Phase 2: Schema
├── npm run build ✓
├── npm run lint ✓
├── npm run test ✓
├── Migration validation ✓
└── API endpoint testing ✓

Phase 3: Core Features
├── npm run build ✓
├── npm run lint ✓
├── npm run test ✓
├── API integration tests ✓
└── Manual API testing ✓

Phase 4: Contact Forms
├── npm run build ✓
├── npm run lint ✓
├── npm run test ✓
├── Form submission test ✓
├── Email delivery test (Resend) ✓
└── Mobile responsiveness test ✓

Phase 5: Stripe
├── npm run build ✓
├── npm run lint ✓
├── npm run test ✓
├── Stripe CLI webhook testing ✓
├── Sandbox payment testing ✓
├── MoR model verification ✓
└── Payout calculation validation ✓

Phase 6: Security
├── npm run build ✓
├── npm run lint ✓
├── npm run test ✓
├── PII check in logs ✓
└── Sentry integration test ✓

Phase 7: UI/UX
├── npm run build ✓
├── npm run lint ✓
├── npm run test ✓
├── Keyboard navigation test ✓
├── Screen reader test ✓
└── Lighthouse accessibility score ✓
```

## Rollback Strategy

```
                    PRODUCTION ISSUE
                            │
                            │
                    ┌───────┴───────┐
                    │               │
               SEVERITY            SEVERITY
                MEDIUM              HIGH
                    │               │
                    │               │
              Revert Commit    Reset to Backup
                    │               │
              git revert HEAD  git reset --hard
                    │            backup-tag
                    │               │
                    │               │
              Push to main    Create hotfix PR
                    │               │
                    └───────┬───────┘
                            │
                    Monitor & Verify
                            │
                    Document Incident
```

## Success Metrics

```
┌─────────────────────────────────────────────────────┐
│ Metric              │ Target      │ Current         │
├─────────────────────────────────────────────────────┤
│ Branches Merged     │ 16-18/18    │ 0/18            │
│ Build Status        │ ✅ Passing   │ ⏳ Not run      │
│ Test Coverage       │ No decrease │ ⏳ Not measured │
│ Zero Downtime       │ ✅ Required  │ ⏳ Not deployed │
│ No Production Bugs  │ ✅ Required  │ ⏳ Not deployed │
│ Documentation       │ ✅ Complete  │ ✅ Complete     │
└─────────────────────────────────────────────────────┘
```

---

**Legend:**
- ✅ Low Risk / Complete
- 🟡 Medium Risk
- 🟠 High Risk
- 🔴 Critical Risk
- ⏳ Pending
- 🔄 In Progress
- ⚠️  Requires Special Attention
