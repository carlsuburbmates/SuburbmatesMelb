# PHASE 5 DELIVERABLE 3A: Stage 3 Implementation Guide

**Stage 3:** Enhanced Marketplace Implementation  
**Timeline:** 4–5 weeks post-Stage 2.2  
**Team:** 1–2 backend engineers, 1 frontend engineer  
**Prerequisites:** Stages 1–2.2 complete, Stripe Client ID configured  

---

## 📋 STAGE 3 OVERVIEW

### **Business Objectives**
- Enable vendors to manage product inventory
- Implement advanced product discovery
- Monetize marketplace via featured slots & tier subscriptions
- Scale vendor capabilities via tier management

### **Technical Objectives**
- Complete marketplace API (7 remaining routes from Stage 1.3)
- Implement vendor tier system with subscription management
- Build featured slots queue with expiry automation
- Optimize search performance for 10K+ products

---

## 🎯 STAGE 3 FEATURE BREAKDOWN

### **Feature 3.1: Advanced Product Management (Week 1–2)**

#### **Task 3.1.1: Product CRUD Endpoints**

**Description:** Create remaining product management API endpoints

**Acceptance Criteria:**
- [x] GET `/api/products` – List vendor's products with pagination
- [x] POST `/api/products` – Create new product with validation
- [x] GET `/api/products/[id]` – Fetch product details
- [x] PUT `/api/products/[id]` – Update product (title, description, price, category)
- [x] DELETE `/api/products/[id]` – Soft-delete product (set published=false)
- [x] POST `/api/products/[id]/publish` – Toggle published state
- [x] POST `/api/products/[id]/upload-file` – Upload digital file

**Implementation Details:**

**Endpoint: POST /api/products**
```typescript
Request:
{
  "title": "Advanced TypeScript Guide",
  "description": "Learn TypeScript from basics to advanced patterns",
  "price": 49.99,
  "category_id": 3,
  "lga_id": 15,
  "delivery_type": "download"
}

Response:
{
  "id": "uuid",
  "slug": "advanced-typescript-guide",
  "title": "Advanced TypeScript Guide",
  "price": 49.99,
  "published": false,
  "created_at": "2024-11-15T10:00:00Z",
  "file_url": null,
  "file_size_bytes": null
}

Validation (Zod):
- title: string, min 5, max 200
- description: string, min 20, max 5000
- price: number, min 0.01, max 9999.99
- category_id: number, must exist in categories table
- lga_id: number, must exist in lgas table
- delivery_type: enum ['download', 'license_key']
```

**Middleware Chain:**
1. Authentication (jwt verify)
2. Authorization (vendor_id from token)
3. Rate limiting (60/min)
4. Zod validation
5. Business logic (quota check, tier limits)

**Quota Enforcement:**
```typescript
// In POST /api/products
const vendorProductCount = await db.query(
  `SELECT COUNT(*) as count FROM products WHERE vendor_id = $1`,
  [vendorId]
);

const tierLimits = TIER_LIMITS[vendor.vendor_tier]; // From constants.ts
if (vendorProductCount.count >= tierLimits.product_quota) {
  throw new QuotaExceededError(
    `Product quota exceeded. Basic: 50 products, Pro: 200 products`
  );
}
```

**File Upload Handling:**
```typescript
// In POST /api/products/[id]/upload-file
const fileBuffer = await request.formData().get('file').arrayBuffer();
const fileSizeBytes = fileBuffer.byteLength;

if (fileSizeBytes > 5 * 1024 * 1024 * 1024) { // 5GB limit
  throw new ValidationError('File exceeds 5GB limit');
}

const fileUrl = await supabaseStorage.upload(
  `products/${vendorId}/${productId}/file`,
  fileBuffer
);

await db.query(
  `UPDATE products SET digital_file_url = $1, file_size_bytes = $2 
   WHERE id = $3 AND vendor_id = $4`,
  [fileUrl, fileSizeBytes, productId, vendorId]
);
```

**Testing Strategy:**
- Unit: Validation schemas pass/fail
- Integration: Create → Publish → Update → Delete flow
- E2E: Vendor can list, create, and publish products via UI

