"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, LogIn } from "lucide-react";
import { Button, Input, Label } from "@/components";
import { useAdminAuth } from "./admin-auth";

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, ready } = useAdminAuth();
  const [email, setEmail] = useState("gene@admin.dev");
  const [password, setPassword] = useState("password");

  // Already signed in → go straight to the dashboard.
  useEffect(() => {
    if (ready && isAuthenticated) router.replace("/admin");
  }, [ready, isAuthenticated, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim());
    router.replace("/admin");
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Admin sign in
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your portfolio content.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full gap-2 mt-1">
            <LogIn size={16} />
            Sign in
          </Button>
        </form>

        {/* Prototype banner — makes the fake auth unmistakable. */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground">
          <Lock size={13} className="mt-0.5 shrink-0 text-amber-500" />
          <span>
            <b className="text-foreground">Simulated login.</b> Any email/password
            works — this is a UI prototype. Real Supabase Auth (gated by
            middleware + RLS) gets wired in later.
          </span>
        </div>
      </div>
    </div>
  );
}
