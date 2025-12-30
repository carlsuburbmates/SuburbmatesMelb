import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SuburbMates - Melbourne's Digital Neighbourhood",
  description:
    "Learn about SuburbMates - connecting Melbourne's local businesses with their community through a digital marketplace and business directory.",
  keywords:
    "about, Melbourne businesses, local marketplace, digital directory, community platform",
  openGraph: {
    title: "About SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connecting Melbourne's local businesses with their community through a digital marketplace and business directory.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connecting Melbourne's local businesses with their community through a digital marketplace and business directory.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About SuburbMates
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Melbourne&rsquo;s digital neighbourhood where local businesses build
              their brand and sell digital products.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We believe that local businesses are the heart of every community.
              SuburbMates was created to help Melbourne&rsquo;s local businesses
              thrive by providing them with a digital platform to showcase their
              products, connect with customers, and build their brand in the
              modern marketplace.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We&rsquo;re building a digital ecosystem where neighbours can discover
              and support local businesses, making it easier than ever to shop
              local and strengthen community connections.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Community First
                </h3>
                <p className="text-gray-600">
                  We prioritize building genuine connections between local
                  businesses and their communities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Support Local
                </h3>
                <p className="text-gray-600">
                  We&rsquo;re dedicated to helping Melbourne&rsquo;s small businesses grow
                  and succeed in the digital age.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  We use modern technology to create meaningful connections
                  between businesses and customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Local Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Melbourne Suburbs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Team</h2>
            <p className="text-lg text-gray-600 mb-12">
              We&rsquo;re a passionate team of Melburnians dedicated to supporting
              local businesses and building stronger communities.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Sarah Chen
                </h3>
                <p className="text-gray-600 mb-2">Founder & CEO</p>
                <p className="text-sm text-gray-500">
                  Former small business owner passionate about local commerce
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Michael Rodriguez
                </h3>
                <p className="text-gray-600 mb-2">CTO</p>
                <p className="text-sm text-gray-500">
                  Tech expert with 15+ years building community platforms
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Emma Thompson
                </h3>
                <p className="text-gray-600 mb-2">Head of Partnerships</p>
                <p className="text-sm text-gray-500">
                  Community connector with deep local business relationships
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-gray-300 mb-8">
              Whether you&rsquo;re a local business looking to grow or a customer
              wanting to support local, SuburbMates is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/directory" className="btn-primary">
                Browse Local Businesses
              </a>
              <a href="/marketplace" className="btn-secondary">
                Explore Marketplace
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