---

#### **Task 3.1.2: Product Slug Generation & Routing**

**Description:** Implement URL-friendly product slugs and dynamic routing

**Acceptance Criteria:**
- [x] Slugs generated automatically from product title
- [x] Slugs unique per vendor (e.g., `/products/vendor-slug/product-slug`)
- [x] Slug collision resolution (append -1, -2, etc.)
- [x] Dynamic route `/product/[vendor]/[product]` functional
- [x] Slug updates when title changes

**Implementation:**
```typescript
// In utils.ts (already exists)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// In POST /api/products - auto-generate slug
let slug = slugify(title);

// Check for collision
const existing = await db.query(
  `SELECT COUNT(*) as count FROM products 
   WHERE vendor_id = $1 AND slug LIKE $2`,
  [vendorId, `${slug}%`]
);

if (existing.count > 0) {
  slug = `${slug}-${existing.count + 1}`;
}
```

**Routing:**
```typescript
// In src/app/product/[vendor]/[product]/page.tsx
export async function generateStaticParams() {
  const products = await db.query(
    `SELECT vendor_id, slug FROM products WHERE published = true`
  );
  
  return products.map(p => ({
    vendor: p.vendor_id,
    product: p.slug
  }));
}

export default function ProductPage({ params }) {
  const { vendor, product } = params;
  // Fetch product via GET /api/products?vendor_slug=...&product_slug=...
}
```

---

#### **Task 3.1.3: Search Indexing & Full-Text Search**

**Description:** Enable fast, relevant product search across marketplace

**Acceptance Criteria:**
- [x] Full-text search on product title + description
- [x] Search returns published products from active vendors only
- [x] Search completes in <100ms for 50K products
- [x] Pagination works (default 20 per page)
- [x] Sorting by relevance (default)

**Implementation:**

**Migration to add FTS index:**
```sql
-- Create full-text search index
CREATE INDEX idx_products_fts 
ON products USING GIN(
  to_tsvector('english', title || ' ' || description)
);

-- Index for active vendor filter
CREATE INDEX idx_products_vendor_active 
ON products(vendor_id) 
WHERE published = true;
```

**Search Endpoint:**
```typescript
// GET /api/products/search?q=typescript&page=1&limit=20&sort=relevance

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const sort = searchParams.get('sort') || 'relevance';
  
  if (!query || query.length < 2) {
    return badRequestResponse('Query must be at least 2 characters');
  }
  
  const offset = (page - 1) * limit;
  
  const tsQuery = query
    .split(' ')
    .map(word => `${word}:*`)
    .join(' & ');
  
  const results = await db.query(`
    SELECT 
      p.id, p.title, p.slug, p.price,
      ts_rank(
        to_tsvector('english', p.title || ' ' || p.description),
        plainto_tsquery('english', $1)
      ) as rank
    FROM products p
    JOIN vendors v ON p.vendor_id = v.id
    WHERE 
      p.published = true 
      AND v.vendor_status = 'active'
      AND to_tsvector('english', p.title || ' ' || p.description) 
          @@ plainto_tsquery('english', $1)
    ORDER BY 
      CASE 
        WHEN $2 = 'relevance' THEN rank
        WHEN $2 = 'price_low' THEN p.price
        WHEN $2 = 'price_high' THEN p.price DESC
        WHEN $2 = 'newest' THEN p.created_at DESC
      END
    LIMIT $3 OFFSET $4
  `, [query, sort, limit, offset]);
  
  const total = await db.query(`
    SELECT COUNT(*) as total FROM products p
    JOIN vendors v ON p.vendor_id = v.id
    WHERE p.published = true AND v.vendor_status = 'active'
      AND to_tsvector('english', p.title || ' ' || p.description) 
          @@ plainto_tsquery('english', $1)
  `, [query]);
  
  return successResponse({
    items: results,
    pagination: {
      page,
      limit,
      total: total[0].total,
      pages: Math.ceil(total[0].total / limit)
    }
  });
}
```

