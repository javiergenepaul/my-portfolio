/**
 * Prints the résumé exactly as it's stored in Supabase.
 * Run: pnpm db:resume
 *
 * Handy after saving in /admin/resume — if your edit shows up here, it's in
 * the database, not just React state.
 */
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const ago = (ts) => {
  const s = Math.round((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
};

const { data: ov } = await db.from("resume_overview").select("*").single();
console.log(
  "\n── OVERVIEW ──────────────────────────────  (updated " +
    ago(ov.updated_at) +
    ")",
);
console.log(ov.summary);
console.log(`${ov.phone}  |  ${ov.email}  |  ${ov.location}`);
console.log("links:", ov.links.map((l) => `${l.platform}=${l.url}`).join("  "));

const { data: exp } = await db
  .from("resume_experience")
  .select("*")
  .order("sort_order");
console.log("\n── EXPERIENCE ────────────────────────────");
for (const e of exp) {
  console.log(
    `\n${e.published ? "●" : "○"} ${e.role} — ${e.company} (${e.period})   [updated ${ago(e.updated_at)}]`,
  );
  e.bullets.forEach((b) => console.log(`    • ${b}`));
}

for (const [table, fmt] of [
  ["resume_education", (r) => `${r.degree} — ${r.school} (${r.period})`],
  [
    "resume_projects",
    (r) =>
      `${r.name}${r.context ? ` [${r.context}]` : ""} — ${r.bullets.length} bullet(s), stack: ${r.stack.join(", ")}`,
  ],
  [
    "resume_certifications",
    (r) => `${r.issuer} (${r.year}): ${r.titles.join(", ")}`,
  ],
  ["resume_skills", (r) => `${r.label}: ${r.items.join(", ")}`],
]) {
  const { data } = await db.from(table).select("*").order("sort_order");
  console.log(
    `\n── ${table.replace("resume_", "").toUpperCase()} ──────────────────────`,
  );
  data.forEach((r) =>
    console.log(
      `${r.published ? "●" : "○"} ${fmt(r)}   [updated ${ago(r.updated_at)}]`,
    ),
  );
}
console.log("");
