"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import { useProfile, useSocialUrl } from "@/lib/content/use-content";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { Label } from "../components/helpers";

export function ContactSection() {
  const C = useC();
  const isMobile = useIsMobile();
  const profile = useProfile();
  const githubUrl = useSocialUrl("github");
  const linkedInUrl = useSocialUrl("linkedIn");
  return (
    <>
      <Label text="10 — Contact" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Get In Touch<span style={{ color: C.indigoDark }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "28px",
          lineHeight: 1.6,
        }}
      >
        Have a project in mind or just want to say hi? My inbox is always open.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            Icon: Mail,
            label: "Email",
            value: profile.email,
            href: `mailto:${profile.email}`,
          },
          {
            Icon: MapPin,
            label: "Location",
            value: profile.location,
            href: undefined,
          },
          {
            Icon: Github,
            label: "GitHub",
            value: "github.com/javiergenepaul",
            href: githubUrl,
          },
          {
            Icon: Linkedin,
            label: "LinkedIn",
            value: "linkedin/gene-paul-mar-javier",
            href: linkedInUrl,
          },
        ].map(({ Icon, label, value, href }) => (
          <motion.div
            key={label}
            variants={itemAnim}
            whileHover={{ x: 4, boxShadow: `0 4px 20px rgba(225,29,72,0.1)` }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, backgroundColor: C.indigoDark }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                flexShrink: 0,
                backgroundColor: C.indigoLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={15} style={{ color: C.indigoDark }} />
            </motion.div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: C.textMuted,
                  margin: 0,
                }}
              >
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href === githubUrl || href === linkedInUrl
                      ? "nofollow noopener noreferrer"
                      : "noopener noreferrer"
                  }
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: C.indigoDark,
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {value}
                </a>
              ) : (
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {value}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.a
        href={`mailto:${profile.email}`}
        whileHover={{
          scale: 1.02,
          boxShadow: `0 12px 32px rgba(225,29,72,0.5)`,
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "13px 24px",
          borderRadius: "12px",
          textDecoration: "none",
          background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          boxShadow: `0 8px 24px rgba(225,29,72,0.4)`,
        }}
      >
        <Mail size={15} />
        Send me an email
      </motion.a>
    </>
  );
}
