import { requireAuth } from "@/app/api/_utils/auth";
import { TIER_LIMITS } from "@/lib/constants";
import type { Database } from "@/lib/database.types";
import { stripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

type VendorInsert = Database["public"]["Tables"]["vendors"]["Insert"];

function resolveTierDefaults(tier: string, abnVerified: boolean) {
  if (tier === "pro") {
    return {
      productQuota: TIER_LIMITS.pro.product_quota,
      commissionRate: TIER_LIMITS.pro.commission_rate,
      canSell: TIER_LIMITS.pro.can_sell,
    };
  }
  const quota = abnVerified ? 10 : TIER_LIMITS.basic.product_quota;
  return {
    productQuota: quota,
    commissionRate: TIER_LIMITS.basic.commission_rate,
    canSell: TIER_LIMITS.basic.can_sell,
  };
}

/**
 * API Route: POST /api/auth/create-vendor
 *
 * Creates a vendor account and initiates Stripe Connect onboarding
 * This is the entry point for vendor onboarding flow
 */

export async function POST(request: NextRequest) {
  try {
    const authContext = await requireAuth(request);
    const { user, dbClient } = authContext;

    const { business_name, tier = "basic" } = await request.json();

    if (!business_name) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    // Check if user already has a vendor account
    const { data: existingVendor, error } = await dbClient
      .from("vendors")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && existingVendor) {
      return NextResponse.json(
        { error: "User already has a vendor account" },
        { status: 409 }
      );
    }

    // Create Stripe Connect account
    const stripeAccount = await stripe.accounts.create({
      type: "standard",
      country: "AU",
      email: user.email,
      business_type: "individual",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      settings: {
        payouts: {
          schedule: {
            interval: "manual",
          },
        },
      },
    });

    const tierDefaults = resolveTierDefaults(tier, false);

    const vendorPayload: VendorInsert = {
      user_id: user.id,
      tier,
      business_name,
      stripe_account_id: stripeAccount.id,
      stripe_account_status: "pending",
      vendor_status: "active",
      can_sell_products: tierDefaults.canSell,
      abn_verified: false,
      product_quota: tierDefaults.productQuota,
      commission_rate: tierDefaults.commissionRate,
      stripe_onboarding_complete: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Create vendor record in database
    const { data: vendor, error: insertError } = await dbClient
      .from("vendors")
      .insert(vendorPayload)
      .select()
      .single();

    if (insertError) {
      // Clean up Stripe account if database insertion fails
      await stripe.accounts.del(stripeAccount.id);
      throw insertError;
    }

    // Create Stripe Connect account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccount.id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/vendor/onboarding?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/vendor/onboarding?success=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      message: "Vendor account created successfully",
      vendor_id: vendor?.id ?? null,
      stripe_account_id: stripeAccount.id,
      onboarding_url: accountLink.url,
      requires_payment: tier === "pro",
    });
  } catch (error) {
    logger.error("Error creating vendor", error);
    return NextResponse.json(
      { error: "Failed to create vendor account" },
      { status: 500 }
    );
  }
}
