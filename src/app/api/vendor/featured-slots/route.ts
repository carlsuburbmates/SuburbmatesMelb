import { requireAuth } from "@/app/api/_utils/auth";
import { FEATURED_SLOT } from "@/lib/constants";
import type { Database } from "@/lib/database.types";
import {
  computeFeaturedQueuePosition,
  upsertFeaturedQueueEntry,
} from "@/lib/featured-slot";
import { logger } from "@/lib/logger";
import { createFeaturedSlotCheckoutSession } from "@/lib/stripe";
import { resolveSingleLga } from "@/lib/suburb-resolver";
import { supabaseAdmin } from "@/lib/supabase";
import { emitPosthogEvent } from "@/lib/telemetry-client";
import sanitizeForLogging, {
  minimalEventPayload,
} from "@/lib/telemetry-sanitizer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

type FeaturedSlotRow = Database["public"]["Tables"]["featured_slots"]["Row"];
type FeaturedQueueRow = Database["public"]["Tables"]["featured_queue"]["Row"];

type FeaturedSlotSummary = Pick<
  FeaturedSlotRow,
  "id" | "suburb_label" | "lga_id" | "start_date" | "end_date" | "status"
>;
type FeaturedQueueSummary = Pick<
  FeaturedQueueRow,
  "id" | "lga_id" | "suburb_label" | "joined_at" | "status"
>;

async function fetchVendorAndProfile(
  dbClient: SupabaseClient<Database>,
  userId: string
) {
  const { data: vendor, error: vendorError } = await dbClient
    .from("vendors")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (vendorError || !vendor) {
    throw new Error("Vendor account required");
  }

  if (vendor.vendor_status !== "active") {
    throw new Error("Vendor account is not active");
  }

  const { data: profile, error: profileError } = await dbClient
    .from("business_profiles")
    .select("id, business_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error(
      "Business profile required before purchasing featured placement"
    );
  }

  return { vendor, profile };
}

function formatSlotResponse(slot: FeaturedSlotSummary) {
  return {
    id: slot.id,
    suburbLabel: slot.suburb_label,
    lgaId: slot.lga_id,
    startDate: slot.start_date,
    endDate: slot.end_date,
    status: slot.status,
  };
}

