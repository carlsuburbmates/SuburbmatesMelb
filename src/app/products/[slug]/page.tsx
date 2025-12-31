import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, ShieldCheck, Download, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Re-using server-side client logic locally since direct import might cause issues if not standard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. Fetch Product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, vendors:vendor_id(*)")
    .eq("slug", slug)
    .single();

  if (productError || !product) {
    console.error("Product fetch error:", productError);
    notFound();
  }

  // 2. Fetch Business Profile for the Vendor (using user_id from vendor record)
  // We need this for the public face (Name, Logo, Slug)
  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", product.vendors?.user_id || "")
    .single();

  if (!businessProfile) {
    // Fallback if no profile exists (unlikely for active vendor)
    console.warn("No business profile found for vendor", product.vendor_id);
    notFound();
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <div className="mb-8">
           <Link href="/marketplace" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Marketplace
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Media */}
          <div className="space-y-6">
            <div className="aspect-video bg-white rounded-2xl border border-gray-200 overflow-hidden relative shadow-sm">
              {product.thumbnail_url ? (
                <Image
                  src={product.thumbnail_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Download className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>
            {/* Additional thumbnails could go here */}
          </div>

          {/* Right: Product Details & Purchase */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                   {product.category || "Digital Product"}
                 </span>
                 {product.delivery_type && (
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 uppercase tracking-wide">
                     {product.delivery_type}
                   </span>
                 )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {/* Rating placeholder */}
                <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-yellow-900">New</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Vendor Attribution (Middleman UX) */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                     {businessProfile.profile_image_url ? (
                        <Image src={businessProfile.profile_image_url} alt={businessProfile.business_name} fill className="object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">?</div>
                     )}
                  </div>
                  <div>
                     <p className="text-xs text-gray-500">Sold by</p>
                     <Link href={`/business/${businessProfile.slug}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center">
                        {businessProfile.business_name}
                        {/* Simple verified badge if they are pro/premium */}
                        {['pro', 'premium'].includes(product.vendors?.tier || '') && (
                            <Check className="w-3 h-3 ml-1 text-blue-500 bg-blue-50 rounded-full p-0.5" />
                        )}
                     </Link>
                  </div>
               </div>
               <Link href={`/business/${businessProfile.slug}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View Store
               </Link>
            </div>

            <Button size="lg" className="w-full text-lg h-14 bg-gray-900 hover:bg-gray-800">
               Buy Now
            </Button>

            {/* Trust Signals (PR8 Requirement) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
               <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                      <p className="text-sm font-medium text-gray-900">Sold by {businessProfile.business_name}. Payments processed via Stripe.</p>
                      <p className="text-xs text-gray-500 mt-1">
                         SuburbMates is a discovery platform; creators handle sales via Stripe.
                      </p>

                   </div>
               </div>
            </div>

            <div className="prose prose-gray max-w-none">
               <h3 className="text-lg font-semibold text-gray-900">Description</h3>
               <p className="whitespace-pre-wrap text-gray-600 leading-relaxed">
                  {product.description}
               </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const { data: product } = await supabase.from('products').select('title, description').eq('slug', slug).single();
  
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.title} | SuburbMates Marketplace`,
    description: product.description,
  };
}
