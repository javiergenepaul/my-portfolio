import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    // Tree-shake these packages so only imported symbols end up in the bundle.
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
    ],
  },

  // Allow SVG imports as React components via next.config
  // (SVGs are imported as URLs in this project, which works without extra config)

  // Required for @react-three/fiber / drei in Next.js
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Webpack tweaks needed for three.js server-side suppression
  webpack(config) {
    // Suppress "Can't resolve 'fs'" warnings from three.js in SSR
    config.resolve.fallback = { fs: false, path: false };

    // ─── Image / asset imports → plain URL strings ──────────────────────────
    // This codebase uses <img src={importedAsset}> everywhere (Vite-style).
    // Next.js's next-image-loader returns StaticImageData objects, which
    // render as "[object Object]" in src attributes.
    //
    // Fix: walk all rules (including nested oneOf), exclude our image types
    // from any next-image-loader rule, then add our own asset/resource rule
    // at the front so imports return plain URL strings.
    const IMAGE_RE = /\.(svg|png|jpg|jpeg|gif|webp|ico)$/i;

    const excludeFromImageLoader = (rules: any[]) => {
      for (const rule of rules) {
        if (rule.oneOf) {
          excludeFromImageLoader(rule.oneOf);
          continue;
        }
        const loaderStr = String(rule.loader ?? "");
        const uses: any[] = Array.isArray(rule.use)
          ? rule.use
          : rule.use
          ? [rule.use]
          : [];
        const isNextImageLoader =
          loaderStr.includes("next-image-loader") ||
          uses.some(
            (u) =>
              typeof u === "object" &&
              String(u.loader ?? "").includes("next-image-loader")
          );
        if (isNextImageLoader) {
          rule.exclude = ([] as any[])
            .concat(rule.exclude ?? [])
            .concat(IMAGE_RE);
        }
      }
    };

    excludeFromImageLoader(config.module.rules);

    // Our rule runs first and returns a URL string for all image/SVG imports.
    config.module.rules.unshift({ test: IMAGE_RE, type: "asset/resource" });

    // PDF files (not handled by Next.js at all — safe to push)
    config.module.rules.push({ test: /\.pdf$/, type: "asset/resource" });

    return config;
  },

  // Allow cross-origin iframes (for YearPreview)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
