import type { Metadata } from "next";
import type { ProfileInterface, SocialLinkInterface } from "@/config/types";
import {
  getServerProfile,
  toPostalAddress,
} from "@/lib/content/server-profile";

const BASE_URL = "https://gene-paul-mar-javier.dev";
const describe = (name: string) =>
  `${name}'s 2027 portfolio — coming soon. Full-Stack Engineer from Cebu, Philippines working with React, Next.js, Spring Boot, TypeScript, and Java.`;

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
  const TITLE = `${profile.fullName} — 2027 Portfolio`;
  const DESCRIPTION = describe(profile.fullName);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: TITLE,
      template: `%s | ${profile.fullName} 2027`,
    },
    description: DESCRIPTION,
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicons/2027.svg", type: "image/svg+xml" },
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
      "Gene Paul Javier portfolio 2027",
      "full-stack developer 2027",
      "React developer Philippines",
      "Next.js developer",
      "Spring Boot engineer",
      "TypeScript developer",
      "Java software engineer",
      "web developer portfolio",
      "Cebu developer",
    ],
    alternates: { canonical: `${BASE_URL}/2027` },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${BASE_URL}/2027`,
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
  url: `${BASE_URL}/2027`,
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

export default async function Layout2027({
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
      <div data-year="2027" className="year-page-enter">
        {children}
      </div>
    </>
  );
}
