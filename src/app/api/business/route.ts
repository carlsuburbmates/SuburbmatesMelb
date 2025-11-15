import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      .select(`
        id,
        business_name,
        profile_description,
        suburb_id,
        category_id,
        slug,
        is_public,
        created_at,
        user_id,
        users!inner(
          email,
          user_type
        )
      `)
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
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      );
    }
    
    // Transform data to match frontend interface
    const transformedBusinesses = businesses?.map((business: any) => ({
      id: business.id,
      name: business.business_name,
      description: business.profile_description,
      suburb: business.suburb_id, // In production, join with suburbs table
      category: business.category_id, // In production, join with categories table
      slug: business.slug,
      isVendor: false, // TODO: Check vendors table
      productCount: 0, // TODO: Count products if vendor
      verified: false, // TODO: Check verification status
      createdAt: business.created_at,
      profileImageUrl: null // TODO: Add profile images
    })) || [];
    
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
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement business profile creation
    // This would be used for vendor signup/business registration
    
    return NextResponse.json(
      { error: 'Business creation endpoint not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}