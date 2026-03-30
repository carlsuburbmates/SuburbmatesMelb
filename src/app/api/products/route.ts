import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withApiRateLimit, withLogging, withErrorHandler } from '@/middleware/index';
import { InvalidInputError, InternalError } from '@/lib/errors';

/**
 * GET /api/products
 * Public endpoint to fetch products for a vendor.
 * Secured with:
 * - Rate Limiting
 * - Input Validation (UUID, Limit Cap)
 * - Centralized Error Handling
 * - Logging
 */
async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendor_id');

  // Security: Validate and cap 'limit' to prevent DoS
  let limit = parseInt(searchParams.get('limit') || '10');
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 100) limit = 100; // Hard cap at 100

  if (!vendorId) {
    throw new InvalidInputError('vendor_id', 'Vendor ID is required');
  }

  // Security: Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(vendorId)) {
    throw new InvalidInputError('vendor_id', 'Invalid Vendor ID format');
  }

  if (!supabaseAdmin) {
    // This happens if SUPABASE_SERVICE_ROLE_KEY is missing
    throw new InternalError('Server configuration error: Database access unavailable');
  }

  // Query products using admin client (bypassing RLS since we filter manually)
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, title, description, price, category, slug, thumbnail_url, images, created_at')
    .eq('vendor_id', vendorId)
    .eq('published', true) // Only published products
    .is('deleted_at', null) // Only non-deleted products
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new InternalError('Failed to fetch products', { originalError: error });
  }

  // Transform data to match frontend expectations
  const transformedProducts = products?.map(product => {
    // Safely handle potential JSON/array types for images
    const images = Array.isArray(product.images) ? product.images : [];
    const firstImage = (images.length > 0 && typeof images[0] === 'string') ? images[0] : null;

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.thumbnail_url || firstImage || null,
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

// Apply middleware chain: Error Handling -> Logging -> Rate Limiting
export const GET = withErrorHandler(withLogging(withApiRateLimit(handler)));
