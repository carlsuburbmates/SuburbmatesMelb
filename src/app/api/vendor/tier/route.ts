import { requireAuth } from "@/app/api/_utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { TIER_LIMITS, VendorTier } from "@/lib/constants";
import { enforceTierProductCap, getDowngradePreview } from "@/lib/vendor-downgrade";
import { sendTierDowngradeEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const TIER_PRIORITY: Record<string, number> = {
  premium: 0,
  pro: 1,
  basic: 2,
  none: 3,
  suspended: 4,
};

function tierWeight(tier?: string | null) {
  if (!tier) return 10;
  return TIER_PRIORITY[tier] ?? 10;
}

function resolveTierConfig(tier: VendorTier) {
  return TIER_LIMITS[tier];
}

type VendorRecord = Database["public"]["Tables"]["vendors"]["Row"];

async function fetchVendorRecord(
  dbClient: SupabaseClient<Database>,
  userId: string
): Promise<VendorRecord> {
  const { data, error } = await dbClient
    .from("vendors")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Vendor account required");
  }

  if (data.vendor_status && data.vendor_status !== "active") {
    throw new Error("Vendor account is not active");
  }

  return data;
}

export async function GET(req: NextRequest) {
  try {
    const authContext = await requireAuth(req);
    const vendor = await fetchVendorRecord(
      authContext.dbClient,
      authContext.user.id
    );

    const target = req.nextUrl.searchParams.get("target") as VendorTier | null;
    let preview = null;

    if (target && TIER_LIMITS[target]) {
      preview = await getDowngradePreview(vendor.id, target);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          tier: vendor.tier,
          product_quota: vendor.product_quota,
          target,
          preview,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load tier information";
    logger.error("tier_info_error", { error });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TIER_INFO_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authContext = await requireAuth(req);
    const vendor = await fetchVendorRecord(
      authContext.dbClient,
      authContext.user.id
    );

    const body = await req.json();
    const targetTier = (body?.tier || "").toLowerCase();
    const oldTier = vendor.tier || "basic";
    const vendorEmail = authContext.user.email;
    const businessName = vendor.business_name || "Your business";

    if (!targetTier || !TIER_LIMITS[targetTier as VendorTier]) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TIER",
            message: "Tier must be one of: basic, pro, premium",
          },
        },
        { status: 400 }
      );
    }

    if (vendor.tier === targetTier) {
      return NextResponse.json(
        {
          success: true,
          data: {
            tier: vendor.tier,
            product_quota: vendor.product_quota,
            unpublishedCount: 0,
          },
        },
        { status: 200 }
      );
    }

    const config = resolveTierConfig(targetTier as VendorTier);
    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNSUPPORTED_TIER",
            message: "Tier not supported",
          },
        },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {
      tier: targetTier,
      product_quota: config.product_quota,
      commission_rate: config.commission_rate,
      can_sell_products: config.can_sell,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await authContext.dbClient
      .from("vendors")
      .update(updates)
      .eq("id", vendor.id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    let unpublishedCount = 0;
    const isDowngrade = tierWeight(targetTier) > tierWeight(vendor.tier);

    if (isDowngrade) {
      const result = await enforceTierProductCap(
        vendor.id,
        targetTier as VendorTier
      );
      unpublishedCount = result.unpublishedCount;
      if (unpublishedCount > 0 && vendorEmail) {
        void sendTierDowngradeEmail({
          to: vendorEmail,
          businessName,
          oldTier,
          newTier: targetTier,
          unpublishedCount,
          productTitles:
            result.unpublishedProducts?.map((p) => p.title || "Untitled product") || [],
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          tier: targetTier,
          product_quota: data?.product_quota ?? config.product_quota,
          unpublishedCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to change tier";
    logger.error("tier_change_error", { error });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TIER_CHANGE_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
