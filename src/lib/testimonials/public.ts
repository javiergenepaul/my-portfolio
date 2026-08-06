"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getServerProfile } from "@/lib/content/server-profile";
import { sendTestimonialEmail } from "@/lib/email/send";
import { storeTestimonialImage } from "./upload";
import type { SubmissionInput } from "./invites";

/**
 * The public testimonial link (/testimonial/share).
 *
 * Unlike a private invite — one admin-created row the recipient UPDATEs — a
 * public submission INSERTs a brand-new row. That's only permitted while the
 * admin toggle is ON, and RLS enforces the toggle (see 0022), so this code
 * never has to be the gate: a submit while disabled simply fails the insert.
 */

/** Absolute base for links inside emails. Mirrors invites.ts. */
function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://gene-paul-mar-javier.dev";
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

/** Is the public form currently accepting submissions? */
export async function getPublicEnabled(): Promise<boolean> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("testimonial_public")
    .select("enabled")
    .maybeSingle();
  return data?.enabled === true;
}

/** Admin: flip the public form on or off. */
export async function setPublicEnabled(enabled: boolean): Promise<void> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("testimonial_public")
    .update({ enabled })
    .eq("id", true);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/requests");
  revalidatePath("/testimonial/share");
}

/** Photo upload for the public form. Gate: the toggle must be ON. */
export async function uploadPublicTestimonialPhoto(
  dataUrl: string,
): Promise<{ url?: string; error?: string }> {
  if (!(await getPublicEnabled())) {
    return { error: "This form isn't accepting submissions right now." };
  }
  return storeTestimonialImage(dataUrl);
}

/**
 * Record a public submission. The insert carries source='public' +
 * status='submitted'; RLS rejects it unless the toggle is on, so a disabled
 * form can't be posted to even by a crafted request. (Bot filtering is the
 * honeypot in the form itself, before this is reached.)
 */
export async function submitPublicTestimonial(
  input: SubmissionInput,
): Promise<boolean> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonial_invites")
    .insert({
      source: "public",
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
    .select("id");

  // A rejected insert (toggle off, or RLS) returns no rows — report it as
  // closed rather than leaking the policy detail.
  if (error || (data?.length ?? 0) === 0) return false;

  // Notify the owner, same best-effort posture as the private flow.
  const { profile } = await getServerProfile();
  await sendTestimonialEmail({
    to_email: profile.email,
    to_name: profile.fullName,
    reply_to: input.email?.trim() || profile.email,
    subject: `New public testimonial from ${input.name}`,
    banner: "New Testimonial · public link",
    intro: `${input.name} submitted a testimonial through the public link.`,
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