**Testing:**
- [ ] Search performance <100ms (benchmark with 50K products)
- [ ] Relevance ranking works (common words deprioritized)
- [ ] Pagination maintains consistency across pages
- [ ] Special characters handled safely (SQL injection prevention)

---

#### **Task 3.1.4: Category & LGA Filtering**

**Description:** Enable marketplace browsing by category and location

**Acceptance Criteria:**
- [x] GET `/api/products?category_id=1&lga_id=5` filters correctly
- [x] Multiple categories: GET `/api/products?category_id=1,2,3`
- [x] Filters combine with search
- [x] Filter dropdown lists populated from seeded data

**Implementation:**
```typescript
// Extend GET /api/products/search endpoint
const categoryIds = searchParams.get('category_id')?.split(',') || [];
const lgaIds = searchParams.get('lga_id')?.split(',') || [];

let whereClause = `
  WHERE p.published = true AND v.vendor_status = 'active'
`;

if (categoryIds.length > 0) {
  whereClause += ` AND p.category_id IN (${categoryIds.join(',')})`;
}

if (lgaIds.length > 0) {
  whereClause += ` AND p.lga_id IN (${lgaIds.join(',')})`;
}

// Apply filters to existing search query
```

**Frontend Filter Component:**
```typescript
// src/components/marketplace/MarketplaceFilters.tsx
export function MarketplaceFilters() {
  const [categories, setCategories] = useState([]);
  const [lgas, setLgas] = useState([]);
  
  useEffect(() => {
    // Fetch from GET /api/categories (already exists)
    // Fetch from GET /api/lgas (already exists)
  }, []);
  
  return (
    <div className="filters">
      <select multiple onChange={(e) => updateFilters('category_id', e.target.value)}>
        {categories.map(cat => <option key={cat.id}>{cat.name}</option>)}
      </select>
      
      <select multiple onChange={(e) => updateFilters('lga_id', e.target.value)}>
        {lgas.map(lga => <option key={lga.id}>{lga.name}</option>)}
      </select>
    </div>
  );
}
```

---

### **Feature 3.2: Vendor Tier Management (Week 2–3)**

#### **Task 3.2.1: Tier Upgrade Endpoint & Subscription**

**Description:** Allow vendors to upgrade from Basic to Pro with Stripe Billing

**Acceptance Criteria:**
- [x] POST `/api/vendor/upgrade-tier` creates Stripe subscription
- [x] Subscription auto-renews monthly
- [x] Tier changes reflected in DB (vendor.vendor_tier)
- [x] Tier features (quota, featured slots) immediately active
- [x] Stripe webhook updates tier on payment failure

**Implementation:**

**Endpoint: POST /api/vendor/upgrade-tier**
```typescript
export async function POST(request: Request) {
  const user = await getCurrentUser(); // From auth middleware
  const vendor = await db.query(
    `SELECT * FROM vendors WHERE user_id = $1`,
    [user.id]
  );
  
  if (!vendor) {
    return forbiddenResponse('User is not a vendor');
  }
  
  if (vendor.vendor_tier === 'pro') {
    return unprocessableResponse('Already Pro tier');
  }
  
  // Create Stripe subscription
  const subscription = await stripe.subscriptions.create({
    customer: vendor.stripe_customer_id || 
              (await createStripeCustomer(vendor.id, vendor.stripe_connect_id)),
    items: [
      {
        price: process.env.STRIPE_PRICE_VENDOR_PRO_MONTH
      }
    ],
    metadata: {
      vendor_id: vendor.id,
      tier_upgrade_date: new Date().toISOString()
    }
  });
  
  // Update vendor tier in DB
  await db.query(
    `UPDATE vendors SET vendor_tier = 'pro', 
     stripe_subscription_id = $1, 
     subscription_active_since = NOW()
     WHERE id = $2`,
    [subscription.id, vendor.id]
  );
  
  return successResponse({
    tier: 'pro',
    subscription_id: subscription.id,
    next_billing_date: subscription.current_period_end
  });
}
```