async function loadActiveSlots(
  dbClient: SupabaseClient<Database>,
  vendorId: string
): Promise<ReturnType<typeof formatSlotResponse>[]> {
  const now = new Date().toISOString();
  const { data, error } = await dbClient
    .from("featured_slots")
    .select("id, suburb_label, lga_id, start_date, end_date, status")
    .eq("vendor_id", vendorId)
    .eq("status", "active")
    .lte("start_date", now)
    .gte("end_date", now)
    .order("end_date", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(formatSlotResponse);
}

async function loadQueueEntries(
  dbClient: SupabaseClient<Database>,
  vendorId: string
): Promise<FeaturedQueueSummary[]> {
  const { data, error } = await dbClient
    .from("featured_queue")
    .select("id, lga_id, suburb_label, joined_at, status")
    .eq("vendor_id", vendorId)
    .neq("status", "expired")
    .order("joined_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function GET(req: NextRequest) {
  try {
    const authContext = await requireAuth(req);
    const { vendor, profile } = await fetchVendorAndProfile(
      authContext.dbClient,
      authContext.user.id
    );

    const slots = await loadActiveSlots(authContext.dbClient, vendor.id);
    const queueEntries = await loadQueueEntries(
      authContext.dbClient,
      vendor.id
    );

    const queueWithPositions = await Promise.all(
      queueEntries.map(async (entry) => ({
        id: entry.id,
        lgaId: entry.lga_id,
        suburbLabel: entry.suburb_label,
        status: entry.status,
        position: await computeFeaturedQueuePosition(
          authContext.dbClient,
          entry.lga_id as number,
          entry
        ),
      }))
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          businessProfileId: profile.id,
          slots,
          queue: queueWithPositions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("featured_slots_list_error", { error });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FEATURED_SLOTS_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Unable to fetch featured placement",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authContext = await requireAuth(req);
    const { vendor, profile } = await fetchVendorAndProfile(
      authContext.dbClient,
      authContext.user.id
    );
    const useMockCheckout = process.env.FEATURED_SLOT_CHECKOUT_MODE === "mock";

    const body = await req.json();
    const suburbInput = (body?.suburb || "").trim();
    const lgaId = body?.lga_id as number | undefined;

    if (!suburbInput && !lgaId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SUBURB_REQUIRED",
            message: "Please provide the suburb you want to feature in",
          },
        },
        { status: 400 }
      );
    }

    let targetLgaId = lgaId ?? null;
    let resolvedSuburbLabel = suburbInput || null;
    let resolvedLgaName: string | null = null;

    if (!targetLgaId && suburbInput) {
      const resolved = await resolveSingleLga(
        authContext.dbClient,
        suburbInput
      );
      if (!resolved) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SUBURB_NOT_FOUND",
              message:
                "We couldn't match that suburb to a Melbourne council. Please try another suburb.",
            },
          },
          { status: 404 }
        );
      }
      targetLgaId = resolved.lgaId;
      resolvedLgaName = resolved.lgaName;
      if (!resolvedSuburbLabel) {
        resolvedSuburbLabel = resolved.suburbLabel || resolved.lgaName;
      }
    }

    if (!targetLgaId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "LGA_REQUIRED",
            message: "Valid council ID required",
          },
        },
        { status: 400 }
      );
    }

    const forceQueue = req.headers.get("x-featured-force-queue") === "true";

    const { data: lgaRecord } = await authContext.dbClient
      .from("lgas")
      .select("featured_slot_cap, name")
      .eq("id", targetLgaId)
      .maybeSingle();

    if (!resolvedSuburbLabel) {
      resolvedSuburbLabel =
        suburbInput || resolvedLgaName || lgaRecord?.name || "Featured";
    }

    const slotCap =
      lgaRecord?.featured_slot_cap ?? FEATURED_SLOT.MAX_SLOTS_PER_LGA;
    const safeSuburbLabel =
      resolvedSuburbLabel || resolvedLgaName || lgaRecord?.name || "Featured";

    const now = new Date().toISOString();

    const { data: activeInLga } = await authContext.dbClient
      .from("featured_slots")
      .select("id")
      .eq("lga_id", targetLgaId)
      .eq("status", "active")
      .lte("start_date", now)
      .gte("end_date", now);

    const lgaActiveCount = activeInLga?.length ?? 0;
    const effectiveActiveCount = forceQueue ? slotCap : lgaActiveCount;

    let reservedSlotId: string | null = null;

    if (effectiveActiveCount < slotCap) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const mockCheckout = useMockCheckout
        ? {
            id: `cs_mock_${Date.now()}`,
            url: `${siteUrl}/mock-featured-checkout`,
          }
        : null;
      const startDate = new Date().toISOString();
      const endDate = new Date(
        Date.now() + FEATURED_SLOT.DURATION_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      if (!supabaseAdmin) {
        throw new Error("Supabase admin client not configured");
      }
      const rpcResult = await supabaseAdmin.rpc(
        "fn_try_reserve_featured_slot",
        {
          p_vendor_id: vendor.id,
          p_business_profile_id: profile.id,
          p_lga_id: targetLgaId,
          p_suburb_label: safeSuburbLabel,
          p_start_date: startDate,
          p_end_date: endDate,
        }
      );
      const _rpc = rpcResult as unknown as {
        data?: string | null;
        error?: unknown;
      };
      const reservationError = _rpc.error;
      reservedSlotId = _rpc.data ?? null;

      if (reservationError) {
        let message = "Reservation failed";
        if (
          reservationError &&
          typeof reservationError === "object" &&
          "message" in reservationError
        ) {
          message = String(
            (reservationError as unknown as { message?: unknown }).message ??
              message
          );
        } else if (typeof reservationError === "string") {
          message = reservationError;
        }
        if (message.includes("lga_cap_exceeded")) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "LGA_CAP_EXCEEDED",
                message: "Featured slots are full for that council",
              },
            },
            { status: 409 }
          );
        }

        if (message.includes("vendor_cap_exceeded")) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VENDOR_CAP_EXCEEDED",
                message: "You have reached your featured slots cap",
              },
            },
            { status: 409 }
          );
        }

        logger.error("featured_slot_reservation_error", {
          error: reservationError,
        });
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "RESERVATION_FAILED",
              message: "Unable to reserve featured slot",
            },
          },
          { status: 500 }
        );
      }

      if (!reservedSlotId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "RESERVATION_FAILED",
              message: "Unable to reserve featured slot",
            },
          },
          { status: 500 }
        );
      }

      let session: {
        id?: string;
        url?: string | null;
        metadata?: Record<string, unknown>;
      } | null = null;
      if (mockCheckout) {
        session = mockCheckout as { id: string; url: string };
      } else {
        const created = await createFeaturedSlotCheckoutSession({
          vendorId: vendor.id,
          businessProfileId: profile.id,
          lgaId: targetLgaId,
          suburbLabel: safeSuburbLabel,
          successUrl: `${siteUrl}/vendor/dashboard?featured=success`,
          cancelUrl: `${siteUrl}/vendor/dashboard?featured=cancelled`,
          vendorStripeAccountId: vendor.stripe_account_id ?? undefined,
          vendorTier: vendor.tier ?? undefined,
          metadata: {
            reserved_slot_id: String(reservedSlotId),
          },
        });

        session = {
          id: created.id,
          url: created.url,
          metadata: created.metadata,
        };
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            checkoutUrl: session?.url ?? null,
            sessionId: session?.id ?? null,
            reservedSlotId: reservedSlotId ? String(reservedSlotId) : null,
          },
        },
        { status: 201 }
      );
    }

    const queueEntry = await upsertFeaturedQueueEntry(
      authContext.dbClient,
      vendor.id,
      profile.id,
      targetLgaId,
      safeSuburbLabel
    );

    // Emit telemetry for the reservation (sanitized)
    try {
      const telemetry = minimalEventPayload({
        vendor_id: vendor.id,
        lga_id: targetLgaId,
        reserved_slot_id: reservedSlotId ? String(reservedSlotId) : "",
        event: "featured_slot_reserved",
      }) as Record<string, unknown>;
      void emitPosthogEvent("featured_slot_reserved", telemetry);
      logger.info(
        "featured_slot_reserved",
        sanitizeForLogging(telemetry) as Record<string, unknown>
      );
    } catch (e) {
      logger.warn("featured_slot_telemetry_failed", { error: e });
    }

    const position = await computeFeaturedQueuePosition(
      authContext.dbClient,
      targetLgaId,
      queueEntry
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          status: "queued",
          position,
          suburb: safeSuburbLabel,
        },
      },
      { status: 202 }
    );
  } catch (error) {
    logger.error("featured_slot_purchase_error", { error });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FEATURED_SLOT_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Unable to process featured placement",
        },
      },
      { status: 500 }
    );
  }
}
