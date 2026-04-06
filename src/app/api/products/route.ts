import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required Supabase environment variables');
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

export async function GET(request: NextRequest) {
  try {
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
    // Note: 'rating' and 'download_count' are not currently in the schema based on other files,
    // so we select known fields and will default others in the transformation.
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, description, price, category_id, slug, image_urls, product_url, created_at')
      .eq('vendor_id', vendorId)
      .eq('is_active', true)
      .eq('is_archived', false)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Database error fetching products:', error);
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
      imageUrl: product.image_urls?.[0] || null,
      image_urls: product.image_urls || [],
      productUrl: product.product_url,
      categoryId: product.category_id,
      category_id: product.category_id,
      downloadCount: 0,
      rating: 0,
      slug: product.slug,
      isFeatured: false
    })) || [];

    return NextResponse.json({
      products: transformedProducts
    });

  } catch (error) {
    console.error('Unexpected API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
