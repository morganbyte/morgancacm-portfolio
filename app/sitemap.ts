import type { MetadataRoute } from "next";

const BASE_URL = "https://morgancacm.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/work`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
