import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  Layers,
  Quote,
  BookOpen,
  Languages as LanguagesIcon,
  Sparkles,
  Share2,
  FileText,
  type LucideIcon,
} from "lucide-react";

/**
 * Admin content model — the single source of truth for the prototype UI.
 *
 * This mirrors the shape we'll store in Supabase later: one row per entity,
 * localized text fields held as a per-locale map ({ en, ja, fil, ceb }). The
 * admin forms and list views are generated from these definitions, so wiring
 * the real DB later is a matter of swapping the mock data source — the UI stays.
 */

export const LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "ja", label: "日本語", short: "JA" },
  { code: "fil", label: "Filipino", short: "FIL" },
  { code: "ceb", label: "Cebuano", short: "CEB" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "date-present" // date picker + "Present" checkbox; stores a date or "present"
  | "url"
  | "image"
  | "boolean"
  | "select"
  | "number"
  | "string-list" // add-any-number list of plain strings (résumé bullets/tags)
  | "link-list"; // add-any-number list of { platform, url } links

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  /** Localized fields store a { en, ja, fil, ceb } map and get locale tabs. */
  localized?: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  /** For string-list fields: render each row as a textarea (long text). */
  multiline?: boolean;
}

export interface ContentTypeDef {
  key: string;
  label: string; // plural
  singular: string;
  icon: LucideIcon;
  description: string;
  /** Sidebar/dashboard grouping. Defaults to "Content". */
  group?: string;
  /** Singletons (Profile) have exactly one record and skip the list view. */
  singleton?: boolean;
  /** Field shown as the row's title in the list (localized-aware). */
  primaryField: string;
  /** Optional secondary/subtitle column in the list. */
  secondaryField?: string;
  fields: FieldDef[];
}

// A localized value is a per-locale string map; plain values are string/bool.
export type LocalizedValue = Partial<Record<LocaleCode, string>>;
export interface LinkItem {
  platform: string;
  url: string;
}
export type FieldValue =
  | string
  | boolean
  | string[]
  | LinkItem[]
  | LocalizedValue;
export interface ContentRow {
  id: string;
  published: boolean;
  order: number;
  values: Record<string, FieldValue>;
}

