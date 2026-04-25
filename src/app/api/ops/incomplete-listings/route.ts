import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendIncompleteListingEmail } from "@/lib/email";

const FIELD_LABELS: Record<string, string> = {
  profile_description: "Profile description",
  profile_image_url: "Profile photo",
  category_id: "Creator category",
  primary_region_id: "Region",
};

interface ProfileWithVendor {
  id: string;
  business_name: string;
  profile_description: string | null;
  profile_image_url: string | null;
  category_id: number | null;
  primary_region_id: number | null;
  user_id: string;
  users: { email: string | null } | { email: string | null }[];
}

export async function GET(req: Request) {
  try {
    if (!process.env.CRON_SECRET) {
      console.error("[ops/incomplete-listings] CRON_SECRET not set");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    if (!supabaseAdmin) {
      console.error("[ops/incomplete-listings] supabaseAdmin unavailable");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from("business_profiles")
      .select(`
        id,
        business_name,
        profile_description,
        profile_image_url,
        category_id,
        user_id,
        users ( email )
      `)
      .eq("is_public", true);

    if (fetchError) throw fetchError;
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ success: true, checked: 0, nudged: 0 });
    }

    const userIds = Array.from(
      new Set(
        profiles
          .map((p) => p.user_id)
          .filter((userId): userId is string => typeof userId === "string" && userId.length > 0)
      )
    );
    const { data: vendors, error: vendorError } = await supabaseAdmin
      .from("vendors")
      .select("user_id, primary_region_id")
      .in("user_id", userIds);

    if (vendorError) throw vendorError;

    const regionByUserId = new Map<string, number | null>();
    (vendors ?? []).forEach((vendor) => {
      if (vendor.user_id) {
        regionByUserId.set(vendor.user_id, vendor.primary_region_id);
      }
    });

    const typedProfiles = profiles.map((profile) => ({
      ...(profile as unknown as Omit<ProfileWithVendor, "primary_region_id">),
      primary_region_id: regionByUserId.get(profile.user_id) ?? null,
    })) as ProfileWithVendor[];

    let checked = 0;
    let nudged = 0;
    const errors: { profile_id: string; error: string }[] = [];

    for (const profile of typedProfiles) {
      checked++;

      const missing = (
        Object.keys(FIELD_LABELS) as Array<keyof typeof FIELD_LABELS>
      ).filter((field) => {
        const val = profile[field as keyof ProfileWithVendor];
        return val === null || val === undefined;
      });

      if (missing.length === 0) continue;

      const missingLabels = missing.map((f) => FIELD_LABELS[f]);

      try {
        const user = profile.users
          ? Array.isArray(profile.users)
            ? profile.users[0]
            : profile.users
          : null;

        if (user?.email) {
          await sendIncompleteListingEmail(
            user.email,
            profile.business_name || "Creator",
            missingLabels
          );
          nudged++;
        }
      } catch (emailErr) {
        const errMsg =
          emailErr instanceof Error ? emailErr.message : String(emailErr);
        console.warn(
          `[ops/incomplete-listings] Email failed for profile ${profile.id}:`,
          emailErr
        );
        errors.push({ profile_id: profile.id, error: errMsg });
      }
    }

    return NextResponse.json({
      success: true,
      checked,
      nudged,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error("[ops/incomplete-listings] Failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}
