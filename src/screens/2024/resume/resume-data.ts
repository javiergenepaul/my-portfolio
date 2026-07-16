import type {
  ContentRow,
  FieldValue,
  LinkItem,
} from "@/components/admin/admin-config";
import { RESUME_DEFAULT, type ResumeData } from "./resume-content";

/**
 * Maps the résumé content rows (from Supabase, or the admin draft) into the
 * `ResumeData` bundle the templates render. Shared by the admin live preview
 * and the public résumé page so both read the same shape.
 *
 * Name and title aren't stored per-row (they're site-wide constants), so they
 * come from RESUME_DEFAULT. Only published rows are included — for the public
 * page that's every row (the query already filtered), and for the admin draft
 * it hides unpublished entries from the preview.
 */

const str = (v: FieldValue | undefined) => (typeof v === "string" ? v : "");
const arr = (v: FieldValue | undefined) =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.length > 0)
    : [];
const linkArr = (v: FieldValue | undefined): LinkItem[] =>
  Array.isArray(v)
    ? (v.filter((x) => typeof x === "object") as LinkItem[])
    : [];
const linkLabel = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export function rowsToResumeData(
  sections: Record<string, ContentRow[]>,
): ResumeData {
  const ov = sections["resume-overview"]?.[0]?.values ?? {};
  const pub = (key: string) => (sections[key] ?? []).filter((r) => r.published);
  return {
    name: RESUME_DEFAULT.name,
    title: RESUME_DEFAULT.title,
    contact: {
      phone: str(ov.phone),
      email: str(ov.email),
      location: str(ov.location),
      links: linkArr(ov.links)
        .filter((l) => l.url.trim().length > 0)
        .map((l) => ({ url: l.url, label: linkLabel(l.url) })),
    },
    summary: str(ov.summary),
    experience: pub("resume-experience").map((r) => ({
      role: str(r.values.role),
      company: str(r.values.company),
      employmentType: str(r.values.employmentType),
      location: str(r.values.location),
      period: str(r.values.period),
      promotion: str(r.values.promotion) || undefined,
      bullets: arr(r.values.bullets),
    })),
    projects: pub("resume-projects").map((r) => ({
      name: str(r.values.name),
      context: str(r.values.context) || undefined,
      url: str(r.values.url) || undefined,
      bullets: arr(r.values.bullets),
      stack: arr(r.values.stack),
    })),
    skills: pub("resume-skills").map((r) => ({
      label: str(r.values.label),
      items: arr(r.values.items),
    })),
    education: pub("resume-education").map((r) => ({
      degree: str(r.values.degree),
      school: str(r.values.school),
      period: str(r.values.period),
    })),
    certifications: pub("resume-certifications").map((r) => ({
      issuer: str(r.values.issuer),
      year: str(r.values.year),
      titles: arr(r.values.titles),
    })),
  };
}
