"use client";

import type { ResumeColorConfig } from "../resume";
import { RESUME_DEFAULT, type ResumeData } from "../resume-content";

interface AtsTemplateProps {
  colors: ResumeColorConfig;
  isDark?: boolean;
  /** Render from this data instead of the built-in résumé content. */
  content?: ResumeData;
}

export function AtsTemplate({
  colors,
  isDark = false,
  content,
}: AtsTemplateProps) {
  const { primary } = colors;
  const {
    name,
    title,
    contact,
    summary,
    experience,
    projects,
    skills,
    education,
    certifications,
  } = content ?? RESUME_DEFAULT;
  const contactLinks =
    contact.links ??
    [contact.github, contact.linkedin].filter(
      (l): l is { label: string; url: string } => !!l,
    );

  // Plain, high-contrast tones. ATS parsers read text, not colour, so the
  // accent is used only for section-heading rules — body stays near-black.
  // The dark paper is lifted above the app backdrop so its edges read as a page.
  const pageBg = isDark ? "#1E293B" : "#FFFFFF";
  const textDark = isDark ? "#F1F5F9" : "#111827";
  const textMed = isDark ? "#CBD5E1" : "#1F2937";
  const textMuted = isDark ? "#94A3B8" : "#4B5563";
  const ruleColor = isDark ? "#334155" : "#D1D5DB";
  const linkColor = isDark ? "#93C5FD" : "#1D4ED8";

  return (
    <div
      id="resume-preview"
      style={
        {
          width: "794px",
          minHeight: "1123px",
          fontFamily: "'Arial', 'Helvetica', sans-serif",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
          backgroundColor: pageBg,
          color: textDark,
          padding: "48px 56px",
        } as React.CSSProperties
      }
    >
      {/* ── HEADER ─────────────────────────────────── */}
      <header>
        <h1 className="text-3xl font-bold" style={{ color: textDark }}>
          {name}
        </h1>
        <p className="text-sm font-semibold mt-0.5" style={{ color: textMed }}>
          {title}
        </p>
        {/* Contact line — plain selectable text + real links */}
        <p
          className="text-[11px] mt-2 leading-relaxed"
          style={{ color: textMuted }}
        >
          {contact.phone}
          {" | "}
          <a href={`mailto:${contact.email}`} style={{ color: linkColor }}>
            {contact.email}
          </a>
          {" | "}
          {contact.location}
        </p>
        {contactLinks.length > 0 && (
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: textMuted }}
          >
            {contactLinks.map((l, i) => (
              <span key={i}>
                {i > 0 && " | "}
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: linkColor }}
                >
                  {l.label}
                </a>
              </span>
            ))}
          </p>
        )}
      </header>

      {/* ── SUMMARY ────────────────────────────────── */}
      <Section title="Summary" accent={primary} rule={ruleColor}>
        <p className="text-[11px] leading-relaxed" style={{ color: textMed }}>
          {summary}
        </p>
      </Section>

      {/* ── EXPERIENCE ─────────────────────────────── */}
      <Section title="Experience" accent={primary} rule={ruleColor}>
        <div className="flex flex-col gap-3">
          {experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <p
                  className="text-[12px] font-bold"
                  style={{ color: textDark }}
                >
                  {exp.role}
                  <span style={{ color: textMed }}> — {exp.company}</span>
                  <span style={{ color: textMuted }}>
                    {" · "}
                    {exp.employmentType}
                  </span>
                </p>
                <span
                  className="text-[10px] shrink-0 ml-3"
                  style={{ color: textMuted }}
                >
                  {exp.period}
                </span>
              </div>

              {exp.promotion && (
                <p
                  className="text-[10.5px] italic mt-0.5"
                  style={{ color: textMuted }}
                >
                  {exp.promotion}
                </p>
              )}

              <ul
                className="mt-1 ml-4 space-y-0.5"
                style={{ listStyleType: "disc" }}
              >
                {exp.bullets.map((b, k) => (
                  <li
                    key={k}
                    className="text-[11px] leading-relaxed"
                    style={{ color: textMed }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SKILLS ─────────────────────────────────── */}
      <Section title="Skills" accent={primary} rule={ruleColor}>
        <div className="flex flex-col gap-1">
          {skills.map((cat) => (
            <p
              key={cat.label}
              className="text-[11px] leading-relaxed"
              style={{ color: textMed }}
            >
              <span className="font-bold" style={{ color: textDark }}>
                {cat.label}:
              </span>{" "}
              {cat.items.join(", ")}
            </p>
          ))}
        </div>
      </Section>

      {/* ── PROJECTS ───────────────────────────────── */}
      <Section title="Projects" accent={primary} rule={ruleColor}>
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <div key={p.name}>
              <p className="text-[12px] font-bold" style={{ color: textDark }}>
                {p.name}
                {p.context && (
                  <span style={{ color: textMuted }}> — {p.context}</span>
                )}
                {p.url && (
                  <span style={{ color: textMuted }}>
                    {" · "}
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: linkColor }}
                    >
                      {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </span>
                )}
              </p>
              <ul
                className="mt-1 ml-4 space-y-0.5"
                style={{ listStyleType: "disc" }}
              >
                {p.bullets.map((b, k) => (
                  <li
                    key={k}
                    className="text-[11px] leading-relaxed"
                    style={{ color: textMed }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
              <p
                className="text-[10.5px] mt-1 leading-relaxed"
                style={{ color: textMuted }}
              >
                <span className="font-semibold">Technologies:</span>{" "}
                {p.stack.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── EDUCATION ──────────────────────────────── */}
      <Section title="Education" accent={primary} rule={ruleColor}>
        <div className="flex flex-col gap-2">
          {education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline">
              <p className="text-[11px]" style={{ color: textMed }}>
                <span className="font-bold" style={{ color: textDark }}>
                  {edu.degree}
                </span>
                {" — "}
                {edu.school}
              </p>
              <span
                className="text-[10px] shrink-0 ml-3"
                style={{ color: textMuted }}
              >
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CERTIFICATIONS ─────────────────────────── */}
      <Section title="Certifications" accent={primary} rule={ruleColor}>
        <div className="flex flex-col gap-1">
          {certifications.map((group, i) => (
            <p
              key={i}
              className="text-[11px] leading-relaxed"
              style={{ color: textMed }}
            >
              {group.titles.join(", ")}
              <span style={{ color: textMuted }}>
                {" — "}
                {group.issuer} ({group.year})
              </span>
            </p>
          ))}
        </div>
      </Section>
    </div>
  );
}

/** Single-column section with an accented heading rule. */
function Section({
  title,
  accent,
  rule,
  children,
}: {
  title: string;
  accent: string;
  rule: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h2
        className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2"
        style={{ color: accent, borderBottom: `1.5px solid ${rule}` }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
