# 🏢 SuburbMates - Melbourne's Digital Neighbourhood

**Status:** 🚧 **Stage 3 In Progress** - Partial Implementation Complete
**Build:** ✅ Compiles Successfully | **Runtime:** ✅ Core Features Working
**Tech Stack:** Next.js 15+ / Supabase PostgreSQL / TypeScript / Stripe Connect

---

## 🚀 **Current Implementation Status**

### **✅ Completed Features (Stages 1.1-2.2)**
- **🏠 Homepage**: Complete V3 design system with animations
- **📋 Business Directory**: Search, filtering, and professional listings (`/directory`)
- **🏢 Business Detail Pages**: Individual profiles with galleries (`/business/[slug]`)
- **📞 Contact Systems**: Direct communication forms and workflows
- **🛍️ Marketplace Integration**: Vendor product showcases and listings
- **📱 Mobile Experience**: Responsive design with touch-optimized interactions

### **🚧 Stage 3 Partial Implementation (~60% Complete)**
- **🔍 Search Telemetry**: PII-redacted search analytics with SHA-256 hashing
- **📊 Vendor Dashboard Infrastructure**: Routes, hooks, and API endpoints ready
- **💳 Featured Slots API**: Premium-tier enforcement and slot management
- **🔄 Tier Management**: Subscription handling and FIFO downgrade logic
- **⚖️ Dispute Gating**: Auto-suspension for 3+ disputes (30 days)
- **📈 Commission Ledger**: Immutable tracking on every transaction

### **🎭 Frontend V3 Design System**
- **Typography**: Poppins font family (300-900 weights)
- **Color Palette**: Professional grayscale with accent overlays
- **Animations**: Smooth scroll animations with IntersectionObserver
- **Performance**: Optimized loading with lazy loading and code splitting

---

## 🏗️ **Project Structure**

```
suburbmates-v1/
├── 🎯 src/app/                     # Next.js 15+ App Router
│   ├── (public)/                  # Public pages (homepage, directory)
│   ├── business/[slug]/            # Dynamic business detail pages
│   └── api/                       # API endpoints (auth, business, checkout)
├── 📚 v1.1-docs/                  # SSOT Documentation (architecture, specs)
├── 🤖 .github/                    # CI/CD + Copilot instructions
├── 🛠️ .vscode/                    # Development environment settings
└── 📊 Stage Reports               # Implementation completion tracking
```

---

## 📖 **Critical Documents for Stage 3 Development**

**Start here for immediate execution context:**

- **Founder Decisions & Amendments**: `v1.1-docs/FOUNDER_STRATEGY/FOUNDER_AMENDMENT_DIRECTIVE.md`
- **Decisions Log (Quick Reference)**: `v1.1-docs/DECISIONS_LOG.md`
- **Stage 3 Implementation Guide**: `v1.1-docs/10_IMPLEMENTATION_GUIDES/V1_1_STAGE_3_IMPLEMENTATION_GUIDE.md`
- **Stage 3 Handoff (Execution Brief)**: `v1.1-docs/10_IMPLEMENTATION_GUIDES/V1_1_STAGE_3_HANDOFF.md`
- **Stages 4–6 Roadmap**: `v1.1-docs/10_IMPLEMENTATION_GUIDES/V1_1_STAGES_4_6_IMPLEMENTATION_GUIDE.md`
- **Full Documentation Index**: `v1.1-docs/00_README_MASTER_INDEX.md`

---

## ⚡ **Quick Start**

### **Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev                # → http://localhost:3000

# Build for production
npm run build              # → Verifies all features working
```

### **Key URLs**
- **Homepage**: `http://localhost:3000` - V3 design with animations
- **Directory**: `http://localhost:3000/directory` - Business search & filtering  
- **Business Profile**: `http://localhost:3000/business/melbourne-tutoring-hub`

