import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not available — SUPABASE_SERVICE_ROLE_KEY missing');
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || searchParams.get('id');

    if (!productId) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

    let query = supabaseAdmin
      .from('products')
      .select('id, vendor_id, product_url, is_active, is_archived')
      .eq('is_active', true)
      .eq('is_archived', false)
      .is('deleted_at', null);

    if (isUuid) {
      query = query.eq('id', productId);
    } else {
      query = query.eq('slug', productId);
    }

    const { data: product, error } = await query.single();

    if (error || !product || !product.product_url) {
      console.warn('Redirect: product not found, inactive, archived, or missing product_url', error);
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Log the click — Zero-PII Mandate (no IP, no user-agent)
    try {
      await supabaseAdmin.from('outbound_clicks').insert({
        product_id: product.id,
        vendor_id: product.vendor_id,
      });
    } catch (logError) {
      console.error('Failed to log outbound click (proceeding with redirect):', logError);
    }

    return NextResponse.redirect(product.product_url, 302);
  } catch (error) {
    console.error('Unexpected redirect API error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
