import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  type ContentRow,
  type ContentTypeDef,
  type FieldDef,
  type FieldValue,
} from "@/components/admin/admin-config";

/**
 * Reads for the typed content tables.
 *
 * Each content type has its own table, but the shape is uniform enough to map
 * generically: every table has (id, published, sort_order) plus one column per
 * field, named as the snake_case of the field name in admin-config. So the
 * field defs ARE the mapping — no per-type mapper needed.
 */

/** admin-config key → table name ("resume-overview" → "resume_overview"). */
export function tableFor(type: ContentTypeDef | string): string {
  const key = typeof type === "string" ? type : type.key;
  return key.replace(/-/g, "_");
}

/** issuedDate → issued_date */
export function columnFor(fieldName: string): string {
  return fieldName.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/** What an empty value looks like for each field type (DB null → admin shape). */
function emptyFor(f: FieldDef): FieldValue {
  if (f.localized) return {};
  if (f.type === "string-list" || f.type === "link-list") return [];
  if (f.type === "boolean") return false;
  return "";
}

function selectList(def: ContentTypeDef): string {
  return [
    "id",
    "published",
    "sort_order",
    ...def.fields.map((f) => columnFor(f.name)),
  ].join(", ");
}

function toContentRow(
  def: ContentTypeDef,
  r: Record<string, unknown>,
): ContentRow {
  const values: Record<string, FieldValue> = {};
  for (const f of def.fields) {
    const raw = r[columnFor(f.name)];
    // number columns come back as numbers; the admin's inputs are strings.
    values[f.name] =
      raw === null || raw === undefined
        ? emptyFor(f)
        : f.type === "number"
          ? String(raw)
          : (raw as FieldValue);
  }
  return {
    id: r.id as string,
    published: Boolean(r.published),
    order: (r.sort_order as number) ?? 0,
    values,
  };
}

/** ContentRow.values → a row for the table (snake_case columns). */
export function toDbValues(
  def: ContentTypeDef,
  values: Record<string, FieldValue>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of def.fields) {
    const v = values[f.name];
    if (f.type === "number") {
      const n = typeof v === "string" ? v.trim() : v;
      out[columnFor(f.name)] = n === "" || n === undefined ? null : Number(n);
    } else if (f.type === "date" && (v === "" || v === undefined)) {
      out[columnFor(f.name)] = null; // empty string is not a valid date
    } else {
      out[columnFor(f.name)] = v ?? emptyFor(f);
    }
  }
  return out;
}

/** Every row of a type, drafts included — admin only (RLS enforces the session). */
export async function getAdminRows(def: ContentTypeDef): Promise<ContentRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(tableFor(def))
    .select(selectList(def))
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load "${def.key}": ${error.message}`);
  return (data as unknown as Record<string, unknown>[]).map((r) =>
    toContentRow(def, r),
  );
}

/** Published rows — what the public portfolio renders (static/ISR-friendly). */
export async function getPublishedRows(
  def: ContentTypeDef,
): Promise<ContentRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from(tableFor(def))
    .select(selectList(def))
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load "${def.key}": ${error.message}`);
  return (data as unknown as Record<string, unknown>[]).map((r) =>
    toContentRow(def, r),
  );
}

/** Singletons (profile, resume-overview): the one row. */
export async function getAdminSingleton(
  def: ContentTypeDef,
): Promise<ContentRow | undefined> {
  return (await getAdminRows(def))[0];
}
