/**
 * Backfills book title/theme/quote/reflection with all four locales from the
 * i18n files (win26.books.items.<id>). The seed only filled English; the
 * localized copy lived in i18n and was overlaid by the 2026 window.
 *
 * Run once (AFTER 0016 widens title/theme to jsonb):
 *   pnpm seed:book-i18n
 *
 * Books are matched to their i18n id by row order (sort_order), which mirrors
 * the source BOOKS order. Author stays plain text. Idempotent.
 */
import { createClient } from "@supabase/supabase-js";
import { en, ja, fil, ceb } from "@/i18n/locale";

type Item = {
  title?: string;
  theme?: string;
  quote?: string;
  reflection?: string;
};
type Dict = { win26?: { books?: { items?: Record<string, Item> } } };
const LOCALES: Record<string, Dict> = { en, ja, fil, ceb };

// Same order the 2026 window uses, which mirrors the source BOOKS order.
const BOOK_IDS = [
  "startWithWhy",
  "egoIsTheEnemy",
  "atomicHabits",
  "doHardThings",
  "theObstacleIsTheWay",
  "stillnessIsTheKey",
  "leadersEatLast",
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env — run via pnpm seed:book-i18n");
const db = createClient(url, key, { auth: { persistSession: false } });

const localized = (id: string, field: keyof Item): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [code, dict] of Object.entries(LOCALES)) {
    const v = dict.win26?.books?.items?.[id]?.[field];
    if (typeof v === "string" && v) out[code] = v;
  }
  return out;
};

(async () => {
  const { data, error } = await db
    .from("books")
    .select("id, title")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);

  let updated = 0;
  const missing: string[] = [];
  const rows = (data ?? []) as { id: string; title: unknown }[];
  for (let i = 0; i < rows.length; i++) {
    const id = BOOK_IDS[i];
    if (!id) {
      missing.push(`row ${i}`);
      continue;
    }
    const title = localized(id, "title");
    const theme = localized(id, "theme");
    const quote = localized(id, "quote");
    const reflection = localized(id, "reflection");
    if (!title.en) {
      missing.push(id);
      continue;
    }
    const { error: upErr } = await db
      .from("books")
      .update({ title, theme, quote, reflection })
      .eq("id", rows[i].id);
    if (upErr) throw new Error(`${id}: ${upErr.message}`);
    updated++;
  }

  console.log(`Backfilled ${updated} books.`);
  if (missing.length) console.log(`No i18n for: ${missing.join(", ")}`);
})();
