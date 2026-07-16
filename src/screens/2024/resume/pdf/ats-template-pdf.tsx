import { Page, Text, View, Link } from "@react-pdf/renderer";
import type { ResumeColorConfig } from "../resume";
import { px } from "./px";
import { getPdfFonts, type PdfFonts } from "./common";
import { RESUME_DEFAULT, type ResumeData } from "../resume-content";

interface AtsTemplatePdfProps {
  colors: ResumeColorConfig;
  isDark?: boolean;
  /** Render from this data instead of the built-in résumé content. */
  content?: ResumeData;
}

export function AtsTemplatePdf({
  colors,
  isDark = false,
  content,
}: AtsTemplatePdfProps) {
  const f = getPdfFonts();
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

  const pageBg = isDark ? "#1E293B" : "#FFFFFF";
  const textDark = isDark ? "#F1F5F9" : "#111827";
  const textMed = isDark ? "#CBD5E1" : "#1F2937";
  const textMuted = isDark ? "#94A3B8" : "#4B5563";
  const ruleColor = isDark ? "#334155" : "#D1D5DB";
  const linkColor = isDark ? "#93C5FD" : "#1D4ED8";

  return (
    <Page
      size="A4"
      style={{
        ...f.base,
        backgroundColor: pageBg,
        color: textDark,
        padding: `${px(28)} ${px(48)}`,
      }}
    >
      {/* ── HEADER ─────────────────────────────────── */}
      <View>
        <Text style={{ ...f.bold, fontSize: px(30), color: textDark }}>
          {name}
        </Text>
        <Text
          style={{
            ...f.bold,
            fontSize: px(14),
            color: textMed,
            marginTop: px(2),
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: px(11),
            color: textMuted,
            marginTop: px(8),
            lineHeight: 1.6,
          }}
        >
          {contact.phone} |{" "}
          <Link
            src={`mailto:${contact.email}`}
            style={{ color: linkColor, textDecoration: "none" }}
          >
            {contact.email}
          </Link>{" "}
          | {contact.location}
        </Text>
        {contactLinks.length > 0 && (
          <Text style={{ fontSize: px(11), color: textMuted, lineHeight: 1.6 }}>
            {contactLinks.map((l, i) => (
              <Text key={i}>
                {i > 0 && " | "}
                <Link
                  src={l.url}
                  style={{ color: linkColor, textDecoration: "none" }}
                >
                  {l.label}
                </Link>
              </Text>
            ))}
          </Text>
        )}
      </View>

      {/* ── SUMMARY ────────────────────────────────── */}
      <Section title="Summary" accent={primary} rule={ruleColor} f={f}>
        <Text style={{ fontSize: px(11), color: textMed, lineHeight: 1.6 }}>
          {summary}
        </Text>
      </Section>

      {/* ── EXPERIENCE ─────────────────────────────── */}
      <Section title="Experience" accent={primary} rule={ruleColor} f={f}>
        {experience.map((exp, i) => (
          <View
            key={i}
            style={{ marginTop: i === 0 ? 0 : px(12) }}
            wrap={false}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  ...f.bold,
                  fontSize: px(12),
                  color: textDark,
                  flexGrow: 1,
                }}
              >
                {exp.role}
                <Text style={{ ...f.base, color: textMed }}>
                  {" "}
                  — {exp.company}
                </Text>
                <Text style={{ ...f.base, color: textMuted }}>
                  {" "}
                  · {exp.employmentType}
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: px(10),
                  color: textMuted,
                  marginLeft: px(12),
                }}
              >
                {exp.period}
              </Text>
            </View>

            {exp.promotion && (
              <Text
                style={{
                  ...f.italic,
                  fontSize: px(10.5),
                  color: textMuted,
                  marginTop: px(1),
                }}
              >
                {exp.promotion}
              </Text>
            )}

            <BulletList items={exp.bullets} color={textMed} fontSize={px(11)} />
          </View>
        ))}
      </Section>

      {/* ── SKILLS ─────────────────────────────────── */}
      <Section title="Skills" accent={primary} rule={ruleColor} f={f}>
        {skills.map((cat) => (
          <Text
            key={cat.label}
            style={{ fontSize: px(11), color: textMed, lineHeight: 1.6 }}
          >
            <Text style={{ ...f.bold, color: textDark }}>{cat.label}:</Text>{" "}
            {cat.items.join(", ")}
          </Text>
        ))}
      </Section>

      {/* ── PROJECTS ───────────────────────────────── */}
      <Section title="Projects" accent={primary} rule={ruleColor} f={f}>
        {projects.map((p, i) => (
          <View
            key={p.name}
            style={{ marginTop: i === 0 ? 0 : px(12) }}
            wrap={false}
          >
            <Text style={{ ...f.bold, fontSize: px(12), color: textDark }}>
              {p.name}
              {p.context && (
                <Text style={{ ...f.base, color: textMuted }}>
                  {" "}
                  — {p.context}
                </Text>
              )}
              {p.url && (
                <Text style={{ ...f.base, color: textMuted }}>
                  {" · "}
                  {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </Text>
              )}
            </Text>
            <BulletList items={p.bullets} color={textMed} fontSize={px(11)} />
            <Text
              style={{
                fontSize: px(10.5),
                color: textMuted,
                marginTop: px(4),
                lineHeight: 1.6,
              }}
            >
              <Text style={f.bold}>Technologies:</Text> {p.stack.join(", ")}
            </Text>
          </View>
        ))}
      </Section>

      {/* ── EDUCATION ──────────────────────────────── */}
      <Section title="Education" accent={primary} rule={ruleColor} f={f}>
        {education.map((edu, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: i === 0 ? 0 : px(8),
            }}
            wrap={false}
          >
            <Text style={{ fontSize: px(11), color: textMed, flexGrow: 1 }}>
              <Text style={{ ...f.bold, color: textDark }}>{edu.degree}</Text>
              {" — "}
              {edu.school}
            </Text>
            <Text
              style={{ fontSize: px(10), color: textMuted, marginLeft: px(12) }}
            >
              {edu.period}
            </Text>
          </View>
        ))}
      </Section>

      {/* ── CERTIFICATIONS ─────────────────────────── */}
      <Section title="Certifications" accent={primary} rule={ruleColor} f={f}>
        {certifications.map((group, i) => (
          <Text
            key={i}
            style={{ fontSize: px(11), color: textMed, lineHeight: 1.6 }}
          >
            {group.titles.join(", ")}
            <Text style={{ color: textMuted }}>
              {" — "}
              {group.issuer} ({group.year})
            </Text>
          </Text>
        ))}
      </Section>
    </Page>
  );
}

/** Single-column section with an accented heading rule. */
function Section({
  title,
  accent,
  rule,
  f,
  children,
}: {
  title: string;
  accent: string;
  rule: string;
  f: PdfFonts;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: px(10) }}>
      <Text
        style={{
          ...f.bold,
          fontSize: px(13),
          textTransform: "uppercase",
          letterSpacing: px(0.7),
          color: accent,
          borderBottomWidth: 1.5,
          borderBottomColor: rule,
          paddingBottom: px(3),
          marginBottom: px(6),
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function BulletList({
  items,
  color,
  fontSize,
}: {
  items: string[];
  color: string;
  fontSize: number;
}) {
  return (
    <View style={{ marginTop: px(4), paddingLeft: px(6) }}>
      {items.map((item, i) => (
        <View
          key={i}
          style={{ flexDirection: "row", marginTop: i === 0 ? 0 : px(2) }}
        >
          <Text style={{ fontSize, color, marginRight: px(6) }}>•</Text>
          <Text
            style={{
              fontSize,
              color,
              lineHeight: 1.55,
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
