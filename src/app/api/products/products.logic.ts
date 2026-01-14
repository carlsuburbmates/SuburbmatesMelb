import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Validate environment variables
// Note: This might be executed when imported, so we need to ensure env vars are set or we handle it gracefully.
// In the route.ts, it was top-level. Here we can keep it top-level or move to inside function.
// For testability, it's better inside or we mock process.env.
// But createClient needs them.

export async function getProducts(request: NextRequest) {
  // Check env vars inside to allow testing without top-level crash if mocked
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error('❌ Missing required Supabase environment variables');
    // We might want to throw or return 500 here if they are missing
    // But for now we proceed as the original code did (it logged and continued, then probably crashed on createClient if not handled)
    // Actually, createClient will throw if url is undefined.
  }

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

  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendor_id');
    const rawLimit = parseInt(searchParams.get('limit') || '10');
    // Cap limit at 100 to prevent DoS
    const limit = Math.min(Math.abs(rawLimit), 100);

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Query products
    const { data: products, error } = await supabase
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

  } catch (error) {
    logger.error('Unexpected API error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
