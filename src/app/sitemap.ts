import type { MetadataRoute } from "next";

const BASE = "https://gene-paul-mar-javier.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    // ── 2026 — latest / current year ─────────────────────────────────────────
    {
      url: `${BASE}/2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    // ── 2025 ─────────────────────────────────────────────────────────────────
    {
      url: `${BASE}/2025`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    // ── 2024 ─────────────────────────────────────────────────────────────────
    {
      url: `${BASE}/2024`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.75,
    },
    {
      url: `${BASE}/2024/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/2024/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/2024/skills`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${BASE}/2024/contacts`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.55,
    },
  ];
}
