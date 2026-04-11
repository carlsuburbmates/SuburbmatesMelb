import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendClaimOutcomeEmail } from "@/lib/email";

interface ClaimStatusPayload {
  claim_id: string;
  vendor_id: string;
  business_profile_id: string;
  status: "approved" | "rejected" | "more_info";
  admin_notes?: string | null;
}

export async function POST(req: Request) {
  try {
    if (!process.env.CRON_SECRET) {
      console.error("[webhooks/claim-status] CRON_SECRET not set");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    if (!supabaseAdmin) {
      console.error("[webhooks/claim-status] supabaseAdmin unavailable");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: ClaimStatusPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { claim_id, vendor_id, business_profile_id, status, admin_notes } = body;

    if (!claim_id || !vendor_id || !business_profile_id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validStatuses = ["approved", "rejected", "more_info"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const { data: vendorData, error: vendorError } = await supabaseAdmin
      .from("vendors")
      .select("business_name, users ( email )")
      .eq("id", vendor_id)
      .single();

    if (vendorError || !vendorData) {
      console.error("[webhooks/claim-status] Vendor lookup failed:", vendorError);
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const vendorTyped = vendorData as unknown as {
      business_name: string | null;
      users: { email: string | null } | { email: string | null }[];
    };

    const user = Array.isArray(vendorTyped.users)
      ? vendorTyped.users[0]
      : vendorTyped.users;

    if (!user?.email) {
      console.warn(`[webhooks/claim-status] No email for vendor ${vendor_id}`);
      return NextResponse.json({ success: false, reason: "No email address found" });
    }

    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("business_profiles")
      .select("business_name")
      .eq("id", business_profile_id)
      .single();

    if (profileError || !profileData) {
      console.error("[webhooks/claim-status] Profile lookup failed:", profileError);
      return NextResponse.json({ error: "Business profile not found" }, { status: 404 });
    }

    const emailResult = await sendClaimOutcomeEmail(
      user.email,
      vendorTyped.business_name || "Creator",
      profileData.business_name || "your listing",
      status,
      admin_notes ?? undefined
    );

    if (!emailResult.success) {
      console.error(`[webhooks/claim-status] Email failed for claim ${claim_id}:`, emailResult.error);
      return NextResponse.json({ success: false, error: emailResult.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, claim_id, status, email_id: emailResult.id });

  } catch (error) {
    console.error("[webhooks/claim-status] Failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}
