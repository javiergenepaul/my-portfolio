"use client";

import { useState } from "react";
import { FolderOpen, ExternalLink, FolderGit2, FileCode } from "lucide-react";
import { getProjects } from "@/config";
import { MAC_FONT } from "../constants";
import { useAurora } from "../use-aurora";
import { hexRgb } from "../utils";

type ProjFilter = "all" | "web" | "open" | "confidential";

export function ProjectsContent() {
  const A = useAurora();
  const [filter, setFilter] = useState<ProjFilter>("all");
  const all = getProjects()
    .filter((p) => !p.hidden)
    .slice(0, 15);
  const filtered =
    filter === "all"
      ? all
      : filter === "open"
        ? all.filter((p) => p.codeUrl)
        : filter === "confidential"
          ? all.filter((p) => p.type === "confidential")
          : all.filter((p) => p.type !== "confidential");

  const sidebar: { id: ProjFilter; label: string }[] = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "open", label: "Open Source" },
    { id: "confidential", label: "Confidential" },
  ];

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: MAC_FONT }}>
      <div
        style={{
          width: 155,
          flexShrink: 0,
          background: A.sidebar,
          borderRight: `1px solid ${A.glassBorder}`,
          padding: "12px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: A.textMuted,
            padding: "0 8px 6px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Locations
        </div>
        {sidebar.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              width: "100%",
              padding: "6px 9px",
              borderRadius: 6,
              border: "none",
              background:
                filter === s.id
                  ? `rgba(${hexRgb(A.blue)},0.14)`
                  : "transparent",
              color: filter === s.id ? A.blue : A.textMid,
              fontSize: 12,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: MAC_FONT,
            }}
          >
            <FolderOpen size={12} style={{ flexShrink: 0 }} /> {s.label}
          </button>
        ))}
        <div
          style={{
            marginTop: 12,
            fontSize: 10,
            fontWeight: 600,
            color: A.textMuted,
            padding: "0 8px 6px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Tags
        </div>
        {["React", "Spring Boot", "TypeScript"].map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "4px 9px",
              fontSize: 11,
              color: A.textMuted,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: A.teal,
                flexShrink: 0,
              }}
            />{" "}
            {t}
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 16px",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {filtered.map((p) => (
            <div
              key={p.projectId}
              style={{
                background: A.card,
                border: `1px solid ${A.cardBorder}`,
                borderRadius: 9,
                padding: "11px 13px",
                cursor: "default",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `rgba(${hexRgb(A.blue)},0.30)`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = A.cardBorder)
              }
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  marginBottom: 7,
                  background:
                    p.type === "confidential"
                      ? "rgba(251,191,36,0.12)"
                      : `rgba(${hexRgb(A.blue)},0.10)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.type === "confidential" ? (
                  <FileCode size={15} color="#FBBF24" />
                ) : (
                  <FolderGit2 size={15} color={A.blue} />
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: A.text,
                  lineHeight: 1.3,
                  marginBottom: 3,
                }}
              >
                {p.title}
              </div>
              {p.company && (
                <div
                  style={{ fontSize: 10, color: A.textMuted, marginBottom: 4 }}
                >
                  {p.company}
                </div>
              )}
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {p.category.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 9,
                      background: A.glass,
                      border: `1px solid ${A.glassBorder}`,
                      borderRadius: 4,
                      padding: "1px 4px",
                      color: A.textMid,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              {(p.previewUrl || p.codeUrl) && (
                <a
                  href={p.previewUrl || p.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    marginTop: 6,
                    fontSize: 10,
                    color: A.teal,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={9} /> View
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
