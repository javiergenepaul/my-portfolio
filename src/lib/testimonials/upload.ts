"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Photo upload for the public testimonial form.
 *
 * The `content` bucket only allows authenticated writes (0013_storage), and the
 * submitter is anon — so the upload runs here with the service-role client
 * instead of handing storage credentials to the browser.
 *
 * That makes this the one place anon input reaches privileged code, so it is
 * gated hard: the token must resolve to an invite that is still `active`, and
 * the file must pass type and size checks before anything is written.
 */

const BUCKET = "content";
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function uploadTestimonialPhoto(
  token: string,
  dataUrl: string,
): Promise<{ url?: string; error?: string }> {
  // 1. The token must belong to an invite that can still be submitted. Uses the
  //    anon client deliberately: RLS decides, not this code.
  const publicClient = createPublicClient();
  const { data: invite } = await publicClient
    .from("testimonial_invites")
    .select("status")
    .eq("token", token)
    .maybeSingle();

  if (!invite || invite.status !== "active") {
    return { error: "This link is no longer accepting submissions." };
  }

  // 2. Parse and validate before touching storage.
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return { error: "That file could not be read." };

  const [, mime, b64] = match;
  const ext = ALLOWED.get(mime);
  if (!ext) return { error: "Please use a JPG, PNG, or WebP image." };

  const bytes = Buffer.from(b64, "base64");
  if (bytes.byteLength > MAX_BYTES) {
    return { error: "That image is over 3 MB. Please choose a smaller one." };
  }

  // 3. Upload. The path is keyed by a fresh uuid, never by user input, so a
  //    crafted filename can't escape the folder or overwrite anything.
  try {
    const admin = createAdminClient();
    const path = `testimonials/${crypto.randomUUID()}.${ext}`;
    const { error } = await admin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (error) return { error: error.message };

    const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed." };
  }
}
