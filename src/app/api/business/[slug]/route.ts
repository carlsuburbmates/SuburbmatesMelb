import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Business slug is required' },
        { status: 400 }
      );
    }

    // Query business profile by slug
    const { data: business, error } = await supabase
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
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // TODO: Check if business is also a vendor
    // const { data: vendor } = await supabase
    //   .from('vendors')
    //   .select('tier, can_sell_products')
    //   .eq('user_id', business.user_id)
    //   .single();

    // TODO: Get product count if vendor
    // const { count: productCount } = await supabase
    //   .from('products')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('vendor_id', vendor?.id);

    // Transform data to match frontend interface
    const transformedBusiness = {
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
      profileImageUrl: null, // TODO: Add profile images
      
      // Extended business details for detail page
      phone: null, // TODO: Add to schema
      email: (business.users as any)?.email || null,
      website: null, // TODO: Add to schema
      address: null, // TODO: Add to schema
      businessHours: null, // TODO: Add to schema
      specialties: [], // TODO: Add to schema
      socialMedia: {}, // TODO: Add to schema
      rating: 0, // TODO: Calculate from reviews
      reviewCount: 0 // TODO: Count reviews
    };

    return NextResponse.json({
      business: transformedBusiness
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Implement business profile update
    // This would be used by business owners to update their profiles
    
    return NextResponse.json(
      { error: 'Business update endpoint not implemented yet' },
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