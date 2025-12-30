import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import { ProductCard } from "@/components/marketplace/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Store, ShieldCheck } from "lucide-react";
import { Product } from "@/lib/types";

// Re-using server-side client logic
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const revalidate = 60; // ISR every 60 seconds

export default async function Marketplace() {
  // 1. Fetch Latest Products (Public & Active Vendors)
  // Note: We need to filter by vendor status. Supabase join filter is tricky.
  // We'll fetch products and join vendors.
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      vendors:vendor_id!inner (
         id,
         user_id,
         tier,
         business_profiles:user_id (
            business_name,
            slug,
            profile_image_url
         )
      )
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(12);

  // 2. Fetch Featured Vendors (Premium/Pro)
  const { data: vendors } = await supabase
    .from("vendors")
    .select(`
      tier,
      business_profiles!inner (
        business_name,
        slug,
        profile_image_url,
        profile_description
      )
    `)
    .in("tier", ["premium", "pro"])
    .limit(4);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
             Digital Marketplace
           </h1>
           <p className="max-w-2xl mx-auto text-xl text-gray-500">
             Discover high-quality digital resources from Melbourne's best local experts.
           </p>
        </div>

        {/* Featured Vendors Section */}
        {vendors && vendors.length > 0 && (
          <section className="mb-20">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                   <Store className="w-6 h-6 mr-2 text-blue-600" />
                   Featured Creators
                </h2>
                <Link href="/directory" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                   View all businesses <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vendors.map((v, i) => {
                    const profile = Array.isArray(v.business_profiles) ? v.business_profiles[0] : v.business_profiles;
                    if (!profile) return null;
                    
                    return (
                        <Link key={i} href={`/business/${profile.slug}`} className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                           <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 relative overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                              {profile.profile_image_url ? (
                                 <Image src={profile.profile_image_url} alt={profile.business_name || ""} fill className="object-cover" />
                              ) : (
                                 <div className="w-full h-full bg-gray-200" />
                              )}
                           </div>
                           <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {profile.business_name}
                           </h3>
                           <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                              {profile.profile_description || "Certified local expert."}
                           </p>
                           {v.tier === 'premium' && (
                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200">
                                  <ShieldCheck className="w-3 h-3 mr-1" />
                                  Premium Vendor
                               </span>
                           )}
                        </Link>
                    )
                })}
             </div>
          </section>
        )}

        {/* Latest Products Grid */}
        <section>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Latest Drops</h2>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => {
                  // Normalize vendor data from join
                  // Supabase return types can be tricky with nested arrays/objects
                  const vendorData = Array.isArray(product.vendors) ? product.vendors[0] : product.vendors;
                  const profileData = vendorData && (Array.isArray(vendorData.business_profiles) ? vendorData.business_profiles[0] : vendorData.business_profiles);
                  
                  return (
                    <div key={product.id} className="h-full">
                       <ProductCard 
                          product={{
                            ...(product as Product),
                            slug: product.slug || "",
                            category: product.category || ""
                          }}
                          showVendor={true}
                          vendor={profileData ? {
                              name: profileData.business_name || "Unknown",
                              slug: profileData.slug || "#",
                              imageUrl: profileData.profile_image_url || undefined,
                              isVerified: ['pro', 'premium'].includes(vendorData?.tier || '')
                          } : undefined}
                       />
                    </div>
                  );
              })}
              
              {(!products || products.length === 0) && (
                  <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                      <p className="text-gray-500">No products available yet.</p>
                  </div>
              )}
           </div>
        </section>

      </div>
    </div>
  );
}
