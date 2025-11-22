#!/usr/bin/env node

/**
 * Featured Slot Expirer
 * Marks slots as expired when end_date passes or the vendor is no longer active.
 */

const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const ENV_PATH = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(ENV_PATH)) {
  require("dotenv").config({ path: ENV_PATH });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function fetchActiveSlots() {
  const { data, error } = await supabase
    .from("featured_slots")
    .select("id, end_date, vendor_id, suburb_label, vendors!inner(tier, vendor_status)")
    .eq("status", "active");
  if (error) throw error;
  return data ?? [];
}

async function markSlots(ids, status) {
  if (!ids.length) return 0;
  const { error, count } = await supabase
    .from("featured_slots")
    .update({ status })
    .in("id", ids);
  if (error) throw error;
  return count ?? ids.length;
}

async function main() {
  console.log("⏰ Expiring stale featured slots…");
  const slots = await fetchActiveSlots();
  if (!slots.length) {
    console.log("✅ No active slots found.");
    return;
  }

  const now = new Date();
  const expiredIds = [];
  const suspendedIds = [];

  slots.forEach((slot) => {
    const vendorStatus = slot.vendors?.vendor_status ?? "unknown";
    const vendorTier = slot.vendors?.tier ?? "unknown";
    const endDate = slot.end_date ? new Date(slot.end_date) : null;

    if (endDate && endDate.getTime() <= now.getTime()) {
      expiredIds.push(slot.id);
      return;
    }

    if (vendorStatus !== "active" || vendorTier === "suspended") {
      suspendedIds.push(slot.id);
    }
  });

  const expiredCount = await markSlots(expiredIds, "expired");
  const cancelledCount = await markSlots(suspendedIds, "cancelled");

  console.log(
    `✅ Processed ${slots.length} slot(s). ${expiredCount} expired, ${cancelledCount} cancelled due to vendor status.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("expire-featured-slots failed", error);
    process.exit(1);
  });
