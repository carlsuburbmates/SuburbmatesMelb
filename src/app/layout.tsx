import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SuburbMates - Melbourne's Digital Neighbourhood",
  description:
    "Connect with local businesses and discover digital products in your suburb. No sign-up required to browse.",
  keywords:
    "Melbourne businesses, local directory, digital marketplace, suburb businesses, local services, digital products",
  authors: [{ name: "SuburbMates" }],
  creator: "SuburbMates",
  publisher: "SuburbMates",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://suburbmates.com.au"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connect with local businesses and discover digital products in your suburb. No sign-up required to browse.",
    url: "https://suburbmates.com.au",
    siteName: "SuburbMates",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SuburbMates - Melbourne's Digital Neighbourhood",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connect with local businesses and discover digital products in your suburb. No sign-up required to browse.",
    images: ["/og-image.jpg"],
    creator: "@suburbmates",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification-token-placeholder",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Viewport meta tag - critical for mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        {/* PWA manifest link */}
        <link rel="manifest" href="/manifest.json" />
        {/* Mobile optimization meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SuburbMates" />
        <meta name="theme-color" content="#171717" />
        <meta
          name="format-detection"
          content="telephone=no, address=no, email=no"
        />
        <StructuredData />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          <GoogleAnalytics />

          {/* Skip to main content for screen readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Skip to main content
          </a>

          <Header />
          <main id="main-content" className="pt-16 md:pt-24">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
