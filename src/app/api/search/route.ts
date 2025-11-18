"use server";

import { NextRequest, NextResponse } from "next/server";
import { recordSearchTelemetry } from "@/lib/telemetry";
import { z } from "zod";

const searchSchema = z.object({
  query: z
    .string({
      required_error: "Search query is required",
    })
    .min(2, "Query must be at least 2 characters")
    .max(100, "Query must be less than 100 characters"),
  filters: z
    .record(z.any())
    .optional()
    .transform((value) => value ?? null),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = searchSchema.parse(json);

    await recordSearchTelemetry(payload.query, payload.filters);

    return NextResponse.json(
      {
        success: true,
        data: {
          results: [],
          message:
            "Search API placeholder. Telemetry captured; full search implementation arriving in Stage 3 Week 2.",
        },
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid search payload",
            details: error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    console.error("Search endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SEARCH_UNAVAILABLE",
          message:
            "Search service is not fully implemented yet. Please try again later.",
        },
      },
      { status: 500 }
    );
  }
}
