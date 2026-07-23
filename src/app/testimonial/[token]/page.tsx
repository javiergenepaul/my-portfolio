import type { Metadata } from "next";
import { getInviteByToken } from "@/lib/testimonials/invites";
import { TokenTestimonial } from "@/components/testimonial/token-testimonial";

export const metadata: Metadata = {
  title: "Share a testimonial",
  robots: { index: false, follow: false },
};

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
