"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Loader2,
  Send,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components";
import { CONTENT_TYPES } from "./admin-config";
import { useAdminAuth } from "./admin-auth";
import { GuardedLink, useGuardedAction } from "./unsaved-changes";

/**
 * Gates every /admin route except the login page. Renders the shell (sidebar +
 * topbar) around authenticated content, or bounces to /admin/login.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAdminAuth();

  if (pathname === "/admin/login") return <>{children}</>;

  // middleware.ts already blocks unauthenticated requests to /admin/** — this
  // is just a defensive fallback so we never render the shell without a user.
  if (!user) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAdminAuth();
  const guard = useGuardedAction();

  // Signing out navigates away just like a link click, so it gets the same
  // prompt rather than dropping the draft on the floor.
  const onSignOut = () => {
    guard(() => void signOut());
  };

  return (
    <div className="min-h-dvh flex bg-background text-foreground">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="h-14 flex items-center gap-2 px-5 border-b border-border">
          <div className="h-6 w-6 rounded-md bg-primary/15 text-primary flex items-center justify-center text-[11px] font-bold">
            P
          </div>
          <span className="text-sm font-semibold">Portfolio CMS</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
          <NavItem
            href="/admin"
            active={pathname === "/admin"}
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
          />
          <SectionLabel>Resume</SectionLabel>
          <NavItem
            href="/admin/resume"
            active={pathname.startsWith("/admin/resume")}
            icon={<FileText size={16} />}
            label="Resume"
          />

          <SectionLabel>Content</SectionLabel>
          {CONTENT_TYPES.filter(
            (t) => (t.group ?? "Content") === "Content",
          ).map((t) => (
            <NavItem
              key={t.key}
              href={`/admin/${t.key}`}
              active={pathname.startsWith(`/admin/${t.key}`)}
              icon={<t.icon size={16} />}
              label={t.label}
            />
          ))}

          <SectionLabel>Tools</SectionLabel>
          <NavItem
            href="/admin/requests"
            active={pathname.startsWith("/admin/requests")}
            icon={<Send size={16} />}
            label="Testimonial requests"
          />
        </nav>

        <div className="p-3 border-t border-border">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ExternalLink size={14} /> View site
          </a>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-14 shrink-0 border-b border-border bg-card/60 backdrop-blur flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          {/* Mobile nav (horizontal scroll) */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto -mx-1 px-1">
            <GuardedLink
              href="/admin"
              className={cn(
                "shrink-0 text-xs px-2.5 py-1.5 rounded-md",
                pathname === "/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              Home
            </GuardedLink>
            <GuardedLink
              href="/admin/resume"
              className={cn(
                "shrink-0 text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap",
                pathname.startsWith("/admin/resume")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              Resume
            </GuardedLink>
            {CONTENT_TYPES.filter(
              (t) => (t.group ?? "Content") === "Content",
            ).map((t) => (
              <GuardedLink
                key={t.key}
                href={`/admin/${t.key}`}
                className={cn(
                  "shrink-0 text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap",
                  pathname.startsWith(`/admin/${t.key}`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                )}
              >
                {t.label}
              </GuardedLink>
            ))}
            <GuardedLink
              href="/admin/requests"
              className={cn(
                "shrink-0 text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap",
                pathname.startsWith("/admin/requests")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              Requests
            </GuardedLink>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight hidden sm:block">
              <p className="text-xs font-medium">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground">{user?.email}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSignOut}
              title="Sign out"
              className="h-8 w-8"
            >
              <LogOut size={15} />
            </Button>
          </div>
        </header>

        <main className="flex-1 min-w-0 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/** Section heading with a divider above it, grouping the sidebar nav. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-3 mt-3 mb-1 border-t border-border/70" />
      <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </p>
    </>
  );
}

function NavItem({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <GuardedLink
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      {icon}
      {label}
    </GuardedLink>
  );
}
