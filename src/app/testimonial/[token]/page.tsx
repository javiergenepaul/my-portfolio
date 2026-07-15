import type { Metadata } from "next";
import { TokenTestimonial } from "@/components/testimonial/token-testimonial";

export const metadata: Metadata = {
  title: "Share a testimonial",
  robots: { index: false, follow: false },
};

export default function TestimonialTokenPage() {
  return <TokenTestimonial />;
}
