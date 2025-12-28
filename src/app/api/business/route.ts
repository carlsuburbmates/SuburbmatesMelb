import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/app/api/_utils/auth';
import { generateUniqueBusinessSlug } from '@/lib/slug-utils';
import { logger } from '@/lib/logger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const suburb = searchParams.get('suburb');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('business_profiles')
      .select(
        `id,business_name,profile_description,suburb_id,category_id,slug,is_public,created_at,updated_at,user_id,vendor_status,vendor_tier,users:users!inner(email,user_type)`
      )
      .eq('is_public', true);
    
    // Apply filters
    if (suburb) {
      // Note: This assumes suburb names are stored directly
      // In production, you'd join with suburbs table
      query = query.ilike('suburb_id', `%${suburb}%`);
    }
    
    if (category) {
      // Note: This assumes category names are stored directly  
      // In production, you'd join with categories table
      query = query.ilike('category_id', `%${category}%`);
    }
    
    if (search) {
      query = query.or(`business_name.ilike.%${search}%,profile_description.ilike.%${search}%`);
    }
    
    // Get total count for pagination  
    const countQuery = supabase
      .from('business_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true);
    
    // Apply same filters for count
    if (suburb) {
      countQuery.ilike('suburb_id', `%${suburb}%`);
    }
    if (category) {
      countQuery.ilike('category_id', `%${category}%`);
    }
    if (search) {
      countQuery.or(`business_name.ilike.%${search}%,profile_description.ilike.%${search}%`);
    }
    
    const { count } = await countQuery;
    
    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data: businesses, error } = await query;
    
    if (error) {
      logger.error('Database error', new Error(error.message), { code: error.code });
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      );
    }
    
    // Transform data to match frontend interface
    const transformedBusinesses = (businesses ?? []).map((business) => ({
      id: business.id,
      name: business.business_name,
      description: business.profile_description,
      suburb: business.suburb_id,
      category: business.category_id,
      slug: business.slug,
      isVendor: Boolean(business.vendor_status === 'active'),
      productCount: 0,
      verified: business.vendor_status === 'verified',
      createdAt: business.created_at,
      profileImageUrl: null,
    }));
    
    return NextResponse.json({
      businesses: transformedBusinesses,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNextPage: (count || 0) > page * limit,
        hasPreviousPage: page > 1
      }
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
      suburb_id,
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
      .select('tier, vendor_status')
      .eq('user_id', user.id)
      .maybeSingle();

    const slug = await generateUniqueBusinessSlug(business_name, dbClient);

    const { data: newProfile, error: insertError } = await dbClient
      .from('business_profiles')
      .insert({
        user_id: user.id,
        business_name,
        slug,
        profile_description,
        suburb_id,
        category_id,
        is_public: true, // Default to public or make it pending? Assuming public for now.
        is_vendor: !!vendor,
        vendor_status: vendor?.vendor_status || null,
        vendor_tier: vendor?.tier || null,
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
