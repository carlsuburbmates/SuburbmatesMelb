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
    const authContext = await getUserFromRequest(request);
    const userId = authContext.user.id;
    const userEmail = authContext.user.email ?? '';

    // 1. Fetch vendor record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: vendor, error: vendorError } = await (supabaseAdmin as any)
      .from('vendors')
      .select('id, business_name, primary_region_id')
      .eq('user_id', userId)
      .single() as { data: { id: string; business_name: string | null; primary_region_id: number | null } | null; error: unknown };

    if (vendorError || !vendor) {
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

    // 4. Check for existing active request (pending or approved)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingRequest } = await (supabaseAdmin as any)
      .from('featured_requests')
      .select('id, status')
      .eq('vendor_id', vendor.id)
      .eq('region_id', regionId)
      .in('status', ['pending', 'approved'])
      .maybeSingle() as { data: { id: string; status: string } | null };

    if (existingRequest) {
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

    // 5. Fetch region name for the email
    const { data: region } = await supabaseAdmin
      .from('regions')
      .select('name')
      .eq('id', regionId)
      .single();

    const regionName = region?.name ?? 'your region';

    // 6. Insert featured request with status=pending
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: featuredRequest, error: insertError } = await (supabaseAdmin as any)
      .from('featured_requests')
      .insert({
        vendor_id: vendor.id,
        region_id: regionId,
        status: 'pending',
      })
      .select('id, status, created_at')
      .single() as { data: { id: string; status: string; created_at: string } | null; error: unknown };

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
