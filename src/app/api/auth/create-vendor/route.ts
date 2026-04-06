import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database.types';
import { getUserFromRequest } from '@/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

type CreatorInsert = Database['public']['Tables']['vendors']['Insert'];

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

    // Check if user already has a creator profile
    const { data: existingCreator } = await dbClient
      .from('vendors')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingCreator) {
      return NextResponse.json({ success: false, error: { message: 'Creator profile already exists' } }, { status: 400 });
    }

    // Create creator profile
    const creatorPayload: CreatorInsert = {
      user_id: userId,
      business_name,
      primary_region_id: null,
      product_count: 0,
      vendor_status: 'inactive'
    };

    const { data: creator, error } = await dbClient
      .from('vendors')
      .insert(creatorPayload)
      .select()
      .single();

    if (error) {
      logger.error('Database error creating creator:', error);
      throw error;
    }

    // Set user type to business_owner if needed
    await dbClient
      .from('users')
      .update({ user_type: 'business_owner' })
      .eq('id', userId);

    return NextResponse.json({ success: true, data: { creator } });
  } catch (error: any) {
    if (error.name === 'UnauthorizedError' || error.status === 401) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }
    
    logger.error('Error creating creator profile:', error);
    return NextResponse.json({ 
      success: false, 
      error: { message: error.message || 'Internal server error' } 
    }, { status: 500 });
  }
}
