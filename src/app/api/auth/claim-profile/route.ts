import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAdmin } from "@/middleware/auth";
import { validateBody } from "@/app/api/_utils/validation";
import { validationErrorResponse } from "@/app/api/_utils/response";
import { ValidationError } from "@/lib/errors";
import { supabaseAdmin } from "@/lib/supabase";

const claimProfileSchema = z.object({
  email: z.string().trim().email(),
});

/**
 * API Route to handle "Claim Profile" flow.
 * This is used for Concierge Onboarding:
 * 1. Admin seeds a profile in the DB.
 * 2. This route is called with the creator's email.
 * 3. It generates a Supabase invitation link.
 * 4. This link is sent to the creator manually by the admin.
 */
async function claimProfileHandler(request: NextRequest) {
  try {
    const { email } = await validateBody(claimProfileSchema, request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Claim profile is not configured",
          },
        },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

    // Generate an invitation/magic link using the service-role client.
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: new URL("/vendor/dashboard", appUrl).toString(),
      },
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      action: "Magic link generated",
      link: data.properties.action_link,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(
        (error.details?.fields as Record<string, string>) || {}
      );
    }

    console.error("Claim profile error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to generate claim link",
        },
      },
      { status: 500 }
    );
  }
}

export const POST = withAdmin(claimProfileHandler);
