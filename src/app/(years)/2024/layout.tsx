import type { Metadata } from "next";
import type { ProfileInterface, SocialLinkInterface } from "@/config/types";
import {
  getServerProfile,
  toPostalAddress,
} from "@/lib/content/server-profile";
import { Layout2024Client } from "./layout-client";

const BASE_URL = "https://gene-paul-mar-javier.dev";
const describe = (name: string) =>
  `${name}'s 2024 portfolio — Full-Stack Engineer from Cebu, Philippines. Projects and skills in React, Spring Boot, TypeScript, Java, and Ant Design.`;

/**
 * Identity (name, job title, location, social profiles) comes from the CMS.
 * Because `<head>` is server-rendered, this reads the DB directly rather than
 * the client content store.
 *
 * The keyword list and JSON-LD `alternateName` stay hardcoded on purpose: those
 * are hand-tuned SEO spellings and nicknames, not canonical identity, and there
 * is no CMS field that models them.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  const TITLE = `${profile.fullName} — 2024 Portfolio`;
  const DESCRIPTION = describe(profile.fullName);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: TITLE,
      template: `%s | ${profile.fullName} 2024`,
    },
    description: DESCRIPTION,
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicons/2024.svg", type: "image/svg+xml" },
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
    alternates: { canonical: `${BASE_URL}/2024` },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${BASE_URL}/2024`,
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

const makeJsonLd = (
  profile: ProfileInterface,
  socials: SocialLinkInterface[],
) => ({
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
  url: `${BASE_URL}/2024`,
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
});

export default async function Layout2024({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, socials } = await getServerProfile();
  const jsonLd = makeJsonLd(profile, socials);

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
