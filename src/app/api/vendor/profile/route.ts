import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, supabase, supabaseAdmin } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { logger } from '@/lib/logger';
import {
  successResponse,
  unauthorizedResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/app/api/_utils/response';
import { withAuthRateLimit } from '@/middleware/rateLimit';
import { withCors } from '@/middleware/cors';
import { withLogging } from '@/middleware/logging';
import { withErrorHandler } from '@/middleware/errorHandler';


async function handler(req: NextRequest) {
  try {
    // 1. Authenticate Request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return unauthorizedResponse('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    // Verify user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return unauthorizedResponse('Invalid session');
    }

    const dbClient = supabaseAdmin || createSupabaseClient(token);

    // 2. Handle GET (Fetch Profile)
    if (req.method === 'GET') {
      const { data: profile, error } = await dbClient
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        logger.error('Error fetching profile', error);
        return internalErrorResponse('Failed to fetch profile');
      }

      if (!profile) {
        return notFoundResponse('Business profile not found');
      }

      return successResponse({ profile });
    }

    // 3. Handle PATCH (Update Profile)
    if (req.method === 'PATCH') {
      const body = await req.json();

      const { business_name, profile_description, region_id, category_id, website, phone } = body;
      const updates: Database['public']['Tables']['business_profiles']['Update'] = {};

      if (business_name !== undefined) updates.business_name = business_name;
      if (profile_description !== undefined) updates.profile_description = profile_description;
      if (region_id !== undefined) updates.suburb_id = region_id;
      if (category_id !== undefined) updates.category_id = category_id;
      if (website !== undefined) updates.website = website;
      if (phone !== undefined) updates.phone = phone;

      if (Object.keys(updates).length === 0) {
        return successResponse({ message: 'No changes provided' });
      }

      const { data: updatedProfile, error: updateError } = await dbClient
        .from('business_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        logger.error('Error updating profile', updateError);
        return internalErrorResponse('Failed to update profile');
      }

      return successResponse({ profile: updatedProfile });
    }

    return new NextResponse('Method Not Allowed', { status: 405 });

  } catch (error) {
    logger.error('Profile API error', error as Error);
    return internalErrorResponse('Internal server error');
  }
}

export const GET = withErrorHandler(withLogging(withCors(withAuthRateLimit(handler))));
export const PATCH = withErrorHandler(withLogging(withCors(withAuthRateLimit(handler))));
