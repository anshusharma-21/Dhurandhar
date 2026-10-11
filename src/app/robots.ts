import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://projectdhurandhar.automationlabs.online";
  const isProduction = baseUrl.includes("projectdhurandhar.automationlabs.online");

  if (!isProduction) {
    // Non-production / staging environment: Strictly noindex (AC-18)
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin/*",
        "/sign-in",
        "/register",
        "/api/",
        "/api/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
