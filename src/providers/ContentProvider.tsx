"use client";

import { useEffect, useRef } from "react";
import { useContentStore } from "@/stores/content-store";

/** Don't re-hit the DB more than once per this window when the tab regains focus. */
const REFETCH_THROTTLE_MS = 15_000;

/**
 * Kicks off the one-time content fetch for the whole app and keeps it fresh.
 *
 * On mount it triggers `ensureLoaded()` (deduped by the store). When the tab
 * becomes visible again — e.g. after editing in the admin tab and switching
 * back — it silently refetches, throttled so rapid tab-switching doesn't spam
 * the DB. Refetches never re-show the splash; the UI just swaps in fresh data.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const lastRefetch = useRef(0);

  useEffect(() => {
    void useContentStore.getState().ensureLoaded();

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRefetch.current < REFETCH_THROTTLE_MS) return;
      lastRefetch.current = now;
      void useContentStore.getState().refetch();
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return <>{children}</>;
}
