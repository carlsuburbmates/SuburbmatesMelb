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
      const profileUpdates: Database['public']['Tables']['business_profiles']['Update'] = {};
      const vendorUpdates: Database['public']['Tables']['vendors']['Update'] = {};

      if (business_name !== undefined) profileUpdates.business_name = business_name;
      if (profile_description !== undefined) profileUpdates.profile_description = profile_description;
      if (category_id !== undefined) profileUpdates.category_id = category_id;
      if (website !== undefined) profileUpdates.website = website;
      if (phone !== undefined) profileUpdates.phone = phone;
      if (region_id !== undefined) vendorUpdates.primary_region_id = region_id;

      if (Object.keys(profileUpdates).length === 0 && Object.keys(vendorUpdates).length === 0) {
        return successResponse({ message: 'No changes provided' });
      }

      if (Object.keys(vendorUpdates).length > 0) {
        const { error: vendorUpdateError } = await dbClient
          .from('vendors')
          .update(vendorUpdates)
          .eq('user_id', user.id);

        if (vendorUpdateError) {
          logger.error('Error updating vendor region', vendorUpdateError);
          return internalErrorResponse('Failed to update profile');
        }
      }

      let updatedProfile: Record<string, unknown> | null = null;
      if (Object.keys(profileUpdates).length > 0) {
        const { data, error: updateError } = await dbClient
          .from('business_profiles')
          .update(profileUpdates)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          logger.error('Error updating profile', updateError);
          return internalErrorResponse('Failed to update profile');
        }
        updatedProfile = data;
      } else {
        const { data, error: fetchError } = await dbClient
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          logger.error('Error fetching profile after vendor update', fetchError);
          return internalErrorResponse('Failed to update profile');
        }
        updatedProfile = data;
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
