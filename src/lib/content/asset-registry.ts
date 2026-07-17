import * as Assets from "@/assets";
import * as Mockups from "@/assets/mockups";
import * as Certificates from "@/assets/certificates";
import * as Layout from "@/assets/layout";

/**
 * Resolves DB image references back to real bundled asset URLs.
 *
 * Images stay in code (bundled to hashed /_next/static/media/… URLs), but the
 * DB stores a stable stub path like "/assets/kryterion-watermark.jpg" that
 * encodes the asset's basename. This registry maps every imported asset by its
 * de-hashed basename, so a stub resolves to the correct runtime URL — no
 * re-seed needed, and it survives admin reordering (the row carries its own
 * image identity). External URLs (e.g. a hosted logo) pass through untouched.
 *
 * We pull in every asset folder — including the ones the `@/assets` barrel
 * doesn't re-export (mockups for project carousels, certificates, layout) —
 * so those DB stubs resolve too.
 */

/** "kryterion-watermark.93cfb921.jpg" or "kryterion-watermark.jpg" → "kryterion-watermark" */
const basename = (path: string): string => {
  const file = path.split("/").pop() ?? path;
  return file
    .replace(/\.[0-9a-f]{8,}(?=\.\w+$)/i, "") // strip webpack content hash
    .replace(/\.\w+$/, ""); // strip extension
};

const BY_NAME: Record<string, string> = {};
for (const source of [Assets, Mockups, Certificates, Layout]) {
  for (const value of Object.values(source)) {
    if (typeof value === "string") BY_NAME[basename(value)] = value;
  }
}

/** DB image value → real URL. Empty → undefined; external URL → itself. */
export function resolveAsset(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  if (/^https?:\/\//.test(value)) return value;
  return BY_NAME[basename(value)];
}
