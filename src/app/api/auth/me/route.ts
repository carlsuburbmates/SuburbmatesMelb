/**
 * GET /api/auth/me
 * Get current authenticated user
 */

import supabase from '@/lib/supabase';
import {
  successResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/app/api/_utils/response';

async function meHandler() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return unauthorizedResponse('Not authenticated');
    }

    // Use admin client to get user data from database (same as login endpoint)
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (dbError || !userData) {
      return internalErrorResponse('User record missing');
    }

    // Get vendor data if user has vendor account
    const { data: vendorData } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    return successResponse({
      user: userData,
      vendor: vendorData,
    });
  } catch (error) {
    console.error('Error in /api/auth/me', error);
    return internalErrorResponse('Internal server error');
  }
}

export const GET = meHandler;