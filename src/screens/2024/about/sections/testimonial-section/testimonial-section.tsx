"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { Quote } from "lucide-react";
import { Banner } from "../../components";
import { getColor } from "@/lib";
import { useSettingsStore } from "@/stores";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import {
  type TestimonialRelationship,
  type TestimonialInterface,
} from "@/config";
import { useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToTestimonials } from "@/lib/content/portfolio";

const RELATIONSHIP_STYLES: Record<TestimonialRelationship, string> = {
  Colleague: "bg-blue-500/10 text-blue-500",
  Client: "bg-violet-500/10 text-violet-500",
  Manager: "bg-amber-500/10 text-amber-500",
  Mentor: "bg-emerald-500/10 text-emerald-500",
  Peer: "bg-rose-500/10 text-rose-500",
};

function StarRating({
  rating,
  accent,
  idPrefix,
}: {
  rating: number;
  accent: string;
  idPrefix: string;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i));
        const gid = `${idPrefix}-s${i}`;
        return (
          <svg key={i} className="h-3 w-3" viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                <stop
                  offset={`${fill * 100}%`}
                  stopColor={accent}
                  stopOpacity="1"
                />
                <stop
                  offset={`${fill * 100}%`}
                  stopColor={accent}
                  stopOpacity="0.2"
                />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#${gid})`}
              stroke={accent}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  cardIndex,
}: {
  testimonial: TestimonialInterface;
  cardIndex: number;
}) {
  const { color } = useSettingsStore();
  const accent = getColor(color);

  return (
    <div className="shrink-0 w-72 sm:w-80 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-3 mx-3 select-none">
      {/* Top: quote + social links */}
      <div className="flex items-start justify-between gap-2">
        <Quote
          className="h-4 w-4 shrink-0 mt-0.5"
          style={{ color: accent }}
          aria-hidden
        />
        {(testimonial.github ||
          testimonial.linkedin ||
          testimonial.behance) && (
          <div className="flex items-center gap-1.5">
            <TooltipProvider delayDuration={300}>
              {testimonial.github && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={testimonial.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${testimonial.name} GitHub`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>GitHub</TooltipContent>
                </Tooltip>
              )}
              {testimonial.linkedin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={testimonial.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${testimonial.name} LinkedIn`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>LinkedIn</TooltipContent>
                </Tooltip>
              )}
              {testimonial.behance && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={testimonial.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${testimonial.name} Behance`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.202.836 1.870 1.883 1.870.52 0 1.023-.277 1.297-.83zm-5.1-7.23c-.91 0-1.724.633-1.871 1.945h3.645c-.079-1.219-.758-1.945-1.774-1.945zM9.987 11.195c.618.592.94 1.39.94 2.41 0 2.168-1.387 3.395-4.138 3.395H1V5h5.388C8.6 5 10 6.08 10 8.12c0 .97-.3 1.675-.826 2.168l-.187.172v-.265zm-5.51-3.46v2.047h1.743c.739 0 1.163-.4 1.163-1.023 0-.629-.424-1.024-1.163-1.024H4.477zm0 4.087v2.23h1.952c.84 0 1.32-.42 1.32-1.115 0-.694-.48-1.115-1.32-1.115H4.477z" />
                      </svg>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Behance</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Stars + service + relationship */}
      <div className="flex items-center justify-between gap-2">
        <StarRating
          rating={testimonial.rating}
          accent={accent}
          idPrefix={`star-${cardIndex}`}
        />
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
            RELATIONSHIP_STYLES[testimonial.relationship],
          )}
        >
          {testimonial.relationship}
        </span>
      </div>

      <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
        {testimonial.service}
      </p>

      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
        {testimonial.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-border">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-primary-foreground"
          style={{ backgroundColor: accent }}
          aria-hidden
        >
          {testimonial.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

const SPEED = 50;

function MarqueeRow({
  items,
  reverse = false,
  paused,
  rowId,
}: {
  items: TestimonialInterface[];
  reverse?: boolean;
  paused: boolean;
  rowId: string;
}) {
  const doubled = [...items, ...items, ...items];
  const contentRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (paused || !contentRef.current) return;
    const singleWidth = contentRef.current.scrollWidth / 3;
    if (!singleWidth) return;

    const dir = reverse ? 1 : -1;
    let next = x.get() + dir * SPEED * (delta / 1000);

    if (!reverse && next <= -singleWidth) next += singleWidth;
    if (reverse && next >= singleWidth) next -= singleWidth;

    x.set(next);
  });

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
      <motion.div ref={contentRef} className="flex" style={{ x }}>
        {doubled.map((t, i) => (
          <TestimonialCard
            key={i}
            testimonial={t}
            cardIndex={Number(rowId) * 100 + i}
          />
        ))}
      </motion.div>
    </div>
  );
}

export const TestimonialSection = () => {
  useLocaleRefresh();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [paused, setPaused] = useState(false);
  const locale = useLanguageStore((s) => s.language);
  const testimonials = rowsToTestimonials(useContent("testimonials"), locale);
  const ROW_A = testimonials.slice(0, 3);
  const ROW_B = testimonials.slice(3);

  // Nothing published (or the content store hasn't resolved yet) — drop the
  // whole block, banner included, rather than leaving a heading over dead
  // space. Every hook above still runs, so the order stays stable.
  if (testimonials.length === 0) return null;

  return (
    <div className="relative pb-16">
      <Banner />
      <section ref={ref} className="py-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Testimonials
          </p>
          <h2 className="text-2xl font-bold">What people say</h2>
        </motion.div>

        <motion.div
          className={cn("flex flex-col gap-4 -mx-6 lg:-mx-24")}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <MarqueeRow items={ROW_A} paused={paused} rowId="0" />
          {/* Fewer than four testimonials leaves row B empty — skip it instead
              of animating a blank strip. */}
          {ROW_B.length > 0 && (
            <MarqueeRow items={ROW_B} reverse paused={paused} rowId="1" />
          )}
        </motion.div>
      </section>
    </div>
  );
};
