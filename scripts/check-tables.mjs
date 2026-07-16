/**
 * Verifies every content table: exists, reachable by service_role, and readable
 * by anon (which proves the grants + RLS policies actually applied).
 * Run: pnpm db:check
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const pub = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// Mirrors CONTENT_TYPES in admin-config (table = key with "-" → "_").
const TABLES = [
  "resume_overview",
  "resume_experience",
  "resume_education",
  "resume_projects",
  "resume_certifications",
  "resume_skills",
  "profile",
  "experience",
  "education",
  "projects",
  "certificates",
  "books",
  "services",
  "languages",
  "socials",
  "testimonials",
  "skills",
];

let bad = 0;
for (const t of TABLES) {
  const { data, error } = await admin.from(t).select("id");
  if (error) {
    bad++;
    console.log(
      `FAIL ${t.padEnd(24)} [${error.code}] ${error.message}${error.hint ? " | " + error.hint : ""}`,
    );
    continue;
  }
  const { error: aErr } = await pub.from(t).select("id");
  if (aErr) bad++;
  console.log(
    `OK   ${t.padEnd(24)} rows=${String(data.length).padStart(3)}  anon-read=${
      aErr ? `BLOCKED [${aErr.code}] ${aErr.message}` : "allowed"
    }`,
  );
}

console.log(`\n${TABLES.length - bad}/${TABLES.length} tables healthy`);
if (bad) process.exit(1);
