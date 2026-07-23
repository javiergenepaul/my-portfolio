/**
 * Deletes orphaned Storage objects — files in the `content` bucket that no
 * saved content row references.
 *
 * Uploads are decoupled from the DB save (ImageUploadField pushes to Storage on
 * file select), so abandoned / replaced / cleared uploads pile up. This sweep
 * is the safe way to reclaim them: it only removes objects with NO reference in
 * any content row, so it never breaks a live image.
 *
 * Run:  pnpm cleanup:storage           # dry run — lists orphans, deletes nothing
 *       pnpm cleanup:storage --force   # actually delete
 *
 * Note: an image uploaded in an open admin session but not yet saved has no DB
 * row, so it counts as an orphan — don't --force while such a draft is open.
 *
 * Uses the service-role key (bypasses RLS): CLI only, never shipped.
 */
import { createClient } from "@supabase/supabase-js";
import { CONTENT_TYPES } from "@/components/admin/admin-config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw new Error("Missing Supabase env — run via pnpm cleanup:storage");
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = "content";
const DRY = !process.argv.includes("--force");
const PUBLIC_MARK = `/storage/v1/object/public/${BUCKET}/`;

const tableFor = (k: string) => k.replace(/-/g, "_");

/** Every Storage object path referenced by any saved content row. */
async function referencedPaths(): Promise<Set<string>> {
  const refs = new Set<string>();
  const re = new RegExp(`${PUBLIC_MARK}([A-Za-z0-9_\\-./]+)`, "g");
  for (const def of CONTENT_TYPES) {
    const table = tableFor(def.key);
    const { data, error } = await db.from(table).select("*");
    if (error) {
      console.warn(`  skip ${table}: ${error.message}`);
      continue;
    }
    for (const row of data ?? []) {
      for (const m of JSON.stringify(row).matchAll(re)) {
        refs.add(decodeURIComponent(m[1]));
      }
    }
  }
  return refs;
}

/** Every object path in the bucket (recurses into folders). */
async function listObjects(): Promise<string[]> {
  const out: string[] = [];
  const walk = async (prefix: string) => {
    let offset = 0;
    for (;;) {
      const { data, error } = await db.storage
        .from(BUCKET)
        .list(prefix, { limit: 1000, offset });
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) break;
      for (const entry of data) {
        const full = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.id === null)
          await walk(full); // folder placeholder
        else out.push(full);
      }
      if (data.length < 1000) break;
      offset += data.length;
    }
  };
  await walk("");
  return out;
}

async function main() {
  console.log(
    DRY ? "Dry run — nothing will be deleted.\n" : "Deleting orphans.\n",
  );
  const refs = await referencedPaths();
  const objects = await listObjects();
  const orphans = objects.filter((p) => !refs.has(p));

  console.log(`Referenced by rows: ${refs.size}`);
  console.log(`Objects in bucket:  ${objects.length}`);
  console.log(`Orphans:            ${orphans.length}`);
  for (const o of orphans) console.log("  •", o);

  if (!orphans.length) return;
  if (DRY) {
    console.log("\nRe-run with --force to delete these.");
    return;
  }
  for (let i = 0; i < orphans.length; i += 100) {
    const { error } = await db.storage
      .from(BUCKET)
      .remove(orphans.slice(i, i + 100));
    if (error) throw new Error(error.message);
  }
  console.log(`\nDeleted ${orphans.length} orphaned object(s).`);
}

main().catch((e) => {
  console.error("\nCleanup failed:", e.message);
  process.exit(1);
});
