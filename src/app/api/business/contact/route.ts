import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendBusinessContactEmail } from '@/lib/email';
import { z } from 'zod';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required Supabase environment variables');
  throw new Error('Missing required Supabase environment variables');
}

// Create admin client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Validation schema
const contactFormSchema = z.object({
  businessId: z.string().uuid("Invalid business ID"),
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { businessId, name, email, phone, message } = result.data;

    // 1. Get business profile to find user_id
    const { data: business, error: businessError } = await supabase
      .from('business_profiles')
      .select('id, user_id, business_name')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      console.error('Business lookup error:', businessError);
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // 2. Get user email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', business.user_id)
      .single();

    if (userError || !user || !user.email) {
      console.error('User lookup error:', userError);
      return NextResponse.json(
        { error: 'Business owner contact details not found' },
        { status: 404 }
      );
    }

    // 3. Send email
    const emailResult = await sendBusinessContactEmail({
      toEmail: user.email,
      businessName: business.business_name,
      senderName: name,
      senderEmail: email,
      senderPhone: phone,
      message: message,
    });

    if (!emailResult.success) {
      console.error('Failed to send contact email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
