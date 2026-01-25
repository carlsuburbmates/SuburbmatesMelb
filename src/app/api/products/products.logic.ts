import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';
import { zodErrorToValidationError, InternalError, DatabaseError } from '@/lib/errors';

const querySchema = z.object({
  vendor_id: z.string().uuid("Invalid vendor ID format"),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export async function productsHandler(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  // Validate input
  const result = querySchema.safeParse({
    vendor_id: searchParams.get('vendor_id'),
    limit: searchParams.get('limit') || undefined,
  });

  if (!result.success) {
    // Transform Zod path (string | number)[] to string[] for compatibility
    const issues = result.error.issues.map(issue => ({
      ...issue,
      path: issue.path.map(p => String(p))
    }));
    throw zodErrorToValidationError({ issues });
  }

  const { vendor_id, limit } = result.data;

  // Check Supabase client
  if (!supabaseAdmin) {
    throw new InternalError("Supabase admin client not initialized");
  }

  // Query products
  // Using supabaseAdmin to bypass RLS for public profile view, assuming this is an admin/public operation
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, title, description, price, category, slug, thumbnail_url, images, created_at')
    .eq('vendor_id', vendor_id)
    .eq('published', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new DatabaseError(error.message, { originalError: error });
  }

  // Transform data to match frontend expectations
  const transformedProducts = products?.map(product => {
    // Safely access images array
    const firstImage = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null;

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.thumbnail_url || firstImage || null,
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
}
