/**
 * GET /api/auth/me
 * Get current authenticated user
 */

import { NextRequest } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import {
  successResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/app/api/_utils/response';

async function meHandler(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return unauthorizedResponse('No token provided');
    }

    // Use provided token to get user
    const supabaseClient = createSupabaseClient(token);
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) {
      logger.error('Invalid token', error);
      return unauthorizedResponse('Invalid token');
    }

    // Use token-bound client to get user data (enforcing RLS)
    const { data: users, error: dbError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user.id);

    if (dbError || !users || users.length === 0) {
      logger.error('User not found in database', dbError, { userId: user.id });
      return internalErrorResponse('Database error');
    }

    const userData = users[0];

    // Get vendor data if user has vendor account
    let vendorData = null;
    const { data: vendors } = await supabaseClient
      .from('vendors')
      .select('*')
      .eq('user_id', user.id);

    if (vendors && vendors.length > 0) {
      vendorData = vendors[0];
    }

    return successResponse({
      user: userData,
      vendor: vendorData,
    });
  } catch (error) {
    logger.error('Error in /api/auth/me', error);
    return internalErrorResponse('Internal server error');
  }
}

export const GET = meHandler;