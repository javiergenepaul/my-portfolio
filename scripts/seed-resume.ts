/**
 * Seeds the resume_* tables from the hardcoded résumé content.
 *
 * Run:  pnpm seed:resume
 *
 * Idempotent — each table is cleared and re-inserted, so re-running always
 * lands on exactly what src/screens/2024/resume/resume-content.ts says. Once
 * the admin is writing to the DB, that file becomes redundant and this script
 * is only for rebuilding from scratch.
 *
 * Uses the service-role key (bypasses RLS) — server/CLI only, never shipped.
 */
import { createClient } from "@supabase/supabase-js";
import {
  RESUME_SUMMARY,
  RESUME_CONTACT,
  RESUME_EXPERIENCE,
  RESUME_PROJECTS,
  RESUME_SKILLS,
  RESUME_EDUCATION,
  RESUME_CERTIFICATIONS,
} from "@/screens/2024/resume/resume-content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — run with: node --env-file=.env.local",
  );
}

const db = createClient(url, key, { auth: { persistSession: false } });

async function replace(table: string, rows: Record<string, unknown>[]) {
  const { error: delErr } = await db
    .from(table)
    .delete()
    .not("id", "is", null); // delete-all needs a filter
  if (delErr) throw new Error(`${table} clear failed: ${delErr.message}`);

  if (rows.length) {
    const { error } = await db.from(table).insert(rows);
    if (error) throw new Error(`${table} insert failed: ${error.message}`);
  }
  console.log(`  ${table.padEnd(22)} ${rows.length} row(s)`);
}

async function main() {
  console.log("Seeding résumé →", url);

  await replace("resume_overview", [
    {
      summary: RESUME_SUMMARY,
      phone: RESUME_CONTACT.phone,
      email: RESUME_CONTACT.email,
      location: RESUME_CONTACT.location,
      links: [
        { platform: "github", url: RESUME_CONTACT.github.url },
        { platform: "linkedin", url: RESUME_CONTACT.linkedin.url },
      ],
      published: true,
      sort_order: 0,
    },
  ]);

  await replace(
    "resume_experience",
    RESUME_EXPERIENCE.map((e, i) => ({
      role: e.role,
      company: e.company,
      employment_type: e.employmentType,
      location: e.location,
      period: e.period,
      promotion: e.promotion ?? null,
      bullets: e.bullets,
      published: true,
      sort_order: i,
    })),
  );

  await replace(
    "resume_education",
    RESUME_EDUCATION.map((e, i) => ({
      degree: e.degree,
      school: e.school,
      period: e.period,
      published: true,
      sort_order: i,
    })),
  );

  await replace(
    "resume_projects",
    RESUME_PROJECTS.map((p, i) => ({
      name: p.name,
      context: p.context ?? null,
      url: p.url ?? null,
      bullets: p.bullets,
      stack: p.stack,
      published: true,
      sort_order: i,
    })),
  );

  await replace(
    "resume_certifications",
    RESUME_CERTIFICATIONS.map((c, i) => ({
      issuer: c.issuer,
      year: c.year,
      titles: c.titles,
      published: true,
      sort_order: i,
    })),
  );

  await replace(
    "resume_skills",
    RESUME_SKILLS.map((s, i) => ({
      label: s.label,
      items: s.items,
      published: true,
      sort_order: i,
    })),
  );

  console.log("Done.");
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
