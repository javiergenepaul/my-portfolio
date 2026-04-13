import type { Metadata } from "next";
import { Projects2024 } from "@/components/2024/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Gene Paul Mar Javier's 2024 software projects — full-stack web apps, microservices, and open-source contributions.",
  alternates: { canonical: "/2024/projects" },
  openGraph: {
    title: "Projects — Gene Paul Mar Javier",
    description:
      "Explore Gene Paul Mar Javier's 2024 software projects — full-stack web apps, microservices, and open-source contributions.",
    url: "https://genepaulmarjavier.dev/2024/projects",
  },
};

export default function ProjectsPage() {
  return <Projects2024 />;
}
