import * as Mockups from "@/assets/mockups";

/**
 * Resolve a stored mockup screenshot for display in the admin.
 *
 * Uploads are Supabase Storage URLs (https) and pass through untouched. Legacy
 * seeded values are stub paths like "/assets/sirius-mockup-1.png" (the seed
 * runs under stub-assets.cjs, so image imports become stubs) — those map to the
 * real bundled URL by basename, mirroring the public asset registry.
 *
 * Scoped to @/assets/mockups so the admin bundle stays small (it deliberately
 * avoids importing the whole @/assets tree).
 */

const basename = (path: string): string => {
  const file = path.split("/").pop() ?? path;
  return file
    .replace(/\.[0-9a-f]{8,}(?=\.\w+$)/i, "") // strip webpack content hash
    .replace(/\.\w+$/, ""); // strip extension
};

const BY_NAME: Record<string, string> = {};
for (const value of Object.values(Mockups)) {
  if (typeof value === "string") BY_NAME[basename(value)] = value;
}

export function resolveMockupScreenshot(value: string | undefined): string {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;
  return BY_NAME[basename(value)] ?? value;
}
