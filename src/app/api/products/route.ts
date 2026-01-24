import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { withApiRateLimit } from '@/middleware/rateLimit';
import { withLogging } from '@/middleware/logging';
import { withErrorHandler } from '@/middleware/errorHandler';
import { withCors } from '@/middleware/cors';

async function handler(request: NextRequest) {
  // Check for admin client configuration
  if (!supabaseAdmin) {
    logger.error('Supabase admin client not configured');
    return NextResponse.json(
      { error: 'Internal server configuration error' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendor_id');

  // Validate limit: default 10, min 1, max 100
  let limit = parseInt(searchParams.get('limit') || '10');
  if (isNaN(limit)) limit = 10;
  limit = Math.min(Math.max(1, limit), 100);

  if (!vendorId) {
    return NextResponse.json(
      { error: 'Vendor ID is required' },
      { status: 400 }
    );
  }

  // Query products
  // Note: 'rating' and 'download_count' are not currently in the schema based on other files,
  // so we select known fields and will default others in the transformation.
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, title, description, price, category, slug, thumbnail_url, images, created_at')
    .eq('vendor_id', vendorId)
    .eq('published', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Database error fetching products', error, { vendorId });
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }

  // Transform data to match frontend expectations
  const transformedProducts = products?.map(product => {
    let imageUrl = product.thumbnail_url;
    if (!imageUrl && Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = String(product.images[0]);
    }

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: imageUrl || null,
      category: product.category || 'General',
      downloadCount: 0, // Placeholder as column might not exist
      rating: 0, // Placeholder as column might not exist
      slug: product.slug,
      isFeatured: false // Placeholder
    };
  }) || [];

  return NextResponse.json({
    products: transformedProducts
  });
}

export const GET = withErrorHandler(withLogging(withCors(withApiRateLimit(handler))));
