/**
 * Search Telemetry - PII-Redacted Query Logging
 *
 * Non-negotiable: Raw queries NEVER stored; only SHA-256 hashed with salt.
 */

import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";
import crypto from "crypto";

const SALT =
  process.env.SEARCH_SALT || "dev-fallback-salt-change-in-production";

/**
 * Record a search query event with hashed query (PII redacted).
 *
 * @param query - Raw search query (will be hashed, never stored)
 * @param filters - Search filters (category, LGA, price range, etc.)
 * @param userId - Optional authenticated user ID
 */
export async function recordSearchTelemetry(
  query: string,
  filters: Record<string, unknown> | null = null,
  userId?: string
): Promise<void> {
  if (!query || query.trim() === "") {
    return; // Don't record empty queries
  }

  try {
    const normalized = query.trim().toLowerCase();
    const hashed = crypto
      .createHash("sha256")
      .update(`${SALT}|${normalized}`)
      .digest("hex");

    const { error } = await supabase.from("search_telemetry").insert({
      hashed_query: hashed,
      filters: (filters as Json) || null,
      user_id: userId || null,
    });

    if (error) {
      logger.error("Search telemetry insert failed", { error });
    }
  } catch (err) {
    logger.error("Search telemetry recording error", err);
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
