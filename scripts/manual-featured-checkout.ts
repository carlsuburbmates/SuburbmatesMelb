import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient, type Session, type User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import Stripe from "stripe";

config({ path: path.join(process.cwd(), ".env.local") });

let FeaturedSlotsPost:
  | typeof import("../src/app/api/vendor/featured-slots/route").POST
  | null = null;
let StripeWebhookPost:
  | typeof import("../src/app/api/webhooks/stripe/route").POST
  | null = null;

async function ensureRouteHandlers() {
  if (!FeaturedSlotsPost) {
    const mod = await import("../src/app/api/vendor/featured-slots/route");
    FeaturedSlotsPost = mod.POST;
  }
  if (!StripeWebhookPost) {
    const mod = await import("../src/app/api/webhooks/stripe/route");
    StripeWebhookPost = mod.POST;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase configuration");
}
if (!STRIPE_SECRET || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing Stripe configuration");
}

process.env.FEATURED_SLOT_CHECKOUT_MODE = "mock";

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    detectSessionInUrl: false,
    persistSession: false,
    autoRefreshToken: false,
  },
});

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    detectSessionInUrl: false,
    persistSession: false,
    autoRefreshToken: false,
  },
});

type VendorContext = {
  user: User;
  session: Session;
  vendorId: string;
  businessProfileId: string;
  lgaId: number;
};

