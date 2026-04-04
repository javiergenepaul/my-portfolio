import { redirect } from "next/navigation";
import { YEARS, CURRENT_YEAR } from "@/config/years";

/**
 * Root "/" redirects to the current active year.
 * CURRENT_YEAR is derived from the years config (latest enabled year).
 */
export default function RootPage() {
  redirect(`/${CURRENT_YEAR}`);
}
