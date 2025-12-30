import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendFeaturedSlotExpiryEmail } from "@/lib/email";

// Admin client for cron jobs (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REMINDER_WINDOWS = [7, 2];

interface SlotWithVendor {
  id: string;
  end_date: string;
  suburb_label: string | null;
  vendor_id: string;
  vendors: {
    business_name: string | null;
    user_id: string;
    users: {
      email: string | null;
    } | {
      email: string | null;
    }[];
  } | {
    business_name: string | null;
    user_id: string;
    users: {
      email: string | null;
    } | {
      email: string | null;
    }[];
  }[];
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    let totalProcessed = 0;
    let totalSent = 0;
    const errors: { slot_id: string; window: number; error: string | null | unknown }[] = [];

    for (const daysBefore of REMINDER_WINDOWS) {
      // Define the target day window
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + daysBefore);
      
      const startOfTargetDay = new Date(targetDate.setHours(0, 0, 0, 0)).toISOString();
      const endOfTargetDay = new Date(targetDate.setHours(23, 59, 59, 999)).toISOString();

      // Find active slots expiring in this window
      const { data: slots, error: fetchError } = await supabaseAdmin
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

      if (fetchError) throw fetchError;

      if (!slots || slots.length === 0) continue;

      const typedSlots = slots as unknown as SlotWithVendor[];

      for (const slot of typedSlots) {
        totalProcessed++;
        
        try {
          // Idempotency check: Have we already sent a reminder for this slot and window?
          const { data: existing, error: checkError } = await supabaseAdmin
            .from("featured_slot_reminders")
            .select("id")
            .eq("featured_slot_id", slot.id)
            .eq("reminder_window", daysBefore)
            .maybeSingle();

          if (checkError) throw checkError;
          if (existing) continue; // Already sent

          // Extract vendor/email info
          const vendor = Array.isArray(slot.vendors) ? slot.vendors[0] : slot.vendors;
          const user = vendor?.users ? (Array.isArray(vendor.users) ? vendor.users[0] : vendor.users) : null;
          
          if (!vendor || !user?.email) {
            console.warn(`[PR4] Skipping slot ${slot.id}: No email found`);
            continue;
          }

          // Send Email
          const emailResult = await sendFeaturedSlotExpiryEmail(
            user.email,
            vendor.business_name || "Vendor",
            slot.suburb_label || "Featured Suburb",
            slot.end_date,
            daysBefore
          );

          // Log the attempt for idempotency and audit
          const { error: logError } = await supabaseAdmin
            .from("featured_slot_reminders")
            .insert({
              featured_slot_id: slot.id,
              vendor_id: slot.vendor_id,
              reminder_window: daysBefore,
              status: emailResult.success ? "sent" : "failed",
              sent_at: new Date().toISOString(),
              error: emailResult.success ? null : (emailResult.error as string),
            });

          if (logError) throw logError;

          if (emailResult.success) {
            totalSent++;
          } else {
            errors.push({ slot_id: slot.id, window: daysBefore, error: emailResult.error });
          }

        } catch (itemError) {
          console.error(`[PR4] Failed processing reminder for slot ${slot.id}:`, itemError);
          errors.push({ 
            slot_id: slot.id, 
            window: daysBefore, 
            error: itemError instanceof Error ? itemError.message : String(itemError) 
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: totalProcessed,
      sent: totalSent,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("[PR4] Cron failed:", error);
    if (error instanceof Error) {
        console.error("Stack trace:", error.stack);
    }
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Error" }, { status: 500 });
  }
}
