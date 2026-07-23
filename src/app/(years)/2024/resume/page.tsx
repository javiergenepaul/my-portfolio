import type { Metadata } from "next";
import { Resume2024 } from "@/components/2024/resume";
import {
  getPublishedResumeSections,
  getPublishedRows,
} from "@/lib/content/repository";
import { getContentType } from "@/components/admin/admin-config";
import { rowsToProfile } from "@/lib/content/portfolio";
import { PROFILE_FALLBACK } from "@/config/data/personal";
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
  const profileDef = getContentType("profile")!;
  const [sections, profileRows] = await Promise.all([
    getPublishedResumeSections(),
    getPublishedRows(profileDef),
  ]);
  // Server-side render, so the name comes straight from the DB rather than
  // waiting on the client content store.
  const profile = rowsToProfile(profileRows, "en", PROFILE_FALLBACK);
  const content = rowsToResumeData(sections, profile);
  return <Resume2024 content={content} />;
}
