/**
 * SuburbMates V1.1 - Auth Context Utilities
 * Helper functions for authentication in API routes
 */

import { NextRequest } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { UserType, USER_TYPES } from '@/lib/constants';
import { Vendor } from '@/lib/types';
import { getUserFromRequest, AuthContext } from '@/middleware/auth';

// ============================================================================
// AUTH HELPER FUNCTIONS
// ============================================================================

/**
 * Get authenticated user from request (throws if not authenticated)
 */
export async function requireAuth(req: NextRequest): Promise<AuthContext> {
  return await getUserFromRequest(req);
}

/**
 * Require specific user role
 */
export async function requireRole(req: NextRequest, role: UserType): Promise<AuthContext> {
  const authContext = await getUserFromRequest(req);

  if (authContext.user.user_type !== role) {
    throw new ForbiddenError(`${role} role required`);
  }

  return authContext;
}

/**
 * Require admin role
 */
export async function requireAdmin(req: NextRequest): Promise<AuthContext> {
  return await requireRole(req, USER_TYPES.ADMIN);
}

/**
 * Get vendor for authenticated user (throws if not a vendor)
 */
export async function requireVendor(
  req: NextRequest
): Promise<{ authContext: AuthContext; vendor: Vendor }> {
  const authContext = await getUserFromRequest(req);

  const { data: vendors, error } = await authContext.dbClient
    .from('vendors')
    .select('*')
    .eq('user_id', authContext.user.id);

  if (error || !vendors || vendors.length === 0) {
    throw new ForbiddenError('Vendor account required');
  }

  const vendor = vendors[0] as Vendor;

  if (vendor.vendor_status !== 'active') {
    throw new ForbiddenError('Vendor account is not active');
  }

  if (!vendor.can_sell_products) {
    throw new ForbiddenError('Vendor cannot sell products');
  }

  if (!vendor.stripe_account_id) {
    throw new ForbiddenError('Stripe Connect account required before listing products');
  }

  if (!vendor.stripe_onboarding_complete || vendor.stripe_account_status !== 'active') {
    throw new ForbiddenError('Stripe onboarding incomplete. Finish Connect setup to continue.');
  }

  return {
    authContext,
    vendor,
  };
}

/**
 * Get vendor for authenticated user (returns null if not a vendor)
 */
export async function getVendorIfExists(
  req: NextRequest
): Promise<{ authContext: AuthContext | null; vendor: Vendor | null }> {
  try {
    const authContext = await getUserFromRequest(req);

    const { data: vendors, error } = await authContext.dbClient
      .from('vendors')
      .select('*')
      .eq('user_id', authContext.user.id);

    if (error || !vendors || vendors.length === 0) {
      return { authContext, vendor: null };
    }

    return {
      authContext,
      vendor: vendors[0] as Vendor,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    return { authContext: null, vendor: null };
  }
}

/**
 * Check if user owns resource
 */
export async function requireOwnership(
  req: NextRequest,
  resourceUserId: string
): Promise<AuthContext> {
  const authContext = await getUserFromRequest(req);

  // Admins can access any resource
  if (authContext.user.user_type === USER_TYPES.ADMIN) {
    return authContext;
  }

  // Check if user owns the resource
  if (authContext.user.id !== resourceUserId) {
    throw new ForbiddenError('You do not have permission to access this resource');
  }

  return authContext;
}
