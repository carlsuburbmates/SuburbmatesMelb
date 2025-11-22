/**
 * Search Telemetry - PII-Redacted Query Logging
 *
 * Non-negotiable: Raw queries NEVER stored; only SHA-256 hashed with salt.
 */

import type { Json } from "@/lib/database.types";
import { logger } from "@/lib/logger";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import {
  SearchTelemetryPayload,
  searchTelemetrySchema,
} from "@/lib/validation";
import crypto from "crypto";

const SALT =
  process.env.SEARCH_SALT || "dev-fallback-salt-change-in-production";

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_API_HOST =
  process.env.POSTHOG_API_HOST || "https://us.posthog.com";

/**
 * Record a search query event with hashed query (PII redacted) and optional analytics.
 */
export async function recordSearchTelemetry(
  payload: SearchTelemetryPayload
): Promise<void> {
  const parsed = searchTelemetrySchema.safeParse(payload);
  if (!parsed.success) {
    logger.warn("Invalid search telemetry payload", parsed.error.flatten());
    return;
  }

  const { query, filters, result_count, session_id, user_id } = parsed.data;

  try {
    const normalized = query?.trim().toLowerCase();
    if (!normalized && !filters) {
      return;
    }

    const hashSource =
      normalized && normalized.length > 0
        ? normalized
        : JSON.stringify(filters ?? {});

    const hashed = crypto
      .createHash("sha256")
      .update(`${SALT}|${hashSource}`)
      .digest("hex");

    const client = supabaseAdmin ?? supabase;
    const { error } = await client.from("search_logs").insert({
      hashed_query: hashed,
      filters: (filters as Json) ?? null,
      result_count: result_count ?? null,
      session_id: session_id ?? null,
      user_id: user_id ?? null,
    });

    if (error) {
      logger.error("Search telemetry insert failed", { error });
    } else {
      if (normalized || filters) {
        await capturePosthogSearchEvent({
          hashedQuery: hashed,
          rawQuery: normalized ?? null,
          filters: (filters as Record<string, unknown>) ?? null,
          resultCount: result_count ?? null,
          sessionId: session_id ?? null,
        });
      }
    }
  } catch (err) {
    logger.error("Search telemetry recording error", err);
  }
}

interface PosthogSearchEvent {
  hashedQuery: string;
  rawQuery: string | null;
  filters: Record<string, unknown> | null;
  resultCount: number | null;
  sessionId: string | null;
}

async function capturePosthogSearchEvent({
  hashedQuery,
  rawQuery,
  filters,
  resultCount,
  sessionId,
}: PosthogSearchEvent) {
  if (!POSTHOG_API_KEY) {
    return;
  }

  try {
    await fetch(`${POSTHOG_API_HOST}/capture/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: "search_query",
        distinct_id: sessionId ?? hashedQuery,
        properties: {
          hashed_query: hashedQuery,
          raw_query: rawQuery ?? undefined,
          query_present: Boolean(rawQuery),
          result_count: resultCount ?? 0,
          session_id: sessionId,
          filters: filters ?? {},
        },
      }),
    });
  } catch (error) {
    logger.error("PostHog search_query capture failed", error);
  }
}

/**
 * Validate SEARCH_SALT is properly configured (warn if using default)
 */
export function validateTelemetryConfig(): boolean {
  if (
    !process.env.SEARCH_SALT ||
    process.env.SEARCH_SALT.includes("dev-fallback")
  ) {
    logger.warn("SEARCH_SALT not configured; using insecure default");
    return false;
  }
  return true;
}
