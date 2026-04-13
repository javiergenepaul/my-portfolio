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
}

const CMDS: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "  whoami           — personal info",
    "  ls               — list projects",
    "  cat skills.json  — print tech stack",
    "  open <app>       — open About/Projects/Skills/Resume",
    "  clear            — clear terminal",
    "",
  ],
  whoami: () => [
    `Name     : ${FULL_NAME}`,
    `Role     : ${JOB_TITLE}`,
    "Location : Cebu, Philippines",
    `Email    : ${EMAIL_ADDRESS}`,
    "GitHub   : github.com/javiergenepaul",
    "Status   : Open to opportunities",
    "",
  ],
  ls: () => {
    const p = getProjects()
      .filter((x) => !x.hidden)
      .slice(0, 8);
    return [
      "total " + p.length,
      ...p.map((x) => `drwxr-xr-x  ${x.projectId}/`),
      "",
    ];
  },
  "ls -la": () => CMDS.ls(),
  "cat skills.json": () => {
    const lines = ["{"];
    SKILL_CATEGORIES.forEach((c, i) => {
      const n = c.stacks
        .slice(0, 5)
        .map(
          (s) => `"${translate(`services.stack.${s.name}` as any) || s.name}"`,
        )
        .join(", ");
      lines.push(
        `  "${c.label}": [${n}${c.stacks.length > 5 ? ", ..." : ""}]${i < SKILL_CATEGORIES.length - 1 ? "," : ""}`,
      );
    });
    return [...lines, "}", ""];
  },
};

export function TerminalContent({ onOpen }: { onOpen: (id: WinId) => void }) {
  const A = useAurora();
  const [history, setHistory] = useState<TermEntry[]>([
    {
      output: [
        `Portfolio Terminal  ─  v2026.0.0`,
        `Connected as visitor. Hello! I'm ${FULL_NAME}.`,
        "Type 'help' for available commands.",
        "",
      ],
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
      if (t === "clear") {
        setHistory([]);
        return;
      }
      const appMap: Record<string, WinId> = {
        "open about": "about",
        "open projects": "projects",
        "open skills": "skills",
        "open contact": "contact",
        "open resume": "resume",
      };
      if (appMap[t]) {
        onOpen(appMap[t]);
        setHistory((h) => [
          ...h,
          { input: cmd, output: [`Opening ${appMap[t]}...`, ""] },
        ]);
        setCmdHist((h) => [cmd, ...h]);
        setHistIdx(-1);
        return;
      }
      const out = CMDS[t]
        ? CMDS[t]()
        : [
            `bash: ${t}: command not found`,
            "Type 'help' for available commands.",
            "",
          ];
      setHistory((h) => [...h, { input: cmd, output: out }]);
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
        height: "100%",
        background: A.termBg,
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
        fontSize: 13,
        cursor: "text",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 18px 8px",
          scrollbarWidth: "none",
        }}
      >
        {history.map((e, i) => (
          <div key={i}>
            {e.input !== undefined && (
              <div style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                <span style={{ color: A.green }}>➜</span>
                <span style={{ color: A.teal }}>~/portfolio</span>
                <span style={{ color: A.text }}>{e.input}</span>
              </div>
            )}
            {e.output.map((l, j) => (
              <div
                key={j}
                style={{
                  color: l.startsWith("bash:") ? "#F87171" : A.textMid,
                  lineHeight: 1.65,
                  whiteSpace: "pre",
                }}
              >
                {l || "\u00A0"}
              </div>
            ))}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginTop: 3,
          }}
        >
          <span style={{ color: A.green }}>➜</span>
          <span style={{ color: A.teal }}>~/portfolio</span>
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
              }
            }}
            autoFocus
            spellCheck={false}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: A.text,
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