async function ensureVendorUser(): Promise<VendorContext> {
  const email =
    process.env.QA_VENDOR_EMAIL || "qa-featured-vendor@example.com";
  const password = process.env.QA_VENDOR_PASSWORD || "FeatureTest123!";
  let user: User | null = null;
  let session: Session | null = null;

  async function signIn() {
    const signin = await anonClient.auth.signInWithPassword({
      email,
      password,
    });
    if (signin.error) {
      return { error: signin.error };
    }
    user = signin.data.user;
    session = signin.data.session;
    return {};
  }

  const attempt = await signIn();
  if (attempt.error) {
    if (
      attempt.error.message.toLowerCase().includes("invalid login credentials")
    ) {
      const created = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (created.error || !created.data.user) {
        throw created.error || new Error("Failed to create QA vendor user");
      }
      const retry = await signIn();
      if (retry.error) {
        throw retry.error;
      }
    } else {
      throw attempt.error;
    }
  }

  if (!user || !session) {
    throw new Error("Unable to obtain Supabase session for QA vendor");
  }

  const authUser = user as User;
  const authSession = session as Session;

  await adminClient.from("users").upsert(
    {
      id: authUser.id,
      email: authUser.email ?? email,
      user_type: "vendor",
    },
    { onConflict: "id" }
  );

  const { data: melbourne } = await adminClient
    .from("lgas")
    .select("id")
    .eq("name", "Melbourne")
    .maybeSingle();
  if (!melbourne?.id) {
    throw new Error("Missing Melbourne LGA record");
  }

  const slug = `qa-featured-${authUser.id.slice(0, 8)}`;
  const profileRes = await adminClient
    .from("business_profiles")
    .upsert(
      {
        user_id: authUser.id,
        business_name: "QA Featured Vendor",
        slug,
        vendor_status: "active",
        vendor_tier: "pro",
        is_vendor: true,
        suburb_id: melbourne.id,
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .maybeSingle();

  if (profileRes.error || !profileRes.data) {
    throw profileRes.error || new Error("Failed to upsert business profile");
  }

  const existingVendor = await adminClient
    .from("vendors")
    .select("id")
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (existingVendor.error) {
    throw existingVendor.error;
  }

  let vendorId = existingVendor.data?.id ?? null;
  const vendorPayload = {
    user_id: authUser.id,
    business_name: "QA Featured Vendor",
    vendor_status: "active",
    can_sell_products: true,
    is_vendor: true,
    tier: "pro",
    stripe_account_id: "acct_mock_featured",
    stripe_account_status: "verified",
    stripe_onboarding_complete: true,
    product_quota: 50,
    storage_quota_gb: 10,
    commission_rate: 0.05,
    primary_lga_id: melbourne.id,
  };

  if (vendorId) {
    const update = await adminClient
      .from("vendors")
      .update(vendorPayload)
      .eq("id", vendorId)
      .select("id")
      .maybeSingle();
    if (update.error || !update.data) {
      throw update.error || new Error("Failed to update vendor");
    }
    vendorId = update.data.id;
  } else {
    const insert = await adminClient
      .from("vendors")
      .insert(vendorPayload)
      .select("id")
      .maybeSingle();
    if (insert.error || !insert.data) {
      throw insert.error || new Error("Failed to insert vendor");
    }
    vendorId = insert.data.id;
  }

  return {
    user: authUser,
    session: authSession,
    vendorId,
    businessProfileId: profileRes.data.id,
    lgaId: melbourne.id,
  };
}

async function runFeaturedSlotFlow() {
  await ensureRouteHandlers();
  if (!FeaturedSlotsPost || !StripeWebhookPost) {
    throw new Error("Route handlers unavailable");
  }
  const vendor = await ensureVendorUser();
  const requestBody = {
    suburb: "Richmond",
    lga_id: vendor.lgaId,
  };

  const req = new NextRequest(
    "http://localhost/api/vendor/featured-slots",
    {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        authorization: `Bearer ${vendor.session.access_token}`,
      }),
      body: JSON.stringify(requestBody),
    }
  );

  const reservationResponse = await FeaturedSlotsPost(req);
  const reservationData = await reservationResponse.json();
  if (!reservationData.success) {
    throw new Error(
      `Reservation failed: ${JSON.stringify(reservationData.error)}`
    );
  }

  const reservedSlotId = reservationData.data.reservedSlotId as string | null;
  const sessionId = reservationData.data.sessionId as string | null;

  if (!reservedSlotId || !sessionId) {
    throw new Error("Reservation did not return slot or session id");
  }

  const paymentIntentId = `pi_mock_${Date.now()}`;
  const eventPayload = {
    id: `evt_mock_${randomUUID()}`,
    type: "checkout.session.completed",
    data: {
      object: {
        id: sessionId,
        amount_total: 9900,
        payment_intent: paymentIntentId,
        metadata: {
          vendor_id: vendor.vendorId,
          business_profile_id: vendor.businessProfileId,
          type: "featured_slot",
          reserved_slot_id: reservedSlotId,
        },
      },
    },
  };

  const payloadString = JSON.stringify(eventPayload);
  const header = Stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: STRIPE_WEBHOOK_SECRET,
  });

  const webhookReq = new NextRequest(
    "http://localhost/api/webhooks/stripe",
    {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        "stripe-signature": header,
      }),
      body: payloadString,
    }
  );

  const webhookResponse = await StripeWebhookPost(webhookReq);
  const webhookData = await webhookResponse.json();

  const slotRecord = await adminClient
    .from("featured_slots")
    .select("id,status,stripe_payment_intent_id,start_date,end_date,lga_id")
    .eq("id", reservedSlotId)
    .maybeSingle();

  if (slotRecord.error || !slotRecord.data) {
    throw slotRecord.error || new Error("Unable to fetch reserved slot");
  }

  const report = {
    timestamp: new Date().toISOString(),
    vendorEmail: vendor.user.email,
    vendorId: vendor.vendorId,
    businessProfileId: vendor.businessProfileId,
    lgaId: vendor.lgaId,
    reservationResponse: reservationData,
    webhookResponse: webhookData,
    slotRecord: slotRecord.data,
  };

  const reportDir = path.join(process.cwd(), "reports");
  const reportPath = path.join(
    reportDir,
    `featured-slot-qa-${Date.now()}.md`
  );
  const markdown = [
    "# Featured Slot Checkout QA",
    `- Timestamp: ${report.timestamp}`,
    `- Vendor Email: ${report.vendorEmail}`,
    `- Vendor ID: ${report.vendorId}`,
    `- Business Profile ID: ${report.businessProfileId}`,
    `- Reserved Slot ID: ${reservedSlotId}`,
    `- Checkout Session ID: ${sessionId}`,
    `- Slot Status After Webhook: ${slotRecord.data.status}`,
    "",
    "```json",
    JSON.stringify(report, null, 2),
    "```",
    "",
  ].join("\n");
  fs.writeFileSync(reportPath, markdown, "utf8");
  console.log(`QA completed. Report written to ${reportPath}`);
}

runFeaturedSlotFlow().catch((err) => {
  console.error("QA script failed", err);
  process.exit(1);
});
