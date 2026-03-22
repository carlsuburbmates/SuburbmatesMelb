import { requireAuth } from "@/app/api/_utils/auth";
import type { Database } from "@/lib/database.types";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

type VendorInsert = Database["public"]["Tables"]["vendors"]["Insert"];

/**
 * API Route: POST /api/auth/create-vendor
 *
 * Creates a vendor account.
 * This is the entry point for vendor onboarding flow.
 */

export async function POST(request: NextRequest) {
  try {
    const authContext = await requireAuth(request);
    const { user, dbClient } = authContext;

    const { business_name } = await request.json();

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

    const vendorPayload: VendorInsert = {
      user_id: user.id,
      business_name,
      abn_verified: false,
      product_count: 0
    };

    // Create vendor record in database
    const { data: vendor, error: insertError } = await dbClient
      .from("vendors")
      .insert(vendorPayload)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      message: "Vendor account created successfully",
      vendor_id: vendor?.id ?? null,
      onboarding_url: `${process.env.NEXT_PUBLIC_SITE_URL}/vendor/dashboard`,
    });
  } catch (error) {
    logger.error("Error creating vendor", error);
    return NextResponse.json(
      { error: "Failed to create vendor account" },
      { status: 500 }
    );
  }
}
