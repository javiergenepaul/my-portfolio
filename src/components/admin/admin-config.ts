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
import { MOCKUP_SIZE_HINT } from "@/lib/mockups/templates";

/**
 * Admin content model — the single source of truth for the admin UI *and* the
 * database mapping. One row per entity; localized fields are per-locale maps
 * ({ en, ja, fil, ceb }); the admin forms and list views are generated from
 * these definitions.
 *
 * IMPORTANT — these field defs drive the DB round-trip in lib/content/
 * repository.ts: every field's name is snake_cased to a column (columnFor), and
 * ONLY listed fields are selected and written. So each field name here MUST map
 * to a real column, or the SELECT fails.
 *
 * Some tables carry richly-nested columns (experience.promotion,
 * projects.carousel / key_contribution, profile.stats, services.sub_details)
 * that don't have a flat widget yet. They're intentionally omitted below. That
 * is safe: an UPDATE only writes the columns listed here, so those columns keep
 * their seeded values when a row is edited. A brand-new row leaves them at their
 * table default until a dedicated repeater UI is built.
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
  | "rating" // star picker constrained to `max` (see FieldDef.max/half)
  | "string-list" // add-any-number list of plain strings (résumé bullets/tags)
  | "stack-list" // list of stack names, each picked from a dropdown of stacks
  | "link-list" // add-any-number list of { platform, url } links
  | "mockup-list" // draggable list of framed mockups (screenshot + template)
  | "contribution-list"; // list of localized { name, description } key contributions

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
  /** For rating fields: number of stars (max value). Defaults to 5. */
  max?: number;
  /** For rating fields: allow half-star (0.5) steps. */
  half?: boolean;
  /** Show this field only when the predicate passes (reads the whole record).
   *  Purely a UI concern — the column is still written on save. */
  showIf?: (record: Record<string, FieldValue>) => boolean;
  /** Groups the field under a section tab in the edit form. Only used when the
   *  content type defines `tabs`; fields with no `tab` fall in the first one. */
  tab?: string;
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
  /** Header for the primary column. Defaults to the singular name. */
  primaryLabel?: string;
  /** Optional secondary/subtitle column in the list. */
  secondaryField?: string;
  /** Ordered section tabs for the edit form. When set, the form groups fields
   *  by their `tab` and shows one section at a time (less scrolling). Empty
   *  sections (all fields hidden) are dropped automatically. */
  tabs?: string[];
  fields: FieldDef[];
}

