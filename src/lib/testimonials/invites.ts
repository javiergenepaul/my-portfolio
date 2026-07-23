"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getServerProfile } from "@/lib/content/server-profile";
import { sendTestimonialEmail } from "@/lib/email/send";
import type { SocialLink } from "@/components/testimonial/social-platforms";

/** Absolute base for links inside emails. */
function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://gene-paul-mar-javier.dev";
}

/**
 * Testimonial invite flow, backed by `public.testimonial_invites`.
 *
 * Replaces the localStorage prototype: the invite now lives in Postgres, so a
 * link the admin shares actually opens on the recipient's device.
 *
 * Two audiences, two clients:
 *   - admin actions re-verify the session and write with the *user's* client,
 *     so RLS enforces access at the database too (same posture as
 *     lib/content/actions.ts — never the service-role key)
 *   - recipient actions use the anon client, which RLS restricts to reading one
 *     invite by token and submitting once into an `active` one
 */

export type InviteStatus = "active" | "submitted" | "revoked" | "approved";

/** What the recipient's page is allowed to see — no other invite's answers. */
export interface PublicInvite {
  token: string;
  recipientName: string;
  recipientRole?: string;
  recipientCompany?: string;
  status: InviteStatus;
}

/** Full row, admin-only. */
export interface Invite extends PublicInvite {
  id: string;
  createdAt: string;
  submission?: {
    name: string;
    email?: string;
    role?: string;
    company?: string;
    relationship?: string;
    rating: number;
    message: string;
    photo?: string | null;
    socials: SocialLink[];
    submittedAt: string;
  };
  testimonialId?: string;
}

export interface SubmissionInput {
  name: string;
  /** Optional — used to notify them when the testimonial is published. */
  email?: string;
  role?: string;
  company?: string;
  relationship?: string;
  rating: number;
  message: string;
  photo?: string | null;
  socials: SocialLink[];
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

/** URL-safe, unguessable. The token is the only secret protecting an invite. */
function newToken(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
}

type Row = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : undefined);

function toInvite(r: Row): Invite {
  const submitted = s(r.submitted_at);
  return {
    id: String(r.id),
    token: String(r.token),
    recipientName: s(r.recipient_name) ?? "",
    recipientRole: s(r.recipient_role),
    recipientCompany: s(r.recipient_company),
    status: String(r.status) as InviteStatus,
    createdAt: String(r.created_at),
    testimonialId: s(r.testimonial_id),
    submission: submitted
      ? {
          name: s(r.name) ?? "",
          email: s(r.email),
          role: s(r.role),
          company: s(r.company),
          relationship: s(r.relationship),
          rating: Number(r.rating ?? 0),
          message: s(r.message) ?? "",
          photo: s(r.photo) ?? null,
          socials: Array.isArray(r.links) ? (r.links as SocialLink[]) : [],
          submittedAt: submitted,
        }
      : undefined,
  };
}

// ── Recipient (anon) ────────────────────────────────────────────────────────

/**
 * Look up one invite by token. Returns null when the token is unknown or the
 * invite is revoked/approved — RLS also restricts anon to the recipient-facing
 * columns, so a valid token still can't read anyone else's submission.
 */
export async function getInviteByToken(
  token: string,
): Promise<PublicInvite | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonial_invites")
    .select("token, recipient_name, recipient_role, recipient_company, status")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;
  const r = data as Row;
  return {
    token: String(r.token),
    recipientName: s(r.recipient_name) ?? "",
    recipientRole: s(r.recipient_role),
    recipientCompany: s(r.recipient_company),
    status: String(r.status) as InviteStatus,
  };
}

/**
 * Record the recipient's testimonial. Single-use is enforced by RLS, not here:
 * the anon update policy only matches rows still `active`, so a replay updates
 * zero rows and returns false rather than overwriting a prior answer.
 */
