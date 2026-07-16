import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminProviders } from "@/components/admin/admin-providers";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Friendly display name from the email local-part (e.g. gene.paul → Gene Paul). */
function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] || "Admin";
  return handle
    .split(/[._-]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resolved from the Supabase session cookie. middleware.ts already blocks
  // unauthenticated requests to /admin/** (except /admin/login), so this is
  // only null on the login page.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminUser =
    user && user.email
      ? { id: user.id, email: user.email, name: nameFromEmail(user.email) }
      : null;

  return <AdminProviders user={adminUser}>{children}</AdminProviders>;
}
