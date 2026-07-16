import dayjs, { type Dayjs } from "dayjs";
import type {
  ContentBodyInterface,
  PromotionInterface,
  SkillCategory,
  TechStackInterface,
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

/** experience rows → the ContentBody shape the 2024 experience list renders. */
export function rowsToExperience(
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
      abbreviation: str(v.abbreviation) || undefined,
      isWork: v.isWork === true,
      employmentType:
        (str(v.employmentType) ||
          undefined) as ContentBodyInterface["employmentType"],
      watermark: resolveAsset(v.watermark),
      watermarkAlt: pick(v.watermarkAlt, locale) || undefined,
      subtitleUrl: str(v.subtitleUrl) || undefined,
      waterMarkWidth: num(v.watermarkWidth),
      promotion: mapPromotions(v.promotion, locale),
    };
  });
}