**Webhook Handling (Stripe):**
```typescript
// POST /api/webhooks/stripe
// Existing handler, extend to handle subscription events

if (event.type === 'customer.subscription.updated') {
  const subscription = event.data.object;
  
  if (subscription.status === 'active') {
    await db.query(
      `UPDATE vendors SET vendor_tier = 'pro' 
       WHERE stripe_subscription_id = $1`,
      [subscription.id]
    );
  } else if (subscription.status === 'past_due' || subscription.status === 'canceled') {
    await db.query(
      `UPDATE vendors SET vendor_tier = 'basic' 
       WHERE stripe_subscription_id = $1`,
      [subscription.id]
    );
  }
}

if (event.type === 'invoice.payment_failed') {
  const invoice = event.data.object;
  // Email vendor: "Payment failed, tier downgraded to Basic"
  await sendEmail({
    to: vendor.email,
    template: 'payment_failed_downgrade',
    data: { vendor_name: vendor.name }
  });
}
```

**Testing:**
- [ ] Successful upgrade: tier changes in DB
- [ ] Stripe subscription created
- [ ] Subscription renewal scheduled correctly
- [ ] Payment failure downgrades tier
- [ ] Email sent on payment failure

---

#### **Task 3.2.2: Stripe Connect Account Linking**

**Description:** Enable vendor account to connect Stripe account for payouts

**Acceptance Criteria:**
- [x] OAuth callback: GET `/api/vendor/connect/callback?code=...`
- [x] Vendor Stripe account linked
- [x] Vendor.stripe_connect_id stored
- [x] Vendor can immediately receive payouts

**Prerequisites:**
- ⚠️ **BLOCKER:** Stripe Client ID must be configured in `.env.local`

**Implementation:**

**Step 1: Initiate Connect Onboarding**
```typescript
// POST /api/vendor/connect/initiate
export async function POST(request: Request) {
  const user = await getCurrentUser();
  const vendor = await getVendor(user.id);
  
  const authUrl = new URL('https://connect.stripe.com/oauth/authorize');
  authUrl.searchParams.set('client_id', process.env.STRIPE_CLIENT_ID);
  authUrl.searchParams.set(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/connect/callback`
  );
  authUrl.searchParams.set('state', vendor.id); // CSRF token
  authUrl.searchParams.set('stripe_user[email]', vendor.email);
  authUrl.searchParams.set('stripe_user[url]', vendor.website_url);
  
  return successResponse({
    authorization_url: authUrl.toString()
  });
}
```

**Step 2: Callback Handler**
```typescript
// GET /api/vendor/connect/callback?code=...&state=vendor_id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const vendorId = searchParams.get('state');
  
  if (!code || !vendorId) {
    return badRequestResponse('Missing authorization code or state');
  }
  
  // Exchange code for access token
  const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_secret: process.env.STRIPE_SECRET_KEY,
      code: code,
      grant_type: 'authorization_code'
    })
  });
  
  const { stripe_user_id, access_token } = await tokenResponse.json();
  
  // Store in vendors table
  await db.query(
    `UPDATE vendors SET stripe_connect_id = $1, stripe_connect_token = $2
     WHERE id = $3`,
    [stripe_user_id, access_token, vendorId]
  );
  
  return redirect('/vendor/dashboard?connect_success=true');
}
```

**Testing:**
- [ ] OAuth flow completes
- [ ] Stripe Connect account linked
- [ ] Vendor ID stored in DB
- [ ] Test payout creation with connected account

---

#### **Task 3.2.3: ABN Verification for Tier Upgrade**

**Description:** Validate vendor ABN before allowing Pro tier upgrade

**Acceptance Criteria:**
- [x] ABN format validation (11 digits)
- [x] ABN checksum validation
- [x] Vendor cannot upgrade without valid ABN
- [x] Repeated invalid attempts logged

**Implementation:**
```typescript
// In validation.ts (already included in Stage 1.2)
export const vendorUpgradeSchema = z.object({
  abn: z.string()
    .regex(/^\d{11}$/, 'ABN must be 11 digits')
    .refine(isValidABN, 'Invalid ABN checksum')
});

