import type { Metadata } from "next";
import { Link2Off } from "lucide-react";

export const metadata: Metadata = {
  title: "Share a testimonial",
  robots: { index: false, follow: false },
};

// The open form is invite-only now — you reach it via /testimonial/<token>.
export default function TestimonialIndexPage() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Link2Off size={28} />
        </div>
        <h1 className="text-lg font-semibold">You need an invite link</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Testimonials are submitted through a personal link. Please use the link
          you were sent, or ask for one.
        </p>
      </div>
    </div>
  );
}
