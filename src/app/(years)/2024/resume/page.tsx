import type { Metadata } from "next";
import { Resume2024 } from "@/components/2024/resume";
import { getPublishedResumeSections } from "@/lib/content/repository";
import { getServerProfile } from "@/lib/content/server-profile";
import { rowsToResumeData } from "@/screens/2024/resume/resume-data";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  return {
    title: "Resume Builder",
    description: `Build and export a professional resume for ${profile.fullName} — choose a template, color theme, and download as PDF.`,
    alternates: { canonical: "/2024/resume" },
    openGraph: {
      title: `Resume Builder — ${profile.fullName}`,
      description:
        "Build and export a professional resume. Choose from Simple or Modern templates with custom color themes.",
      url: "https://genepaulmarjavier.dev/2024/resume",
    },
  };
}

export default async function ResumePage() {
  // Server-side render, so the name comes straight from the DB rather than
  // waiting on the client content store.
  const [sections, { profile }] = await Promise.all([
    getPublishedResumeSections(),
    getServerProfile(),
  ]);
  const content = rowsToResumeData(sections, profile);
  return <Resume2024 content={content} />;
}
