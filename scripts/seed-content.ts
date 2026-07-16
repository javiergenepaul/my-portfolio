/**
 * Seeds every portfolio content table from the hardcoded source of truth.
 *
 * Run:  pnpm seed:content
 *
 * How localization works here: anything translated in this codebase lives
 * behind a factory (getExperience(), getProjects(), …) that calls translate()
 * at call time. So we swap the i18n singleton to each locale and re-call the
 * factory — giving us one fully-resolved copy per locale, which we zip into the
 * per-locale jsonb maps the tables expect. Plain constants (BOOKS, LANGUAGES,
 * TESTIMONIALS, SKILL_CATEGORIES, SOCIAL_MEDIA_LINK_DATA) contain no
 * translate() calls, so they're read once and stored under "en".
 *
 * Idempotent — every table is cleared and re-inserted.
 * Uses the service-role key (bypasses RLS): CLI only, never shipped.
 */
import { createClient } from "@supabase/supabase-js";
import { messageStore } from "@/i18n/store";
import { en, ja, fil, ceb } from "@/i18n/locale";
import { translate } from "@/i18n/translate";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  MOBILE_NUMBER,
  CAREER_START_DATE,
  getExperience,
  getEducation,
  getProjects,
  getCertificates,
  getServices,
  BOOKS,
  LANGUAGES,
  TESTIMONIALS,
  SKILL_CATEGORIES,
  SOCIAL_MEDIA_LINK_DATA,
} from "@/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw new Error("Missing Supabase env — run via pnpm seed:content");
const db = createClient(url, key, { auth: { persistSession: false } });

const LOCALES: Record<string, unknown> = { en, ja, fil, ceb };
type Loc = Record<string, string>;

/** Run fn() once per locale with the i18n singleton switched. */
function perLocale<T>(fn: () => T): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [code, messages] of Object.entries(LOCALES)) {
    messageStore.init(code, messages as Record<string, unknown>);
    out[code] = fn();
  }
  return out;
}

/** Pull one field out of per-locale arrays into a { en, ja, fil, ceb } map. */
function pick<T>(
  byLocale: Record<string, T[]>,
  i: number,
  get: (row: T) => unknown,
): Loc {
  const out: Loc = {};
  for (const code of Object.keys(byLocale)) {
    const v = get(byLocale[code][i]);
    if (typeof v === "string" && v) out[code] = v;
  }
  return out;
}

const isoDate = (d: unknown): string | null => {
  if (!d) return null;
  if (typeof d === "string") return d.slice(0, 10);
  const anyD = d as {
    format?: (f: string) => string;
    toISOString?: () => string;
  };
  if (typeof anyD.format === "function") return anyD.format("YYYY-MM-DD");
  if (typeof anyD.toISOString === "function")
    return anyD.toISOString().slice(0, 10);
  return null;
};

/** Dates that may be the literal "present". */
const isoOrPresent = (d: unknown): string | null =>
  d === "present" ? "present" : isoDate(d);

async function replace(table: string, rows: Record<string, unknown>[]) {
  const { error: delErr } = await db.from(table).delete().not("id", "is", null);
  if (delErr) throw new Error(`${table} clear: ${delErr.message}`);
  if (rows.length) {
    const { error } = await db.from(table).insert(rows);
    if (error) throw new Error(`${table} insert: ${error.message}`);
  }
  console.log(`  ${table.padEnd(14)} ${rows.length} row(s)`);
}

