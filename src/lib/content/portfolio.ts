import dayjs, { type Dayjs } from "dayjs";
import type {
  BookInterface,
  CertificateCardInterface,
  ContentBodyInterface,
  LanguageInterface,
  ProjectInterface,
  PromotionInterface,
  ServiceOfferInterface,
  SkillCategory,
  TechStackInterface,
  TestimonialInterface,
} from "@/config/types";
import type { ContentRow, FieldValue } from "@/components/admin/admin-config";
import type { LanguageType } from "@/stores/language-store";
import { resolveAsset } from "./asset-registry";

/**
 * Maps stored content rows (from the shared content store) into the typed
 * shapes the portfolio sections render. Text/dates/nested data come from the
 * DB; images resolve to bundled assets via the asset registry.
 *
 * Every mapper takes the current locale and picks it out of the per-locale
 * jsonb maps, so language switching re-renders with the right copy.
 */

/** Pick a localized value ({en,ja,…}) for the current locale, or a plain string. */
function pick(v: FieldValue | undefined, locale: LanguageType): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const m = v as Record<string, string>;
    return m[locale] ?? m.en ?? "";
  }
  return "";
}

const str = (v: FieldValue | undefined): string =>
  typeof v === "string" ? v : "";

const num = (v: FieldValue | undefined): number | undefined =>
  typeof v === "number" ? v : v ? Number(v) : undefined;

/** A date column that may hold the literal "present". */
const dateOrPresent = (v: FieldValue | undefined): Dayjs | "present" =>
  str(v) === "present" ? "present" : dayjs(str(v));

function mapPromotions(
  v: FieldValue | undefined,
  locale: LanguageType,
): PromotionInterface[] | undefined {
  if (!Array.isArray(v) || v.length === 0) return undefined;
  return (v as unknown as Record<string, FieldValue>[]).map((p) => ({
    title: pick(p.title, locale),
    subtitle: pick(p.subtitle, locale),
    description: pick(p.description, locale),
    abbreviation: str(p.abbreviation) || undefined,
    startYear: dayjs(str(p.startYear)),
    endYear: str(p.endYear) === "present" ? "present" : dayjs(str(p.endYear)),
  }));
}

// Category display metadata (key → label + order). The skills rows store only
// the category key; labels/order are presentation, kept in code.
const SKILL_CATEGORY_META: { key: string; label: string }[] = [
  { key: "backend", label: "Backend" },
  { key: "frontend", label: "Frontend" },
  { key: "design", label: "Design & UI" },
  { key: "devops", label: "DevOps & Cloud" },
  { key: "testing", label: "Testing" },
  { key: "tools", label: "Others" },
];

/** name → resolved stack (from the skills master rows). */
function stacksByName(
  skillRows: ContentRow[],
  locale: LanguageType,
): Map<string, TechStackInterface> {
  const map = new Map<string, TechStackInterface>();
  for (const cat of rowsToSkillCategories(skillRows, locale))
    for (const s of cat.stacks) map.set(s.name, s);
  return map;
}

// A stack referenced by a service/project but not (yet) in the Skills table
// still renders its chip — the card resolves the display name via i18n.
const stackFallback = (name: string): TechStackInterface => ({
  name: name as TechStackInterface["name"],
  icon: "",
  url: undefined,
  isFavorite: false,
  rate: 5 as TechStackInterface["rate"],
  dateStarted: "",
  dateEnded: "",
  isStudying: false,
  alt: "",
});

/** Resolve an array of stack-name keys → full stack objects. */
function resolveStacks(
  names: FieldValue | undefined,
  byName: Map<string, TechStackInterface>,
): TechStackInterface[] {
  const list = Array.isArray(names)
    ? (names as unknown[]).filter((x): x is string => typeof x === "string")
    : [];
  return list.map((n) => byName.get(n) ?? stackFallback(n));
}

/** Pull a locale's list out of a per-locale jsonb map ({ en: [...], ja: [...] }). */
function pickList(v: FieldValue | undefined, locale: LanguageType): string[] {
  if (Array.isArray(v))
    return v.filter((x): x is string => typeof x === "string");
  if (v && typeof v === "object") {
    const a =
      (v as Record<string, unknown>)[locale] ??
      (v as Record<string, unknown>).en;
    return Array.isArray(a)
      ? a.filter((x): x is string => typeof x === "string")
      : [];
  }
  return [];
}

/** project rows → the project shape; stacks resolved from the skills rows. */
export function rowsToProjects(
  rows: ContentRow[],
  skillRows: ContentRow[],
  locale: LanguageType,
): ProjectInterface[] {
  const byName = stacksByName(skillRows, locale);
  return rows.map((r) => {
    const v = r.values;
    const carousel = Array.isArray(v.carousel)
      ? (v.carousel as unknown as Record<string, unknown>[]).map((c) => ({
          value: String(c.value ?? ""),
          name: String(c.name ?? ""),
          image: resolveAsset(c.image) ?? String(c.image ?? ""),
        }))
      : [];
    const keyContribution = Array.isArray(v.keyContribution)
      ? (v.keyContribution as unknown as Record<string, FieldValue>[]).map(
          (kc) => ({
            name: pick(kc.name, locale),
            description: pick(kc.description, locale),
          }),
        )
      : [];
    return {
      title: pick(v.title, locale),
      description: pick(v.description, locale),
      date: new Date(str(v.date) || 0),
      keyContribution,
      carousel,
      company: str(v.company) || undefined,
      category: pickList(v.category, locale),
      previewUrl: str(v.previewUrl) || undefined,
      codeUrl: str(v.codeUrl) || undefined,
      type: str(v.type) as ProjectInterface["type"],
      stack: resolveStacks(v.stack, byName),
      projectId: str(v.projectId),
      status: str(v.status) as ProjectInterface["status"],
      hidden: v.hidden === true,
    };
  });
}

