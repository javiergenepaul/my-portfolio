import type { Metadata } from "next";
import { getServerProfile } from "@/lib/content/server-profile";
import { Projects2024 } from "@/components/2024/projects";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  const n = profile.fullName;
  const DESCRIPTION = `Explore ${n}'s 2024 software projects — full-stack web apps, microservices, and open-source contributions.`;

  return {
    title: "Projects",
    description: DESCRIPTION,
    alternates: { canonical: "/2024/projects" },
    openGraph: {
      title: `Projects — ${n}`,
      description: DESCRIPTION,
      url: "https://genepaulmarjavier.dev/2024/projects",
    },
  };
}

export default function ProjectsPage() {
  return <Projects2024 />;
}
