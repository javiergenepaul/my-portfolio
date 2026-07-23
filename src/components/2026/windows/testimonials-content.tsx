"use client";

import { useState } from "react";
import { Github, Linkedin, Palette, Quote, Star } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToTestimonials } from "@/lib/content/portfolio";

export function TestimonialsContent() {
  useLocaleRefresh();
  const locale = useLanguageStore((s) => s.language);
  const TESTIMONIALS = rowsToTestimonials(useContent("testimonials"), locale);

  const testimonialIds = [
    "sarah",
    "david",
    "maria",
    "kevin",
    "lyn",
    "james",
  ] as const;

  const relationshipKeyMap: Record<string, string> = {
    Colleague: "colleague",
    Manager: "manager",
    Peer: "peer",
    Mentor: "mentor",
    Client: "client",
  };

  const serviceKeyMap: Record<string, string> = {
    "Full-Stack Development": "fullStackDevelopment",
    "UI Implementation": "uiImplementation",
    "Agile Collaboration": "agileCollaboration",
    "Backend & Microservices": "backendMicroservices",
  };

  const [relationshipFilter, setRelationshipFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const relationshipOptions = Array.from(
    new Set(TESTIMONIALS.map((t) => t.relationship)),
  );
  const serviceOptions = Array.from(
    new Set(TESTIMONIALS.map((t) => t.service)),
  );

  const cards = TESTIMONIALS.map((testimonial, index) => {
    const testimonialId = testimonialIds[index];
    const relationshipKey = relationshipKeyMap[testimonial.relationship];
    const serviceKey = serviceKeyMap[testimonial.service];

    return {
      ...testimonial,
      testimonialId,
      relationshipLabel: relationshipKey
        ? translate(
            `win26.testimonials.relationships.${relationshipKey}` as any,
          )
        : testimonial.relationship,
      serviceLabel: serviceKey
        ? translate(`win26.testimonials.services.${serviceKey}` as any)
        : testimonial.service,
      text: testimonial.text,
    };
  }).filter((testimonial) => {
    const relationshipMatch =
      relationshipFilter === "all" ||
      testimonial.relationship === relationshipFilter;
    const serviceMatch =
      serviceFilter === "all" || testimonial.service === serviceFilter;
    return relationshipMatch && serviceMatch;
  });

  return (
    <div className="font-mac flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center shrink-0 border-b bg-a26-title-bar border-a26-glass-border gap-2 py-2 px-3.5">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-[8px]"
          style={{
            background: "color-mix(in srgb, #EC4899 14%, transparent)",
            border: "1px solid color-mix(in srgb, #EC4899 26%, transparent)",
          }}
        >
          <Quote size={14} color="#EC4899" />
        </div>
        <div>
          <div className="text-a26-text text-[13px] font-semibold">
            {translate("win26.testimonials.title")}
          </div>
          <div className="text-a26-mid text-[11px]">
            {translate("win26.testimonials.subtitle")}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-b border-a26-glass-border px-4 py-2 bg-a26-sidebar grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1">
          <div className="text-a26-muted text-[9px] font-bold tracking-[0.08em] uppercase leading-none">
            {translate("win26.testimonials.filters.relationship")}
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setRelationshipFilter("all")}
              className="font-mac text-[10px] rounded-full px-2.25 py-0.75 border leading-none"
              style={{
                background:
                  relationshipFilter === "all"
                    ? "color-mix(in srgb, #EC4899 12%, transparent)"
                    : "transparent",
                borderColor:
                  relationshipFilter === "all"
                    ? "color-mix(in srgb, #EC4899 24%, transparent)"
                    : "var(--a26-glass-border)",
                color:
                  relationshipFilter === "all"
                    ? "#F9A8D4"
                    : "var(--a26-text-mid)",
              }}
            >
              {translate("win26.testimonials.filters.all")}
            </button>
            {relationshipOptions.map((relationship) => {
              const relationshipKey = relationshipKeyMap[relationship];
              const label = relationshipKey
                ? translate(
                    `win26.testimonials.relationships.${relationshipKey}` as any,
                  )
                : relationship;
              const active = relationshipFilter === relationship;
              return (
                <button
                  key={relationship}
                  onClick={() => setRelationshipFilter(relationship)}
                  className="font-mac text-[10px] rounded-full px-2.25 py-0.75 border leading-none"
                  style={{
                    background: active
                      ? "color-mix(in srgb, #EC4899 12%, transparent)"
                      : "transparent",
                    borderColor: active
                      ? "color-mix(in srgb, #EC4899 24%, transparent)"
                      : "var(--a26-glass-border)",
                    color: active ? "#F9A8D4" : "var(--a26-text-mid)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-a26-muted text-[9px] font-bold tracking-[0.08em] uppercase leading-none">
            {translate("win26.testimonials.filters.service")}
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setServiceFilter("all")}
              className="font-mac text-[10px] rounded-full px-2.25 py-0.75 border leading-none"
              style={{
                background:
                  serviceFilter === "all"
                    ? "color-mix(in srgb, #A855F7 12%, transparent)"
                    : "transparent",
                borderColor:
                  serviceFilter === "all"
                    ? "color-mix(in srgb, #A855F7 24%, transparent)"
                    : "var(--a26-glass-border)",
                color:
                  serviceFilter === "all" ? "#D8B4FE" : "var(--a26-text-mid)",
              }}
            >
              {translate("win26.testimonials.filters.all")}
            </button>
            {serviceOptions.map((service) => {
              const serviceKey = serviceKeyMap[service];
              const label = serviceKey
                ? translate(`win26.testimonials.services.${serviceKey}` as any)
                : service;
              const active = serviceFilter === service;
              return (
                <button
                  key={service}
                  onClick={() => setServiceFilter(service)}
                  className="font-mac text-[10px] rounded-full px-2.25 py-0.75 border leading-none"
                  style={{
                    background: active
                      ? "color-mix(in srgb, #A855F7 12%, transparent)"
                      : "transparent",
                    borderColor: active
                      ? "color-mix(in srgb, #A855F7 24%, transparent)"
                      : "var(--a26-glass-border)",
                    color: active ? "#D8B4FE" : "var(--a26-text-mid)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="win26-scroll flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        {cards.length === 0 ? (
          <div
            className="bg-a26-card border border-a26-card-border rounded-xl p-6 text-center"
            style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.18)" }}
          >
            <div className="text-a26-text text-[13px] font-semibold mb-1">
              {translate("win26.testimonials.filters.noResultsTitle")}
            </div>
            <div className="text-a26-mid text-[11px] leading-[1.6]">
              {translate("win26.testimonials.filters.noResultsSubtitle")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cards.map((testimonial) => (
              <article
                key={testimonial.testimonialId}
                className="bg-a26-card border border-a26-card-border rounded-xl p-4 flex flex-col gap-3"
                style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.18)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {testimonial.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={testimonial.avatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(236,72,153,0.95), rgba(168,85,247,0.92))",
                        }}
                      >
                        <span className="text-white text-[11px] font-bold">
                          {testimonial.avatar}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-a26-text text-[13px] font-semibold truncate">
                        {testimonial.name}
                      </div>
                      <div className="text-a26-mid text-[11px] truncate">
                        {testimonial.role} · {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-[10px] font-semibold rounded-full px-2.5 py-1"
                    style={{
                      background:
                        "color-mix(in srgb, #EC4899 12%, transparent)",
                      border:
                        "1px solid color-mix(in srgb, #EC4899 20%, transparent)",
                      color: "#F9A8D4",
                    }}
                  >
                    {testimonial.relationshipLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const fill =
                        testimonial.rating >= index + 1
                          ? 1
                          : testimonial.rating > index
                            ? 0.5
                            : 0;
                      return (
                        <Star
                          key={index}
                          size={12}
                          style={{
                            color:
                              fill > 0 ? "#FBBF24" : "rgba(255,255,255,0.18)",
                            fill: fill > 0 ? "#FBBF24" : "transparent",
                            opacity: fill === 0.5 ? 0.55 : 1,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="text-a26-muted text-[10px] font-medium">
                    {testimonial.serviceLabel}
                  </div>
                </div>

                <div
                  className="rounded-lg px-3 py-3"
                  style={{
                    background:
                      "color-mix(in srgb, var(--a26-glass) 78%, transparent)",
                    border: "1px solid var(--a26-glass-border)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <Quote
                      size={14}
                      color="#EC4899"
                      className="shrink-0 mt-0.5"
                    />
                    <p className="text-a26-text text-[12px] leading-[1.7] m-0">
                      {testimonial.text}
                    </p>
                  </div>
                </div>

                {(testimonial.github ||
                  testimonial.linkedin ||
                  testimonial.behance) && (
                  <div className="flex items-center gap-2 pt-1">
                    {testimonial.github && (
                      <a
                        href={testimonial.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] no-underline rounded-md px-2 py-1"
                        style={{
                          color: "var(--a26-text)",
                          background:
                            "color-mix(in srgb, var(--a26-glass) 78%, transparent)",
                          border: "1px solid var(--a26-glass-border)",
                        }}
                      >
                        <Github size={11} /> GitHub
                      </a>
                    )}
                    {testimonial.linkedin && (
                      <a
                        href={testimonial.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] no-underline rounded-md px-2 py-1"
                        style={{
                          color: "#60A5FA",
                          background:
                            "color-mix(in srgb, #60A5FA 10%, transparent)",
                          border:
                            "1px solid color-mix(in srgb, #60A5FA 18%, transparent)",
                        }}
                      >
                        <Linkedin size={11} /> LinkedIn
                      </a>
                    )}
                    {testimonial.behance && (
                      <a
                        href={testimonial.behance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] no-underline rounded-md px-2 py-1"
                        style={{
                          color: "#A78BFA",
                          background:
                            "color-mix(in srgb, #A78BFA 10%, transparent)",
                          border:
                            "1px solid color-mix(in srgb, #A78BFA 18%, transparent)",
                        }}
                      >
                        <Palette size={11} /> Behance
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
