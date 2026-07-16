"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CONTENT_TYPES,
  type ContentRow,
  type FieldDef,
  type FieldValue,
} from "@/components/admin/admin-config";
import { rowsToResumeData } from "./resume-data";
import type { ResumeData } from "./resume-content";

/**
 * Client-side résumé content from Supabase, for the résumé surfaces that render
 * in the browser on demand — the résumé modal and the 2026 desktop window —
 * which can't be server-fetched the way the /2024/resume page is.
 *
 * Reads published rows through the anon browser client (RLS keeps it to
 * published-only), maps them with the same `rowsToResumeData` the page uses,
 * and returns undefined until loaded so callers fall back to the built-in
 * default meanwhile. Pass `skip` when a server-provided content is already in
 * hand (the page path) so we don't fetch twice.
 */

const columnFor = (n: string) =>
  n.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const tableFor = (k: string) => k.replace(/-/g, "_");
const RESUME_DEFS = CONTENT_TYPES.filter((t) => t.group === "Resume");

const emptyFor = (f: FieldDef): FieldValue =>
  f.localized
    ? {}
    : f.type === "string-list" || f.type === "link-list"
      ? []
      : f.type === "boolean"
        ? false
        : "";

export function useResumeContent(skip = false): ResumeData | undefined {
  const [content, setContent] = useState<ResumeData>();

  useEffect(() => {
    if (skip) return;
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const sections: Record<string, ContentRow[]> = {};
      await Promise.all(
        RESUME_DEFS.map(async (def) => {
          const cols = [
            "id",
            "published",
            "sort_order",
            ...def.fields.map((f) => columnFor(f.name)),
          ];
          const { data } = await supabase
            .from(tableFor(def.key))
            .select(cols.join(", "))
            .eq("published", true)
            .order("sort_order", { ascending: true });
          sections[def.key] = (
            (data ?? []) as unknown as Record<string, unknown>[]
          ).map((r) => {
            const values: Record<string, FieldValue> = {};
            for (const f of def.fields) {
              const raw = r[columnFor(f.name)];
              values[f.name] =
                raw == null
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
          });
        }),
      );
      if (!cancelled) setContent(rowsToResumeData(sections));
    })().catch((e) => console.error("useResumeContent:", e));

    return () => {
      cancelled = true;
    };
  }, [skip]);

  return content;
}
