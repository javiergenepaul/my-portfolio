"use client";

import { useEffect, useRef } from "react";
import { useContentStore } from "@/stores/content-store";

/** Don't re-hit the DB more than once per this window when the tab regains focus. */
const REFETCH_THROTTLE_MS = 15_000;

/**
 * Kicks off the content fetch for the whole app and keeps it fresh.
 *
 * This provider mounts whenever you enter the year routes — including coming
 * back from the admin, since /admin is a separate layout subtree. So on mount:
 *   - first ever visit → `ensureLoaded()` (blocking; the splash covers it),
 *   - a later re-entry (store already loaded) → silent `refetch()`, so edits
 *     made in the admin show up on navigation without a hard refresh.
 * It also refetches when the tab regains focus (edit in the admin tab, switch
 * back), throttled so rapid tab-switching doesn't spam the DB. Refetches never
 * re-show the splash; the UI just swaps in fresh data.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const lastRefetch = useRef(0);

  useEffect(() => {
    const store = useContentStore.getState();
    if (store.status === "ready") {
      lastRefetch.current = Date.now();
      void store.refetch();
    } else {
      void store.ensureLoaded();
    }

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
