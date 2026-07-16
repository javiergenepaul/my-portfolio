"use client";

import { Mail, Phone, Github, Linkedin, MapPin, Link2 } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import { SKILL_CATEGORIES } from "@/config";
import type { ResumeColorConfig } from "../resume";
import { RESUME_DEFAULT, type ResumeData } from "../resume-content";

interface ModernTemplateProps {
  colors: ResumeColorConfig;
  isDark?: boolean;
  /** Render from this data instead of the built-in résumé content. */
  content?: ResumeData;
}

export function ModernTemplate({
  colors,
  isDark = false,
  content,
}: ModernTemplateProps) {
  useLocaleRefresh();

  const usingContent = !!content;
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

  // Skill dots keep Modern's design, so they stay sourced from the rated
  // stack data (the flat ATS skill list has no proficiency values).
  const topSkills = SKILL_CATEGORIES.filter((c) =>
    ["backend", "frontend", "devops", "testing"].includes(c.key),
  );

  const { primary, light, dark, text } = colors;

  // Neutral tones that flip with isDark
  const pageBg = isDark ? "#1E293B" : "#FFFFFF";
  const sidebarBg = isDark ? "#0F172A" : light;
  const textDark = isDark ? "#F1F5F9" : "#111827";
  const textMed = isDark ? "#CBD5E1" : "#374151";
  const textMuted = isDark ? "#94A3B8" : "#6B7280";
  const dotEmpty = isDark ? "#334155" : "#D1D5DB";
  const badgeBg = isDark ? `${primary}25` : light;
  const cardBg = isDark ? "#0F172A" : light;

  return (
    <div
      id="resume-preview"
      style={
        {
          width: "794px",
          minHeight: "1123px",
          fontFamily: "Arial, sans-serif",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
          backgroundColor: pageBg,
          color: textDark,
        } as React.CSSProperties
      }
    >
      {/* Colored header */}
      <div className="px-10 py-7" style={{ backgroundColor: primary }}>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: text }}
        >
          {name}
        </h1>
        <p
          className="text-sm mt-1 font-medium opacity-90"
          style={{ color: text }}
        >
          {title}
        </p>
        <div
          className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs"
          style={{ color: text }}
        >
          <span className="flex items-center gap-1.5 opacity-90">
            <Mail size={11} /> {contact.email}
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <Phone size={11} /> {contact.phone}
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <MapPin size={11} /> {contact.location}
          </span>
          {contact.links ? (
            contact.links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 opacity-90"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Link2 size={11} /> {l.label}
              </a>
            ))
          ) : (
            <>
              {contact.github && (
                <a
                  href={contact.github.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 opacity-90"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Github size={11} /> {contact.github.label}
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 opacity-90"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Linkedin size={11} /> {contact.linkedin.label}
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        <div
          className="w-56 shrink-0 px-6 py-6 flex flex-col gap-5"
          style={{ backgroundColor: sidebarBg }}
        >
          {/* Summary */}
          <SideSection
            title={translate("win26.resume.sectionAbout")}
            primary={primary}
          >
            <p
              className="text-[10px] leading-relaxed"
              style={{ color: textMed }}
            >
              {summary}
            </p>
          </SideSection>

          {/* Skills — draft résumé skills (flat) when driven by content,
              otherwise the rated-stack dots the default builder uses. */}
          {usingContent
            ? skills.map((group, i) => (
                <SideSection key={i} title={group.label} primary={primary}>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <p
                        key={item}
                        className="text-[10px]"
                        style={{ color: textMed }}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </SideSection>
              ))
            : topSkills.map((cat) => (
                <SideSection key={cat.key} title={cat.label} primary={primary}>
                  <div className="flex flex-col gap-0.5">
                    {cat.stacks.slice(0, 7).map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between"
                      >
                        <span
                          className="text-[10px]"
                          style={{ color: textMed }}
                        >
                          {translate(`services.stack.${s.name}` as any)}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor:
                                  idx < Math.ceil((s.rate / 10) * 5)
                                    ? primary
                                    : dotEmpty,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SideSection>
              ))}

          {/* Education */}
          <SideSection
            title={translate("win26.resume.sectionEducation")}
            primary={primary}
          >
            <div className="flex flex-col gap-3">
              {education.map((edu, i) => (
                <div key={i}>
                  <p
                    className="text-[10px] font-semibold"
                    style={{ color: textDark }}
                  >
                    {edu.school}
                  </p>
                  <p
                    className="text-[10px] leading-tight"
                    style={{ color: textMed }}
                  >
                    {edu.degree}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: textMuted }}>
                    {edu.period}
                  </p>
                </div>
              ))}
            </div>
          </SideSection>

          {/* Certifications */}
          <SideSection title="Certifications" primary={primary}>
            <div className="flex flex-col gap-2">
              {certifications.map((group, i) => (
                <div key={i}>
                  <div className="flex flex-col gap-0.5">
                    {group.titles.map((t) => (
                      <p
                        key={t}
                        className="text-[10px] leading-tight"
                        style={{ color: textMed }}
                      >
                        {t}
                      </p>
                    ))}
                  </div>
                  <p className="text-[9px] mt-0.5" style={{ color: textMuted }}>
                    {group.issuer} ({group.year})
                  </p>
                </div>
              ))}
            </div>
          </SideSection>
        </div>

        {/* Main content */}
        <div className="flex-1 px-7 py-6 flex flex-col gap-5">
          {/* Experience */}
          <MainSection
            title={translate("win26.resume.sectionWorkExp")}
            primary={primary}
          >
            <div className="flex flex-col gap-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: textDark }}
                      >
                        {exp.role}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: primary }}
                      >
                        {exp.company}
                        <span style={{ color: textMuted }}>
                          {" · "}
                          {exp.employmentType}
                        </span>
                      </p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2 font-medium"
                      style={{ backgroundColor: badgeBg, color: dark }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  {exp.promotion && (
                    <div
                      className="mt-1.5 pl-3 border-l-2"
                      style={{ borderColor: primary }}
                    >
                      <p
                        className="text-[10px] font-medium"
                        style={{ color: textMed }}
                      >
                        {exp.promotion}
                      </p>
                    </div>
                  )}
                  <ul className="mt-1.5 flex flex-col gap-0.5">
                    {exp.bullets.map((b, k) => (
                      <li
                        key={k}
                        className="text-xs leading-relaxed flex gap-1.5"
                        style={{ color: textMed }}
                      >
                        <span style={{ color: primary }}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MainSection>

          {/* Projects */}
          <MainSection
            title={translate("win26.resume.sectionProjects")}
            primary={primary}
          >
            <div className="flex flex-col gap-3">
              {projects.map((p) => (
                <div
                  key={p.name}
                  className="rounded-md p-3"
                  style={{ backgroundColor: cardBg }}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: textDark }}
                    >
                      {p.name}
                    </p>
                    {p.context && (
                      <span
                        className="text-[10px]"
                        style={{ color: textMuted }}
                      >
                        {p.context}
                      </span>
                    )}
                  </div>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] mb-1 block"
                      style={{ color: primary, textDecoration: "none" }}
                    >
                      {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: textMed }}
                  >
                    {p.bullets.join(" ")}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: primary + "20", color: dark }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MainSection>
        </div>
      </div>
    </div>
  );
}

function SideSection({
  title,
  primary,
  children,
}: {
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-[10px] font-bold uppercase tracking-widest mb-2 pb-1"
        style={{ color: primary, borderBottom: `1px solid ${primary}` }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function MainSection({
  title,
  primary,
  children,
}: {
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-sm font-bold uppercase tracking-wider pb-1 mb-3"
        style={{ color: primary, borderBottom: `2px solid ${primary}` }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
