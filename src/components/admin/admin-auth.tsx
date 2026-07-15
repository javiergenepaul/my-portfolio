"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * SIMULATED admin auth — NOT real security. It only flips a flag in
 * sessionStorage so we can prototype the gated admin flow (login → dashboard →
 * forms) before wiring Supabase Auth. Real auth (Supabase session + middleware
 * + RLS) replaces this later; the UI it guards stays the same.
 */

const STORAGE_KEY = "admin-sim-session";

export interface AdminUser {
  email: string;
  name: string;
}

interface AdminAuthValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  /** Ready = we've read sessionStorage (avoids a redirect flash on refresh). */
  ready: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] || "Admin";
  return handle
    .split(/[._-]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback((email: string) => {
    const next: AdminUser = { email, name: nameFromEmail(email) };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ user, isAuthenticated: !!user, ready, login, logout }}
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
