import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const pub = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });

const tables = ["resume_overview","resume_experience","resume_education","resume_projects","resume_certifications","resume_skills"];
for (const t of tables) {
  const { data, error } = await admin.from(t).select("id");
  if (error) {
    console.log(`FAIL ${t}: [${error.code}] ${error.message}${error.hint ? " | hint: " + error.hint : ""}`);
    continue;
  }
  const { error: aErr } = await pub.from(t).select("id");
  console.log(`OK   ${t.padEnd(22)} rows=${data.length}  anon-read=${aErr ? "BLOCKED [" + aErr.code + "] " + aErr.message : "allowed"}`);
}
