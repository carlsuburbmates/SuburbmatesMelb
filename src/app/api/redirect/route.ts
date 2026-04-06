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
    // Accept productId or id (slug or UUID)
    const productId = searchParams.get('productId') || searchParams.get('id');

    if (!productId) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

    let query = supabase
      .from('products')
      .select('id, vendor_id, product_url, is_active, is_archived')
      .eq('is_active', true)
      .is('is_archived', false)
      .is('deleted_at', null);

    if (isUuid) {
      query = query.eq('id', productId);
    } else {
      query = query.eq('slug', productId);
    }

    const { data: product, error } = await query.single();

    if (error || !product || !product.product_url) {
      console.warn('Redirect error: Product not found, inactive, archived, or missing product_url', error);
      // Fallback to homepage to prevent leaks
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Log the click (Zero-PII Mandate)
    try {
      await supabase.from('outbound_clicks').insert({
        product_id: product.id,
        vendor_id: product.vendor_id,
      });
    } catch (logError) {
      console.error('Failed to log outbound click (analytics failure, proceeding with redirect):', logError);
    }

    return NextResponse.redirect(product.product_url, 302);
  } catch (error) {
    console.error('Unexpected redirect API error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
