"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  SKILL_CATEGORIES,
  getProjects,
} from "@/config";
import { translate } from "@/i18n";
import { MAC_FONT } from "../constants";
import { useAurora } from "../use-aurora";
import type { WinId } from "../constants";

interface TermEntry {
  input?: string;
  output: string[];
  type?: "error" | "success" | "info";
}

const CMDS: Record<string, () => string[]> = {
  help: () => [
    "┌─ Available Commands ────────────────────────────────┐",
    "│  whoami           personal info                     │",
    "│  ls               list recent projects              │",
    "│  cat skills.json  print full tech stack             │",
    "│  open <app>       about / projects / skills /       │",
    "│                   contact / resume / settings       │",
    "│  clear            clear terminal                    │",
    "└─────────────────────────────────────────────────────┘",
    "",
  ],
  whoami: () => [
    `  Name     ${FULL_NAME}`,
    `  Role     ${JOB_TITLE}`,
    "  Location Cebu, Philippines",
    `  Email    ${EMAIL_ADDRESS}`,
    "  GitHub   github.com/javiergenepaul",
    "  Status   ● Open to opportunities",
    "",
  ],
  ls: () => {
    const p = getProjects().filter((x) => !x.hidden).slice(0, 8);
    return [
      `total ${p.length}`,
      ...p.map((x) => `  drwxr-xr-x  ${x.title ?? x.projectId}`),
      "",
    ];
  },
  "ls -la": () => CMDS.ls(),
  "cat skills.json": () => {
    const lines = ["{"];
    SKILL_CATEGORIES.forEach((c, i) => {
      const names = c.stacks
        .slice(0, 5)
        .map((s) => `"${translate(`services.stack.${s.name}` as any) || s.name}"`)
        .join(", ");
      lines.push(
        `  "${c.label}": [${names}${c.stacks.length > 5 ? ", ..." : ""}]${
          i < SKILL_CATEGORIES.length - 1 ? "," : ""
        }`,
      );
    });
    return [...lines, "}", ""];
  },
};

const OPEN_MAP: Record<string, WinId> = {
  "open about": "about",
  "open projects": "projects",
  "open skills": "skills",
  "open contact": "contact",
  "open resume": "resume",
  "open settings": "settings",
};

export function TerminalContent({ onOpen }: { onOpen: (id: WinId) => void }) {
  const A = useAurora();
  const [history, setHistory] = useState<TermEntry[]>([
    {
      output: [
        `  ██████╗  ██████╗ ███╗   ███╗`,
        `  ██╔════╝ ██╔══██╗████╗ ████║`,
        `  ██║  ███╗██████╔╝██╔████╔██║`,
        `  ██║   ██║██╔═══╝ ██║╚██╔╝██║`,
        `  ╚██████╔╝██║     ██║ ╚═╝ ██║`,
        `   ╚═════╝ ╚═╝     ╚═╝     ╚═╝`,
        "",
        `  Portfolio Terminal  v2026.0.0`,
        `  Connected as visitor  ·  ${FULL_NAME}`,
        `  Type 'help' for available commands`,
        "",
      ],
      type: "info",
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const run = useCallback(
    (cmd: string) => {
      const t = cmd.trim().toLowerCase();
      if (t === "") return;
      if (t === "clear") {
        setHistory([]);
        return;
      }
      if (OPEN_MAP[t]) {
        onOpen(OPEN_MAP[t]);
        setHistory((h) => [
          ...h,
          { input: cmd, output: [`  Opening ${OPEN_MAP[t]}…`, ""], type: "success" },
        ]);
        setCmdHist((h) => [cmd, ...h]);
        setHistIdx(-1);
        return;
      }
      const fn = CMDS[t];
      const isKnown = Boolean(fn);
      const out = isKnown
        ? fn()
        : [`  bash: ${t}: command not found`, "  Type 'help' for available commands.", ""];
      setHistory((h) => [
        ...h,
        { input: cmd, output: out, type: isKnown ? "info" : "error" },
      ]);
      setCmdHist((h) => [cmd, ...h]);
      setHistIdx(-1);
    },
    [onOpen],
  );

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        background: "#0D0D0D",
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
        fontSize: 12.5,
        cursor: "text",
      }}
    >
      {/* Status bar */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: A.green, fontSize: 11 }}>● connected</span>
          <span style={{ color: "rgba(255,255,255,0.30)", fontSize: 11 }}>visitor@portfolio:~/</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 10 }}>
          bash 5.2.26 · {cmdHist.length} cmds
        </span>
      </div>

      {/* Output area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 18px 6px",
          scrollbarWidth: "none",
        }}
      >
        {history.map((e, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            {e.input !== undefined && (
              <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                <span style={{ color: A.green, fontSize: 13 }}>❯</span>
                <span style={{ color: "#5BA3F5" }}>~/portfolio</span>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>{e.input}</span>
              </div>
            )}
            {e.output.map((l, j) => (
              <div
                key={j}
                style={{
                  color: l.startsWith("  bash:") || l.startsWith("bash:")
                    ? "#F87171"
                    : l.startsWith("  ●")
                      ? A.green
                      : l.startsWith("  Opening")
                        ? A.teal
                        : l.startsWith("  ██") || l.startsWith("  ╚") || l.startsWith("  ║") || l.startsWith("  └") || l.startsWith("  ┌") || l.startsWith("  │")
                          ? A.teal
                          : "rgba(255,255,255,0.62)",
                  lineHeight: 1.7,
                  whiteSpace: "pre",
                  fontFamily: "inherit",
                }}
              >
                {l || "\u00A0"}
              </div>
            ))}
          </div>
        ))}

        {/* Active prompt */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
          <span style={{ color: A.green, fontSize: 13 }}>❯</span>
          <span style={{ color: "#5BA3F5" }}>~/portfolio</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(input);
                setInput("");
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const n = Math.min(histIdx + 1, cmdHist.length - 1);
                setHistIdx(n);
                setInput(cmdHist[n] ?? "");
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = Math.max(histIdx - 1, -1);
                setHistIdx(n);
                setInput(n === -1 ? "" : (cmdHist[n] ?? ""));
              } else if (e.key === "Tab") {
                e.preventDefault();
                const completions = [
                  ...Object.keys(CMDS),
                  ...Object.keys(OPEN_MAP),
                  "clear",
                ].filter((c) => c.startsWith(input.toLowerCase()));
                if (completions.length === 1) setInput(completions[0]);
              }
            }}
            autoFocus
            spellCheck={false}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "rgba(255,255,255,0.90)",
              fontFamily: "inherit",
              fontSize: "inherit",
              caretColor: A.teal,
            }}
            aria-label="Terminal input"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
