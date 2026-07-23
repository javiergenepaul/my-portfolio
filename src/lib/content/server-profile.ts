import { cache } from "react";
import { getContentType } from "@/components/admin/admin-config";
import { PROFILE_FALLBACK, SOCIALS_FALLBACK } from "@/config/data/personal";
import type { ProfileInterface, SocialLinkInterface } from "@/config/types";
import { rowsToProfile, rowsToSocials } from "./portfolio";
import { getPublishedRows } from "./repository";

/**
 * Server-side read of the owner's identity, for route metadata and JSON-LD.
 *
 * The client content store can't be reached from a Server Component, so these
 * routes fetch directly. Wrapped in React `cache()` so `generateMetadata` and
 * the layout body share one query per request rather than hitting the DB twice.
 *
 * Metadata is always English — `<head>` is rendered before the client language
 * store exists, and the locale is a client-side preference.
 *
 * A failure here must never take down the page: if Supabase is unreachable the
 * route still renders with the fallback identity, just without CMS values.
 */
export const getServerProfile = cache(
  async (): Promise<{
    profile: ProfileInterface;
    socials: SocialLinkInterface[];
  }> => {
    try {
      const [profileRows, socialRows] = await Promise.all([
        getPublishedRows(getContentType("profile")!),
        getPublishedRows(getContentType("socials")!),
      ]);
      const socials = rowsToSocials(socialRows);
      return {
        profile: rowsToProfile(profileRows, "en", PROFILE_FALLBACK),
        socials: socials.length > 0 ? socials : SOCIALS_FALLBACK,
      };
    } catch {
      return { profile: PROFILE_FALLBACK, socials: SOCIALS_FALLBACK };
    }
  },
);

/**
 * Splits the profile's free-text location ("Cebu, Philippines") into the
 * schema.org PostalAddress fields. Falls back to putting the whole string in
 * addressLocality when there's no comma.
 */
export function toPostalAddress(location: string) {
  const parts = location
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    "@type": "PostalAddress" as const,
    addressLocality: parts[0] ?? location,
    ...(parts.length > 1 ? { addressCountry: parts[parts.length - 1] } : {}),
  };
}
