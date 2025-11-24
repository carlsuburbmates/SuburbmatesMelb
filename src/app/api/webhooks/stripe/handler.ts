import {
  AUTO_DELIST_DURATION_DAYS,
  DISPUTE_AUTO_DELIST_THRESHOLD,
} from "@/lib/constants";
import type { VendorTier } from "@/lib/constants";
import type { Json } from "@/lib/database.types";
import { sendTierDowngradeEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";
import { enforceTierProductCap } from "@/lib/vendor-downgrade";
import { emitPosthogEvent } from "@/lib/telemetry-client";
import sanitizeForLogging, {
  minimalEventPayload,
} from "@/lib/telemetry-sanitizer";
import type Stripe from "stripe";

// Build a minimal redacted payload summary for telemetry and storage
export function redactEventSummary(event: Stripe.Event) {
  const t = event.type;
  const obj =
    (event.data && (event.data.object as unknown as Record<string, unknown>)) ||
    ({} as Record<string, unknown>);
  const summary: Record<string, unknown> = { type: t };

  if (t === "checkout.session.completed") {
    const idVal = obj["id"];
    summary.session_id =
      typeof idVal === "string" ? idVal : idVal == null ? null : String(idVal);
    const amountTotal = obj["amount_total"] ?? obj["amount_subtotal"];
    summary.amount_total =
      typeof amountTotal === "number"
        ? amountTotal
        : amountTotal == null
        ? null
        : Number(amountTotal);

    const pi = obj["payment_intent"];
    let piId: string | null = null;
    if (typeof pi === "string") piId = pi;
    else if (
      pi &&
      typeof pi === "object" &&
      "id" in (pi as Record<string, unknown>)
    ) {
      const maybeId = (pi as Record<string, unknown>)["id"];
      if (typeof maybeId === "string") piId = maybeId;
    }
    summary.payment_intent = piId;
    // include only non-PII metadata keys
    const metadata: Record<string, unknown> =
      (obj["metadata"] as Record<string, unknown> | undefined) ?? {};
    summary.metadata = {
      vendor_id:
        typeof metadata["vendor_id"] === "string"
          ? metadata["vendor_id"]
          : null,
      product_id:
        typeof metadata["product_id"] === "string"
          ? metadata["product_id"]
          : null,
      type: typeof metadata["type"] === "string" ? metadata["type"] : null,
    };
  } else if (t.startsWith("charge.dispute")) {
    summary.dispute_id = obj.id;
    summary.status = obj.status;
    const disputeMeta: Record<string, unknown> =
      (obj["metadata"] as Record<string, unknown> | undefined) ?? {};
    summary.metadata = {
      vendor_id:
        typeof disputeMeta["vendor_id"] === "string"
          ? (disputeMeta["vendor_id"] as string)
          : null,
    };
  } else if (t.startsWith("customer.subscription")) {
    summary.subscription_id = obj.id;
    const subscriptionMeta: Record<string, unknown> =
      (obj["metadata"] as Record<string, unknown> | undefined) ?? {};
    summary.metadata = {
      vendor_id:
        typeof subscriptionMeta["vendor_id"] === "string"
          ? (subscriptionMeta["vendor_id"] as string)
          : null,
      tier:
        typeof subscriptionMeta["tier"] === "string"
          ? (subscriptionMeta["tier"] as string)
          : null,
    };
  } else if (t === "account.updated") {
    summary.account_id = obj["id"];
    summary.charges_enabled = obj["charges_enabled"] ?? false;
    summary.payouts_enabled = obj["payouts_enabled"] ?? false;
    const requirements = (
      obj["requirements"] as { currently_due?: unknown[] } | undefined
    )?.currently_due;
    summary.requirements_due = Array.isArray(requirements)
      ? requirements
      : [];
  } else {
    summary.raw = { id: obj.id || null };
  }

  return summary;
}

/**
 * Process a stripe.Event object. This is split out for unit testing and to
 * allow injecting a DB client in tests.
 */
export async function handleStripeEvent(
  event: Stripe.Event,
  db = supabaseAdmin
) {
  // returns a payload_summary object representing redacted info
  if (!event) throw new Error("Missing event");

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as unknown as Record<string, unknown>;
    const metadata: Record<string, string> =
      (session["metadata"] as Record<string, string> | undefined) ?? {};
    const piVal = session["payment_intent"];
    const paymentIntentId =
      typeof piVal === "string"
        ? piVal
        : piVal &&
          typeof piVal === "object" &&
          "id" in (piVal as Record<string, unknown>)
        ? ((piVal as Record<string, unknown>)["id"] as string)
        : null;
    const amountCents =
      (typeof session["amount_total"] === "number"
        ? session["amount_total"]
        : undefined) ??
      (typeof session["amount_subtotal"] === "number"
        ? session["amount_subtotal"]
        : undefined) ??
      (typeof (piVal && (piVal as Record<string, unknown>)["amount"]) ===
      "number"
        ? ((piVal as Record<string, unknown>)["amount"] as number)
        : 0);

    if (db) {
      if (!paymentIntentId) {
        console.warn("checkout.session completed without payment_intent", {
          sessionId: session["id"],
        });
        return redactEventSummary(event);
      }

      // ensure idempotent order creation
      const { data: existingOrder } = await db
        .from("orders")
        .select("id")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .limit(1)
        .maybeSingle();
      if (!existingOrder) {
        let commissionRate = 0.05;
        if (metadata?.vendor_id) {
          const { data: commissionRow } = await db
            .from("vendors")
            .select("commission_rate")
            .eq("id", metadata.vendor_id)
            .maybeSingle();
          if (
            commissionRow &&
            typeof commissionRow.commission_rate === "number"
          ) {
            commissionRate = commissionRow.commission_rate;
          }
        }
        const commission = Math.round((amountCents || 0) * commissionRate);
        const vendorNet = (amountCents || 0) - commission;
        await db.from("orders").insert({
          customer_id: metadata?.customer_id || null,
          vendor_id: metadata?.vendor_id || null,
          product_id: metadata?.product_id || null,
          amount_cents: amountCents || 0,
          commission_cents: commission,
          vendor_net_cents: vendorNet,
          stripe_payment_intent_id: paymentIntentId,
          status: "succeeded",
        });

        await db.from("transactions_log").insert({
          type: "commission_deducted",
          vendor_id: metadata?.vendor_id || null,
          amount_cents: commission,
          stripe_reference: paymentIntentId,
        });
      }
      // If this was a featured_slot purchase, activate the reserved slot
      if (metadata?.type === "featured_slot" && metadata?.reserved_slot_id) {
        try {
          await db
            .from("featured_slots")
            .update({
              stripe_payment_intent_id: paymentIntentId,
              status: "active",
              charged_amount_cents: amountCents || 0,
            })
            .eq("id", metadata.reserved_slot_id);
        } catch (err: unknown) {
          console.error("Failed to activate reserved featured slot", err);
        }
      }
    }

    return redactEventSummary(event);
  }

  if (event.type === "charge.dispute.created") {
    const dispute = event.data.object as Stripe.Dispute;
    const vendorId = dispute.metadata?.vendor_id;
    if (vendorId && db) {
      const { data: vendorRow } = await db
        .from("vendors")
        .select("dispute_count,vendor_status")
        .eq("id", vendorId)
        .maybeSingle();
      if (vendorRow) {
        const newCount = (vendorRow.dispute_count || 0) + 1;
        await db
          .from("vendors")
          .update({
            dispute_count: newCount,
            last_dispute_at: new Date().toISOString(),
          })
          .eq("id", vendorId);
        if (
          newCount >= DISPUTE_AUTO_DELIST_THRESHOLD &&
          vendorRow.vendor_status === "active"
        ) {
          const until = new Date(
            Date.now() + AUTO_DELIST_DURATION_DAYS * 24 * 60 * 60 * 1000
          ).toISOString();
          await db
            .from("vendors")
            .update({
              vendor_status: "suspended",
              tier: "suspended",
              auto_delisted_until: until,
              suspension_reason: `Auto-suspended: ${newCount} Stripe disputes`,
            })
            .eq("id", vendorId);
        }
      }
    }
    return redactEventSummary(event);
  }

  if (event.type === "charge.dispute.closed") {
    const dispute = event.data.object as Stripe.Dispute;
    const vendorId = dispute.metadata?.vendor_id;
    if (vendorId && db) {
      const { data: vendorRow } = await db
        .from("vendors")
        .select("dispute_count")
        .eq("id", vendorId)
        .maybeSingle();
      if (vendorRow) {
        const outcomeType =
          ((dispute as { outcome?: { type?: string } }).outcome?.type ??
            dispute.status);
        if (outcomeType === "won") {
          const newCount = Math.max((vendorRow.dispute_count || 0) - 1, 0);
          await db
            .from("vendors")
            .update({ dispute_count: newCount })
            .eq("id", vendorId);
        }
      }
    }
    return redactEventSummary(event);
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as unknown as Record<
      string,
      unknown
    >;
    const vendorId =
      subscription && subscription["metadata"]
        ? ((subscription["metadata"] as Record<string, unknown>)[
            "vendor_id"
          ] as string)
        : undefined;
    const rawTier =
      subscription && subscription["metadata"]
        ? ((subscription["metadata"] as Record<string, unknown>)["tier"] as
            | string
            | undefined)
        : undefined;
    if (vendorId && rawTier && db) {
      const normalizedTier =
        (rawTier.toLowerCase() as VendorTier) ?? ("basic" as VendorTier);

      let previousTier = "basic";
      let businessName = "Your business";
      let vendorEmail: string | null = null;

      try {
        const { data: vendorProfile } = await db
          .from("vendors")
          .select("business_name,user_id,tier")
          .eq("id", vendorId)
          .maybeSingle();

        if (vendorProfile) {
          previousTier = vendorProfile.tier || previousTier;
          businessName = vendorProfile.business_name || businessName;
          if (vendorProfile.user_id) {
            const { data: vendorUser } = await db
              .from("users")
              .select("email")
              .eq("id", vendorProfile.user_id)
              .maybeSingle();
            if (vendorUser && typeof vendorUser.email === "string") {
              vendorEmail = vendorUser.email;
            }
          }
        }
      } catch (error) {
        console.warn("Failed to load vendor contact for downgrade email", {
          vendorId,
          error,
        });
      }

      await db.from("vendors").update({ tier: normalizedTier }).eq("id", vendorId);
      if (normalizedTier === "basic" || normalizedTier === "none") {
        const { unpublishedCount, unpublishedProducts } =
          await enforceTierProductCap(vendorId, normalizedTier);

        if (unpublishedCount > 0 && vendorEmail) {
          const titles =
            unpublishedProducts?.map((p) => p.title || "Untitled product") || [];
          void sendTierDowngradeEmail({
            to: vendorEmail,
            businessName,
            oldTier: previousTier,
            newTier: normalizedTier,
            unpublishedCount,
            productTitles: titles,
          });
        }
      }
    }
    return redactEventSummary(event);
  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    if (db) {
      const { data: vendorRow } = await db
        .from("vendors")
        .select("id")
        .eq("stripe_account_id", account.id)
        .maybeSingle();
      if (vendorRow) {
        await db
          .from("vendors")
          .update({
            stripe_account_status: account.charges_enabled ? "active" : "pending",
            stripe_onboarding_complete:
              account.charges_enabled && account.payouts_enabled,
          })
          .eq("id", vendorRow.id);
      }
    }
    return redactEventSummary(event);
  }

  // fallback summary
  return redactEventSummary(event);
}

