"use server";

import { NextRequest, NextResponse } from "next/server";
import { recordSearchTelemetry } from "@/lib/telemetry";
import { searchTelemetrySchema } from "@/lib/validation";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = searchTelemetrySchema.parse(json);

    await recordSearchTelemetry(payload);

    return NextResponse.json(
      {
        success: true,
        data: { logged: true },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid telemetry payload",
            details: error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    console.error("Search telemetry error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TELEMETRY_FAILED",
          message: "Unable to record search telemetry",
        },
      },
      { status: 500 }
    );
  }
}