### **Stripe Sandbox & Webhook Workflow**
Before running payments tests, follow the [Stripe Testing Playbook](v1.1-docs/Stripe/STRIPE_TESTING_PLAYBOOK.md):
1. Toggle the Stripe dashboard into **Test mode** and ensure Connect Standard is enabled (note the test `STRIPE_CLIENT_ID`).
2. Create the test-mode versions of the Vendor Pro and Featured products/prices and copy their IDs into `.env.local`.
3. Install Stripe CLI (`stripe login`), run the app with `DISABLE_RATE_LIMIT=true npm run dev`, and start a listener:  
   `stripe listen --forward-to http://localhost:3010/api/webhook/stripe`.
4. Copy the generated `whsec_…` into `.env.local`, trigger test events (`stripe trigger checkout.session.completed`), then run Playwright/manual flows.
5. Record the session results under `reports/stripe-cli-YYYYMMDD.md`.

---

## 🎯 **Core Principles**

### **Business Architecture**
- **Vendor-as-Merchant-of-Record**: Vendors handle refunds and customer service
- **Directory ≠ Marketplace**: Separate business listing vs product sales
- **Platform Never Issues Refunds**: Vendor responsibility model
- **Melbourne Focus**: Local business discovery and connection

### **Technical Standards**
- **TypeScript Strict Mode**: Full type safety and compilation checks
- **Supabase PostgreSQL**: Row Level Security (RLS) enforced
- **Stripe Connect Standard**: Vendor payment processing
- **Next.js 15+**: Modern React with App Router

---

## 🛡️ **Quality Enforcement**

### **Automated Guardrails**
- ✅ **Forbidden Strings Scanner**: Prevents architectural violations
- ✅ **Required SSOT Terms Scanner**: Ensures documentation compliance
- ✅ **Architecture Validator**: Maintains clean code patterns
- ✅ **Schema Drift Detector**: Database consistency monitoring
- ✅ **Copilot PR Rules**: AI-assisted code review standards

### **Production Readiness**
- ✅ **Build Verification**: No TypeScript errors, all routes functional
- ✅ **Performance Optimization**: Image optimization, lazy loading
- ✅ **Mobile Responsive**: Touch-optimized with responsive breakpoints
- ✅ **SEO Ready**: Meta tags, structured data, sitemaps generated

---

## 📈 **Stage Completion Status**

| Stage | Features | Status |
|-------|----------|--------|
| **Stage 1.1-1.3** | Database, Auth, Stripe Setup | ✅ **Complete** |
| **Frontend V3** | Design System, Homepage | ✅ **Complete** |
| **Stage 2.1** | Directory & Search | ✅ **Complete** |
| **Stage 2.2** | Business Detail Pages | ✅ **Complete** |
| **Stage 3.x** | Marketplace Enhancement | 🚧 **In Progress (60%)** |

---

## 🎯 **Current Implementation Status**

SuburbMates is a **partially implemented marketplace platform** with:

### **✅ Production Ready Components**
- **Professional business discovery** through enhanced directory system
- **Detailed business profiles** with galleries, showcases, and contact integration
- **Direct customer communication** through integrated contact workflows
- **Premium user experience** with V3 design system and smooth animations

### **🚧 Stage 3 Backend Infrastructure (Complete)**
- **Search telemetry system** with PII-redacted analytics
- **Vendor dashboard APIs** for product and tier management
- **Featured slots management** with premium-tier enforcement
- **Advanced Stripe webhooks** for disputes, subscriptions, and commissions
- **Tier downgrade logic** with FIFO product unpublishing

### **⏳ Stage 3 Frontend Integration (Pending)**
- **Product CRUD UI** for vendor product management
- **Search ranking algorithm** with tier-based results
- **Featured slots purchase flow** for premium vendors
- **Tier upgrade/downgrade interface** with preview functionality
- **Vendor dashboard analytics** and insights

**Backend infrastructure complete, frontend integration in progress!** 🚧

---

*This repository is designed for **stability**, **correctness**, and **compliance** with Australian business regulations and platform responsibilities.*
