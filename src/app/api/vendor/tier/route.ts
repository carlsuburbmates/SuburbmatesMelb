import { requireAuth } from "@/app/api/_utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Tier Management Route (Legacy/SSOT v2)
 * We treat all vendors as 'basic' for now as we transition to non-mandatory Stripe.
 */

export async function GET(req: NextRequest) {
  try {
    const authContext = await requireAuth(req);
    
    // Fetch vendor basically to check existence
    const { data: vendor, error } = await authContext.dbClient
      .from("vendors")
      .select("id, product_quota")
      .eq("user_id", authContext.user.id)
      .maybeSingle();

    if (error || !vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        tier: "basic",
        product_quota: vendor.product_quota ?? 12,
        status: "active"
      }
    });
  } catch (error) {
    logger.error("tier_get_error", { error });
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH() {
  // Tier changes are disabled in Discovery Mode
  return NextResponse.json({
    success: true,
    message: "Tier management is disabled in Discovery Mode. All accounts are currently using the Basic tier."
  });
}
