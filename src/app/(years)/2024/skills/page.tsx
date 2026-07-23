import type { Metadata } from "next";
import { getServerProfile } from "@/lib/content/server-profile";
import { Skills2024 } from "@/components/2024/skills";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  const n = profile.fullName;
  const DESCRIPTION = `${n}'s technical skill set for 2024 — React, Next.js, TypeScript, Spring Boot, Java, and more.`;

  return {
    title: "Skills",
    description: DESCRIPTION,
    alternates: { canonical: "/2024/skills" },
    openGraph: {
      title: `Skills — ${n}`,
      description: DESCRIPTION,
      url: "https://genepaulmarjavier.dev/2024/skills",
    },
  };
}

export default function SkillsPage() {
  return <Skills2024 />;
}