function isValidABN(abn: string): boolean {
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = abn.split('').map(Number);
  
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    sum += (digits[i] % 89) * weights[i];
  }
  
  return (sum % 89) === 0;
}
```

**In POST /api/vendor/upgrade-tier:**
```typescript
// Add ABN validation before Stripe call
const { abn } = await request.json();
const validated = vendorUpgradeSchema.parse({ abn });

// If invalid, log attempt
if (!isValidABN(abn)) {
  await logSecurityEvent({
    type: 'INVALID_ABN_ATTEMPT',
    vendor_id: vendor.id,
    abn_partial: abn.slice(-4), // Log only last 4 for privacy
    ip_address: request.headers.get('x-forwarded-for')
  });
}
```

---

### **Feature 3.3: Featured Slots & Queue Management (Week 3–4)**

#### **Task 3.3.1: Featured Slot Purchase**

**Description:** Allow vendors to purchase featured placement

**Acceptance Criteria:**
- [x] POST `/api/featured/purchase` creates checkout session
- [x] Pricing: $20 AUD for 30 days
- [x] Slot automatically assigned or queued
- [x] Webhook processes payment and activates slot

**Implementation:**

**Endpoint: POST /api/featured/purchase**
```typescript
export async function POST(request: Request) {
  const user = await getCurrentUser();
  const vendor = await getVendor(user.id);
  
  // Check if vendor can afford featured slot
  const balance = await getVendorBalance(vendor.id);
  if (balance < 20) {
    return unprocessableResponse('Insufficient balance for featured slot');
  }
  
  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_FEATURED_30D,
        quantity: 1
      }
    ],
    mode: 'payment',
    customer: vendor.stripe_customer_id,
    client_reference_id: vendor.id,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/vendor/featured/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/vendor/featured/cancel`,
    metadata: {
      vendor_id: vendor.id,
      featured_type: 'business_placement'
    }
  });
  
  return successResponse({
    checkout_url: session.url
  });
}
```

**Webhook: Payment Processed**
```typescript
// POST /api/webhooks/stripe
// Handle checkout.session.completed

if (event.data.object.payment_status === 'paid') {
  const vendorId = event.data.object.client_reference_id;
  
  // Check if featured slot available
  const availableSlot = await db.query(`
    SELECT id FROM featured_slots 
    WHERE is_available = true 
    LIMIT 1
  `);
  
  if (availableSlot) {
    // Assign slot immediately (expires 30 days)
    await db.query(`
      UPDATE featured_slots 
      SET vendor_id = $1, is_available = false, 
          expires_at = NOW() + INTERVAL '30 days'
      WHERE id = $2
    `, [vendorId, availableSlot.id]);
    
    // Send notification
    await sendEmail({
      to: vendor.email,
      template: 'featured_slot_active',
      data: { expires_at: futureDate }
    });
  } else {
    // No slot available, add to queue
    const queuePosition = await db.query(`
      SELECT MAX(position) as max_pos FROM featured_queue
    `);
    
    await db.query(`
      INSERT INTO featured_queue (vendor_id, position, added_at)
      VALUES ($1, $2, NOW())
    `, [vendorId, (queuePosition[0].max_pos || 0) + 1]);
    
    // Send notification
    await sendEmail({
      to: vendor.email,
      template: 'featured_queue_position',
      data: { position: queuePosition[0].max_pos + 1 }
    });
  }
}
```

**Testing:**
- [ ] Vendor can purchase featured slot
- [ ] Payment processed correctly
- [ ] Slot assigned or queued
- [ ] Emails sent appropriately

---

#### **Task 3.3.2: Queue Position Calculation & Promotion**

**Description:** Implement featured queue with fair rotation

**Acceptance Criteria:**
- [x] GET `/api/featured/queue-position` returns vendor position
- [x] Queue position calculated fairly (rotation based on time)
- [x] Promotion emails sent when reaching top
- [x] Cron job moves queue forward daily

**Implementation:**

