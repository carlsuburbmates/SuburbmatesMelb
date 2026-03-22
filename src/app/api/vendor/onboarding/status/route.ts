import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * API Route: GET /api/vendor/onboarding/status
 * 
 * Checks the current onboarding status of a vendor.
 * Following SSOT v2 Phase 1, Stripe Connect is non-mandatory/deprecated for discovery.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid authentication" }, { status: 401 });
    }

    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (vendorError || !vendor) {
      return NextResponse.json({
        status: "not_started",
        message: "No vendor account found",
        next_step: "create_vendor",
      });
    }

    // SSOT v2: All vendors with a record are considered onboarded for discovery
    return NextResponse.json({
      status: "completed",
      message: "Vendor onboarding completed (Discovery Mode)",
      next_step: "start_listing",
      charges_enabled: true, // Mocked for legacy frontend consistency
    });
  } catch (error) {
    console.error("Error checking vendor onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}

/**
 * API Route: POST /api/vendor/onboarding/start
 * 
 * Disabled in SSOT v2 Discovery Mode.
 */
export async function POST() {
  return NextResponse.json({
    status: "completed",
    message: "Stripe Connect onboarding is no longer required for this marketplace tier.",
  });
}

/**
 * API Route: PUT /api/vendor/onboarding/status
 * 
 * Disabled in SSOT v2 Discovery Mode.
 */
export async function PUT() {
  return NextResponse.json(
    { error: "Stripe features are disabled in Discovery Mode." },
    { status: 403 }
  );
}
