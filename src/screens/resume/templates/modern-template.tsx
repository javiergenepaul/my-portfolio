"use client";

import moment from "moment";
import { Mail, Phone, Github, Linkedin, MapPin } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  MOBILE_NUMBER,
  getExperience,
  getEducation,
  SKILL_CATEGORIES,
  getProjects,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import type { ResumeColorConfig } from "../resume";

interface ModernTemplateProps {
  colors: ResumeColorConfig;
  isDark?: boolean;
}

function formatDateRange(
  start: moment.Moment,
  end: moment.Moment | "present",
): string {
  const s = start.format("MMM YYYY");
  const e =
    end === "present" ? "Present" : (end as moment.Moment).format("MMM YYYY");
  return `${s} – ${e}`;
}

export function ModernTemplate({
  colors,
  isDark = false,
}: ModernTemplateProps) {
  useLocaleRefresh();

  const experience = getExperience().filter((e) => e.isWork);
  const education = getEducation().filter(
    (e) => e.level === "tertiary" || e.level === "vocational",
  );
  const topSkills = SKILL_CATEGORIES.filter((c) =>
    ["backend", "frontend", "devops", "testing"].includes(c.key),
  );
  const projects = getProjects()
    .filter(
      (p) => !p.hidden && p.status === "completed" && p.type !== "tutorial",
    )
    .slice(0, 3);

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
          {FULL_NAME}
        </h1>
        <p
          className="text-sm mt-1 font-medium opacity-90"
          style={{ color: text }}
        >
          {JOB_TITLE}
        </p>
        <div
          className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs"
          style={{ color: text }}
        >
          <span className="flex items-center gap-1.5 opacity-90">
            <Mail size={11} /> {EMAIL_ADDRESS}
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <Phone size={11} /> {MOBILE_NUMBER}
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <MapPin size={11} /> Cebu, Philippines
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <Github size={11} /> github.com/javiergenepaul
          </span>
          <span className="flex items-center gap-1.5 opacity-90">
            <Linkedin size={11} /> linkedin.com/in/gene-paul-mar-javier
          </span>
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
          <SideSection title="About" primary={primary} dark={dark}>
            <p
              className="text-[10px] leading-relaxed"
              style={{ color: textMed }}
            >
              {translate("about.intro.intruduction")}
            </p>
          </SideSection>

          {/* Skills */}
          {topSkills.map((cat) => (
            <SideSection
              key={cat.key}
              title={cat.label}
              primary={primary}
              dark={dark}
            >
              <div className="flex flex-col gap-0.5">
                {cat.stacks.slice(0, 7).map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[10px]" style={{ color: textMed }}>
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
          <SideSection title="Education" primary={primary} dark={dark}>
            <div className="flex flex-col gap-3">
              {education.map((edu, i) => (
                <div key={i}>
                  <p
                    className="text-[10px] font-semibold"
                    style={{ color: textDark }}
                  >
                    {edu.subtitle}
                  </p>
                  <p
                    className="text-[10px] leading-tight"
                    style={{ color: textMed }}
                  >
                    {edu.title}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: textMuted }}>
                    {formatDateRange(edu.startYear, edu.endYear)}
                  </p>
                </div>
              ))}
            </div>
          </SideSection>
        </div>

        {/* Main content */}
        <div className="flex-1 px-7 py-6 flex flex-col gap-5">
          {/* Experience */}
          <MainSection title="Work Experience" primary={primary}>
            <div className="flex flex-col gap-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: textDark }}
                      >
                        {exp.title}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: primary }}
                      >
                        {exp.subtitle}
                        {exp.employmentType && (
                          <span style={{ color: textMuted }}>
                            {" "}
                            · {exp.employmentType}
                          </span>
                        )}
                      </p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2 font-medium"
                      style={{ backgroundColor: badgeBg, color: dark }}
                    >
                      {formatDateRange(exp.startYear, exp.endYear)}
                    </span>
                  </div>
                  {exp.promotion && exp.promotion.length > 0 && (
                    <div
                      className="mt-1.5 pl-3 border-l-2 flex flex-col gap-1"
                      style={{ borderColor: primary }}
                    >
                      {exp.promotion.map((p, j) => (
                        <div key={j} className="flex justify-between">
                          <p
                            className="text-[10px] font-medium"
                            style={{ color: textMed }}
                          >
                            {p.title}
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: textMuted }}
                          >
                            {formatDateRange(p.startYear, p.endYear)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p
                    className="text-xs mt-1 leading-relaxed line-clamp-3"
                    style={{ color: textMed }}
                  >
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </MainSection>

          {/* Projects */}
          <MainSection title="Featured Projects" primary={primary}>
            <div className="flex flex-col gap-3">
              {projects.map((p) => (
                <div
                  key={p.projectId}
                  className="rounded-md p-3"
                  style={{ backgroundColor: cardBg }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: textDark }}
                    >
                      {p.title}
                    </p>
                    {p.company && (
                      <span
                        className="text-[10px]"
                        style={{ color: textMuted }}
                      >
                        {p.company}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: textMed }}
                  >
                    {p.description}
                  </p>
                  {p.stack && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.stack.slice(0, 7).map((s) => (
                        <span
                          key={s.name}
                          className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: primary + "20",
                            color: dark,
                          }}
                        >
                          {translate(`services.stack.${s.name}` as any)}
                        </span>
                      ))}
                    </div>
                  )}
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
  dark,
  children,
}: {
  title: string;
  primary: string;
  dark: string;
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
