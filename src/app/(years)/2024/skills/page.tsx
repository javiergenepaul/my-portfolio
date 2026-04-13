import type { Metadata } from "next";
import { Skills2024 } from "@/components/2024/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Gene Paul Mar Javier's technical skill set for 2024 — React, Next.js, TypeScript, Spring Boot, Java, and more.",
  alternates: { canonical: "/2024/skills" },
  openGraph: {
    title: "Skills — Gene Paul Mar Javier",
    description:
      "Gene Paul Mar Javier's technical skill set for 2024 — React, Next.js, TypeScript, Spring Boot, Java, and more.",
    url: "https://genepaulmarjavier.dev/2024/skills",
  },
};

export default function SkillsPage() {
  return <Skills2024 />;
}
