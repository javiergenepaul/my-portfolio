"use client";

import { AdminAuthProvider, type AdminUser } from "./admin-auth";
import { AdminGate } from "./admin-shell";
import { UnsavedChangesProvider } from "./unsaved-changes";

export function AdminProviders({
  user,
  children,
}: {
  user: AdminUser | null;
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider user={user}>
      {/* Wraps the shell too — the nav links it renders are what the guard
          intercepts, so it has to sit above them. */}
      <UnsavedChangesProvider>
        <AdminGate>{children}</AdminGate>
      </UnsavedChangesProvider>
    </AdminAuthProvider>
  );
}
