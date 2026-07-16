import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import {
  CONTENT_TYPES,
  type ContentRow,
  type FieldValue,
} from "@/components/admin/admin-config";

/**
 * Shared public-content store.
 *
 * The portfolio is a client SPA, so all published content is fetched once from
 * Supabase (a parallel read per table) and cached here for the session. Every
 * surface — year pages, the résumé, the 2026 desktop — reads from this one
 * store, so switching years/pages after the first load is instant.
 *
 * - `ensureLoaded()` fetches on the first call and is a no-op afterwards; an
 *   in-flight guard means concurrent callers share a single fetch.
 * - `refetch()` is a silent background refresh (used on tab focus). It never
 *   flips status back to `loading`, so it never re-triggers the splash — the
 *   UI just swaps to fresh data when it lands.
 *
 * Deliberately NOT persisted: content should come back fresh on every real
 * load, so admin edits are never served stale from localStorage.
 */

const tableFor = (k: string) => k.replace(/-/g, "_");
const snakeToCamel = (s: string) =>
  s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

// Row bookkeeping columns that live on ContentRow itself, not in `values`.
const META = new Set(["id", "published", "sort_order", "created_at", "updated_at"]);

/**
 * Map full DB rows (select *) into ContentRow. Unlike the admin path, this
 * carries EVERY column — including ones the admin form doesn't expose (nested
 * promotions, watermark alt/width, …) — so section mappers can render fully.
 * Values are kept raw and camel-cased; section mappers coerce as needed.
 */
function mapRows(data: unknown): ContentRow[] {
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => {
    const values: Record<string, FieldValue> = {};
    for (const [k, v] of Object.entries(r)) {
      if (META.has(k)) continue;
      values[snakeToCamel(k)] = (v ?? undefined) as FieldValue;
    }
    return {
      id: r.id as string,
      published: Boolean(r.published),
      order: (r.sort_order as number) ?? 0,
      values,
    };
  });
}

async function fetchAll(): Promise<Record<string, ContentRow[]>> {
  const supabase = createClient();
  const entries = await Promise.all(
    CONTENT_TYPES.map(async (def) => {
      const { data, error } = await supabase
        .from(tableFor(def.key))
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(`${def.key}: ${error.message}`);
      return [def.key, mapRows(data)] as const;
    }),
  );
  return Object.fromEntries(entries);
}

type Status = "idle" | "loading" | "ready";

interface ContentState {
  status: Status;
  data: Record<string, ContentRow[]>;
  error?: string;
  /** In-flight fetch, so concurrent callers dedupe onto one request. */
  inflight?: Promise<void>;
  /** Fetch once; no-op once ready. Safe to call from every consumer. */
  ensureLoaded: () => Promise<void>;
  /** Silent background refresh — keeps status `ready`, swaps data when done. */
  refetch: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  status: "idle",
  data: {},

  ensureLoaded: () => {
    const s = get();
    if (s.status === "ready") return Promise.resolve();
    if (s.inflight) return s.inflight;

    const p = (async () => {
      set({ status: "loading" });
      try {
        const data = await fetchAll();
        set({ data, status: "ready", error: undefined });
      } catch (e) {
        set({ status: "idle", error: e instanceof Error ? e.message : String(e) });
      } finally {
        set({ inflight: undefined });
      }
    })();

    set({ inflight: p });
    return p;
  },

  refetch: async () => {
    try {
      const data = await fetchAll();
      set({ data, status: "ready", error: undefined });
    } catch (e) {
      // Keep the existing data on a failed refresh; just record the error.
      set({ error: e instanceof Error ? e.message : String(e) });
    }
  },
}));
