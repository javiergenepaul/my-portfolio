"use client";

import moment from "moment";
import { Mail, Phone, Github, Linkedin, MapPin } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import {
  FULL_NAME, JOB_TITLE, EMAIL_ADDRESS, MOBILE_NUMBER,
  getExperience, getEducation, SKILL_CATEGORIES, getProjects,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import type { ResumeColorConfig } from "../resume";

interface SimpleTemplateProps {
  colors: ResumeColorConfig;
}

function formatDateRange(
  start: moment.Moment,
  end: moment.Moment | "present"
): string {
  const s = start.format("MMM YYYY");
  const e = end === "present" ? "Present" : (end as moment.Moment).format("MMM YYYY");
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
}: {
  title: string;
  subtitle?: string;
  date?: string;
  accent: string;
}) {
  return (
    <div className="mb-0.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[11px] font-bold text-gray-900">
          <span style={{ color: accent }}>//</span>
          {title}
        </span>
        {date && (
          <span className="text-[9px] text-gray-500 shrink-0 ml-2">{date}</span>
        )}
      </div>
      {subtitle && (
        <p className="text-[9.5px] text-gray-500 italic">{subtitle}</p>
      )}
    </div>
  );
}

/** Bullet list */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-0.5 space-y-0.5 pl-3" style={{ listStyleType: "disc" }}>
      {items.map((item, i) => (
        <li key={i} className="text-[9.5px] text-gray-700 leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SimpleTemplate({ colors }: SimpleTemplateProps) {
  useLocaleRefresh();

  const experience = getExperience().filter((e) => e.isWork);
  const education = getEducation().filter(
    (e) => e.level === "tertiary" || e.level === "vocational"
  );
  const coreSkills = SKILL_CATEGORIES.filter((c) =>
    ["backend", "frontend"].includes(c.key)
  );
  const devopsSkills = SKILL_CATEGORIES.find((c) => c.key === "devops");
  const projects = getProjects()
    .filter((p) => !p.hidden && p.status === "completed" && p.type !== "tutorial")
    .slice(0, 3);

  const accent = colors.primary;

  // Flatten top skills for left-column "Core Competencies"
  const coreCompetencies = [
    ...coreSkills.flatMap((c) => c.stacks.slice(0, 5).map((s) => s.name)),
    ...(devopsSkills?.stacks.slice(0, 4).map((s) => s.name) ?? []),
  ];

  return (
    <div
      id="resume-preview"
      className="bg-white text-gray-900"
      style={{
        width: "794px",
        minHeight: "1123px",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      } as React.CSSProperties}
    >
      {/* ── HEADER ─────────────────────────────────── */}
      <div className="text-center pt-8 pb-4 px-10">
        <h1
          className="text-[28px] font-bold tracking-widest uppercase text-gray-900"
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
      <div className="mx-10 h-[2px]" style={{ backgroundColor: accent }} />

      {/* ── BODY ───────────────────────────────────── */}
      <div className="flex">

        {/* LEFT COLUMN */}
        <div
          className="w-44 shrink-0 px-5 py-4 flex flex-col gap-4"
          style={{ borderRight: `1px solid ${accent}22` }}
        >
          {/* Contact */}
          <div>
            <p
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: accent }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { icon: <Phone size={8} />, text: MOBILE_NUMBER },
                { icon: <Mail size={8} />, text: EMAIL_ADDRESS },
                { icon: <MapPin size={8} />, text: "Cebu, Philippines" },
                { icon: <Github size={8} />, text: "javiergenepaul", href: GITHUB_URL },
                { icon: <Linkedin size={8} />, text: "gene-paul-mar-javier", href: LINKED_IN_URL },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0" style={{ color: accent }}>
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a href={item.href} className="text-[8.5px] text-gray-600 leading-tight break-all hover:underline">
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-[8.5px] text-gray-600 leading-tight">{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Thin divider */}
          <div className="h-px w-full" style={{ backgroundColor: accent + "44" }} />

          {/* Core Competencies */}
          <div>
            <p
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: accent }}
            >
              Core Competencies
            </p>
            <div className="flex flex-col gap-1">
              {coreCompetencies.map((skill) => (
                <p key={skill} className="text-[9px] text-gray-700">
                  {skill}
                </p>
              ))}
            </div>
          </div>

          {/* Thin divider */}
          <div className="h-px w-full" style={{ backgroundColor: accent + "44" }} />

          {/* Education in left column */}
          <div>
            <p
              className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: accent }}
            >
              Education
            </p>
            <div className="flex flex-col gap-3">
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="text-[9.5px] font-bold text-gray-800">
                    <span style={{ color: accent }}>//</span>{edu.title}
                  </p>
                  <p className="text-[8.5px] text-gray-500 italic">{edu.subtitle}</p>
                  <p className="text-[8px] text-gray-400">
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
          <SectionDivider title="Qualifications Summary" accent={accent} />
          <p className="text-[9.5px] text-gray-700 leading-relaxed">
            {translate("about.intro.intruduction")}
          </p>

          {/* Work Experience */}
          <SectionDivider title="Work Experience" accent={accent} />
          <div className="flex flex-col gap-3">
            {experience.map((exp, i) => (
              <div key={i}>
                <EntryHeader
                  title={exp.title}
                  subtitle={`${exp.subtitle ?? ""}${exp.employmentType ? " · " + exp.employmentType : ""}`}
                  date={formatDateRange(exp.startYear, exp.endYear)}
                  accent={accent}
                />
                {exp.promotion && exp.promotion.length > 0 ? (
                  <BulletList
                    items={exp.promotion.map(
                      (p) =>
                        `${p.title} (${formatDateRange(p.startYear, p.endYear)})`
                    )}
                  />
                ) : (
                  <BulletList
                    items={exp.description
                      .split(". ")
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((s) => s.trim().replace(/\.$/, "") + ".")}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Featured Projects */}
          <SectionDivider title="Featured Projects" accent={accent} />
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div key={p.projectId}>
                <EntryHeader
                  title={p.title}
                  subtitle={
                    p.stack
                      ? p.stack.slice(0, 5).map((s) => s.name).join(" · ")
                      : undefined
                  }
                  date={p.type}
                  accent={accent}
                />
                <BulletList
                  items={p.description
                    .split(". ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((s) => s.trim().replace(/\.$/, "") + ".")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
