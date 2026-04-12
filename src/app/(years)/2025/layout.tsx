import type { Metadata } from "next";

const BASE_URL = "https://genepaulmarjavier.dev";
const TITLE = "Gene Paul Mar Javier — 2025 Portfolio";
const DESCRIPTION =
  "Full-stack software engineer portfolio — 2025 edition. Featuring React, Next.js, Spring Boot, TypeScript, and modern web engineering. Built with a Moonlight Red design system.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s — Gene Paul Mar Javier",
  },
  description: DESCRIPTION,
  authors: [{ name: "Gene Paul Mar Javier", url: BASE_URL }],
  creator: "Gene Paul Mar Javier",
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/2025" },
  keywords: [
    "Gene Paul Mar Javier", "full-stack developer", "React", "Next.js",
    "Spring Boot", "TypeScript", "Java", "software engineer", "portfolio 2025",
    "Cebu Philippines developer",
  ],
  icons: {
    icon: [{ url: "/favicons/2025.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/2025`,
    siteName: "Gene Paul Mar Javier Portfolio",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/meta-bg.png",
        width: 1200,
        height: 630,
        alt: "Gene Paul Mar Javier — 2025 Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/meta-bg.png"],
    creator: "@genepaulmar",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gene Paul Mar Javier",
  url: `${BASE_URL}/2025`,
  jobTitle: "Full-Stack Software Engineer",
  description: DESCRIPTION,
  address: { "@type": "PostalAddress", addressLocality: "Cebu", addressCountry: "PH" },
  sameAs: [
    "https://github.com/javiergenepaul",
    "https://linkedin.com/in/gene-paul-mar-javier",
  ],
  knowsAbout: ["React", "Next.js", "Spring Boot", "TypeScript", "Java", "PostgreSQL", "Docker"],
};

export default function Layout2025({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div data-year="2025" className="year-page-enter">
        {children}
      </div>
    </>
  );
}
