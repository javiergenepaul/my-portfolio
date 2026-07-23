import type { Metadata } from "next";
import { getServerProfile } from "@/lib/content/server-profile";
import { RootLanding } from "@/components/common/root-landing";

const BASE_URL = "https://gene-paul-mar-javier.dev";
export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  const TITLE = `${profile.fullName} — ${profile.jobTitle}`;
  const DESCRIPTION = `${profile.fullName} is a full-stack software engineer from ${profile.location}, building web apps with React, Next.js, Spring Boot, TypeScript, and Java.`;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
      canonical: BASE_URL,
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: BASE_URL,
    },
    twitter: {
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function RootPage() {
  return <RootLanding />;
}