/** service rows → the service-offer shape; stacks resolved from the skills rows. */
export function rowsToServices(
  rows: ContentRow[],
  skillRows: ContentRow[],
  locale: LanguageType,
): ServiceOfferInterface[] {
  const byName = stacksByName(skillRows, locale);
  return rows.map((r) => {
    const v = r.values;
    return {
      title: pick(v.title, locale),
      description: pick(v.description, locale),
      subDetails: pickList(v.subDetails, locale),
      stack: resolveStacks(v.stack, byName),
    };
  });
}

/** testimonial rows → the testimonial card shape. `links` jsonb → github/linkedin/behance. */
export function rowsToTestimonials(
  rows: ContentRow[],
  locale: LanguageType,
): TestimonialInterface[] {
  return rows.map((r) => {
    const v = r.values;
    const links = Array.isArray(v.links)
      ? (v.links as unknown as { platform?: string; url?: string }[])
      : [];
    const linkFor = (p: string) =>
      links.find((l) => l.platform === p)?.url || undefined;
    return {
      name: str(v.name),
      role: pick(v.role, locale),
      company: str(v.company),
      avatar: str(v.avatar),
      text: pick(v.text, locale),
      rating: num(v.rating) ?? 5,
      service: str(v.service),
      relationship: str(v.relationship) as TestimonialInterface["relationship"],
      github: linkFor("github"),
      linkedin: linkFor("linkedin"),
      behance: linkFor("behance"),
    };
  });
}

/** language rows → the spoken-language card shape. */
export function rowsToLanguages(
  rows: ContentRow[],
  locale: LanguageType,
): LanguageInterface[] {
  return rows.map((r) => {
    const v = r.values;
    return {
      name: str(v.name),
      nativeName: str(v.nativeName),
      flagIcon: str(v.flagIcon),
      locale: str(v.locale) as LanguageInterface["locale"],
      level: str(v.level) as LanguageInterface["level"],
      note: pick(v.note, locale),
    };
  });
}

/** book rows → the book card shape (title/author/theme plain; quote/reflection localized). */
export function rowsToBooks(
  rows: ContentRow[],
  locale: LanguageType,
): BookInterface[] {
  return rows.map((r) => {
    const v = r.values;
    return {
      title: pick(v.title, locale),
      author: str(v.author),
      quote: pick(v.quote, locale),
      reflection: pick(v.reflection, locale),
      theme: pick(v.theme, locale),
    };
  });
}

/** certificate rows → the certificate card shape. */
export function rowsToCertificates(
  rows: ContentRow[],
  locale: LanguageType,
): CertificateCardInterface[] {
  return rows.map((r) => {
    const v = r.values;
    return {
      title: pick(v.title, locale),
      organization: pick(v.organization, locale),
      organizationImg: resolveAsset(v.organizationImg) ?? "",
      organizationAlt: pick(v.organizationAlt, locale),
      issuedDate: dayjs(str(v.issuedDate)),
      credentialId: str(v.credentialId) || undefined,
      credentialUrl: str(v.credentialUrl),
      stack: pickList(v.stack, locale),
    };
  });
}

/** Flat skill/stack rows → categories grouped for the skills sections. */
export function rowsToSkillCategories(
  rows: ContentRow[],
  locale: LanguageType,
): SkillCategory[] {
  const byCategory = new Map<string, TechStackInterface[]>();
  for (const r of rows) {
    const v = r.values;
    const category = str(v.category);
    const stack: TechStackInterface = {
      name: str(v.name) as TechStackInterface["name"],
      label: pick(v.label, locale) || undefined,
      icon: resolveAsset(v.icon) ?? "",
      url: str(v.url) || undefined,
      isFavorite: v.isFavorite === true,
      rate: (num(v.rate) ?? 5) as TechStackInterface["rate"],
      dateStarted: str(v.dateStarted),
      dateEnded: str(v.dateEnded),
      isStudying: v.isStudying === true,
      alt: str(v.alt),
    };
    const list = byCategory.get(category);
    if (list) list.push(stack);
    else byCategory.set(category, [stack]);
  }
  return SKILL_CATEGORY_META.filter((c) => byCategory.has(c.key)).map((c) => ({
    key: c.key,
    label: c.label,
    stacks: byCategory.get(c.key)!,
  }));
}

/**
 * experience/education rows → the shared ContentBody shape. Both sections use
 * the same card; unset columns (level on experience, promotion/isWork on
 * education) simply come back undefined.
 */
export function rowsToContentBody(
  rows: ContentRow[],
  locale: LanguageType,
): ContentBodyInterface[] {
  return rows.map((r) => {
    const v = r.values;
    return {
      title: pick(v.title, locale),
      subtitle: pick(v.subtitle, locale) || undefined,
      description: pick(v.description, locale),
      startYear: dayjs(str(v.startDate)),
      endYear: dateOrPresent(v.endDate),
      level: (str(v.level) || undefined) as ContentBodyInterface["level"],
      abbreviation: str(v.abbreviation) || undefined,
      isWork: v.isWork === true,
      employmentType: (str(v.employmentType) ||
        undefined) as ContentBodyInterface["employmentType"],
      watermark: resolveAsset(v.watermark),
      watermarkAlt: pick(v.watermarkAlt, locale) || undefined,
      subtitleUrl: str(v.subtitleUrl) || undefined,
      waterMarkWidth: num(v.watermarkWidth),
      promotion: mapPromotions(v.promotion, locale),
      stack: pickList(v.stack, locale),
    };
  });
}
