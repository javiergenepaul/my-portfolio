import type { Metadata } from "next";
import { Resume2024 } from "@/components/portfolio-2024/resume";

export const metadata: Metadata = {
  title: "Resume Builder",
  description:
    "Build and export a professional resume for Gene Paul Mar Javier — choose a template, color theme, and download as PDF.",
  alternates: { canonical: "/2024/resume" },
  openGraph: {
    title: "Resume Builder — Gene Paul Mar Javier",
    description:
      "Build and export a professional resume. Choose from Simple or Modern templates with custom color themes.",
    url: "https://genepaulmarjavier.dev/2024/resume",
  },
};

export default function ResumePage() {
  return <Resume2024 />;
}
