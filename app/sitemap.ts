import type { MetadataRoute } from "next";
import { SITE_URL, localePath } from "./lib/i18n";

const paths = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/work", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map(({ path, priority }) => ({
    url: `${SITE_URL}${localePath("es", path)}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: {
        es: `${SITE_URL}${localePath("es", path)}`,
        en: `${SITE_URL}${localePath("en", path)}`,
      },
    },
  }));
}
