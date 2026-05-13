import { MetadataRoute } from 'next'
import { isPrelaunchSafetyMode } from "@/lib/prelaunch";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://suburbmates.com.au'
  const prelaunchSafetyMode = isPrelaunchSafetyMode();

  if (prelaunchSafetyMode) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${baseUrl}/sitemap.xml`,
      host: baseUrl,
    };
  }
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/vendor/dashboard/',
          '/customer/dashboard/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
