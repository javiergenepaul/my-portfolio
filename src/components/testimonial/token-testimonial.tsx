"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Link2Off, CircleCheck, ShieldX } from "lucide-react";
import {
  getInvite,
  submitInvite,
  type TestimonialInvite,
} from "./invite-store";
import { TestimonialSubmissionForm } from "./submission-form";

export function TokenTestimonial() {
  const { token } = useParams<{ token: string }>();
  const [invite, setInvite] = useState<TestimonialInvite | null | undefined>(
    undefined,
  );

  // undefined = still reading; null = not found.
  useEffect(() => {
    setInvite(getInvite(token) ?? null);
  }, [token]);

  if (invite === undefined) {
    return (
      <Center>
        <Loader2 className="animate-spin text-muted-foreground" size={22} />
      </Center>
    );
  }

  if (invite === null) {
    return (
      <Blocked
        icon={<Link2Off size={28} />}
        title="This link isn't valid"
        message="The testimonial link is invalid or has expired. Please double-check the URL, or ask for a fresh link."
      />
    );
  }

  if (invite.status === "revoked") {
    return (
      <Blocked
        icon={<ShieldX size={28} />}
        title="This link is no longer active"
        message="The person who invited you has deactivated this link. Reach out to them for a new one."
      />
    );
  }

  if (invite.status === "submitted") {
    return (
      <Blocked
        variant="success"
        icon={<CircleCheck size={28} />}
        title="You've already submitted"
        message={`Thanks, ${invite.recipientName}! Your testimonial is in — you can only submit once per link.`}
      />
    );
  }

  // Active → let them fill it out, prefilled with what the admin entered.
  return (
    <TestimonialSubmissionForm
      defaults={{
        name: invite.recipientName,
        role: invite.recipientRole,
        company: invite.recipientCompany,
      }}
      onSubmitted={(data) => submitInvite(invite.token, data)}
    />
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-background p-6">
      {children}
    </div>
  );
}

function Blocked({
  icon,
  title,
  message,
  variant = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  variant?: "neutral" | "success";
}) {
  return (
    <Center>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div
          className={
            "mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full " +
            (variant === "success"
              ? "bg-emerald-500/15 text-emerald-500"
              : "bg-muted text-muted-foreground")
          }
        >
          {icon}
        </div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{message}</p>
      </div>
    </Center>
  );
}
