"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { SocialLink } from "@/components/testimonial/social-platforms";

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
  return (data?.length ?? 0) > 0;
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
 * Approve a submission: copy it into `testimonials` as an UNPUBLISHED row, then
 * mark the invite approved and link the two.
 *
 * Unpublished on purpose — approving means "this is real", not "put it live".
 * The admin still edits localized copy and flips Published in the normal
 * Testimonials editor, so nothing reaches the public site unreviewed.
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
      published: false,
    })
    .select("id")
    .single();
  if (insertErr) throw new Error(insertErr.message);

  const { error: updateErr } = await supabase
    .from("testimonial_invites")
    .update({ status: "approved", testimonial_id: (created as Row).id })
    .eq("token", token);
  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/admin/requests");
  revalidatePath("/admin/testimonials");
}
