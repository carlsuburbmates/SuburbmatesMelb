import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SuburbMates - Melbourne's Digital Neighbourhood",
  description:
    "Learn about SuburbMates - connecting Melbourne's local creators with their community through a digital marketplace and creator directory.",
  keywords:
    "about, Melbourne creators, local marketplace, digital directory, community platform",
  openGraph: {
    title: "About SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connecting Melbourne's local creators with their community through a digital marketplace and creator directory.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connecting Melbourne's local creators with their community through a digital marketplace and creator directory.",
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
              Melbourne&rsquo;s digital neighbourhood where local creators build
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
              Melbourne is full of world-class digital creators, but they often lack a local home to connect with their own community.
              SuburbMates is Melbourne-first — providing a creator platform where local makers build their brand and list digital products for the neighbourhood.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We&rsquo;re building a space where neighbours can discover the talent right in their backyard, supporting local creators and making &quot;shop local&quot; a digital reality.
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
                  Local-First
                </h3>
                <p className="text-gray-600">
                  We believe digital products shouldn&rsquo;t feel placeless. We connect creators to their actual neighbours.
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
                  Support Creators
                </h3>
                <p className="text-gray-600">
                  We built this for Melbourne&rsquo;s creators, providing a platform to showcase and sell with minimal friction.
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
                  Community Ecosystem
                </h3>
                <p className="text-gray-600">
                  We use technology to strengthen existing community bonds within suburbs.
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
              Whether you&rsquo;re a Melbourne creator looking to grow or a neighbour
              wanting to support local talent, SuburbMates is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/directory" className="btn-primary">
                Browse Local Creators
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
