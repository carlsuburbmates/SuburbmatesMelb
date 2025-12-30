import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Sparkles, User, Package } from "lucide-react";

export async function FreshSignals() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  // 1. Get New Studios (Business Profiles)
  const { data: studiosRaw } = await supabase
    .from("business_profiles")
    .select("id, business_name, slug, profile_image_url, suburb_id")
    .eq('is_public', true)
    .order("created_at", { ascending: false })
    .limit(4);

  // Helper to fetch keys
  const suburbIds = studiosRaw?.map(s => s.suburb_id).filter((id): id is number => id !== null) || [];
  
  // Fetch Suburbs
  const suburbsMap: Record<number, string> = {};
  if (suburbIds.length > 0) {
    const { data: suburbs } = await supabase
      .from('lgas')
      .select('id, name')
      .in('id', suburbIds);
    suburbs?.forEach(s => { suburbsMap[s.id] = s.name; });
  }

  const studios = studiosRaw?.map(s => ({
    ...s,
    suburb_name: s.suburb_id ? suburbsMap[s.suburb_id] : null
  })) || [];

  // 2. Get Fresh Drops (Products)
  const { data: productsRaw } = await supabase
    .from("products")
    .select("id, title, price, thumbnail_url, vendor_id")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const vendorIds = productsRaw?.map(p => p.vendor_id).filter((id): id is string => !!id) || [];
  
  // Fetch Vendors and User IDs
  const vendorMap: Record<string, { business_name: string, user_id: string }> = {};
  const userIds: string[] = [];
  
  if (vendorIds.length > 0) {
     const { data: vendors } = await supabase
       .from('vendors')
       .select('id, business_name, user_id')
       .in('id', vendorIds);
     
     vendors?.forEach(v => {
       if (v.user_id) userIds.push(v.user_id);
       vendorMap[v.id] = { business_name: v.business_name || '', user_id: v.user_id || '' };
     });
  }

  // Fetch Slugs from Business Profiles via User ID
  const slugMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('business_profiles')
      .select('user_id, slug')
      .in('user_id', userIds);
    
    profiles?.forEach(p => {
       if (p.user_id) slugMap[p.user_id] = p.slug || '';
    });
  }

  const products = productsRaw?.map(p => {
    const v = p.vendor_id ? vendorMap[p.vendor_id] : null;
    const slug = v?.user_id ? slugMap[v.user_id] : null;
    return {
      ...p,
      business_name: v?.business_name,
      slug: slug
    };
  }) || [];

  if (studios.length === 0 && products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Recent Studios */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">New Studios</h2>
            </div>
            {studios.length === 0 ? (
              <p className="text-gray-500 text-sm">No new studios yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {studios.map((studio) => (
                  <Link
                    key={studio.id}
                    href={studio.slug ? `/business/${studio.slug}` : '#'}
                    className="group bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                      {studio.profile_image_url ? (
                        <Image
                          src={studio.profile_image_url}
                          alt={studio.business_name || 'Studio'}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                          {(studio.business_name || 'S').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {studio.business_name || 'Unnamed Studio'}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1">{studio.suburb_name || "Melbourne"}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link 
              href="/directory" 
              className="inline-block text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
            >
              Browse all studios &rarr;
            </Link>
          </div>

          {/* Fresh Drops */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">Fresh Drops</h2>
            </div>
            {products.length === 0 ? (
              <p className="text-gray-500 text-sm">No new products yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((product) => {
                  return (
                    <Link
                      key={product.id}
                      href={product.slug ? `/business/${product.slug}` : '#'}
                      className="group bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-3"
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                        {product.thumbnail_url ? (
                          <Image
                            src={product.thumbnail_url}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-xs text-emerald-600 font-medium mt-1">
                          {product.price ? `$${product.price}` : 'Free'}
                        </p>
                        {product.business_name && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            by {product.business_name}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link 
              href="/marketplace" 
              className="inline-block text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
            >
              Browse marketplace &rarr;
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
