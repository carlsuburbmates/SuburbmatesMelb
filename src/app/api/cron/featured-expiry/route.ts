import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendFeaturedSlotExpiryEmail } from "@/lib/email";
import { FEATURED_SLOT } from "@/lib/constants";

// Admin client for cron jobs (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    if (!process.env.CRON_SECRET) {
      console.error("[CRITICAL] CRON_SECRET is not set");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    // Calculate target expiry range: 3 days from now
    // We want to catch any expiring within the "3rd day" window roughly
    // Or exactly 3 days ahead.
    // Let's look for expiry_date between [now + 3d, now + 3d + 24h] if running daily.
    // Simpler: > now + 3d AND < now + 3d + 1h? No, cron might run anytime.
    // Best practice: Store last_reminded_at. But we can't change schema easily.
    // Alternative: Check if expiry is between start of day + 3d and end of day + 3d.

    // Let's assume this runs once a day at 9am.
    // We notify for slots expiring on the date "Today + 3 days".

    const reminderDays = FEATURED_SLOT.EXPIRY_REMINDER_DAYS || 3;
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + reminderDays);

    // Start of target day (00:00:00)
    const startOfTargetDay = new Date(targetDate.setHours(0, 0, 0, 0)).toISOString();
    // End of target day (23:59:59)
    const endOfTargetDay = new Date(targetDate.setHours(23, 59, 59, 999)).toISOString();

    const { data: slots, error } = await supabaseAdmin
      .from("featured_slots")
      .select(`
        id,
        end_date,
        suburb_label,
        vendor_id,
        vendors (
          business_name,
          user_id,
          users (
            email
          )
        )
      `)
      .eq("status", "active")
      .gte("end_date", startOfTargetDay)
      .lte("end_date", endOfTargetDay);

    if (error) {
      throw error;
    }

    if (!slots || slots.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No slots expiring in 3 days" });
    }

    let sentCount = 0;
    const errors: { id: string; error: unknown }[] = [];

    // Parallel send (could use batch but logic is custom per user)
    await Promise.all(slots.map(async (slot) => {
      try {
        // Access slot.vendors, as any join result can be complex in types
        const vendors = slot.vendors as unknown;
        const vendor = (Array.isArray(vendors) ? vendors[0] : vendors) as {
          business_name: string | null;
          user_id: string;
          users: { email: string | null }[] | { email: string | null } | null;
        };

        const users = vendor?.users;
        const user = Array.isArray(users) ? users[0] : users;

        if (!vendor || !user || !user.email) {
          console.warn(`Skipping slot ${slot.id}: No vendor email found`);
          return;
        }

        const email = user.email;
        const businessName = vendor.business_name || "Vendor";
        const suburb = slot.suburb_label || "Featured Suburb";

        const result = await sendFeaturedSlotExpiryEmail(
          email,
          businessName,
          suburb,
          slot.end_date,
          reminderDays
        );

        if (result.success) {
          sentCount++;
        } else {
          errors.push({ id: slot.id, error: result.error });
        }
      } catch (e) {
        errors.push({ id: slot.id, error: e });
      }
    }));

    return NextResponse.json({
      success: true,
      processed: slots.length,
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Cron failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}