/**
 * High-level entry used by the route. Handles idempotency reservation, processing,
 * updating the webhook_events row with processed_at + payload_summary, and cleanup on failure.
 */
export async function processIncomingEvent(
  event: Stripe.Event,
  db = supabaseAdmin
) {
  if (!db) throw new Error("Missing DB client");

  // Idempotency reservation
  const { data: existing } = await db
    .from("webhook_events")
    .select("id, processed_at")
    .eq("stripe_event_id", event.id)
    .limit(1)
    .maybeSingle();
  if (existing) {
    // already processed or reserved
    return { skipped: true };
  }

  await db
    .from("webhook_events")
    .insert({ stripe_event_id: event.id, event_type: event.type });

  try {
    const summary = await handleStripeEvent(event, db);

    // update processed_at and payload_summary with redacted data
    const sanitized = sanitizeForLogging(summary) as Json;
    await db
      .from("webhook_events")
      .update({
        processed_at: new Date().toISOString(),
        payload_summary: sanitized,
      })
      .eq("stripe_event_id", event.id);

    // Emit minimal telemetry to PostHog (or log) with sanitized payload
    try {
      const ph = minimalEventPayload(sanitized as Record<string, unknown>);
      // Send non-blocking (fire-and-forget) event - callers may await if needed
      void emitPosthogEvent(
        "stripe_event_processed",
        ph as Record<string, unknown>
      );
    } catch (e) {
      console.warn("Telemetry emit failed", e);
    }

    // Also log sanitized summary for server logs
    console.info("Processed stripe event", sanitized);

    return { skipped: false, summary };
  } catch (err: unknown) {
    // cleanup placeholder so retries can process again
    try {
      await db.from("webhook_events").delete().eq("stripe_event_id", event.id);
    } catch (delErr) {
      console.error("Failed to cleanup webhook_events placeholder", delErr);
    }
    throw err;
  }
}
