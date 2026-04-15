"use client";

import moment from "moment";
import "moment/locale/ja";
import { Mail, Phone, Github, Linkedin, MapPin } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores";
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

interface SimpleTemplateProps {
  colors: ResumeColorConfig;
  isDark?: boolean;
}

const MOMENT_LOCALE: Record<string, string> = { en: "en", ja: "ja", fil: "en", ceb: "en" };
const DATE_FMT: Record<string, string> = { en: "MMM YYYY", ja: "YYYY年M月", fil: "MMM YYYY", ceb: "MMM YYYY" };

function formatDateRange(
  start: moment.Moment,
  end: moment.Moment | "present",
): string {
  const lang = useLanguageStore.getState().language ?? "en";
  const locale = MOMENT_LOCALE[lang] ?? "en";
  const fmt = DATE_FMT[lang] ?? "MMM YYYY";
  const s = start.clone().locale(locale).format(fmt);
  const e = end === "present" ? translate("win26.present") : (end as moment.Moment).clone().locale(locale).format(fmt);
  return `${s} – ${e}`;
}

/** ── SECTION DIVIDER  ─────── TITLE ─────────── */
function SectionDivider({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="flex-1 h-px" style={{ backgroundColor: accent }} />
      <span
        className="text-[10px] font-bold tracking-[0.25em] uppercase whitespace-nowrap px-1"
        style={{ color: accent }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: accent }} />
    </div>
  );
}