export const CONTENT_TYPES: ContentTypeDef[] = [
  {
    key: "profile",
    label: "Profile",
    singular: "Profile",
    icon: User,
    description: "Your name, headline, bio, and hero stats.",
    singleton: true,
    primaryField: "fullName",
    fields: [
      { name: "fullName", label: "Full name", type: "text" },
      { name: "jobTitle", label: "Job title", type: "text", localized: true },
      { name: "bio", label: "Bio", type: "textarea", localized: true },
      { name: "location", label: "Location", type: "text", localized: true },
      { name: "avatar", label: "Avatar", type: "image" },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    singular: "Experience",
    icon: Briefcase,
    description: "Work history and roles.",
    primaryField: "title",
    secondaryField: "subtitle",
    fields: [
      { name: "title", label: "Role", type: "text", localized: true },
      { name: "subtitle", label: "Company", type: "text", localized: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        localized: true,
      },
      {
        name: "employmentType",
        label: "Employment type",
        type: "select",
        options: ["Full-time", "Part-time"],
      },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "End date", type: "date-present" },
      { name: "watermark", label: "Company logo", type: "image" },
    ],
  },
  {
    key: "education",
    label: "Education",
    singular: "Education",
    icon: GraduationCap,
    description: "Degrees and schooling.",
    primaryField: "title",
    secondaryField: "subtitle",
    fields: [
      { name: "title", label: "Degree", type: "text", localized: true },
      { name: "subtitle", label: "School", type: "text", localized: true },
      {
        name: "level",
        label: "Level",
        type: "select",
        options: ["tertiary", "vocational", "secondary", "primary"],
      },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "End date", type: "date-present" },
    ],
  },
  {
    key: "certificates",
    label: "Certificates",
    singular: "Certificate",
    icon: Award,
    description: "Courses and credentials.",
    primaryField: "title",
    secondaryField: "organization",
    fields: [
      { name: "title", label: "Title", type: "text", localized: true },
      {
        name: "organization",
        label: "Issuer",
        type: "text",
        localized: true,
      },
      { name: "issuedDate", label: "Issued date", type: "date" },
      { name: "credentialId", label: "Credential ID", type: "text" },
      { name: "credentialUrl", label: "Credential URL", type: "url" },
      { name: "logo", label: "Issuer logo", type: "image" },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    singular: "Project",
    icon: FolderGit2,
    description: "Portfolio projects and case studies.",
    primaryField: "title",
    secondaryField: "category",
    fields: [
      { name: "title", label: "Title", type: "text", localized: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        localized: true,
      },
      { name: "category", label: "Category", type: "text" },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["personal", "client", "confidential", "tutorial"],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["completed", "ongoing", "unfinished"],
      },
      { name: "previewUrl", label: "Live URL", type: "url" },
      { name: "codeUrl", label: "Code URL", type: "url" },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    singular: "Skill",
    icon: Layers,
    description: "Tech stack and proficiency.",
    primaryField: "name",
    secondaryField: "category",
    fields: [
      { name: "name", label: "Name", type: "text" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["backend", "frontend", "others"],
      },
      { name: "rating", label: "Rating (1-10)", type: "number" },
      { name: "dateStarted", label: "Started", type: "date" },
      { name: "icon", label: "Icon", type: "image" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    icon: Quote,
    description: "Recommendations from colleagues and clients.",
    primaryField: "name",
    secondaryField: "company",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text", localized: true },
      { name: "company", label: "Company", type: "text" },
      { name: "text", label: "Quote", type: "textarea", localized: true },
      { name: "rating", label: "Rating (1-5)", type: "number" },
      { name: "avatar", label: "Avatar", type: "image" },
    ],
  },
  {
    key: "books",
    label: "Books",
    singular: "Book",
    icon: BookOpen,
    description: "Books that shaped how you think and build.",
    primaryField: "title",
    secondaryField: "author",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "author", label: "Author", type: "text" },
      { name: "quote", label: "Quote", type: "textarea", localized: true },
      {
        name: "reflection",
        label: "Reflection",
        type: "textarea",
        localized: true,
      },
      { name: "theme", label: "Theme", type: "text" },
    ],
  },
  {
    key: "languages",
    label: "Languages",
    singular: "Language",
    icon: LanguagesIcon,
    description: "Spoken languages and proficiency.",
    primaryField: "name",
    secondaryField: "level",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "nativeName", label: "Native name", type: "text" },
      {
        name: "level",
        label: "Proficiency",
        type: "select",
        options: ["Native", "Fluent", "Conversational", "Basic"],
      },
      { name: "note", label: "Note", type: "text", localized: true },
      { name: "flagIcon", label: "Flag", type: "image" },
    ],
  },
  {
    key: "services",
    label: "Services",
    singular: "Service",
    icon: Sparkles,
    description: "What you offer.",
    primaryField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", localized: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        localized: true,
      },
    ],
  },
  {
    key: "socials",
    label: "Social links",
    singular: "Social link",
    icon: Share2,
    description: "GitHub, LinkedIn, email, etc.",
    primaryField: "platform",
    secondaryField: "url",
    fields: [
      { name: "platform", label: "Platform", type: "text" },
      { name: "url", label: "URL", type: "url" },
    ],
  },

  // ── Résumé builder content (ATS-oriented, English only) ─────────────────────
  {
    key: "resume-overview",
    label: "Resume overview",
    singular: "Resume overview",
    icon: FileText,
    description: "Résumé summary and contact line.",
    group: "Resume",
    singleton: true,
    primaryField: "summary",
    fields: [
      { name: "summary", label: "Professional summary", type: "textarea" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "links", label: "Links", type: "link-list" },
    ],
  },
  {
    key: "resume-experience",
    label: "Resume experience",
    singular: "Resume experience",
    icon: Briefcase,
    description: "Achievement-oriented work history for the résumé.",
    group: "Resume",
    primaryField: "role",
    secondaryField: "company",
    fields: [
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "employmentType", label: "Employment type", type: "text" },
      { name: "location", label: "Location", type: "text" },
      {
        name: "period",
        label: "Period",
        type: "text",
        placeholder: "Sep 2024 – Present",
      },
      { name: "promotion", label: "Promotion note", type: "text" },
      {
        name: "bullets",
        label: "Bullet points",
        type: "string-list",
        multiline: true,
        placeholder: "Achievement or responsibility",
      },
    ],
  },
  {
    key: "resume-projects",
    label: "Resume projects",
    singular: "Resume project",
    icon: FolderGit2,
    description: "Projects listed on the résumé.",
    group: "Resume",
    primaryField: "name",
    secondaryField: "context",
    fields: [
      { name: "name", label: "Name", type: "text" },
      {
        name: "context",
        label: "Context",
        type: "text",
        placeholder: "Open source",
      },
      { name: "url", label: "URL", type: "url" },
      {
        name: "bullets",
        label: "Bullet points",
        type: "string-list",
        multiline: true,
        placeholder: "What it does / your role",
      },
      {
        name: "stack",
        label: "Tech stack",
        type: "string-list",
        placeholder: "React",
      },
    ],
  },
  {
    key: "resume-skills",
    label: "Resume skills",
    singular: "Resume skill group",
    icon: Layers,
    description: "Skill groups for the résumé (e.g. Backend, Frontend).",
    group: "Resume",
    primaryField: "label",
    fields: [
      {
        name: "label",
        label: "Group label",
        type: "text",
        placeholder: "Backend",
      },
      {
        name: "items",
        label: "Skills",
        type: "string-list",
        placeholder: "Spring Boot",
      },
    ],
  },
  {
    key: "resume-education",
    label: "Resume education",
    singular: "Resume education",
    icon: GraduationCap,
    description: "Education entries on the résumé.",
    group: "Resume",
    primaryField: "degree",
    secondaryField: "school",
    fields: [
      { name: "degree", label: "Degree", type: "text" },
      { name: "school", label: "School", type: "text" },
      {
        name: "period",
        label: "Period",
        type: "text",
        placeholder: "2016 – 2021",
      },
    ],
  },
  {
    key: "resume-certifications",
    label: "Resume certifications",
    singular: "Resume certification group",
    icon: Award,
    description: "Certification groups on the résumé.",
    group: "Resume",
    primaryField: "issuer",
    secondaryField: "year",
    fields: [
      {
        name: "issuer",
        label: "Issuer",
        type: "text",
        placeholder: "LinkedIn Learning",
      },
      { name: "year", label: "Year", type: "text", placeholder: "2025" },
      {
        name: "titles",
        label: "Certificate titles",
        type: "string-list",
        placeholder: "Spring Boot 3 Essential Training",
      },
    ],
  },
];

export function getContentType(key: string): ContentTypeDef | undefined {
  return CONTENT_TYPES.find((t) => t.key === key);
}

/** Resolve a possibly-localized value to a display string for a given locale. */
export function displayValue(
  value: FieldValue | undefined,
  locale: LocaleCode = "en",
): string {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (typeof value[0] === "string") {
      return (value as string[]).filter(Boolean).join(", ");
    }
    return `${value.length} link${value.length > 1 ? "s" : ""}`;
  }
  return value[locale] ?? value.en ?? "";
}