async function main() {
  console.log("Seeding content →", url);

  // ── profile (singleton) ──────────────────────────────────────────────────
  await replace("profile", [
    {
      full_name: FULL_NAME,
      job_title: JOB_TITLE,
      bio: perLocale(() => translate("win26.about.bio")),
      location: perLocale(() => translate("win26.about.location")),
      email: EMAIL_ADDRESS,
      phone: MOBILE_NUMBER,
      career_start_date: CAREER_START_DATE,
      avatar: "/assets/avatar-profile.jpg",
      stats: { projects: "10+", technologies: "20+" },
      published: true,
      sort_order: 0,
    },
  ]);

  // ── experience ───────────────────────────────────────────────────────────
  const exp = perLocale(() => getExperience());
  await replace(
    "experience",
    exp.en.map((e, i) => ({
      title: pick(exp, i, (r) => r.title),
      subtitle: pick(exp, i, (r) => r.subtitle),
      description: pick(exp, i, (r) => r.description),
      employment_type: e.employmentType ?? null,
      start_date: isoDate(e.startYear),
      end_date: isoOrPresent(e.endYear),
      is_work: e.isWork ?? false,
      abbreviation: e.abbreviation ?? null,
      subtitle_url: e.subtitleUrl ?? null,
      watermark: typeof e.watermark === "string" ? e.watermark : null,
      watermark_alt: pick(exp, i, (r) => r.watermarkAlt),
      watermark_width: e.waterMarkWidth ?? null,
      // Nested + localized: zip each promotion across locales too.
      promotion: (e.promotion ?? []).map((p, j) => ({
        title: pick(exp, i, (r) => r.promotion?.[j]?.title),
        subtitle: pick(exp, i, (r) => r.promotion?.[j]?.subtitle),
        description: pick(exp, i, (r) => r.promotion?.[j]?.description),
        abbreviation: p.abbreviation ?? null,
        startYear: isoDate(p.startYear),
        endYear: isoOrPresent(p.endYear),
      })),
      published: true,
      sort_order: i,
    })),
  );

  // ── education ────────────────────────────────────────────────────────────
  const edu = perLocale(() => getEducation());
  await replace(
    "education",
    edu.en.map((e, i) => ({
      title: pick(edu, i, (r) => r.title),
      subtitle: pick(edu, i, (r) => r.subtitle),
      description: pick(edu, i, (r) => r.description),
      level: e.level ?? null,
      start_date: isoDate(e.startYear),
      end_date: isoOrPresent(e.endYear),
      abbreviation: e.abbreviation ?? null,
      subtitle_url: e.subtitleUrl ?? null,
      watermark: typeof e.watermark === "string" ? e.watermark : null,
      watermark_alt: pick(edu, i, (r) => r.watermarkAlt),
      watermark_width: e.waterMarkWidth ?? null,
      published: true,
      sort_order: i,
    })),
  );

  // ── projects ─────────────────────────────────────────────────────────────
  const proj = perLocale(() => getProjects());
  await replace(
    "projects",
    proj.en.map((p, i) => ({
      title: pick(proj, i, (r) => r.title),
      description: pick(proj, i, (r) => r.description),
      project_id: p.projectId ?? null,
      company: p.company ?? null,
      date: isoDate(p.date),
      category: p.category ?? [],
      type: p.type ?? null,
      status: p.status ?? null,
      preview_url: p.previewUrl ?? null,
      code_url: p.codeUrl ?? null,
      stack: (p.stack ?? []).map((s) => s.name),
      carousel: (p.carousel ?? []).map((c) => ({
        value: c.value,
        name: c.name,
        image: typeof c.image === "string" ? c.image : (c.image?.src ?? null),
      })),
      key_contribution: (p.keyContribution ?? []).map((_, j) => ({
        name: pick(proj, i, (r) => r.keyContribution?.[j]?.name),
        description: pick(proj, i, (r) => r.keyContribution?.[j]?.description),
      })),
      hidden: p.hidden ?? false,
      published: true,
      sort_order: i,
    })),
  );

  // ── certificates ─────────────────────────────────────────────────────────
  const cert = perLocale(() => getCertificates());
  await replace(
    "certificates",
    cert.en.map((c, i) => ({
      title: pick(cert, i, (r) => r.title),
      organization: pick(cert, i, (r) => r.organization),
      organization_img:
        typeof c.organizationImg === "string"
          ? c.organizationImg
          : (c.organizationImg?.src ?? null),
      organization_alt: pick(cert, i, (r) => r.organizationAlt),
      issued_date: isoDate(c.issuedDate),
      credential_id: c.credentialId ?? null,
      credential_url:
        typeof c.credentialUrl === "string"
          ? c.credentialUrl
          : (c.credentialUrl?.src ?? null),
      published: true,
      sort_order: i,
    })),
  );

  // ── services ─────────────────────────────────────────────────────────────
  const svc = perLocale(() => getServices());
  await replace(
    "services",
    svc.en.map((s, i) => ({
      title: pick(svc, i, (r) => r.title),
      description: pick(svc, i, (r) => r.description),
      // per-locale bullet lists rather than a flat array
      sub_details: Object.fromEntries(
        Object.keys(svc).map((code) => [code, svc[code][i].subDetails ?? []]),
      ),
      stack: (s.stack ?? []).map((x) => x.name),
      published: true,
      sort_order: i,
    })),
  );

  // ── books / languages / socials / testimonials / skills (untranslated) ────
  await replace(
    "books",
    BOOKS.map((b, i) => ({
      title: b.title,
      author: b.author,
      quote: { en: b.quote },
      reflection: { en: b.reflection },
      theme: b.theme,
      published: true,
      sort_order: i,
    })),
  );

  await replace(
    "languages",
    LANGUAGES.map((l, i) => ({
      name: l.name,
      native_name: l.nativeName,
      locale: l.locale,
      level: l.level,
      note: { en: l.note },
      flag_icon: l.flagIcon,
      published: true,
      sort_order: i,
    })),
  );

  await replace(
    "socials",
    SOCIAL_MEDIA_LINK_DATA.map((s, i) => ({
      key: s.key,
      icon: s.icon,
      url: s.url,
      published: true,
      sort_order: i,
    })),
  );

  await replace(
    "testimonials",
    TESTIMONIALS.map((t, i) => ({
      name: t.name,
      role: { en: t.role },
      company: t.company,
      text: { en: t.text },
      rating: t.rating,
      avatar: typeof t.avatar === "string" ? t.avatar : null,
      service: t.service ?? null,
      relationship: t.relationship ?? null,
      links: [
        t.github && { platform: "github", url: t.github },
        t.linkedin && { platform: "linkedin", url: t.linkedin },
        t.behance && { platform: "behance", url: t.behance },
      ].filter(Boolean),
      published: true,
      sort_order: i,
    })),
  );

  // SKILL_CATEGORIES groups stacks; the table is flat, so carry the group key.
  const skills = SKILL_CATEGORIES.flatMap((cat) =>
    cat.stacks.map((s) => ({
      name: s.name,
      category: cat.key,
      rate: s.rate,
      url: s.url ?? null,
      icon: typeof s.icon === "string" ? s.icon : null,
      alt: s.alt ?? null,
      is_favorite: s.isFavorite ?? false,
      is_studying: s.isStudying ?? false,
      date_started: isoDate(s.dateStarted),
      date_ended: isoOrPresent(s.dateEnded),
      published: true,
    })),
  ).map((r, i) => ({ ...r, sort_order: i }));
  await replace("skills", skills);

  console.log("Done.");
}

main().catch((e) => {
  console.error("\nSeed failed:", e.message);
  process.exit(1);
});
