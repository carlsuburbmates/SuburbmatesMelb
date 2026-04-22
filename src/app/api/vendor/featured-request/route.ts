import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/middleware/auth';
import { sendFeaturedRequestConfirmationEmail } from '@/lib/email';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { success: false, error: { code: 'CONFIG_ERROR', message: 'Admin client unavailable' } },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const isCheckOnly = body?.__check_only === true;
    const authContext = await getUserFromRequest(request);
    const userId = authContext.user.id;
    const userEmail = authContext.user.email ?? '';

    // 1. Fetch vendor record
    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .select('id, business_name, primary_region_id')
      .eq('user_id', userId)
      .single();

    if (vendorError || !vendor) {
      if (isCheckOnly) {
        return NextResponse.json({
          success: true,
          data: {
            check_only: true,
            eligible: false,
            can_submit: false,
            code: 'NO_LISTING',
          },
        });
      }

      return NextResponse.json(
        { success: false, error: { code: 'NO_LISTING', message: 'No creator listing found for your account' } },
        { status: 404 }
      );
    }

    // 2. Fetch business_profile for suburb_id eligibility check
    const { data: profile } = await supabaseAdmin
      .from('business_profiles')
      .select('suburb_id')
      .eq('user_id', userId)
      .single();

    // 3. Eligibility gate: must have both primary_region_id and suburb_id
    const missingFields: string[] = [];
    if (!vendor.primary_region_id) missingFields.push('region');
    if (!profile?.suburb_id) missingFields.push('suburb');

    if (missingFields.length > 0) {
      if (isCheckOnly) {
        return NextResponse.json({
          success: true,
          data: {
            check_only: true,
            eligible: false,
            can_submit: false,
            code: 'INELIGIBLE_INCOMPLETE_LOCATION',
            missing_fields: missingFields,
          },
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INELIGIBLE_INCOMPLETE_LOCATION',
            message: `Complete your location details before requesting featured placement. Missing: ${missingFields.join(', ')}.`,
            missing_fields: missingFields,
          },
        },
        { status: 422 }
      );
    }

    const regionId = vendor.primary_region_id as number;
    const { data: region } = await supabaseAdmin
      .from('regions')
      .select('name')
      .eq('id', regionId)
      .single();

    const regionName = region?.name ?? 'your region';

    // 4. Check for existing active request (pending or approved)
    const { data: existingRequest } = await supabaseAdmin
      .from('featured_requests')
      .select('id, status')
      .eq('vendor_id', vendor.id)
      .eq('region_id', regionId)
      .in('status', ['pending', 'approved'])
      .maybeSingle();

    if (existingRequest) {
      if (isCheckOnly) {
        return NextResponse.json({
          success: true,
          data: {
            check_only: true,
            eligible: true,
            can_submit: false,
            request_exists: true,
            existing_status: existingRequest.status,
            region: regionName,
          },
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'REQUEST_EXISTS',
            message: `A featured request for this region already exists with status: ${existingRequest.status}`,
          },
        },
        { status: 409 }
      );
    }

    if (isCheckOnly) {
      return NextResponse.json({
        success: true,
        data: {
          check_only: true,
          eligible: true,
          can_submit: true,
          request_exists: false,
          region: regionName,
        },
      });
    }

    // 6. Insert featured request with status=pending
    const { data: featuredRequest, error: insertError } = await supabaseAdmin
      .from('featured_requests')
      .insert({
        vendor_id: vendor.id,
        region_id: regionId,
        status: 'pending',
      })
      .select('id, status, created_at')
      .single();

    if (insertError || !featuredRequest) {
      logger.error('Failed to insert featured request:', insertError);
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: 'Failed to submit featured request' } },
        { status: 500 }
      );
    }

    // 7. Send confirmation email (non-blocking)
    sendFeaturedRequestConfirmationEmail(
      userEmail,
      vendor.business_name ?? 'Creator',
      regionName,
      featuredRequest.id
    ).catch((err) => logger.error('Featured request confirmation email failed:', err));

    return NextResponse.json(
      {
        success: true,
        data: {
          request_id: featuredRequest.id,
          status: featuredRequest.status,
          region: regionName,
          message: 'Featured request submitted. You will be notified once it has been reviewed.',
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const error = err as { name?: string; status?: number; message?: string };
    if (error.name === 'UnauthorizedError' || error.status === 401) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    logger.error('Featured request error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
