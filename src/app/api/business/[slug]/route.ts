import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    // Query business profile by slug with simplified query
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
        is_vendor,
        vendor_tier,
        vendor_status,
        images
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Get user email separately to avoid complex joins
    let userEmail = null;
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', business.user_id)
        .single();
      
      userEmail = userData?.email || null;
    } catch (userError) {
      console.warn('Could not fetch user email:', userError);
      // Continue without email - not critical
    }

    // Check if business is also a vendor and get product count
    let isVendor = false;
    let productCount = 0;

    if (business.is_vendor && business.user_id) {
      try {
        // Get vendor information
        const { data: vendor } = await supabase
          .from('vendors')
          .select('id, tier, can_sell_products, product_count')
          .eq('user_id', business.user_id)
          .single();

        if (vendor) {
          isVendor = vendor.can_sell_products || false;
          productCount = vendor.product_count || 0;
        }
      } catch (vendorError) {
        console.warn('Could not fetch vendor data:', vendorError);
        // Continue without vendor data - not critical
      }
    }

    // Get suburb and category names
    let suburbName = null;
    let categoryName = null;

    if (business.suburb_id) {
      try {
        const { data: suburb } = await supabase
          .from('lgas')
          .select('name')
          .eq('id', business.suburb_id)
          .single();
        
        suburbName = suburb?.name || null;
      } catch (suburbError) {
        console.warn('Could not fetch suburb name:', suburbError);
      }
    }

    if (business.category_id) {
      try {
        const { data: category } = await supabase
          .from('categories')
          .select('name')
          .eq('id', business.category_id)
          .single();
        
        categoryName = category?.name || null;
      } catch (categoryError) {
        console.warn('Could not fetch category name:', categoryError);
      }
    }

    // Transform data to match frontend interface
    const transformedBusiness = {
      id: business.id,
      name: business.business_name,
      description: business.profile_description,
      suburb: suburbName,
      category: categoryName,
      slug: business.slug,
      isVendor: isVendor,
      productCount: productCount,
      verified: business.vendor_status === 'verified',
      tier: business.vendor_tier || 'directory',
      createdAt: business.created_at,
      profileImageUrl: null, // TODO: Add profile images
      
      // Extended business details for detail page
      phone: null, // TODO: Add to schema
      email: userEmail,
      website: null, // TODO: Add to schema
      address: null, // TODO: Add to schema
      businessHours: null, // TODO: Add to schema
      specialties: [], // TODO: Add to schema
      socialMedia: {}, // TODO: Add to schema
      rating: 0, // TODO: Calculate from reviews
      reviewCount: 0, // TODO: Count reviews
      images: Array.isArray(business.images) ? business.images : []
    };

    return NextResponse.json({
      business: transformedBusiness
    });

  } catch (error) {
    console.error('Unexpected API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT() {
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