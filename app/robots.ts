import type { MetadataRoute } from "next";
import { isProduction } from "./lib/env";
import { SITE_URL } from "./lib/site";

// Only production gets indexed; staging and previews stay out of search.
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
