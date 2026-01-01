import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withApiRateLimit, withLogging, withErrorHandler, withCors } from '@/middleware';
import { logger } from '@/lib/logger';

async function handler(request: NextRequest) {
  if (!supabaseAdmin) {
    logger.error('Missing Supabase Service Role Key');
    return NextResponse.json(
      { error: 'Internal server configuration error' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendor_id');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!vendorId) {
    return NextResponse.json(
      { error: 'Vendor ID is required' },
      { status: 400 }
    );
  }

  // Query products
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, title, description, price, category, slug, thumbnail_url, images, created_at')
    .eq('vendor_id', vendorId)
    .eq('published', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Database error fetching products', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }

  // Transform data to match frontend expectations
  const transformedProducts = products?.map(product => {
    // Handle images which can be any JSON type
    let imageUrl = product.thumbnail_url;
    if (!imageUrl && Array.isArray(product.images) && product.images.length > 0) {
       const firstImage = product.images[0];
       if (typeof firstImage === 'string') {
         imageUrl = firstImage;
       }
    }

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: imageUrl || null,
      category: product.category || 'General',
      downloadCount: 0,
      rating: 0,
      slug: product.slug,
      isFeatured: false
    };
  }) || [];

  return NextResponse.json({
    products: transformedProducts
  });
}

export const GET = withErrorHandler(withLogging(withCors(withApiRateLimit(handler))));
