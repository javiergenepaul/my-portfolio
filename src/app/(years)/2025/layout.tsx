import type { Metadata } from "next";

const BASE_URL = "https://gene-paul-mar-javier.dev";
const TITLE = "Gene Paul Mar Javier — 2025 Portfolio";
const DESCRIPTION =
  "Gene Paul Mar Javier's 2025 portfolio features a Moonlight Red design built with React, Next.js, Spring Boot, TypeScript, Java, and Vue.js.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: TITLE,
    template: "%s | Gene Paul Mar Javier 2025",
  },
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/2025.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: "/ghibli-avatar.png",
  },
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
  alternates: { canonical: `${BASE_URL}/2025` },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/2025`,
    siteName: "Gene Paul Mar Javier Portfolio",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${BASE_URL}/meta-bg.png`,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@genepaulmar",
    site: "@genepaulmar",
    images: [`${BASE_URL}/meta-bg.png`],
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
