"use client";

import {
  BarChart3,
  Edit,
  Eye,
  LogOut,
  Package,
  Plus,
  Settings,
  Star,
  Store,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { UNIVERSAL_PRODUCT_LIMIT } from "@/lib/tier-utils";

// Mock data for demonstration
const mockBusiness = {
  id: "1",
  name: "Melbourne Digital Solutions",
  slug: "melbourne-digital-solutions",
  description: "Providing digital solutions for local Melbourne businesses",
  email: "contact@melbournedigital.com.au",
  phone: "+61 400 000 000",
  suburb: "South Yarra",
  category: "Technology & Digital Services",
  status: "active",
  tier: "premium",
  joinedDate: "2024-01-15",
  stats: {
    totalViews: 15420,
    totalProducts: 12,
    averageRating: 4.8,
  },
};


const mockProducts = [
  {
    id: "1",
    name: "Website Design Package",
    description: "Professional website design for small businesses",
    price: 299,
    status: "published",
    views: 1250,
    orders: 23,
    featured: true,
    createdAt: "2024-03-01",
  },
  {
    id: "2",
    name: "SEO Optimization",
    description: "Search engine optimization for better visibility",
    price: 199,
    status: "published",
    views: 890,
    orders: 15,
    featured: false,
    createdAt: "2024-03-05",
  },
  {
    id: "3",
    name: "Social Media Management",
    description: "Complete social media management package",
    price: 149,
    status: "draft",
    views: 456,
    orders: 8,
    featured: false,
    createdAt: "2024-03-10",
  },
];



function ClaimBanner({ onClaim }: { onClaim: () => void }) {
  return (
    <div className="bg-black text-white p-4 flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-center gap-4">
        <Store className="w-5 h-5 text-slate-400" />
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Concierge Handover In Progress</h4>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Found your pre-seeded profile. Click to finalize ownership.</p>
        </div>
      </div>
      <button 
        onClick={onClaim}
        className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
      >
        Claim Profile
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>}>
      <Dashboard />
    </Suspense>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [business, setBusiness] = useState(mockBusiness);
  const [products, setProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [claimId, setClaimId] = useState<string | null>(null);

  useEffect(() => {
    const claim = searchParams.get('claim');
    if (claim) {
      setClaimId(claim);
      toast.success('Found your seeded profile!', { icon: '🎁' });
    }

    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [searchParams]);

  const handleFinalizeClaim = async () => {
    if (!user || !claimId) return;
    
    setIsLoading(true);
    try {
      // Logic to update the vendor row with the current user's ID
      const { error } = await supabase
        .from('vendors') // Assuming 'vendors' is the table name
        .update({ user_id: user.id })
        .eq('id', claimId);

      if (error) throw error;

      toast.success('Profile successfully claimed!');
      setClaimId(null);
      // Refresh to pull updated vendor context
      window.location.reload();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Claim profile error:', error);
      toast.error(`Failed to claim profile: ${message}. Support has been notified.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureToggle = (productId: string) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, featured: !product.featured }
          : product
      )
    );
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "bg-green-100 text-green-800";
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "premium":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  alt="SuburbMates logo"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  src="/logo1.jpg"
                  priority
                />
                <span className="font-bold text-lg text-gray-900 hidden sm:block">
                  SuburbMates
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/dashboard" className="text-gray-900 font-medium">
                  Dashboard
                </Link>
                <Link
                  href="/regions"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Directory
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Store className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{business.name}</h3>
                <p className="text-sm text-gray-600">{business.suburb}</p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-2 ${getTierColor(
                    business.tier
                  )}`}
                >
                  {business.tier.charAt(0).toUpperCase() +
                    business.tier.slice(1)}{" "}
                  Tier
                </span>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "products", label: "Products", icon: Package },
                  { id: "settings", label: "Settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Directory Quota
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  You are using {business.stats.totalProducts} of {UNIVERSAL_PRODUCT_LIMIT} products limit. Featured slots are managed manually.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {claimId && <ClaimBanner onClaim={handleFinalizeClaim} />}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Dashboard Overview
                    </h1>
                    <p className="text-gray-600">
                      Welcome back! Here&rsquo;s how your business is performing.
                    </p>
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Views
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {business.stats.totalViews.toLocaleString()}
                        </p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Products
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {business.stats.totalProducts}
                        </p>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Average Rating
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {business.stats.averageRating}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Products
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {products.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                product.status
                              )}`}
                            >
                              {product.status}
                            </span>
                            {product.featured && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      My Products
                    </h1>
                    <p className="text-gray-600">
                      Manage your digital products and services
                    </p>
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  product.status
                                )}`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.views.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleFeatureToggle(product.id)
                                  }
                                  className={`p-1 rounded ${
                                    product.featured
                                      ? "text-yellow-600 bg-yellow-100"
                                      : "text-gray-400 hover:text-yellow-600"
                                  }`}
                                  title={
                                    product.featured
                                      ? "Remove from featured"
                                      : "Add to featured"
                                  }
                                >
                                  <Star
                                    className={`h-4 w-4 ${
                                      product.featured ? "fill-current" : ""
                                    }`}
                                  />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-gray-400 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}



            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Business Settings
                  </h1>
                  <p className="text-gray-600">
                    Manage your business profile and preferences
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Business Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={business.name}
                            onChange={(e) =>
                              setBusiness({ ...business, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={business.category}
                            onChange={(e) =>
                              setBusiness({
                                ...business,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option>Technology & Digital Services</option>
                            <option>Food & Beverage</option>
                            <option>Retail</option>
                            <option>Health & Wellness</option>
                            <option>Education</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={business.email}
                            onChange={(e) =>
                              setBusiness({
                                ...business,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={business.phone}
                            onChange={(e) =>
                              setBusiness({
                                ...business,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="btn-primary">Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
