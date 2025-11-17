"use client";

import {
  BarChart3,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  LogOut,
  Package,
  Plus,
  Settings,
  Star,
  Store,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    totalOrders: 89,
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

const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    product: "Website Design Package",
    amount: 299,
    status: "completed",
    date: "2024-03-15",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    product: "SEO Optimization",
    amount: 199,
    status: "completed",
    date: "2024-03-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Davis",
    product: "Social Media Management",
    amount: 149,
    status: "pending",
    date: "2024-03-13",
  },
];

const mockEarnings = {
  thisMonth: 2847,
  lastMonth: 2156,
  total: 15420,
  pending: 599,
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [business, setBusiness] = useState(mockBusiness);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [earnings, setEarnings] = useState(mockEarnings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleProductStatusChange = (productId: string, newStatus: string) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, status: newStatus } : product
      )
    );
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

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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
                <img
                  alt="SuburbMates logo"
                  width="32"
                  height="32"
                  className="rounded-full object-cover"
                  src="/logo1.jpg"
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
                  href="/directory"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Directory
                </Link>
                <Link
                  href="/marketplace"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Marketplace
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
                  { id: "orders", label: "Orders", icon: CreditCard },
                  { id: "earnings", label: "Earnings", icon: DollarSign },
                  { id: "customers", label: "Customers", icon: Users },
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

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Upgrade to Premium
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Get 50 products and 3 featured slots
                </p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Dashboard Overview
                    </h1>
                    <p className="text-gray-600">
                      Welcome back! Here's how your business is performing.
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
                          Avg Rating
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {business.stats.averageRating}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {business.stats.totalOrders}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
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

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Recent Orders
                  </h1>
                  <p className="text-gray-600">
                    Manage customer orders and payments
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.product}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${order.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
                  <p className="text-gray-600">
                    Track your revenue and payment history
                  </p>
                </div>

                {/* Earnings Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          This Month
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${earnings.thisMonth.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Last Month
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${earnings.lastMonth.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Pending
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${earnings.pending.toLocaleString()}
                        </p>
                      </div>
                      <CreditCard className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment History
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            March 2024 Payment
                          </p>
                          <p className="text-sm text-gray-600">
                            89 orders • ${earnings.thisMonth.toLocaleString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            February 2024 Payment
                          </p>
                          <p className="text-sm text-gray-600">
                            76 orders • ${earnings.lastMonth.toLocaleString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === "customers" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Customers
                  </h1>
                  <p className="text-gray-600">
                    Manage your customer relationships
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Customer Management
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Track customer interactions and manage reviews
                    </p>
                    <button className="btn-primary">
                      View Customer Details
                    </button>
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
