import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/app/api/_utils/auth';
import { generateUniqueBusinessSlug } from '@/lib/slug-utils';
import { logger } from '@/lib/logger';
import { executeDirectorySearch } from '@/lib/search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const searchResponse = await executeDirectorySearch(supabase, {
      query: search,
      region,
      category,
      page,
      limit,
    });

    return NextResponse.json({
      businesses: searchResponse.results,
      pagination: searchResponse.pagination,
    });
    
  } catch (error) {
    logger.error('API error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authContext = await requireAuth(request);
    const { user, dbClient } = authContext;

    // Check if user already has a business profile
    const { data: existingProfile, error: profileError } = await dbClient
      .from('business_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'User already has a business profile' },
        { status: 409 }
      );
    }

    if (profileError) {
      console.error('Database error checking profile:', profileError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      business_name,
      profile_description,
      region_id,
      category_id
    } = body;

    if (!business_name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Get vendor details if they exist
    const { data: vendor } = await dbClient
      .from('vendors')
      .select('id, vendor_status, primary_region_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (region_id !== undefined && vendor?.id) {
      const { error: vendorUpdateError } = await dbClient
        .from('vendors')
        .update({ primary_region_id: region_id })
        .eq('id', vendor.id);

      if (vendorUpdateError) {
        console.error('Error updating vendor region:', vendorUpdateError);
        return NextResponse.json(
          { error: 'Failed to set vendor region' },
          { status: 500 }
        );
      }
    }

    const slug = await generateUniqueBusinessSlug(business_name, dbClient);

    const { data: newProfile, error: insertError } = await dbClient
      .from('business_profiles')
      .insert({
        user_id: user.id,
        business_name,
        slug,
        profile_description,
        category_id,
        is_public: Boolean(vendor?.vendor_status === 'active'),
        vendor_status: vendor?.vendor_status ?? 'inactive',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating business profile:', insertError);
      return NextResponse.json(
        { error: 'Failed to create business profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Business profile created successfully',
      business: newProfile,
    });
    
  } catch (error) {
    logger.error('API error', error);
    if (error instanceof Error && error.message.includes('No authorization token provided')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
