import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/middleware/auth';
import { sendClaimAcknowledgementEmail } from '@/lib/email';
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

    const body = await request.json();
    const { business_profile_id, evidence_text } = body as {
      business_profile_id?: string;
      evidence_text?: string;
    };

    if (!business_profile_id) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'business_profile_id is required' } },
        { status: 400 }
      );
    }

    // 1. Confirm the listing exists and is public
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('business_profiles')
      .select('id, business_name, user_id')
      .eq('id', business_profile_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Listing not found' } },
        { status: 404 }
      );
    }

    // 2. Prevent claiming your own listing
    if (profile.user_id === userId) {
      return NextResponse.json(
        { success: false, error: { code: 'ALREADY_OWNER', message: 'You already own this listing' } },
        { status: 409 }
      );
    }

    // 3. Check for existing active claim from this user on this listing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingClaim } = await (supabaseAdmin as any)
      .from('listing_claims')
      .select('id, status')
      .eq('claimant_user_id', userId)
      .eq('business_profile_id', business_profile_id)
      .in('status', ['pending', 'approved', 'more_info'])
      .maybeSingle() as { data: { id: string; status: string } | null };

    if (existingClaim) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CLAIM_EXISTS',
            message: `A claim for this listing already exists with status: ${existingClaim.status}`,
          },
        },
        { status: 409 }
      );
    }

    // 4. Get user's name for the email
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();

    const claimantName =
      user?.first_name
        ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
        : userEmail;

    // 5. Insert claim with status=pending
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: claim, error: claimError } = await (supabaseAdmin as any)
      .from('listing_claims')
      .insert({
        claimant_user_id: userId,
        business_profile_id,
        evidence_text: evidence_text?.trim() || null,
        status: 'pending',
      })
      .select('id, status, created_at')
      .single() as { data: { id: string; status: string; created_at: string } | null; error: unknown };

    if (claimError || !claim) {
      logger.error('Failed to insert claim:', claimError);
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: 'Failed to submit claim' } },
        { status: 500 }
      );
    }

    // 6. Send acknowledgement email (non-blocking)
    sendClaimAcknowledgementEmail(
      userEmail,
      claimantName,
      profile.business_name,
      claim.id
    ).catch((err) => logger.error('Claim acknowledgement email failed:', err));

    return NextResponse.json(
      {
        success: true,
        data: {
          claim_id: claim.id,
          status: claim.status,
          listing_name: profile.business_name,
          message: 'Claim submitted successfully. You will be notified once it has been reviewed.',
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
    logger.error('Claim submission error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
