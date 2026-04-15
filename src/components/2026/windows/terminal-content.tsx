"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  SKILL_CATEGORIES,
  getProjects,
} from "@/config";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores";
import { TriangleAlert } from "lucide-react";
import type { WinId } from "../constants";

interface TermEntry {
  input?: string;
  output: string[];
  type?: "error" | "success" | "info";
}

// ── Static commands ────────────────────────────────────────────────────────────

const CMDS: Record<string, () => string[]> = {
  help: () => [
    "┌─ Available Commands ────────────────────────────────┐",
    "│  gpm              personal info                     │",
    "│  ls               list recent projects              │",
    "│  cat skills.json  print full tech stack             │",
    "│  open <app>       about / books / testimonials /    │",
    "│                   projects / skills / contact /     │",
    "│                   resume / settings /               │",
    "│                   terminal / bomber                 │",
    "│  clear            clear terminal                    │",
    "│  exit             close terminal                    │",
    "└─────────────────────────────────────────────────────┘",
    "",
  ],
  gpm: () => [
    `  Name     ${FULL_NAME}`,
    `  Role     ${JOB_TITLE}`,
    "  Location Cebu, Philippines",
    `  Email    ${EMAIL_ADDRESS}`,
    "  GitHub   github.com/javiergenepaul",
    "  Status   ● Building cool stuff, one commit at a time",
    "",
  ],
  ls: () => {
    const p = getProjects()
      .filter((x) => !x.hidden)
      .slice(0, 8);
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
        .map(
          (s) => `"${translate(`services.stack.${s.name}` as any) || s.name}"`,
        )
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

// ── App name → WinId mapping ───────────────────────────────────────────────────

const APP_MAP: Record<string, WinId> = {
  about: "about",
  books: "books",
  testimonials: "testimonials",
  projects: "projects",
  skills: "skills",
  contact: "contact",
  resume: "resume",
  settings: "settings",
  terminal: "terminal",
  bomber: "bomber",
};

// ── All completable tokens (for Tab) ──────────────────────────────────────────

const ALL_COMPLETIONS = [
  ...Object.keys(CMDS),
  "clear",
  "exit",
  ...Object.keys(APP_MAP).map((a) => `open ${a}`),
];

function commonPrefix(strs: string[]): string {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TerminalContent({
  onOpen,
  onClose,
}: {
  onOpen: (id: WinId) => void;
  onClose: () => void;
}) {
  useLocaleRefresh();
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
        `  Connected as gpm  ·  ${FULL_NAME}`,
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

  const pushEntry = useCallback(
    (cmd: string, output: string[], type?: TermEntry["type"]) => {
      setHistory((h) => [...h, { input: cmd, output, type }]);
      setCmdHist((h) => [cmd, ...h]);
      setHistIdx(-1);
    },
    [],
  );

  const run = useCallback(
    (cmd: string) => {
      const t = cmd.trim().toLowerCase();
      if (t === "") return;

      if (t === "clear") {
        setHistory([]);
        return;
      }

      if (t === "exit" || t === "quit") {
        onClose();
        return;
      }

      if (t.startsWith("open")) {
        const appName = t.slice(4).trim();

        if (!appName) {
          pushEntry(
            cmd,
            [
              "  Usage: open <app>",
              `  Apps: ${Object.keys(APP_MAP).join(", ")}`,
              "",
            ],
            "error",
          );
          return;
        }

        const winId = APP_MAP[appName];
        if (winId) {
          onOpen(winId);
          pushEntry(cmd, [`  Opening ${winId}…`, ""], "success");
        } else {
          pushEntry(
            cmd,
            [
              `  open: no app named '${appName}'`,
              `  Available: ${Object.keys(APP_MAP).join(", ")}`,
              "",
            ],
            "error",
          );
        }
        return;
      }

      const fn = CMDS[t];
      const isKnown = Boolean(fn);
      const out = isKnown
        ? fn()
        : [
            `  bash: ${t}: command not found`,
            "  Type 'help' for available commands.",
            "",
          ];
      pushEntry(cmd, out, isKnown ? "info" : "error");
    },
    [onOpen, onClose, pushEntry],
  );

  const handleTab = useCallback(() => {
    const lower = input.toLowerCase();
    const matches = ALL_COMPLETIONS.filter((c) => c.startsWith(lower));

    if (!matches.length) return;

    if (matches.length === 1) {
      setInput(matches[0]);
      return;
    }

    const prefix = commonPrefix(matches);
    if (prefix.length > lower.length) {
      setInput(prefix);
      return;
    }

    setHistory((h) => [
      ...h,
      {
        input: input,
        output: ["  " + matches.join("   "), ""],
        type: "info",
      },
    ]);
  }, [input]);

  const language = useLanguageStore((s) => s.language);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="font-mac flex flex-col flex-1 min-h-0 overflow-hidden cursor-text text-[12.5px]"
      style={{ background: "#0D0D0D" }}
    >
      {/* English-only warning */}
      {language !== "en" && (
        <div
          className="shrink-0 flex items-center gap-2 px-4 py-2 text-[11px]"
          style={{
            background: "color-mix(in srgb, #F59E0B 12%, transparent)",
            borderBottom:
              "1px solid color-mix(in srgb, #F59E0B 30%, transparent)",
            color: "#FCD34D",
          }}
        >
          <TriangleAlert size={12} className="shrink-0" />
          {translate("win26.englishOnly")}
        </div>
      )}
      {/* Status bar */}
      <div
        className="shrink-0 flex items-center justify-between border-b py-1.25 px-4"
        style={{
          borderBottomColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-a26-green text-[11px]">● connected</span>
          <span
            className="text-[11px]"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            gpm@portfolio:~/
          </span>
        </div>
        <span
          className="text-[10px]"
          style={{ color: "rgba(255,255,255,0.20)" }}
        >
          bash 5.2.26 · {cmdHist.length} cmds
        </span>
      </div>

      {/* Output area */}
      <div
        className="win26-scroll flex-1 overflow-y-auto pt-3.5 px-4.5 pb-1.5 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        {history.map((e, i) => (
          <div key={i} className="mb-0.5">
            {e.input !== undefined && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-a26-green text-[13px]">❯</span>
                <span style={{ color: "#5BA3F5" }}>~/portfolio</span>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {e.input}
                </span>
              </div>
            )}
            {e.output.map((l, j) => (
              <div
                key={j}
                className="font-mono leading-[1.7] whitespace-pre"
                style={{
                  color:
                    l.startsWith("  bash:") ||
                    l.startsWith("bash:") ||
                    l.startsWith("  open:")
                      ? "#F87171"
                      : l.startsWith("  ●")
                        ? "var(--a26-green)"
                        : l.startsWith("  Opening") || l.startsWith("  Closing")
                          ? "var(--a26-teal)"
                          : l.startsWith("  ██") ||
                              l.startsWith("  ╚") ||
                              l.startsWith("  ║") ||
                              l.startsWith("  └") ||
                              l.startsWith("  ┌") ||
                              l.startsWith("  │")
                            ? "var(--a26-teal)"
                            : "rgba(255,255,255,0.62)",
                }}
              >
                {l || "\u00A0"}
              </div>
            ))}
          </div>
        ))}

        {/* Active prompt */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-a26-green text-[13px]">❯</span>
          <span style={{ color: "#5BA3F5" }}>~/portfolio</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHistIdx(-1);
            }}
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
                handleTab();
              }
            }}
            autoFocus
            spellCheck={false}
            className="flex-1 bg-transparent border-none outline-none font-[inherit] text-inherit caret-a26-teal"
            style={{ color: "rgba(255,255,255,0.90)" }}
            aria-label="Terminal input"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
