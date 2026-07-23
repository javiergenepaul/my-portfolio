/**
 * Verifies the server-side EmailJS setup end to end and prints the real reason
 * when it fails. Sends ONE test email to the address you pass (or the profile
 * email from the CMS).
 *
 * Run: pnpm email:check  [recipient@example.com]
 *
 * Uses one of your monthly EmailJS requests. That's the point — the browser
 * "Test It" button in the EmailJS dashboard does NOT exercise the private-key /
 * non-browser path, so it can pass while the server path still 403s.
 */

const serviceId = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY;
const templateId = process.env.EMAILJS_TEMPLATE_TESTIMONIAL;

const rows = [
  ["NEXT_PUBLIC_EMAIL_SERVICE_ID", serviceId],
  ["NEXT_PUBLIC_EMAIL_PUBLIC_KEY", publicKey],
  ["EMAILJS_PRIVATE_KEY", privateKey],
  ["EMAILJS_TEMPLATE_TESTIMONIAL", templateId],
];

let missing = false;
for (const [name, value] of rows) {
  // Never print secrets — presence and length are enough to spot a bad paste.
  const shown = value
    ? name.startsWith("NEXT_PUBLIC")
      ? value
      : `set (${value.length} chars)`
    : "MISSING";
  if (!value) missing = true;
  console.log(`${value ? "ok  " : "FAIL"} ${name.padEnd(32)} ${shown}`);
}

if (missing) {
  console.log(
    "\nAdd the missing values to .env.local, then re-run. Vercel-only vars " +
      "do not apply to local runs.",
  );
  process.exit(1);
}

const to = process.argv[2];
if (!to) {
  console.log("\nPass a recipient: pnpm email:check you@example.com");
  process.exit(1);
}

console.log(`\nSending a test email to ${to}…`);

const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: {
      to_email: to,
      to_name: "Test",
      reply_to: to,
      subject: "EmailJS server-side test",
      banner: "Test",
      intro: "If you're reading this, server-side sending works.",
      quote: "This is a test testimonial body.",
      details: "Role: Tester\nCompany: —\nRating: 5 / 5",
      cta_label: "Open the admin",
      cta_url: "https://gene-paul-mar-javier.dev/admin/requests",
      footer: "Sent by scripts/check-email.mjs",
    },
  }),
});

const body = await res.text().catch(() => "");

if (res.ok) {
  console.log(`\nSUCCESS (${res.status}). Check ${to} — including spam.`);
  process.exit(0);
}

console.log(`\nFAILED ${res.status}: ${body}`);
if (res.status === 403) {
  console.log(
    "\n403 almost always means non-browser API access is off.\n" +
      "Fix: EmailJS → Account → Security → enable\n" +
      '     "Allow EmailJS API for non-browser applications".',
  );
} else if (res.status === 400) {
  console.log(
    "\n400 usually means a bad template id, service id, or a template " +
      "field (To Email) left blank instead of {{to_email}}.",
  );
}
process.exit(1);