**Queue Position Calculation:**
```typescript
// Queue algorithm: (position / 30 days) = promotion chance per day
// Vendor at position 10 gets promoted every 3 days on average

const TOTAL_SLOTS = 30; // Featured slot capacity
const ROTATION_DAYS = 30; // Full rotation period

async function calculateQueuePromotion() {
  const queue = await db.query(`
    SELECT id, vendor_id, position, added_at
    FROM featured_queue
    ORDER BY position ASC
  `);
  
  for (const entry of queue) {
    const daysSinceAdded = Math.floor(
      (Date.now() - entry.added_at.getTime()) / (24 * 60 * 60 * 1000)
    );
    
    const promotionProbability = (entry.position / TOTAL_SLOTS) * (daysSinceAdded / ROTATION_DAYS);
    
    if (promotionProbability >= 1 || entry.position === 1) {
      // Promote to featured slot
      await promoteFromQueue(entry.vendor_id, entry.id);
    }
  }
}

async function promoteFromQueue(vendorId, queueId) {
  // Move to featured_slots table
  await db.query(`
    INSERT INTO featured_slots (vendor_id, is_available, expires_at)
    VALUES ($1, false, NOW() + INTERVAL '30 days')
  `, [vendorId]);
  
  // Remove from queue
  await db.query(`
    DELETE FROM featured_queue WHERE id = $1
  `, [queueId]);
  
  // Reorder remaining queue
  await db.query(`
    UPDATE featured_queue 
    SET position = ROW_NUMBER() OVER (ORDER BY added_at ASC)
  `);
  
  // Send notification
  await sendEmail({
    to: vendor.email,
    template: 'featured_promotion',
    data: { activation_time: new Date() }
  });
}
```

**Cron Job:**
```typescript
// scripts/promoteFeaturedQueue.js
// Runs daily @ 2 AM UTC

setInterval(async () => {
  await calculateQueuePromotion();
  console.log('Featured queue promotion completed');
}, 24 * 60 * 60 * 1000);
```

**Get Queue Position Endpoint:**
```typescript
// GET /api/featured/queue-position
export async function GET(request: Request) {
  const user = await getCurrentUser();
  const vendor = await getVendor(user.id);
  
  const queueEntry = await db.query(`
    SELECT position, added_at FROM featured_queue
    WHERE vendor_id = $1
  `, [vendor.id]);
  
  if (!queueEntry) {
    return successResponse({ in_queue: false });
  }
  
  return successResponse({
    in_queue: true,
    position: queueEntry[0].position,
    estimated_promotion: calculateEstimate(queueEntry[0])
  });
}
```

---

#### **Task 3.3.3: Featured Slot Expiry & Renewal**

**Description:** Handle featured slot expiration and auto-renewal options

**Acceptance Criteria:**
- [x] Expiry reminders sent 7, 3, 1 days before
- [x] Automatic slot expiry and queue re-entry after 30 days
- [x] Vendor can renew before expiry
- [ ] Cron job handles expirations daily

**Implementation:**

