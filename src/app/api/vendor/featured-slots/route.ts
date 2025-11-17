/**
 * GET/POST /api/vendor/featured-slots
 *
 * Non-negotiable: Premium tier only; max 3 active slots per vendor
 */

import { requireVendor } from "@/app/api/_utils/auth";
import { successResponse } from "@/app/api/_utils/response";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { FEATURED_SLOT } from "@/lib/constants";
import { BusinessEvent, logEvent, logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET - Fetch vendor's featured slots
 */
export async function GET(req: NextRequest) {
  try {
    const { vendor, authContext } = await requireVendor(req);
    const dbClient = authContext.dbClient;

    // Fetch featured slots
    const { data: slots, error: slotsError } = await dbClient
      .from("featured_slots")
      .select("*")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false });

    if (slotsError) {
      logger.error("Failed to fetch featured slots", slotsError);
      return NextResponse.json(
        { error: "Failed to fetch slots" },
        { status: 500 }
      );
    }

    return successResponse({
      featured_slots: slots || [],
      tier: vendor.tier,
      max_slots:
        vendor.tier === "premium" ? FEATURED_SLOT.MAX_SLOTS_PER_VENDOR : 0,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    logger.error("Featured slots GET error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST - Purchase/activate a featured slot
 */
export async function POST(req: NextRequest) {
  try {
    const { vendor, authContext } = await requireVendor(req);
    const dbClient = authContext.dbClient;

    // Enforce vendor status
    if (vendor.vendor_status !== "active") {
      return NextResponse.json(
        { error: "Vendor account not active" },
        { status: 403 }
      );
    }

    // Enforce premium tier requirement (Non-negotiable)
    if (vendor.tier !== "premium") {
      return NextResponse.json(
        {
          error: "Premium tier required for featured slots",
          upgrade_required: true,
          current_tier: vendor.tier,
        },
        { status: 403 }
      );
    }

    // Check active slot count (max 3 per vendor)
    const { data: activeSlots, error: countError } = await dbClient
      .from("featured_slots")
      .select("id")
      .eq("vendor_id", vendor.id)
      .eq("status", "active");

    if (countError) {
      logger.error("Failed to count active slots", countError);
      return NextResponse.json(
        { error: "Failed to verify slot availability" },
        { status: 500 }
      );
    }

    const activeCount = activeSlots?.length || 0;
    if (activeCount >= FEATURED_SLOT.MAX_SLOTS_PER_VENDOR) {
      return NextResponse.json(
        {
          error: "Featured slot cap reached",
          max_slots: FEATURED_SLOT.MAX_SLOTS_PER_VENDOR,
          active_slots: activeCount,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();

    if (!body.lga_id || typeof body.lga_id !== "number") {
      return NextResponse.json(
        { error: "Valid lga_id required" },
        { status: 400 }
      );
    }

    // Create featured slot
    const now = new Date().toISOString();
    const expiresAt = new Date(
      Date.now() + FEATURED_SLOT.DURATION_DAYS * 86400000
    ).toISOString();

    const { data: newSlot, error: insertError } = await dbClient
      .from("featured_slots")
      .insert({
        vendor_id: vendor.id,
        lga_id: body.lga_id,
        status: "active",
        start_date: now,
        end_date: expiresAt,
        charged_amount_cents: FEATURED_SLOT.PRICE_CENTS,
      })
      .select()
      .limit(1)
      .single();

    if (insertError) {
      logger.error("Featured slot creation failed", insertError, {
        vendorId: vendor.id,
        lgaId: body.lga_id,
      });
      return NextResponse.json(
        { error: "Failed to create featured slot" },
        { status: 500 }
      );
    }

    logEvent(BusinessEvent.FEATURED_SLOT_PURCHASED, {
      vendorId: vendor.id,
      slotId: newSlot.id,
      lgaId: body.lga_id,
      activeSlots: activeCount + 1,
    });

    logger.info("Featured slot created", {
      vendorId: vendor.id,
      slotId: newSlot.id,
      lgaId: body.lga_id,
    });

    return NextResponse.json(
      {
        slot: newSlot,
        message: "Featured slot activated successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    logger.error("Featured slots POST error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
