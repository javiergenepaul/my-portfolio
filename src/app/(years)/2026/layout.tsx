import type { Metadata } from "next";

const BASE_URL = "https://genepaulmarjavier.dev";
const TITLE = "Gene Paul Mar Javier — 2026 Portfolio";
const DESCRIPTION =
  "Full-stack software engineer portfolio for 2026. A MacBook-inspired interactive experience featuring projects, skills, and experience. Aurora theme.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s — Gene Paul Mar Javier",
  },
  description: DESCRIPTION,
  authors: [{ name: "Gene Paul Mar Javier", url: BASE_URL }],
  creator: "Gene Paul Mar Javier",
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/2026" },
  keywords: [
    "Gene Paul Mar Javier",
    "full-stack developer",
    "React",
    "Next.js",
    "Spring Boot",
    "TypeScript",
    "Java",
    "software engineer",
    "portfolio 2026",
    "Cebu Philippines developer",
    "macOS portfolio",
    "Aurora theme",
  ],
  icons: {
    icon: "/favicons/2026.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/2026`,
    siteName: "Gene Paul Mar Javier Portfolio",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@genepaulmar",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gene Paul Mar Javier",
  url: `${BASE_URL}/2026`,
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

export default function Layout2026({
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
      <div data-year="2026" className="year-page-enter">
        {children}
      </div>
    </>
  );
}
