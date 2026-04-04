/**
 * Environment variables.
 * NEXT_PUBLIC_* vars are inlined at build time and available in both
 * server and client components.
 *
 * Migration note: replaces Vite's import.meta.env.VITE_* references.
 * Rename your .env file entries accordingly:
 *   VITE_DEV_MODE        → NODE_ENV (built-in, no .env entry needed)
 *   VITE_SERVICE_ID      → NEXT_PUBLIC_EMAIL_SERVICE_ID
 *   VITE_TEMPLATE_ID     → NEXT_PUBLIC_EMAIL_TEMPLATE_ID
 *   VITE_PUBLIC_KEY      → NEXT_PUBLIC_EMAIL_PUBLIC_KEY
 *   VITE_GA_MEASUREMENT  → NEXT_PUBLIC_GA_MEASUREMENT_ID
 */

export const DEV_MODE = process.env.NODE_ENV;
export const IS_DEV = process.env.NODE_ENV === "development";

export const EMAIL_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID ?? "";
export const EMAIL_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID ?? "";
export const EMAIL_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY ?? "";
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
