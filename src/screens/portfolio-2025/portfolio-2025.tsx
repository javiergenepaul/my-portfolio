"use client";

import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import {
  FULL_NAME, JOB_TITLE, EMAIL_ADDRESS,
  getExperience, getEducation, SKILL_CATEGORIES,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import AboutMeImg  from "@/assets/about-me.png";

// ── Palette ───────────────────────────────────────────────────────────────────

const C = {
  page:            "#060108",
  sidebar:         "#0C0509",
  sidebarHover:    "#18080F",
  main:            "#FFFFFF",
  indigo:          "#FB7185",
  indigoDark:      "#E11D48",
  indigoLight:     "rgba(251,113,133,0.1)",
  mint:            "#FDA4AF",
  mintDark:        "#BE123C",
  mintLight:       "rgba(253,164,175,0.12)",
  amber:           "#FBBF24",
  amberLight:      "rgba(251,191,36,0.1)",
  textDark:        "#0F172A",
  textMid:         "#334155",
  textMuted:       "#64748B",
  textSidebar:     "#F8FAFC",
  textSidebarDim:  "#94A3B8",
  border:          "#E2E8F0",
  borderSidebar:   "#2A0910",
  card:            "#F8FAFC",
};

const NAV_ITEMS = [
  { id: "about",      label: "About",      num: "01" },
  { id: "education",  label: "Education",  num: "02" },
  { id: "experience", label: "Experience", num: "03" },
  { id: "skills",     label: "Tech Stack", num: "04" },
];

const CAT = {
  backend:  { bg: C.indigoLight, color: C.indigoDark, border: "rgba(225,29,72,0.25)"  },
  frontend: { bg: C.mintLight,   color: C.mintDark,   border: "rgba(190,18,60,0.2)"   },
  devops:   { bg: C.amberLight,  color: "#B45309",    border: "rgba(251,191,36,0.25)" },
};

function fmt(s: moment.Moment, e: moment.Moment | "present") {
  return `${s.format("MMM YYYY")} — ${e === "present" ? "Present" : (e as moment.Moment).format("MMM YYYY")}`;
}

// ── Main component ────────────────────────────────────────────────────────────

export function Portfolio2025() {
  useLocaleRefresh();
  const [active, setActive] = useState("about");
  const suppressRef = useRef(false);

  const experience  = getExperience().filter((e) => e.isWork);
  const education   = getEducation().filter((e) => e.level === "tertiary" || e.level === "vocational");
  const skillGroups = SKILL_CATEGORIES.filter((c) => ["backend", "frontend", "devops"].includes(c.key));

  useEffect(() => {
    const container = document.getElementById("p25-scroll");
    if (!container) return;

    const handleScroll = () => {
      if (suppressRef.current) return;
      const containerTop = container.getBoundingClientRect().top;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(`p25-${NAV_ITEMS[i].id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top - containerTop <= 80) {
          setActive(NAV_ITEMS[i].id);
          return;
        }
      }
      setActive(NAV_ITEMS[0].id);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const goto = (id: string) => {
    setActive(id);
    const container = document.getElementById("p25-scroll");
    const target = document.getElementById(`p25-${id}`);
    if (!container || !target) return;
    suppressRef.current = true;
    const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTo({ top: offset, behavior: "smooth" });
    setTimeout(() => { suppressRef.current = false; }, 800);
  };

  const sidebar = <SidebarPanel active={active} goto={goto} />;
  const main    = <MainPanel experience={experience} education={education} skillGroups={skillGroups} />;

  return (
    <div
      className="min-h-screen flex items-start lg:items-center justify-center p-4 sm:p-6 lg:py-10 lg:px-6"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 20% 40%, rgba(190,18,60,0.22) 0%, transparent 60%),
                     radial-gradient(ellipse 60% 50% at 80% 70%, rgba(225,29,72,0.12) 0%, transparent 55%),
                     ${C.page}`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        className="w-full max-w-xl lg:max-w-7xl rounded-3xl flex flex-col lg:flex-row overflow-hidden"
        style={{
          border:    `1px solid ${C.borderSidebar}`,
          boxShadow: `0 32px 80px rgba(190,18,60,0.4), 0 0 0 1px rgba(225,29,72,0.08)`,
        }}
      >
        {/* Sidebar */}
        <div
          className="lg:w-72 shrink-0 flex flex-col"
          style={{ backgroundColor: C.sidebar }}
        >
          {sidebar}
        </div>

        {/* Main */}
        <div
          id="p25-scroll"
          className="flex-1 overflow-y-auto lg:max-h-[90vh]"
          style={{ backgroundColor: C.main }}
        >
          {main}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar panel ─────────────────────────────────────────────────────────────

function SidebarPanel({ active, goto }: { active: string; goto: (id: string) => void }) {
  return (
    <>
      {/* Profile */}
      <div style={{ padding: "32px 20px 16px", textAlign: "center" }}>
        <div
          style={{
            display:      "inline-block",
            borderRadius: "50%",
            padding:      "2.5px",
            background:   `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
            boxShadow:    `0 0 28px rgba(225,29,72,0.35)`,
            marginBottom: "12px",
          }}
        >
          <div style={{ width: "88px", height: "88px", borderRadius: "50%", overflow: "hidden" }}>
            <img
              src={AvatarProfile as unknown as string}
              alt={FULL_NAME}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
          </div>
        </div>

        <h2 style={{ color: C.textSidebar, fontSize: "13px", fontWeight: 800, lineHeight: 1.3, margin: 0 }}>
          {FULL_NAME}
        </h2>
        <p
          style={{
            fontSize:             "10px",
            fontWeight:           600,
            marginTop:            "4px",
            background:           `linear-gradient(90deg, ${C.indigoDark}, ${C.indigo})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
            backgroundClip:       "text",
          }}
        >
          {JOB_TITLE}
        </p>
        <p style={{ fontSize: "10px", marginTop: "8px", lineHeight: 1.5, color: C.textSidebarDim }}>
          {translate("about.intro.intruduction").slice(0, 80).trimEnd()}…
        </p>
      </div>

      {/* Separator */}
      <Separator />

      {/* Social */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "12px 0" }}>
        {[
          { href: GITHUB_URL,              Icon: Github,   label: "GitHub"   },
          { href: LINKED_IN_URL,           Icon: Linkedin, label: "LinkedIn" },
          { href: `mailto:${EMAIL_ADDRESS}`, Icon: Mail,   label: "Email"    },
        ].map(({ href, Icon, label }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={label}
            style={{
              width:           "32px",
              height:          "32px",
              borderRadius:    "8px",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              backgroundColor: C.sidebarHover,
              color:           C.textSidebarDim,
              border:          `1px solid ${C.borderSidebar}`,
              textDecoration:  "none",
            }}
          >
            <Icon size={13} />
          </a>
        ))}
      </div>

      {/* Separator */}
      <Separator />

      {/* Nav */}
      <nav style={{ padding: "12px 8px", flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, num }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => goto(id)}
              style={{
                display:         "flex",
                alignItems:      "center",
                gap:             "10px",
                padding:         "9px 12px",
                borderRadius:    "8px",
                width:           "100%",
                textAlign:       "left",
                border:          "none",
                cursor:          "pointer",
                backgroundColor: on ? C.sidebarHover : "transparent",
                borderLeft:      `2px solid ${on ? C.indigoDark : "transparent"}`,
                transition:      "all 0.2s",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 700, color: on ? C.indigoDark : C.borderSidebar }}>
                {num}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: on ? C.textSidebar : C.textSidebarDim }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Location */}
      <div style={{ padding: "10px 20px 16px", textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", color: C.textSidebarDim }}>
          <MapPin size={9} />
          Cebu, Philippines
        </span>
      </div>
    </>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

function MainPanel({
  experience,
  education,
  skillGroups,
}: {
  experience:  ReturnType<typeof getExperience>;
  education:   ReturnType<typeof getEducation>;
  skillGroups: typeof SKILL_CATEGORIES;
}) {
  return (
    <div style={{ padding: "36px 36px 24px" }}>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <section id="p25-about" style={{ marginBottom: "52px", scrollMarginTop: "16px" }}>
        <Label text="01 — About" />
        <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.5px", margin: "4px 0 20px", color: C.textDark }}>
          About Me<span style={{ color: C.indigoDark }}>.</span>
        </h2>

        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "16px" }}>
          <p style={{ flex: 1, fontSize: "13px", lineHeight: 1.7, color: C.textMid, margin: 0 }}>
            {translate("about.intro.intruduction")}
          </p>
          <div
            style={{
              width:        "100px",
              height:       "130px",
              flexShrink:   0,
              borderRadius: "12px",
              overflow:     "hidden",
              border:       `1px solid ${C.border}`,
              boxShadow:    "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={AboutMeImg as unknown as string}
              alt={FULL_NAME}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
          </div>
        </div>

        {/* Contact row */}
        <div
          style={{
            display:         "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:             "8px",
            padding:         "12px 14px",
            borderRadius:    "12px",
            backgroundColor: C.card,
            border:          `1px solid ${C.border}`,
          }}
        >
          {[
            { Icon: Mail,     text: EMAIL_ADDRESS,                    href: `mailto:${EMAIL_ADDRESS}` },
            { Icon: MapPin,   text: "Cebu, Philippines",              href: undefined                  },
            { Icon: Github,   text: "github.com/javiergenepaul",      href: GITHUB_URL                 },
            { Icon: Linkedin, text: "linkedin/gene-paul-mar-javier",  href: LINKED_IN_URL              },
          ].map(({ Icon, text, href }) =>
            href ? (
              <a
                key={text}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: C.textMuted, textDecoration: "none" }}
              >
                <Icon size={11} style={{ color: C.indigoDark, flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
              </a>
            ) : (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: C.textMuted }}>
                <Icon size={11} style={{ color: C.indigoDark, flexShrink: 0 }} />
                {text}
              </span>
            )
          )}
        </div>
      </section>

      {/* ── Education ──────────────────────────────────────────────────── */}
      <section id="p25-education" style={{ marginBottom: "52px", scrollMarginTop: "16px" }}>
        <Label text="02 — Education" />
        <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.5px", margin: "4px 0 20px", color: C.textDark }}>
          Education<span style={{ color: C.indigo }}>.</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {education.map((edu, i) => (
            <div
              key={i}
              style={{
                borderRadius:    "14px",
                padding:         "16px 18px",
                border:          `1px solid ${C.border}`,
                backgroundColor: C.card,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "13px", color: C.textDark, margin: 0 }}>{edu.title}</p>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: C.indigoDark, marginTop: "2px" }}>{edu.subtitle}</p>
                </div>
                <span
                  style={{
                    fontSize:        "10px",
                    padding:         "4px 10px",
                    borderRadius:    "99px",
                    fontWeight:      600,
                    whiteSpace:      "nowrap",
                    flexShrink:      0,
                    backgroundColor: C.indigoLight,
                    color:           C.indigoDark,
                  }}
                >
                  {fmt(edu.startYear, edu.endYear)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Experience ─────────────────────────────────────────────────── */}
      <section id="p25-experience" style={{ marginBottom: "52px", scrollMarginTop: "16px" }}>
        <Label text="03 — Experience" />
        <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.5px", margin: "4px 0 20px", color: C.textDark }}>
          Experience<span style={{ color: C.indigo }}>.</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {experience.map((exp, i) => (
            <div
              key={i}
              className="group"
              style={{
                borderRadius:    "14px",
                padding:         "16px 18px",
                border:          `1px solid ${C.border}`,
                backgroundColor: C.card,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "6px" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "13px", color: C.textDark, margin: 0 }}>{exp.title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: C.indigo, margin: 0 }}>{exp.subtitle}</p>
                    {exp.employmentType && (
                      <span
                        style={{
                          fontSize:        "9px",
                          padding:         "2px 7px",
                          borderRadius:    "99px",
                          fontWeight:      600,
                          backgroundColor: C.mintLight,
                          color:           C.mintDark,
                        }}
                      >
                        {exp.employmentType}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize:        "10px",
                      padding:         "4px 10px",
                      borderRadius:    "99px",
                      fontWeight:      600,
                      whiteSpace:      "nowrap",
                      backgroundColor: C.mintLight,
                      color:           C.mintDark,
                    }}
                  >
                    {fmt(exp.startYear, exp.endYear)}
                  </span>
                  {exp.subtitleUrl && (
                    <a href={exp.subtitleUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.textMuted }}>
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>

              {exp.promotion && exp.promotion.length > 0 ? (
                <ul style={{ margin: "8px 0 0", padding: "0 0 0 12px", borderLeft: `2px solid ${C.indigoDark}33`, listStyle: "none" }}>
                  {exp.promotion.map((p, j) => (
                    <li key={j} style={{ marginBottom: "4px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: C.textMid, margin: 0 }}>{p.title}</p>
                      <p style={{ fontSize: "10px", color: C.textMuted, margin: "1px 0 0" }}>{fmt(p.startYear, p.endYear)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "12px", lineHeight: 1.6, color: C.textMuted, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ─────────────────────────────────────────────────── */}
      <section id="p25-skills" style={{ scrollMarginTop: "16px" }}>
        <Label text="04 — Skills" />
        <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.5px", margin: "4px 0 20px", color: C.textDark }}>
          Tech Stack<span style={{ color: C.amber }}>.</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {skillGroups.map((cat) => {
            const col = CAT[cat.key as keyof typeof CAT] ?? { bg: C.card, color: C.textMuted, border: C.border };
            return (
              <div key={cat.key}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: col.color, flexShrink: 0 }} />
                  <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textMuted, margin: 0 }}>
                    {cat.label}
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {cat.stacks.map((s) => (
                    <span
                      key={s.name}
                      style={{
                        padding:         "5px 12px",
                        borderRadius:    "99px",
                        fontSize:        "11px",
                        fontWeight:      600,
                        backgroundColor: col.bg,
                        color:           col.color,
                        border:          `1px solid ${col.border}`,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", marginTop: "40px", marginBottom: "8px", color: C.textMuted }}>
          Crafted with care · {new Date().getFullYear()}
        </p>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Separator() {
  return (
    <div
      style={{
        margin:     "0 20px",
        height:     "1px",
        background: `linear-gradient(to right, ${C.indigoDark}44, ${C.indigo}44)`,
      }}
    />
  );
}

function Label({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.textMuted, margin: 0 }}>
      {text}
    </p>
  );
}
