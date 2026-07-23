"use client";

import { useState } from "react";
import { Link2Off, CircleCheck, ShieldX } from "lucide-react";
import {
  submitTestimonial,
  type PublicInvite,
} from "@/lib/testimonials/invites";
import { uploadTestimonialPhoto } from "@/lib/testimonials/upload";
import { TestimonialSubmissionForm } from "./submission-form";

/**
 * Recipient-facing invite page. The invite is resolved server-side and passed
 * in — `null` means the token is unknown, revoked, or already approved.
 */
export function TokenTestimonial({
  invite,
  token,
}: {
  invite: PublicInvite | null;
  token: string;
}) {
  // Flipped locally after a successful submit so the thank-you state shows
  // without a round trip; a reload reaches the same state from the DB.
  const [justSubmitted, setJustSubmitted] = useState(false);

  if (!invite) {
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

  if (invite.status === "submitted" || justSubmitted) {
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
      onUploadPhoto={(dataUrl) => uploadTestimonialPhoto(token, dataUrl)}
      onSubmitted={async (data) => {
        const ok = await submitTestimonial(token, {
          name: data.name,
          email: data.email,
          role: data.role,
          company: data.company,
          relationship: data.relationship,
          rating: data.rating,
          message: data.message,
          photo: data.photo,
          socials: data.socials,
        });
        if (ok) setJustSubmitted(true);
        return ok;
      }}
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
