"use server";

import { NextRequest, NextResponse } from "next/server";
import { directorySearchSchema } from "@/lib/validation";
import { executeDirectorySearch } from "@/lib/search";
import { recordSearchTelemetry } from "@/lib/telemetry";
import { z } from "zod";
import { ApiResponse } from "@/lib/types";

import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const parsed = directorySearchSchema.parse(payload);

    const searchResponse = await executeDirectorySearch(supabase, parsed);

    if (
      (parsed.query && parsed.query.length > 0) ||
      parsed.suburb ||
      parsed.category
    ) {
      await recordSearchTelemetry({
        query: parsed.query ?? "",
        filters: {
          suburb: parsed.suburb,
          category: parsed.category,
        },
        result_count: searchResponse.pagination.total,
        session_id: req.headers.get("x-search-session") || null,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: searchResponse,
      } as ApiResponse<typeof searchResponse>,
      { status: 200 }
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

    console.error("SEARCH_ROUTE_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SEARCH_FAILED",
          message: "Unable to load directory results",
        },
      },
      { status: 500 }
    );
  }
}
