"use client";

import { useEffect } from "react";
import { useContentStore } from "@/stores/content-store";
import type { ContentRow } from "@/components/admin/admin-config";

/**
 * Published rows for one content type, from the shared session store.
 *
 * Triggers the one-time fetch-all on mount (deduped by the store), so it works
 * no matter how the page was reached — year selection, deep-link, or client
 * navigation. Components pick the current locale from the language store.
 */
export function useContent(typeKey: string): ContentRow[] {
  const rows = useContentStore((s) => s.data[typeKey]);
  useEffect(() => {
    void useContentStore.getState().ensureLoaded();
  }, []);
  return rows ?? [];
}

/** Current load status of the shared content store. */
export function useContentStatus() {
  return useContentStore((s) => s.status);
}
