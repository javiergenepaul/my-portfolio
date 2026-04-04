import type { Metadata } from "next";
import { Projects2024 } from "@/components/portfolio-2024/projects";

export const metadata: Metadata = {
  title: "Projects — 2024",
};

export default function ProjectsPage() {
  return <Projects2024 />;
}