// A localized value is a per-locale string map; plain values are string/bool.
export type LocalizedValue = Partial<Record<LocaleCode, string>>;
export interface LinkItem {
  platform: string;
  url: string;
}
/** One entry in a project's mockup list — a screenshot dropped into a frame. */
export interface MockupItem {
  id: string;
  template: string;
  screenshot: string;
}
/** One project key-contribution — a localized title + detail. */
export interface ContributionItem {
  name: LocalizedValue;
  description: LocalizedValue;
}
export type FieldValue =
  | string
  | boolean
  | string[]
  | LinkItem[]
  | MockupItem[]
  | ContributionItem[]
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
      // job_title is plain text in the source (a constant, not translated).
      { name: "jobTitle", label: "Job title", type: "text" },
      { name: "bio", label: "Bio", type: "textarea", localized: true },
      { name: "location", label: "Location", type: "text", localized: true },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "careerStartDate", label: "Career start date", type: "date" },
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
      { name: "isWork", label: "Work (vs. volunteer/other)", type: "boolean" },
      { name: "abbreviation", label: "Abbreviation", type: "text" },
      { name: "subtitleUrl", label: "Company URL", type: "url" },
      { name: "watermark", label: "Company logo", type: "image" },
      { name: "stack", label: "Tech stack", type: "stack-list" },
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
        name: "description",
        label: "Description",
        type: "textarea",
        localized: true,
      },
      {
        name: "level",
        label: "Level",
        type: "select",
        options: ["tertiary", "vocational", "secondary", "primary"],
      },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "End date", type: "date-present" },
      { name: "abbreviation", label: "Abbreviation", type: "text" },
      { name: "subtitleUrl", label: "School URL", type: "url" },
      { name: "stack", label: "Tech stack", type: "stack-list" },
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
    tabs: ["Details", "Contributions", "Media", "Links & stack"],
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        localized: true,
        tab: "Details",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        localized: true,
        tab: "Details",
      },
      // category is a text[] in the DB (a project has several tags).
      {
        name: "category",
        label: "Categories",
        type: "string-list",
        placeholder: "Web Development",
        tab: "Details",
      },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["personal", "client", "confidential", "tutorial"],
        tab: "Details",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["completed", "ongoing", "unfinished"],
        tab: "Details",
      },
      { name: "company", label: "Company", type: "text", tab: "Details" },
      { name: "date", label: "Date", type: "date", tab: "Details" },
      { name: "hidden", label: "Hidden", type: "boolean", tab: "Details" },
      {
        name: "keyContribution",
        label: "Key contributions",
        type: "contribution-list",
        help: "Highlights shown in the project's contributions modal — each a title + detail. Localized to the tab above.",
        tab: "Contributions",
      },
      {
        name: "mockups",
        label: "Mockups",
        type: "mockup-list",
        help: `Screenshots shown as a carousel on the card, each dropped into a device frame. Drag to reorder. Suggested sizes — ${MOCKUP_SIZE_HINT}.`,
        tab: "Media",
      },
      {
        name: "previewUrl",
        label: "Live URL",
        type: "url",
        tab: "Links & stack",
      },
      {
        name: "codeUrl",
        label: "Code URL",
        type: "url",
        tab: "Links & stack",
      },
      { name: "stack", label: "Tech stack", type: "stack-list", tab: "Links & stack" },
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
      {
        name: "organizationAlt",
        label: "Issuer logo alt text",
        type: "text",
        localized: true,
      },
      { name: "issuedDate", label: "Issued date", type: "date" },
      { name: "credentialId", label: "Credential ID", type: "text" },
      { name: "credentialUrl", label: "Credential URL", type: "url" },
      { name: "organizationImg", label: "Issuer logo", type: "image" },
      { name: "stack", label: "Tech stack", type: "stack-list" },
    ],
  },

  {
    key: "skills",
    label: "Skills",
    singular: "Skill",
    icon: Layers,
    description: "Tech stack and proficiency.",
    primaryField: "label",
    primaryLabel: "Name",
    secondaryField: "name",
    fields: [
      {
        name: "name",
        label: "Key",
        type: "text",
        help: "Stable identifier (e.g. springBoot) — referenced across the site. Avoid changing.",
      },
      { name: "label", label: "Display name", type: "text", localized: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          "backend",
          "frontend",
          "design",
          "devops",
          "testing",
          "tools",
        ],
      },
      { name: "rate", label: "Rating", type: "rating", max: 10 },
      { name: "url", label: "URL", type: "url" },
      { name: "icon", label: "Icon", type: "image" },
      { name: "alt", label: "Icon alt text", type: "text" },
      { name: "isFavorite", label: "Favorite", type: "boolean" },
      { name: "isStudying", label: "Currently learning", type: "boolean" },
      { name: "dateStarted", label: "Started", type: "date" },
      { name: "dateEnded", label: "Ended", type: "date-present" },
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
      { name: "title", label: "Title", type: "text", localized: true },
      { name: "author", label: "Author", type: "text" },
      { name: "quote", label: "Quote", type: "textarea", localized: true },
      {
        name: "reflection",
        label: "Reflection",
        type: "textarea",
        localized: true,
      },
      { name: "theme", label: "Theme", type: "text", localized: true },
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
      { name: "stack", label: "Tech stack", type: "stack-list" },
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
      { name: "locale", label: "Locale code", type: "text" },
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
    key: "socials",
    label: "Social links",
    singular: "Social link",
    icon: Share2,
    description: "GitHub, LinkedIn, email, etc.",
    primaryField: "key",
    secondaryField: "url",
    fields: [
      // Source distinguishes key (e.g. "linkedIn") from icon (e.g. "linkedin").
      { name: "key", label: "Key", type: "text" },
      { name: "icon", label: "Icon", type: "text" },
      { name: "url", label: "URL", type: "url" },
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
      { name: "rating", label: "Rating", type: "rating", max: 5, half: true },
      { name: "service", label: "Service", type: "text" },
      {
        name: "relationship",
        label: "Relationship",
        type: "select",
        options: ["Colleague", "Manager", "Peer", "Mentor", "Client"],
      },
      { name: "links", label: "Social links", type: "link-list" },
      { name: "avatar", label: "Avatar", type: "image" },
    ],
  },

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
