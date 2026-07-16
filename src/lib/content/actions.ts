"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { tableFor, toDbValues } from "./repository";
import {
  getContentType,
  type FieldValue,
} from "@/components/admin/admin-config";

/**
 * Admin writes.
 *
 * Every action re-verifies the session server-side (never trust the client),
 * then writes with the *user's* client so RLS enforces access at the database
 * too. We deliberately don't use the service-role key here — it would bypass
 * RLS and make the database blind to who's writing.
 */

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

function defFor(typeKey: string) {
  const def = getContentType(typeKey);
  if (!def) throw new Error(`Unknown content type "${typeKey}"`);
  return def;
}

export interface SaveRowInput {
  type: string;
  /** Omit to create. */
  id?: string;
  published: boolean;
  order?: number;
  values: Record<string, FieldValue>;
}

export async function saveContentRow(input: SaveRowInput): Promise<void> {
  const supabase = await requireAdmin();
  const def = defFor(input.type);
  const row = {
    ...toDbValues(def, input.values),
    published: input.published,
    ...(input.order !== undefined ? { sort_order: input.order } : {}),
  };

  const { error } = input.id
    ? await supabase.from(tableFor(def)).update(row).eq("id", input.id)
    : await supabase.from(tableFor(def)).insert(row);

  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function deleteContentRow(
  type: string,
  id: string,
): Promise<void> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from(tableFor(defFor(type)))
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export type ReplaceRow = {
  /** Omit for new rows. */
  id?: string;
  published: boolean;
  values: Record<string, FieldValue>;
};

type AdminClient = Awaited<ReturnType<typeof requireAdmin>>;

/**
 * Make a type's table match `rows` exactly: rows without an id are inserted,
 * rows missing from the payload are deleted, and sort_order follows the array
 * order. Caller is responsible for auth + revalidation.
 */
async function replaceRows(
  supabase: AdminClient,
  typeKey: string,
  rows: ReplaceRow[],
): Promise<void> {
  const def = defFor(typeKey);
  const table = tableFor(def);

  const { data: existing, error: readErr } = await supabase
    .from(table)
    .select("id");
  if (readErr) throw new Error(`${table}: ${readErr.message}`);

  const keptIds = rows.map((r) => r.id).filter(Boolean) as string[];
  const removed = (existing ?? [])
    .map((r) => r.id as string)
    .filter((id) => !keptIds.includes(id));

  if (removed.length) {
    const { error } = await supabase.from(table).delete().in("id", removed);
    if (error) throw new Error(`${table}: ${error.message}`);
  }

  for (const [i, row] of rows.entries()) {
    const payload = {
      ...toDbValues(def, row.values),
      published: row.published,
      sort_order: i,
    };
    const { error } = row.id
      ? await supabase.from(table).update(payload).eq("id", row.id)
      : await supabase.from(table).insert(payload);
    if (error) throw new Error(`${table}: ${error.message}`);
  }
}

/** Replace every row of a single type. */
export async function replaceContentRows(
  type: string,
  rows: ReplaceRow[],
): Promise<void> {
  const supabase = await requireAdmin();
  await replaceRows(supabase, type, rows);
  revalidatePath("/admin", "layout");
}

/**
 * Save every résumé section at once — backs the résumé's single "Save changes"
 * (edit freely across sections, commit in one go).
 */
export async function saveResume(
  sections: Record<string, ReplaceRow[]>,
): Promise<void> {
  const supabase = await requireAdmin();
  for (const [type, rows] of Object.entries(sections)) {
    await replaceRows(supabase, type, rows);
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/2024/resume"); // public résumé reads these tables
}
