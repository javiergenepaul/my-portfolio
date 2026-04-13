"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, ArrowUpRight } from "lucide-react";
import { getExperience, getEducation } from "@/config";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim, ease } from "../animation";
import { fmt } from "../constants";
import { Label, SectionLabel } from "../components/helpers";

export function ExperienceSection({
  experience,
  education,
}: {
  experience: ReturnType<typeof getExperience>;
  education: ReturnType<typeof getEducation>;
}) {
  const C = useC();
  const isMobile = useIsMobile();
  return (
    <>
      <Label text="02 — Education & Experience" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 24px",
          color: C.textDark,
        }}
      >
        My Journey<span style={{ color: C.indigo }}>.</span>
      </h2>

      {/* Education */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            backgroundColor: C.indigoLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={16} style={{ color: C.indigoDark }} />
        </div>
        <SectionLabel>Education</SectionLabel>
      </div>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{
          position: "relative",
          paddingLeft: "16px",
          marginBottom: "32px",
        }}
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          style={{
            position: "absolute",
            left: 0,
            top: "4px",
            bottom: "4px",
            width: "2px",
            borderRadius: "2px",
            background: `linear-gradient(to bottom, ${C.indigoDark}, ${C.indigo}33)`,
            transformOrigin: "top",
          }}
        />
        {education.map((edu, i) => (
          <motion.div
            key={i}
            variants={itemAnim}
            whileHover={{ x: 3, boxShadow: `0 4px 20px rgba(225,29,72,0.12)` }}
            style={{
              position: "relative",
              marginBottom: "10px",
              borderRadius: "16px",
              padding: "18px 20px",
              border: `1px solid ${C.border}`,
              backgroundColor: C.card,
              cursor: "default",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              style={{
                position: "absolute",
                left: "-24px",
                top: "22px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: C.indigoDark,
                border: `2px solid ${C.page}`,
                boxShadow: `0 0 8px rgba(225,29,72,0.5)`,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {edu.title}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: C.indigoDark,
                    marginTop: "3px",
                  }}
                >
                  {edu.subtitle}
                </p>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "4px 11px",
                  borderRadius: "99px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  backgroundColor: C.indigoLight,
                  color: C.indigoDark,
                }}
              >
                {fmt(edu.startYear, edu.endYear)}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Experience */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            backgroundColor: C.mintLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Briefcase size={16} style={{ color: C.mintDark }} />
        </div>
        <SectionLabel>Work Experience</SectionLabel>
      </div>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ position: "relative", paddingLeft: "16px" }}
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          style={{
            position: "absolute",
            left: 0,
            top: "4px",
            bottom: "4px",
            width: "2px",
            borderRadius: "2px",
            background: `linear-gradient(to bottom, ${C.mintDark}, ${C.mint}33)`,
            transformOrigin: "top",
          }}
        />
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            variants={itemAnim}
            whileHover={{ x: 3, boxShadow: `0 4px 20px rgba(190,18,60,0.1)` }}
            style={{
              position: "relative",
              marginBottom: "10px",
              borderRadius: "16px",
              padding: "18px 20px",
              border: `1px solid ${C.border}`,
              backgroundColor: C.card,
              cursor: "default",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{
                position: "absolute",
                left: "-24px",
                top: "22px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: C.mintDark,
                border: `2px solid ${C.page}`,
                boxShadow: `0 0 8px rgba(190,18,60,0.5)`,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {exp.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: C.indigo,
                      margin: 0,
                    }}
                  >
                    {exp.subtitle}
                  </p>
                  {exp.employmentType && (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        fontWeight: 600,
                        backgroundColor: C.mintLight,
                        color: C.mintDark,
                      }}
                    >
                      {exp.employmentType}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    padding: "4px 11px",
                    borderRadius: "99px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    backgroundColor: C.mintLight,
                    color: C.mintDark,
                  }}
                >
                  {fmt(exp.startYear, exp.endYear)}
                </span>
                {exp.subtitleUrl && (
                  <a
                    href={exp.subtitleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: C.textMuted }}
                  >
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </div>
            {exp.promotion && exp.promotion.length > 0 ? (
              <ul
                style={{
                  margin: "10px 0 0",
                  padding: "0 0 0 14px",
                  borderLeft: `2px solid ${C.indigoDark}33`,
                  listStyle: "none",
                }}
              >
                {exp.promotion.map((p, j) => (
                  <li key={j} style={{ marginBottom: "6px" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: C.textMid,
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: C.textMuted,
                        margin: "2px 0 0",
                      }}
                    >
                      {fmt(p.startYear, p.endYear)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: C.textMuted,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {exp.description}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
