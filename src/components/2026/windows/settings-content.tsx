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
      className="font-mac flex-1 flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-[9px] text-xs transition-all duration-140 cursor-pointer"
      style={{
        border: `1.5px solid ${active ? `color-mix(in srgb, ${col} 55%, transparent)` : "var(--a26-glass-border)"}`,
        background: active ? `color-mix(in srgb, ${col} 10%, transparent)` : "var(--a26-glass)",
        color: active ? col : "var(--a26-text-mid)",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-a26-muted text-[10px] font-bold tracking-[0.08em] uppercase mb-2.5">
      {children}
    </div>
  );
}

// ── Appearance pane ───────────────────────────────────────────────────────────

function ThemePreview({ dark }: { dark: boolean }) {
  return (
    <div
      className="w-full h-16 rounded-[7px] overflow-hidden mb-2 relative shrink-0"
      style={{ background: dark ? "#141414" : "#D8D8D8" }}
    >
      <div
        className="h-2.5 flex items-center px-1.5 gap-0.75"
        style={{ background: dark ? "rgba(40,40,40,0.95)" : "rgba(210,210,210,0.95)" }}
      >
        {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
          <div key={c} className="w-1 h-1 rounded-full" style={{ background: c }} />
        ))}
      </div>
      <div className="absolute top-4 left-2 right-2 bottom-2 flex gap-1.25">
        <div
          className="flex-2 rounded"
          style={{
            background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.80)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.10)"}`,
          }}
        />
        <div
          className="flex-1 rounded"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.70)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
          }}
        />
      </div>
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 h-2 w-12.5 rounded"
        style={{ background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.14)" }}
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
    <div className="flex flex-col gap-5">
      <div>
        <SLabel>{translate("settings.theme.theme")}</SLabel>
        <div className="flex gap-2.5">
          {themes.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="font-mac flex-1 flex flex-col items-stretch pt-2.5 px-2.5 pb-2 rounded-[11px] cursor-pointer transition-all duration-140"
                style={{
                  border: `2px solid ${active ? "var(--a26-teal)" : "var(--a26-glass-border)"}`,
                  background: active ? "color-mix(in srgb, var(--a26-teal) 6%, transparent)" : "var(--a26-card)",
                }}
              >
                {t.dark === null ? (
                  <div className="w-full h-16 rounded-[7px] overflow-hidden mb-2 relative">
                    <div
                      className="absolute inset-0 bg-[#F0F0F0]"
                      style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
                    >
                      <div className="h-2.5" style={{ background: "rgba(210,210,210,0.95)" }} />
                    </div>
                    <div
                      className="absolute inset-0 bg-[#141414]"
                      style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
                    >
                      <div className="h-2.5" style={{ background: "rgba(40,40,40,0.95)" }} />
                    </div>
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[80%]"
                      style={{ background: "rgba(128,128,128,0.4)" }}
                    />
                  </div>
                ) : (
                  <ThemePreview dark={t.dark} />
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.25">
                    <span style={{ color: active ? "var(--a26-teal)" : "var(--a26-text-muted)" }}>{t.icon}</span>
                    <span
                      className="text-xs"
                      style={{ fontWeight: active ? 600 : 400, color: active ? "var(--a26-text)" : "var(--a26-text-mid)" }}
                    >
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
        <div className="bg-a26-card border border-a26-card-border flex items-start rounded-[10px] py-3 px-3.5 gap-2.5">
          <Palette size={14} color="var(--a26-teal)" className="shrink-0 mt-px" />
          <p className="text-a26-mid m-0 text-xs leading-[1.65]">
            <em className="text-a26-teal not-italic font-semibold">Auto</em> follows your system setting.
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
    <div className="flex flex-col gap-6">
      <div>
        <SLabel>{translate("settings.lang.lang")}</SLabel>
        <div className="bg-a26-card border border-a26-card-border overflow-hidden rounded-xl">
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="font-mac flex items-center w-full text-left gap-3 py-3.25 px-4 border-none cursor-pointer transition-colors duration-120"
                style={{
                  borderBottom: i < LANGUAGES.length - 1 ? "1px solid var(--a26-glass-border)" : "none",
                  background: active ? "color-mix(in srgb, var(--a26-teal) 8%, transparent)" : "transparent",
                }}
              >
                <span className="text-[22px] leading-none">{lang.flag}</span>
                <div className="flex-1">
                  <div
                    className="text-a26-text text-[13px]"
                    style={{ fontWeight: active ? 600 : 400 }}
                  >
                    {lang.label}
                  </div>
                  <div className="text-a26-muted text-[11px] mt-px">{lang.native}</div>
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
    <div className="flex flex-col gap-6">
      <div>
        <SLabel>Clock Format</SLabel>
        <div className="bg-a26-card border border-a26-card-border rounded-xl py-4.5 px-4">
          <p className="text-a26-mid m-0 mb-3.5 text-[13px] leading-[1.6]">
            Controls the time displayed in the menu bar and mobile status bar.
          </p>
          <div className="flex gap-2">
            {formats.map((f) => (
              <OptionBtn
                key={f.id}
                active={timeFormat === f.id}
                onClick={() => setTimeFormat(f.id)}
              >
                <span className="text-base font-semibold font-mono">
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
        <div className="bg-a26-card border border-a26-card-border flex items-center rounded-xl p-4 gap-3.5">
          <Clock size={20} color="var(--a26-teal)" />
          <div>
            <div className="text-a26-muted text-[11px] mb-0.75">Menu bar clock will show</div>
            <div className="text-a26-text text-[15px] font-semibold font-mono">
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
        className="font-mac whitespace-nowrap shrink-0 cursor-pointer transition-all duration-120"
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
          ...(isMobile ? {} : { width: "100%", textAlign: "left" as const }),
        }}
      >
        <span style={{ opacity: active ? 1 : 0.7 }}>{p.icon}</span>
        {isMobile ? p.label.split(" ")[0] : p.label}
      </button>
    );
  });

  return (
    <div className={`font-mac flex-1 min-h-0 overflow-hidden flex ${isMobile ? "flex-col" : "flex-row"}`}>
      {isMobile ? (
        <div
          className="win26-scroll shrink-0 border-b bg-a26-sidebar border-a26-glass-border flex overflow-x-auto [scrollbar-width:thin] gap-1.5 py-2.5 px-3"
          style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
        >
          {nav}
        </div>
      ) : (
        <div
          className="win26-scroll shrink-0 bg-a26-sidebar border-r border-a26-glass-border flex flex-col overflow-y-auto w-50 py-4 px-2 [scrollbar-width:thin] gap-0.5"
          style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
        >
          <div className="text-a26-muted text-[10px] font-bold tracking-[0.08em] uppercase px-2 pb-2.5">
            {translate("settings.settings")}
          </div>
          {nav}
        </div>
      )}

      <div
        className={`win26-scroll flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin] ${isMobile ? "py-4 px-3.5" : "py-6 px-7"}`}
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        {!isMobile && (
          <h2 className="text-a26-text m-0 mb-5 text-[18px] font-bold tracking-[-0.01em]">
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
