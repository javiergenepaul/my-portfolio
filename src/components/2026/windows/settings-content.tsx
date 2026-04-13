"use client";

import { useState } from "react";
import { Sun, Moon, Monitor, Globe, Clock, Check } from "lucide-react";
import { useSettingsStore } from "@/stores";
import { useLanguageStore } from "@/stores";
import type { Theme } from "@/stores";
import { A, MAC_FONT } from "../constants";
import { hexRgb } from "../utils";
import { use2026Settings } from "../settings-store";
import type { TimeFormat } from "../settings-store";

// ── Sidebar item ─────────────────────────────────────────────────────────────

type PaneId = "appearance" | "language" | "datetime";

const PANES: { id: PaneId; label: string; icon: React.ReactNode }[] = [
  { id: "appearance", label: "Appearance", icon: <Sun size={15} /> },
  { id: "language", label: "Language & Region", icon: <Globe size={15} /> },
  { id: "datetime", label: "Date & Time", icon: <Clock size={15} /> },
];

// ── Option button helper ──────────────────────────────────────────────────────

function OptionBtn({
  active,
  onClick,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: string;
}) {
  const col = accent ?? A.teal;
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "10px 8px",
        borderRadius: 9,
        cursor: "pointer",
        border: `1.5px solid ${active ? `rgba(${hexRgb(col)},0.55)` : A.glassBorder}`,
        background: active ? `rgba(${hexRgb(col)},0.10)` : A.glass,
        color: active ? col : A.textMid,
        fontFamily: MAC_FONT,
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        transition: "all 0.14s",
      }}
    >
      {children}
    </button>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: A.textMuted,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

// ── Appearance pane ───────────────────────────────────────────────────────────

function AppearancePane() {
  const { theme, setTheme } = useSettingsStore();

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: "light", label: "Light", icon: <Sun size={18} /> },
    { id: "dark", label: "Dark", icon: <Moon size={18} /> },
    { id: "system", label: "Auto", icon: <Monitor size={18} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <SLabel>Appearance</SLabel>
        <div
          style={{
            background: A.card,
            border: `1px solid ${A.cardBorder}`,
            borderRadius: 12,
            padding: "18px 16px",
          }}
        >
          <p style={{ margin: "0 0 14px", fontSize: 13, color: A.textMid, lineHeight: 1.6 }}>
            Choose how the portfolio looks. <em style={{ color: A.teal }}>Auto</em> follows
            your system setting. This preference is shared across all portfolio years.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {themes.map((t) => (
              <OptionBtn
                key={t.id}
                active={theme === t.id}
                onClick={() => setTheme(t.id)}
              >
                {t.icon}
                {t.label}
              </OptionBtn>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SLabel>Note</SLabel>
        <div
          style={{
            background: `rgba(${hexRgb(A.teal)},0.06)`,
            border: `1px solid rgba(${hexRgb(A.teal)},0.18)`,
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12,
            color: A.textMid,
            lineHeight: 1.7,
          }}
        >
          The 2026 desktop always uses the <strong style={{ color: A.teal }}>Aurora Dark</strong> theme
          regardless of this setting — the macOS-style chrome is designed exclusively for dark mode.
          The appearance setting applies to the 2024 and 2025 views.
        </div>
      </div>
    </div>
  );
}

// ── Language pane ─────────────────────────────────────────────────────────────

const LANGUAGES: { code: "en" | "ja" | "fil" | "ceb"; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇺🇸" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "fil", label: "Filipino", native: "Filipino", flag: "🇵🇭" },
  { code: "ceb", label: "Cebuano", native: "Cebuano", flag: "🇵🇭" },
];

function LanguagePane() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <SLabel>Preferred Language</SLabel>
        <div
          style={{
            background: A.card,
            border: `1px solid ${A.cardBorder}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "13px 16px",
                  border: "none",
                  borderBottom: i < LANGUAGES.length - 1 ? `1px solid ${A.glassBorder}` : "none",
                  background: active ? `rgba(${hexRgb(A.teal)},0.08)` : "transparent",
                  cursor: "pointer",
                  fontFamily: MAC_FONT,
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: A.text }}>
                    {lang.label}
                  </div>
                  <div style={{ fontSize: 11, color: A.textMuted, marginTop: 1 }}>
                    {lang.native}
                  </div>
                </div>
                {active && (
                  <Check size={15} color={A.teal} strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Date & Time pane ──────────────────────────────────────────────────────────

function DateTimePane() {
  const { timeFormat, setTimeFormat } = use2026Settings();

  const formats: { id: TimeFormat; label: string; example: string }[] = [
    { id: "12h", label: "12-Hour", example: "3:45 PM" },
    { id: "24h", label: "24-Hour", example: "15:45" },
  ];

  const now = new Date();
  const preview12 = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const preview24 = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <SLabel>Clock Format</SLabel>
        <div
          style={{
            background: A.card,
            border: `1px solid ${A.cardBorder}`,
            borderRadius: 12,
            padding: "18px 16px",
          }}
        >
          <p style={{ margin: "0 0 14px", fontSize: 13, color: A.textMid, lineHeight: 1.6 }}>
            Controls the time displayed in the menu bar and mobile status bar.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {formats.map((f) => (
              <OptionBtn
                key={f.id}
                active={timeFormat === f.id}
                onClick={() => setTimeFormat(f.id)}
              >
                <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "monospace" }}>
                  {f.id === "12h" ? preview12 : preview24}
                </span>
                {f.label}
              </OptionBtn>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SLabel>Preview</SLabel>
        <div
          style={{
            background: A.card,
            border: `1px solid ${A.cardBorder}`,
            borderRadius: 12,
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Clock size={20} color={A.teal} />
          <div>
            <div style={{ fontSize: 11, color: A.textMuted, marginBottom: 3 }}>
              Menu bar clock will show
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: A.text, fontFamily: "monospace" }}>
              {timeFormat === "12h" ? preview12 : preview24}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SettingsContent() {
  const [pane, setPane] = useState<PaneId>("appearance");

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: MAC_FONT }}>
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: A.sidebar,
          borderRight: `1px solid ${A.glassBorder}`,
          padding: "16px 8px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: A.textMuted,
            padding: "0 8px 10px",
          }}
        >
          Settings
        </div>
        {PANES.map((p) => {
          const active = pane === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPane(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                width: "100%",
                padding: "8px 10px",
                borderRadius: 7,
                border: "none",
                background: active ? `rgba(${hexRgb(A.teal)},0.13)` : "transparent",
                color: active ? A.teal : A.textMid,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: MAC_FONT,
                transition: "all 0.12s",
              }}
            >
              <span style={{ opacity: active ? 1 : 0.7 }}>{p.icon}</span>
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px",
          scrollbarWidth: "none",
        }}
      >
        {/* Pane heading */}
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: 18,
            fontWeight: 700,
            color: A.text,
            letterSpacing: "-0.01em",
          }}
        >
          {PANES.find((p) => p.id === pane)?.label}
        </h2>

        {pane === "appearance" && <AppearancePane />}
        {pane === "language" && <LanguagePane />}
        {pane === "datetime" && <DateTimePane />}
      </div>
    </div>
  );
}
