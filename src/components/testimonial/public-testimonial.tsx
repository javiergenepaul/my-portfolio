"use client";

import {
  submitPublicTestimonial,
  uploadPublicTestimonialPhoto,
} from "@/lib/testimonials/public";
import { TestimonialSubmissionForm } from "./submission-form";

/**
 * The open, shareable testimonial form (/testimonial/share). Same form as the
 * private invite, but with no prefilled recipient and wired to the public
 * server actions — which INSERT a new row rather than update an invite.
 */
export function PublicTestimonial() {
  return (
    <TestimonialSubmissionForm
      onUploadPhoto={(dataUrl) => uploadPublicTestimonialPhoto(dataUrl)}
      onSubmitted={(data) =>
        submitPublicTestimonial({
          name: data.name,
          email: data.email,
          role: data.role,
          company: data.company,
          relationship: data.relationship,
          rating: data.rating,
          message: data.message,
          photo: data.photo,
          socials: data.socials,
        })
      }
    />
  );
}
