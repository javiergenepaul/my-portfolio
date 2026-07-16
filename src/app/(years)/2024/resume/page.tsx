import type { Metadata } from "next";
import { Resume2024 } from "@/components/2024/resume";
import { getPublishedResumeSections } from "@/lib/content/repository";
import { rowsToResumeData } from "@/screens/2024/resume/resume-data";

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

export default async function ResumePage() {
  const sections = await getPublishedResumeSections();
  const content = rowsToResumeData(sections);
  return <Resume2024 content={content} />;
}
