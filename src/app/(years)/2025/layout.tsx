import type { Metadata } from "next";
import {
  getServerProfile,
  toPostalAddress,
} from "@/lib/content/server-profile";

const BASE_URL = "https://gene-paul-mar-javier.dev";

const describe = (name: string) =>
  `${name}'s 2025 portfolio features a Moonlight Red design built with React, Next.js, Spring Boot, TypeScript, Java, and Vue.js.`;

/**
 * Identity (name, job title, location, social profiles) comes from the CMS.
 * Because `<head>` is server-rendered, this route is dynamic rather than
 * statically prerendered — the cost of keeping metadata in sync with the
 * `profile` and `socials` tables.
 *
 * The keyword list and JSON-LD `alternateName` stay hardcoded on purpose: those
 * are hand-tuned SEO spellings and nicknames, not canonical identity, and there
 * is no CMS field that models them.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  const TITLE = `${profile.fullName} — 2025 Portfolio`;
  const DESCRIPTION = describe(profile.fullName);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: TITLE,
      template: `%s | ${profile.fullName} 2025`,
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
    authors: [{ name: profile.fullName, url: BASE_URL }],
    creator: profile.fullName,
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
      siteName: `${profile.fullName} Portfolio`,
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
}

export default async function Layout2025({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, socials } = await getServerProfile();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: [
      "Gene Paul Javier",
      "Paul Javier",
      "Mar Javier",
      "GPM Javier",
      "Gene Javier",
    ],
    url: `${BASE_URL}/2025`,
    image: `${BASE_URL}/ghibli-avatar.png`,
    jobTitle: profile.jobTitle,
    email: profile.email,
    description: describe(profile.fullName),
    address: toPostalAddress(profile.location),
    sameAs: [...socials.map((s) => s.url), BASE_URL],
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
