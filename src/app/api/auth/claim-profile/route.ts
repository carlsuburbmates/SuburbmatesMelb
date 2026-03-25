import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin client (requires service role key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const { email, vendor_id } = await request.json();

    if (!email || !vendor_id) {
      return NextResponse.json({ error: 'Email and Vendor ID are required' }, { status: 400 });
    }

    // 1. Generate an invitation/magic link using Admin API
    // This allows the user to sign in without having an account yet, 
    // and links them to the pre-seeded vendor profile.
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?claim=${vendor_id}`
      }
    });

    if (error) throw error;

    // 2. Return the link to the admin (caller)
    // Note: In a real production setup, we'd send the email here, 
    // but for SSOT v2 Concierge, the admin might want the link to send via DM/WhatsApp.
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
