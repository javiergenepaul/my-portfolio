"use client";

import { useState } from "react";
import { ExternalLink, FolderGit2, Lock, Code2, Globe } from "lucide-react";
import { useIsMobile } from "../hooks";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToProjects } from "@/lib/content/portfolio";

type ProjFilter = "all" | "web" | "open" | "confidential";

export function ProjectsContent() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const locale = useLanguageStore((s) => s.language);
  const [filter, setFilter] = useState<ProjFilter>("all");

  const FILTERS: { id: ProjFilter; label: string; icon: React.ReactNode }[] = [
    {
      id: "all",
      label: translate("win26.projects.all"),
      icon: <FolderGit2 size={13} />,
    },
    {
      id: "web",
      label: translate("win26.projects.web"),
      icon: <Globe size={13} />,
    },
    {
      id: "open",
      label: translate("win26.projects.open"),
      icon: <Code2 size={13} />,
    },
    {
      id: "confidential",
      label: translate("win26.projects.confidential"),
      icon: <Lock size={13} />,
    },
  ];
  const all = rowsToProjects(
    useContent("projects"),
    useContent("skills"),
    locale,
  )
    .filter((p) => !p.hidden)
    .slice(0, 20);

  const filtered =
    filter === "all"
      ? all
      : filter === "open"
        ? all.filter((p) => p.codeUrl)
        : filter === "confidential"
          ? all.filter((p) => p.type === "confidential")
          : all.filter((p) => p.type !== "confidential");

  const typeColor = (type: string) =>
    type === "confidential" ? "#FBBF24" : "var(--a26-blue)";

  const filterBar = FILTERS.map((f) => {
    const active = filter === f.id;
    return (
      <button
        key={f.id}
        onClick={() => setFilter(f.id)}
        className="font-mac"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: isMobile ? "5px 12px" : "7px 10px",
          borderRadius: isMobile ? 20 : 7,
          border: isMobile
            ? `1.5px solid ${active ? "var(--a26-blue)" : "var(--a26-glass-border)"}`
            : "none",
          background: active
            ? "color-mix(in srgb, var(--a26-blue) 13%, transparent)"
            : "transparent",
          color: active ? "var(--a26-blue)" : "var(--a26-text-mid)",
          fontSize: 12,
          fontWeight: active ? 600 : 400,
          cursor: "pointer",
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
    <div
      className="font-mac flex-1 min-h-0 overflow-hidden flex"
      style={{ flexDirection: isMobile ? "column" : "row" }}
    >
      {/* Mobile: pill strip / Desktop: sidebar */}
      {isMobile ? (
        <div
          className="win26-scroll shrink-0 border-b bg-a26-sidebar border-a26-glass-border flex items-center gap-1.5 py-2 px-3 overflow-x-auto [scrollbar-width:thin]"
          style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
        >
          {filterBar}
          <span className="text-a26-muted shrink-0 text-[11px] ml-auto">
            {filtered.length}
          </span>
        </div>
      ) : (
        <div className="shrink-0 bg-a26-sidebar border-r border-a26-glass-border flex flex-col w-40 py-3.5 px-2 gap-0.5">
          <div className="text-a26-muted text-[10px] font-bold px-2 pb-2 tracking-[0.08em] uppercase">
            {translate("win26.projects.filter")}
          </div>
          {filterBar}
          <div className="text-a26-muted mt-auto pt-2.5 px-2 text-[11px]">
            {filtered.length}{" "}
            {filtered.length !== 1
              ? translate("win26.projects.projects")
              : translate("win26.projects.project")}
          </div>
        </div>
      )}

      {/* List */}
      <div
        className="win26-scroll flex-1 min-h-0 overflow-y-auto flex flex-col py-3 px-3.5 gap-2 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        {filtered.map((p) => {
          const col = typeColor(p.type ?? "");
          return (
            <div
              key={p.projectId}
              className="bg-a26-card border border-a26-card-border flex items-start shrink-0 relative overflow-hidden rounded-[10px] cursor-default transition-[border-color,background] duration-150"
              style={{ padding: "12px 14px 12px 16px", gap: 14 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `color-mix(in srgb, ${col} 35%, transparent)`;
                e.currentTarget.style.background = `color-mix(in srgb, ${col} 4%, transparent)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.background = "";
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.75 rounded-l-[10px] opacity-70"
                style={{ background: col }}
              />

              {/* Icon */}
              <div
                className="flex items-center justify-center shrink-0 w-9 h-9 rounded-[9px]"
                style={{
                  background: `color-mix(in srgb, ${col} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${col} 20%, transparent)`,
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
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-a26-text whitespace-nowrap overflow-hidden text-ellipsis text-[13px] font-semibold">
                    {p.title}
                  </span>
                  {p.company && (
                    <span className="text-a26-muted shrink-0 text-[10px]">
                      {p.company}
                    </span>
                  )}
                </div>

                {p.description && (
                  <p className="text-a26-mid mb-1.75 text-[11px] leading-[1.55] line-clamp-2">
                    {p.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1">
                  {p.category.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="text-[10px] rounded font-medium py-px px-1.5"
                      style={{
                        background: `color-mix(in srgb, ${col} 8%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${col} 18%, transparent)`,
                        color: col,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center shrink-0 gap-1.5">
                {p.previewUrl && (
                  <a
                    href={p.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mac flex items-center text-a26-teal gap-1 py-1 px-2.25 rounded-[6px] text-[11px] font-medium no-underline"
                    style={{
                      background:
                        "color-mix(in srgb, var(--a26-teal) 10%, transparent)",
                      border:
                        "1px solid color-mix(in srgb, var(--a26-teal) 22%, transparent)",
                    }}
                  >
                    <ExternalLink size={10} />{" "}
                    {translate("win26.projects.live")}
                  </a>
                )}
                {p.codeUrl && (
                  <a
                    href={p.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mac flex items-center bg-a26-glass border border-a26-glass-border text-a26-mid gap-1 py-1 px-2.25 rounded-[6px] text-[11px] font-medium no-underline"
                  >
                    <Code2 size={10} /> {translate("win26.projects.code")}
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
