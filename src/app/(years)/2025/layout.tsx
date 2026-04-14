import type { Metadata } from "next";

const BASE_URL = "https://gene-paul-mar-javier.dev";
const TITLE = "Gene Paul Mar Javier — 2025 Portfolio";
const DESCRIPTION =
  "Gene Paul Mar Javier's 2025 portfolio — Moonlight Red design. Full-Stack Engineer from Cebu, Philippines working with React, Next.js, Spring Boot, TypeScript, Java, and Vue.js.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: TITLE,
    template: "%s | Gene Paul Mar Javier 2025",
  },
  description: DESCRIPTION,
  authors: [{ name: "Gene Paul Mar Javier", url: BASE_URL }],
  creator: "Gene Paul Mar Javier",
  keywords: [
    "Gene Paul Mar Javier",
    "Gene Paul Javier",
    "Paul Javier",
    "Mar Javier",
    "GPM Javier",
    "Gene Javier",
    "Gene Paul Javier portfolio 2025",
    "full-stack developer 2025",
    "React developer Philippines",
    "Next.js developer Cebu",
    "Spring Boot engineer",
    "TypeScript developer",
    "Java software engineer",
    "Vue.js developer",
    "Moonlight Red portfolio",
    "web developer portfolio",
    "Zustand",
    "Material UI",
    "REST API developer",
  ],
  icons: {
    icon: [{ url: "/favicons/2025.svg", type: "image/svg+xml" }],
  },
  alternates: { canonical: `${BASE_URL}/2025` },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/2025`,
    siteName: "Gene Paul Mar Javier Portfolio",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@genepaulmar",
    site: "@genepaulmar",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gene Paul Mar Javier",
  alternateName: [
    "Gene Paul Javier",
    "Paul Javier",
    "Mar Javier",
    "GPM Javier",
    "Gene Javier",
  ],
  url: `${BASE_URL}/2025`,
  image: `${BASE_URL}/ghibli-avatar.png`,
  jobTitle: "Full-Stack Software Engineer",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cebu City",
    addressRegion: "Cebu",
    addressCountry: "PH",
  },
  sameAs: [
    "https://github.com/javiergenepaul",
    "https://linkedin.com/in/gene-paul-mar-javier",
    BASE_URL,
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "Spring Boot",
    "TypeScript",
    "Java",
    "Vue.js",
    "PostgreSQL",
    "MySQL",
    "REST API",
    "Microservices",
  ],
};

export default function Layout2025({
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
      <div data-year="2025" className="year-page-enter">
        {children}
      </div>
    </>
  );
}
