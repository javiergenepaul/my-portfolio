"use client";

import React from "react";
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
