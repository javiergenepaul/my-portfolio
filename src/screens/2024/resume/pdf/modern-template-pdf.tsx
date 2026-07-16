import { Page, Text, View } from "@react-pdf/renderer";
import { translate } from "@/i18n";
import { SKILL_CATEGORIES } from "@/config";
import type { ResumeColorConfig } from "../resume";
import { px } from "./px";
import { getPdfFonts, mixColor, type PdfFonts } from "./common";
import { RESUME_DEFAULT, type ResumeData } from "../resume-content";

interface ModernTemplatePdfProps {
  colors: ResumeColorConfig;
  isDark?: boolean;
  /** Render from this data instead of the built-in résumé content. */
  content?: ResumeData;
}

const SIDEBAR_WIDTH = px(224); // w-56 in the HTML template

export function ModernTemplatePdf({
  colors,
  isDark = false,
  content,
}: ModernTemplatePdfProps) {
  const f = getPdfFonts();
  const { primary, light, dark, text } = colors;

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
  const contactLinks =
    contact.links ??
    [contact.github, contact.linkedin].filter(
      (l): l is { label: string; url: string } => !!l,
    );

  // Neutral tones that flip with isDark
  const pageBg = isDark ? "#1E293B" : "#FFFFFF";
  const sidebarBg = isDark ? "#0F172A" : light;
  const textDark = isDark ? "#F1F5F9" : "#111827";
  const textMed = isDark ? "#CBD5E1" : "#374151";
  const textMuted = isDark ? "#94A3B8" : "#6B7280";
  const dotEmpty = isDark ? "#334155" : "#D1D5DB";
  const badgeBg = isDark ? mixColor(primary, "#0F172A", 0.15) : light;
  const badgeText = isDark ? primary : dark;
  const cardBg = isDark ? "#0F172A" : light;
  const chipBg = mixColor(primary, cardBg, 0.13); // primary + "20"
  const chipText = isDark ? primary : dark;

  // Skill dots keep Modern's design, so they stay sourced from the rated
  // stack data (the flat ATS skill list has no proficiency values).
  const topSkills = SKILL_CATEGORIES.filter((c) =>
    ["backend", "frontend", "devops", "testing"].includes(c.key),
  );

  return (
    <Page
      size="A4"
      style={{ ...f.base, backgroundColor: pageBg, color: textDark }}
    >
      {/*
        Fixed, full-page-height colour panel for the sidebar — repeats on
        every page so the tint continues even where the sidebar's own
        content has run out.
      */}
      <View
        fixed
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          height: "100%",
          backgroundColor: sidebarBg,
        }}
      />

      {/* ── Colored header ─────────────────────────── */}
      <View
        style={{
          backgroundColor: primary,
          padding: `${px(28)} ${px(40)}`,
        }}
      >
        <Text style={{ ...f.bold, fontSize: px(30), color: text }}>{name}</Text>
        <Text
          style={{
            fontSize: px(14),
            color: text,
            marginTop: px(4),
            opacity: 0.9,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: px(16),
            columnGap: px(20),
            rowGap: px(4),
          }}
        >
          {[
            contact.email,
            contact.phone,
            contact.location,
            ...contactLinks.map((l) => l.label),
          ].map((item, i) => (
            <Text
              key={i}
              style={{ fontSize: px(10.5), color: text, opacity: 0.9 }}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>

      {/* ── Body ───────────────────────────────────── */}
      <View style={{ flexDirection: "row" }}>
        {/* Sidebar */}
        <View
          style={{
            width: SIDEBAR_WIDTH,
            padding: `${px(24)} ${px(24)}`,
          }}
        >
          {/* Summary */}
          <SideSection
            title={translate("win26.resume.sectionAbout")}
            primary={primary}
            f={f}
            first
          >
            <Text style={{ fontSize: px(10), color: textMed, lineHeight: 1.6 }}>
              {summary}
            </Text>
          </SideSection>

          {/* Skills — flat résumé skill groups when driven by content, else the
              rated-stack dots the default builder uses. */}
          {usingContent
            ? skills.map((group, i) => (
                <SideSection
                  key={i}
                  title={group.label}
                  primary={primary}
                  f={f}
                >
                  {group.items.map((item, k) => (
                    <Text
                      key={item}
                      style={{
                        fontSize: px(10),
                        color: textMed,
                        marginTop: k === 0 ? 0 : px(2),
                      }}
                    >
                      {item}
                    </Text>
                  ))}
                </SideSection>
              ))
            : topSkills.map((cat) => (
                <SideSection
                  key={cat.key}
                  title={cat.label}
                  primary={primary}
                  f={f}
                >
                  {cat.stacks.slice(0, 7).map((s, i) => (
                    <View
                      key={s.name}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: i === 0 ? 0 : px(3),
                      }}
                    >
                      <Text style={{ fontSize: px(10), color: textMed }}>
                        {translate(`services.stack.${s.name}` as any)}
                      </Text>
                      <View style={{ flexDirection: "row", columnGap: px(2) }}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <View
                            key={idx}
                            style={{
                              width: px(6),
                              height: px(6),
                              borderRadius: px(3),
                              backgroundColor:
                                idx < Math.ceil((s.rate / 10) * 5)
                                  ? primary
                                  : dotEmpty,
                            }}
                          />
                        ))}
                      </View>
                    </View>
                  ))}
                </SideSection>
              ))}

          {/* Education */}
          <SideSection
            title={translate("win26.resume.sectionEducation")}
            primary={primary}
            f={f}
          >
            {education.map((edu, i) => (
              <View key={i} style={{ marginTop: i === 0 ? 0 : px(12) }}>
                <Text style={{ ...f.bold, fontSize: px(10), color: textDark }}>
                  {edu.school}
                </Text>
                <Text
                  style={{ fontSize: px(10), color: textMed, lineHeight: 1.3 }}
                >
                  {edu.degree}
                </Text>
                <Text
                  style={{
                    fontSize: px(9),
                    color: textMuted,
                    marginTop: px(2),
                  }}
                >
                  {edu.period}
                </Text>
              </View>
            ))}
          </SideSection>

          {/* Certifications */}
          <SideSection title="Certifications" primary={primary} f={f}>
            {certifications.map((group, i) => (
              <View key={i} style={{ marginTop: i === 0 ? 0 : px(10) }}>
                {group.titles.map((t) => (
                  <Text
                    key={t}
                    style={{
                      fontSize: px(10),
                      color: textMed,
                      lineHeight: 1.3,
                    }}
                  >
                    {t}
                  </Text>
                ))}
                <Text
                  style={{
                    fontSize: px(9),
                    color: textMuted,
                    marginTop: px(2),
                  }}
                >
                  {group.issuer} ({group.year})
                </Text>
              </View>
            ))}
          </SideSection>
        </View>

        {/* Main content */}
        <View
          style={{ flexGrow: 1, flexBasis: 0, padding: `${px(24)} ${px(28)}` }}
        >
          {/* Experience */}
          <MainSection
            title={translate("win26.resume.sectionWorkExp")}
            primary={primary}
            f={f}
            first
          >
            {experience.map((exp, i) => (
              <View
                key={i}
                style={{ marginTop: i === 0 ? 0 : px(16) }}
                wrap={false}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flexGrow: 1, flexBasis: 0 }}>
                    <Text
                      style={{ ...f.bold, fontSize: px(14), color: textDark }}
                    >
                      {exp.role}
                    </Text>
                    <Text style={{ fontSize: px(12), color: primary }}>
                      {exp.company}
                      <Text style={{ color: textMuted }}>
                        {" · "}
                        {exp.employmentType}
                      </Text>
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: px(10),
                      color: badgeText,
                      backgroundColor: badgeBg,
                      borderRadius: px(9),
                      padding: `${px(2)} ${px(8)}`,
                      marginLeft: px(8),
                    }}
                  >
                    {exp.period}
                  </Text>
                </View>

                {exp.promotion && (
                  <View
                    style={{
                      marginTop: px(6),
                      paddingLeft: px(12),
                      borderLeftWidth: 2,
                      borderLeftColor: primary,
                    }}
                  >
                    <Text style={{ fontSize: px(10), color: textMed }}>
                      {exp.promotion}
                    </Text>
                  </View>
                )}

                <View style={{ marginTop: px(6) }}>
                  {exp.bullets.map((b, k) => (
                    <View
                      key={k}
                      style={{
                        flexDirection: "row",
                        marginTop: k === 0 ? 0 : px(3),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: px(11),
                          color: primary,
                          marginRight: px(6),
                        }}
                      >
                        •
                      </Text>
                      <Text
                        style={{
                          fontSize: px(11.5),
                          color: textMed,
                          lineHeight: 1.55,
                          flexGrow: 1,
                          flexBasis: 0,
                        }}
                      >
                        {b}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </MainSection>

          {/* Projects */}
          <MainSection
            title={translate("win26.resume.sectionProjects")}
            primary={primary}
            f={f}
          >
            {projects.map((p, i) => (
              <View
                key={p.name}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: px(6),
                  padding: px(12),
                  marginTop: i === 0 ? 0 : px(12),
                }}
                wrap={false}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: px(2),
                  }}
                >
                  <Text
                    style={{ ...f.bold, fontSize: px(14), color: textDark }}
                  >
                    {p.name}
                  </Text>
                  {p.context && (
                    <Text style={{ fontSize: px(10), color: textMuted }}>
                      {p.context}
                    </Text>
                  )}
                </View>
                {p.url && (
                  <Text
                    style={{
                      fontSize: px(10),
                      color: primary,
                      marginBottom: px(4),
                    }}
                  >
                    {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </Text>
                )}
                <Text
                  style={{ fontSize: px(12), color: textMed, lineHeight: 1.6 }}
                >
                  {p.bullets.join(" ")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    columnGap: px(4),
                    rowGap: px(4),
                    marginTop: px(6),
                  }}
                >
                  {p.stack.map((s) => (
                    <Text
                      key={s}
                      style={{
                        fontSize: px(9),
                        color: chipText,
                        backgroundColor: chipBg,
                        borderRadius: px(3),
                        padding: `${px(2)} ${px(6)}`,
                      }}
                    >
                      {s}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </MainSection>
        </View>
      </View>
    </Page>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SideSection({
  title,
  primary,
  f,
  first = false,
  children,
}: {
  title: string;
  primary: string;
  f: PdfFonts;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: first ? 0 : px(20) }}>
      <Text
        style={{
          ...f.bold,
          fontSize: px(10),
          textTransform: "uppercase",
          letterSpacing: px(1.5),
          color: primary,
          borderBottomWidth: 1,
          borderBottomColor: primary,
          paddingBottom: px(4),
          marginBottom: px(8),
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function MainSection({
  title,
  primary,
  f,
  first = false,
  children,
}: {
  title: string;
  primary: string;
  f: PdfFonts;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: first ? 0 : px(20) }}>
      <Text
        style={{
          ...f.bold,
          fontSize: px(14),
          textTransform: "uppercase",
          letterSpacing: px(1),
          color: primary,
          borderBottomWidth: 2,
          borderBottomColor: primary,
          paddingBottom: px(4),
          marginBottom: px(12),
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
