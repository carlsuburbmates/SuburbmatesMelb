import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { businessProfileUpdateSchema } from '@/lib/validation';
import { getUserFromRequest } from '@/middleware/auth';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';

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
        vendor_status
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
    let rating = 0;
    let reviewCount = 0;

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

          // Calculate rating from reviews if vendor can sell products
          if (isVendor) {
            // Get all products for this vendor
            const { data: products } = await supabase
              .from('products')
              .select('id')
              .eq('vendor_id', vendor.id);

            if (products && products.length > 0) {
              const productIds = products.map(p => p.id);

              // Fetch approved reviews for these products
              const { data: reviews, count } = await supabase
                .from('reviews')
                .select('rating', { count: 'exact' })
                .in('product_id', productIds)
                .eq('status', 'approved');

              if (reviews && reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
                rating = Number((totalRating / reviews.length).toFixed(1));
                reviewCount = count || reviews.length;
              }
            }
          }
        }
      } catch (vendorError) {
        console.warn('Could not fetch vendor data or reviews:', vendorError);
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
      rating,
      reviewCount,
      images: [] // TODO: Add images
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Business slug is required' },
        { status: 400 }
      );
    }

    // 1. Authenticate user
    const authContext = await getUserFromRequest(request);
    const userId = authContext.user.id;

    // 2. Validate input body
    const body = await request.json();
    const validationResult = businessProfileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const {
      business_name,
      description,
      lga_id,
      category_id,
      // The following fields are in the schema but not in the database table business_profiles yet
      // contact_email,
      // contact_phone,
      // website_url,
      // address
    } = validationResult.data;

    // 3. Fetch existing business profile to check ownership
    const { data: business, error: fetchError } = await supabase
      .from('business_profiles')
      .select('id, user_id')
      .eq('slug', slug)
      .single();

    if (fetchError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // 4. Verify ownership (allow admins to bypass)
    if (business.user_id !== userId && authContext.user.user_type !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this business profile' },
        { status: 403 }
      );
    }

    // 5. Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (business_name) updateData.business_name = business_name;
    if (description !== undefined) updateData.profile_description = description;
    if (lga_id) updateData.suburb_id = lga_id;
    if (category_id) updateData.category_id = category_id;

    // 6. Perform update
    const { data: updatedBusiness, error: updateError } = await supabase
      .from('business_profiles')
      .update(updateData)
      .eq('id', business.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update business profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Business profile updated successfully',
      business: updatedBusiness
    });
    
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
