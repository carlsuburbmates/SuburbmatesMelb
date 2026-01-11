import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withApiRateLimit, withLogging, withErrorHandler } from '@/middleware';
import { logger } from '@/lib/logger';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('Missing required Supabase environment variables');
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

export async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendor_id');
  const limitParam = parseInt(searchParams.get('limit') || '10');

  // Enforce max limit of 100 to prevent DoS
  const limit = Math.min(Math.max(1, limitParam), 100);

  if (!vendorId) {
    return NextResponse.json(
      { error: 'Vendor ID is required' },
      { status: 400 }
    );
  }

  // Query products
  // Note: 'rating' and 'download_count' are not currently in the schema based on other files,
  // so we select known fields and will default others in the transformation.
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, description, price, category, slug, thumbnail_url, images, created_at')
    .eq('vendor_id', vendorId)
    .eq('published', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Database error fetching products', new Error(error.message), { code: error.code });
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }

  // Transform data to match frontend expectations
  const transformedProducts = products?.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    imageUrl: product.thumbnail_url || (product.images?.[0]) || null,
    category: product.category || 'General',
    downloadCount: 0, // Placeholder as column might not exist
    rating: 0, // Placeholder as column might not exist
    slug: product.slug,
    isFeatured: false // Placeholder
  })) || [];

  return NextResponse.json({
    products: transformedProducts
  });
}

export const GET = withErrorHandler(withLogging(withApiRateLimit(handler)));
