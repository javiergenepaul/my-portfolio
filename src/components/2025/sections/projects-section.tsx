"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import { getProjects } from "@/config";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { makeTypeColors } from "../constants";
import { Label } from "../components/helpers";

export function ProjectsSection({
  projects,
}: {
  projects: ReturnType<typeof getProjects>;
}) {
  const C = useC();
  const isMobile = useIsMobile();
  const TYPE_COLORS = makeTypeColors(C);
  return (
    <>
      <Label text="04 — Projects" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 24px",
          color: C.textDark,
        }}
      >
        Projects<span style={{ color: C.indigoDark }}>.</span>
      </h2>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {projects.map((p) => {
          const tc = TYPE_COLORS[p.type] ?? TYPE_COLORS.personal;
          return (
            <motion.div
              key={p.projectId}
              variants={itemAnim}
              whileHover={{ x: 3, boxShadow: `0 6px 24px rgba(225,29,72,0.1)` }}
              style={{
                padding: "20px 22px",
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
                cursor: "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: C.textDark,
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </p>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "99px",
                        backgroundColor: tc.bg,
                        color: tc.color,
                        border: `1px solid ${tc.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.type}
                    </span>
                  </div>
                  {p.company && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: C.textMuted,
                        margin: "3px 0 0",
                      }}
                    >
                      {p.company}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  {p.previewUrl && (
                    <motion.a
                      href={p.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: C.indigoDark,
                        color: "#fff",
                      }}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: C.indigoLight,
                        color: C.indigoDark,
                        border: `1px solid rgba(225,29,72,0.2)`,
                        textDecoration: "none",
                      }}
                    >
                      <ExternalLink size={14} />
                    </motion.a>
                  )}
                  {p.codeUrl && (
                    <motion.a
                      href={p.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: C.sidebarHover,
                        color: C.indigo,
                      }}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: C.card,
                        color: C.textMuted,
                        border: `1px solid ${C.border}`,
                        textDecoration: "none",
                      }}
                    >
                      <Code2 size={14} />
                    </motion.a>
                  )}
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: C.textMuted,
                  margin: "0 0 12px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.description}
              </p>
              {p.stack && p.stack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {p.stack.slice(0, 6).map((s) => (
                    <span
                      key={s.name}
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        backgroundColor: `${C.border}66`,
                        color: C.textMuted,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                  {p.stack.length > 6 && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        color: C.textMuted,
                      }}
                    >
                      +{p.stack.length - 6}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}
