import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anon Supabase client with NO cookie/session handling.
 *
 * Used for public portfolio reads. Because it never touches cookies(), the
 * pages that use it can still be statically rendered / ISR'd — the cookie-aware
 * server client would opt them into dynamic rendering and cost us the
 * First-Load/LCP work we did earlier.
 *
 * RLS still applies: anon can only see rows where published = true.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
