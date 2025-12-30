export function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SuburbMates",
    "description": "Melbourne's digital neighbourhood connecting local businesses with their community",
    "url": "https://suburbmates.com.au",
    "logo": "https://suburbmates.com.au/logo.png",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+61-xxx-xxx-xxx",
      "contactType": "customer service",
      "email": "hello@suburbmates.com.au",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Melbourne",
      "addressRegion": "VIC",
      "addressCountry": "AU"
    },
    "sameAs": [
      "https://twitter.com/suburbmates",
      "https://instagram.com/suburbmates",
      "https://linkedin.com/company/suburbmates"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SuburbMates",
    "url": "https://suburbmates.com.au",
    "description": "Connect with local businesses and discover digital products in your suburb",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://suburbmates.com.au/directory?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SuburbMates",
    "image": "https://suburbmates.com.au/logo.png",
    "description": "Digital marketplace and community platform for Melbourne's local creators",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Melbourne",
      "addressRegion": "Victoria",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-37.8136",
      "longitude": "144.9631"
    },
    "url": "https://suburbmates.com.au",
    "telephone": "+61-xxx-xxx-xxx",
    "priceRange": "Free - $$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessData),
        }}
      />
    </>
  );
}