"use client";

import { useState } from "react";
import { Sun, Moon, Monitor, Globe, Clock, Check, Palette } from "lucide-react";
import { useSettingsStore } from "@/stores";
import { useLanguageStore } from "@/stores";
import type { Theme } from "@/stores";
import { useIsMobile } from "../hooks";
import { use2026Settings } from "../settings-store";
import type { TimeFormat } from "../settings-store";
import { translate, useLocaleRefresh } from "@/i18n";

// ── Types ─────────────────────────────────────────────────────────────────────

type PaneId = "appearance" | "language" | "datetime";

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
  const col = accent ?? "var(--a26-teal)";
  return (
    <button
      onClick={onClick}
      className="font-mac flex-1 flex flex-col items-center"
      style={{
        gap: 6,
        padding: "10px 8px",
        borderRadius: 9,
        cursor: "pointer",
        border: `1.5px solid ${active ? `color-mix(in srgb, ${col} 55%, transparent)` : "var(--a26-glass-border)"}`,
        background: active ? `color-mix(in srgb, ${col} 10%, transparent)` : "var(--a26-glass)",
        color: active ? col : "var(--a26-text-mid)",
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
      className="text-a26-muted"
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

// ── Appearance pane ───────────────────────────────────────────────────────────

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
      <div style={{ position: "absolute", top: 16, left: 8, right: 8, bottom: 8, display: "flex", gap: 5 }}>
        <div style={{ flex: 2, borderRadius: 4, background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.80)", border: `1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.10)"}` }} />
        <div style={{ flex: 1, borderRadius: 4, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.70)", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}` }} />
      </div>
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
  const { theme, setTheme } = useSettingsStore();

  const themes: { id: Theme; label: string; icon: React.ReactNode; dark: boolean | null }[] = [
    { id: "light", label: translate("settings.theme.mode.light"), icon: <Sun size={14} />, dark: false },
    { id: "dark", label: translate("settings.theme.mode.dark"), icon: <Moon size={14} />, dark: true },
    { id: "system", label: translate("settings.theme.mode.system"), icon: <Monitor size={14} />, dark: null },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <div>
        <SLabel>{translate("settings.theme.theme")}</SLabel>
        <div className="flex" style={{ gap: 10 }}>
          {themes.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="font-mac flex-1 flex flex-col items-stretch"
                style={{
                  padding: "10px 10px 8px",
                  borderRadius: 11,
                  border: `2px solid ${active ? "var(--a26-teal)" : "var(--a26-glass-border)"}`,
                  background: active ? "color-mix(in srgb, var(--a26-teal) 6%, transparent)" : "var(--a26-card)",
                  cursor: "pointer",
                  transition: "all 0.14s",
                }}
              >
                {t.dark === null ? (
                  <div style={{ width: "100%", height: 64, borderRadius: 7, overflow: "hidden", marginBottom: 8, position: "relative" }}>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: 5 }}>
                    <span style={{ color: active ? "var(--a26-teal)" : "var(--a26-text-muted)" }}>{t.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--a26-text)" : "var(--a26-text-mid)" }}>
                      {t.label}
                    </span>
                  </div>
                  {active && <Check size={12} color="var(--a26-teal)" strokeWidth={2.5} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SLabel>About</SLabel>
        <div
          className="bg-a26-card border border-a26-card-border flex items-start"
          style={{ borderRadius: 10, padding: "12px 14px", gap: 10 }}
        >
          <Palette size={14} color="var(--a26-teal)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p className="text-a26-mid" style={{ margin: 0, fontSize: 12, lineHeight: 1.65 }}>
            <em className="text-a26-teal" style={{ fontStyle: "normal", fontWeight: 600 }}>Auto</em> follows your system setting.
            This preference applies across all portfolio years including 2024, 2025, and 2026.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Language pane ─────────────────────────────────────────────────────────────

function LanguagePane() {
  const { language, setLanguage } = useLanguageStore();

  const LANGUAGES: { code: "en" | "ja" | "fil" | "ceb"; label: string; native: string; flag: string }[] = [
    { code: "en", label: translate("sidebar.languageOption.english"), native: "English", flag: "🇺🇸" },
    { code: "ja", label: translate("sidebar.languageOption.japanese"), native: "日本語", flag: "🇯🇵" },
    { code: "fil", label: translate("sidebar.languageOption.tagalog"), native: "Filipino", flag: "🇵🇭" },
    { code: "ceb", label: translate("sidebar.languageOption.cebuano"), native: "Cebuano", flag: "🇵🇭" },
  ];

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div>
        <SLabel>{translate("settings.lang.lang")}</SLabel>
        <div
          className="bg-a26-card border border-a26-card-border overflow-hidden"
          style={{ borderRadius: 12 }}
        >
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="font-mac flex items-center w-full text-left"
                style={{
                  gap: 12,
                  padding: "13px 16px",
                  border: "none",
                  borderBottom: i < LANGUAGES.length - 1 ? "1px solid var(--a26-glass-border)" : "none",
                  background: active ? "color-mix(in srgb, var(--a26-teal) 8%, transparent)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <div className="text-a26-text" style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>
                    {lang.label}
                  </div>
                  <div className="text-a26-muted" style={{ fontSize: 11, marginTop: 1 }}>
                    {lang.native}
                  </div>
                </div>
                {active && <Check size={15} color="var(--a26-teal)" strokeWidth={2.5} />}
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
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div>
        <SLabel>Clock Format</SLabel>
        <div
          className="bg-a26-card border border-a26-card-border"
          style={{ borderRadius: 12, padding: "18px 16px" }}
        >
          <p className="text-a26-mid" style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.6 }}>
            Controls the time displayed in the menu bar and mobile status bar.
          </p>
          <div className="flex" style={{ gap: 8 }}>
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
          className="bg-a26-card border border-a26-card-border flex items-center"
          style={{ borderRadius: 12, padding: "16px", gap: 14 }}
        >
          <Clock size={20} color="var(--a26-teal)" />
          <div>
            <div className="text-a26-muted" style={{ fontSize: 11, marginBottom: 3 }}>
              Menu bar clock will show
            </div>
            <div className="text-a26-text" style={{ fontSize: 15, fontWeight: 600, fontFamily: "monospace" }}>
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
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const [pane, setPane] = useState<PaneId>("appearance");

  const PANES: { id: PaneId; label: string; icon: React.ReactNode }[] = [
    { id: "appearance", label: translate("settings.nav.appearance"), icon: <Sun size={15} /> },
    { id: "language", label: translate("settings.lang.lang"), icon: <Globe size={15} /> },
    { id: "datetime", label: "Date & Time", icon: <Clock size={15} /> },
  ];

  const nav = PANES.map((p) => {
    const active = pane === p.id;
    return (
      <button
        key={p.id}
        onClick={() => setPane(p.id)}
        className="font-mac"
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 5 : 9,
          padding: isMobile ? "6px 12px" : "8px 10px",
          borderRadius: isMobile ? 20 : 7,
          border: isMobile
            ? `1.5px solid ${active ? "var(--a26-teal)" : "var(--a26-glass-border)"}`
            : "none",
          background: active ? "color-mix(in srgb, var(--a26-teal) 13%, transparent)" : "transparent",
          color: active ? "var(--a26-teal)" : "var(--a26-text-mid)",
          fontSize: isMobile ? 12 : 13,
          fontWeight: active ? 600 : 400,
          cursor: "pointer",
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
    <div
      className="font-mac flex-1 min-h-0 overflow-hidden flex"
      style={{ flexDirection: isMobile ? "column" : "row" }}
    >
      {isMobile ? (
        <div
          className="win26-scroll shrink-0 border-b bg-a26-sidebar border-a26-glass-border flex"
          style={{
            overflowX: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.18) transparent",
            gap: 6,
            padding: "10px 12px",
          }}
        >
          {nav}
        </div>
      ) : (
        <div
          className="win26-scroll shrink-0 bg-a26-sidebar border-r border-a26-glass-border flex flex-col overflow-y-auto"
          style={{
            width: 200,
            padding: "16px 8px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.18) transparent",
            gap: 2,
          }}
        >
          <div
            className="text-a26-muted"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0 8px 10px",
            }}
          >
            {translate("settings.settings")}
          </div>
          {nav}
        </div>
      )}

      {/* Content area */}
      <div
        className="win26-scroll flex-1 min-h-0 overflow-y-auto"
        style={{
          padding: isMobile ? "16px 14px" : "24px 28px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.18) transparent",
        }}
      >
        {!isMobile && (
          <h2
            className="text-a26-text"
            style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}
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
