"use client";

import { AdminAuthProvider } from "./admin-auth";
import { AdminGate } from "./admin-shell";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGate>{children}</AdminGate>
    </AdminAuthProvider>
  );
}
