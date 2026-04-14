"use client";

import { useState } from "react";
import { ExternalLink, FolderGit2, Lock, Code2, Globe } from "lucide-react";
import { getProjects } from "@/config";
import { MAC_FONT } from "../constants";
import { useAurora } from "../use-aurora";
import { useIsMobile } from "../hooks";
import { hexRgb } from "../utils";

type ProjFilter = "all" | "web" | "open" | "confidential";

const FILTERS: { id: ProjFilter; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Projects", icon: <FolderGit2 size={13} /> },
  { id: "web", label: "Web Apps", icon: <Globe size={13} /> },
  { id: "open", label: "Open Source", icon: <Code2 size={13} /> },
  { id: "confidential", label: "Confidential", icon: <Lock size={13} /> },
];

export function ProjectsContent() {
  const A = useAurora();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<ProjFilter>("all");
  const all = getProjects().filter((p) => !p.hidden).slice(0, 20);

  const filtered =
    filter === "all"
      ? all
      : filter === "open"
        ? all.filter((p) => p.codeUrl)
        : filter === "confidential"
          ? all.filter((p) => p.type === "confidential")
          : all.filter((p) => p.type !== "confidential");

  const typeColor = (type: string) =>
    type === "confidential" ? "#FBBF24" : A.blue;

  const filterBar = FILTERS.map((f) => {
    const active = filter === f.id;
    return (
      <button
        key={f.id}
        onClick={() => setFilter(f.id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: isMobile ? "5px 12px" : "7px 10px",
          borderRadius: isMobile ? 20 : 7,
          border: isMobile ? `1.5px solid ${active ? A.blue : A.glassBorder}` : "none",
          background: active ? `rgba(${hexRgb(A.blue)},0.13)` : "transparent",
          color: active ? A.blue : A.textMid,
          fontSize: 12,
          fontWeight: active ? 600 : 400,
          cursor: "pointer",
          fontFamily: MAC_FONT,
          transition: "all 0.12s",
          whiteSpace: "nowrap",
          flexShrink: 0,
          ...(isMobile ? {} : { width: "100%", textAlign: "left" as const }),
        }}
      >
        <span style={{ opacity: active ? 1 : 0.6 }}>{f.icon}</span>
        {f.label}
      </button>
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flex: 1, minHeight: 0, overflow: "hidden", fontFamily: MAC_FONT }}>
      {/* Mobile: pill strip / Desktop: sidebar */}
      {isMobile ? (
        <div
          className="win26-scroll"
          style={{
            flexShrink: 0,
            overflowX: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.18) transparent",
            display: "flex",
            gap: 6,
            padding: "8px 12px",
            borderBottom: `1px solid ${A.glassBorder}`,
            background: A.sidebar,
            alignItems: "center",
          }}
        >
          {filterBar}
          <span style={{ fontSize: 11, color: A.textMuted, marginLeft: "auto", flexShrink: 0 }}>
            {filtered.length}
          </span>
        </div>
      ) : (
        <div
          style={{
            width: 160,
            flexShrink: 0,
            background: A.sidebar,
            borderRight: `1px solid ${A.glassBorder}`,
            padding: "14px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: A.textMuted,
              padding: "0 8px 8px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Filter
          </div>
          {filterBar}
          <div style={{ marginTop: "auto", padding: "10px 8px 0", fontSize: 11, color: A.textMuted }}>
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* List */}
      <div
        className="win26-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.18) transparent",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {filtered.map((p) => {
          const col = typeColor(p.type ?? "");
          return (
            <div
              key={p.projectId}
              style={{
                background: A.card,
                border: `1px solid ${A.cardBorder}`,
                borderRadius: 10,
                padding: "12px 14px 12px 16px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                transition: "border-color 0.15s, background 0.15s",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${hexRgb(col)},0.35)`;
                e.currentTarget.style.background = `rgba(${hexRgb(col)},0.04)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = A.cardBorder;
                e.currentTarget.style.background = A.card;
              }}
            >
              {/* Left accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  borderRadius: "10px 0 0 10px",
                  background: col,
                  opacity: 0.7,
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: `rgba(${hexRgb(col)},0.10)`,
                  border: `1px solid rgba(${hexRgb(col)},0.20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {p.type === "confidential" ? (
                  <Lock size={15} color={col} />
                ) : p.codeUrl ? (
                  <Code2 size={15} color={col} />
                ) : (
                  <Globe size={15} color={col} />
                )}
              </div>

              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: A.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.title}
                  </span>
                  {p.company && (
                    <span style={{ fontSize: 10, color: A.textMuted, flexShrink: 0 }}>
                      {p.company}
                    </span>
                  )}
                </div>

                {p.description && (
                  <p
                    style={{
                      margin: "0 0 7px",
                      fontSize: 11,
                      color: A.textMid,
                      lineHeight: 1.55,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.description}
                  </p>
                )}

                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                  {p.category.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      style={{
                        fontSize: 10,
                        background: `rgba(${hexRgb(col)},0.08)`,
                        border: `1px solid rgba(${hexRgb(col)},0.18)`,
                        borderRadius: 4,
                        padding: "1px 6px",
                        color: col,
                        fontWeight: 500,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                {p.previewUrl && (
                  <a
                    href={p.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 9px",
                      borderRadius: 6,
                      background: `rgba(${hexRgb(A.teal)},0.10)`,
                      border: `1px solid rgba(${hexRgb(A.teal)},0.22)`,
                      color: A.teal,
                      fontSize: 11,
                      fontWeight: 500,
                      textDecoration: "none",
                      fontFamily: MAC_FONT,
                    }}
                  >
                    <ExternalLink size={10} /> Live
                  </a>
                )}
                {p.codeUrl && (
                  <a
                    href={p.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 9px",
                      borderRadius: 6,
                      background: A.glass,
                      border: `1px solid ${A.glassBorder}`,
                      color: A.textMid,
                      fontSize: 11,
                      fontWeight: 500,
                      textDecoration: "none",
                      fontFamily: MAC_FONT,
                    }}
                  >
                    <Code2 size={10} /> Code
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
