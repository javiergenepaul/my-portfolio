"use client";

import { useState } from "react";
import { Sun, Moon, Monitor, Globe, Clock, Check, Palette } from "lucide-react";
import { useSettingsStore } from "@/stores";
import { useLanguageStore } from "@/stores";
import type { Theme } from "@/stores";
import { MAC_FONT } from "../constants";
import { useAurora } from "../use-aurora";
import { useIsMobile } from "../hooks";
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
  const A = useAurora();
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
  const A = useAurora();
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

// Mini macOS desktop thumbnail
function ThemePreview({ dark }: { dark: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: 64,
        borderRadius: 7,
        overflow: "hidden",
        background: dark ? "#141414" : "#D8D8D8",
        marginBottom: 8,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Menu bar */}
      <div
        style={{
          height: 10,
          background: dark ? "rgba(40,40,40,0.95)" : "rgba(210,210,210,0.95)",
          display: "flex",
          alignItems: "center",
          padding: "0 6px",
          gap: 3,
        }}
      >
        {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 4, height: 4, borderRadius: "50%", background: c }} />
        ))}
      </div>
      {/* Windows */}
      <div style={{ position: "absolute", top: 16, left: 8, right: 8, bottom: 8, display: "flex", gap: 5 }}>
        <div style={{ flex: 2, borderRadius: 4, background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.80)", border: `1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.10)"}` }} />
        <div style={{ flex: 1, borderRadius: 4, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.70)", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}` }} />
      </div>
      {/* Dock */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: "50%",
          transform: "translateX(-50%)",
          height: 8,
          width: 50,
          borderRadius: 4,
          background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.14)",
        }}
      />
    </div>
  );
}

function AppearancePane() {
  const A = useAurora();
  const { theme, setTheme } = useSettingsStore();

  const themes: { id: Theme; label: string; icon: React.ReactNode; dark: boolean | null }[] = [
    { id: "light", label: "Light", icon: <Sun size={14} />, dark: false },
    { id: "dark", label: "Dark", icon: <Moon size={14} />, dark: true },
    { id: "system", label: "Auto", icon: <Monitor size={14} />, dark: null },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <SLabel>Theme</SLabel>
        <div style={{ display: "flex", gap: 10 }}>
          {themes.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  padding: "10px 10px 8px",
                  borderRadius: 11,
                  border: `2px solid ${active ? A.teal : A.glassBorder}`,
                  background: active ? `rgba(${hexRgb(A.teal)},0.06)` : A.card,
                  cursor: "pointer",
                  fontFamily: MAC_FONT,
                  transition: "all 0.14s",
                }}
              >
                {t.dark === null ? (
                  // Auto — split preview
                  <div
                    style={{
                      width: "100%",
                      height: 64,
                      borderRadius: 7,
                      overflow: "hidden",
                      marginBottom: 8,
                      position: "relative",
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)", background: "#F0F0F0" }}>
                      <div style={{ height: 10, background: "rgba(210,210,210,0.95)" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)", background: "#141414" }}>
                      <div style={{ height: 10, background: "rgba(40,40,40,0.95)" }} />
                    </div>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 1, height: "80%", background: "rgba(128,128,128,0.4)" }} />
                  </div>
                ) : (
                  <ThemePreview dark={t.dark} />
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: active ? A.teal : A.textMuted }}>{t.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? A.text : A.textMid }}>
                      {t.label}
                    </span>
                  </div>
                  {active && <Check size={12} color={A.teal} strokeWidth={2.5} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SLabel>About</SLabel>
        <div
          style={{
            background: A.card,
            border: `1px solid ${A.cardBorder}`,
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <Palette size={14} color={A.teal} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 12, color: A.textMid, lineHeight: 1.65 }}>
            <em style={{ color: A.teal, fontStyle: "normal", fontWeight: 600 }}>Auto</em> follows your system setting.
            This preference applies across all portfolio years including 2024, 2025, and 2026.
          </p>
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
  const A = useAurora();
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
  const A = useAurora();
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
  const A = useAurora();
  const isMobile = useIsMobile();
  const [pane, setPane] = useState<PaneId>("appearance");

  const nav = PANES.map((p) => {
    const active = pane === p.id;
    return (
      <button
        key={p.id}
        onClick={() => setPane(p.id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 5 : 9,
          padding: isMobile ? "6px 12px" : "8px 10px",
          borderRadius: isMobile ? 20 : 7,
          border: isMobile ? `1.5px solid ${active ? A.teal : A.glassBorder}` : "none",
          background: active ? `rgba(${hexRgb(A.teal)},0.13)` : "transparent",
          color: active ? A.teal : A.textMid,
          fontSize: isMobile ? 12 : 13,
          fontWeight: active ? 600 : 400,
          cursor: "pointer",
          fontFamily: MAC_FONT,
          transition: "all 0.12s",
          whiteSpace: "nowrap",
          flexShrink: 0,
          ...(isMobile ? {} : { width: "100%", textAlign: "left" as const }),
        }}
      >
        <span style={{ opacity: active ? 1 : 0.7 }}>{p.icon}</span>
        {isMobile ? p.label.split(" ")[0] : p.label}
      </button>
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flex: 1, minHeight: 0, overflow: "hidden", fontFamily: MAC_FONT }}>
      {/* Mobile: tab strip / Desktop: sidebar */}
      {isMobile ? (
        <div
          style={{
            flexShrink: 0,
            overflowX: "auto",
            scrollbarWidth: "none",
            display: "flex",
            gap: 6,
            padding: "10px 12px",
            borderBottom: `1px solid ${A.glassBorder}`,
            background: A.sidebar,
          }}
        >
          {nav}
        </div>
      ) : (
        <div
          style={{
            width: 200,
            flexShrink: 0,
            background: A.sidebar,
            borderRight: `1px solid ${A.glassBorder}`,
            padding: "16px 8px",
            overflowY: "auto",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            gap: 2,
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
          {nav}
        </div>
      )}

      {/* Content area */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: isMobile ? "16px 14px" : "24px 28px",
          scrollbarWidth: "none",
        }}
      >
        {!isMobile && (
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
        )}
        {pane === "appearance" && <AppearancePane />}
        {pane === "language" && <LanguagePane />}
        {pane === "datetime" && <DateTimePane />}
      </div>
    </div>
  );
}
