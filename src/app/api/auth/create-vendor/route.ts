import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database.types';
import { getUserFromRequest } from '@/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

type VendorInsert = Database['public']['Tables']['vendors']['Insert'];

export async function POST(request: NextRequest) {
  try {
    // Authenticate user using centralized middleware logic
    const authContext = await getUserFromRequest(request);
    const userId = authContext.user.id;

    if (!userId) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { business_name } = await request.json();
    if (!business_name) {
      return NextResponse.json({ success: false, error: { message: 'Business name is required' } }, { status: 400 });
    }

    // Use admin client to ensure bypass of RLS if needed for profile creation
    const dbClient = supabaseAdmin || authContext.supabaseClient;

    // Check if user already has a vendor profile
    const { data: existingVendor } = await dbClient
      .from('vendors')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingVendor) {
      return NextResponse.json({ success: false, error: { message: 'Vendor profile already exists' } }, { status: 400 });
    }

    // Create vendor profile
    const vendorPayload: VendorInsert = {
      user_id: userId,
      business_name,
      product_count: 0
    };

    const { data: vendor, error } = await dbClient
      .from('vendors')
      .insert(vendorPayload)
      .select()
      .single();

    if (error) {
      logger.error('Database error creating vendor:', error);
      throw error;
    }

    // Set user type to business_owner if needed
    await dbClient
      .from('users')
      .update({ user_type: 'business_owner' })
      .eq('id', userId);

    return NextResponse.json({ success: true, data: { vendor } });
  } catch (error: unknown) {
    const isUnauthorized = error instanceof Error && (error.name === 'UnauthorizedError' || (error as { status?: number }).status === 401);
    if (isUnauthorized) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }
    
    logger.error('Error creating vendor profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ 
      success: false, 
      error: { message: errorMessage }
    }, { status: 500 });
  }
}
