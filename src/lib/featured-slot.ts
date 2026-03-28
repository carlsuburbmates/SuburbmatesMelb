import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { FEATURED_SLOT } from "./constants";
import { logger } from "./logger";

type FeaturedQueueRow =
  Database["public"]["Tables"]["featured_queue"]["Row"];

export async function getFeaturedSlotAvailability(
  client: SupabaseClient<Database>,
  regionId: number,
  referenceIso: string
) {
  const slotCap = FEATURED_SLOT.MAX_SLOTS_PER_LGA;

  const { count, error } = await client
    .from("featured_slots")
    .select("id", { count: "exact", head: true })
    .eq("region_id", regionId)
    .eq("status", "active")
    .lte("start_date", referenceIso)
    .gte("end_date", referenceIso);

  if (error) {
    logger.error("featured_capacity_lookup_failed", error, { regionId });
    throw error;
  }

  const activeCount = count ?? 0;

  return {
    slotCap,
    activeCount,
    hasCapacity: activeCount < slotCap,
  };
}

export async function upsertFeaturedQueueEntry(
  client: SupabaseClient<Database>,
  vendorId: string,
  businessProfileId: string,
  regionId: number,
  suburbLabel: string
) {
  const { data: existing, error } = await client
    .from("featured_queue")
    .select("id, joined_at, status")
    .eq("vendor_id", vendorId)
    .eq("region_id", regionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing) {
    return existing;
  }

  const { data: entry, error: insertError } = await client
    .from("featured_queue")
    .insert({
      vendor_id: vendorId,
      business_profile_id: businessProfileId,
      region_id: regionId,
      suburb_label: suburbLabel,
      status: "waiting",
    })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return entry;
}

export async function computeFeaturedQueuePosition(
  client: SupabaseClient<Database>,
  regionId: number,
  entry: Pick<FeaturedQueueRow, "joined_at" | "id">
) {
  if (!entry.joined_at) return 1;
  const { count, error } = await client
    .from("featured_queue")
    .select("id", { count: "exact", head: true })
    .eq("region_id", regionId)
    .eq("status", "waiting")
    .lt("joined_at", entry.joined_at);

  if (error) {
    throw error;
  }

  return (count ?? 0) + 1;
}
