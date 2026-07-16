"use client";

import { AdminAuthProvider, type AdminUser } from "./admin-auth";
import { AdminGate } from "./admin-shell";

export function AdminProviders({
  user,
  children,
}: {
  user: AdminUser | null;
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider user={user}>
      <AdminGate>{children}</AdminGate>
    </AdminAuthProvider>
  );
}
