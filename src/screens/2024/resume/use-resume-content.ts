"use client";

import { useEffect, useMemo } from "react";
import { useContentStore } from "@/stores/content-store";
import {
  CONTENT_TYPES,
  type ContentRow,
} from "@/components/admin/admin-config";
import { rowsToResumeData } from "./resume-data";
import type { ResumeData } from "./resume-content";

/**
 * Résumé content for the browser-rendered surfaces (the résumé modal and the
 * 2026 desktop window). Reads the résumé sections from the shared content store
 * — the same one-time fetch every other surface uses — and maps them with
 * `rowsToResumeData`. Returns undefined until the store is ready, so callers
 * fall back to the built-in default meanwhile.
 *
 * Pass `skip` when server-provided content is already in hand (the /2024/resume
 * page), so this stays inert there.
 */

const RESUME_KEYS = CONTENT_TYPES.filter((t) => t.group === "Resume").map(
  (t) => t.key,
);

export function useResumeContent(skip = false): ResumeData | undefined {
  const data = useContentStore((s) => s.data);
  const status = useContentStore((s) => s.status);

  useEffect(() => {
    if (!skip) void useContentStore.getState().ensureLoaded();
  }, [skip]);

  return useMemo(() => {
    if (skip || status !== "ready") return undefined;
    const sections: Record<string, ContentRow[]> = {};
    for (const key of RESUME_KEYS) sections[key] = data[key] ?? [];
    return rowsToResumeData(sections);
  }, [skip, status, data]);
}
