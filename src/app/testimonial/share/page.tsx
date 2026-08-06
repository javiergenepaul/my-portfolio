import type { Metadata } from "next";
import { Link2Off } from "lucide-react";
import { getPublicEnabled } from "@/lib/testimonials/public";
import { getServerProfile } from "@/lib/content/server-profile";
import { PublicTestimonial } from "@/components/testimonial/public-testimonial";

export const metadata: Metadata = {
  title: "Share a testimonial",
  robots: { index: false, follow: false },
};

// Read fresh on each request so the admin toggle takes effect immediately.
export const dynamic = "force-dynamic";

/**
 * The public, shareable submission form. Gated by the admin toggle: when it's
 * off, the page shows a closed state and RLS would reject a submit anyway.
 */
export default async function PublicTestimonialPage() {
  const [enabled, { profile }] = await Promise.all([
    getPublicEnabled(),
    getServerProfile(),
  ]);

  if (!enabled) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Link2Off size={28} />
          </div>
          <h1 className="text-lg font-semibold">Not accepting submissions</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {profile.fullName.split(" ")[0]} isn&apos;t collecting testimonials
            through this link right now. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return <PublicTestimonial />;
}
