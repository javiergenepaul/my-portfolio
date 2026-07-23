/**
 * Backfills testimonials.text with JA/FIL/CEB from the i18n files
 * (win26.testimonials.items.<id>.text). The seed only filled English; the
 * localized copy lived in the i18n files and was overlaid by the 2026 window.
 *
 * Run once:  pnpm seed:testimonial-i18n
 *
 * Matches each row to its i18n id by first name (e.g. "Sarah M." → "sarah").
 * Touches only the `text` column. Idempotent.
 */
import { createClient } from "@supabase/supabase-js";
import { en, ja, fil, ceb } from "@/i18n/locale";

type Dict = {
  win26?: { testimonials?: { items?: Record<string, { text?: string }> } };
};
const LOCALES: Record<string, Dict> = { en, ja, fil, ceb };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw new Error("Missing Supabase env — run via pnpm seed:testimonial-i18n");
const db = createClient(url, key, { auth: { persistSession: false } });

(async () => {
  const { data, error } = await db.from("testimonials").select("id, name");
  if (error) throw new Error(error.message);

  let updated = 0;
  const missing: string[] = [];
  for (const row of (data ?? []) as { id: string; name: string }[]) {
    const idKey = row.name.split(/[\s.]+/)[0]?.toLowerCase() ?? "";
    const text: Record<string, string> = {};
    for (const [code, dict] of Object.entries(LOCALES)) {
      const t = dict.win26?.testimonials?.items?.[idKey]?.text;
      if (typeof t === "string" && t) text[code] = t;
    }
    if (Object.keys(text).length === 0) {
      missing.push(`${row.name} (${idKey})`);
      continue;
    }
    const { error: upErr } = await db
      .from("testimonials")
      .update({ text })
      .eq("id", row.id);
    if (upErr) throw new Error(`${row.name}: ${upErr.message}`);
    updated++;
  }

  console.log(`Backfilled ${updated} testimonial texts.`);
  if (missing.length) console.log(`No i18n text for: ${missing.join(", ")}`);
})();
