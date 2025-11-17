/**
 * SuburbMates V1.1 - Authentication Middleware
 * Verify JWT tokens and inject user context
 */

import { USER_TYPES, UserType } from "@/lib/constants";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import {
  createSupabaseClient,
  supabase,
  supabaseAdmin,
} from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// TYPES
// ============================================================================

export interface AuthContext {
  user: {
    id: string;
    email: string;
    user_type: UserType;
  };
  session: {
    access_token: string;
    refresh_token: string | null;
  };
  /**
   * Supabase client scoped to the caller's JWT (used for RLS-aware queries).
   */
  supabaseClient: SupabaseClient<Database>;
  /**
   * Supabase client with elevated privileges (service role when available,
   * otherwise falls back to the user-scoped client).
   */
  dbClient: SupabaseClient<Database>;
}

export type AuthenticatedHandler = (
  req: NextRequest,
  context: AuthContext
) => Promise<NextResponse> | NextResponse;

export interface AuthOptions {
  roles?: UserType[];
  requireVendor?: boolean;
}

// ============================================================================
// AUTHENTICATION HELPER
// ============================================================================

/**
 * Extract and verify user from request
 */
export async function getUserFromRequest(
  req: NextRequest
): Promise<AuthContext> {
  // Get authorization header
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No authorization token provided");
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    // Verify token with Supabase
    const supabaseClient = createSupabaseClient(token);
    const dbClient = supabaseAdmin ?? supabaseClient;
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
      logger.warn("Invalid token provided", { error: error?.message });
      throw new UnauthorizedError("Invalid or expired token");
    }

    // Get user details from database
    const { data: userData, error: userError } = await dbClient
      .from("users")
      .select("id, email, user_type")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      logger.error("User not found in database", userError, {
        userId: user.id,
      });
      throw new UnauthorizedError("User not found");
    }

    return {
      user: {
        ...userData,
        user_type: (userData.user_type as UserType) || "customer",
      },
      session: {
        access_token: token,
        refresh_token: null,
      },
      supabaseClient,
      dbClient,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    logger.error("Authentication error", error);
    throw new UnauthorizedError("Authentication failed");
  }
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Wrap API route with authentication
 */
export function withAuth(
  handler: AuthenticatedHandler,
  options: AuthOptions = {}
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Authenticate user
      const authContext = await getUserFromRequest(req);

      // Check role requirements
      if (options.roles && options.roles.length > 0) {
        if (!options.roles.includes(authContext.user.user_type)) {
          logger.warn("Insufficient permissions", {
            userId: authContext.user.id,
            userType: authContext.user.user_type,
            requiredRoles: options.roles,
          });
          throw new ForbiddenError("Insufficient permissions for this action");
        }
      }

      // Check vendor requirements
      if (options.requireVendor) {
        const { data: vendors, error } = await authContext.dbClient
          .from("vendors")
          .select("id, vendor_status, can_sell_products")
          .eq("user_id", authContext.user.id);

        if (error || !vendors || vendors.length === 0) {
          throw new ForbiddenError("Vendor account required");
        }

        const [vendor] = vendors;

        if (!vendor) {
          throw new ForbiddenError("Vendor account required");
        }

        if (vendor.vendor_status !== "active") {
          throw new ForbiddenError("Vendor account is not active");
        }

        if (!vendor.can_sell_products) {
          throw new ForbiddenError("Vendor cannot sell products");
        }
      }

      // Call the handler with auth context
      return await handler(req, authContext);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: error.message,
            },
          },
          { status: 401 }
        );
      }

      if (error instanceof ForbiddenError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: error.message,
            },
          },
          { status: 403 }
        );
      }

      logger.error("Authentication middleware error", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Authentication failed",
          },
        },
        { status: 500 }
      );
    }
  };
}

// ============================================================================
// ROLE-SPECIFIC MIDDLEWARE
// ============================================================================

/**
 * Require admin role
 */
export function withAdmin(handler: AuthenticatedHandler) {
  return withAuth(handler, { roles: [USER_TYPES.ADMIN] });
}

/**
 * Require vendor account
 */
export function withVendor(handler: AuthenticatedHandler) {
  return withAuth(handler, { requireVendor: true });
}

/**
 * Require customer or vendor (any authenticated user)
 */
export function withUser(handler: AuthenticatedHandler) {
  return withAuth(handler);
}
