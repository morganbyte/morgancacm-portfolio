import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { SITE_URL } from "./lib/site";

const paths = [
  { path: "/", priority: 1 },
  ...projects.map((p) => ({ path: `/work/${p.slug}`, priority: 0.7 })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
