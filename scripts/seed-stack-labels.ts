/**
 * Backfills skills.label from the i18n stack labels (services.stack.<name>)
 * across en/ja/fil/ceb. Matched by the stack `name` key.
 *
 * Run once, AFTER migration 0014 adds the label column:
 *   pnpm seed:stack-labels
 *
 * Touches ONLY the label column — icon uploads, ratings, and other admin edits
 * are preserved. Idempotent (safe to re-run).
 */
import { createClient } from "@supabase/supabase-js";
import { en, ja, fil, ceb } from "@/i18n/locale";

type Dict = { services?: { stack?: Record<string, string> } };
const LOCALES: Record<string, Dict> = { en, ja, fil, ceb };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env — run via pnpm seed:stack-labels");
const db = createClient(url, key, { auth: { persistSession: false } });

(async () => {
  const { data, error } = await db.from("skills").select("id, name");
  if (error) throw new Error(error.message);

  let updated = 0;
  const missing: string[] = [];
  for (const row of (data ?? []) as { id: string; name: string }[]) {
    const label: Record<string, string> = {};
    for (const [code, dict] of Object.entries(LOCALES)) {
      const v = dict.services?.stack?.[row.name];
      if (typeof v === "string" && v) label[code] = v;
    }
    if (Object.keys(label).length === 0) {
      missing.push(row.name);
      continue;
    }
    const { error: upErr } = await db
      .from("skills")
      .update({ label })
      .eq("id", row.id);
    if (upErr) throw new Error(`${row.name}: ${upErr.message}`);
    updated++;
  }

  console.log(`Backfilled ${updated} stack labels.`);
  if (missing.length)
    console.log(`No i18n label for ${missing.length}: ${missing.join(", ")}`);
})();
