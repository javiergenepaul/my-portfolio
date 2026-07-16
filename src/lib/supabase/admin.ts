import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY Supabase client using the service-role key.
 *
 * ⚠️ This bypasses Row-Level Security entirely — full admin access to the DB.
 * Only ever call it from server code (Server Actions / Route Handlers) AFTER
 * verifying the caller is the admin. Never import it into a Client Component,
 * and never expose the key with a NEXT_PUBLIC_ prefix.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
