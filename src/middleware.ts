import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Scoped to /admin only — the public portfolio stays untouched (no auth
  // round-trip), so those routes keep their static/ISR performance.
  matcher: ["/admin/:path*"],
};
