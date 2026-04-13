"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Command, Monitor } from "lucide-react";
import { MAC_FONT, WIN_DEFS } from "../constants";
import { useAurora } from "../use-aurora";
import type { WinId, WinState } from "../constants";
import { useTime } from "../hooks";

// ── Types ─────────────────────────────────────────────────────────────────────

type MenuId = "file" | "view" | "go" | "window";

interface MenuBarProps {
  onCmdK: () => void;
  onOpenWin: (id: WinId) => void;
  onCloseAll: () => void;
  onMinimizeAll: () => void;
  onRestoreAll: () => void;
  wins: Record<WinId, WinState>;
}

// ── Dropdown item primitives ───────────────────────────────────────────────────

function Separator() {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(255,255,255,0.10)",
        margin: "4px 0",
      }}
    />
  );
}

function MenuItem({
  label,
  shortcut,
  checked,
  disabled,
  onClick,
}: {
  label: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const A = useAurora();
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "5px 12px 5px 26px",
        border: "none",
        background: hov && !disabled ? A.glass : "transparent",
        borderRadius: 5,
        color: disabled ? A.textMuted : A.text,
        fontSize: 13,
        cursor: disabled ? "default" : "pointer",
        fontFamily: MAC_FONT,
        textAlign: "left",
        gap: 0,
        position: "relative",
        whiteSpace: "nowrap",
      }}
    >
      {checked && (
        <span style={{ position: "absolute", left: 9, fontSize: 11, color: A.teal }}>
          ✓
        </span>
      )}
      <span style={{ flex: 1 }}>{label}</span>
      {shortcut && (
        <span style={{ fontSize: 12, color: A.textMuted, marginLeft: 20, fontFamily: MAC_FONT }}>
          {shortcut}
        </span>
      )}
    </button>
  );
}

// ── Dropdown panel ────────────────────────────────────────────────────────────

function Dropdown({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const A = useAurora();
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 2px)",
        left: 0,
        minWidth: 220,
        background: A.window,
        border: `1px solid ${A.windowBorder}`,
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.30)",
        backdropFilter: "blur(24px)",
        padding: "4px 6px",
        zIndex: 9999,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── MenuBar ───────────────────────────────────────────────────────────────────

