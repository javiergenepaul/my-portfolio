"use client";

import React from "react";
import { translate } from "@/i18n";
import { useC } from "../context";

export function Separator() {
  const C = useC();
  return (
    <div
      style={{
        margin: "0 20px",
        height: "1px",
        background: `linear-gradient(to right, ${C.indigoDark}44, ${C.indigo}44)`,
      }}
    />
  );
}

export function Label({ text }: { text: string }) {
  const C = useC();
  return (
    <p
      style={{
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: C.textMuted,
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const C = useC();
  return (
    <p
      style={{
        fontSize: "13px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: C.textMuted,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

/**
 * Tech-stack chips for a DB-driven `stack` (list of stack name keys). Labels
 * resolve through the shared `services.stack.*` i18n namespace, matching the
 * 2024 experience/certificate cards. Caps at 6 with a "+N" overflow.
 */
export function StackChips({ stack }: { stack?: string[] }) {
  const C = useC();
  if (!stack || stack.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        marginTop: "10px",
      }}
    >
      {stack.slice(0, 6).map((name) => (
        <span
          key={name}
          style={{
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "99px",
            backgroundColor: `${C.border}66`,
            color: C.textMuted,
            border: `1px solid ${C.border}`,
          }}
        >
          {translate(`services.stack.${name}` as never) || name}
        </span>
      ))}
      {stack.length > 6 && (
        <span
          style={{
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "99px",
            color: C.textMuted,
          }}
        >
          +{stack.length - 6}
        </span>
      )}
    </div>
  );
}
