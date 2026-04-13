"use client";

import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import { EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import { A, MAC_FONT } from "../constants";
import { hexRgb } from "../utils";

export function ContactContent() {
  const links = [
    {
      label: "Email",
      value: EMAIL_ADDRESS,
      href: `mailto:${EMAIL_ADDRESS}`,
      icon: <Mail size={18} />,
      color: A.teal,
      desc: "Drop a message any time",
    },
    {
      label: "GitHub",
      value: "javiergenepaul",
      href: GITHUB_URL,
      icon: <Github size={18} />,
      color: A.text,
      desc: "View open-source work",
    },
    {
      label: "LinkedIn",
      value: "gene-paul-mar-javier",
      href: LINKED_IN_URL,
      icon: <Linkedin size={18} />,
      color: "#60A5FA",
      desc: "Connect professionally",
    },
  ];
  return (
    <div
      style={{
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: MAC_FONT,
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: A.text }}>
          Get in Touch
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: A.textMid }}>
          Open to new opportunities, collaborations, and interesting
          conversations.
        </p>
      </div>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: A.card,
            border: `1px solid ${A.cardBorder}`,
            borderRadius: 10,
            padding: "14px 18px",
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = `rgba(${hexRgb(l.color)},0.35)`)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = A.cardBorder)
          }
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: `rgba(${hexRgb(l.color)},0.10)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: l.color,
              flexShrink: 0,
            }}
          >
            {l.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: A.text }}>
              {l.label}
            </div>
            <div style={{ fontSize: 12, color: l.color, marginTop: 1 }}>
              {l.value}
            </div>
            <div style={{ fontSize: 11, color: A.textMuted, marginTop: 1 }}>
              {l.desc}
            </div>
          </div>
          <ExternalLink size={14} color={A.textMuted} />
        </a>
      ))}
    </div>
  );
}
