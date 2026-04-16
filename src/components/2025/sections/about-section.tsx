"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Mail, MapPin, Github, Linkedin } from "lucide-react";
import { FULL_NAME, EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AboutMeImg from "@/assets/about-me.png";
import { ResumeModal } from "@/components/common/resume-modal";
import { translate } from "@/i18n";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { Label } from "../components/helpers";

export function AboutSection() {
  const C = useC();
  const isMobile = useIsMobile();
  const [resumeOpen, setResumeOpen] = useState(false);

  const HIGHLIGHTS = [
    {
      icon: "⚡",
      title: "Full-Stack Dev",
      desc: "End-to-end features from database schema to polished UI, with a focus on clean, production-ready code.",
    },
    {
      icon: "🎨",
      title: "UI / UX Focused",
      desc: "I care about the details — responsive layouts, fluid animations, and interfaces that feel great to use.",
    },
    {
      icon: "🤝",
      title: "Remote-Ready",
      desc: "Comfortable in async, distributed teams. Strong communicator who ships reliably without hand-holding.",
    },
  ];

  return (
    <>
      <Label text="01 — About" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 20px",
          color: C.textDark,
        }}
      >
        About Me<span style={{ color: C.indigoDark }}>.</span>
      </h2>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Intro + photo */}
        <motion.div
          variants={itemAnim}
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.85,
                color: C.textMid,
                margin: "0 0 12px",
              }}
            >
              {translate("about.intro.intruduction")}
            </p>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.85,
                color: C.textMuted,
                margin: 0,
              }}
            >
              When I&apos;m not shipping code I&apos;m reading, exploring system
              design, or tinkering with side projects that scratch a creative
              itch.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.04, rotate: 1.5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              width: "112px",
              height: "144px",
              flexShrink: 0,
              display: isMobile ? "none" : undefined,
              borderRadius: "14px",
              overflow: "hidden",
              border: `2px solid ${C.indigoDark}44`,
              boxShadow: `0 8px 24px rgba(225,29,72,0.18)`,
            }}
          >
            <img
              src={AboutMeImg as unknown as string}
              alt={FULL_NAME}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </motion.div>
        </motion.div>

        {/* What I do highlights */}
        <motion.div variants={itemAnim}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: C.textMuted,
              margin: "0 0 12px",
            }}
          >
            What I bring
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            {HIGHLIGHTS.map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{
                  y: -3,
                  boxShadow: `0 8px 24px rgba(225,29,72,0.12)`,
                }}
                style={{
                  padding: "18px 14px",
                  borderRadius: "16px",
                  border: `1px solid ${C.border}`,
                  backgroundColor: C.card,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "24px", lineHeight: 1 }}>{icon}</span>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: C.textMuted,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact details */}
        <motion.div
          variants={itemAnim}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "10px",
            padding: "18px",
            borderRadius: "16px",
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          {[
            {
              Icon: Mail,
              text: EMAIL_ADDRESS,
              href: `mailto:${EMAIL_ADDRESS}`,
            },
            { Icon: MapPin, text: "Cebu, Philippines", href: undefined },
            {
              Icon: Github,
              text: "github.com/javiergenepaul",
              href: GITHUB_URL,
            },
            {
              Icon: Linkedin,
              text: "linkedin/gene-paul-mar-javier",
              href: LINKED_IN_URL,
            },
          ].map(({ Icon, text, href }) =>
            href ? (
              <motion.a
                key={text}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href === GITHUB_URL || href === LINKED_IN_URL
                    ? "nofollow noopener noreferrer"
                    : "noopener noreferrer"
                }
                whileHover={{ color: C.indigoDark, x: 2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: C.textMuted,
                  textDecoration: "none",
                }}
              >
                <Icon
                  size={13}
                  style={{ color: C.indigoDark, flexShrink: 0 }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {text}
                </span>
              </motion.a>
            ) : (
              <span
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: C.textMuted,
                }}
              >
                <Icon
                  size={13}
                  style={{ color: C.indigoDark, flexShrink: 0 }}
                />
                {text}
              </span>
            ),
          )}
        </motion.div>

        {/* Resume CTA */}
        <motion.button
          variants={itemAnim}
          onClick={() => setResumeOpen(true)}
          whileHover={{
            scale: 1.02,
            boxShadow: `0 12px 32px rgba(225,29,72,0.45)`,
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "15px 24px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            boxShadow: `0 8px 24px rgba(225,29,72,0.35)`,
            width: "100%",
          }}
        >
          <FileText size={16} />
          Build My Resume
        </motion.button>

        <ResumeModal
          open={resumeOpen}
          onClose={() => setResumeOpen(false)}
          year={2025}
          accentColor="#E11D48"
          defaultColor="scarlet"
        />
      </motion.div>
    </>
  );
}
