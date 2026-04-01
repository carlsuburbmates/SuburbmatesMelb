import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { businessProfileUpdateSchema } from '@/lib/validation';
import { getUserFromRequest } from '@/middleware/auth';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { logger } from '@/lib/logger';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('Missing required Supabase environment variables');
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
        { error: 'Creator slug is required' },
        { status: 400 }
      );
    }

    // Query business profile by slug (Discovery Mode)
    const { data: creator, error } = await supabase
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
        template_key,
        theme_config
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error || !creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    // Get user metadata
    let userEmail = null;
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', creator.user_id)
        .single();
      userEmail = userData?.email || null;
    } catch (userError) {
      // Non-critical
    }

    // Get vendor info (Product count ONLY)
    let productCount = 0;
    let vendorId: string | undefined = undefined;

    if (creator.is_vendor && creator.user_id) {
      try {
        const { data: vendor } = await supabase
          .from('vendors')
          .select('id, product_count')
          .eq('user_id', creator.user_id)
          .single();

        if (vendor) {
          productCount = vendor.product_count || 0;
          vendorId = vendor.id;
        }
      } catch (vendorError) {
        // Non-critical
      }
    }

    // Get region and category names
    let regionName = "Melbourne";
    let categoryName = "Creator";

    if (creator.suburb_id) {
      const { data: region } = await supabase.from('regions').select('name').eq('id', creator.suburb_id).single();
      regionName = region?.name || regionName;
    }

    if (creator.category_id) {
      const { data: category } = await supabase.from('categories').select('name').eq('id', creator.category_id).single();
      categoryName = category?.name || categoryName;
    }

    // Transform to SSOT v2.1 Minimalist Object
    const transformedCreator = {
      id: creator.id,
      name: creator.business_name,
      description: creator.profile_description,
      suburb: regionName,
      category: categoryName,
      slug: creator.slug,
      isVendor: creator.is_vendor,
      vendorId: vendorId,
      productCount: productCount,
      createdAt: creator.created_at,
      profileImageUrl: null, // Placeholder or fetch from assets table
      email: userEmail,
      images: (creator && 'images' in creator && Array.isArray(creator.images)) ? creator.images : [],
      templateKey: creator.template_key || 'standard',
    };

    return NextResponse.json({
      business: transformedCreator
    });

  } catch (error) {
    logger.error('Unexpected API error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    const authContext = await getUserFromRequest(request);
    const userId = authContext.user.id;

    const body = await request.json();
    const validationResult = businessProfileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error.issues }, { status: 400 });
    }

    const { business_name, description, region_id, category_id } = validationResult.data;

    // Check ownership
    const { data: profile } = await supabase.from('business_profiles').select('id, user_id').eq('slug', slug).single();
    if (!profile || profile.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updateData: unknown = { updated_at: new Date().toISOString() };
    if (business_name) updateData.business_name = business_name;
    if (description !== undefined) updateData.profile_description = description;
    if (region_id) updateData.suburb_id = region_id;
    if (category_id) updateData.category_id = category_id;

    const { data: updated, error } = await supabase.from('business_profiles').update(updateData).eq('id', profile.id).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, business: updated });

  } catch (error) {
    logger.error('API error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
