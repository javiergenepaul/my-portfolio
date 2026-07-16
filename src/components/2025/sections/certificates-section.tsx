"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { getCertificates } from "@/config";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { Label } from "../components/helpers";

export function CertificatesSection() {
  const C = useC();
  const isMobile = useIsMobile();
  // Newest certificates first.
  const certs = [...getCertificates()].sort(
    (a, b) => b.issuedDate.valueOf() - a.issuedDate.valueOf(),
  );

  return (
    <>
      <Label text="08 — Certificates" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Certifications<span style={{ color: C.amber }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "24px",
          lineHeight: 1.6,
        }}
      >
        Courses and credentials I&apos;ve earned to keep sharpening my craft.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "10px",
        }}
      >
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
            <motion.a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemAnim}
              whileHover={{
                y: -4,
                boxShadow: "0 10px 30px rgba(225,29,72,0.18)",
              }}
              style={{
                padding: "16px",
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                  padding: "5px",
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={cert.organizationAlt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: C.textDark,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {cert.title}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: C.indigo,
                    margin: "3px 0 0",
                  }}
                >
                  {cert.organization}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.textMuted,
                    margin: "4px 0 0",
                  }}
                >
                  {cert.issuedDate.format("MMM YYYY")}
                </p>
              </div>
              <ExternalLink
                size={13}
                style={{ color: C.textMuted, flexShrink: 0 }}
              />
            </motion.a>
          );
        })}
      </motion.div>
    </>
  );
}