/** // Entry title row */
function EntryHeader({
  title,
  subtitle,
  date,
  accent,
  textDark,
  textMuted,
}: {
  title: string;
  subtitle?: string;
  date?: string;
  accent: string;
  textDark: string;
  textMuted: string;
}) {
  return (
    <div className="mb-0.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[11px] font-bold" style={{ color: textDark }}>
          <span style={{ color: accent }}>//</span>
          {title}
        </span>
        {date && (
          <span
            className="text-[9px] shrink-0 ml-2"
            style={{ color: textMuted }}
          >
            {date}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[9.5px] italic" style={{ color: textMuted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Bullet list */
function BulletList({ items, textMed }: { items: string[]; textMed: string }) {
  return (
    <ul className="mt-0.5 space-y-0.5 pl-3" style={{ listStyleType: "disc" }}>
      {items.map((item, i) => (
        <li
          key={i}
          className="text-[9.5px] leading-relaxed"
          style={{ color: textMed }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SimpleTemplate({
  colors,
  isDark = false,
}: SimpleTemplateProps) {
  useLocaleRefresh();

  const experience = getExperience().filter((e) => e.isWork);
  const education = getEducation().filter(
    (e) => e.level === "tertiary" || e.level === "vocational",
  );
  const coreSkills = SKILL_CATEGORIES.filter((c) =>
    ["backend", "frontend"].includes(c.key),
  );
  const devopsSkills = SKILL_CATEGORIES.find((c) => c.key === "devops");
  const projects = getProjects()
    .filter(
      (p) => !p.hidden && p.status === "completed" && p.type !== "tutorial",
    )
    .slice(0, 3);

  const accent = colors.primary;

  // Neutral tones that flip with isDark
  const pageBg = isDark ? "#1E293B" : "#FFFFFF";
  const colBg = isDark ? "#0F172A" : "#F9FAFB";
  const textDark = isDark ? "#F1F5F9" : "#111827";
  const textMed = isDark ? "#CBD5E1" : "#374151";
  const textMuted = isDark ? "#94A3B8" : "#6B7280";
  const textLight = isDark ? "#64748B" : "#9CA3AF";

  // Flatten top skills for left-column "Core Competencies"
  const coreCompetencies = [
    ...coreSkills.flatMap((c) =>
      c.stacks
        .slice(0, 5)
        .map((s) => translate(`services.stack.${s.name}` as any)),
    ),
    ...(devopsSkills?.stacks
      .slice(0, 4)
      .map((s) => translate(`services.stack.${s.name}` as any)) ?? []),
  ];

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
        } as React.CSSProperties
      }
    >
      {/* ── HEADER ─────────────────────────────────── */}
      <div className="text-center pt-8 pb-4 px-10">
        <h1
          className="text-[28px] font-bold tracking-widest uppercase"
          style={{ color: textDark }}
        >
          {FULL_NAME}
        </h1>
        <p
          className="text-[10px] tracking-[0.35em] uppercase mt-1 font-medium"
          style={{ color: accent }}
        >
          {JOB_TITLE}
        </p>
      </div>

      {/* Full-width divider */}
      <div className="mx-10 h-0.5" style={{ backgroundColor: accent }} />

      {/* ── BODY ───────────────────────────────────── */}
      <div className="flex">
        {/* LEFT COLUMN */}
        <div
          className="w-44 shrink-0 px-5 py-4 flex flex-col gap-4"
          style={{
            borderRight: `1px solid ${accent}22`,
            backgroundColor: colBg,
          }}
        >
          {/* Contact */}
          <div>
            <p
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: accent }}
            >
              {translate("win26.resume.sectionContact")}
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { icon: <Phone size={8} />, text: MOBILE_NUMBER },
                { icon: <Mail size={8} />, text: EMAIL_ADDRESS },
                { icon: <MapPin size={8} />, text: "Cebu, Philippines" },
                {
                  icon: <Github size={8} />,
                  text: "javiergenepaul",
                  href: GITHUB_URL,
                },
                {
                  icon: <Linkedin size={8} />,
                  text: "gene-paul-mar-javier",
                  href: LINKED_IN_URL,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0" style={{ color: accent }}>
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-[8.5px] leading-tight break-all hover:underline"
                      style={{ color: textMed }}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span
                      className="text-[8.5px] leading-tight"
                      style={{ color: textMed }}
                    >
                      {item.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Thin divider */}
          <div
            className="h-px w-full"
            style={{ backgroundColor: accent + "44" }}
          />

          {/* Core Competencies */}
          <div>
            <p
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: accent }}
            >
              {translate("win26.resume.sectionCoreComp")}
            </p>
            <div className="flex flex-col gap-1">
              {coreCompetencies.map((skill) => (
                <p
                  key={skill}
                  className="text-[9px]"
                  style={{ color: textMed }}
                >
                  {skill}
                </p>
              ))}
            </div>
          </div>

          {/* Thin divider */}
          <div
            className="h-px w-full"
            style={{ backgroundColor: accent + "44" }}
          />

          {/* Education in left column */}
          <div>
            <p
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: accent }}
            >
              {translate("win26.resume.sectionEducation")}
            </p>
            <div className="flex flex-col gap-3">
              {education.map((edu, i) => (
                <div key={i}>
                  <p
                    className="text-[9.5px] font-bold"
                    style={{ color: textDark }}
                  >
                    <span style={{ color: accent }}>//</span>
                    {edu.title}
                  </p>
                  <p
                    className="text-[8.5px] italic"
                    style={{ color: textMuted }}
                  >
                    {edu.subtitle}
                  </p>
                  <p className="text-[8px]" style={{ color: textLight }}>
                    {formatDateRange(edu.startYear, edu.endYear)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 px-6 py-4">
          {/* Qualifications Summary */}
          <SectionDivider title={translate("win26.resume.sectionQualSummary")} accent={accent} />
          <p
            className="text-[9.5px] leading-relaxed"
            style={{ color: textMed }}
          >
            {translate("about.intro.intruduction")}
          </p>

          {/* Work Experience */}
          <SectionDivider title={translate("win26.resume.sectionWorkExp")} accent={accent} />
          <div className="flex flex-col gap-3">
            {experience.map((exp, i) => (
              <div key={i}>
                <EntryHeader
                  title={exp.title}
                  subtitle={`${exp.subtitle ?? ""}${exp.employmentType ? " · " + (exp.employmentType === "Full-time" ? translate("win26.employment.fullTime") : translate("win26.employment.partTime")) : ""}`}
                  date={formatDateRange(exp.startYear, exp.endYear)}
                  accent={accent}
                  textDark={textDark}
                  textMuted={textMuted}
                />
                {exp.promotion && exp.promotion.length > 0 ? (
                  <BulletList
                    items={exp.promotion.map(
                      (p) =>
                        `${p.title} (${formatDateRange(p.startYear, p.endYear)})`,
                    )}
                    textMed={textMed}
                  />
                ) : (
                  <BulletList
                    items={exp.description
                      .split(". ")
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((s) => s.trim().replace(/\.$/, "") + ".")}
                    textMed={textMed}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Featured Projects */}
          <SectionDivider title={translate("win26.resume.sectionProjects")} accent={accent} />
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div key={p.projectId}>
                <EntryHeader
                  title={p.title}
                  subtitle={
                    p.stack
                      ? p.stack
                          .slice(0, 5)
                          .map((s) =>
                            translate(`services.stack.${s.name}` as any),
                          )
                          .join(" · ")
                      : undefined
                  }
                  date={p.type}
                  accent={accent}
                  textDark={textDark}
                  textMuted={textMuted}
                />
                <BulletList
                  items={p.description
                    .split(". ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((s) => s.trim().replace(/\.$/, "") + ".")}
                  textMed={textMed}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
