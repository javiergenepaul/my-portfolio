"use client";

import { useEffect } from "react";
import { useContentStore } from "@/stores/content-store";
import { useLanguageStore } from "@/stores/language-store";
import type { ContentRow } from "@/components/admin/admin-config";
import type { ProfileInterface, SocialLinkInterface } from "@/config/types";
import { PROFILE_FALLBACK, SOCIALS_FALLBACK } from "@/config/data/personal";
import { rowsToProfile, rowsToSocials } from "./portfolio";

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

/**
 * The site owner's identity from the `profile` CMS singleton — name, title,
 * bio, contact details, avatar. This is the only supported way to read that
 * information; nothing should import the raw constants directly.
 */
export function useProfile(): ProfileInterface {
  const locale = useLanguageStore((s) => s.language);
  return rowsToProfile(useContent("profile"), locale, PROFILE_FALLBACK);
}

/** Social links from the `socials` CMS type, in admin order. */
export function useSocials(): SocialLinkInterface[] {
  const rows = rowsToSocials(useContent("socials"));
  return rows.length > 0 ? rows : SOCIALS_FALLBACK;
}

/** One social link by key (e.g. "github", "linkedIn"), or "" when unset. */
export function useSocialUrl(key: string): string {
  return useSocials().find((s) => s.key === key)?.url ?? "";
}

/**
 * Imperative reads for module-scope data that can't call hooks — the 2026
 * terminal commands and the chat knowledge base, both of which build their
 * strings lazily inside thunks. Safe there because the thunk only runs on user
 * input, long after the store has loaded; do NOT use these during render.
 */
export function getProfileSnapshot(): ProfileInterface {
  const { data } = useContentStore.getState();
  const locale = useLanguageStore.getState().language;
  return rowsToProfile(data.profile ?? [], locale, PROFILE_FALLBACK);
}

export function getSocialUrlSnapshot(key: string): string {
  const rows = rowsToSocials(useContentStore.getState().data.socials ?? []);
  const list = rows.length > 0 ? rows : SOCIALS_FALLBACK;
  return list.find((s) => s.key === key)?.url ?? "";
}
