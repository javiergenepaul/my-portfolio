import type { Metadata } from "next";
import { Layout2024Client } from "./layout-client";

const BASE_URL = "https://gene-paul-mar-javier.dev";
const TITLE = "Gene Paul Mar Javier — 2024 Portfolio";
const DESCRIPTION =
  "Gene Paul Mar Javier's 2024 portfolio — Full-Stack Engineer from Cebu, Philippines. Projects and skills in React, Spring Boot, TypeScript, Java, and Ant Design.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: TITLE,
    template: "%s | Gene Paul Mar Javier 2024",
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
    "Gene Paul Javier portfolio 2024",
    "full-stack developer 2024",
    "React developer Cebu",
    "Spring Boot developer Philippines",
    "TypeScript developer",
    "Java software engineer",
    "web developer portfolio",
    "frontend developer",
    "backend developer",
    "Ant Design",
    "MobX",
    "REST API",
    "microservices",
  ],
  icons: {
    icon: [{ url: "/favicons/2024.svg", type: "image/svg+xml" }],
  },
  alternates: { canonical: `${BASE_URL}/2024` },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/2024`,
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
  url: `${BASE_URL}/2024`,
  image: `${BASE_URL}/jav-profile.png`,
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
