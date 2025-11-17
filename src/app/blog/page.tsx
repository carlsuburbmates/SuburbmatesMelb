"use client";

import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "How Local Businesses Thrive in Melbourne's Digital Age",
      excerpt:
        "Discover strategies for Melbourne businesses to succeed in the digital marketplace and connect with local customers effectively.",
      author: "Sarah Johnson",
      date: "2024-11-15",
      readTime: "5 min read",
      category: "business",
      image: "/images/business-workspace-grayscale.jpg",
      slug: "local-business-digital-age",
    },
    {
      id: 2,
      title:
        "The Rise of Digital Products: What Melbourne Businesses Need to Know",
      excerpt:
        "Learn about digital product trends and how Melbourne businesses can leverage them to increase revenue and customer engagement.",
      author: "Michael Chen",
      date: "2024-11-10",
      readTime: "7 min read",
      category: "digital-products",
      image: "/images/digital-products-grayscale.jpg",
      slug: "digital-products-trends",
    },
    {
      id: 3,
      title:
        "Building Community: How SuburbMates Connects Melbourne Neighbourhoods",
      excerpt:
        "Explore how SuburbMates is helping Melbourne businesses build stronger relationships with their local communities and customers.",
      author: "Emma Williams",
      date: "2024-11-05",
      readTime: "4 min read",
      category: "community",
      image: "/images/community-connection-grayscale.jpg",
      slug: "melbourne-community-connections",
    },
    {
      id: 4,
      title: "Success Stories: Melbourne Businesses Using SuburbMates",
      excerpt:
        "Real examples of how Melbourne businesses have grown their customer base and increased sales through SuburbMates.",
      author: "David Martinez",
      date: "2024-10-28",
      readTime: "6 min read",
      category: "success-stories",
      image: "/images/customer-shopping-grayscale.jpg",
      slug: "melbourne-business-success",
    },
    {
      id: 5,
      title: "Digital Marketing Tips for Melbourne Small Businesses",
      excerpt:
        "Practical digital marketing strategies specifically tailored for Melbourne small businesses looking to expand their reach.",
      author: "Lisa Anderson",
      date: "2024-10-20",
      readTime: "8 min read",
      category: "marketing",
      image: "/images/digital-marketplace-grayscale.jpg",
      slug: "digital-marketing-tips",
    },
    {
      id: 6,
      title: "Melbourne's Changing Business Landscape: What's Next?",
      excerpt:
        "Insights into Melbourne's evolving business environment and how local entrepreneurs can adapt and thrive.",
      author: "Robert Taylor",
      date: "2024-10-15",
      readTime: "5 min read",
      category: "trends",
      image: "/images/melbourne-skyline-grayscale.jpg",
      slug: "melbourne-business-future",
    },
  ];

  const categories = [
    { id: "all", name: "All Articles" },
    { id: "business", name: "Business" },
    { id: "digital-products", name: "Digital Products" },
    { id: "community", name: "Community" },
    { id: "success-stories", name: "Success Stories" },
    { id: "marketing", name: "Marketing" },
    { id: "trends", name: "Trends" },
  ];

  const filteredPosts =
    activeCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Insights, tips, and stories for Melbourne's local business
              community
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gray-200">
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Featured Image</span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full mb-3">
                    {post.category.replace("-", " ")}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-gray-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{post.author}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get the latest insights, tips, and stories delivered to your inbox.
            Join our community of Melbourne business owners.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-gray-300"
            />
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}
