import type { Metadata } from "next";
import { getInviteByToken } from "@/lib/testimonials/invites";
import { getServerProfile } from "@/lib/content/server-profile";
import { TokenTestimonial } from "@/components/testimonial/token-testimonial";

const BASE_URL = "https://gene-paul-mar-javier.dev";

/**
 * Open Graph tags are declared explicitly rather than inherited from the root
 * layout: these links get pasted into chat apps, and without a title,
 * description, and absolute image URL the scraper renders a bare link.
 *
 * `noindex` stays — an invite link must never end up in search results. Most
 * social scrapers still build a preview from the OG tags despite it.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const [invite, { profile }] = await Promise.all([
    getInviteByToken(token),
    getServerProfile(),
  ]);

  const title = `Share a testimonial for ${profile.fullName}`;
  // Greet them by name when the token resolves; stay generic when it doesn't,
  // so a dead link never leaks who it was originally addressed to.
  const description = invite?.recipientName
    ? `Hi ${invite.recipientName} — you've been invited to share a short testimonial. It only takes a minute.`
    : "You've been invited to share a short testimonial. It only takes a minute.";

  const image = `${BASE_URL}/meta-bg.png`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: `${profile.fullName} Portfolio`,
      url: `${BASE_URL}/testimonial/${token}`,
      title,
      description,
      // Real dimensions of meta-bg.png. Declaring the conventional 1200×630
      // here would be a lie some scrapers trust, producing a stretched card.
      images: [{ url: image, width: 1440, height: 1024, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * The invite is resolved on the server, so the recipient never sees a loading
 * flash and an unknown token renders the blocked state directly.
 */
export default async function TestimonialTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInviteByToken(token);
  return <TokenTestimonial invite={invite} token={token} />;
}
