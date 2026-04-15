import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gene Paul Mar Javier Portfolio",
    short_name: "GPM Portfolio",
    description:
      "Gene Paul Mar Javier portfolio showcasing 2024, 2025, 2026, and 2027 experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#081018",
    theme_color: "#081018",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/ghibli-avatar.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