export function MenuBar({
  onCmdK,
  onOpenWin,
  onCloseAll,
  onMinimizeAll,
  onRestoreAll,
  wins,
}: MenuBarProps) {
  const A = useAurora();
  const time = useTime();
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!activeMenu) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeMenu]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggle = (id: MenuId) =>
    setActiveMenu((prev) => (prev === id ? null : id));

  const act = (fn: () => void) => {
    setActiveMenu(null);
    fn();
  };

  const anyOpen = Object.values(wins).some((w) => w.open);
  const anyMinimized = Object.values(wins).some((w) => w.minimized);
  const isFullscreen = typeof document !== "undefined" && !!document.fullscreenElement;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        height: 28,
        background: A.menuBar,
        borderBottom: `1px solid ${A.menuBorder}`,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        userSelect: "none",
        fontFamily: MAC_FONT,
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, flex: 1 }}>
        {/* Apple-like logo */}
        <div
          style={{
            padding: "0 8px",
            height: 28,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 69 69" fill="none">
            <path
              d="M30.0798 25.1276V18C13.3577 18.89 10.27 45.55 31.11 47.33C43.33 47.33 48.51 34.72 44.27 26.09H31.18V33.49H38.85C38.99 37.33 35.15 41.37 29.6 40.34C20.28 38.08 21.79 26.02 30.08 25.13Z"
              fill={A.teal}
            />
            <path
              d="M31.11 18V24.78H45.02C48.86 30.68 49.15 47.44 31.11 48.43V55.83C46.94 55.83 62.29 36.78 48.86 18H31.11Z"
              fill={A.teal}
            />
          </svg>
        </div>

        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: A.text,
            padding: "0 8px",
          }}
        >
          Gene Paul
        </span>

        {/* ── File ── */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => toggle("file")}
            style={{
              height: 28,
              padding: "0 9px",
              background:
                activeMenu === "file"
                  ? "rgba(255,255,255,0.14)"
                  : "transparent",
              borderRadius: 4,
              border: "none",
              color: activeMenu === "file" ? A.text : A.textMid,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: MAC_FONT,
            }}
          >
            File
          </button>
          {activeMenu === "file" && (
            <Dropdown>
              <MenuItem
                label="New Terminal Window"
                shortcut="⌘T"
                onClick={() => act(() => onOpenWin("terminal"))}
              />
              <MenuItem
                label="Open Resume Builder"
                shortcut="⌘R"
                onClick={() => act(() => onOpenWin("resume"))}
              />
              <Separator />
              <MenuItem
                label="Close All Windows"
                disabled={!anyOpen}
                onClick={() => act(onCloseAll)}
              />
            </Dropdown>
          )}
        </div>

        {/* ── View ── */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => toggle("view")}
            style={{
              height: 28,
              padding: "0 9px",
              background:
                activeMenu === "view"
                  ? "rgba(255,255,255,0.14)"
                  : "transparent",
              borderRadius: 4,
              border: "none",
              color: activeMenu === "view" ? A.text : A.textMid,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: MAC_FONT,
            }}
          >
            View
          </button>
          {activeMenu === "view" && (
            <Dropdown>
              <MenuItem
                label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
                shortcut="⌃⌘F"
                onClick={() => act(toggleFullscreen)}
              />
              <Separator />
              <MenuItem
                label="Command Palette"
                shortcut="⌘K"
                onClick={() => act(onCmdK)}
              />
              <Separator />
              <MenuItem
                label="Restore All Windows"
                disabled={!anyMinimized}
                onClick={() => act(onRestoreAll)}
              />
            </Dropdown>
          )}
        </div>

        {/* ── Go ── */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => toggle("go")}
            style={{
              height: 28,
              padding: "0 9px",
              background:
                activeMenu === "go"
                  ? "rgba(255,255,255,0.14)"
                  : "transparent",
              borderRadius: 4,
              border: "none",
              color: activeMenu === "go" ? A.text : A.textMid,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: MAC_FONT,
            }}
          >
            Go
          </button>
          {activeMenu === "go" && (
            <Dropdown>
              {WIN_DEFS.map((def, i) => (
                <MenuItem
                  key={def.id}
                  label={def.title}
                  shortcut={`⌘${i + 1}`}
                  checked={wins[def.id].open && !wins[def.id].minimized}
                  onClick={() => act(() => onOpenWin(def.id))}
                />
              ))}
            </Dropdown>
          )}
        </div>

        {/* ── Window ── */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => toggle("window")}
            style={{
              height: 28,
              padding: "0 9px",
              background:
                activeMenu === "window"
                  ? "rgba(255,255,255,0.14)"
                  : "transparent",
              borderRadius: 4,
              border: "none",
              color: activeMenu === "window" ? A.text : A.textMid,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: MAC_FONT,
            }}
          >
            Window
          </button>
          {activeMenu === "window" && (
            <Dropdown>
              <MenuItem
                label="Minimize All"
                shortcut="⌘M"
                disabled={!anyOpen}
                onClick={() => act(onMinimizeAll)}
              />
              <MenuItem
                label="Restore All"
                disabled={!anyMinimized}
                onClick={() => act(onRestoreAll)}
              />
              <Separator />
              {WIN_DEFS.map((def) => (
                <MenuItem
                  key={def.id}
                  label={def.title}
                  checked={wins[def.id].open && !wins[def.id].minimized}
                  onClick={() =>
                    act(() =>
                      wins[def.id].open && !wins[def.id].minimized
                        ? undefined
                        : onOpenWin(def.id),
                    )
                  }
                />
              ))}
            </Dropdown>
          )}
        </div>
      </div>

      {/* Right side — spotlight + clock */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={onCmdK}
          style={{
            height: 20,
            padding: "0 7px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: A.glass,
            border: `1px solid ${A.glassBorder}`,
            borderRadius: 5,
            color: A.textMid,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: MAC_FONT,
          }}
          title="Command Palette (⌘K)"
          aria-label="Open command palette"
        >
          <Search size={10} />
          <Command size={9} />
          <span style={{ fontSize: 10 }}>K</span>
        </button>
        <button
          onClick={toggleFullscreen}
          style={{
            height: 20,
            width: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: A.glass,
            border: `1px solid ${A.glassBorder}`,
            borderRadius: 5,
            color: A.textMid,
            cursor: "pointer",
          }}
          title="Toggle Full Screen (⌃⌘F)"
          aria-label="Toggle full screen"
        >
          <Monitor size={10} />
        </button>
        <span style={{ fontSize: 12, color: A.text, fontWeight: 400 }}>
          {time}
        </span>
      </div>
    </div>
  );
}