export async function submitTestimonial(
  token: string,
  input: SubmissionInput,
): Promise<boolean> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonial_invites")
    .update({
      status: "submitted",
      name: input.name,
      email: input.email?.trim() || null,
      role: input.role ?? null,
      company: input.company ?? null,
      relationship: input.relationship ?? null,
      rating: input.rating || null,
      message: input.message,
      photo: input.photo ?? null,
      links: input.socials ?? [],
      submitted_at: new Date().toISOString(),
    })
    .eq("token", token)
    .eq("status", "active")
    .select("token");

  if (error) return false;
  if ((data?.length ?? 0) === 0) return false;

  // Notify the site owner. Deliberately after the write and never awaited into
  // the result — a mail failure must not tell the recipient their testimonial
  // didn't go through, because it did.
  const { profile } = await getServerProfile();
  void sendTestimonialEmail({
    to_email: profile.email,
    to_name: profile.fullName,
    // Reply goes straight to the author when they left an address.
    reply_to: input.email?.trim() || profile.email,
    subject: `New testimonial from ${input.name}`,
    banner: "New Testimonial",
    intro: `${input.name} submitted a testimonial.`,
    quote: input.message,
    details: [
      `Role: ${input.role || "—"}`,
      `Company: ${input.company || "—"}`,
      `Relationship: ${input.relationship || "—"}`,
      `Rating: ${input.rating || 0} / 5`,
      `Email: ${input.email?.trim() || "not provided"}`,
    ].join("\n"),
    cta_label: "Review & publish",
    cta_url: `${siteUrl()}/admin/requests`,
    footer: "Sent automatically from your portfolio.",
  });

  return true;
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function listInvites(): Promise<Invite[]> {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("testimonial_invites")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Row[]).map(toInvite);
}

export async function createInvite(input: {
  recipientName: string;
  recipientRole?: string;
  recipientCompany?: string;
}): Promise<Invite> {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("testimonial_invites")
    .insert({
      token: newToken(),
      recipient_name: input.recipientName.trim(),
      recipient_role: input.recipientRole?.trim() || null,
      recipient_company: input.recipientCompany?.trim() || null,
      status: "active",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/requests");
  return toInvite(data as Row);
}

export async function setInviteStatus(
  token: string,
  status: Extract<InviteStatus, "active" | "revoked">,
): Promise<void> {
  const supabase = await requireAdmin();
  // Never reopen an invite that's already been answered or approved.
  const { error } = await supabase
    .from("testimonial_invites")
    .update({ status })
    .eq("token", token)
    .in("status", ["active", "revoked"]);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/requests");
}

export async function deleteInvite(token: string): Promise<void> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("testimonial_invites")
    .delete()
    .eq("token", token);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/requests");
}

/**
 * Approve a submission: copy it into `testimonials` and publish it in one step,
 * then mark the invite approved and link the two.
 *
 * Published immediately — the admin has already read the submission in the
 * review dialog, so a separate draft step is just extra work. Editing and
 * unpublishing stay available in the normal Testimonials editor.
 *
 * The copy is English-only; `pick()` falls back to `en`, so the other three
 * locales render the original text rather than going blank until translated.
 */
export async function approveInvite(token: string): Promise<void> {
  const supabase = await requireAdmin();

  const { data: invite, error: readErr } = await supabase
    .from("testimonial_invites")
    .select("*")
    .eq("token", token)
    .single();
  if (readErr) throw new Error(readErr.message);

  const r = invite as Row;
  if (r.status !== "submitted") {
    throw new Error("Only a submitted invite can be approved.");
  }

  // `role` and `text` are localized jsonb; seed English and let the admin
  // translate in the Testimonials editor.
  const { data: created, error: insertErr } = await supabase
    .from("testimonials")
    .insert({
      name: s(r.name) ?? "",
      role: { en: s(r.role) ?? "" },
      company: s(r.company) ?? null,
      text: { en: s(r.message) ?? "" },
      rating: r.rating ?? null,
      avatar: s(r.photo) ?? null,
      relationship: s(r.relationship) ?? null,
      links: Array.isArray(r.links) ? r.links : [],
      published: true,
    })
    .select("id")
    .single();
  if (insertErr) throw new Error(insertErr.message);

  const { error: updateErr } = await supabase
    .from("testimonial_invites")
    .update({ status: "approved", testimonial_id: (created as Row).id })
    .eq("token", token);
  if (updateErr) throw new Error(updateErr.message);

  // Tell the author they're live, through the same shared template. Skipped
  // when they left no address, and never allowed to fail the approval — the
  // testimonial is already published either way.
  const authorEmail = s(r.email)?.trim();
  if (authorEmail) {
    const { profile } = await getServerProfile();
    void sendTestimonialEmail({
      to_email: authorEmail,
      to_name: s(r.name) || "there",
      reply_to: profile.email,
      subject: "Your testimonial is now live",
      banner: "Your Testimonial Is Live",
      intro: `Hi ${s(r.name) || "there"}, thank you for taking the time to write this — it's now published on my portfolio.`,
      quote: s(r.message) ?? "",
      details: "",
      cta_label: "View the portfolio",
      cta_url: siteUrl(),
      footer: `Replying to this email reaches ${profile.email} directly.`,
    });
  }

  revalidatePath("/admin/requests");
  revalidatePath("/admin/testimonials");
}