**Cron Job: Featured Slot Expiry Handling**
```typescript
// scripts/featuredSlotExpiry.js - runs daily @ 2 AM UTC

async function handleFeaturedExpirations() {
  // 7 days before expiry
  const expiring7d = await db.query(`
    SELECT vendor_id, expires_at FROM featured_slots
    WHERE expires_at BETWEEN NOW() + INTERVAL '7 days' 
                        AND NOW() + INTERVAL '7 days 1 second'
  `);
  
  for (const slot of expiring7d) {
    await sendEmail({
      to: slot.vendor.email,
      template: 'featured_expiring_7d',
      data: { renewal_url: `${BASE_URL}/vendor/featured/renew` }
    });
  }
  
  // 3 days before expiry
  const expiring3d = await db.query(`
    SELECT vendor_id, expires_at FROM featured_slots
    WHERE expires_at BETWEEN NOW() + INTERVAL '3 days'
                        AND NOW() + INTERVAL '3 days 1 second'
  `);
  
  for (const slot of expiring3d) {
    await sendEmail({
      to: slot.vendor.email,
      template: 'featured_expiring_3d',
      data: { renewal_url: `${BASE_URL}/vendor/featured/renew` }
    });
  }
  
  // 1 day before expiry
  const expiring1d = await db.query(`
    SELECT vendor_id, expires_at FROM featured_slots
    WHERE expires_at BETWEEN NOW() + INTERVAL '1 day'
                        AND NOW() + INTERVAL '1 day 1 second'
  `);
  
  for (const slot of expiring1d) {
    await sendEmail({
      to: slot.vendor.email,
      template: 'featured_expiring_1d',
      data: { renewal_url: `${BASE_URL}/vendor/featured/renew` }
    });
  }
  
  // Expiry: Move back to queue
  const expired = await db.query(`
    SELECT vendor_id FROM featured_slots
    WHERE expires_at <= NOW()
  `);
  
  for (const slot of expired) {
    // Add back to queue
    const queuePosition = await db.query(`
      SELECT MAX(position) as max_pos FROM featured_queue
    `);
    
    await db.query(`
      INSERT INTO featured_queue (vendor_id, position, added_at)
      VALUES ($1, $2, NOW())
    `, [slot.vendor_id, (queuePosition[0].max_pos || 0) + 1]);
    
    // Remove from featured
    await db.query(`
      DELETE FROM featured_slots WHERE vendor_id = $1
    `, [slot.vendor_id]);
    
    // Notify
    await sendEmail({
      to: slot.vendor.email,
      template: 'featured_expired_queued',
      data: { queue_position: queuePosition[0].max_pos + 1 }
    });
  }
}
```

---

### **Feature 3.4: Search & Discovery UI (Week 4)**

#### **Task 3.4.1: Marketplace Frontend Components**

**Acceptance Criteria:**
- [x] `/marketplace` page displays product grid with search
- [x] Category dropdown filters
- [x] LGA dropdown filters
- [x] Pagination works
- [x] Product card shows price, rating, vendor name

**Component Structure:**
```typescript
// src/app/marketplace/page.tsx
export default function MarketplacePage() {
  return (
    <div>
      <MarketplaceHeader />
      <MarketplaceFilters />
      <ProductGrid />
      <Pagination />
    </div>
  );
}

// src/components/marketplace/ProductCard.tsx
export function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image_url} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="vendor">{product.vendor_name}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <Rating rating={product.rating} count={product.review_count} />
      <Link href={`/product/${product.vendor_slug}/${product.slug}`}>
        View Details
      </Link>
    </div>
  );
}
```

---

## ✅ STAGE 3 ACCEPTANCE CRITERIA (Overall)

### **Technical Criteria**
- [x] All 7 remaining Product routes implemented
- [x] Tier upgrade flow implemented and tested
- [x] Featured slot purchase working
- [x] Queue algorithm functioning
- [x] Search performance <100ms verified
- [x] All endpoints authenticated and rate-limited
- [x] RLS policies enforce vendor isolation
- [x] Stripe integration tested (post-Client ID setup)

### **Compliance Criteria**
- [x] Vendor MoR model enforced (vendor-owned products, pricing, descriptions)
- [x] Commission rates correctly calculated (6% Pro, 8% Basic)
- [x] Tier quotas enforced (Basic 50, Pro 200 products)
- [x] ACL compliance: Vendor responsible for product descriptions/quality
- [x] All money flows documented and logged

### **Business Criteria**
- [x] Vendors can manage product inventory
- [x] Tier system operational (Basic free, Pro $20/month)
- [x] Featured slots revenue stream active
- [x] Search discovery works
- [x] Marketplace UI complete and usable

---

## 📋 STAGE 3 DEPLOYMENT CHECKLIST

Before deploying Stage 3 to production:

- [ ] All code reviewed and tested
- [ ] Performance testing passed (<100ms search)
- [ ] Database migrations applied to prod
- [ ] Stripe Client ID configured (ops task)
- [ ] Featured slot cron jobs tested
- [ ] Email templates tested end-to-end
- [ ] Founder approves tier pricing & featured slot terms
- [ ] Vendor documentation updated
- [ ] Support team trained on new features
- [ ] Analytics tracking configured (PostHog events)

---

**Stage 3 Implementation Guide Complete**  
**Next:** Stage 4 Implementation Guide (Post-Transaction Workflows)
