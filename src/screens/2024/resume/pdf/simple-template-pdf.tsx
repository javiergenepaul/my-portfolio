import { Page, Text, View } from "@react-pdf/renderer";
import { translate } from "@/i18n";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  MOBILE_NUMBER,
  SKILL_CATEGORIES,
} from "@/config";
import type { ResumeColorConfig } from "../resume";
import { px } from "./px";
import {
  formatDateRange,
  employmentLabel,
  getPdfFonts,
  getResumeData,
  mixColor,
  type PdfFonts,
} from "./common";

interface SimpleTemplatePdfProps {
  colors: ResumeColorConfig;
  isDark?: boolean;
}

const LEFT_COL_WIDTH = px(176); // w-44 in the HTML template

export function SimpleTemplatePdf({
  colors,
  isDark = false,
}: SimpleTemplatePdfProps) {
  const f = getPdfFonts();
  const { experience, education, projects } = getResumeData();
  const accent = colors.primary;

  // Neutral tones that flip with isDark
  const pageBg = isDark ? "#1E293B" : "#FFFFFF";
  const colBg = isDark ? "#0F172A" : "#F9FAFB";
  const textDark = isDark ? "#F1F5F9" : "#111827";
  const textMed = isDark ? "#CBD5E1" : "#374151";
  const textMuted = isDark ? "#94A3B8" : "#6B7280";
  const textLight = isDark ? "#64748B" : "#9CA3AF";
  const colBorder = mixColor(accent, colBg, 0.13); // accent + "22"
  const thinRule = mixColor(accent, colBg, 0.27); // accent + "44"

  // Flatten top skills for left-column "Core Competencies"
  const coreSkills = SKILL_CATEGORIES.filter((c) =>
    ["backend", "frontend"].includes(c.key),
  );
  const devopsSkills = SKILL_CATEGORIES.find((c) => c.key === "devops");
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

  const sideTitleStyle = {
    ...f.bold,
    fontSize: px(9),
    letterSpacing: px(1.8),
    textTransform: "uppercase" as const,
    color: accent,
    marginBottom: px(8),
  };

  return (
    <Page
      size="A4"
      style={{ ...f.base, backgroundColor: pageBg, color: textDark }}
    >
      {/*
        Fixed, full-page-height colour panel for the left column — repeats on
        every page at a constant size so the tint continues even where the
        column's own content has run out.
      */}
      <View
        fixed
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: LEFT_COL_WIDTH,
          height: "100%",
          backgroundColor: colBg,
          borderRightWidth: 1,
          borderRightColor: colBorder,
        }}
      />

      {/* ── HEADER ─────────────────────────────────── */}
      <View
        style={{
          backgroundColor: pageBg,
          alignItems: "center",
          paddingTop: px(32),
          paddingBottom: px(16),
          paddingHorizontal: px(40),
        }}
      >
        <Text
          style={{
            ...f.bold,
            fontSize: px(28),
            letterSpacing: px(2.8),
            textTransform: "uppercase",
            color: textDark,
          }}
        >
          {FULL_NAME}
        </Text>
        <Text
          style={{
            fontSize: px(10),
            letterSpacing: px(3.5),
            textTransform: "uppercase",
            color: accent,
            marginTop: px(4),
          }}
        >
          {JOB_TITLE}
        </Text>
      </View>

      {/* Full-width divider */}
      <View
        style={{
          marginHorizontal: px(40),
          height: px(2),
          backgroundColor: accent,
        }}
      />

      {/* ── BODY ───────────────────────────────────── */}
      <View style={{ flexDirection: "row" }}>
        {/* LEFT COLUMN */}
        <View
          style={{
            width: LEFT_COL_WIDTH,
            padding: `${px(16)} ${px(20)}`,
          }}
        >
          {/* Contact */}
          <View>
            <Text style={sideTitleStyle}>
              {translate("win26.resume.sectionContact")}
            </Text>
            {[
              MOBILE_NUMBER,
              EMAIL_ADDRESS,
              "Cebu, Philippines",
              "github.com/javiergenepaul",
              "linkedin.com/in/gene-paul-mar-javier",
            ].map((text, i) => (
              <Text
                key={i}
                style={{
                  fontSize: px(8.5),
                  color: textMed,
                  lineHeight: 1.4,
                  marginTop: i === 0 ? 0 : px(5),
                }}
              >
                {text}
              </Text>
            ))}
          </View>

          <ThinDivider color={thinRule} />

          {/* Core Competencies */}
          <View>
            <Text style={sideTitleStyle}>
              {translate("win26.resume.sectionCoreComp")}
            </Text>
            {coreCompetencies.map((skill, i) => (
              <Text
                key={skill}
                style={{
                  fontSize: px(9),
                  color: textMed,
                  marginTop: i === 0 ? 0 : px(4),
                }}
              >
                {skill}
              </Text>
            ))}
          </View>

          <ThinDivider color={thinRule} />

          {/* Education */}
          <View>
            <Text style={sideTitleStyle}>
              {translate("win26.resume.sectionEducation")}
            </Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginTop: i === 0 ? 0 : px(12) }}>
                <Text style={{ ...f.bold, fontSize: px(9.5), color: textDark }}>
                  <Text style={{ color: accent }}>//</Text>
                  {edu.title}
                </Text>
                {edu.subtitle && (
                  <Text
                    style={{ ...f.italic, fontSize: px(8.5), color: textMuted }}
                  >
                    {edu.subtitle}
                  </Text>
                )}
                <Text style={{ fontSize: px(8), color: textLight }}>
                  {formatDateRange(edu.startYear, edu.endYear)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* RIGHT COLUMN */}
        <View
          style={{ flexGrow: 1, flexBasis: 0, padding: `${px(16)} ${px(24)}` }}
        >
          {/* Qualifications Summary */}
          <SectionDivider
            title={translate("win26.resume.sectionQualSummary")}
            accent={accent}
            f={f}
          />
          <Text style={{ fontSize: px(9.5), color: textMed, lineHeight: 1.6 }}>
            {translate("about.intro.intruduction")}
          </Text>

          {/* Work Experience */}
          <SectionDivider
            title={translate("win26.resume.sectionWorkExp")}
            accent={accent}
            f={f}
          />
          {experience.map((exp, i) => {
            const employment = employmentLabel(exp.employmentType);
            const subtitle = `${exp.subtitle ?? ""}${employment ? " · " + employment : ""}`;
            const bullets =
              exp.promotion && exp.promotion.length > 0
                ? exp.promotion.map(
                    (p) =>
                      `${p.title} (${formatDateRange(p.startYear, p.endYear)})`,
                  )
                : exp.description
                    .split(". ")
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((s) => s.trim().replace(/\.$/, "") + ".");
            return (
              <View
                key={i}
                style={{ marginTop: i === 0 ? 0 : px(12) }}
                wrap={false}
              >
                <EntryHeader
                  title={exp.title}
                  subtitle={subtitle}
                  date={formatDateRange(exp.startYear, exp.endYear)}
                  accent={accent}
                  textDark={textDark}
                  textMuted={textMuted}
                  f={f}
                />
                <BulletList items={bullets} color={textMed} />
              </View>
            );
          })}

          {/* Featured Projects */}
          <SectionDivider
            title={translate("win26.resume.sectionProjects")}
            accent={accent}
            f={f}
          />
          {projects.map((p, i) => (
            <View
              key={p.projectId}
              style={{ marginTop: i === 0 ? 0 : px(12) }}
              wrap={false}
            >
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
                f={f}
              />
              <BulletList
                items={p.description
                  .split(". ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((s) => s.trim().replace(/\.$/, "") + ".")}
                color={textMed}
              />
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ThinDivider({ color }: { color: string }) {
  return (
    <View
      style={{ height: 1, backgroundColor: color, marginVertical: px(16) }}
    />
  );
}

/** ── SECTION DIVIDER  ─────── TITLE ─────────── */
function SectionDivider({
  title,
  accent,
  f,
}: {
  title: string;
  accent: string;
  f: PdfFonts;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: px(12),
      }}
    >
      <View style={{ flexGrow: 1, height: 1, backgroundColor: accent }} />
      <Text
        style={{
          ...f.bold,
          fontSize: px(10),
          letterSpacing: px(2.5),
          textTransform: "uppercase",
          color: accent,
          paddingHorizontal: px(6),
        }}
      >
        {title}
      </Text>
      <View style={{ flexGrow: 1, height: 1, backgroundColor: accent }} />
    </View>
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
  f,
}: {
  title: string;
  subtitle?: string;
  date?: string;
  accent: string;
  textDark: string;
  textMuted: string;
  f: PdfFonts;
}) {
  return (
    <View style={{ marginBottom: px(2) }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{ ...f.bold, fontSize: px(11), color: textDark, flexGrow: 1 }}
        >
          <Text style={{ color: accent }}>//</Text>
          {title}
        </Text>
        {date && (
          <Text
            style={{ fontSize: px(9), color: textMuted, marginLeft: px(8) }}
          >
            {date}
          </Text>
        )}
      </View>
      {subtitle && (
        <Text style={{ ...f.italic, fontSize: px(9.5), color: textMuted }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

/** Bullet list */
function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <View style={{ marginTop: px(2), paddingLeft: px(6) }}>
      {items.map((item, i) => (
        <View
          key={i}
          style={{ flexDirection: "row", marginTop: i === 0 ? 0 : px(2) }}
        >
          <Text style={{ fontSize: px(9.5), color, marginRight: px(5) }}>
            •
          </Text>
          <Text
            style={{
              fontSize: px(9.5),
              color,
              lineHeight: 1.6,
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
