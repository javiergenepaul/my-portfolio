import type { MetadataRoute } from "next";

const BASE = "https://genepaulmarjavier.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,               lastModified: new Date(), changeFrequency: "monthly",  priority: 1   },
    { url: `${BASE}/2026`,     lastModified: new Date(), changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE}/2025`,     lastModified: new Date(), changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/2024`,     lastModified: new Date(), changeFrequency: "yearly",   priority: 0.8 },
    { url: `${BASE}/2024/about`,    lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/2024/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/2024/contacts`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];
}
