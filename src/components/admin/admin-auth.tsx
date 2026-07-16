"use client";

import { createContext, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Admin auth context. The user is resolved on the server (admin layout) from
 * the Supabase session, so there's no loading flash and no client-side guess.
 * The real gate is middleware.ts — this just exposes who's signed in + sign-out.
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminAuthValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({
  user,
  children,
}: {
  user: AdminUser | null;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }, [router]);

  return (
    <AdminAuthContext.Provider
      value={{ user, isAuthenticated: !!user, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within <AdminAuthProvider>");
  return ctx;
}
