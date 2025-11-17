"use client";

import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const pricingPlans = [
    {
      name: "Basic",
      description:
        "Perfect for small local businesses starting their online presence",
      price: annualBilling ? 0 : 0,
      period: annualBilling ? "/year" : "/month",
      featured: false,
      features: [
        "Up to 3 products",
        "Basic business profile",
        "Directory listing",
        "Customer reviews",
        "Analytics dashboard",
        "Email support",
      ],
      cta: "Get Started",
      ctaLink: "/auth/signup",
    },
    {
      name: "Standard",
      description: "For growing businesses with more products and features",
      price: annualBilling ? 294 : 29,
      period: annualBilling ? "/year" : "/month",
      featured: true,
      features: [
        "Up to 10 products",
        "Enhanced business profile",
        "Directory listing with priority",
        "Customer reviews & ratings",
        "Advanced analytics",
        "Priority email support",
        "Featured in weekly newsletter",
        "Social media integration",
      ],
      cta: "Start Free Trial",
      ctaLink: "/auth/signup",
    },
    {
      name: "Premium",
      description: "For established businesses with extensive product catalogs",
      price: annualBilling ? 990 : 99,
      period: annualBilling ? "/year" : "/month",
      featured: false,
      features: [
        "Up to 50 products",
        "Premium business profile",
        "Directory listing with top priority",
        "Customer reviews & ratings",
        "Advanced analytics with custom reports",
        "24/7 priority support",
        "Featured in weekly newsletter",
        "Social media integration",
        "3 featured product slots",
        "Custom branding options",
        "API access",
        "Bulk product management",
      ],
      cta: "Start Free Trial",
      ctaLink: "/auth/signup",
    },
  ];

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you will immediately get access to all new features. When downgrading, your new plan will take effect at the next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards including Visa, MasterCard, and American Express. All payments are processed securely through our payment partner Stripe.",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No, there are no setup fees for any of our plans. You only pay the monthly or annual subscription fee based on your chosen plan.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no cancellation fees, and you will continue to have access to your plan until the end of your current billing period.",
    },
    {
      question: "What happens if I exceed my product limit?",
      answer:
        "If you reach your product limit, you will have the option to upgrade to a higher plan or archive inactive products to free up space. We will notify you before you reach your limit.",
    },
    {
      question: "Do you offer discounts for annual billing?",
      answer:
        "Yes, annual billing includes a 17% discount compared to monthly billing. You save over two months of subscription fees when paying annually.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business. Start with our free
              Basic plan and upgrade as you grow.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="container-custom py-8">
        <div className="flex items-center justify-center">
          <span
            className={`mr-3 text-sm font-medium ${
              !annualBilling ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnualBilling(!annualBilling)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-pressed={annualBilling}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                annualBilling
                  ? "translate-x-6 bg-gray-900"
                  : "translate-x-1 bg-gray-400"
              }`}
            />
          </button>
          <span
            className={`ml-3 text-sm font-medium ${
              annualBilling ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Annual{" "}
            <span className="text-green-600 font-semibold">(Save 17%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border-2 ${
                plan.featured
                  ? "border-gray-900 bg-white shadow-lg"
                  : "border-gray-200 bg-white"
              } overflow-hidden`}
            >
              {plan.featured && (
                <div className="bg-gray-900 py-2 px-4">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  {plan.price === 0 && (
                    <p className="text-sm text-green-600 mt-1">Forever free</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 px-4 text-center font-medium rounded-lg transition-colors ${
                    plan.featured
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of Melbourne businesses already using SuburbMates to
            grow their online presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="btn-primary btn-cta text-white"
            >
              Create Your Free Account
            </Link>
            <Link
              href="/contact"
              className="btn-secondary text-gray-900 hover:text-gray-900"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container-custom py-8">
          <div className="text-center text-gray-600">
            <p>
              Questions about pricing?{" "}
              <Link
                href="/contact"
                className="text-gray-900 hover:text-gray-700 font-medium"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
