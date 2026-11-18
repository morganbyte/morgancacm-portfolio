import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { SITE_URL, localePath } from "./lib/i18n";

const paths = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/work", priority: 0.8 },
  ...projects.map((p) => ({ path: `/work/${p.slug}`, priority: 0.7 })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map(({ path, priority }) => ({
    url: `${SITE_URL}${localePath("en", path)}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: {
        en: `${SITE_URL}${localePath("en", path)}`,
        es: `${SITE_URL}${localePath("es", path)}`,
      },
    },
  }));
}
