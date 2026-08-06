import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link2Off } from "lucide-react";
import { getPublicEnabled } from "@/lib/testimonials/public";

export const metadata: Metadata = {
  title: "Share a testimonial",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Bare entry point. Private submissions come in via /testimonial/<token>. If the
 * public link is open, send a bare visitor to it; otherwise explain they need a
 * link.
 */
export default async function TestimonialIndexPage() {
  if (await getPublicEnabled()) redirect("/testimonial/share");

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Link2Off size={28} />
        </div>
        <h1 className="text-lg font-semibold">You need an invite link</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Testimonials are submitted through a personal link. Please use the
          link you were sent, or ask for one.
        </p>
      </div>
    </div>
  );
}
