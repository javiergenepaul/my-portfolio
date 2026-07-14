"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Lock,
  MapPin,
  GraduationCap,
  GithubIcon,
  LinkedinIcon,
  Mail,
  ExternalLink,
} from "lucide-react";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  getExperience,
  getEducation,
  getCertificates,
  CAREER_START_DATE,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import dayjs from "dayjs";
import { formatDate } from "../utils";
import { translate, useLocaleRefresh } from "@/i18n";

export function AboutContent() {
  useLocaleRefresh();
  const [tab, setTab] = useState<
    "overview" | "experience" | "education" | "certificates"
  >("overview");
  const exps = getExperience().filter((e) => e.isWork);
  const edus = getEducation();
  // Newest certificates first.
  const certs = [...getCertificates()].sort(
    (a, b) => b.issuedDate.valueOf() - a.issuedDate.valueOf(),
  );

  return (
    <div className="font-mac flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Safari-style address bar */}
      <div className="flex items-center shrink-0 border-b bg-a26-title-bar border-a26-glass-border gap-2 py-1.5 px-3">
        <ChevronLeft size={13} color="var(--a26-text-muted)" />
        <ChevronRight size={13} color="var(--a26-text-muted)" />
        <RefreshCw size={12} color="var(--a26-text-muted)" />
        <div className="flex items-center flex-1 gap-1.25 bg-a26-input-bg border border-a26-glass-border text-a26-mid rounded-[7px] py-0.75 px-2.5 text-xs">
          <Lock size={10} color="var(--a26-teal)" />{" "}
          genepaulmarjavier.dev/2026/about
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-a26-glass-border gap-0.5 px-3.5 pt-1.5 pb-0">
        {(
          ["overview", "experience", "education", "certificates"] as const
        ).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="font-mac cursor-pointer text-xs"
            style={{
              padding: "4px 12px",
              borderRadius: "7px 7px 0 0",
              border: "none",
              background: tab === t ? "var(--a26-window)" : "transparent",
              color: tab === t ? "var(--a26-text)" : "var(--a26-text-mid)",
              fontWeight: tab === t ? 600 : 400,
              borderBottom:
                tab === t
                  ? "2px solid var(--a26-teal)"
                  : "2px solid transparent",
            }}
          >
            {translate(`win26.about.tabs.${t}`)}
          </button>
        ))}
      </div>

      <div
        className="win26-scroll flex-1 overflow-y-auto py-6 px-7 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            {tab === "overview" && (
              <div className="flex flex-col gap-5.5">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div
                      className="overflow-hidden border-2 border-a26-teal w-22 h-22 rounded-full"
                      style={{
                        boxShadow:
                          "0 0 22px color-mix(in srgb, var(--a26-teal) 28%, transparent)",
                      }}
                    >
                      <Image
                        src={AvatarProfile}
                        alt={FULL_NAME}
                        width={88}
                        height={88}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div
                      className="absolute bg-a26-green border-2 bottom-0.5 right-0.5 w-3 h-3 rounded-full"
                      style={{ borderColor: "#1C1C1C" }}
                    />
                  </div>
                  <div>
                    <h1 className="text-a26-text m-0 text-2xl font-bold">
                      {FULL_NAME}
                    </h1>
                    <p className="text-a26-teal mt-0.75 mb-2 text-sm font-medium">
                      {JOB_TITLE}
                    </p>
                    <div className="flex items-center text-a26-mid gap-1.25 text-xs">
                      <MapPin size={12} color="var(--a26-text-muted)" />{" "}
                      {translate("win26.about.location")}
                    </div>
                  </div>
                </div>

                <div className="bg-a26-card border border-a26-card-border rounded-[10px] py-3.5 px-4.5">
                  <p className="text-a26-mid m-0 text-[13.5px] leading-[1.8]">
                    {translate("win26.about.bio")}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    {
                      v: `${dayjs().diff(dayjs(CAREER_START_DATE), "years")}+`,
                      l: translate("about.intro.years"),
                      c: "var(--a26-teal)",
                    },
                    {
                      v: "10+",
                      l: translate("about.intro.project"),
                      c: "var(--a26-violet)",
                    },
                    {
                      v: "20+",
                      l: translate("about.intro.technologies"),
                      c: "var(--a26-green)",
                    },
                    {
                      v: translate("about.intro.active"),
                      l: translate("about.intro.status"),
                      c: "#FBBF24",
                    },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="bg-a26-card border border-a26-card-border text-center rounded-[9px] p-3"
                    >
                      <div className="text-xl font-bold" style={{ color: s.c }}>
                        {s.v}
                      </div>
                      <div className="text-a26-muted text-[10px] mt-px">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      href: GITHUB_URL,
                      icon: <GithubIcon size={13} />,
                      label: "GitHub",
                      c: "var(--a26-text)",
                    },
                    {
                      href: LINKED_IN_URL,
                      icon: <LinkedinIcon size={13} />,
                      label: "LinkedIn",
                      c: "#60A5FA",
                    },
                    {
                      href: `mailto:${EMAIL_ADDRESS}`,
                      icon: <Mail size={13} />,
                      label: EMAIL_ADDRESS,
                      c: "var(--a26-teal)",
                    },
                  ].map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-a26-glass border border-a26-glass-border gap-1.5 rounded-[7px] py-1.5 px-3 text-xs no-underline"
                      style={{ color: l.c }}
                    >
                      {l.icon} {l.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {tab === "experience" && (
              <div className="flex flex-col gap-3">
                <h2 className="text-a26-text mb-1 text-base font-bold">
                  {translate("about.experience.title")}
                </h2>
                {exps.map((exp, i) => (
                  <div key={i} className="flex gap-3.5">
                    <div className="flex flex-col items-center shrink-0 w-4.5">
                      <div
                        className="bg-a26-teal shrink-0 w-2.25 h-2.25 rounded-full mt-1.5"
                        style={{ boxShadow: "0 0 7px var(--a26-teal)" }}
                      />
                      {i < exps.length - 1 && (
                        <div
                          className="flex-1 w-px mt-1.25"
                          style={{
                            background:
                              "linear-gradient(to bottom, color-mix(in srgb, var(--a26-teal) 35%, transparent), transparent)",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 bg-a26-card border border-a26-card-border rounded-[9px] py-3 px-3.5 mb-1.5">
                      <div className="flex justify-between flex-wrap gap-2">
                        <span className="text-a26-text text-[13.5px] font-semibold">
                          {exp.title}
                        </span>
                        <span className="text-a26-muted text-[11px]">
                          {formatDate(exp.startYear)} —{" "}
                          {formatDate(exp.endYear)}
                        </span>
                      </div>
                      {exp.subtitle && (
                        <div className="text-a26-teal text-xs mt-0.5">
                          {exp.subtitle}
                          {exp.employmentType && (
                            <span
                              className="text-a26-violet ml-1.5 text-[11px] rounded py-px px-1.25"
                              style={{
                                background:
                                  "color-mix(in srgb, var(--a26-violet) 12%, transparent)",
                              }}
                            >
                              {exp.employmentType === "Full-time"
                                ? translate("win26.employment.fullTime")
                                : translate("win26.employment.partTime")}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-a26-mid mt-1.75 text-xs leading-[1.65] line-clamp-3">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "education" && (
              <div className="flex flex-col gap-2.5">
                <h2 className="text-a26-text mb-1 text-base font-bold">
                  {translate("about.education.title")}
                </h2>
                {edus.map((edu, i) => (
                  <div
                    key={i}
                    className="flex bg-a26-card border border-a26-card-border gap-3 rounded-[9px] py-3 px-3.5"
                  >
                    <div
                      className="flex items-center justify-center shrink-0 w-8.5 h-8.5 rounded-lg"
                      style={{
                        background:
                          "color-mix(in srgb, var(--a26-violet) 12%, transparent)",
                      }}
                    >
                      <GraduationCap size={16} color="var(--a26-violet)" />
                    </div>
                    <div>
                      <div className="text-a26-text text-[13.5px] font-semibold">
                        {edu.title}
                      </div>
                      {edu.subtitle && (
                        <div className="text-a26-violet text-xs mt-px">
                          {edu.subtitle}
                        </div>
                      )}
                      <div className="text-a26-muted text-[11px] mt-0.75">
                        {formatDate(edu.startYear)} — {formatDate(edu.endYear)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "certificates" && (
              <div className="flex flex-col gap-2.5">
                <h2 className="text-a26-text mb-1 text-base font-bold">
                  {translate("about.certificate.header")}
                </h2>
                {certs.map((cert, i) => {
                  const logo =
                    typeof cert.organizationImg === "string"
                      ? cert.organizationImg
                      : cert.organizationImg.src;
                  const href =
                    typeof cert.credentialUrl === "string"
                      ? cert.credentialUrl
                      : cert.credentialUrl.src;
                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex bg-a26-card border border-a26-card-border gap-3 rounded-[9px] py-3 px-3.5 no-underline transition-colors hover:border-a26-teal"
                    >
                      <div className="flex items-center justify-center shrink-0 w-8.5 h-8.5 rounded-lg bg-white overflow-hidden p-1">
                        <Image
                          src={logo}
                          alt={cert.organizationAlt}
                          width={28}
                          height={28}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-a26-text text-[13.5px] font-semibold">
                          {cert.title}
                        </div>
                        <div className="text-a26-teal text-xs mt-px">
                          {cert.organization}
                        </div>
                        <div className="text-a26-muted text-[11px] mt-0.75">
                          {translate("about.certificate.issued", {
                            date: cert.issuedDate.format("MMM YYYY"),
                          })}
                        </div>
                      </div>
                      <ExternalLink
                        size={13}
                        color="var(--a26-text-muted)"
                        className="shrink-0 mt-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
