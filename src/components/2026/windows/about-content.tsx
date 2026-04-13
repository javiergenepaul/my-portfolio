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
} from "lucide-react";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  getExperience,
  getEducation,
  CAREER_START_DATE,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import moment from "moment";
import { MAC_FONT } from "../constants";
import { useAurora } from "../use-aurora";
import { hexRgb, formatDate } from "../utils";

export function AboutContent() {
  const A = useAurora();
  const [tab, setTab] = useState<"overview" | "experience" | "education">(
    "overview",
  );
  const exps = getExperience().filter((e) => e.isWork);
  const edus = getEducation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        fontFamily: MAC_FONT,
      }}
    >
      {/* Safari-style address bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderBottom: `1px solid ${A.glassBorder}`,
          background: A.titleBar,
          flexShrink: 0,
        }}
      >
        <ChevronLeft size={13} color={A.textMuted} />
        <ChevronRight size={13} color={A.textMuted} />
        <RefreshCw size={12} color={A.textMuted} />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: A.inputBg,
            borderRadius: 7,
            padding: "3px 10px",
            border: `1px solid ${A.glassBorder}`,
            fontSize: 12,
            color: A.textMid,
          }}
        >
          <Lock size={10} color={A.teal} /> genepaulmarjavier.dev/2026/about
        </div>
      </div>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "6px 14px 0",
          borderBottom: `1px solid ${A.glassBorder}`,
          flexShrink: 0,
        }}
      >
        {(["overview", "experience", "education"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "4px 12px",
              borderRadius: "7px 7px 0 0",
              border: "none",
              background: tab === t ? A.window : "transparent",
              color: tab === t ? A.text : A.textMid,
              fontSize: 12,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              borderBottom:
                tab === t ? `2px solid ${A.teal}` : "2px solid transparent",
              fontFamily: MAC_FONT,
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px",
          scrollbarWidth: "none",
        }}
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
              <div
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `2px solid ${A.teal}`,
                        boxShadow: `0 0 22px rgba(${hexRgb(A.teal)},0.28)`,
                      }}
                    >
                      <Image
                        src={AvatarProfile}
                        alt={FULL_NAME}
                        width={88}
                        height={88}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: A.green,
                        border: "2px solid #1C1C1C",
                      }}
                    />
                  </div>
                  <div>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: 24,
                        fontWeight: 700,
                        color: A.text,
                      }}
                    >
                      {FULL_NAME}
                    </h1>
                    <p
                      style={{
                        margin: "3px 0 8px",
                        fontSize: 14,
                        color: A.teal,
                        fontWeight: 500,
                      }}
                    >
                      {JOB_TITLE}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        color: A.textMid,
                      }}
                    >
                      <MapPin size={12} color={A.textMuted} /> Cebu, Philippines
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: A.card,
                    border: `1px solid ${A.cardBorder}`,
                    borderRadius: 10,
                    padding: "14px 18px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      lineHeight: 1.8,
                      color: A.textMid,
                    }}
                  >
                    Full-stack software engineer crafting production-ready
                    applications with{" "}
                    <span style={{ color: A.teal }}>React & Next.js</span> on
                    the frontend and{" "}
                    <span style={{ color: A.violet }}>Spring Boot & Java</span>{" "}
                    on the backend. Passionate about clean architecture,
                    developer experience, and shipping things that matter.
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 10,
                  }}
                >
                  {[
                    {
                      v: `${moment().diff(moment(CAREER_START_DATE), "years")}+`,
                      l: "Years",
                      c: A.teal,
                    },
                    { v: "10+", l: "Projects", c: A.violet },
                    { v: "20+", l: "Technologies", c: A.green },
                    { v: "Active", l: "Status", c: "#FBBF24" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      style={{
                        background: A.card,
                        border: `1px solid ${A.cardBorder}`,
                        borderRadius: 9,
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{ fontSize: 20, fontWeight: 700, color: s.c }}
                      >
                        {s.v}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: A.textMuted,
                          marginTop: 1,
                        }}
                      >
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    {
                      href: GITHUB_URL,
                      icon: <GithubIcon size={13} />,
                      label: "GitHub",
                      c: A.text,
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
                      c: A.teal,
                    },
                  ].map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: A.glass,
                        border: `1px solid ${A.glassBorder}`,
                        borderRadius: 7,
                        padding: "6px 12px",
                        fontSize: 12,
                        color: l.c,
                        textDecoration: "none",
                      }}
                    >
                      {l.icon} {l.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {tab === "experience" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: A.text,
                  }}
                >
                  Work Experience
                </h2>
                {exps.map((exp, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 18,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: A.teal,
                          boxShadow: `0 0 7px ${A.teal}`,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      {i < exps.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            width: 1,
                            background: `linear-gradient(to bottom, rgba(${hexRgb(A.teal)},0.35), transparent)`,
                            marginTop: 5,
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: A.card,
                        border: `1px solid ${A.cardBorder}`,
                        borderRadius: 9,
                        padding: "12px 14px",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: A.text,
                          }}
                        >
                          {exp.title}
                        </span>
                        <span style={{ fontSize: 11, color: A.textMuted }}>
                          {formatDate(exp.startYear)} —{" "}
                          {formatDate(exp.endYear)}
                        </span>
                      </div>
                      {exp.subtitle && (
                        <div
                          style={{ fontSize: 12, color: A.teal, marginTop: 2 }}
                        >
                          {exp.subtitle}
                          {exp.employmentType && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 11,
                                color: A.violet,
                                background: `rgba(${hexRgb(A.violet)},0.12)`,
                                borderRadius: 4,
                                padding: "1px 5px",
                              }}
                            >
                              {exp.employmentType}
                            </span>
                          )}
                        </div>
                      )}
                      <p
                        style={{
                          margin: "7px 0 0",
                          fontSize: 12,
                          lineHeight: 1.65,
                          color: A.textMid,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "education" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: A.text,
                  }}
                >
                  Education
                </h2>
                {edus.map((edu, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      background: A.card,
                      border: `1px solid ${A.cardBorder}`,
                      borderRadius: 9,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: `rgba(${hexRgb(A.violet)},0.12)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <GraduationCap size={16} color={A.violet} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: A.text,
                        }}
                      >
                        {edu.title}
                      </div>
                      {edu.subtitle && (
                        <div
                          style={{
                            fontSize: 12,
                            color: A.violet,
                            marginTop: 1,
                          }}
                        >
                          {edu.subtitle}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 11,
                          color: A.textMuted,
                          marginTop: 3,
                        }}
                      >
                        {formatDate(edu.startYear)} — {formatDate(edu.endYear)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
