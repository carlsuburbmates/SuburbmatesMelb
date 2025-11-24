import "./env";
import { randomUUID } from "node:crypto";
import { TIER_LIMITS, type VendorTier } from "@/lib/constants";
import { getSupabaseAdminClient, createSupabaseAnonClient } from "./supabase";

interface CreateVendorOptions {
  tier?: VendorTier;
  productCount?: number;
  lgaId?: number;
}

export interface VendorFixture {
  userId: string;
  vendorId: string;
  businessId: string;
  email: string;
  password: string;
  token: string;
}

const TEST_STRIPE_ACCOUNT_ID =
  process.env.PLAYWRIGHT_STRIPE_ACCOUNT_ID || "acct_1SWef9PwC4EEv8iK";

export async function createVendorFixture(
  options: CreateVendorOptions = {}
): Promise<VendorFixture> {
  const tier: VendorTier = options.tier ?? "pro";
  const productCount = options.productCount ?? 0;
  const lgaId = options.lgaId ?? 17;

  const admin = getSupabaseAdminClient();
  const email = `playwright-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;
  const password = `Pw-${Math.random().toString(36).slice(2, 10)}!Aa1`;

  const { data: createdUser, error: createUserError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  if (createUserError || !createdUser?.user?.id) {
    throw createUserError || new Error("Unable to create Supabase auth user");
  }
  const userId = createdUser.user.id;

  const { error: upsertUserError } = await admin.from("users").upsert({
    id: userId,
    email,
    user_type: "vendor",
  });
  if (upsertUserError) {
    throw upsertUserError;
  }

  const businessId = randomUUID();
  const { error: insertProfileError } = await admin
    .from("business_profiles")
    .insert({
      id: businessId,
      user_id: userId,
      business_name: `Playwright Vendor ${businessId.slice(0, 6)}`,
      slug: `playwright-vendor-${businessId.slice(0, 8)}`,
      vendor_status: "active",
      vendor_tier: tier,
      is_vendor: true,
      suburb_id: lgaId,
    });
  if (insertProfileError) {
    throw insertProfileError;
  }

  const vendorId = randomUUID();
  const tierLimits = TIER_LIMITS[tier] ?? TIER_LIMITS.basic;
  const { error: insertVendorError } = await admin.from("vendors").insert({
    id: vendorId,
    user_id: userId,
    business_name: `Playwright Vendor ${businessId.slice(0, 6)}`,
    vendor_status: "active",
    can_sell_products: true,
    is_vendor: true,
    tier,
    stripe_account_id: TEST_STRIPE_ACCOUNT_ID,
    stripe_account_status: "active",
    stripe_onboarding_complete: true,
    product_quota: tierLimits.product_quota,
    commission_rate: tierLimits.commission_rate,
    primary_lga_id: lgaId,
    product_count: 0,
  });
  if (insertVendorError) {
    throw insertVendorError;
  }

  const anon = createSupabaseAnonClient();
  const { data: sessionData, error: signInError } =
    await anon.auth.signInWithPassword({ email, password });
  if (signInError || !sessionData.session?.access_token) {
    throw signInError || new Error("Failed to sign in as test vendor");
  }
  const token = sessionData.session.access_token;

  if (productCount > 0) {
    const now = Date.now();
    const products = Array.from({ length: productCount }).map((_, index) => ({
      id: randomUUID(),
      vendor_id: vendorId,
      title: `Playwright Product ${index + 1}`,
      slug: `playwright-product-${businessId.slice(0, 4)}-${index + 1}`,
      description: `QA product ${index + 1} description`,
      price: 1000 + index * 100,
      category: null,
      thumbnail_url: null,
      images: [],
      published: true,
      created_at: new Date(now + index * 1000).toISOString(),
      updated_at: new Date(now + index * 1000).toISOString(),
    }));
    const { error: productError } = await admin.from("products").insert(products);
    if (productError) {
      throw productError;
    }
    await admin
      .from("vendors")
      .update({ product_count: productCount })
      .eq("id", vendorId);
  }

  return {
    userId,
    vendorId,
    businessId,
    email,
    password,
    token,
  };
}

export async function cleanupVendorFixture(
  fixture: VendorFixture
): Promise<void> {
  const admin = getSupabaseAdminClient();
  await admin.from("products").delete().eq("vendor_id", fixture.vendorId);
  await admin.from("vendors").delete().eq("id", fixture.vendorId);
  await admin
    .from("business_profiles")
    .delete()
    .eq("id", fixture.businessId);
  await admin.from("users").delete().eq("id", fixture.userId);
  await admin.auth.admin.deleteUser(fixture.userId);
}
