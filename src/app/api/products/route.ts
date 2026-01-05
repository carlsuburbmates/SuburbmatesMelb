import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { z } from 'zod';

// Validation schema for query parameters
const querySchema = z.object({
  vendor_id: z.string().min(1, 'Vendor ID is required'),
  limit: z.preprocess(
    (val) => (val && typeof val === 'string' ? parseInt(val, 10) : undefined),
    z.number().int().min(1).default(10).transform((val) => Math.min(val, 100))
  ),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const result = querySchema.safeParse({
      vendor_id: searchParams.get('vendor_id'),
      limit: searchParams.get('limit'),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { vendor_id, limit } = result.data;

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      logger.error('supabaseAdmin is not available. Check server configuration.');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Query products
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, title, description, price, category, slug, thumbnail_url, images, created_at')
      .eq('vendor_id', vendor_id)
      .eq('published', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Database error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform data to match frontend expectations
    const transformedProducts = products?.map(product => {
      // Cast images to unknown then to string[] to satisfy TS
      const images = Array.isArray(product.images)
        ? (product.images as string[])
        : [];

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.thumbnail_url || (images.length > 0 ? images[0] : null),
        category: product.category || 'General',
        downloadCount: 0, // Placeholder
        rating: 0, // Placeholder
        slug: product.slug,
        isFeatured: false // Placeholder
      };
    }) || [];

    return NextResponse.json({
      products: transformedProducts
    });

  } catch (error) {
    logger.error('Unexpected API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
