import type { Metadata } from "next";
import { Layout2024Client } from "./layout-client";

const BASE_URL = "https://genepaulmarjavier.dev";
const TITLE = "Gene Paul Mar Javier — 2024 Portfolio";
const DESCRIPTION =
  "Full-stack software engineer portfolio for 2024. Featuring projects, skills, and experience in React, Spring Boot, and modern web technologies.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s — Gene Paul Mar Javier",
  },
  description: DESCRIPTION,
  authors: [{ name: "Gene Paul Mar Javier", url: BASE_URL }],
  creator: "Gene Paul Mar Javier",
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/2024" },
  keywords: [
    "Gene Paul Mar Javier",
    "full-stack developer",
    "React",
    "Next.js",
    "Spring Boot",
    "TypeScript",
    "Java",
    "software engineer",
    "portfolio 2024",
    "Cebu Philippines developer",
  ],
  icons: {
    icon: "/favicons/2024.ico",
    apple: "/favicons/2024-apple.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/2024`,
    siteName: "Gene Paul Mar Javier Portfolio",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og/2024.png",
        width: 1200,
        height: 630,
        alt: "Gene Paul Mar Javier — 2024 Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og/2024.png"],
    creator: "@genepaulmar",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gene Paul Mar Javier",
  url: `${BASE_URL}/2024`,
  jobTitle: "Full-Stack Software Engineer",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cebu",
    addressCountry: "PH",
  },
  sameAs: [
    "https://github.com/javiergenepaul",
    "https://linkedin.com/in/gene-paul-mar-javier",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "Spring Boot",
    "TypeScript",
    "Java",
    "PostgreSQL",
    "Docker",
  ],
};

export default function Layout2024({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Layout2024Client (FloatingNavigation, BackgroundParticle) must be a
          sibling of data-year — NOT nested inside it. The year-page-enter
          animation uses transform, which creates a new containing block and
          would trap position:fixed children (breaking FloatingNavigation). */}
      <Layout2024Client>
        <div data-year="2024" className="year-page-enter">
          {children}
        </div>
      </Layout2024Client>
    </>
  );
}
