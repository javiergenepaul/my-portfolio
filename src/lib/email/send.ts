/**
 * Server-side EmailJS sender. SERVER ONLY — never import from a client
 * component: `EMAILJS_PRIVATE_KEY` has no NEXT_PUBLIC_ prefix, so it resolves
 * to undefined in the browser and every send would silently no-op.
 *
 * The contact form calls EmailJS from the browser with the public key. That
 * endpoint rejects non-browser callers, so server code has to authenticate with
 * the PRIVATE key via `accessToken` — which is also why this module is
 * server-only and the key has no NEXT_PUBLIC_ prefix. Enable
 * "API calls from non-browser applications" in EmailJS → Account → Security,
 * or every send here comes back 403.
 *
 * Sends are best-effort by design: `sendEmail` never throws. A testimonial must
 * still be recorded (and a publish must still happen) when the mail provider is
 * down or misconfigured — losing a notification is recoverable, losing someone's
 * submitted testimonial is not.
 */

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

export interface SendEmailInput {
  /** EmailJS template id for this specific notification. */
  templateId: string;
  /** Variables the template interpolates. */
  params: Record<string, string | number>;
}

export async function sendEmail({
  templateId,
  params,
}: SendEmailInput): Promise<{ ok: boolean; error?: string }> {
  const serviceId = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !publicKey || !privateKey || !templateId) {
    const missing = [
      !serviceId && "NEXT_PUBLIC_EMAIL_SERVICE_ID",
      !publicKey && "NEXT_PUBLIC_EMAIL_PUBLIC_KEY",
      !privateKey && "EMAILJS_PRIVATE_KEY",
      !templateId && "template id",
    ]
      .filter(Boolean)
      .join(", ");
    console.warn(`[email] skipped — missing ${missing}`);
    return { ok: false, error: `missing ${missing}` };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: params,
      }),
    });

    if (!res.ok) {
      // EmailJS returns the reason as plain text, which is worth logging —
      // 403 almost always means non-browser API access is still disabled.
      const body = await res.text().catch(() => "");
      console.error(`[email] send failed ${res.status}: ${body}`);
      return { ok: false, error: `${res.status} ${body}` };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] send threw:", e);
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

/**
 * Template ids. Only the new-submission alert exists: the free EmailJS tier
 * allows two templates and both are spoken for (contact form + this one), so
 * there is no "testimonial published" notification. Add one here if the plan
 * ever allows a third.
 */
export const EMAIL_TEMPLATES = {
  testimonialSubmitted:
    process.env.EMAILJS_TEMPLATE_TESTIMONIAL_SUBMITTED ?? "",
};
