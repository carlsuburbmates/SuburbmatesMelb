import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * API Route to handle "Claim Profile" flow.
 * This is used for Concierge Onboarding:
 * 1. Admin seeds a profile in the DB.
 * 2. This route is called with the creator's email.
 * 3. It generates a Supabase invitation link.
 * 4. This link is sent to the creator manually by the admin.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Admin client unavailable — SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
    }

    // 1. Generate an invitation/magic link using Admin API
    // This allows the user to sign in without having an account yet, 
    // and links them to the pre-seeded vendor profile.
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard`
      }
    });

    if (error) throw error;

    // 2. Return the link to the admin (caller)
    // In production, email delivery is handled via Resend (see sendVendorOnboardingEmail in src/lib/email.ts).
    // This route returns the raw link so the admin dashboard can trigger the Resend send directly.
    return NextResponse.json({ 
      success: true, 
      action: 'Magic link generated',
      link: data.properties.action_link 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Claim profile error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
