import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { businessProfileUpdateSchema } from '@/lib/validation';
import { getUserFromRequest } from '@/middleware/auth';
import { logger } from '@/lib/logger';

if (!supabaseAdmin) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured — supabaseAdmin is unavailable');
}
const supabase = supabaseAdmin;

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
        vendor_status,
        created_at,
        user_id,
        images
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .eq('vendor_status', 'active')
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
    } catch {
      // Non-critical
    }

    // Get vendor info (Product count ONLY)
    let productCount = 0;
    let vendorId: string | undefined = undefined;

    if (creator.user_id) {
      try {
        const { data: vendor } = await supabase
          .from('vendors')
          .select('id, product_count')
          .eq('user_id', creator.user_id)
          .maybeSingle();
 
        if (vendor) {
          productCount = vendor.product_count || 0;
          vendorId = vendor.id;
        }
      } catch {
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
      owner_user_id: creator.user_id,
      name: creator.business_name,
      description: creator.profile_description,
      region: regionName,
      category: categoryName,
      slug: creator.slug,
      isVendor: !!vendorId,
      vendorId: vendorId,
      productCount: productCount,
      createdAt: creator.created_at,
      profileImageUrl: null, // Placeholder or fetch from assets table
      email: userEmail,
      images: Array.isArray(creator.images) ? creator.images : [],
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

    const updateData: import('@/lib/database.types').Database['public']['Tables']['business_profiles']['Update'] = { updated_at: new Date().toISOString() };
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
